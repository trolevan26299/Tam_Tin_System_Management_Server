import { Module } from '@nestjs/common';
import { CustomerManagementController } from './customerManagement.controller';
import { CustomerManagementProvider } from './models/customerManagement.model';
import { CustomerManagerService } from './customerManagement.service';

@Module({
  imports: [],
  controllers: [CustomerManagementController],
  providers: [CustomerManagementProvider, CustomerManagerService],
  exports: [CustomerManagerService],
})
export class CustomerManagerModule {}
