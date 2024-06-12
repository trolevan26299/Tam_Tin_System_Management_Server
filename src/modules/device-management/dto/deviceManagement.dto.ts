/* eslint-disable prettier/prettier */
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
import { DeviceManagementModel } from '../models/deviceManagement.model';

class StatusDTO {
  @IsString()
  @IsNotEmpty({ message: 'status is not empty !' })
  @IsDefined()
  status: string;

  @IsNumber()
  @IsNotEmpty({ message: 'quantity is not empty !' })
  @IsDefined()
  quantity: number;
}
export class CreateUpdateDeviceDTO {
  @IsString({ message: 'name must be string type' })
  @IsNotEmpty({ message: 'name is not empty !' })
  @IsDefined()
  name: string;

  @IsString({ message: 'id_device must be string type' })
  @IsNotEmpty({ message: 'id_device is not empty !' })
  @IsDefined()
  id_device: string;

  @IsString({ message: 'sub_category_id must be string type' })
  @IsNotEmpty({ message: 'sub_category_id is not empty !' })
  @IsDefined()
  sub_category_id: string;

  @IsNumber()
  @IsNotEmpty({ message: 'price is not empty !' })
  @IsDefined()
  price: number;

  @IsNumber()
  @IsDefined()
  warranty?: number;

  @IsNotEmpty({ message: 'status is not empty !' })
  @ValidateNested({ each: true })
  @Type(() => StatusDTO)
  @IsArray({ message: 'status must be an array of StatusDTO objects' })
  @IsDefined()
  status: StatusDTO[];

  @IsString({ message: 'note must be string type' })
  @IsDefined()
  note?: string;

  regDt?: string;
  modDt?: string;
}

export class filterDeviceDto {
  @ApiProperty({ required: false })
  page?: string;
  @ApiProperty({ required: false })
  items_per_page?: string;
  @ApiProperty({ required: false })
  keyword?: string;
  @ApiProperty({ required: false })
  status?: string;
}

export class ListDeviceDto {
  data: DeviceManagementModel[];
  totalCount: number;
  currentPage: number;
  lastPage: number;
  nextPage: number | null;
  prevPage: number | null;
}
