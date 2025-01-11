import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  CreateLinhKienDTO,
  DeleteLinhKienDTO,
  FilterLinhKienDto,
} from './dto/linhKien.dto';
import { LinhKienService } from './linhKien.service';
import { AuthGuard } from '@app/guards/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('LinhKien')
@Controller('linh-kien')
export class LinhKienController {
  constructor(private readonly linhKienService: LinhKienService) {}

  @Get('list')
  async getList(@Query() query: FilterLinhKienDto) {
    return this.linhKienService.getList(query);
  }

  @Post()
  async create(@Body() createDto: CreateLinhKienDTO) {
    return this.linhKienService.create(createDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Body() deleteDto: DeleteLinhKienDTO) {
    return this.linhKienService.deleteLinhKien(id, deleteDto.passcode);
  }
}
