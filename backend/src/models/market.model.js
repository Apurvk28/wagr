import mongoose from 'mongoose';

const marketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Market title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Market description is required'],
    },
    category: {
      type: String,
      required: [true, 'Market category is required'],
      trim: true,
      index: true,
    },
    marketType: {
      type: String,
      enum: ['Long-Term', 'Short-Term'],
      default: 'Long-Term',
      index: true,
    },
    status: {
      type: String,
      enum: ['Draft', 'Pending Approval', 'Live', 'Resolved', 'Cancelled', 'Archived'],
      default: 'Live',
    },
    resolutionDate: {
      type: Date,
      required: [true, 'Resolution date is required'],
      index: true,
    },
    resolutionResult: {
      type: String,
      enum: ['YES', 'NO', null],
      default: null,
    },
    resolutionSource: {
      type: String,
      trim: true,
    },
    totalYesPool: {
      type: Number,
      default: 0,
    },
    totalNoPool: {
      type: Number,
      default: 0,
    },
    yesProbability: {
      type: Number,
      default: 50,
    },
    noProbability: {
      type: Number,
      default: 50,
    },
    volume: {
      type: Number,
      default: 0,
    },
    participantsCount: {
      type: Number,
      default: 0,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    probabilityHistory: [
      {
        yesProbability: {
          type: Number,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to populate dynamic probability and initial history
marketSchema.pre('save', function (next) {
  const C = 1000;
  const totalPool = this.totalYesPool + this.totalNoPool;
  this.yesProbability = Math.round(((this.totalYesPool + C) / (totalPool + 2 * C)) * 100);
  this.noProbability = 100 - this.yesProbability;

  if (this.probabilityHistory.length === 0) {
    this.probabilityHistory.push({
      yesProbability: this.yesProbability,
      timestamp: new Date(),
    });
  }
  next();
});

const Market = mongoose.model('Market', marketSchema);

export default Market;
