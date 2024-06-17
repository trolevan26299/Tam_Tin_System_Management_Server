// src/types/kanban.ts

export interface IKanban {
  columns: IKanbanColumn[];
  ordered: string[];
}

export interface IKanbanColumn {
  id: string;
  name: string;
  taskIds: string[];
}

export interface IKanbanTask {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  columnId: string;
}
