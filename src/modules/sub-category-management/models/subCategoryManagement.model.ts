import { CategoryManagementModel } from '@app/modules/category-management/models/categoryManagement.model';
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer';
import { Ref, prop } from '@typegoose/typegoose';
import { IsDefined, IsString } from 'class-validator';

export class SubCategoryManagementModel {
  @IsString()
  @IsDefined()
  @prop({ required: true })
  name: string;

  @prop({ ref: CategoryManagementModel, required: true })
  category_id: Ref<CategoryManagementModel>;

  @prop()
  number_of_device?: number;

  @prop()
  regDt?: string;

  @prop()
  modDt?: string;
}

export const SubCategoryManagementProvider = getProviderByTypegooseClass(
  SubCategoryManagementModel,
  'sub_category',
);
