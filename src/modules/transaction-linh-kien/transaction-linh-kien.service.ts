import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { TransactionLinhKienModel } from './models/transactionLinhKien.model';
import {
  CreateTransactionDTO,
  UpdateTransactionDTO,
  FilterTransactionDto,
} from './dto/transaction.dto';
import moment from 'moment';
import { InjectModel } from '@app/transformers/model.transformer';
import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { LinhKienModel } from '../linh-kien/models/linhKien.model';
import { LINH_KIEN_TYPE } from '@app/constants/linhKien.constant';

@Injectable()
export class TransactionLinhKienService {
  constructor(
    @InjectModel(TransactionLinhKienModel)
    private readonly transactionModel: MongooseModel<TransactionLinhKienModel>,
    @InjectModel(LinhKienModel)
    private readonly linhKienModel: MongooseModel<LinhKienModel>,
  ) {}

  async getList(query: FilterTransactionDto): Promise<any> {
    try {
      const items_per_page = query.items_per_page || 10;
      const page = Number(query.page) + 1 || 1;
      const keyword = query.keyword || '';
      const type = query.type;

      const filter: any = {};
      if (keyword) {
        filter.name_linh_kien = { $regex: keyword, $options: 'i' };
      }
      if (type) {
        filter.type = type;
      }

      const transactions = await this.transactionModel
        .find(filter)
        .skip((page - 1) * items_per_page)
        .limit(items_per_page)
        .sort({ date_update: -1 });

      const total = await this.transactionModel.countDocuments(filter);

      return {
        data: transactions,
        total,
        page,
        items_per_page,
      };
    } catch (error) {
      throw new HttpException(
        'Lỗi khi lấy danh sách giao dịch',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(
    createDto: CreateTransactionDTO,
  ): Promise<TransactionLinhKienModel> {
    try {
      const newTransaction = new this.transactionModel({
        ...createDto,
        date_update: moment().format('YYYY-MM-DD HH:mm:ss'),
        create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
      });

      // Lấy thông tin linh kiện
      const linhKien = await this.linhKienModel.findOne({
        name_linh_kien: createDto.name_linh_kien,
      });

      // Bổ sung hay xuất kho (+ Bổ sung, - Xuất kho)
      if (createDto.type === LINH_KIEN_TYPE.BỔ_SUNG) {
        if (!linhKien) {
          throw new HttpException(
            'Không tìm thấy linh kiện',
            HttpStatus.NOT_FOUND,
          );
        }

        // Cập nhật total trong bảng linh_kien
        await this.linhKienModel.findByIdAndUpdate(linhKien._id, {
          $inc: { total: createDto.total },
        });
      } else if (createDto.type === LINH_KIEN_TYPE.ỨNG) {
        // Xử lý khi nhân viên ứng linh kiện
        if (!linhKien) {
          throw new HttpException(
            'Không tìm thấy linh kiện',
            HttpStatus.NOT_FOUND,
          );
        }

        // Kiểm tra số lượng trong kho
        if (linhKien.total < Math.abs(createDto.total)) {
          throw new HttpException(
            `Số lượng trong kho chỉ còn ${linhKien.total}, không được vượt quá`,
            HttpStatus.BAD_REQUEST,
          );
        }

        // Kiểm tra xem nhân viên đã tồn tại trong data_ung chưa
        const existingEmployee = linhKien?.data_ung?.find(
          (item) => item.id === createDto.nhan_vien?.id,
        );

        if (existingEmployee) {
          // Nếu đã tồn tại thì cập nhật cả total của linh kiện và total ứng của nhân viên

          await this.linhKienModel.findOneAndUpdate(
            {
              _id: linhKien._id,
              'data_ung.id': createDto.nhan_vien?.id,
            },
            {
              $inc: {
                total: -Math.abs(createDto.total),
                'data_ung.$.total': Math.abs(createDto.total),
              },
            },
            { new: true }, // Thêm option để trả về document sau khi update
          );
        } else {
          // Nếu chưa tồn tại thì thêm mới vào data_ung và cập nhật total của linh kiện
          await this.linhKienModel.findByIdAndUpdate(linhKien._id, {
            $push: {
              data_ung: {
                id: createDto.nhan_vien?.id,
                name: createDto.nhan_vien?.name,
                total: Math.abs(createDto.total),
              },
            },
            $inc: {
              total: -Math.abs(createDto.total), // Giảm số lượng trong kho
            },
          });
        }
      } else if (createDto.type === LINH_KIEN_TYPE.SỬA_CHỮA) {
        if (!linhKien) {
          throw new HttpException(
            'Không tìm thấy linh kiện hoặc nhân viên chưa ứng linh kiện này',
            HttpStatus.NOT_FOUND,
          );
        }

        // Cập nhật data_ung
        await this.linhKienModel.findOneAndUpdate(
          {
            name_linh_kien: createDto.name_linh_kien,
            'data_ung.id': createDto.nhan_vien?.id,
          },
          {
            $inc: {
              'data_ung.$.total': -Math.abs(createDto.total),
            },
          },
        );
      }
      return await newTransaction.save();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Lỗi khi tạo giao dịch',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateDto: UpdateTransactionDTO,
  ): Promise<TransactionLinhKienModel> {
    if (updateDto.passcode !== 2699) {
      throw new HttpException('Passcode không đúng', HttpStatus.FORBIDDEN);
    }

    try {
      const { ...updateData } = updateDto;
      // Lấy thông tin giao dịch cũ
      const oldTransaction = await this.transactionModel.findById(id);
      if (!oldTransaction) {
        throw new HttpException(
          'Không tìm thấy giao dịch',
          HttpStatus.NOT_FOUND,
        );
      }

      // Xử lý cập nhật số lượng trong bảng linh_kien nếu type là "Bổ sung"
      if (oldTransaction.type === 'Bổ sung' && updateData.total !== undefined) {
        const linhKien = await this.linhKienModel.findOne({
          name: oldTransaction.name_linh_kien,
        });

        if (!linhKien) {
          throw new HttpException(
            'Không tìm thấy linh kiện',
            HttpStatus.NOT_FOUND,
          );
        }

        // Hoàn lại số lượng cũ
        await this.linhKienModel.findByIdAndUpdate(linhKien._id, {
          $inc: { total: -oldTransaction.total },
        });

        // Cập nhật số lượng mới
        await this.linhKienModel.findByIdAndUpdate(linhKien._id, {
          $inc: { total: updateData.total },
        });
      }

      const updatedTransaction = await this.transactionModel.findByIdAndUpdate(
        id,
        {
          ...updateData,
          date_update: moment().format('YYYY-MM-DD HH:mm:ss'),
        },
        { new: true },
      );

      return updatedTransaction as TransactionLinhKienModel;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Lỗi khi cập nhật giao dịch',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: string, passcode: number): Promise<any> {
    if (passcode !== 2699) {
      throw new HttpException('Passcode không đúng', HttpStatus.FORBIDDEN);
    }

    try {
      // Lấy thông tin giao dịch trước khi xóa
      const transaction = await this.transactionModel.findById(id);
      if (!transaction) {
        throw new HttpException(
          'Không tìm thấy giao dịch',
          HttpStatus.NOT_FOUND,
        );
      }

      const linhKien = await this.linhKienModel.findOne({
        name_linh_kien: transaction.name_linh_kien,
      });

      if (!linhKien) {
        throw new HttpException(
          'Không tìm thấy linh kiện',
          HttpStatus.NOT_FOUND,
        );
      }

      // Xử lý các trường hợp theo type
      switch (transaction.type) {
        case LINH_KIEN_TYPE.BỔ_SUNG:
          // Nếu số lượng âm, cộng lại. Nếu dương, trừ đi
          await this.linhKienModel.findByIdAndUpdate(linhKien._id, {
            $inc: { total: -transaction.total }, // Tự động xử lý cả số âm và dương
          });
          break;

        case LINH_KIEN_TYPE.ỨNG:
          // Kiểm tra số lượng ứng hiện tại của nhân viên
          const employee = linhKien.data_ung?.find(
            (item) => item.id === transaction.nhan_vien?.id,
          );

          if (employee && employee.total > 0) {
            // Chỉ cập nhật khi số lượng ứng > 0
            await this.linhKienModel.findOneAndUpdate(
              {
                _id: linhKien._id,
                'data_ung.id': transaction.nhan_vien?.id,
              },
              {
                $inc: {
                  total: Math.abs(transaction.total), // Cộng lại vào kho
                  'data_ung.$.total': -Math.abs(transaction.total), // Trừ khỏi data_ung
                },
              },
            );
          }
          break;

        case LINH_KIEN_TYPE.SỬA_CHỮA:
          // Cộng lại số lượng vào data_ung của nhân viên
          await this.linhKienModel.findOneAndUpdate(
            {
              _id: linhKien._id,
              'data_ung.id': transaction.nhan_vien?.id,
            },
            {
              $inc: {
                'data_ung.$.total': Math.abs(transaction.total),
              },
            },
          );
          break;
      }

      return await this.transactionModel.findByIdAndDelete(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Lỗi khi xóa giao dịch',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getById(id: string): Promise<any> {
    try {
      const transaction = await this.transactionModel.findById(id).exec();

      if (!transaction) {
        throw new HttpException(
          'transaction not exists !',
          HttpStatus.NOT_FOUND,
        );
      }

      return transaction;
    } catch (error) {
      throw new HttpException(
        'An error occurred while fetching the transaction',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
