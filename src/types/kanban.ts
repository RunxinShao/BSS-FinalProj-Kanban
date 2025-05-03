
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  createdAt: Date;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface KanbanBoard {
  id: string;
  title: string;
  columns: Column[];
  userId?: string; 
}

export interface User {
  id: string;
  username: string;
  password: string; 
  boards: KanbanBoard[];
}