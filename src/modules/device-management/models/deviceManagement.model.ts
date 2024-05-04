/* eslint-disable prettier/prettier */
import { prop } from '@typegoose/typegoose';
import { IsDefined, IsNumber, IsString } from 'class-validator';
import { getProviderByTypegooseClass } from '../../../transformers/model.transformer';

export class DeviceManagementModel {
  @IsString()
  @IsDefined()
  @prop({ required: true })
  name: string;

  @IsString()
  @IsDefined()
  @prop({ required: true })
  id_device: string;

  @IsString()
  @prop()
  category_name: string;

  @IsNumber()
  @prop()
  warranty?: number;

  @IsString()
  @prop({ default: 'inventory' })
  status?: string;

  @IsString()
  @prop({ default: '' })
  belong_to?: string;

  @IsNumber()
  @prop()
  delivery_date?: number;

  @IsString()
  @prop()
  note?: string;
}

export const DeviceManagementProvider = getProviderByTypegooseClass(
  DeviceManagementModel,
  'devices',
);
