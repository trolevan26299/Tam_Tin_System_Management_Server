/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { DeviceManagerService } from './deviceManagement.service';
import {
  CreateUpdateDeviceDTO,
  filterDeviceDto,
} from './dto/deviceManagement.dto';
import { DeviceManagementModel } from './models/deviceManagement.model';

@ApiBearerAuth()
@ApiTags('DeviceManagement')
@Controller('device')
export class DeviceManagerController {
  constructor(private readonly deviceManagementService: DeviceManagerService) {}

  // API CREATE DEVICE
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createDeviceDto: CreateUpdateDeviceDTO): Promise<any> {
    return this.deviceManagementService.createDevice(createDeviceDto);
  }

  // API GET ALL DEVICE
  @UseGuards(AuthGuard)
  @Post('list')
  async getAllDevice(
    @Body() BodyGetAllDeviceData: filterDeviceDto,
  ): Promise<DeviceManagementModel[]> {
    return this.deviceManagementService.getAllDevice(BodyGetAllDeviceData);
  }

  // API GET DETAIL DEVICE
  @UseGuards(AuthGuard)
  @Get(':id')
  async getDetailDevice(
    @Param('id') id: string,
  ): Promise<DeviceManagementModel> {
    return this.deviceManagementService.getDetailDevice(id);
  }

  // API UPDATE DEVICE
  @UseGuards(AuthGuard)
  @Put(':id')
  async updateDevice(
    @Param('id') id: string,
    @Body() updateDeviceDto: CreateUpdateDeviceDTO,
  ): Promise<DeviceManagementModel> {
    return this.deviceManagementService.updateDevice(id, updateDeviceDto);
  }
  // API UPDATE DEVICE
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteDevice(@Param('id') id: string): Promise<any> {
    return this.deviceManagementService.deleteDevice(id);
  }
}
