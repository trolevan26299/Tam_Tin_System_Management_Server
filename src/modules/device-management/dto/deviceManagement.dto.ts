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

  @IsString({ message: 'id_device must be string type' })
  @IsNotEmpty({ message: 'id_device is not empty !' })
  @IsDefined()
  category_name: string;

  @IsNumber()
  @IsDefined()
  warranty: number;

  @IsString({ message: 'status must be string type' })
  @IsDefined()
  status: string;

  @IsString({ message: 'belong_to must be string type' })
  @IsDefined()
  belong_to: string;

  @IsNumber()
  @IsDefined()
  delivery_date: number;

  @IsString({ message: 'note must be string type' })
  @IsDefined()
  note: string;
}

export class filterDeviceDto {
  data: {
    page?: string;
    items_per_page?: string;
    keyword?: string;
    status: string;
  };
}
