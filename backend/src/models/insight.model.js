import mongoose from 'mongoose';

const insightSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
    unique: true, // 'YYYY-MM-DD'
    index: true,
  }
}, { timestamps: true });

export default mongoose.model('Insight', insightSchema);
