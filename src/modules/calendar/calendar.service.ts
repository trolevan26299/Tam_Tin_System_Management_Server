// src/calendar/calendar.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

import { CalendarModel } from './models/calendar.model';
import { CreateEventDto } from './dto/calendar.dto';
import { InjectModel } from '@app/transformers/model.transformer';

@Injectable()
export class CalendarService {
  constructor(
    @InjectModel(CalendarModel) private calendarModel: Model<CalendarModel>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<CalendarModel> {
    const createdEvent = new this.calendarModel(createEventDto);
    return createdEvent.save();
  }

  async findAll(): Promise<CalendarModel[]> {
    return this.calendarModel.find().exec();
  }

  async update(
    id: string,
    updateEventDto: Partial<CreateEventDto>,
  ): Promise<CalendarModel | null> {
    const updatedEvent = await this.calendarModel
      .findOneAndUpdate({ id }, updateEventDto, { new: true })
      .exec();
    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return updatedEvent;
  }

  async delete(id: string): Promise<CalendarModel | null> {
    return this.calendarModel.findOneAndDelete({ id }).exec();
  }
}
