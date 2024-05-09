import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { SubCategoryManagementModel } from '../models/subCategoryManagement.model';
import { ApiProperty } from '@nestjs/swagger';

export class SubCategoryDto {
  @IsNotEmpty({ message: 'name is not empty !' })
  @IsDefined()
  @IsString({ message: 'name must be string type' })
  @MaxLength(255)
  name: string;

  @IsNotEmpty({ message: 'number of device is not empty !' })
  @IsDefined()
  @IsNumber()
  number_of_device: number;

  @IsNotEmpty({ message: 'position is not empty !' })
  @IsString({ message: 'position must be string type' })
  @IsDefined()
  category_id: string;
}

export class QuerySubCategoryDto {
  @ApiProperty({ required: false })
  page: number;
  @ApiProperty({ required: false })
  items_per_page: number;
  @ApiProperty({ required: false })
  keyword: string;
}

export class DetailSubCategoryDto {
  data: SubCategoryManagementModel;
}

export class ListSubCategoryDto {
  data: SubCategoryManagementModel[];
  totalCount: number;
  currentPage: number;
  lastPage: number;
  nextPage: number | null;
  prevPage: number | null;
}
