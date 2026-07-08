import mongoose from 'mongoose';

const positionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    marketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Market',
      required: true,
      index: true,
    },
    outcome: {
      type: String,
      enum: ['YES', 'NO'],
      required: true,
    },
    investedAmount: {
      type: Number,
      required: true,
    },
    entryProbability: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'Resolved'],
      default: 'Open',
    },
    exitValue: {
      type: Number,
    },
    profitLoss: {
      type: Number,
      default: 0,
    },
    closedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Position = mongoose.model('Position', positionSchema);

export default Position;
