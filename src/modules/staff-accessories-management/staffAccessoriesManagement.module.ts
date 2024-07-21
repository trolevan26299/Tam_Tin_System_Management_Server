import { Module } from '@nestjs/common';
import { DeviceManagementProvider } from '../device-management/models/deviceManagement.model';
import { StaffAccessoriesManagementProvider } from './models/staffAccessoriesManagement.model';
import { StaffAccessoriesManagerController } from './staffAccessoriesManagement.controller';
import { StaffAccessoriesManagerService } from './staffAccessoriesManagement.service';

@Module({
  imports: [],
  controllers: [StaffAccessoriesManagerController],
  providers: [
    StaffAccessoriesManagementProvider,
    DeviceManagementProvider,
    StaffAccessoriesManagerService,
  ],
  exports: [StaffAccessoriesManagerService],
})
export class StaffAccessoriesManagerModule {}
