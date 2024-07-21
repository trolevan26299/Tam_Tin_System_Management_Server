// kanban.module.ts
import { Module } from '@nestjs/common';
import { KanbanController } from './kanban.controller';
import { KanbanService } from './kanban.service';
import { BoardProvider } from './models/board.model';

@Module({
  imports: [],
  controllers: [KanbanController],
  providers: [KanbanService, BoardProvider],
})
export class KanbanModule {}
