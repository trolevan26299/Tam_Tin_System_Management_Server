import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { InjectModel } from '@app/transformers/model.transformer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderManagementModel } from '../order-management/models/orderManagement.model';
import { DeviceManagementModel } from '../device-management/models/deviceManagement.model';
import { CustomerManagementModel } from '../customer-management/models/customerManagement.model';
import { AnalyTicsDto, QueryAnalyTicsDto } from './dto/analyticsManagement.dto';

@Injectable()
export class AnalyticsManagementService {
  constructor(
    @InjectModel(OrderManagementModel)
    private readonly orderManagementModel: MongooseModel<OrderManagementModel>,
    @InjectModel(DeviceManagementModel)
    private readonly deviceManagementModel: MongooseModel<DeviceManagementModel>,
    @InjectModel(CustomerManagementModel)
    private readonly customerManagementModel: MongooseModel<CustomerManagementModel>,
  ) {}

  public async getAnalytics(query: QueryAnalyTicsDto): Promise<any> {
    try {
      const fromDate = query.from_date ? new Date(query.from_date) : null;
      const toDate = query.to_date ? new Date(query.to_date) : null;
      const orderCount = await this.getOrderCount(fromDate, toDate);

      console.log('🚀 orderCount:', orderCount);
    } catch (error) {
      throw new HttpException(
        'An error occurred while fetching AnalyTics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getOrderCount(
    fromDate: Date | null,
    toDate: Date | null,
  ): Promise<AnalyTicsDto> {
    const filterOrder: any = {};

    // function buildDateFilter(fromDate?: Date, toDate?: Date): any {
    //   const dateFilter: any = {};
    //   if (fromDate) {
    //     dateFilter.$gte = fromDate.toISOString().slice(0, 19).replace('T', ' ');
    //   }
    //   if (toDate) {
    //     dateFilter.$lte = toDate.toISOString().slice(0, 19).replace('T', ' ');
    //   }
    //   return dateFilter;
    // }

    // const filterOrder: any = {};
    // const filterCustomer: any = {};

    // if (fromDate || toDate) {
    //   const dateFilter = buildDateFilter(fromDate, toDate);
    //   if (Object.keys(dateFilter).length) {
    //     filterOrder['delivery_date'] = dateFilter;
    //     filterCustomer['regDt'] = dateFilter;
    //   }
    // }

    // const totalCountOrder = await this.orderManagementModel.countDocuments(filterOrder);
    // const totalCountCustomer = await this.customerManagementModel.countDocuments(filterCustomer);

    if (fromDate || toDate) {
      const dateFilter: any = {};
      if (fromDate) {
        dateFilter.$gte = fromDate.toISOString().slice(0, 19).replace('T', ' ');
      }
      if (toDate) {
        dateFilter.$lte = toDate.toISOString().slice(0, 19).replace('T', ' ');
      }
      filterOrder['delivery_date'] = dateFilter;
    }

    const filterCustomer: any = {};

    if (fromDate || toDate) {
      const dateFilter: any = {};
      if (fromDate) {
        dateFilter.$gte = fromDate.toISOString().slice(0, 19).replace('T', ' ');
      }
      if (toDate) {
        dateFilter.$lte = toDate.toISOString().slice(0, 19).replace('T', ' ');
      }
      filterCustomer['regDt'] = dateFilter;
    }

    const totalCountOrder =
      await this.orderManagementModel.countDocuments(filterOrder);

    const totalCountCustomer =
      await this.customerManagementModel.countDocuments(filterCustomer);

    const dataRes = await this.orderManagementModel
      .find(filterOrder)
      .populate('items.device');

    const revenue = dataRes.reduce(
      (total, item) => total + item?.totalAmount,
      0,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let totalCost = 0;
    dataRes.forEach((item) => {
      item.items.forEach((subItem) => {
        totalCost += (subItem.device as any).cost;
      });
    });

    const data = {
      orderCount: totalCountOrder,
      revenue,
      profit: totalCost,
    };

    return data as AnalyTicsDto;
  }
}
