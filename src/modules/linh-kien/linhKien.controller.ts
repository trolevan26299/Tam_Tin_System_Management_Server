import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  CreateLinhKienDTO,
  FilterLinhKienDto,
  LinhKienDto,
} from './dto/linhKien.dto';
import { LinhKienService } from './linhKien.service';
import { AuthGuard } from '@app/guards/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('LinhKien')
@Controller('linh-kien')
export class LinhKienController {
  constructor(private readonly linhKienService: LinhKienService) {}

  @Get()
  async getList(@Query() query: FilterLinhKienDto): Promise<LinhKienDto> {
    console.log('🚀 ~ LinhKienController ~ getList ~ query:', query);
    return await this.linhKienService.getList(query);
  }

  @Post()
  async create(
    @Body() createDto: CreateLinhKienDTO,
    @Request() req: any,
  ): Promise<any> {
    return this.linhKienService.create(createDto, req);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Query('passcode') passcode: number,
  ): Promise<any> {
    return this.linhKienService.deleteLinhKien(id, Number(passcode));
  }
}
