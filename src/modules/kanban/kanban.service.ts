import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '../../transformers/model.transformer';
import { IKanban, IKanbanTask } from '../../types/kanban';
import { BoardKanbanModel } from './models/board.model';

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

    const tasks: Record<string, IKanbanTask[]> = {};
    for (const columnId in board.tasks) {
      tasks[columnId] = board.tasks[columnId].map((task) => ({
        id: task.id,
        name: task.name,
        reporter: task.reporter,
        labels: task.labels,
        comments: task.comments,
        assignee: task.assignee,
        description: task.description,
        due: task.due,
        priority: task.priority,
        attachments: task.attachments,
        status: task.status,
        columnId: task.columnId,
      }));
    }

    const result: IKanban = {
      columns: columnsWithTasks,
      tasks: tasks,
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

    const column = board.columns.find((col) => col.id === taskData.columnId);
    if (!column) {
      throw new Error('Column not found');
    }

    column.taskIds.push(taskData.id);

    if (!board.tasks[taskData.columnId]) {
      board.tasks[taskData.columnId] = [];
    }

    const task = { ...taskData };
    delete task.columnId;
    console.log('task:', task);
    console.log('ádsadasfa', board.tasks[taskData.columnId]);
    board.tasks[taskData.columnId].push(task);

    return board.save();
  }

  // async createColumn(createColumnDto: CreateColumnDto): Promise<IKanbanColumn> {
  //   const newColumn = new this.columnModel(createColumnDto);
  //   await newColumn.save();

  //   const board = await this.boardModel.findOne();
  //   if (!board) {
  //     throw new NotFoundException('Board not found');
  //   }

  //   board.columns.push(newColumn._id);
  //   board.ordered.push(newColumn._id.toString());
  //   await board.save();

  //   const result: IKanbanColumn = {
  //     id: newColumn._id.toString(),
  //     name: newColumn.name,
  //     taskIds: newColumn.taskIds.map((taskId) => taskId.toString()),
  //   };

  //   return result;
  // }

  // async updateColumn(
  //   columnId: string,
  //   updateColumnDto: UpdateColumnDto,
  // ): Promise<IKanbanColumn> {
  //   const updatedColumn = await this.columnModel
  //     .findByIdAndUpdate(columnId, updateColumnDto, { new: true })
  //     .exec();

  //   if (!updatedColumn) {
  //     throw new NotFoundException('Column not found');
  //   }

  //   const result: IKanbanColumn = {
  //     id: updatedColumn._id.toString(),
  //     name: updatedColumn.name,
  //     taskIds: updatedColumn.taskIds.map((taskId) => taskId.toString()),
  //   };

  //   return result;
  // }

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

  // async deleteColumn(columnId: string): Promise<void> {
  //   const column = await this.columnModel.findById(columnId).exec();
  //   if (!column) {
  //     throw new NotFoundException('Column not found');
  //   }
  //   await this.columnModel.deleteOne({ _id: columnId }).exec();

  //   const board = await this.boardModel.findOne().exec();
  //   if (!board) {
  //     throw new NotFoundException('Board not found');
  //   }

  //   board.columns = board.columns.filter(
  //     (colId) => colId.toString() !== columnId,
  //   );
  //   board.ordered = board.ordered.filter((id) => id !== columnId);

  //   await board.save();

  //   // Xóa tất cả các task liên quan đến cột này
  //   await this.taskModel.deleteMany({ _id: { $in: column.taskIds } }).exec();
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
