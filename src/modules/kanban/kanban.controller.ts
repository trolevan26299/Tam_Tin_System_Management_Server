import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { KanbanService } from './kanban.service';
import { CreateColumnDto, UpdateColumnDto } from './dto/column.dto';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Controller('kanban')
export class KanbanController {
  constructor(private readonly kanbanService: KanbanService) {}

  @Get()
  async getBoard() {
    return this.kanbanService.getBoard();
  }

  @Post('column')
  async createColumn(@Body() createColumnDto: CreateColumnDto) {
    return this.kanbanService.createColumn(createColumnDto);
  }

  @Put('column/:columnId')
  async updateColumn(
    @Param('columnId') columnId: string,
    @Body() updateColumnDto: UpdateColumnDto,
  ) {
    return this.kanbanService.updateColumn(columnId, updateColumnDto);
  }

  @Post('column/order')
  async moveColumn(@Body() newOrdered: string[]) {
    return this.kanbanService.moveColumn(newOrdered);
  }

  @Delete('column/:columnId')
  async deleteColumn(@Param('columnId') columnId: string) {
    return this.kanbanService.deleteColumn(columnId);
  }

  @Post('task')
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.kanbanService.createTask(createTaskDto);
  }

  @Put('task/:taskId')
  async updateTask(
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.kanbanService.updateTask(taskId, updateTaskDto);
  }

  @Delete('task/:columnId/:taskId')
  async deleteTask(
    @Param('columnId') columnId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.kanbanService.deleteTask(columnId, taskId);
  }
}
