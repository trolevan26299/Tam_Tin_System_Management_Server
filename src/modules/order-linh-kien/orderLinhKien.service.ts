import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CustomerManagementModel } from '../customer-management/models/customerManagement.model';
import { LinhKienModel } from '../linh-kien/models/linhKien.model';
import {
  CreateOrderLinhKienDto,
  OrderLinhKienListResponseDto,
  QueryOrderLinhKienDto,
  UpdateOrderLinhKienDto,
} from './dto/orderLinhKien.dto';
import { ChiTietLinhKien, OrderLinhKienModel } from './models/orderLinhKien.model';
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

  async create(createOrderLinhKienDto: CreateOrderLinhKienDto): Promise<OrderLinhKienModel | null> {
    try {
      console.log(' createOrderLinhKienDto:',createOrderLinhKienDto);
      // Kiểm tra từng linh kiện và lấy thông tin giá
      const chiTietWithPrice: ChiTietLinhKien[] = [];
      
      for (const item of createOrderLinhKienDto.chi_tiet_linh_kien) {
        const linhKien = await this.linhKienModel.findById(item.id_linh_kien);
        if (!linhKien) {
          throw new HttpException(
            `Linh kiện ${item.id_linh_kien} không tồn tại`,
            HttpStatus.BAD_REQUEST,
          );
        }
        if (linhKien.total < item.so_luong) {
          throw new HttpException(
            `Số lượng linh kiện ${linhKien.name_linh_kien} trong kho không đủ`,
            HttpStatus.BAD_REQUEST,
          );
        }
        
        // Thêm price vào chi tiết linh kiện
        chiTietWithPrice.push({
          id_linh_kien: linhKien._id,
          so_luong: item.so_luong,
          price: linhKien.price
        });
      }

      // Kiểm tra khách hàng
      const customer = await this.customerModel.findById(createOrderLinhKienDto.id_khach_hang);
      if (!customer) {
        throw new HttpException('Khách hàng không tồn tại', HttpStatus.BAD_REQUEST);
      }

      // Tạo đơn hàng với price
      const createdOrder = new this.orderLinhKienModel({
        ...createOrderLinhKienDto,
        chi_tiet_linh_kien: chiTietWithPrice,
        ngay_tao: new Date().toISOString(),
      });

      // Lưu đơn hàng
      const savedOrder = await createdOrder.save();

      // Cập nhật số lượng các linh kiện
      for (const item of createOrderLinhKienDto.chi_tiet_linh_kien) {
        await this.linhKienModel.findByIdAndUpdate(
          item.id_linh_kien,
          { $inc: { total: -item.so_luong } },
        );
      }

      return this.findOne(savedOrder._id.toString());
    } catch (error) {
      console.error('Create Order Error:', error); // Thêm log để debug
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        `Lỗi khi tạo đơn hàng: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
}

async findAll(query: QueryOrderLinhKienDto): Promise<OrderLinhKienListResponseDto> {
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

    // Xử lý tìm kiếm theo keyword (tên linh kiện)
    if (keyword) {
      const linhKiens = await this.linhKienModel
        .find({
          name_linh_kien: { $regex: keyword, $options: 'i' }
        })
        .exec();

      if (linhKiens.length === 0) {
        return {
          data: [],
          totalCount: 0,
          currentPage: page,
          lastPage: 0,
          nextPage: null,
          prevPage: null,
        };
      }

      const linhKienIds = linhKiens.map(lk => lk._id);
      filter['chi_tiet_linh_kien.id_linh_kien'] = { $in: linhKienIds };
    }

    // Xử lý lọc theo thời gian
    if (from_date || to_date) {
      filter.ngay_tao = {};
      if (from_date) {
        filter.ngay_tao.$gte = from_date;
      }
      if (to_date) {
        filter.ngay_tao.$lte = to_date;
      }
    }

    // Xử lý lọc theo khách hàng
    if (id_khach_hang) {
      filter.id_khach_hang = id_khach_hang;
    }

    let dataRes;
    let totalCount;

    const baseQuery = this.orderLinhKienModel
      .find(filter)
      .sort({ ngay_tao: -1 });

    if (is_all) {
      dataRes = await baseQuery
        .populate({
          path: 'chi_tiet_linh_kien.id_linh_kien',
          model: this.linhKienModel,
          select: 'name_linh_kien total price'
        })
        .populate({
          path: 'id_khach_hang',
          model: this.customerModel,
          select: 'name address phone email'
        })
        .exec();
      
      totalCount = dataRes.length;
    } else {
      dataRes = await baseQuery
        .skip(skip)
        .limit(items_per_page)
        .populate({
          path: 'chi_tiet_linh_kien.id_linh_kien',
          model: this.linhKienModel,
          select: 'name_linh_kien total price'
        })
        .populate({
          path: 'id_khach_hang',
          model: this.customerModel,
          select: 'name address phone email'
        })
        .exec();

      totalCount = await this.orderLinhKienModel.countDocuments(filter);
    }

    const lastPage = Math.ceil(totalCount / items_per_page);

    return {
      data: dataRes,
      totalCount,
      currentPage: page,
      lastPage,
      nextPage: page + 1 > lastPage ? null : page + 1,
      prevPage: page - 1 < 1 ? null : page - 1,
    };

  } catch (error) {
    console.error('Error in findAll:', error);
    throw new HttpException(
      'Lỗi khi lấy danh sách đơn hàng: ' + error.message,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}


async findOne(id: string): Promise<OrderLinhKienModel | null> {
  try {
    const order = await this.orderLinhKienModel
      .findById(id)
      .populate({
        path: 'chi_tiet_linh_kien.id_linh_kien',
        model: this.linhKienModel,
        select: 'name_linh_kien total price'
      })
      .populate({
        path: 'id_khach_hang',
        model: this.customerModel,
        select: 'name address phone email'
      })
      .exec();

    if (!order) {
      throw new HttpException(
        'Không tìm thấy đơn hàng',
        HttpStatus.NOT_FOUND,
      );
    }

    return order;
  } catch (error) {
    console.error('Error in findOne:', error); // Thêm log để debug
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(
      'Lỗi khi lấy thông tin đơn hàng: ' + error.message,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

  async update(id: string, updateOrderLinhKienDto: UpdateOrderLinhKienDto): Promise<OrderLinhKienModel | null> {
    try {
      const existingOrder = await this.orderLinhKienModel.findById(id);
      if (!existingOrder) {
        throw new HttpException('Đơn hàng không tồn tại', HttpStatus.NOT_FOUND);
      }

      if (updateOrderLinhKienDto.chi_tiet_linh_kien) {
        // Hoàn trả số lượng cho các linh kiện cũ
        for (const item of existingOrder.chi_tiet_linh_kien) {
          await this.linhKienModel.findByIdAndUpdate(
            item.id_linh_kien,
            { $inc: { total: item.so_luong } },
          );
        }

        // Kiểm tra và trừ số lượng các linh kiện mới
        for (const item of updateOrderLinhKienDto.chi_tiet_linh_kien) {
          const linhKien = await this.linhKienModel.findById(item.id_linh_kien);
          if (!linhKien) {
            throw new HttpException(
              `Linh kiện ${item.id_linh_kien} không tồn tại`,
              HttpStatus.BAD_REQUEST,
            );
          }
          if (linhKien.total < item.so_luong) {
            throw new HttpException(
              `Số lượng linh kiện ${linhKien.name_linh_kien} trong kho không đủ`,
              HttpStatus.BAD_REQUEST,
            );
          }
          await this.linhKienModel.findByIdAndUpdate(
            item.id_linh_kien,
            { $inc: { total: -item.so_luong } },
          );
        }
      }

      // Cập nhật đơn hàng
      await this.orderLinhKienModel.findByIdAndUpdate(
        id,
        {
          ...updateOrderLinhKienDto,
          ngay_cap_nhat: new Date().toISOString(),
        },
        { new: true },
      );

      return this.findOne(id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Lỗi khi cập nhật đơn hàng', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string): Promise<OrderLinhKienModel | null> {
    try {
      const order = await this.orderLinhKienModel.findById(id);
      if (!order) {
        throw new HttpException('Không tìm thấy đơn hàng', HttpStatus.NOT_FOUND);
      }

      // Hoàn trả số lượng cho tất cả linh kiện
      for (const item of order.chi_tiet_linh_kien) {
        await this.linhKienModel.findByIdAndUpdate(
          item.id_linh_kien,
          { $inc: { total: item.so_luong } },
        );
      }

      await this.orderLinhKienModel.findByIdAndDelete(id);
      return order;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Lỗi khi xóa đơn hàng', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
