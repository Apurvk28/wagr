import api from './api';

export interface NewsArticle {
  _id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  category: string;
  relatedMarket?: {
    _id: string;
    title: string;
    status: string;
    yesProbability: number;
    noProbability: number;
    marketType?: 'Long-Term' | 'Short-Term';
  };
  publishedDate: string;
  aiSummary: string;
  createdAt: string;
}

export const getNewsFeed = async (params?: {
  search?: string;
  category?: string;
  marketId?: string;
}): Promise<NewsArticle[]> => {
  const res = await api.get('/news', { params });
  return res.data.data;
};

export const syncAiNews = async (): Promise<{ message: string; data: NewsArticle[] }> => {
  const res = await api.post('/news/fetch');
  return res.data;
};
