import { getProviderByTypegooseClass } from '@app/transformers/model.transformer';
import { prop } from '@typegoose/typegoose';
import { IsDefined, IsString } from 'class-validator';

export class CategoryManagementModel {
  @IsString()
  @IsDefined()
  @prop({ required: true })
  name: string;
}

export const CategoryManagementProvider = getProviderByTypegooseClass(
  CategoryManagementModel,
  'category',
);
