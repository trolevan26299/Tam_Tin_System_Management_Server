import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  DetailStaffDto,
  ListStaffDto,
  QueryStaffDto,
  StaffMngDto,
} from './dto/staffManagement.dto';
import { StaffManagementModel } from './models/staffManagement.model';
import { StaffManagerService } from './staffManagement.service';

@ApiTags('StaffManagement')
@Controller('staff')
export class StaffManagerController {
  constructor(private readonly staffManagementService: StaffManagerService) {}

  @Get('list')
  async getAllStaff(@Query() query: QueryStaffDto): Promise<ListStaffDto> {
    return await this.staffManagementService.getListStaff(query);
  }

  @Post()
  async createStaff(@Body() body: StaffMngDto): Promise<StaffManagementModel> {
    return await this.staffManagementService.createStaff(body);
  }

  @Put(':id')
  async updateStaff(
    @Param('id') id: string,
    @Body() body: StaffMngDto,
  ): Promise<StaffManagementModel> {
    return await this.staffManagementService.updateStaff(id, body);
  }

  @Get(':id')
  async getStaffById(@Param('id') id: string): Promise<DetailStaffDto> {
    return await this.staffManagementService.getStaffById(id);
  }

  @Delete(':id')
  async deleteStaffById(
    @Param('id') id: string,
  ): Promise<StaffManagementModel> {
    return await this.staffManagementService.deleteStaffById(id);
  }
}
