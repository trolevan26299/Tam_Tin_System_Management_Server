import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { StaffManagementModel } from '../models/staffManagement.model';

export class StaffMngDto {
  @IsNotEmpty({ message: 'name is not empty !' })
  @IsDefined()
  @IsString({ message: 'name must be string type' })
  @MaxLength(255)
  name: string;

  @IsNotEmpty({ message: 'address is not empty !' })
  @IsDefined()
  @IsString({ message: 'address must be string type' })
  address: string;

  @IsNotEmpty({ message: 'age is not empty !' })
  @IsDefined()
  @IsNumber()
  age: number;

  @IsNotEmpty({ message: 'age is not empty !' })
  @IsDefined()
  @IsNumber()
  exp: number;

  @IsNotEmpty({ message: 'salary is not empty !' })
  @IsDefined()
  @IsNumber()
  salary: number;

  @IsNotEmpty({ message: 'position is not empty !' })
  @IsDefined()
  @IsString()
  @MaxLength(255)
  phone: string;

  @IsNotEmpty({ message: 'username telegram is not empty !' })
  @IsDefined()
  @IsString({ message: 'username telegram must be string type' })
  telegram: string;

  @IsNotEmpty({ message: 'position is not empty !' })
  @IsDefined()
  @IsString({ message: 'position must be string type' })
  @MaxLength(255)
  position: string;

  note?: string;
  regDt?: string;
  modDt?: string;
}

export class QueryStaffDto {
  @ApiProperty({ required: false })
  page: number;
  @ApiProperty({ required: false })
  items_per_page: number;
  @ApiProperty({ required: false })
  keyword: string;
}

export class DetailStaffDto {
  data: StaffManagementModel;
}

export class ListStaffDto {
  data: StaffManagementModel[];
  totalCount: number;
  currentPage: number;
  lastPage: number;
  nextPage: number | null;
  prevPage: number | null;
}
