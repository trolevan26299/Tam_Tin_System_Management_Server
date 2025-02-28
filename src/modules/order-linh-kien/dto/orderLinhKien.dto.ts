import {
  IsString,
  IsNumber,
  IsOptional,
  IsDefined,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateOrderLinhKienDto {
  @ApiProperty({
    description: 'ID của linh kiện',
    example: '60d21b4667d0d8992e610c85',
  })
  @IsString()
  @IsDefined()
  id_linh_kien: string;

  @ApiProperty({
    description: 'Số lượng linh kiện mua',
    example: 5,
  })
  @IsNumber()
  @IsDefined()
  @Type(() => Number)
  so_luong: number;

  @ApiProperty({
    description: 'ID của khách hàng',
    example: '60d21b4667d0d8992e610c86',
  })
  @IsString()
  @IsDefined()
  id_khach_hang: string;

  @ApiProperty({
    description: 'Ghi chú cho đơn hàng',
    example: 'Giao hàng vào buổi sáng',
    required: false,
  })
  @IsString()
  @IsOptional()
  ghi_chu?: string;

  @ApiProperty({
    description: 'Tổng tiền của đơn hàng',
    example: 1500000,
  })
  @IsNumber()
  @IsDefined()
  @Type(() => Number)
  tong_tien: number;
}

export class UpdateOrderLinhKienDto {
  @ApiProperty({
    description: 'ID của linh kiện',
    example: '60d21b4667d0d8992e610c85',
    required: false,
  })
  @IsString()
  @IsOptional()
  id_linh_kien?: string;

  @ApiProperty({
    description: 'Số lượng linh kiện mua',
    example: 5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  so_luong?: number;

  @ApiProperty({
    description: 'ID của khách hàng',
    example: '60d21b4667d0d8992e610c86',
    required: false,
  })
  @IsString()
  @IsOptional()
  id_khach_hang?: string;

  @ApiProperty({
    description: 'Ghi chú cho đơn hàng',
    example: 'Giao hàng vào buổi sáng',
    required: false,
  })
  @IsString()
  @IsOptional()
  ghi_chu?: string;

  @ApiProperty({
    description: 'Tổng tiền của đơn hàng',
    example: 1500000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  tong_tien?: number;
}

export class QueryOrderLinhKienDto {
  @ApiProperty({
    description: 'Tìm kiếm theo từ khóa (tên linh kiện)',
    example: 'CPU',
    required: false,
  })
  @IsString()
  @IsOptional()
  keyword?: string;

  @ApiProperty({
    description: 'Thời gian bắt đầu (ISO string)',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  @IsString()
  @IsOptional()
  from_date?: string;

  @ApiProperty({
    description: 'Thời gian kết thúc (ISO string)',
    example: '2023-12-31T23:59:59.999Z',
    required: false,
  })
  @IsString()
  @IsOptional()
  to_date?: string;

  @ApiProperty({
    description: 'ID khách hàng',
    example: '60d21b4667d0d8992e610c86',
    required: false,
  })
  @IsString()
  @IsOptional()
  id_khach_hang?: string;

  @ApiProperty({
    description: 'Số trang (bắt đầu từ 0)',
    example: 0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    description: 'Số lượng item trên một trang',
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  items_per_page?: number;

  @ApiProperty({
    description: 'Lấy tất cả dữ liệu',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_all?: boolean;
}

export class LinhKienInfoDto {
  @ApiProperty({
    description: 'ID của linh kiện',
    example: '60d21b4667d0d8992e610c85',
  })
  _id: string;

  @ApiProperty({
    description: 'Tên linh kiện',
    example: 'CPU Intel Core i7',
  })
  name_linh_kien: string;

  @ApiProperty({
    description: 'Số lượng linh kiện trong kho',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Ngày tạo linh kiện',
    example: '2023-01-01T00:00:00.000Z',
  })
  create_date?: string;
}

export class CustomerInfoDto {
  @ApiProperty({
    description: 'ID của khách hàng',
    example: '60d21b4667d0d8992e610c86',
  })
  _id: string;

  @ApiProperty({
    description: 'Tên khách hàng',
    example: 'Nguyễn Văn A',
  })
  name: string;

  @ApiProperty({
    description: 'Địa chỉ khách hàng',
    example: 'Hà Nội',
  })
  address: string;

  @ApiProperty({
    description: 'Số điện thoại khách hàng',
    example: '0123456789',
  })
  phone: string;

  @ApiProperty({
    description: 'Email khách hàng',
    example: 'example@gmail.com',
  })
  email: string;
}

export class OrderLinhKienResponseDto {
  @ApiProperty({
    description: 'ID của đơn hàng',
    example: '60d21b4667d0d8992e610c87',
  })
  _id: string;

  @ApiProperty({
    description: 'Thông tin linh kiện',
    type: LinhKienInfoDto,
  })
  id_linh_kien: LinhKienInfoDto;

  @ApiProperty({
    description: 'Số lượng linh kiện mua',
    example: 5,
  })
  so_luong: number;

  @ApiProperty({
    description: 'Thông tin khách hàng',
    type: CustomerInfoDto,
  })
  id_khach_hang: CustomerInfoDto;

  @ApiProperty({
    description: 'Ghi chú cho đơn hàng',
    example: 'Giao hàng vào buổi sáng',
  })
  ghi_chu?: string;

  @ApiProperty({
    description: 'Tổng tiền của đơn hàng',
    example: 1500000,
  })
  tong_tien: number;

  @ApiProperty({
    description: 'Ngày tạo đơn hàng',
    example: '2023-01-01T00:00:00.000Z',
  })
  ngay_tao: string;

  @ApiProperty({
    description: 'Ngày cập nhật đơn hàng',
    example: '2023-01-02T00:00:00.000Z',
  })
  ngay_cap_nhat?: string;
}

export class OrderLinhKienListResponseDto {
  @ApiProperty({
    description: 'Danh sách đơn hàng',
    type: [OrderLinhKienResponseDto],
  })
  data: OrderLinhKienResponseDto[];

  @ApiProperty({
    description: 'Tổng số đơn hàng',
    example: 100,
  })
  totalCount: number;

  @ApiProperty({
    description: 'Trang hiện tại',
    example: 1,
  })
  currentPage: number;

  @ApiProperty({
    description: 'Trang cuối cùng',
    example: 10,
  })
  lastPage: number;

  @ApiProperty({
    description: 'Trang tiếp theo',
    example: 2,
    nullable: true,
  })
  nextPage: number | null;

  @ApiProperty({
    description: 'Trang trước đó',
    example: null,
    nullable: true,
  })
  prevPage: number | null;
}
