// Centralized API Client with JWT Bearer Token Injection

const BASE_URL = '/api';

export async function apiClient(endpoint, { body, ...customConfig } = {}) {
  const token = localStorage.getItem('taskflow_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customConfig.headers,
  };

  const config = {
    method: customConfig.method || (body ? 'POST' : 'GET'),
    ...customConfig,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401 && !endpoint.startsWith('/auth/login') && !endpoint.startsWith('/auth/register')) {
        localStorage.removeItem('taskflow_token');
        localStorage.removeItem('taskflow_user');
        window.location.href = '/login';
      }

      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.errors = data.errors || [];
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export default apiClient;
