import express from 'express';
import {
  getProfile,
  updateProfile,
  adjustAdminBalance,
  getUserProfile,
  toggleFollowUser,
  toggleFollowCategory,
  getPortfolio,
  getTradingHistory,
  getHomepageSummary,
  requestMxp,
  getUserMxpRequests,
} from '../controllers/user.controller.js';
import { protect, optional } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.post('/admin/balance', protect, adjustAdminBalance);
router.post('/categories/follow', protect, toggleFollowCategory);

router.get('/portfolio', protect, getPortfolio);
router.get('/trades', protect, getTradingHistory);
router.get('/homepage-summary', protect, getHomepageSummary);
router.post('/request-mxp', protect, requestMxp);
router.get('/mxp-requests', protect, getUserMxpRequests);

router.get('/profile/:username', optional, getUserProfile);
router.post('/:id/follow', protect, toggleFollowUser);

export default router;

