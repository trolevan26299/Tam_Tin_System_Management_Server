import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { InjectModel } from '@app/transformers/model.transformer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import moment from 'moment';
import { Types } from 'mongoose';
import {
  DetailStaffDto,
  ListStaffDto,
  QueryStaffDto,
  StaffMngDto,
} from './dto/staffManagement.dto';
import { StaffManagementModel } from './models/staffManagement.model';
import { LinhKienModel } from '../linh-kien/models/linhKien.model';

@Injectable()
export class StaffManagerService {
  constructor(
    @InjectModel(StaffManagementModel)
    private readonly staffManagementModel: MongooseModel<StaffManagementModel>,
    @InjectModel(LinhKienModel)
    private readonly linhKienModel: MongooseModel<LinhKienModel>,
  ) {}

  public async createStaff(body: StaffMngDto): Promise<StaffManagementModel> {
    try {
      const newStaff = new this.staffManagementModel({
        ...body,
        regDt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      });

      return newStaff.save();
    } catch (error) {
      throw new HttpException(
        'An error occurred while updating the staff',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async updateStaff(
    id: string,
    body: StaffMngDto,
  ): Promise<StaffManagementModel> {
    try {
      const staffUpdate = {
        $set: {
          ...body,
          modDt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        },
      };

      const objectId = new Types.ObjectId(id);
      const updatedStaff = await this.staffManagementModel.findOneAndUpdate(
        { _id: objectId },
        staffUpdate,
        { new: true },
      );

      if (!updatedStaff) {
        throw new HttpException('Staff not found', HttpStatus.NOT_FOUND);
      }

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
      const is_all = query.is_all || false;

      const skip = (page - 1) * items_per_page;
      const filter: any = {};

      if (keyword) {
        filter.$or = [{ name: { $regex: keyword, $options: 'i' } }];
      }

      let dataRes;
      let totalCount;

      if (is_all) {
        dataRes = await this.staffManagementModel
          .find(filter)
          .sort({ regDt: -1 })
          .exec();
        totalCount = dataRes.length;
      } else {
        dataRes = await this.staffManagementModel
          .find(filter)
          .sort({ regDt: -1 })
          .limit(items_per_page)
          .skip(skip)
          .exec();
        totalCount = await this.staffManagementModel.countDocuments(filter);
      }

      // Lấy thông tin linh kiện cho mỗi nhân viên
      const staffWithLinhKien = await Promise.all(
        dataRes.map(async (staff) => {
          const linhKien = await this.linhKienModel
            .find({
              'data_ung.id': staff._id.toString(),
            })
            .exec();

          const linhKienUng = linhKien.map((item) => {
            const ungData = item?.data_ung?.find(
              (ung) => ung.id === staff._id.toString(),
            );
            return {
              name_linh_kien: item.name_linh_kien,
              total: ungData ? ungData.total : 0,
            };
          });

          return {
            ...staff.toObject(),
            linh_kien_ung: linhKienUng,
          };
        }),
      );

      return {
        data: staffWithLinhKien,
        totalCount,
        currentPage: page,
        lastPage: Math.ceil(totalCount / items_per_page),
        nextPage:
          page + 1 > Math.ceil(totalCount / items_per_page) ? null : page + 1,
        prevPage: page - 1 < 1 ? null : page - 1,
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
