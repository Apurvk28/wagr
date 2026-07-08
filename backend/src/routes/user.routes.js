import express from 'express';
import { getProfile, updateProfile, adjustAdminBalance, getUserProfile, toggleFollowUser } from '../controllers/user.controller.js';
import { protect, optional } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.post('/admin/balance', protect, adjustAdminBalance);

router.get('/profile/:username', optional, getUserProfile);
router.post('/:id/follow', protect, toggleFollowUser);

export default router;
