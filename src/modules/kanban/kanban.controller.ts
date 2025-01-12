import { AuthGuard } from '@app/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClearColumnDto, MoveTaskDto, UpdateColumnDto } from './dto/board.dto';
import { KanbanService } from './kanban.service';

@ApiBearerAuth()
@ApiTags('Kanban')
@UseGuards(AuthGuard)
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
  // Update order column
  @Post('column/order')
  async updateOrderColumn(@Body() newOrdered: string[]) {
    return this.kanbanService.updateOrderColumn(newOrdered);
  }

  // Update order task same column
  @Post('task-same-column/order')
  async updateOrderTaskSameColumn(
    @Body() body: { columnId: string; taskIds: string[] },
  ): Promise<any> {
    const { columnId, taskIds } = body;
    console.log('columnId', columnId);
    console.log('taskIds', taskIds);
    return this.kanbanService.updateOrderTaskSameColumn(columnId, taskIds);
  }

  // Update order task another column
  @Post('task-another-column/order')
  async updateOrderTaskAnotherColumn(
    @Body() moveTaskDto: MoveTaskDto,
  ): Promise<any> {
    return await this.kanbanService.updateOrderTaskAnotherColumn(moveTaskDto);
  }

  // Update a task
  @Put('task/:taskId')
  async updateTask(
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: any,
  ) {
    return this.kanbanService.updateTask(taskId, updateTaskDto);
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
