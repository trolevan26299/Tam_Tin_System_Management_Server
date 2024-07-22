import { Module } from '@nestjs/common';
import { CustomerManagementProvider } from '../customer-management/models/customerManagement.model';
import { DeviceManagementProvider } from '../device-management/models/deviceManagement.model';
import { OrderManagementProvider } from '../order-management/models/orderManagement.model';
import { AnalyticsManagementController } from './analyticsManagement.controller';
import { AnalyticsManagementService } from './analyticsManagement.service';

@Module({
  imports: [],
  controllers: [AnalyticsManagementController],
  providers: [
    OrderManagementProvider,
    DeviceManagementProvider,
    CustomerManagementProvider,
    AnalyticsManagementService,
    AnalyticsManagementModule,
  ],
})
export class AnalyticsManagementModule {}
