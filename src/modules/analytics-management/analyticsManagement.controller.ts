import { AuthGuard } from '@app/guards/auth.guard';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AnalyticsManagementService } from './analyticsManagement.service';
import {
  ListAnalyTicsDto,
  QueryAnalyTicsDto,
} from './dto/analyticsManagement.dto';

@ApiBearerAuth()
@ApiTags('AnalyticsManagement')
@UseGuards(AuthGuard)
@Controller('analytics')
export class AnalyticsManagementController {
  constructor(
    private readonly analyticsManagementService: AnalyticsManagementService,
  ) {}

  @Get()
  async getAnalytics(
    @Query() query: QueryAnalyTicsDto,
  ): Promise<ListAnalyTicsDto> {
    return await this.analyticsManagementService.getAnalytics(query);
  }
}
