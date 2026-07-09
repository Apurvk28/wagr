import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'Market Resolved',
        'Market Cancelled',
        'Followed Market Updated',
        'New Market',
        'Follow',
        'Like',
        'Comment',
        'Reply',
        'Mention',
        'Verification',
        'Security',
        'Admin Announcement',
      ],
    },
    readStatus: {
      type: Boolean,
      default: false,
      index: true,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
