import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { InjectModel } from '@app/transformers/model.transformer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import moment from 'moment';
import { Types } from 'mongoose';
import { CustomerManagementModel } from '../customer-management/models/customerManagement.model';
import { DeviceManagementModel } from '../device-management/models/deviceManagement.model';
import {
  ListOrderDto,
  OrderMngDto,
  QueryOrderDto,
} from './dto/orderManagement.dto';
import { OrderManagementModel } from './models/orderManagement.model';
import { DeviceListModel } from '../device-management/models/deviceList.model';

@Injectable()
export class OrderManagerService {
  constructor(
    @InjectModel(OrderManagementModel)
    private readonly orderManagementModel: MongooseModel<OrderManagementModel>,
    @InjectModel(DeviceManagementModel)
    private readonly deviceManagementModel: MongooseModel<DeviceManagementModel>,
    @InjectModel(DeviceListModel)
    private readonly deviceListModel: MongooseModel<DeviceListModel>,
    @InjectModel(CustomerManagementModel)
    private readonly customerManagementModel: MongooseModel<CustomerManagementModel>,
  ) {}

  public async createOrder(body: OrderMngDto): Promise<OrderManagementModel> {
    await this.createDeviceInOrder(body);
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
    try {
      const objectId = new Types.ObjectId(id);
      const orderById = await this.getOrderById(id);
      const customer = await this.customerManagementModel.findById(
        body.customer,
      );

      // Tạo map để so sánh thiết bị cũ và mới
      const oldDevicesMap = new Map();
      orderById.items.forEach((item) => {
        oldDevicesMap.set(item.device.id, {
          details: new Set(item.details),
          device: item.device,
        });
      });

      // Xử lý từng thiết bị trong danh sách mới
      for (const newItem of body.items) {
        const oldItem = oldDevicesMap.get(newItem.device);

        if (!oldItem) {
          // Trường hợp 1: Thêm sản phẩm mới
          await this.deviceManagementModel.updateMany(
            {
              _id: newItem.device,
              'detail.id_device': { $in: newItem.details },
            },
            {
              $set: { 'detail.$[elem].status': 'sold' },
            },
            {
              arrayFilters: [{ 'elem.id_device': { $in: newItem.details } }],
            },
          );

          const device = await this.deviceManagementModel.findById(
            newItem.device,
          );

          // Cập nhật device_list
          for (const deviceId of newItem.details || []) {
            await this.deviceListModel.findOneAndUpdate(
              { id_device: deviceId },
              {
                $set: {
                  status: 'Đã bán',
                  type_customer:
                    body.type_customer === 'bank' ? 'Ngân hàng' : 'Tư nhân',
                  name_customer: customer?.name || '',
                  warranty: newItem.warranty,
                  date_buy: moment(new Date()).format('DD-MM-YYYY'),
                  name: device?.name || '',
                },
              },
            );
          }
        } else {
          // Trường hợp 2: Cập nhật số lượng thiết bị đã có
          const oldDetails = oldItem.details;
          const newDetails = new Set(newItem.details);

          // Xử lý thiết bị tăng thêm
          const addedDetails = (newItem.details || []).filter(
            (detail) => !oldDetails.has(detail),
          );
          if (addedDetails.length > 0) {
            await this.deviceManagementModel.updateMany(
              {
                _id: newItem.device,
                'detail.id_device': { $in: addedDetails },
              },
              {
                $set: { 'detail.$[elem].status': 'sold' },
              },
              {
                arrayFilters: [{ 'elem.id_device': { $in: addedDetails } }],
              },
            );

            const device = await this.deviceManagementModel.findById(
              newItem.device,
            );

            // Cập nhật device_list cho thiết bị mới thêm
            for (const deviceId of addedDetails) {
              await this.deviceListModel.findOneAndUpdate(
                { id_device: deviceId },
                {
                  $set: {
                    status: 'Đã bán',
                    type_customer:
                      body.type_customer === 'bank' ? 'Ngân hàng' : 'Tư nhân',
                    name_customer: customer?.name || '',
                    warranty: newItem.warranty,
                    date_buy: moment(new Date()).format('DD-MM-YYYY'),
                    name: device?.name || '',
                  },
                },
              );
            }
          }

          // Xử lý thiết bị giảm đi
          const removedDetails = (oldDetails || []).filter(
            (detail) => !newDetails.has(detail),
          );
          if (removedDetails.length > 0) {
            await this.deviceManagementModel.updateMany(
              {
                _id: newItem.device,
                'detail.id_device': { $in: removedDetails },
              },
              {
                $set: { 'detail.$[elem].status': 'inventory' },
              },
              {
                arrayFilters: [{ 'elem.id_device': { $in: removedDetails } }],
              },
            );

            // Cập nhật device_list cho thiết bị bị xóa
            await this.deviceListModel.updateMany(
              { id_device: { $in: removedDetails } },
              {
                $set: {
                  status: 'inventory',
                },
                $unset: {
                  type_customer: '',
                  name_customer: '',
                  warranty: '',
                  date_buy: '',
                },
              },
            );
          }
        }
      }

      // Xử lý các thiết bị bị xóa hoàn toàn khỏi order
      const newDeviceIds = new Set(body.items.map((item) => item.device));
      const removedDevices = (Array.from(oldDevicesMap.keys()) || []).filter(
        (deviceId) => !newDeviceIds.has(deviceId),
      );

      for (const deviceId of removedDevices) {
        const oldItem = oldDevicesMap.get(deviceId);
        await this.deviceManagementModel.updateMany(
          {
            _id: deviceId,
            'detail.id_device': { $in: Array.from(oldItem.details) },
          },
          {
            $set: { 'detail.$[elem].status': 'inventory' },
          },
          {
            arrayFilters: [
              { 'elem.id_device': { $in: Array.from(oldItem.details) } },
            ],
          },
        );

        await this.deviceListModel.updateMany(
          { id_device: { $in: Array.from(oldItem.details) } },
          {
            $set: {
              status: 'inventory',
            },
            $unset: {
              type_customer: '',
              name_customer: '',
              warranty: '',
              date_buy: '',
            },
          },
        );
      }

      // Cập nhật order
      const newOrder = await this.orderManagementModel.findOneAndUpdate(
        { _id: objectId },
        {
          ...body,
          modDt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        },
        { new: true },
      );

      return newOrder as OrderManagementModel;
    } catch (error) {
      console.error('Error updating order:', error);
      throw new HttpException(
        'Đã xảy ra lỗi khi cập nhật đơn hàng',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
      const orderById = await this.getOrderById(id);

      // Lấy thông tin các thiết bị trong order
      for (const item of orderById.items) {
        const deviceId = item.device._id || item.device;
        const deviceDetails = item.details;

        // 2. Cập nhật status trong bảng devices
        await this.deviceManagementModel.updateMany(
          {
            _id: deviceId,
            'detail.id_device': { $in: deviceDetails },
          },
          {
            $set: { 'detail.$[elem].status': 'inventory' },
          },
          {
            arrayFilters: [{ 'elem.id_device': { $in: deviceDetails } }],
          },
        );

        // 3. Cập nhật thông tin trong bảng device_lists
        await this.deviceListModel.updateMany(
          {
            id_device: { $in: deviceDetails },
          },
          {
            $set: {
              status: 'inventory',
            },
            $unset: {
              type_customer: '',
              name_customer: '',
              warranty: '',
              date_buy: '',
            },
          },
        );
      }

      // 1. Xóa order
      await this.orderManagementModel.findOneAndDelete({
        _id: objectId,
      });

      return true;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw new HttpException(
        'Đã xảy ra lỗi khi xóa đơn hàng',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async createDeviceInOrder(body: OrderMngDto): Promise<boolean> {
    const newItemsMap = new Map();
    const oldItemsMap = new Map();
    const customer = await this.customerManagementModel.findById(body.customer);

    (body.items || []).forEach((item) => {
      newItemsMap.set(item.device, {
        details: new Set(item.details),
        warranty: item.warranty,
      });
    });

    (body.items || []).forEach((item) => {
      oldItemsMap.set(item.device, {
        details: new Set(item.details),
        warranty: item.warranty,
      });
    });

    try {
      if (body.items) {
        for (const item of body.items) {
          // Cập nhật trạng thái trong deviceManagement
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

          // Lấy thông tin device để lấy tên
          const device = await this.deviceManagementModel.findById(item.device);

          // Cập nhật device_list cho các thiết bị được bán
          for (const deviceId of item.details || []) {
            await this.deviceListModel.findOneAndUpdate(
              { id_device: deviceId },
              {
                $set: {
                  status: 'Đã bán',
                  type_customer:
                    body.type_customer === 'bank' ? 'Ngân hàng' : 'Tư nhân',
                  name_customer: customer?.name || '',
                  warranty: item.warranty,
                  date_buy: moment(new Date()).format('DD-MM-YYYY'),
                  name: device?.name || '',
                },
              },
            );
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
