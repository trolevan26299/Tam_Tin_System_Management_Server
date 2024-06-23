import { IsString, IsArray } from 'class-validator';

export class CreateColumnDto {
  @IsString()
  readonly name: string;

  @IsArray()
  readonly taskIds: string[];
}

export class UpdateColumnDto {
  @IsString()
  readonly name: string;
}
