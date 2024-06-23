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
class Delivery {
  @IsString()
  @IsDefined()
  @prop({ required: true })
  shipBy: string;
}

@modelOptions({ schemaOptions: { _id: false } })
class Item {
  @prop({ ref: () => DeviceManagementModel, required: true })
  device: Ref<DeviceManagementModel>;

  @IsNumber()
  @IsDefined()
  @prop({ required: true })
  quantity: number;
}

export class OrderManagementModel {
  @prop({ required: true, ref: CustomerManagementModel })
  customer: Ref<CustomerManagementModel>;

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
  delivery_date: string;

  @IsNumber()
  @IsDefined()
  @prop({ required: true })
  totalAmount: number;

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
