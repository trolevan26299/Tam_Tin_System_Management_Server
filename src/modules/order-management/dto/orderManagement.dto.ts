import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrderManagementModel } from '../models/orderManagement.model';

export class ItemDto {
  @IsString()
  @IsDefined()
  device: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ message: 'Device array must not be empty' })
  @IsDefined()
  details?: string[];

  @IsNumber()
  @IsNotEmpty({ message: 'Price must not be empty' })
  price: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Warranty must not be empty' })
  warranty: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Quantity must not be empty' })
  quantity: number;
}

export class OrderMngDto {
  @IsNotEmpty({ message: 'items is not empty !' })
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  @IsArray()
  @IsDefined()
  items: ItemDto[];

  @IsNotEmpty({ message: 'customer is not empty !' })
  @IsString({ message: 'customer must be string type' })
  @IsDefined()
  customer: string;

  @IsNotEmpty({ message: 'Type customer is not empty !' })
  @IsString({ message: 'Type customer must be string type' })
  @IsDefined()
  type_customer: string;

  @IsNotEmpty({ message: 'ship by is not empty !' })
  @IsString()
  @IsDefined()
  shipBy: string;

  @IsNotEmpty({ message: 'delivery date is not empty !' })
  @IsDefined()
  @IsString({ message: 'delivery_date must be string type' })
  delivery_date: string;

  @IsNotEmpty({ message: 'total amount is not empty !' })
  @IsDefined()
  @IsNumber()
  totalAmount: number;

  @IsNumber()
  priceSaleOff?: number;

  @IsString({ message: 'note must be string type' })
  @IsDefined()
  note?: string;

  regDt?: string;
  modDt?: string;
}

export class QueryOrderDto {
  @ApiProperty({ required: false })
  page: number;
  @ApiProperty({ required: false })
  items_per_page: number;
  @ApiProperty({ required: false })
  keyword: string;
  @ApiProperty({ required: false })
  from_date: string;
  @ApiProperty({ required: false })
  to_date: string;
  @ApiProperty({ required: false })
  customerId: string;
}

export class ListOrderDto {
  data: OrderManagementModel[];
  totalCount: number;
  currentPage: number;
  lastPage: number;
  nextPage: number | null;
  prevPage: number | null;
}
