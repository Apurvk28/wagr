import mongoose from 'mongoose';

const mxpTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'WELCOME_GRANT',
        'TRADE_DEBIT',
        'MARKET_PAYOUT',
        'POSITION_CLOSE',
        'MARKET_REFUND',
        'ADMIN_GRANT',
        'ADMIN_ADJUSTMENT',
      ],
      required: true,
    },
    direction: {
      type: String,
      enum: ['CREDIT', 'DEBIT'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    marketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Market',
      required: false,
    },
    positionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Position',
      required: false,
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MxpRequest',
      required: false,
    },
    referenceId: {
      type: String,
      required: false,
      sparse: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

mxpTransactionSchema.index({ userId: 1, createdAt: -1 });

const MxpTransaction = mongoose.model('MxpTransaction', mxpTransactionSchema);

export default MxpTransaction;
