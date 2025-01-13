import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateTransactionDTO {
  @IsString()
  @IsNotEmpty()
  name_linh_kien: string;

  @IsString()
  @IsNotEmpty()
  type: 'Bổ sung' | 'Ứng' | 'Sửa chữa';

  @IsOptional()
  nhan_vien?: {
    name: string;
    id: string;
  };

  @IsString()
  @IsNotEmpty()
  nguoi_tao: string;

  @IsString()
  @IsNotEmpty()
  noi_dung: string;

  @IsNumber()
  @IsNotEmpty()
  total: number;
}

export class UpdateTransactionDTO extends CreateTransactionDTO {
  @IsNumber()
  @IsNotEmpty()
  passcode: number;
}

export class DeleteTransactionDTO {
  @IsNumber()
  @IsNotEmpty()
  passcode: number;
}

export class FilterTransactionDto {
  @ApiProperty({ required: false })
  page?: number;

  @ApiProperty({ required: false })
  items_per_page?: number;

  @ApiProperty({ required: false })
  keyword?: string;

  @ApiProperty({ required: false })
  type?: string;
}
