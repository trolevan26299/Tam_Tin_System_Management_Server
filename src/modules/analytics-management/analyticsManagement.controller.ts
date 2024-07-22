import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnalyticsManagementService } from './analyticsManagement.service';
import { QueryAnalyTicsDto } from './dto/analyticsManagement.dto';

@ApiTags('AnalyticsManagement')
@Controller('analytics')
export class AnalyticsManagementController {
  constructor(
    private readonly analyticsManagementService: AnalyticsManagementService,
  ) {}

  @Get()
  async getAnalytics(@Query() query: QueryAnalyTicsDto): Promise<any> {
    await this.analyticsManagementService.getAnalytics(query);
  }
}
