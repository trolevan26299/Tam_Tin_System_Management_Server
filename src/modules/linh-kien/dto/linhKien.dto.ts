import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateLinhKienDTO {
  @IsString()
  @IsNotEmpty()
  name_linh_kien: string;

  @IsNumber()
  @IsNotEmpty()
  total: number;

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
}
