import { getProviderByTypegooseClass } from '@app/transformers/model.transformer';
import { prop } from '@typegoose/typegoose';
import { IsDefined, IsNumber, IsString } from 'class-validator';

export class StaffManagementModel {
  @IsString()
  @IsDefined()
  @prop({ required: true })
  name: string;

  @IsString()
  @IsDefined()
  @prop({ required: true })
  address: string;

  @IsNumber()
  @IsDefined()
  @prop({ required: true, default: 0 })
  age: number;

  @IsNumber()
  @IsDefined()
  @prop({ required: true, default: 0 })
  salary: number;

  @IsString()
  @IsDefined()
  @prop({ required: true })
  position: string;

  @IsString()
  @prop()
  time_keeping_id?: string;

  @IsString()
  @prop()
  employee_turnover_id?: string;
}

export const StaffManagementProvider = getProviderByTypegooseClass(
  StaffManagementModel,
  'staffs',
);
