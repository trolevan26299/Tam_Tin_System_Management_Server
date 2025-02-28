import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CustomerManagementModel } from '../customer-management/models/customerManagement.model';
import { LinhKienModel } from '../linh-kien/models/linhKien.model';
import {
  CreateOrderLinhKienDto,
  UpdateOrderLinhKienDto,
} from './dto/orderLinhKien.dto';
import { OrderLinhKienModel } from './models/orderLinhKien.model';
import { InjectModel } from '@app/transformers/model.transformer';

@Injectable()
export class OrderLinhKienService {
  constructor(
    @InjectModel(OrderLinhKienModel)
    private readonly orderLinhKienModel: MongooseModel<OrderLinhKienModel>,
    @InjectModel(LinhKienModel)
    private readonly linhKienModel: MongooseModel<LinhKienModel>,
    @InjectModel(CustomerManagementModel)
    private readonly customerModel: MongooseModel<CustomerManagementModel>,
  ) {}

  async create(
    createOrderLinhKienDto: CreateOrderLinhKienDto,
  ): Promise<OrderLinhKienModel | null> {
    try {
      // Kiểm tra linh kiện tồn tại
      const linhKien = await this.linhKienModel.findById(
        createOrderLinhKienDto.id_linh_kien,
      );
      if (!linhKien) {
        throw new HttpException(
          'Linh kiện không tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Kiểm tra số lượng linh kiện có đủ không
      if (linhKien.total < createOrderLinhKienDto.so_luong) {
        throw new HttpException(
          'Số lượng linh kiện trong kho không đủ',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Kiểm tra khách hàng tồn tại
      const customer = await this.customerModel.findById(
        createOrderLinhKienDto.id_khach_hang,
      );
      if (!customer) {
        throw new HttpException(
          'Khách hàng không tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      const createdOrder = new this.orderLinhKienModel({
        ...createOrderLinhKienDto,
        ngay_tao: new Date().toISOString(),
      });

      const savedOrder = await createdOrder.save();

      // Cập nhật số lượng linh kiện trong kho (trừ đi số lượng đã bán)
      await this.linhKienModel.findByIdAndUpdate(
        createOrderLinhKienDto.id_linh_kien,
        { $inc: { total: -createOrderLinhKienDto.so_luong } },
      );

      // Trả về đơn hàng với thông tin đầy đủ
      const order = await this.findOne(savedOrder._id.toString());
      if (!order) {
        throw new HttpException(
          'Không thể tìm thấy đơn hàng sau khi tạo',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return order;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Lỗi khi tạo đơn hàng',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(query: any): Promise<any> {
    try {
      const page = Number(query.page) + 1 || 1;
      const items_per_page = Number(query.items_per_page) || 10;
      const keyword = query.keyword || '';
      const from_date = query.from_date || '';
      const to_date = query.to_date || '';
      const id_khach_hang = query.id_khach_hang || '';
      const is_all = query.is_all || false;

      const skip = (page - 1) * items_per_page;
      const filter: any = {};

      // Tìm kiếm theo keyword (tên linh kiện)
      if (keyword) {
        // Tìm các linh kiện có tên chứa keyword
        const linhKiens = await this.linhKienModel
          .find({ name_linh_kien: { $regex: keyword, $options: 'i' } })
          .exec();

        const linhKienIds = linhKiens.map((lk) => lk._id);

        if (linhKienIds.length > 0) {
          filter.id_linh_kien = { $in: linhKienIds };
        } else {
          // Nếu không tìm thấy linh kiện nào, trả về kết quả rỗng
          return {
            data: [],
            totalCount: 0,
            currentPage: page,
            lastPage: 0,
            nextPage: null,
            prevPage: null,
          };
        }
      }

      // Lọc theo thời gian
      if (from_date || to_date) {
        filter.ngay_tao = {};
        if (from_date) {
          filter.ngay_tao.$gte = from_date;
        }
        if (to_date) {
          filter.ngay_tao.$lte = to_date;
        }
      }

      // Lọc theo khách hàng
      if (id_khach_hang) {
        filter.id_khach_hang = id_khach_hang;
      }

      let dataRes;
      let totalCount;

      if (is_all) {
        dataRes = await this.orderLinhKienModel
          .find(filter)
          .sort({ ngay_tao: -1 })
          .populate('id_linh_kien')
          .populate('id_khach_hang', '_id name')
          .exec();
        totalCount = dataRes.length;
      } else {
        dataRes = await this.orderLinhKienModel
          .find(filter)
          .sort({ ngay_tao: -1 })
          .limit(items_per_page)
          .skip(skip)
          .populate('id_linh_kien')
          .populate('id_khach_hang', '_id name')
          .exec();
        totalCount = await this.orderLinhKienModel.countDocuments(filter);
      }

      return {
        data: dataRes,
        totalCount,
        currentPage: page,
        lastPage: Math.ceil(totalCount / items_per_page),
        nextPage:
          page + 1 > Math.ceil(totalCount / items_per_page) ? null : page + 1,
        prevPage: page - 1 < 1 ? null : page - 1,
      };
    } catch (error) {
      throw new HttpException(
        'Lỗi khi lấy danh sách đơn hàng',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<OrderLinhKienModel | null> {
    try {
      const order = await this.orderLinhKienModel
        .findById(id)
        .populate('id_linh_kien')
        .populate('id_khach_hang', '_id name')
        .exec();

      if (!order) {
        throw new HttpException(
          'Không tìm thấy đơn hàng',
          HttpStatus.NOT_FOUND,
        );
      }

      return order;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Lỗi khi lấy thông tin đơn hàng',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateOrderLinhKienDto: UpdateOrderLinhKienDto,
  ): Promise<OrderLinhKienModel | null> {
    try {
      // Kiểm tra đơn hàng tồn tại
      const existingOrder = await this.orderLinhKienModel.findById(id);
      if (!existingOrder) {
        throw new HttpException('Đơn hàng không tồn tại', HttpStatus.NOT_FOUND);
      }

      // Xử lý cập nhật số lượng linh kiện nếu có thay đổi số lượng
      if (
        updateOrderLinhKienDto.so_luong !== undefined &&
        updateOrderLinhKienDto.so_luong !== existingOrder.so_luong
      ) {
        // Lấy ID linh kiện (từ DTO nếu được cập nhật, nếu không thì lấy từ đơn hàng hiện tại)
        const linhKienId =
          updateOrderLinhKienDto.id_linh_kien || existingOrder.id_linh_kien;

        // Tính toán sự chênh lệch số lượng
        const soLuongDifference =
          existingOrder.so_luong - updateOrderLinhKienDto.so_luong;

        // Kiểm tra linh kiện tồn tại
        const linhKien = await this.linhKienModel.findById(linhKienId);
        if (!linhKien) {
          throw new HttpException(
            'Linh kiện không tồn tại',
            HttpStatus.BAD_REQUEST,
          );
        }

        // Nếu số lượng mới lớn hơn số lượng cũ, kiểm tra xem kho có đủ không
        if (
          soLuongDifference < 0 &&
          linhKien.total < Math.abs(soLuongDifference)
        ) {
          throw new HttpException(
            'Số lượng linh kiện trong kho không đủ',
            HttpStatus.BAD_REQUEST,
          );
        }

        // Cập nhật số lượng linh kiện trong kho
        await this.linhKienModel.findByIdAndUpdate(linhKienId, {
          $inc: { total: soLuongDifference },
        });
      } else if (
        updateOrderLinhKienDto.id_linh_kien &&
        updateOrderLinhKienDto.id_linh_kien.toString() !==
          existingOrder.id_linh_kien.toString()
      ) {
        // Nếu thay đổi linh kiện nhưng giữ nguyên số lượng

        // Hoàn trả số lượng cho linh kiện cũ
        await this.linhKienModel.findByIdAndUpdate(existingOrder.id_linh_kien, {
          $inc: { total: existingOrder.so_luong },
        });

        // Kiểm tra linh kiện mới
        const newLinhKien = await this.linhKienModel.findById(
          updateOrderLinhKienDto.id_linh_kien,
        );
        if (!newLinhKien) {
          throw new HttpException(
            'Linh kiện không tồn tại',
            HttpStatus.BAD_REQUEST,
          );
        }

        // Kiểm tra số lượng linh kiện mới có đủ không
        const soLuong =
          updateOrderLinhKienDto.so_luong || existingOrder.so_luong;
        if (newLinhKien.total < soLuong) {
          throw new HttpException(
            'Số lượng linh kiện trong kho không đủ',
            HttpStatus.BAD_REQUEST,
          );
        }

        // Trừ số lượng từ linh kiện mới
        await this.linhKienModel.findByIdAndUpdate(
          updateOrderLinhKienDto.id_linh_kien,
          { $inc: { total: -soLuong } },
        );
      }

      // Kiểm tra khách hàng tồn tại nếu cập nhật
      if (updateOrderLinhKienDto.id_khach_hang) {
        const customer = await this.customerModel.findById(
          updateOrderLinhKienDto.id_khach_hang,
        );
        if (!customer) {
          throw new HttpException(
            'Khách hàng không tồn tại',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      await this.orderLinhKienModel.findByIdAndUpdate(
        id,
        {
          ...updateOrderLinhKienDto,
          ngay_cap_nhat: new Date().toISOString(),
        },
        { new: true },
      );

      // Trả về đơn hàng với thông tin đầy đủ
      return this.findOne(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Lỗi khi cập nhật đơn hàng',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<OrderLinhKienModel | null> {
    try {
      const order = await this.orderLinhKienModel
        .findById(id)
        .populate('id_linh_kien')
        .populate('id_khach_hang', '_id name');

      if (!order) {
        throw new HttpException(
          'Không tìm thấy đơn hàng',
          HttpStatus.NOT_FOUND,
        );
      }

      // Hoàn trả số lượng linh kiện vào kho khi xóa đơn hàng
      await this.linhKienModel.findByIdAndUpdate(order.id_linh_kien, {
        $inc: { total: order.so_luong },
      });

      await this.orderLinhKienModel.findByIdAndDelete(id);
      return order;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Lỗi khi xóa đơn hàng',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
