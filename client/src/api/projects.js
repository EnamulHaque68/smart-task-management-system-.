import apiClient from './client.js';

export const getProjectsApi = async (filters = {}) => {
  const query = new URLSearchParams();
  if (filters.status) query.append('status', filters.status);
  if (filters.priority) query.append('priority', filters.priority);
  if (filters.search) query.append('search', filters.search);
  if (filters.sortBy) query.append('sortBy', filters.sortBy);
  if (filters.order) query.append('order', filters.order);

  const qs = query.toString();
  return apiClient(`/projects${qs ? `?${qs}` : ''}`);
};

export const getProjectByIdApi = async (id) => {
  return apiClient(`/projects/${id}`);
};

export const createProjectApi = async (projectData) => {
  return apiClient('/projects', { method: 'POST', body: projectData });
};

export const updateProjectApi = async (id, projectData) => {
  return apiClient(`/projects/${id}`, { method: 'PUT', body: projectData });
};

export const deleteProjectApi = async (id) => {
  return apiClient(`/projects/${id}`, { method: 'DELETE' });
};

export default {
  getProjectsApi,
  getProjectByIdApi,
  createProjectApi,
  updateProjectApi,
  deleteProjectApi,
};
