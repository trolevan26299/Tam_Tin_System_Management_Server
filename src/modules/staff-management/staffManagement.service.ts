import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { InjectModel } from '@app/transformers/model.transformer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  DetailStaffDto,
  ListStaffDto,
  QueryStaffDto,
  StaffMngDto,
} from './dto/staffManagement.dto';
import { StaffManagementModel } from './models/staffManagement.model';

@Injectable()
export class StaffManagerService {
  constructor(
    @InjectModel(StaffManagementModel)
    private readonly staffManagementModel: MongooseModel<StaffManagementModel>,
  ) {}

  public async createStaff(body: StaffMngDto): Promise<StaffManagementModel> {
    try {
      const newStaff = new this.staffManagementModel(body);
      return newStaff.save();
    } catch (error) {
      throw new HttpException(
        'An error occurred while updating the category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async updateStaff(
    id: string,
    body: StaffMngDto,
  ): Promise<StaffManagementModel> {
    try {
      const staffUpdate: any = { ...body };

      if (!staffUpdate.hasOwnProperty('time_keeping_id')) {
        staffUpdate.$unset = { ...staffUpdate.$unset, time_keeping_id: 1 };
      }

      if (!staffUpdate.hasOwnProperty('employee_turnover_id')) {
        staffUpdate.$unset = { ...staffUpdate.$unset, employee_turnover_id: 1 };
      }

      const objectId = new Types.ObjectId(id);
      const updatedStaff = await this.staffManagementModel.findOneAndUpdate(
        { _id: objectId },
        staffUpdate,
        { new: true },
      );

      return updatedStaff as StaffManagementModel;
    } catch (error) {
      console.error('Error updating staff:', error);
      throw new HttpException(
        'An error occurred while updating the staff',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getStaffById(id: string): Promise<DetailStaffDto> {
    try {
      const staff = await this.staffManagementModel.findById(id).exec();
      console.log('🚀 ~ StaffManagerService ~ getStaffById ~ staff:', staff);
      if (!staff) {
        throw new HttpException('Staff is not exists !', HttpStatus.NOT_FOUND);
      }

      return { data: staff };
    } catch (error) {
      throw new HttpException(
        'An error occurred while fetching the Staff',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getListStaff(query: QueryStaffDto): Promise<ListStaffDto> {
    try {
      const page = Number(query.page) + 1 || 1;
      const items_per_page = Number(query.items_per_page) || 10;
      const keyword = query.keyword || '';

      const skip = (page - 1) * items_per_page;
      const filter: any = {};

      if (keyword) {
        filter.$or = [{ name: { $regex: keyword, $options: 'i' } }];
      }

      const dataRes = await this.staffManagementModel
        .find(filter)
        .limit(items_per_page)
        .skip(skip)
        .exec();

      const totalCount = await this.staffManagementModel.countDocuments(filter);
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
        'An error occurred while fetching categories',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async deleteStaffById(id: string): Promise<StaffManagementModel> {
    try {
      const objectId = new Types.ObjectId(id);
      const deleteStaff = await this.staffManagementModel.findOneAndDelete({
        _id: objectId,
      });
      return deleteStaff as StaffManagementModel;
    } catch (error) {
      throw new HttpException(
        'An error occurred while delete the staff',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
