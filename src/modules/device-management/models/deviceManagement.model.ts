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
class Detail {
  @IsString()
  @IsDefined()
  @prop({ required: true })
  status: string;

  @IsString()
  @IsDefined()
  @prop({ required: true })
  id_device: string;
}

export class DeviceManagementModel {
  @IsString()
  @IsDefined()
  @prop({ required: true })
  name: string;

  @prop({ ref: () => SubCategoryManagementModel, required: true })
  sub_category_id: Ref<SubCategoryManagementModel>;

  @IsNumber()
  @IsDefined()
  @prop({ required: true })
  cost: number;

  @ValidateNested({ each: true })
  @Type(() => Detail)
  @IsArray()
  @prop({ required: true, type: () => [Detail] })
  detail: Detail[];

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
