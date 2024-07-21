/* eslint-disable prettier/prettier */
import { modelOptions, prop } from '@typegoose/typegoose';
import { getProviderByTypegooseClass } from '../../../transformers/model.transformer';

@modelOptions({ schemaOptions: { timestamps: true } })
export class CalendarModel {
  @prop({ required: true })
  id: string;

  @prop({ required: true })
  color: string;

  @prop({ required: true })
  title: string;

  @prop({ required: true })
  allDay: boolean;

  @prop()
  description: string;

  @prop({ required: true })
  start: number;

  @prop({ required: true })
  end: number;
}

export const CalendarProvider = getProviderByTypegooseClass(
  CalendarModel,
  'calendar',
);
