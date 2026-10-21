import apiClient from './client.js';

export const getDashboardApi = async () => {
  return apiClient('/dashboard');
};

export default {
  getDashboardApi,
};
