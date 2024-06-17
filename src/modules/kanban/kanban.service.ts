import { Injectable } from '@nestjs/common';
import { InjectModel } from '../../transformers/model.transformer';
import { Model } from 'mongoose';
import { IKanban, IKanbanColumn, IKanbanTask } from '../../types/kanban';
import { CreateColumnDto, UpdateColumnDto } from './dto/column.dto';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { BoardKanbanModel } from './models/board.model';
import { ColumnKanbanModel } from './models/column.model';
import { TaskKanbanModel } from './models/task.model';

@Injectable()
export class KanbanService {
  constructor(
    @InjectModel(BoardKanbanModel) private boardModel: Model<BoardKanbanModel>,
    @InjectModel(ColumnKanbanModel)
    private columnModel: Model<ColumnKanbanModel>,
    @InjectModel(TaskKanbanModel) private taskModel: Model<TaskKanbanModel>,
  ) {}

  async getBoard(): Promise<IKanban> {
    const board = await this.boardModel
      .findOne()
      .populate({
        path: 'columns',
        populate: {
          path: 'taskIds',
        },
      })
      .exec();

    if (!board) {
      throw new Error('Board not found');
    }
    const result: IKanban = {
      columns: board.columns.map((column: any) => ({
        id: column._id.toString(),
        name: column.name,
        taskIds: column.taskIds.map((task: any) => task._id.toString()),
      })),
      ordered: board.ordered,
    };

    return result;
  }

  async createColumn(createColumnDto: CreateColumnDto): Promise<IKanbanColumn> {
    const newColumn = new this.columnModel(createColumnDto);
    await newColumn.save();

    const board = await this.boardModel.findOne();
    if (!board) {
      throw new Error('Board not found');
    }

    board.columns.push(newColumn._id);
    await board.save();

    const result: IKanbanColumn = {
      id: newColumn._id.toString(),
      name: newColumn.name,
      taskIds: newColumn.taskIds.map((taskId) => taskId.toString()),
    };

    return result;
  }

  async updateColumn(
    columnId: string,
    updateColumnDto: UpdateColumnDto,
  ): Promise<IKanbanColumn> {
    const updatedColumn = await this.columnModel
      .findByIdAndUpdate(columnId, updateColumnDto, { new: true })
      .exec();

    if (!updatedColumn) {
      throw new Error('Column not found');
    }

    const result: IKanbanColumn = {
      id: updatedColumn._id.toString(),
      name: updatedColumn.name,
      taskIds: updatedColumn.taskIds.map((taskId) => taskId.toString()),
    };

    return result;
  }

  async moveColumn(newOrdered: string[]): Promise<IKanban> {
    const board = await this.boardModel.findOne().exec();

    if (!board) {
      throw new Error('Board not found');
    }

    board.ordered = newOrdered;
    await board.save();
    const result: IKanban = {
      columns: board.columns.map((columnId: any) => ({
        id: columnId.toString(),
        name: '',
        taskIds: [],
      })),
      ordered: board.ordered,
    };

    return result;
  }

  async deleteColumn(columnId: string): Promise<void> {
    const column = await this.columnModel.findById(columnId).exec();
    if (!column) {
      throw new Error('Column not found');
    }
    await this.columnModel.deleteOne({ _id: columnId }).exec();

    const board = await this.boardModel.findOne().exec();
    if (!board) {
      throw new Error('Board not found');
    }

    board.columns = board.columns.filter(
      (colId) => colId.toString() !== columnId,
    );
    board.ordered = board.ordered.filter((id) => id !== columnId);

    await board.save();

    // Xóa tất cả các task liên quan đến cột này
    await this.taskModel.deleteMany({ _id: { $in: column.taskIds } }).exec();
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<IKanbanTask> {
    const newTask = new this.taskModel(createTaskDto);
    await newTask.save();

    const column = await this.columnModel.findById(createTaskDto.columnId);
    if (!column) {
      throw new Error('Column not found');
    }

    column.taskIds.push(newTask._id);
    await column.save();

    // Xác nhận rằng newTask.status là một trong các giá trị hợp lệ của union type
    const validStatuses = ['todo', 'in-progress', 'done'] as const;
    if (!validStatuses.includes(newTask.status as any)) {
      throw new Error(`Invalid task status: ${newTask.status}`);
    }

    const result: IKanbanTask = {
      id: newTask._id.toString(),
      title: newTask.title,
      description: newTask.description,
      status: newTask.status as 'todo' | 'in-progress' | 'done',
      columnId: newTask.columnId.toString(),
    };

    return result;
  }

  async updateTask(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<IKanbanTask> {
    const updatedTask = await this.taskModel
      .findByIdAndUpdate(taskId, updateTaskDto, { new: true })
      .exec();

    if (!updatedTask) {
      throw new Error('Task not found');
    }

    // Xác nhận rằng updatedTask.status là một trong các giá trị hợp lệ của union type
    const validStatuses = ['todo', 'in-progress', 'done'] as const;
    if (!validStatuses.includes(updatedTask.status as any)) {
      throw new Error(`Invalid task status: ${updatedTask.status}`);
    }

    const result: IKanbanTask = {
      id: updatedTask._id.toString(),
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status as 'todo' | 'in-progress' | 'done',
      columnId: updatedTask.columnId.toString(),
    };

    return result;
  }

  async deleteTask(columnId: string, taskId: string): Promise<void> {
    // Xóa task khỏi database
    await this.taskModel.deleteOne({ _id: taskId }).exec();

    // Tìm cột chứa task cần xóa
    const column = await this.columnModel.findById(columnId).exec();
    if (!column) {
      throw new Error('Column not found');
    }

    // Sử dụng filter để loại bỏ taskId khỏi mảng taskIds
    column.taskIds = column.taskIds.filter((id) => id.toString() !== taskId);

    // Lưu lại cột đã cập nhật
    await column.save();
  }
}
