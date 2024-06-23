// kanban.module.ts
import { Module } from '@nestjs/common';
import { KanbanController } from './kanban.controller';
import { KanbanService } from './kanban.service';
import { BoardProvider } from './models/board.model';
import { ColumnProvider } from './models/column.model';
import { TaskProvider } from './models/task.model';

@Module({
  imports: [],
  controllers: [KanbanController],
  providers: [KanbanService, BoardProvider, ColumnProvider, TaskProvider],
})
export class KanbanModule {}
