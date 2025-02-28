import { prop, Ref } from '@typegoose/typegoose';
import { IsDefined, IsString, IsNumber, IsOptional } from 'class-validator';
import { getProviderByTypegooseClass } from '../../../transformers/model.transformer';
import { LinhKienModel } from '../../linh-kien/models/linhKien.model';
import { CustomerManagementModel } from '../../customer-management/models/customerManagement.model';

export class OrderLinhKienModel {
  @IsString()
  @IsDefined()
  @prop({ required: true, ref: () => LinhKienModel })
  id_linh_kien: Ref<LinhKienModel>;

  @IsNumber()
  @IsDefined()
  @prop({ required: true })
  so_luong: number;

  @IsString()
  @IsDefined()
  @prop({ required: true, ref: () => CustomerManagementModel })
  id_khach_hang: Ref<CustomerManagementModel>;

  @IsString()
  @IsOptional()
  @prop()
  ghi_chu?: string;

  @IsNumber()
  @IsDefined()
  @prop({ required: true })
  tong_tien: number;

  @IsString()
  @prop({ default: () => new Date().toISOString() })
  ngay_tao: string;

  @IsString()
  @prop()
  ngay_cap_nhat?: string;
}

export const OrderLinhKienProvider = getProviderByTypegooseClass(
  OrderLinhKienModel,
  'order_linh_kien',
);
