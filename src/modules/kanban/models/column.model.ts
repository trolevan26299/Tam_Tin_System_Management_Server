/* eslint-disable prettier/prettier */
import { Ref, modelOptions, prop } from '@typegoose/typegoose';
import { TaskKanbanModel } from './task.model';
import { getProviderByTypegooseClass } from '../../../transformers/model.transformer';

@modelOptions({ schemaOptions: { timestamps: true } })
export class ColumnKanbanModel {
  @prop({ required: true })
  name: string;

  @prop({ ref: () => TaskKanbanModel, required: true, type: () => [String] })
  taskIds: Ref<TaskKanbanModel>[];
}

export const ColumnProvider = getProviderByTypegooseClass(
  ColumnKanbanModel,
  'Column',
);
