import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { InjectModel } from '@app/transformers/model.transformer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
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
  ) {}

  public async createOrder(body: OrderMngDto): Promise<OrderManagementModel> {
    const newOrder = new this.orderManagementModel(body);
    return newOrder.save();
  }

  public async getAllOrder(query: QueryOrderDto): Promise<ListOrderDto> {
    try {
      const page = Number(query.page) + 1 || 1;
      const items_per_page = Number(query.items_per_page) || 10;
      const keyword = query.keyword || '';

      const skip = (page - 1) * items_per_page;
      const filter: any = {};

      if (keyword) {
        const orderIdRegex = /^[0-9a-fA-F]{24}$/;
        if (orderIdRegex.test(keyword)) {
          filter['_id'] = keyword;
        } else {
          filter['items.device.name'] = { $regex: keyword, $options: 'i' };
        }
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
        'An error occurred while fetching the customer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
