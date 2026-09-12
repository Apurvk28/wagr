import MxpTransaction from '../models/mxpTransaction.model.js';

/**
 * Records a server-side MXP wallet transaction entry in the database.
 * 
 * @param {Object} params
 * @param {string|ObjectId} params.userId
 * @param {'WELCOME_GRANT'|'TRADE_DEBIT'|'MARKET_PAYOUT'|'POSITION_CLOSE'|'MARKET_REFUND'|'ADMIN_GRANT'|'ADMIN_ADJUSTMENT'} params.type
 * @param {'CREDIT'|'DEBIT'} params.direction
 * @param {number} params.amount
 * @param {number} params.balanceAfter
 * @param {string} params.description
 * @param {string|ObjectId} [params.marketId]
 * @param {string|ObjectId} [params.positionId]
 * @param {string|ObjectId} [params.requestId]
 * @param {string} [params.referenceId]
 * @param {ClientSession} [params.session]
 * @returns {Promise<Document>}
 */
export const recordMxpTransaction = async ({
  userId,
  type,
  direction,
  amount,
  balanceAfter,
  description,
  marketId = null,
  positionId = null,
  requestId = null,
  referenceId = null,
  session = null,
}) => {
  try {
    if (amount <= 0 && type !== 'WELCOME_GRANT') return null;

    if (referenceId) {
      const existing = await MxpTransaction.findOne({ referenceId });
      if (existing) return existing;
    }

    const doc = {
      userId,
      type,
      direction,
      amount: Math.round(amount),
      balanceAfter: Math.round(balanceAfter),
      description,
      marketId,
      positionId,
      requestId,
    };
    if (referenceId) {
      doc.referenceId = referenceId;
    }

    const options = session ? { session } : {};
    const [transaction] = await MxpTransaction.create([doc], options);

    return transaction;
  } catch (error) {
    if (error.code === 11000 && referenceId) {
      return await MxpTransaction.findOne({ referenceId });
    }
    console.error('❌ Error recording MXP transaction:', error.message);
    throw error;
  }
};
