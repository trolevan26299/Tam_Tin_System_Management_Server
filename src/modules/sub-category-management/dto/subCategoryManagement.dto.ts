import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { SubCategoryManagementModel } from '../models/subCategoryManagement.model';

export class SubCategoryDto {
  @IsNotEmpty({ message: 'name is not empty !' })
  @IsDefined()
  @IsString({ message: 'name must be string type' })
  @MaxLength(255)
  name: string;

  number_of_device?: number;

  @IsNotEmpty({ message: 'category_id is not empty !' })
  @IsString({ message: 'category_id must be string type' })
  @IsDefined()
  category_id: string;

  regDt?: string;
  modDt?: string;
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
