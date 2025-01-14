import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { InjectModel } from '@app/transformers/model.transformer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import moment from 'moment';
import { Types } from 'mongoose';
import { TransactionLinhKienModel } from '../transaction-linh-kien/models/transactionLinhKien.model';
import {
  CreateLinhKienDTO,
  FilterLinhKienDto,
  LinhKienDto,
} from './dto/linhKien.dto';
import { LinhKienModel } from './models/linhKien.model';

@Injectable()
export class LinhKienService {
  constructor(
    @InjectModel(LinhKienModel)
    private readonly linhKienModel: MongooseModel<LinhKienModel>,
    @InjectModel(TransactionLinhKienModel)
    private readonly transactionModel: MongooseModel<TransactionLinhKienModel>,
  ) {}

  async getList(query: FilterLinhKienDto): Promise<LinhKienDto> {
    try {
      const items_per_page = query.items_per_page || 10;
      const page = Number(query.page) + 1 || 1;
      const keyword = query.keyword || '';
      const isAll =
        (typeof query.is_all === 'string' && query.is_all === 'true') ||
        query.is_all === true;

      const filter: any = {};
      if (keyword) {
        filter.name_linh_kien = { $regex: keyword, $options: 'i' };
      }

      let linhKienList;

      if (isAll) {
        linhKienList = await this.linhKienModel
          .find(filter)
          .sort({ create_date: -1 });
      } else {
        linhKienList = await this.linhKienModel
          .find(filter)
          .sort({ create_date: -1 })
          .skip((page - 1) * items_per_page)
          .limit(items_per_page);
      }

      const totalCount = await this.linhKienModel.countDocuments(filter);
      const lastPage = Math.ceil(totalCount / items_per_page);
      const nextPage = page + 1 > lastPage ? null : page + 1;
      const prevPage = page - 1 < 1 ? null : page - 1;

      const enhancedList = linhKienList.map((linhKien) => {
        return {
          ...linhKien.toObject(),
          data_ung: linhKien.data_ung || [],
        };
      });

      return {
        data: enhancedList,
        totalCount,
        currentPage: page,
        lastPage,
        nextPage,
        prevPage,
      };
    } catch (error) {
      throw new HttpException(
        'Lỗi khi lấy danh sách linh kiện',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createDto: CreateLinhKienDTO, req: any): Promise<any> {
    try {
      const userInfo = req.user_data?.data;

      const user_create = {
        username: userInfo?.username,
        id: userInfo?.id,
      };

      const newLinhKien = new this.linhKienModel({
        ...createDto,
        create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        user_create,
      });
      return await newLinhKien.save();
    } catch (error) {
      throw new HttpException(
        'Lỗi khi tạo linh kiện',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteLinhKien(id: string, passcode: number): Promise<any> {
    try {
      if (passcode !== 2699) {
        throw new HttpException(
          'Passcode không chính xác',
          HttpStatus.FORBIDDEN,
        );
      }

      const objectId = new Types.ObjectId(id);

      // Kiểm tra linh kiện có tồn tại không
      const existingLinhKien = await this.linhKienModel.findById(objectId);
      if (!existingLinhKien) {
        throw new HttpException(
          'Linh kiện không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }

      // Xóa tất cả giao dịch liên quan đến linh kiện
      await this.transactionModel.deleteMany({
        name_linh_kien: existingLinhKien.name_linh_kien,
      });

      // Thực hiện xóa linh kiện
      const deletedLinhKien =
        await this.linhKienModel.findByIdAndDelete(objectId);

      return {
        message: 'Xóa linh kiện và các giao dịch liên quan thành công',
        data: deletedLinhKien,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Lỗi khi xóa linh kiện',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
