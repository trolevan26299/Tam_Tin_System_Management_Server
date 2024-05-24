/* eslint-disable prettier/prettier */
import { prop } from '@typegoose/typegoose';
import { IsDefined, IsNumber, IsString } from 'class-validator';
import { getProviderByTypegooseClass } from '../../../transformers/model.transformer';

export class CustomerManagementModel {
  @IsString()
  @IsDefined()
  @prop({ required: true })
  name: string;

  @IsString()
  @IsDefined()
  @prop({ required: true })
  address: string;

  @IsNumber()
  @IsDefined()
  @prop({ required: true })
  phone: number;

  @IsString()
  @IsDefined()
  @prop({ required: true })
  type: string;

  @IsString()
  @prop()
  note?: string;
}

export const CustomerManagementProvider = getProviderByTypegooseClass(
  CustomerManagementModel,
  'customers',
);
