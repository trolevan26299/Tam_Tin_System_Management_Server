import { CustomerManagementModel } from '@app/modules/customer-management/models/customerManagement.model';
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer';
import { prop } from '@typegoose/typegoose';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class Delivery {
  @IsString()
  @IsDefined()
  @prop({ required: true })
  shipBy: string;

  @IsString()
  @IsDefined()
  @prop({ required: true })
  speedy: string;

  @IsString()
  @IsDefined()
  @prop({ required: true })
  trackingNumber: string;
}

class Item {
  @IsString()
  @IsDefined()
  @prop({ required: true })
  id_device: string;

  @IsString()
  @IsDefined()
  @prop({ required: true })
  name: string;

  @IsString()
  @IsDefined()
  @prop({ required: true })
  name_category: string;

  @IsNumber()
  @IsDefined()
  @prop({ required: true })
  quantity: number;

  @IsNumber()
  @IsDefined()
  @prop({ required: true })
  price: number;

  @IsString()
  @prop()
  note?: string;
}

export class OrderManagementModel {
  @ValidateNested()
  @Type(() => CustomerManagementModel)
  @prop({ required: true, type: () => CustomerManagementModel })
  customer: CustomerManagementModel;

  @ValidateNested()
  @Type(() => Delivery)
  @prop({ required: true, type: () => Delivery })
  delivery: Delivery;

  @ValidateNested({ each: true })
  @Type(() => Item)
  @IsArray()
  @prop({ required: true, type: () => [Item] })
  items: Item[];

  @IsString()
  @IsDefined()
  @prop({ required: true })
  createAt: string;

  @IsNumber()
  @IsDefined()
  @prop({ required: true })
  totalAmount: number;

  @IsNumber()
  @IsDefined()
  @prop({ required: true })
  totalQuantity: number;

  @IsString()
  @prop()
  note?: string;
}

export const OrderManagementProvider = getProviderByTypegooseClass(
  OrderManagementModel,
  'orders',
);
