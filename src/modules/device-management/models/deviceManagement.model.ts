/* eslint-disable prettier/prettier */
import { SubCategoryManagerModule } from '@app/modules/sub-category-management/subCategoryManagement.module';
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

  @prop({ ref: () => SubCategoryManagerModule, required: true })
  sub_category_id: Ref<SubCategoryManagerModule>;

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
