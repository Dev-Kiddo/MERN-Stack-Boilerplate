/**
 * API Service for MERN Practice Application
 * Communicates with the Express backend
 */

const API_BASE = '/api';

export const api = {
  // Check backend and database health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      return {
        status: 'error',
        error: err.message,
        database: { connected: false, status: 'unreachable' },
      };
    }
  },

  // Fetch all tasks with optional filters
  async getTasks({ search = '', status = 'all', priority = 'all', category = 'all' } = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'all') params.append('status', status);
    if (priority && priority !== 'all') params.append('priority', priority);
    if (category && category !== 'all') params.append('category', category);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/tasks${query}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch tasks');
    return data;
  },

  // Get task statistics
  async getStats() {
    const res = await fetch(`${API_BASE}/tasks/stats`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch statistics');
    return data;
  },

  // Create a new task
  async createTask(taskData) {
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
  async updateTask(id, taskData) {
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
  async deleteTask(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete task');
    return data;
  },

  // Seed sample tasks
  async seedTasks() {
    const res = await fetch(`${API_BASE}/tasks/seed`, {
      method: 'POST',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to seed sample tasks');
    return data;
  },
};
