import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  QueryStaffAccessoriesDto,
  StaffAccessoriesMngDto,
} from './dto/staffAccessoriesManagement.dto';
import { StaffAccessoriesManagementModel } from './models/staffAccessoriesManagement.model';
import { StaffAccessoriesManagerService } from './staffAccessoriesManagement.service';

@ApiTags('StaffAccessoriesManagement')
@Controller('staffAccessories')
export class StaffAccessoriesManagerController {
  constructor(
    private readonly staffAccessoriesManagementService: StaffAccessoriesManagerService,
  ) {}

  @Post()
  async createStaffAccessories(
    @Body() body: StaffAccessoriesMngDto,
  ): Promise<StaffAccessoriesManagementModel> {
    return await this.staffAccessoriesManagementService.createStaffAccessories(
      body,
    );
  }

  @Get('list')
  async getAllStaffAccessories(
    @Query() query: QueryStaffAccessoriesDto,
  ): Promise<any> {
    return await this.staffAccessoriesManagementService.getAllStaffAccessories(
      query,
    );
  }
}
