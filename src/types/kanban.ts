
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
  userId?: string; // Optional link to user
}

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, you would never store plain text passwords
  boards: KanbanBoard[];
}