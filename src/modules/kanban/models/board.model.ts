/* eslint-disable prettier/prettier */
import { Ref, modelOptions, prop } from '@typegoose/typegoose';
import { ColumnKanbanModel } from './column.model';
import { getProviderByTypegooseClass } from '../../../transformers/model.transformer';

@modelOptions({ schemaOptions: { timestamps: true } })
export class BoardKanbanModel {
  @prop({
    ref: () => ColumnKanbanModel,
    required: true,
    type: () => [ColumnKanbanModel],
  })
  columns: Ref<ColumnKanbanModel>[];

  @prop({ required: true, type: () => [String] })
  ordered: string[];
}

export const BoardProvider = getProviderByTypegooseClass(
  BoardKanbanModel,
  'Board',
);
