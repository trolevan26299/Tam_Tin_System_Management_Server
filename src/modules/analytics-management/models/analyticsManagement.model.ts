import { Schema, Document, model } from 'mongoose';

export interface OrderManagementModel extends Document {
  delivery_date: Date;
}

const OrderManagementSchema = new Schema<OrderManagementModel>({
  delivery_date: { type: Date, required: true },
});

export const OrderManagement = model<OrderManagementModel>(
  'OrderManagement',
  OrderManagementSchema,
);
