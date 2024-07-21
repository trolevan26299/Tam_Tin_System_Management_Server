import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { InjectModel } from '@app/transformers/model.transformer';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import {
  QueryStaffAccessoriesDto,
  StaffAccessoriesMngDto,
} from './dto/staffAccessoriesManagement.dto';
import { StaffAccessoriesManagementModel } from './models/staffAccessoriesManagement.model';
import moment from 'moment';
import { DeviceManagementModel } from '../device-management/models/deviceManagement.model';

@Injectable()
export class StaffAccessoriesManagerService {
  constructor(
    @InjectModel(StaffAccessoriesManagementModel)
    private readonly staffAccessoriesManagementModel: MongooseModel<StaffAccessoriesManagementModel>,
    @InjectModel(DeviceManagementModel)
    private readonly deviceManagementModel: MongooseModel<DeviceManagementModel>,
  ) {}

  public async createStaffAccessories(
    body: StaffAccessoriesMngDto,
  ): Promise<StaffAccessoriesManagementModel> {
    try {
      const newStaffAccessories = new this.staffAccessoriesManagementModel({
        ...body,
        regDt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      });

      return newStaffAccessories.save();
    } catch (error) {
      throw new HttpException(
        'An error occurred while updating the staff accessories',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getAllStaffAccessories(
    query: QueryStaffAccessoriesDto,
  ): Promise<any> {
    try {
      const page = Number(query.page) + 1 || 1;
      const items_per_page = Number(query.items_per_page) || 10;
      const keyword = query.keyword || '';
      const fromDate = query.from_date ? new Date(query.from_date) : null;
      const toDate = query.to_date ? new Date(query.to_date) : null;
      const staffId = query.staffId;

      const skip = (page - 1) * items_per_page;
      const filter: any = {};

      if (keyword) {
        const devices = await this.deviceManagementModel
          .find({
            name: { $regex: keyword, $options: 'i' },
          })
          .exec();

        const deviceIds = devices.map((device) => device._id);

        filter['device'] = { $in: deviceIds };
      }

      if (staffId) {
        filter.staff = staffId;
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
        filter['date'] = dateFilter;
      }

      const dataRes = await this.staffAccessoriesManagementModel
        .find(filter)
        .sort({ regDt: -1 })
        .populate('staff')
        .populate('device')
        .limit(items_per_page)
        .skip(skip)
        .exec();

      const totalCount =
        await this.staffAccessoriesManagementModel.countDocuments(filter);
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
        'An error occurred while fetching staff accessories',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
