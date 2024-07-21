/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { DeviceManagementModel } from '../models/deviceManagement.model';

export class DetailDeviceDto {
  status: string;
  id_device: string;
}
export class AddNumberDetailToDeviceDto {
  quantity: number;
  name: string;
}
export class CreateUpdateDeviceDTO {
  @IsString({ message: 'name must be string type' })
  @IsNotEmpty({ message: 'name is not empty !' })
  @IsDefined()
  name: string;

  @IsString({ message: 'sub_category_id must be string type' })
  @IsNotEmpty({ message: 'sub_category_id is not empty !' })
  @IsDefined()
  sub_category_id: string;

  @IsNumber()
  @IsNotEmpty({ message: 'cost is not empty !' })
  @IsDefined()
  cost: number;

  @IsNumber()
  @IsNotEmpty({ message: 'quantity is not empty !' })
  @IsDefined()
  quantity: number;

  detail?: DetailDeviceDto[];

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
}

export class ListDeviceDto {
  data: DeviceManagementModel[];
  totalCount: number;
  currentPage: number;
  lastPage: number;
  nextPage: number | null;
  prevPage: number | null;
}
