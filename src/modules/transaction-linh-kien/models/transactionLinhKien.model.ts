import { prop } from '@typegoose/typegoose';
import { IsDefined, IsString, IsNumber } from 'class-validator';
import { getProviderByTypegooseClass } from '../../../transformers/model.transformer';

export class NhanVienDto {
  @IsString()
  @prop()
  name?: string;

  @IsString()
  @prop()
  id?: string;
}

export class TransactionLinhKienModel {
  @IsString()
  @IsDefined()
  @prop({ required: true })
  name_linh_kien: string;

  @prop()
  date_update: string;

  @IsString()
  @prop({ enum: ['Bổ sung', 'Ứng', 'Sửa chữa'] })
  type: string;

  @prop({ type: () => NhanVienDto })
  nhan_vien?: NhanVienDto;

  @IsString()
  @prop()
  nguoi_tao: string;

  @IsString()
  @prop({ required: false })
  noi_dung?: string;

  @IsNumber()
  @prop({ required: true })
  total: number;

  @prop()
  create_date: string;
}

export const TransactionLinhKienProvider = getProviderByTypegooseClass(
  TransactionLinhKienModel,
  'transaction_linh_kien',
);
