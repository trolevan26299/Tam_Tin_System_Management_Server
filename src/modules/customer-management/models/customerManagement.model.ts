/* eslint-disable prettier/prettier */
import { prop } from '@typegoose/typegoose';
import { IsDefined, IsString } from 'class-validator';
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

  @IsString()
  @IsDefined()
  @prop({ required: true })
  phone: string;

  @IsString()
  @IsDefined()
  @prop({ required: true })
  type: string;

  @IsString()
  @IsDefined()
  @prop({ required: true })
  email: string;

  @IsString()
  @prop()
  note?: string;

  @IsString()
  @prop()
  regDt?: string;

  @IsString()
  @prop()
  modDt?: string;
}

export const CustomerManagementProvider = getProviderByTypegooseClass(
  CustomerManagementModel,
  'customers',
);
