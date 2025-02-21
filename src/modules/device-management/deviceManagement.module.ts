/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { DeviceManagerController } from './deviceManagement.controller';
import { DeviceManagerService } from './deviceManagement.service';
import { DeviceManagementProvider } from './models/deviceManagement.model';
import { DeviceListProvider } from './models/deviceList.model';
import { LinhKienModule } from '../linh-kien/linhKien.module';
import { LinhKienProvider } from '../linh-kien/models/linhKien.model';

@Module({
  imports: [forwardRef(() => LinhKienModule)],
  controllers: [DeviceManagerController],
  providers: [DeviceManagementProvider,  DeviceListProvider ,DeviceManagerService, LinhKienProvider],
  exports: [DeviceManagerService],
})
export class DeviceManagerModule {}
