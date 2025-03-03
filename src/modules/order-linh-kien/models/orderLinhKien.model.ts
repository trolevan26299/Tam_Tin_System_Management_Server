import { prop, Ref } from '@typegoose/typegoose';
import { IsDefined, IsString, IsNumber, IsOptional } from 'class-validator';
import { getProviderByTypegooseClass } from '../../../transformers/model.transformer';
import { LinhKienModel } from '../../linh-kien/models/linhKien.model';
import { CustomerManagementModel } from '../../customer-management/models/customerManagement.model';

export class ChiTietLinhKien {
  @prop({ required: true, ref: () => LinhKienModel })
  id_linh_kien: Ref<LinhKienModel>;

  @prop({ required: true })
  so_luong: number;

  @prop({ required: true })
  price: number;
}

export class OrderLinhKienModel {
  @prop({ required: true, type: () => [ChiTietLinhKien] })
  chi_tiet_linh_kien: ChiTietLinhKien[];

  @prop({ required: true, ref: () => CustomerManagementModel })
  id_khach_hang: Ref<CustomerManagementModel>;

  @prop()
  ghi_chu?: string;

  @prop({ required: true })
  tong_tien: number;

  @prop({ required: true })
  loi_nhuan: number;

  @prop({ default: () => new Date().toISOString() })
  ngay_tao: string;

  @prop()
  ngay_cap_nhat?: string;
}

export const OrderLinhKienProvider = getProviderByTypegooseClass(
  OrderLinhKienModel,
  'order_linh_kien',
);