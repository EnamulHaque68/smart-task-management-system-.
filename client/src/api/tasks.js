import apiClient from './client.js';

export const getTasksApi = async (filters = {}) => {
  const query = new URLSearchParams();
  if (filters.projectId) query.append('projectId', filters.projectId);
  if (filters.status) query.append('status', filters.status);
  if (filters.priority) query.append('priority', filters.priority);
  if (filters.assigneeId) query.append('assigneeId', filters.assigneeId);
  if (filters.search) query.append('search', filters.search);

  const qs = query.toString();
  return apiClient(`/tasks${qs ? `?${qs}` : ''}`);
};

export const getTaskByIdApi = async (id) => {
  return apiClient(`/tasks/${id}`);
};

export const createTaskApi = async (taskData) => {
  return apiClient('/tasks', { method: 'POST', body: taskData });
};

export const updateTaskApi = async (id, taskData) => {
  return apiClient(`/tasks/${id}`, { method: 'PUT', body: taskData });
};

export const deleteTaskApi = async (id) => {
  return apiClient(`/tasks/${id}`, { method: 'DELETE' });
};

export default {
  getTasksApi,
  getTaskByIdApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
};
