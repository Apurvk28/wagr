import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Post author is required.'],
    index: true,
  },
  content: {
    type: String,
    required: [true, 'Post content is required.'],
    trim: true,
  },
  linkedMarket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Market',
    index: true,
    default: null,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  commentsCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
