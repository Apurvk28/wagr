import express from 'express';
import {
  getTrendingMarkets,
  getActiveMarkets,
  getLatestNews,
  getCommunityHighlights,
} from '../controllers/homepage.controller.js';

const router = express.Router();

router.get('/markets/trending', getTrendingMarkets);
router.get('/markets/active', getActiveMarkets);
router.get('/news/latest', getLatestNews);
router.get('/community/highlights', getCommunityHighlights);

export default router;
