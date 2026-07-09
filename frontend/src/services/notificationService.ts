import api from './api';
import type { Notification } from '../types';

export const getNotifications = async (): Promise<Notification[]> => {
  const res = await api.get('/notifications');
  return res.data.data;
};

export const getUnreadCount = async (): Promise<number> => {
  const res = await api.get('/notifications/unread-count');
  return res.data.data.count;
};

export const markAsRead = async (id: string): Promise<void> => {
  await api.put(`/notifications/${id}`);
};

export const markAllAsRead = async (): Promise<void> => {
  await api.put('/notifications/read-all');
};
