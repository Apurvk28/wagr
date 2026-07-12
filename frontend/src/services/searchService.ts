import api from './api';

export interface SearchResults {
  query: string;
  markets: any[];
  users: any[];
  news: any[];
  posts: any[];
  total: number;
}

export const globalSearch = async (q: string): Promise<SearchResults> => {
  const response = await api.get('/search', { params: { q } });
  return response.data.data;
};
