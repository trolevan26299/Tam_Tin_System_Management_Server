/* eslint-disable prettier/prettier */
import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUpdateDeviceDTO {
  @IsString({ message: 'name must be string type' })
  @IsNotEmpty({ message: 'name is not empty !' })
  @IsDefined()
  name: string;

  @IsString({ message: 'id_device must be string type' })
  @IsNotEmpty({ message: 'id_device is not empty !' })
  @IsDefined()
  id_device: string;

  @IsString({ message: 'sub_category_id must be string type' })
  @IsNotEmpty({ message: 'sub_category_id is not empty !' })
  @IsDefined()
  sub_category_id: string;

  @IsNumber()
  @IsNotEmpty({ message: 'price is not empty !' })
  @IsDefined()
  price: number;

  @IsNumber()
  @IsDefined()
  warranty?: number;

  @IsString({ message: 'status must be string type' })
  @IsDefined()
  status?: string;

  @IsString({ message: 'belong_to must be string type' })
  @IsDefined()
  belong_to?: string;

  @IsString()
  @IsDefined()
  delivery_date?: string;

  @IsString({ message: 'note must be string type' })
  @IsDefined()
  note?: string;
}

export class filterDeviceDto {
  page?: string;
  items_per_page?: string;
  keyword?: string;
  status: string;
  belong_to?: string;
}
