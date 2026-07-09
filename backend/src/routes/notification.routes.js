import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllAsRead,
} from '../controllers/notification.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All notification routes are protected (require user authentication)
router.use(protect);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/read-all', markAllAsRead);
router.put('/:id', markNotificationAsRead);

export default router;
