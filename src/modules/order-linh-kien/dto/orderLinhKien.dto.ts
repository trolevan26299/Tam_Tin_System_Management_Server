import {
  IsString,
  IsNumber,
  IsOptional,
  IsDefined,
  IsBoolean,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// DTO cho chi tiết linh kiện
export class ChiTietLinhKienDto {
  @ApiProperty({
    description: 'ID của linh kiện',
    example: '67c594565f8f6017b74a833d'
  })
  @IsString()
  @IsDefined()
  id_linh_kien: string;

  @ApiProperty({
    description: 'Số lượng linh kiện',
    example: 1
  })
  @IsNumber()
  @IsDefined()
  @Type(() => Number)
  so_luong: number;

  @ApiProperty({
    description: 'Giá của linh kiện',
    example: 50000
  })
  @IsNumber()
  @IsDefined()
  @Type(() => Number)
  price: number;
}

// DTO cho tạo mới đơn hàng
export class CreateOrderLinhKienDto {
  @ApiProperty({
    description: 'Chi tiết các linh kiện trong đơn hàng',
    type: [ChiTietLinhKienDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChiTietLinhKienDto)
  chi_tiet_linh_kien: ChiTietLinhKienDto[];

  @ApiProperty({
    description: 'ID của khách hàng',
    example: '67c5a20c5f8f6017b74a8453'
  })
  @IsString()
  @IsDefined()
  id_khach_hang: string;

  @ApiProperty({
    description: 'Ghi chú cho đơn hàng',
    required: false
  })
  @IsString()
  @IsOptional()
  ghi_chu?: string;

  @ApiProperty({
    description: 'Tổng tiền của đơn hàng',
    example: 500000
  })
  @IsNumber()
  @IsDefined()
  @Type(() => Number)
  tong_tien: number;

  @ApiProperty({
    description: 'Lợi nhuận của đơn hàng',
    example: 445000
  })
  @IsNumber()
  @IsDefined()
  @Type(() => Number)
  loi_nhuan: number;
}

// DTO cho cập nhật đơn hàng
export class UpdateOrderLinhKienDto {
  @ApiProperty({
    description: 'Chi tiết các linh kiện trong đơn hàng',
    type: [ChiTietLinhKienDto],
    required: false
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChiTietLinhKienDto)
  chi_tiet_linh_kien?: ChiTietLinhKienDto[];

  @ApiProperty({
    description: 'ID của khách hàng',
    required: false
  })
  @IsString()
  @IsOptional()
  id_khach_hang?: string;

  @ApiProperty({
    description: 'Ghi chú cho đơn hàng',
    required: false
  })
  @IsString()
  @IsOptional()
  ghi_chu?: string;

  @ApiProperty({
    description: 'Tổng tiền của đơn hàng',
    required: false
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  tong_tien?: number;

  @ApiProperty({
    description: 'Lợi nhuận của đơn hàng',
    required: false
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  loi_nhuan?: number;
}

// DTO cho query tìm kiếm
export class QueryOrderLinhKienDto {
  @ApiProperty({
    description: 'Tìm kiếm theo từ khóa',
    required: false
  })
  @IsString()
  @IsOptional()
  keyword?: string;

  @ApiProperty({
    description: 'Thời gian bắt đầu',
    required: false
  })
  @IsString()
  @IsOptional()
  from_date?: string;

  @ApiProperty({
    description: 'Thời gian kết thúc',
    required: false
  })
  @IsString()
  @IsOptional()
  to_date?: string;

  @ApiProperty({
    description: 'ID khách hàng',
    required: false
  })
  @IsString()
  @IsOptional()
  id_khach_hang?: string;

  @ApiProperty({
    description: 'Số trang',
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    description: 'Số lượng item trên một trang',
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  items_per_page?: number;

  @ApiProperty({
    description: 'Lấy tất cả dữ liệu',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_all?: boolean;
}

// DTO cho thông tin linh kiện trong response
export class LinhKienInfoDto {
  @ApiProperty({
    description: 'ID của linh kiện'
  })
  _id: string;

  @ApiProperty({
    description: 'Tên linh kiện'
  })
  name_linh_kien: string;

  @ApiProperty({
    description: 'Số lượng trong kho'
  })
  total: number;

  @ApiProperty({
    description: 'Giá linh kiện'
  })
  price: number;
}

// DTO cho thông tin chi tiết linh kiện trong response
export class ChiTietLinhKienResponseDto {
  @ApiProperty({
    description: 'Thông tin linh kiện',
    type: LinhKienInfoDto
  })
  id_linh_kien: LinhKienInfoDto;

  @ApiProperty({
    description: 'Số lượng đặt mua'
  })
  so_luong: number;

  @ApiProperty({
    description: 'Giá bán'
  })
  price: number;
}

// DTO cho thông tin khách hàng trong response
export class CustomerInfoDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;
}

// DTO cho response của một đơn hàng
export class OrderLinhKienResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty({
    type: [ChiTietLinhKienResponseDto]
  })
  chi_tiet_linh_kien: ChiTietLinhKienResponseDto[];

  @ApiProperty({
    type: CustomerInfoDto
  })
  id_khach_hang: CustomerInfoDto;

  @ApiProperty()
  ghi_chu?: string;

  @ApiProperty()
  tong_tien: number;

  @ApiProperty()
  loi_nhuan: number;

  @ApiProperty()
  ngay_tao: string;

  @ApiProperty()
  ngay_cap_nhat?: string;
}

// DTO cho response danh sách đơn hàng
export class OrderLinhKienListResponseDto {
  @ApiProperty({
    type: [OrderLinhKienResponseDto]
  })
  data: OrderLinhKienResponseDto[];

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  lastPage: number;

  @ApiProperty()
  nextPage: number | null;

  @ApiProperty()
  prevPage: number | null;
}