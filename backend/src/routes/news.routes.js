import express from 'express';
import {
  getNewsFeed,
  getNewsById,
  triggerAiNewsFetch,
} from '../controllers/news.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { getLatestNews } from '../controllers/homepage.controller.js';

const router = express.Router();

// Public routes
router.get('/latest', getLatestNews);
router.get('/', getNewsFeed);
router.get('/:id', getNewsById);

// Protected admin routes (Requires authentication and Admin role)
router.post('/fetch', protect, authorize('Admin'), triggerAiNewsFetch);

export default router;
