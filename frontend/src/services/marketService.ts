import api from './api';
import type { Market } from '../types';

export interface TradeResponse {
  position: {
    _id: string;
    userId: string;
    marketId: string;
    outcome: 'YES' | 'NO';
    investedAmount: number;
    entryProbability: number;
    status: 'Open' | 'Closed' | 'Resolved';
    exitValue?: number;
    profitLoss: number;
  };
  userBalance: number;
}

export const getMarkets = async (params?: {
  search?: string;
  category?: string;
  status?: string;
}): Promise<Market[]> => {
  const res = await api.get('/markets', { params });
  return res.data.data;
};

export const getMarketById = async (id: string): Promise<Market> => {
  const res = await api.get(`/markets/${id}`);
  return res.data.data;
};

export const createMarket = async (marketData: {
  title: string;
  description: string;
  category: string;
  resolutionDate: string;
}): Promise<Market> => {
  const res = await api.post('/markets', marketData);
  return res.data.data;
};

export const openTrade = async (
  marketId: string,
  outcome: 'YES' | 'NO',
  amount: number
): Promise<TradeResponse> => {
  const res = await api.post(`/markets/${marketId}/trade`, { outcome, amount });
  return res.data.data;
};

export const closeTrade = async (marketId: string, positionId?: string): Promise<TradeResponse> => {
  const res = await api.post(`/markets/${marketId}/close`, { positionId });
  return res.data.data;
};

export const resolveMarket = async (
  marketId: string,
  outcome: 'YES' | 'NO',
  resolutionSource?: string
): Promise<Market> => {
  const res = await api.post(`/markets/${marketId}/resolve`, { outcome, resolutionSource });
  return res.data.data;
};

export const cancelMarket = async (marketId: string): Promise<Market> => {
  const res = await api.post(`/markets/${marketId}/cancel`);
  return res.data.data;
};

export const getUserPositionInMarket = async (marketId: string): Promise<any> => {
  const res = await api.get(`/markets/${marketId}/position`);
  return res.data.data;
};
