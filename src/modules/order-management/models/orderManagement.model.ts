import { CustomerManagementModel } from '@app/modules/customer-management/models/customerManagement.model';
import { DeviceManagementModel } from '@app/modules/device-management/models/deviceManagement.model';
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer';
import { Ref, modelOptions, prop } from '@typegoose/typegoose';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

@modelOptions({ schemaOptions: { _id: false } })
class Item {
  @prop({ ref: () => DeviceManagementModel, required: true })
  device: Ref<DeviceManagementModel>;

  @IsDefined()
  @IsArray()
  @IsString({ each: true })
  @prop({ required: true })
  details: string[];

  @IsNumber()
  @prop({ required: true })
  price: number;

  @IsNumber()
  @prop({ required: true })
  warranty: number;
}

export class OrderManagementModel {
  @prop({ required: true, ref: CustomerManagementModel })
  customer: Ref<CustomerManagementModel>;

  @IsString()
  @IsDefined()
  @prop({ required: true })
  shipBy: string;

  @ValidateNested({ each: true })
  @Type(() => Item)
  @IsArray()
  @prop({ required: true, type: () => [Item] })
  items: Item[];

  @IsString()
  @IsDefined()
  @prop({ required: true })
  delivery_date: string;

  @IsNumber()
  @IsDefined()
  @prop({ required: true })
  totalAmount: number;

  @IsNumber()
  @prop()
  priceSaleOff?: number;

  @IsString()
  @prop()
  type_customer?: string;

  @IsString()
  @prop()
  note?: string;

  @prop()
  regDt?: string;

  @prop()
  modDt?: string;
}

export const OrderManagementProvider = getProviderByTypegooseClass(
  OrderManagementModel,
  'orders',
);
