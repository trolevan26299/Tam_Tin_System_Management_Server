import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { LinhKienModel } from '../models/linhKien.model';

export class CreateLinhKienDTO {
  @IsString()
  @IsNotEmpty()
  name_linh_kien: string;

  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  user_create: {
    username: string;
    id: string;
  };
}

export class DeleteLinhKienDTO {
  @IsNumber()
  @IsNotEmpty()
  passcode: number;
}

export class FilterLinhKienDto {
  @ApiProperty({ required: false })
  page?: number;

  @ApiProperty({ required: false })
  items_per_page?: number;

  @ApiProperty({ required: false })
  keyword?: string;

  @ApiProperty({ required: false })
  is_all?: boolean;
}

export class LinhKienDto {
  data: LinhKienModel[];
  totalCount: number;
  currentPage: number;
  lastPage: number;
  nextPage: number | null;
  prevPage: number | null;
}
