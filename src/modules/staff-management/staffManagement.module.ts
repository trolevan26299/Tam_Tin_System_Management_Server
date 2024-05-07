import { Module } from '@nestjs/common';
import { StaffManagerController } from './staffManagement.controller';
import { StaffManagementProvider } from './models/staffManagement.model';
import { StaffManagerService } from './staffManagement.service';

@Module({
  imports: [],
  controllers: [StaffManagerController],
  providers: [StaffManagementProvider, StaffManagerService],
  exports: [StaffManagerService],
})
export class StaffManagerModule {}
