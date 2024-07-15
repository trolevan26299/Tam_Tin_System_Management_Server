import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '../../transformers/model.transformer';
import { IKanban, IKanbanColumn } from '../../types/kanban';
import { BoardKanbanModel } from './models/board.model';
import { UpdateColumnDto } from './dto/board.dto';

@Injectable()
export class KanbanService {
  constructor(
    @InjectModel(BoardKanbanModel) private boardModel: Model<BoardKanbanModel>,
  ) {}
  // Get all columns and tasks
  async getBoard(): Promise<{ board: IKanban }> {
    const board = await this.boardModel.findOne().exec();

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const columnsWithTasks = board.columns.map((column) => ({
      id: column.id,
      name: column.name,
      taskIds: column.taskIds,
    }));

    const result: IKanban = {
      columns: columnsWithTasks,
      tasks: board.tasks,
      ordered: board.ordered,
    };

    return { board: result };
  }

  // Add a new column
  async addColumn(columnData: any): Promise<BoardKanbanModel> {
    const board = await this.boardModel.findOne();
    if (!board) {
      throw new Error('Board not found');
    }

    board.columns.push(columnData);
    board.ordered.push(columnData.id);

    return board.save();
  }
  // Add a new task
  async addTask(taskData: any): Promise<BoardKanbanModel> {
    const board = await this.boardModel.findOne();
    if (!board) {
      throw new Error('Board not found');
    }

    const column = await board.columns.find(
      (col) => col.id === taskData.columnId,
    );
    if (!column) {
      throw new Error('Column not found');
    }

    await column.taskIds.push(taskData.id);
    await board.tasks.push({ task_id: taskData.id, detail: taskData });

    return board.save();
  }
  // Update a column
  async updateColumn(
    columnId: string,
    updateColumnDto: UpdateColumnDto,
  ): Promise<IKanbanColumn> {
    const board = await this.boardModel.findOne().exec();
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    // Tìm cột cần cập nhật trong bảng
    const column = board.columns.find((column) => column.id === columnId);
    if (!column) {
      throw new NotFoundException('Column not found');
    }
    // Cập nhật các trường được truyền lên trong updateColumnDto
    for (const [key, value] of Object.entries(updateColumnDto)) {
      if (value !== undefined) {
        column[key] = value;
      }
    }
    // Lưu lại bảng sau khi cập nhật
    await board.save();

    const result: IKanbanColumn = {
      id: column.id,
      name: column.name,
      taskIds: column.taskIds.map((taskId) => taskId.toString()),
    };

    return result;
  }

  // Delete a column
  async deleteColumn(columnId: string): Promise<void> {
    const board = await this.boardModel.findOne().exec();
    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const columnIndex = board.columns.findIndex(
      (column) => column.id === columnId,
    );
    if (columnIndex === -1) {
      throw new NotFoundException('Column not found');
    }

    const column = board.columns[columnIndex];

    // Xóa cột khỏi bảng
    board.columns.splice(columnIndex, 1);

    // Xóa columnId khỏi danh sách ordered
    board.ordered = board.ordered.filter((id) => id !== columnId);

    // Xóa tất cả các task liên quan đến cột này
    const taskIdsToDelete = column.taskIds;
    board.tasks = board.tasks.filter(
      (task) => !taskIdsToDelete.includes(task.task_id),
    );

    // Lưu lại bảng sau khi cập nhật
    await board.save();
  }
  // Clear a column
  async clearColumn(columnId: string): Promise<void> {
    const board = await this.boardModel.findOne().exec();
    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const columnIndex = board.columns.findIndex(
      (column) => column.id === columnId,
    );
    if (columnIndex === -1) {
      throw new NotFoundException('Column not found');
    }

    const column = board.columns[columnIndex];
    console.log('column', column);
    const taskIdsToDelete = column.taskIds;
    board.tasks = board.tasks.filter(
      (task) => !taskIdsToDelete.includes(task.task_id),
    );
    column.taskIds = [];
    await board.save();
  }
  // Delete a task
  async deleteTask(columnId: string, taskId: string): Promise<void> {
    const board = await this.boardModel.findOne().exec();
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    board.tasks = board.tasks.filter((task) => task.task_id !== taskId);

    // B3: Tìm column cần tìm và xóa taskId khỏi taskIds
    const column = board.columns.find((column) => column.id === columnId);
    if (!column) {
      throw new NotFoundException('Column not found');
    }
    column.taskIds = column.taskIds.filter((id) => id !== taskId);

    // Lưu lại board sau khi cập nhật
    await board.save();
  }
}
