/* eslint-disable prettier/prettier */
import { prop } from '@typegoose/typegoose';
import { IsDefined, IsString } from 'class-validator';
import { getProviderByTypegooseClass } from '../../../transformers/model.transformer';

export class AccountManagementModel {
  @IsString()
  @IsDefined()
  @prop({ required: true, default: '' })
  username: string;

  @IsString()
  @prop()
  password?: string;

  @IsString()
  @prop({ default: 'admin' })
  role?: string;

  @IsString()
  @prop({ default: 'active' })
  status?: string;
}

export const AccountManagementProvider = getProviderByTypegooseClass(
  AccountManagementModel,
  'account_management',
);
