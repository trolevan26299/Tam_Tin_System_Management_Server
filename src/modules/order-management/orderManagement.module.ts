import { Module } from '@nestjs/common';
import { OrderManagementController } from './orderManagement.controller';
import { OrderManagerService } from './orderManagement.service';
import { OrderManagementProvider } from './models/orderManagement.model';

@Module({
  imports: [],
  controllers: [OrderManagementController],
  providers: [OrderManagementProvider, OrderManagerService],
  exports: [OrderManagerService],
})
export class SubCategoryManagerModule {}
