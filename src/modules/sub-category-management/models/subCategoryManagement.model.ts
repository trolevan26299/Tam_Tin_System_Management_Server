import { CategoryManagementModel } from '@app/modules/category-management/models/categoryManagement.model';
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer';
import { Ref, prop } from '@typegoose/typegoose';
import { IsDefined, IsNumber, IsString } from 'class-validator';

export class SubCategoryManagementModel {
  @IsString()
  @IsDefined()
  @prop({ required: true })
  name: string;

  @IsNumber()
  @IsDefined()
  @prop({ required: true, default: 0 })
  number_of_device: number;

  @prop({ ref: CategoryManagementModel, required: true })
  category_id: Ref<CategoryManagementModel>;
}

export const SubCategoryManagementProvider = getProviderByTypegooseClass(
  SubCategoryManagementModel,
  'sub_category',
);
