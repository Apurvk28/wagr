import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  headline: {
    type: String,
    required: [true, 'Headline is required.'],
    trim: true,
  },
  summary: {
    type: String,
    required: [true, 'Summary content is required.'],
  },
  source: {
    type: String,
    required: [true, 'Source identifier is required.'],
  },
  url: {
    type: String,
    required: [true, 'Article URL is required.'],
    unique: true, // Prevents duplicate news feeds from appearing
    index: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required.'],
    index: true,
  },
  relatedMarket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Market',
    index: true,
    default: null,
  },
  publishedDate: {
    type: Date,
    default: Date.now,
  },
  aiSummary: {
    type: String,
    required: [true, 'AI concise summary sentiment is required.'],
  },
}, { timestamps: true });

export default mongoose.model('News', newsSchema);
