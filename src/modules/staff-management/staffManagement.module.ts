import { Module } from '@nestjs/common';
import { StaffManagerController } from './staffManagement.controller';
import { StaffManagementProvider } from './models/staffManagement.model';
import { StaffManagerService } from './staffManagement.service';
import { LinhKienProvider } from '../linh-kien/models/linhKien.model';

@Module({
  imports: [],
  controllers: [StaffManagerController],
  providers: [StaffManagementProvider, LinhKienProvider, StaffManagerService],
  exports: [StaffManagerService],
})
export class StaffManagerModule {}
