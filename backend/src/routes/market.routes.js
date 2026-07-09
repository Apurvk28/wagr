import express from 'express';
import {
  getMarkets,
  getMarketById,
  createMarket,
  openTrade,
  closeTrade,
  resolveMarket,
  cancelMarket,
  getUserPositionInMarket,
  toggleFollowMarket,
  approveMarket,
  rejectMarket,
} from '../controllers/market.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { getTrendingMarkets, getActiveMarkets } from '../controllers/homepage.controller.js';

const router = express.Router();

// Public routes
router.get('/trending', getTrendingMarkets);
router.get('/active', getActiveMarkets);
router.get('/', getMarkets);
router.get('/:id', getMarketById);

// Protected routes (Requires authentication)
router.post('/', protect, createMarket);
router.post('/:id/trade', protect, openTrade);
router.post('/:id/close', protect, closeTrade);
router.get('/:id/position', protect, getUserPositionInMarket);
router.post('/:id/follow', protect, toggleFollowMarket);

// Administrative routes (Requires admin authorization)
router.post('/:id/resolve', protect, authorize('Admin'), resolveMarket);
router.post('/:id/cancel', protect, authorize('Admin'), cancelMarket);
router.post('/:id/approve', protect, authorize('Admin'), approveMarket);
router.post('/:id/reject', protect, authorize('Admin'), rejectMarket);

export default router;

