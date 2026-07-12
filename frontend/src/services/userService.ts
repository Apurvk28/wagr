import api from './api';

export const getPortfolio = async () => {
  const response = await api.get('/users/portfolio');
  return response.data.data;
};

export const getTradingHistory = async () => {
  const response = await api.get('/users/trades');
  return response.data.data;
};
