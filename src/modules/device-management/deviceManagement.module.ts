/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { DeviceManagerController } from './deviceManagement.controller';
import { DeviceManagerService } from './deviceManagement.service';
import { DeviceManagementProvider } from './models/deviceManagement.model';
import { DeviceListProvider } from './models/deviceList.model';

@Module({
  imports: [],
  controllers: [DeviceManagerController],
  providers: [DeviceManagementProvider,  DeviceListProvider ,DeviceManagerService],
  exports: [DeviceManagerService],
})
export class DeviceManagerModule {}
