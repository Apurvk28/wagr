import api from './api';

export interface Post {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    username: string;
    followers?: string[];
    following?: string[];
  };
  content: string;
  linkedMarket?: {
    _id: string;
    title: string;
    yesProbability: number;
    noProbability: number;
    status: string;
  };
  likesCount: number;
  commentsCount: number;
  likes: string[];
  createdAt: string;
}

export interface Comment {
  _id: string;
  postId: string;
  userId: {
    _id: string;
    fullName: string;
    username: string;
  };
  content: string;
  parentId?: string;
  createdAt: string;
}

export interface UserProfileData {
  id: string;
  fullName: string;
  username: string;
  followersCount: number;
  followingCount: number;
  totalPosts: number;
  marketsParticipated: number;
  predictionAccuracy: number;
  isFollowing: boolean;
  createdAt: string;
}

export const getPosts = async (params?: {
  marketId?: string;
  username?: string;
  feed?: string;
  sortBy?: string;
}): Promise<Post[]> => {
  const res = await api.get('/community/posts', { params });
  return res.data.data;
};

export const createPost = async (content: string, linkedMarket?: string): Promise<Post> => {
  const res = await api.post('/community/posts', { content, linkedMarket });
  return res.data.data;
};

export const toggleLikePost = async (postId: string): Promise<{ likesCount: number; hasLiked: boolean }> => {
  const res = await api.post(`/community/posts/${postId}/like`);
  return res.data.data;
};

export const getComments = async (postId: string): Promise<Comment[]> => {
  const res = await api.get(`/community/posts/${postId}/comments`);
  return res.data.data;
};

export const createComment = async (
  postId: string,
  content: string,
  parentId?: string
): Promise<Comment> => {
  const res = await api.post(`/community/posts/${postId}/comments`, { content, parentId });
  return res.data.data;
};

export const getUserProfile = async (username: string): Promise<UserProfileData> => {
  const res = await api.get(`/users/profile/${username}`);
  return res.data.data;
};

export const toggleFollowUser = async (userId: string): Promise<{ isFollowing: boolean; followersCount: number }> => {
  const res = await api.post(`/users/${userId}/follow`);
  return res.data.data;
};

export const toggleFollowCategory = async (category: string): Promise<{ isFollowing: boolean }> => {
  const res = await api.post('/users/follow-category', { category });
  return res.data.data;
};

