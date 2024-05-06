import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CategoryManagementModel } from '../models/categoryManagement.model';

export class CategoryMngDTO {
  @IsString({ message: 'name must be string type' })
  @IsNotEmpty({ message: 'name is not empty !' })
  @IsDefined()
  @MaxLength(255)
  name: string;
}

export class QueryCategoryDto {
  @ApiProperty({ required: false })
  page: number;
  @ApiProperty({ required: false })
  items_per_page: number;
  @ApiProperty({ required: false })
  keyword: string;
  @ApiProperty({ required: false })
  sort?: string;
}

export class ListCategoryDto {
  data: CategoryManagementModel[];
  totalCount: number;
  currentPage: number;
  lastPage: number;
  nextPage: number | null;
  prevPage: number | null;
}

export class DetailCategoryDto {
  data: CategoryManagementModel;
}
