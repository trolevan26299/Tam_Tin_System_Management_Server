import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { Model } from 'mongoose';
import { InjectModel } from '../../transformers/model.transformer';
import { IKanban, IKanbanColumn } from '../../types/kanban';
import { MoveTaskDto, UpdateColumnDto } from './dto/board.dto';
import { BoardKanbanModel } from './models/board.model';

@Injectable()
export class KanbanService {
  constructor(
    @InjectModel(BoardKanbanModel) private boardModel: Model<BoardKanbanModel>,
  ) {}

  escapeMarkdownV2 = (text: string) => {
    return text
      .replace(/_/g, '\\_')
      .replace(/\*/g, '\\*')
      .replace(/\[/g, '\\[')
      .replace(/\]/g, '\\]')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
      .replace(/~/g, '\\~')
      .replace(/`/g, '\\`')
      .replace(/>/g, '\\>')
      .replace(/#/g, '\\#')
      .replace(/\+/g, '\\+')
      .replace(/-/g, '\\-')
      .replace(/=/g, '\\=')
      .replace(/\|/g, '\\|')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .replace(/\./g, '\\.')
      .replace(/!/g, '\\!');
  };

  async sendMessageTelegram(
    text: string,
    parse_mode: string = 'HTML',
  ): Promise<void> {
    const baseUrl = 'https://api.telegram.org/bot';
    const botToken = '7345653463:AAEZd3TO7D92YlJPqoLYUfDahh7K2J1TpTE';
    const chat_id = '-1002160052340';
    const message_thread_id = '2';
    const url = `${baseUrl}${botToken}/sendMessage`;
    try {
      await axios.post(url, {
        chat_id,
        parse_mode,
        text: text,
        message_thread_id,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }

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
  // Update order column
  async updateOrderColumn(newOrdered: string[]): Promise<any> {
    const board = await this.boardModel.findOne().exec();
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    // Tìm cột cần cập nhật trong bảng
    board.ordered = newOrdered;
    await board.save();

    return newOrdered;
  }
  async updateOrderTaskSameColumn(
    columnId: string,
    taskIds: string[],
  ): Promise<any> {
    const board = await this.boardModel.findOne().exec();
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    // Tìm cột cần cập nhật trong bảng

    const column = board.columns.find((column) => column.id === columnId);
    if (!column) {
      throw new NotFoundException('Column not found');
    }
    column.taskIds = taskIds;
    await board.save();

    return taskIds;
  }

  async updateOrderTaskAnotherColumn(moveTaskDto: MoveTaskDto): Promise<any> {
    const {
      sourceColumnId,
      destinationColumnId,
      sourceTaskIds,
      destinationTaskIds,
      taskMoveId,
    } = moveTaskDto;
    const board = await this.boardModel.findOne().exec();
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    const sourceColumn = board.columns.find(
      (column) => column.id === sourceColumnId,
    );
    const destinationColumn = board.columns.find(
      (column) => column.id === destinationColumnId,
    );
    const taskMove = board.tasks.find((task) => task.task_id === taskMoveId);
    if (!sourceColumn || !destinationColumn) {
      throw new NotFoundException('Column not found');
    }
    sourceColumn.taskIds = sourceTaskIds;
    destinationColumn.taskIds = destinationTaskIds;
    await board.save();
    if (destinationColumn.name === 'Đang thực hiện') {
      let assigneArray = '';
      if (taskMove.detail.assignee.length > 1) {
        assigneArray = taskMove.detail.assignee
          .map((assignee) => assignee.telegram)
          .join(',');
      } else {
        assigneArray = taskMove.detail.assignee[0].telegram;
      }
      const formattedDate = taskMove.detail.due.map((date) => {
        const d = new Date(date);
        const formattedDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        return formattedDate;
      });
      let priorityText = '';
      switch (taskMove.detail.priority) {
        case 'hight':
          priorityText = 'Gấp';
          break;
        case 'medium':
          priorityText = 'Bình thường';
          break;
        case 'low':
          priorityText = 'Chưa gấp';
          break;
        default:
          priorityText = '';
      }
      await this.sendMessageTelegram(
        `Xin chào anh ${assigneArray}\n<b>${taskMove.detail.name}</b>\n<b>Mô tả:</b> ${taskMove.detail.description}\n<b>Mức độ:</b> ${priorityText}\n<b>Thời gian thực hiện:</b> ${formattedDate[0]} - ${formattedDate[1]}`,
        'HTML',
      );
    }
    return { message: 'Tasks moved successfully' };
  }

  // Update a task
  async updateTask(taskId: string, updateTaskDto: any): Promise<any> {
    const board = await this.boardModel.findOne().exec();
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    // Tìm task cần cập nhật trong bảng
    const task = board.tasks.find((task) => task.task_id === taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    Object.assign(task.detail, updateTaskDto);
    board.markModified('tasks');
    // Lưu lại bảng sau khi cập nhật
    await board.save();

    return task;
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
