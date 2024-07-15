import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { KanbanService } from './kanban.service';
import { ClearColumnDto, UpdateColumnDto } from './dto/board.dto';

@Controller('kanban')
export class KanbanController {
  constructor(private readonly kanbanService: KanbanService) {}

  // Get all columns and tasks
  @Get()
  async getBoard(): Promise<any> {
    return this.kanbanService.getBoard();
  }

  // Add a new column
  @Post('column')
  async addColumn(
    @Body() columnData: { id: string; name: string; taskIds: string[] },
  ) {
    return this.kanbanService.addColumn(columnData);
  }

  // Add a new task
  @Post('task')
  async addTask(@Body() taskData: any) {
    return this.kanbanService.addTask(taskData);
  }

  // Update a column
  @Put('column/:columnId')
  async updateColumn(
    @Param('columnId') columnId: string,
    @Body() updateColumnDto: UpdateColumnDto,
  ) {
    return this.kanbanService.updateColumn(columnId, updateColumnDto);
  }

  // Delete a column
  @Delete('column/:columnId')
  async deleteColumn(@Param('columnId') columnId: string): Promise<void> {
    return this.kanbanService.deleteColumn(columnId);
  }

  // Clear a column
  @Post('column/clear')
  async clearColumn(@Body() clearColumnDto: ClearColumnDto): Promise<void> {
    return this.kanbanService.clearColumn(clearColumnDto.columnId);
  }

  // Delete a task
  @Delete('task/:columnId/:taskId')
  async deleteTask(
    @Param('columnId') columnId: string,
    @Param('taskId') taskId: string,
  ): Promise<void> {
    return this.kanbanService.deleteTask(columnId, taskId);
  }
}
