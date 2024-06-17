import { IsString, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly columnId: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}

export class UpdateTaskDto {
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly status?: 'todo' | 'in-progress' | 'done';
}
