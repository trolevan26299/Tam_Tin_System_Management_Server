import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { InjectModel } from '@app/transformers/model.transformer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderManagementModel } from '../order-management/models/orderManagement.model';
import { DeviceManagementModel } from '../device-management/models/deviceManagement.model';
import { CustomerManagementModel } from '../customer-management/models/customerManagement.model';
import { QueryAnalyTicsDto } from './dto/analyticsManagement.dto';

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
      const orderCount = await this.getOrderCount(
        query.from_date,
        query.to_date,
      );
    } catch (error) {
      throw new HttpException(
        'An error occurred while fetching AnalyTics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getOrderCount(fromDate: string, toDate: string): Promise<any> {
    const totalCount = await this.orderManagementModel
      .countDocuments({
        delivery_date: { $gte: new Date(fromDate), $lte: new Date(toDate) },
      })
      .exec();
    console.log('🚀 ~ AnalyticsManagementService ~ totalCount:', totalCount);
  }
}
