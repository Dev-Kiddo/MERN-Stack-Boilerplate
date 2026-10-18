export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  dueDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  category: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  dbConnected: boolean;
}

export interface HealthStatus {
  status: string;
  timestamp?: string;
  uptime?: string;
  environment?: string;
  database?: {
    status: string;
    connected: boolean;
    host?: string | null;
    name?: string | null;
  };
  error?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
}
