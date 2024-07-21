// src/types/kanban.ts

export interface IKanban {
  columns: IKanbanColumn[];
  tasks: any[];
  ordered: string[];
}

export interface IKanbanColumn {
  id: string;
  name: string;
  taskIds: string[];
}

export interface IKanbanTask {
  id: string;
  name: string;
  reporter: IReporter;
  labels?: string[];
  comments?: IComment[];
  assignee?: IAssignee[];
  description?: string;
  due?: string[];
  priority?: string;
  attachments?: string[];
  status: string;
  columnId: string;
}

export interface IReporter {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface IComment {
  id: string;
  name: string;
  avatarUrl: string;
  createdAt: Date;
  messageType: string;
  message: string;
}

export interface IAssignee {
  id: string;
  name: string;
  avatarUrl: string;
}
