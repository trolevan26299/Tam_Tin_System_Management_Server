import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { InjectModel } from '@app/transformers/model.transformer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import moment from 'moment';
import { Types } from 'mongoose';
import { CustomerManagementModel } from '../customer-management/models/customerManagement.model';
import { DeviceManagementModel } from '../device-management/models/deviceManagement.model';
import {
  ItemDto,
  ListOrderDto,
  OrderMngDto,
  QueryOrderDto,
} from './dto/orderManagement.dto';
import { OrderManagementModel } from './models/orderManagement.model';

@Injectable()
export class OrderManagerService {
  constructor(
    @InjectModel(OrderManagementModel)
    private readonly orderManagementModel: MongooseModel<OrderManagementModel>,
    @InjectModel(DeviceManagementModel)
    private readonly deviceManagementModel: MongooseModel<DeviceManagementModel>,
    @InjectModel(CustomerManagementModel)
    private readonly customerManagementModel: MongooseModel<CustomerManagementModel>,
  ) {}

  public async createOrder(body: OrderMngDto): Promise<OrderManagementModel> {
    await this.updateDeviceInOrder(body.items);
    const newOrder = new this.orderManagementModel({
      ...body,
      regDt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    });

    return newOrder.save();
  }

  public async updateOrderById(
    id: string,
    body: OrderMngDto,
  ): Promise<OrderManagementModel | boolean> {
    const objectId = new Types.ObjectId(id);
    const orderById = await this.getOrderById(id);

    const updateDevice = await this.updateDeviceInOrder(
      body?.items,
      orderById?.items?.map((x) => ({
        device: x.device.id as string,
        details: x.details,
      })) as ItemDto[],
    );

    if (updateDevice) {
      const newOrder = await this.orderManagementModel.findOneAndUpdate(
        {
          _id: objectId,
        },
        { ...body, modDt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss') },
        { new: true },
      );
      return newOrder as OrderManagementModel;
    }
    return false;
  }

  public async getAllOrder(query: QueryOrderDto): Promise<ListOrderDto> {
    try {
      const page = Number(query.page) + 1 || 1;
      const items_per_page = Number(query.items_per_page) || 10;
      const keyword = query.keyword || '';
      const fromDate = query.from_date ? new Date(query.from_date) : null;
      const toDate = query.to_date ? new Date(query.to_date) : null;
      const customerId = query.customerId;

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

      if (customerId) {
        filter.customer = customerId;
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
        .sort({ regDt: -1 })
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

  public async getOrderById(id: string): Promise<any> {
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

  public async deleteOrderById(id: string): Promise<boolean> {
    try {
      const objectId = new Types.ObjectId(id);
      const deleteOrder = await this.orderManagementModel.findOneAndDelete({
        _id: objectId,
      });

      const oldItems = deleteOrder?.items.map((x) => ({
        device: x.device.id as string,
        details: x.details,
      })) as ItemDto[];

      const updateDevice = await this.updateDeviceInOrder(oldItems);

      return updateDevice;
    } catch (error) {
      throw new HttpException(
        'An error occurred while delete the order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async updateDeviceInOrder(
    newItems?: ItemDto[],
    oldItems?: ItemDto[],
    setInventoryOnly: boolean = false,
  ): Promise<boolean> {
    const newItemsMap = new Map();
    const oldItemsMap = new Map();

    (newItems || []).forEach((item) => {
      newItemsMap.set(item.device, new Set(item.details));
    });

    (oldItems || []).forEach((item) => {
      oldItemsMap.set(item.device, new Set(item.details));
    });

    try {
      if (!setInventoryOnly && newItems) {
        for (const item of newItems) {
          await this.deviceManagementModel.updateMany(
            {
              _id: item.device,
              'detail.id_device': { $in: item.details },
            },
            {
              $set: { 'detail.$[elem].status': 'sold' },
            },
            {
              arrayFilters: [{ 'elem.id_device': { $in: item.details } }],
            },
          );
        }
      }

      if (oldItems && oldItems.length > 0) {
        for (const oldItem of oldItems) {
          const newDetailsSet = newItemsMap.get(oldItem.device) || new Set();
          for (const detail of oldItem.details || []) {
            if (setInventoryOnly || !newDetailsSet.has(detail)) {
              await this.deviceManagementModel.updateOne(
                {
                  _id: oldItem.device,
                  'detail.id_device': detail,
                },
                {
                  $set: { 'detail.$.status': 'inventory' },
                },
              );
            }
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Error updating devices in order:', error);
      return false;
    }
  }
}
