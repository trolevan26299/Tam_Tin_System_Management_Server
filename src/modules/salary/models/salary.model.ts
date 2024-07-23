/* eslint-disable prettier/prettier */
import { modelOptions } from '@typegoose/typegoose';
import { getProviderByTypegooseClass } from '../../../transformers/model.transformer';

@modelOptions({ schemaOptions: { timestamps: true } })
export class SalaryModel {
    
}

export const SalaryProvider = getProviderByTypegooseClass(
  SalaryModel,
  'salary',
);
