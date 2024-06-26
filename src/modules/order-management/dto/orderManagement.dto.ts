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

  @IsNumber()
  @IsNotEmpty({ message: 'price is not empty !' })
  @IsDefined()
  quantity: number;
}

export class DeliveryDto {
  @IsNotEmpty({ message: 'shipBy is not empty !' })
  @IsString()
  @IsDefined()
  shipBy: string;
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

  @IsNotEmpty({ message: 'delivery is not empty !' })
  @ValidateNested()
  @Type(() => DeliveryDto)
  @IsDefined()
  delivery: DeliveryDto;

  @IsNotEmpty({ message: 'name is not empty !' })
  @IsDefined()
  @IsString({ message: 'delivery_date must be string type' })
  delivery_date: string;

  @IsNotEmpty({ message: 'total amount is not empty !' })
  @IsDefined()
  @IsNumber()
  totalAmount: number;

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
