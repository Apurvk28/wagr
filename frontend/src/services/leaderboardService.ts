import api from './api';

export interface LeaderboardUser {
  rank: number;
  id: string;
  fullName: string;
  username: string;
  mxpBalance: number;
  portfolioValue: number;
  predictionAccuracy: number;
  badgesCount: number;
}

export const getLeaderboardData = async (sortBy: 'profit' | 'accuracy' = 'profit', limit = 50): Promise<LeaderboardUser[]> => {
  const response = await api.get('/leaderboard', {
    params: { sortBy, limit },
  });
  return response.data.data;
};
