import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CustomerManagementModel } from '../models/customerManagement.model';

export class CustomerMngDTO {
  @IsString({ message: 'name must be string type' })
  @IsNotEmpty({ message: 'name is not empty !' })
  @IsDefined()
  @MaxLength(255)
  name: string;

  @IsString({ message: 'address must be string type' })
  @IsNotEmpty({ message: 'address is not empty !' })
  @IsDefined()
  address: string;

  @IsNotEmpty({ message: 'phone is not empty !' })
  @IsString({ message: 'phone must be string type' })
  @IsDefined()
  phone: string;

  @IsString({ message: 'type must be string type' })
  @IsNotEmpty({ message: 'type is not empty !' })
  @IsDefined()
  type: string;

  @IsString({ message: 'email must be string type' })
  @IsNotEmpty({ message: 'email is not empty !' })
  @IsDefined()
  email: string;

  note?: string;
}

export class QueryCustomerDto {
  @ApiProperty({ required: false })
  page: number;
  @ApiProperty({ required: false })
  items_per_page: number;
  @ApiProperty({ required: false })
  keyword: string;
  @ApiProperty({ required: false })
  sort?: string;
}

export class ListCustomerDto {
  data: CustomerManagementModel[];
  totalCount: number;
  currentPage: number;
  lastPage: number;
  nextPage: number | null;
  prevPage: number | null;
}

export class DetailCustomerDto {
  data: CustomerManagementModel;
}
