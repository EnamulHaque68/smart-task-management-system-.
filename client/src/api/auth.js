import apiClient from './client.js';

export const loginApi = async (credentials) => {
  return apiClient('/auth/login', { body: credentials });
};

export const registerApi = async (userData) => {
  return apiClient('/auth/register', { body: userData });
};

export const getMeApi = async () => {
  return apiClient('/auth/me');
};

export const getUsersApi = async () => {
  return apiClient('/auth/users');
};

export default {
  loginApi,
  registerApi,
  getMeApi,
  getUsersApi,
};
