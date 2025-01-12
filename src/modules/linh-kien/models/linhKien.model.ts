import { prop } from '@typegoose/typegoose';
import { IsDefined, IsString, IsNumber } from 'class-validator';
import { getProviderByTypegooseClass } from '../../../transformers/model.transformer';

export class UserCreateDto {
  @IsString()
  @prop({ required: true })
  username: string;

  @IsString()
  @prop({ required: true })
  id: string;
}

export class DataUngLinhKienDto {
  @IsString()
  @prop({ required: true })
  name: string;

  @IsString()
  @prop({ required: true })
  id: string;

  @IsNumber()
  @prop({ required: true })
  total: number;
}

export class LinhKienModel {
  @IsString()
  @IsDefined()
  @prop({ required: true })
  name_linh_kien: string;

  @IsNumber()
  @IsDefined()
  @prop({ required: true })
  total: number;

  @prop()
  create_date: string;

  @prop({ type: () => UserCreateDto })
  user_create: UserCreateDto;

  @prop({ type: () => DataUngLinhKienDto })
  data_ung?: DataUngLinhKienDto[];
}

export const LinhKienProvider = getProviderByTypegooseClass(
  LinhKienModel,
  'linh_kien',
);
