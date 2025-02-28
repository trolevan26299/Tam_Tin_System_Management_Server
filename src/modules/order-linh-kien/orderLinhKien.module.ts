import { Module } from '@nestjs/common';
import { OrderLinhKienController } from './orderLinhKien.controller';
import { OrderLinhKienService } from './orderLinhKien.service';
import { OrderLinhKienProvider } from './models/orderLinhKien.model';
import { CustomerManagerModule } from '../customer-management/customerManagement.module';
import { LinhKienModule } from '../linh-kien/linhKien.module';

@Module({
  imports: [LinhKienModule, CustomerManagerModule],
  controllers: [OrderLinhKienController],
  providers: [OrderLinhKienService, OrderLinhKienProvider],
  exports: [OrderLinhKienService, OrderLinhKienProvider],
})
export class OrderLinhKienModule {}
