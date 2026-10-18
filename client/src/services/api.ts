import { Task, TaskStats, HealthStatus, ApiResponse, TaskFormData } from '../types/task';

const API_BASE = '/api';

export interface GetTasksParams {
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
}

export const api = {
  // Check backend and database health
  async checkHealth(): Promise<HealthStatus> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err: any) {
      return {
        status: 'error',
        error: err.message,
        database: { connected: false, status: 'unreachable' },
      };
    }
  },

  // Fetch all tasks with optional filters
  async getTasks(params: GetTasksParams = {}): Promise<ApiResponse<Task[]>> {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('search', params.search);
    if (params.status && params.status !== 'all') searchParams.append('status', params.status);
    if (params.priority && params.priority !== 'all') searchParams.append('priority', params.priority);
    if (params.category && params.category !== 'all') searchParams.append('category', params.category);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await fetch(`${API_BASE}/tasks${query}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch tasks');
    return data;
  },

  // Get task statistics
  async getStats(): Promise<ApiResponse<TaskStats>> {
    const res = await fetch(`${API_BASE}/tasks/stats`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch statistics');
    return data;
  },

  // Create a new task
  async createTask(taskData: TaskFormData): Promise<ApiResponse<Task>> {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create task');
    return data;
  },

  // Update a task by ID
  async updateTask(id: string, taskData: Partial<Task>): Promise<ApiResponse<Task>> {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update task');
    return data;
  },

  // Delete a task by ID
  async deleteTask(id: string): Promise<ApiResponse<{ id: string }>> {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete task');
    return data;
  },

  // Seed sample tasks
  async seedTasks(): Promise<ApiResponse<Task[]>> {
    const res = await fetch(`${API_BASE}/tasks/seed`, {
      method: 'POST',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to seed sample tasks');
    return data;
  },
};
