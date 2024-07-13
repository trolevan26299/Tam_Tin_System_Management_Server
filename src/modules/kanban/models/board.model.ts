/* eslint-disable prettier/prettier */
import { modelOptions, prop } from '@typegoose/typegoose';
import { getProviderByTypegooseClass } from '../../../transformers/model.transformer';

@modelOptions({ schemaOptions: { timestamps: true } })
class Column {
  @prop({ required: true })
  id: string;

  @prop({ required: true })
  name: string;
  @prop({ required: true })
  taskIds: string[];
}
export class BoardKanbanModel {
  @prop({ required: true, type: () => [Column] })
  columns: Column[];

  @prop({ required: true, type: () => Object })
  tasks: Record<string, any[]>;

  @prop({ required: true, type: () => [String] })
  ordered: string[];
}

export const BoardProvider = getProviderByTypegooseClass(
  BoardKanbanModel,
  'Board',
);
