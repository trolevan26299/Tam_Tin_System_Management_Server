import { Module } from '@nestjs/common';
import { CustomerManagementProvider } from '../customer-management/models/customerManagement.model';
import { DeviceManagementProvider } from '../device-management/models/deviceManagement.model';
import { OrderManagementProvider } from './models/orderManagement.model';
import { OrderManagementController } from './orderManagement.controller';
import { OrderManagerService } from './orderManagement.service';

@Module({
  imports: [],
  controllers: [OrderManagementController],
  providers: [
    OrderManagementProvider,
    DeviceManagementProvider,
    CustomerManagementProvider,
    OrderManagerService,
  ],
  exports: [OrderManagerService],
})
export class OrderManagerModule {}
