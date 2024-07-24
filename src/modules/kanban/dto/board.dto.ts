import { IsArray, IsString } from 'class-validator';

export class UpdateColumnDto {
  @IsString()
  readonly name: string;
}

export class ClearColumnDto {
  columnId: string;
}

export class MoveTaskDto {
  @IsString()
  sourceColumnId: string;

  @IsString()
  destinationColumnId: string;

  @IsArray()
  sourceTaskIds: string[];

  @IsArray()
  destinationTaskIds: string[];

  @IsString()
  taskMoveId: string;
}
