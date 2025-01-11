import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LinhKienModel } from './models/linhKien.model';
import { CreateLinhKienDTO, FilterLinhKienDto } from './dto/linhKien.dto';
import moment from 'moment';
import { Types } from 'mongoose';
import { InjectModel } from '@app/transformers/model.transformer';
import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { TransactionLinhKienModel } from '../transaction-linh-kien/models/transactionLinhKien.model';

@Injectable()
export class LinhKienService {
  constructor(
    @InjectModel(LinhKienModel)
    private readonly linhKienModel: MongooseModel<LinhKienModel>,
    @InjectModel(TransactionLinhKienModel)
    private readonly transactionModel: MongooseModel<TransactionLinhKienModel>,
  ) {}

  async getList(query: FilterLinhKienDto): Promise<any> {
    try {
      const items_per_page = query.items_per_page || 10;
      const page = query.page || 1;
      const keyword = query.keyword || '';

      const filter: any = {};
      if (keyword) {
        filter.name_linh_kien = { $regex: keyword, $options: 'i' };
      }

      // Lấy danh sách linh kiện với phân trang
      const linhKienList = await this.linhKienModel
        .find(filter)
        .skip((page - 1) * items_per_page)
        .limit(items_per_page);

      // Chuyển đổi dữ liệu sang định dạng phù hợp
      const enhancedList = linhKienList.map((linhKien) => {
        return {
          ...linhKien.toObject(),
          data_ung: linhKien.data_ung || [], // Sử dụng data_ung có sẵn hoặc mảng rỗng nếu không có
        };
      });

      return enhancedList;
    } catch (error) {
      throw new HttpException(
        'Lỗi khi lấy danh sách linh kiện',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createDto: CreateLinhKienDTO): Promise<LinhKienModel> {
    try {
      const newLinhKien = new this.linhKienModel({
        ...createDto,
        create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
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
