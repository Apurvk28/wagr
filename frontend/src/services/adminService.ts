import api from './api';

export const getAdminDashboard = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data.data;
};

export const getAllAdminUsers = async (search = '') => {
  const response = await api.get('/admin/users', { params: { search } });
  return response.data.data;
};

export const suspendUser = async (userId: string) => {
  const response = await api.put(`/admin/users/${userId}/suspend`);
  return response.data;
};

export const getPendingMarkets = async () => {
  const response = await api.get('/admin/markets/pending');
  return response.data.data;
};

export const getAllAdminPosts = async () => {
  const response = await api.get('/admin/posts');
  return response.data.data;
};

export const deleteAdminPost = async (postId: string) => {
  const response = await api.delete(`/admin/posts/${postId}`);
  return response.data;
};
