/* eslint-disable prettier/prettier */
import { SubCategoryManagementModel } from '@app/modules/sub-category-management/models/subCategoryManagement.model';
import { Ref, modelOptions, prop } from '@typegoose/typegoose';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { getProviderByTypegooseClass } from '../../../transformers/model.transformer';

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

  @prop({ ref: () => SubCategoryManagementModel, required: true })
  sub_category_id: Ref<SubCategoryManagementModel>;

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
  @prop()
  note?: string;

  @prop()
  regDt?: string;

  @prop()
  modDt?: string;
}

export const DeviceManagementProvider = getProviderByTypegooseClass(
  DeviceManagementModel,
  'devices',
);
