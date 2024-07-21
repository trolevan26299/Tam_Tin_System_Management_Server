import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { StaffAccessoriesManagementModel } from '../models/staffAccessoriesManagement.model';

export class StaffAccessoriesMngDto {
  @IsNotEmpty({ message: 'staff is not empty !' })
  @IsString({ message: 'staff must be string type' })
  @IsDefined()
  staff: string;

  @IsNotEmpty({ message: ' date is not empty !' })
  @IsDefined()
  @IsString({ message: 'date must be string type' })
  date: string;

  @IsNotEmpty({ message: ' evice is not empty !' })
  @IsDefined()
  @IsString({ message: 'device must be string type' })
  device: string;

  @IsNotEmpty()
  @IsDefined()
  @IsNumber()
  quantity: number;

  @IsNotEmpty({ message: ' status is not empty !' })
  @IsDefined()
  @IsString({ message: 'status must be string type' })
  status: string;

  note?: string;
  regDt?: string;
  modDt?: string;
}

export class QueryStaffAccessoriesDto {
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
  staffId: string;
}

export class DetailStaffAccessoriesDto {
  data: StaffAccessoriesManagementModel;
}

export class ListStaffAccessoriesDto {
  data: StaffAccessoriesManagementModel[];
  totalCount: number;
  currentPage: number;
  lastPage: number;
  nextPage: number | null;
  prevPage: number | null;
}
