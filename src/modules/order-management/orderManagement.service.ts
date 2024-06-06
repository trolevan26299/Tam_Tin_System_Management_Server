import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { InjectModel } from '@app/transformers/model.transformer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  ItemDto,
  ListOrderDto,
  OrderMngDto,
  QueryOrderDto,
} from './dto/orderManagement.dto';
import { OrderManagementModel } from './models/orderManagement.model';
import { DeviceManagementModel } from '../device-management/models/deviceManagement.model';

@Injectable()
export class OrderManagerService {
  constructor(
    @InjectModel(OrderManagementModel)
    private readonly orderManagementModel: MongooseModel<OrderManagementModel>,
    @InjectModel(DeviceManagementModel)
    private readonly deviceManagementModel: MongooseModel<DeviceManagementModel>,
  ) {}

  public async createOrder(body: OrderMngDto): Promise<any> {
    const existingOrder = await this.orderManagementModel.findOne({
      'delivery.trackingNumber': body.delivery.trackingNumber,
    });

    if (existingOrder) {
      throw new HttpException(
        'Tracking number already exists',
        HttpStatus.CONFLICT,
      );
    }
    await this.updateDeviceInOrder(body?.items);
    const newOrder = new this.orderManagementModel(body);
    return newOrder.save();
  }

  public async getAllOrder(query: QueryOrderDto): Promise<ListOrderDto> {
    try {
      const page = Number(query.page) + 1 || 1;
      const items_per_page = Number(query.items_per_page) || 10;
      const keyword = query.keyword || '';
      const fromDate = query.from_date ? new Date(query.from_date) : null;
      const toDate = query.to_date ? new Date(query.to_date) : null;

      const skip = (page - 1) * items_per_page;
      const filter: any = {};

      if (keyword) {
        const orderIdRegex = /^[0-9a-fA-F]{24}$/;
        if (orderIdRegex.test(keyword)) {
          filter['_id'] = keyword;
        } else {
          const devices = await this.deviceManagementModel
            .find({
              name: { $regex: keyword, $options: 'i' },
            })
            .exec();

          const deviceIds = devices.map((device) => device._id);

          filter['items.device'] = { $in: deviceIds };
        }
      }

      if (fromDate || toDate) {
        const dateFilter: any = {};
        if (fromDate) {
          dateFilter.$gte = fromDate
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');
        }
        if (toDate) {
          dateFilter.$lte = toDate.toISOString().slice(0, 19).replace('T', ' ');
        }
        filter['delivery_date'] = dateFilter;
      }

      const dataRes = await this.orderManagementModel
        .find(filter)
        .populate('customer')
        .populate('items.device')
        .limit(items_per_page)
        .skip(skip)
        .exec();

      const totalCount = await this.orderManagementModel.countDocuments(filter);
      const lastPage = Math.ceil(totalCount / items_per_page);
      const nextPage = page + 1 > lastPage ? null : page + 1;
      const prevPage = page - 1 < 1 ? null : page - 1;
      return {
        data: dataRes,
        totalCount,
        currentPage: page,
        lastPage,
        nextPage,
        prevPage,
      };
    } catch (error) {
      throw new HttpException(
        'An error occurred while fetching orders',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getOrderById(id: string): Promise<OrderManagementModel> {
    try {
      const order = await this.orderManagementModel
        .findById(id)
        .populate('customer')
        .populate('items.device')
        .exec();

      if (!order) {
        throw new HttpException('order not exists !', HttpStatus.NOT_FOUND);
      }

      return order;
    } catch (error) {
      throw new HttpException(
        'An error occurred while fetching the order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async updateOrderById(id: string, body: OrderMngDto): Promise<any> {
    const objectId = new Types.ObjectId(id);
    const orderById = await this.getOrderById(id);

    await this.updateDeviceInOrder(
      body?.items,
      orderById?.items?.map((x) => ({
        device: x.device?.id as string,
        quantity: x?.quantity as number,
      })) as ItemDto[],
    );
    const newOrder = await this.orderManagementModel.findOneAndUpdate(
      {
        _id: objectId,
      },
      body,
      { new: true },
    );

    return newOrder as OrderManagementModel;
  }

  public async deleteOrderById(id: string): Promise<OrderManagementModel> {
    try {
      const objectId = new Types.ObjectId(id);
      const deleteOrder = await this.orderManagementModel.findOneAndDelete({
        _id: objectId,
      });

      return deleteOrder as OrderManagementModel;
    } catch (error) {
      throw new HttpException(
        'An error occurred while delete the order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async updateDeviceInOrder(
    newItems: ItemDto[],
    oldItems?: ItemDto[],
  ): Promise<any> {
    let updateSuccess;

    const updateDeviceStatus = async (
      deviceId: string,
      quantity: number,
      isNewItem: boolean,
    ) => {
      const device = await this.deviceManagementModel.findById(deviceId);
      if (!device) {
        console.error(`Device with ID ${deviceId} not found.`);
        return false;
      }

      const updatedStatus = device?.status?.map((statusItem) => {
        if (statusItem?.status === 'inventory') {
          return {
            status: statusItem?.status,
            quantity: isNewItem
              ? statusItem.quantity - quantity
              : statusItem.quantity + quantity,
          };
        } else if (statusItem?.status === 'sold') {
          return {
            status: statusItem?.status,
            quantity: isNewItem
              ? statusItem.quantity + quantity
              : statusItem.quantity - quantity,
          };
        }
        return statusItem;
      });

      const updatedDeviceData = { status: updatedStatus };

      const updateDevice = await this.deviceManagementModel.findOneAndUpdate(
        { _id: device._id },
        { $set: updatedDeviceData },
        { new: true },
      );

      return !!updateDevice;
    };

    const checkOrderQuantity = async (
      deviceId: string,
      orderQuantity: number,
    ) => {
      const device = await this.deviceManagementModel.findById(deviceId);
      const inventoryStatus = device?.status?.find(
        (statusItem) => statusItem?.status === 'inventory',
      );
      if (orderQuantity > Number(inventoryStatus?.quantity)) {
        throw new HttpException(
          `Order quantity (${orderQuantity}) exceeds inventory quantity (${inventoryStatus?.quantity}) of the device.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      return true;
    };

    if (oldItems) {
      // update order and device
      const allDeviceIds = new Set([
        ...oldItems.map((item) => item.device),
        ...newItems.map((item) => item.device),
      ]);

      for (const deviceId of allDeviceIds) {
        const oldItem = oldItems.find((item) => item.device === deviceId);
        const newItem = newItems.find((item) => item.device === deviceId);

        if (newItem?.device === oldItem?.device) {
          if (newItem?.quantity !== oldItem?.quantity) {
            const quantityDifference =
              Number(newItem?.quantity) - Number(oldItem?.quantity);
            const checkQuantityWhenOrder = await checkOrderQuantity(
              deviceId,
              Number(newItem?.quantity),
            );
            if (checkQuantityWhenOrder) {
              const success = await updateDeviceStatus(
                deviceId,
                Math.abs(quantityDifference),
                quantityDifference > 0,
              );
              if (success) updateSuccess = true;
            }
          } else {
            updateSuccess = true;
          }
        } else if (!newItem) {
          const success = await updateDeviceStatus(
            deviceId,
            Number(oldItem?.quantity),
            false,
          );
          if (success) updateSuccess = true;
        } else if (!oldItem) {
          const checkQuantityWhenOrder = await checkOrderQuantity(
            deviceId,
            Number(newItem?.quantity),
          );
          if (checkQuantityWhenOrder) {
            const success = await updateDeviceStatus(
              deviceId,
              Number(newItem?.quantity),
              true,
            );
            if (success) updateSuccess = true;
          }
        }
      }
    } else {
      // create order and update device
      for (const item of newItems) {
        if (item?.quantity > 0) {
          const checkQuantityWhenOrder = await checkOrderQuantity(
            item?.device,
            Number(item?.quantity),
          );
          if (checkQuantityWhenOrder) {
            const success = await updateDeviceStatus(
              item?.device,
              item?.quantity,
              true,
            );
            if (success) updateSuccess = true;
          }
        }
      }
    }

    return updateSuccess;
  }
}
