/* eslint-disable prettier/prettier */
import { SubCategoryManagerModule } from '@app/modules/sub-category-management/subCategoryManagement.module';
import { Ref, modelOptions, prop } from '@typegoose/typegoose';
import {
  IsArray,
  IsDefined,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { getProviderByTypegooseClass } from '../../../transformers/model.transformer';
import { Type } from 'class-transformer';

@modelOptions({ schemaOptions: { _id: false } })
class Status {
  @IsString()
  @IsDefined()
  @prop({ required: true })
  status: string;

  @IsNumber()
  @IsDefined()
  @prop({ required: true })
  quantity: number;
}

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
  @IsDefined()
  @prop({ required: true })
  price: number;

  @IsNumber()
  @prop()
  warranty?: number;

  @ValidateNested({ each: true })
  @Type(() => Status)
  @IsArray()
  @prop({ required: true, type: () => [Status] })
  status: Status[];

  @IsString()
  @prop({ default: '' })
  belong_to?: string;

  @IsString()
  @prop()
  note?: string;
}

export const DeviceManagementProvider = getProviderByTypegooseClass(
  DeviceManagementModel,
  'devices',
);
