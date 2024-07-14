import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '../../transformers/model.transformer';
import { IKanban, IKanbanColumn } from '../../types/kanban';
import { BoardKanbanModel } from './models/board.model';
import { UpdateColumnDto } from './dto/column.dto';

@Injectable()
export class KanbanService {
  constructor(
    @InjectModel(BoardKanbanModel) private boardModel: Model<BoardKanbanModel>,
  ) {}

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

  async addColumn(columnData: any): Promise<BoardKanbanModel> {
    const board = await this.boardModel.findOne();
    if (!board) {
      throw new Error('Board not found');
    }

    board.columns.push(columnData);
    board.ordered.push(columnData.id);

    return board.save();
  }

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
  // async moveColumn(newOrdered: string[]): Promise<IKanban> {
  //   const board = await this.boardModel.findOne().exec();

  //   if (!board) {
  //     throw new NotFoundException('Board not found');
  //   }

  //   board.ordered = newOrdered;
  //   await board.save();

  //   const result: IKanban = {
  //     columns: board.columns.map((columnId: any) => ({
  //       id: columnId.toString(),
  //       name: '',
  //       taskIds: [],
  //     })),
  //     ordered: board.ordered,
  //   };

  //   return result;
  // }

  // async createTask(createTaskDto: CreateTaskDto): Promise<IKanbanTask> {
  //   const newTask = new this.taskModel(createTaskDto);
  //   await newTask.save();

  //   const column = await this.columnModel.findById(createTaskDto.columnId);
  //   if (!column) {
  //     throw new NotFoundException('Column not found');
  //   }

  //   column.taskIds.push(newTask._id);
  //   await column.save();

  //   const result: IKanbanTask = {
  //     id: newTask._id.toString(),
  //     name: newTask.name,
  //     description: newTask.description,
  //     status: newTask.status,
  //     columnId: newTask.columnId.toString(),
  //     reporter: newTask.reporter,
  //     labels: newTask.labels,
  //     comments: newTask.comments,
  //     assignee: newTask.assignee,
  //     due: newTask.due,
  //     priority: newTask.priority,
  //     attachments: newTask.attachments,
  //   };

  //   return result;
  // }

  // async updateTask(
  //   taskId: string,
  //   updateTaskDto: UpdateTaskDto,
  // ): Promise<IKanbanTask> {
  //   const updatedTask = await this.taskModel
  //     .findByIdAndUpdate(taskId, updateTaskDto, { new: true })
  //     .exec();

  //   if (!updatedTask) {
  //     throw new NotFoundException('Task not found');
  //   }

  //   const result: IKanbanTask = {
  //     id: updatedTask._id.toString(),
  //     name: updatedTask.name,
  //     description: updatedTask.description,
  //     status: updatedTask.status,
  //     columnId: updatedTask.columnId.toString(),
  //     reporter: updatedTask.reporter,
  //     labels: updatedTask.labels,
  //     comments: updatedTask.comments,
  //     assignee: updatedTask.assignee,
  //     due: updatedTask.due,
  //     priority: updatedTask.priority,
  //     attachments: updatedTask.attachments,
  //   };

  //   return result;
  // }

  //   async deleteTask(columnId: string, taskId: string): Promise<void> {
  //     // Xóa task khỏi database
  //     await this.taskModel.deleteOne({ _id: taskId }).exec();

  //     // Tìm cột chứa task cần xóa
  //     const column = await this.columnModel.findById(columnId).exec();
  //     if (!column) {
  //       throw new NotFoundException('Column not found');
  //     }

  //     // Sử dụng filter để loại bỏ taskId khỏi mảng taskIds
  //     column.taskIds = column.taskIds.filter((id) => id.toString() !== taskId);

  //     // Lưu lại cột đã cập nhật
  //     await column.save();
  //   }
  // }
}
