export type UserRole = 'User' | 'Admin';

export interface User {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  mxpBalance: number;
  portfolioValue: number;
  predictionAccuracy: number;
  followers: string[]; // User IDs
  following: string[]; // User IDs
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MarketStatus = 'Draft' | 'Pending Approval' | 'Live' | 'Resolved' | 'Cancelled' | 'Archived';

export interface Market {
  _id: string;
  title: string;
  description: string;
  category: string; // Category ID or populated object
  yesProbability: number;
  noProbability: number;
  volume: number;
  participants: number;
  status: MarketStatus;
  resolutionDate: string;
  resolvedOutcome?: 'YES' | 'NO';
  createdBy: string; // User ID
  approvedBy?: string; // Admin ID
  createdAt: string;
  updatedAt: string;
}

export type PositionStatus = 'Open' | 'Closed';

export interface Position {
  _id: string;
  userId: string;
  marketId: string;
  position: 'YES' | 'NO';
  investedMXP: number;
  entryProbability: number;
  exitProbability?: number;
  currentValue: number;
  profitLoss: number;
  status: PositionStatus;
  openedAt: string;
  closedAt?: string;
}

export type TransactionType = 'Buy' | 'Sell' | 'Settlement' | 'Refund';

export interface Transaction {
  _id: string;
  userId: string;
  marketId?: string;
  transactionType: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
}

export interface News {
  _id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  category: string;
  relatedMarket?: string; // Market ID
  publishedDate: string;
  aiSummary: string;
  createdAt: string;
}

export type NotificationType =
  | 'New Follower'
  | 'New Market'
  | 'Market Resolved'
  | 'Market Cancelled'
  | 'Followed Market Updated'
  | 'Admin Announcement'
  | 'Like'
  | 'Comment'
  | 'Reply'
  | 'Mention'
  | 'Verification'
  | 'Security';

export interface Notification {
  _id: string;
  userId: string;
  sender?: {
    _id: string;
    fullName: string;
    username: string;
  };
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  redirectUrl?: string;
  createdAt: string;
}


export interface Post {
  _id: string;
  userId: string | User; // Populated User
  content: string;
  linkedMarket?: string | Market; // Populated Market
  likesCount: number;
  commentsCount: number;
  likes: string[]; // Array of User IDs
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  postId: string;
  parentCommentId?: string | null;
  userId: string | User; // Populated User
  comment: string;
  replies?: Comment[];
  createdAt: string;
}

export type NotificationType = 
  | 'Market Resolved' 
  | 'Market Cancelled' 
  | 'Followed Market Updated' 
  | 'New Market' 
  | 'Follow' 
  | 'Like' 
  | 'Comment' 
  | 'Reply' 
  | 'Mention'
  | 'Verification'
  | 'Security'
  | 'Admin Announcement';

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  readStatus: boolean;
  redirectUrl: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}
