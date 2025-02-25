import { modelOptions, prop } from '@typegoose/typegoose';
import { getProviderByTypegooseClass } from '../../../transformers/model.transformer';

@modelOptions({ schemaOptions: { timestamps: true } })
export class DeviceListModel {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  id_device: string;

  @prop({ required: true, default: 'inventory' })
  status: string;

  @prop()
  type_customer?: string;

  @prop()
  name_customer?: string;

  @prop()
  warranty?: number;

  @prop()
  date_buy?: string;

  @prop({ type: () => [RepairHistory], default: [] })
  history_repair: RepairHistory[];
}

class LinhKien {
  @prop()
  id: string;

  @prop()
  name: string;

  @prop()
  total: number;
}

class RepairHistory {
  @prop()
  type_repair: string;

  @prop()
  date_repair: string;

  @prop({ type: () => [LinhKien] })
  linh_kien: LinhKien[];

  @prop()
  staff_repair: string;

  @prop()
  note: string;
}

export const DeviceListProvider = getProviderByTypegooseClass(
  DeviceListModel,
  'device_lists',
);
