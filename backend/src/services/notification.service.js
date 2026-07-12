import Notification from '../models/notification.model.js';
import { getIo } from './socket.service.js';

/**
 * Create a notification in the database and push it via Socket.io in real-time
 * @param {Object} data
 * @param {string} data.userId - The ID of the recipient user
 * @param {string} [data.sender] - The ID of the user triggering the action
 * @param {string} data.title - Title of the notification
 * @param {string} data.message - Detailed message
 * @param {string} data.type - NotificationType (enum)
 * @param {string} data.redirectUrl - Landing URL in the client application
 */
export const createAndSendNotification = async (data) => {
  try {
    const { userId, sender, title, message, type, redirectUrl } = data;

    if (!userId || !title || !message || !type || !redirectUrl) {
      console.warn('⚠️ Missing required fields for notification creation:', data);
      return null;
    }

    // Save notification to MongoDB
    const notification = await Notification.create({
      userId,
      sender: sender || null,
      title,
      message,
      type,
      redirectUrl,
    });

    // Populate sender details for the frontend
    const populatedNotification = await Notification.findById(notification._id)
      .populate('sender', 'fullName username')
      .lean();

    // Broadcast in real-time if recipient is connected
    const io = getIo();
    if (io) {
      io.to(userId.toString()).emit('notification', populatedNotification);
      io.to(userId.toString()).emit('new_notification', populatedNotification);
    } else {
      console.warn('⚠️ Socket.io instance not initialized in notification service.');
    }

    return populatedNotification;
  } catch (error) {
    console.error('❌ Failed to create/send notification:', error);
    return null;
  }
};
