/* eslint-disable prettier/prettier */
import { CategoryManagementModel } from '@app/modules/category-management/models/categoryManagement.model';
import { Ref, prop } from '@typegoose/typegoose';
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

  @prop({ ref: () => CategoryManagementModel, required: true })
  category_id: Ref<CategoryManagementModel>;

  @IsNumber()
  @prop()
  warranty?: number;

  @IsString()
  @prop({ default: 'inventory' })
  status?: string;

  @IsString()
  @prop({ default: '' })
  belong_to?: string;

  @IsString()
  @prop()
  delivery_date?: string;

  @IsString()
  @prop()
  note?: string;
}

export const DeviceManagementProvider = getProviderByTypegooseClass(
  DeviceManagementModel,
  'devices',
);
