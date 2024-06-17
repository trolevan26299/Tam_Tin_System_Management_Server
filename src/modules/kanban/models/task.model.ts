/* eslint-disable prettier/prettier */
import { Ref, modelOptions, prop } from '@typegoose/typegoose';
import { ColumnKanbanModel } from './column.model';
import { getProviderByTypegooseClass } from '../../../transformers/model.transformer';

@modelOptions({ schemaOptions: { timestamps: true } })
export class TaskKanbanModel {
  @prop({ required: true })
  title: string;

  @prop()
  description?: string;

  @prop({ enum: ['todo', 'in-progress', 'done'], default: 'todo' })
  status: string;

  @prop({ ref: () => ColumnKanbanModel, required: true })
  columnId: Ref<ColumnKanbanModel>;
}

export const TaskProvider = getProviderByTypegooseClass(
  TaskKanbanModel,
  'Task',
);
