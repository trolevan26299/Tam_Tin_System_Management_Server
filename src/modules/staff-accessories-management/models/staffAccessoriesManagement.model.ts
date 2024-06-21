import { DeviceManagementModel } from '@app/modules/device-management/models/deviceManagement.model';
import { StaffManagementModel } from '@app/modules/staff-management/models/staffManagement.model';
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer';
import { Ref, prop } from '@typegoose/typegoose';

export class StaffAccessoriesManagementModel {
  @prop({ ref: StaffManagementModel, required: true })
  staff: Ref<StaffManagementModel>;

  @prop({ required: true })
  date: string;

  @prop({ ref: () => DeviceManagementModel, required: true })
  device: Ref<DeviceManagementModel>;

  @prop({ required: true })
  quantity: number;

  @prop({ default: 'advance', required: true })
  status: string;

  @prop()
  note?: string;

  @prop()
  regDt?: string;

  @prop()
  modDt?: string;
}

export const StaffAccessoriesManagementProvider = getProviderByTypegooseClass(
  StaffAccessoriesManagementModel,
  'staff_accessories',
);
