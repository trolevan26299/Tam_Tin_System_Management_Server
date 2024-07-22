// src/calendar/calendar.controller.ts
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
import { CalendarService } from './calendar.service';
import { CreateEventDto } from './dto/calendar.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('Calendar')
@UseGuards(AuthGuard)
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.calendarService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.calendarService.findAll();
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventDto: Partial<CreateEventDto>,
  ) {
    return this.calendarService.update(id, updateEventDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.calendarService.delete(id);
  }
}
