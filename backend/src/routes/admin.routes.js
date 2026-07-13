import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  suspendUser,
  getAllPendingMarkets,
  deletePost,
  getAllPosts,
  triggerCronJobs,
} from '../controllers/admin.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All admin routes require authentication + Admin role
router.use(protect, authorize('Admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/suspend', suspendUser);
router.get('/markets/pending', getAllPendingMarkets);
router.get('/posts', getAllPosts);
router.delete('/posts/:id', deletePost);
router.post('/cron/trigger', triggerCronJobs);

export default router;
