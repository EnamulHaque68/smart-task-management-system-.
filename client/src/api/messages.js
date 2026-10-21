import apiClient from './client.js';

export const getMessagesApi = async (limit = 100) => {
  return apiClient(`/messages?limit=${limit}`);
};

export const sendMessageApi = async (messageData) => {
  return apiClient('/messages', {
    method: 'POST',
    body: messageData,
  });
};

export default {
  getMessagesApi,
  sendMessageApi,
};
