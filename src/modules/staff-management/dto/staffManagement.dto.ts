import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
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

  @IsNotEmpty({ message: 'exp is not empty !' })
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

  @IsDefined()
  @IsString({ message: 'username telegram must be string type' })
  username_telegram: string;

  @IsDefined()
  @IsString({ message: 'user id telegram must be string type' })
  user_id_telegram: string;

  @IsNotEmpty({ message: 'position is not empty !' })
  @IsDefined()
  @IsString({ message: 'position must be string type' })
  @MaxLength(255)
  position: string;

  @IsDefined()
  @IsBoolean()
  active?: boolean;

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
  @ApiProperty({ required: false })
  is_all?: boolean;
}

export class DetailStaffDto {
  data: StaffManagementModel;
}
interface LinhKienUng {
  name_linh_kien: string;
  total: number;
}

export class ListStaffDto {
  data: Array<
    StaffManagementModel & {
      linh_kien_ung: LinhKienUng[];
    }
  >;
  totalCount: number;
  currentPage: number;
  lastPage: number;
  nextPage: number | null;
  prevPage: number | null;
}
