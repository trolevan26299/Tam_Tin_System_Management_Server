import { IsString } from 'class-validator';

export class UpdateColumnDto {
  @IsString()
  readonly name: string;
}

export class ClearColumnDto {
  columnId: string;
}
