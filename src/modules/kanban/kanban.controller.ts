import { Body, Controller, Get, Post } from '@nestjs/common';
import { KanbanService } from './kanban.service';

@Controller('kanban')
export class KanbanController {
  constructor(private readonly kanbanService: KanbanService) {}

  @Get()
  async getBoard(): Promise<any> {
    return this.kanbanService.getBoard();
  }

  @Post('column')
  async addColumn(
    @Body() columnData: { id: string; name: string; taskIds: string[] },
  ) {
    return this.kanbanService.addColumn(columnData);
  }

  @Post('task')
  async addTask(@Body() taskData: any) {
    return this.kanbanService.addTask(taskData);
  }
  // @Put('column/:columnId')
  // async updateColumn(
  //   @Param('columnId') columnId: string,
  //   @Body() updateColumnDto: UpdateColumnDto,
  // ): Promise<IKanbanColumn> {
  //   return this.kanbanService.updateColumn(columnId, updateColumnDto);
  // }

  // @Post('column/order')
  // async moveColumn(@Body() newOrdered: string[]): Promise<IKanban> {
  //   return this.kanbanService.moveColumn(newOrdered);
  // }

  // @Delete('column/:columnId')
  // async deleteColumn(@Param('columnId') columnId: string): Promise<void> {
  //   return this.kanbanService.deleteColumn(columnId);
  // }

  // @Post('task')
  // async createTask(@Body() createTaskDto: CreateTaskDto): Promise<IKanbanTask> {
  //   return this.kanbanService.createTask(createTaskDto);
  // }

  // @Put('task/:taskId')
  // async updateTask(
  //   @Param('taskId') taskId: string,
  //   @Body() updateTaskDto: UpdateTaskDto,
  // ): Promise<IKanbanTask> {
  //   return this.kanbanService.updateTask(taskId, updateTaskDto);
  // }

  // @Delete('task/:columnId/:taskId')
  // async deleteTask(
  //   @Param('columnId') columnId: string,
  //   @Param('taskId') taskId: string,
  // ): Promise<void> {
  //   return this.kanbanService.deleteTask(columnId, taskId);
  // }
}
