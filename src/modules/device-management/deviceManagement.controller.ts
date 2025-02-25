/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { DeviceManagerService } from './deviceManagement.service';
import {
  AddNumberDetailToDeviceDto,
  CreateUpdateDeviceDTO,
  filterDeviceDto,
} from './dto/deviceManagement.dto';
import { DeviceManagementModel } from './models/deviceManagement.model';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('DeviceManagement')
@Controller('device')
export class DeviceManagerController {
  constructor(private readonly deviceManagementService: DeviceManagerService) {}

  // API CREATE DEVICE
  @Post()
  async create(
    @Body() createDeviceDto: CreateUpdateDeviceDTO,
  ): Promise<DeviceManagementModel> {
    return this.deviceManagementService.createDevice(createDeviceDto);
  }

  // API GET ALL DEVICE
  @Get('list')
  async getAllDevice(
    @Query() QueryAllDeviceData: filterDeviceDto,
  ): Promise<DeviceManagementModel[]> {
    return this.deviceManagementService.getAllDevice(QueryAllDeviceData);
  }

  // API GET DETAIL DEVICE
  @Get(':id')
  async getDetailDevice(
    @Param('id') id: string,
  ): Promise<DeviceManagementModel> {
    return this.deviceManagementService.getDetailDevice(id);
  }

  // API UPDATE DEVICE
  @Put(':id')
  async updateDevice(
    @Param('id') id: string,
    @Body() updateDeviceDto: CreateUpdateDeviceDTO,
  ): Promise<DeviceManagementModel> {
    return this.deviceManagementService.updateDevice(id, updateDeviceDto);
  }

  // Thêm số lượng sản phẩm mới vào kho
  @Patch(':id')
  async addNumberDetailToDevice(
    @Param('id') id: string,
    @Body() addNumberDetailToDeviceDto: AddNumberDetailToDeviceDto,
  ): Promise<DeviceManagementModel> {
    return this.deviceManagementService.addNumberDetailToDevice(
      id,
      addNumberDetailToDeviceDto,
    );
  }
  // API UPDATE DEVICE
  @Delete(':id')
  async deleteDevice(@Param('id') id: string): Promise<any> {
    return this.deviceManagementService.deleteDevice(id);
  }

  // API DELETE DEVICE BY ID
  @Delete('delete-by-device-id/:deviceId')
  async deleteByDeviceId(@Param('deviceId') deviceId: string): Promise<any> {
    return this.deviceManagementService.deleteByDeviceId(deviceId);
  }
}
