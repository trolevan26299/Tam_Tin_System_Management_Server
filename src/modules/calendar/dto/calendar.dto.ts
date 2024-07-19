// src/calendar/dto/create-event.dto.ts
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly color: string;

  @IsString()
  readonly title: string;

  @IsBoolean()
  readonly allDay: boolean;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsNumber()
  readonly start: number;

  @IsNumber()
  readonly end: number;
}
