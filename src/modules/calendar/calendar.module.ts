// kanban.module.ts
import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { CalendarProvider } from './models/calendar.model';

@Module({
  imports: [],
  controllers: [CalendarController],
  providers: [CalendarService, CalendarProvider],
})
export class CalendarModule {}
