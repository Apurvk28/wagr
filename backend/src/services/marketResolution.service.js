import Market from '../models/market.model.js';
import Position from '../models/position.model.js';
import User from '../models/user.model.js';
import { createAndSendNotification } from './notification.service.js';
import { updateUserStatsAndCheckAchievements } from './achievement.service.js';
import { getIo } from './socket.service.js';

/**
 * Execute market resolution logic for a given market and outcome.
 * Settles all open positions, credits winning user balances, 
 * sends win/loss notifications, updates stats, and emits socket events.
 * 
 * @param {string} marketId 
 * @param {string} outcome - 'YES' | 'NO'
 * @param {string} [resolutionSource] 
 * @returns {Promise<Object>} The resolved market document
 */
export const executeMarketResolution = async (marketId, outcome, resolutionSource = 'Automated timeline expiration') => {
  const market = await Market.findById(marketId);
  if (!market) {
    throw new Error('Prediction market not found.');
  }

  if (market.status === 'Resolved' || market.status === 'Cancelled') {
    return market; // Already settled
  }

  // 1. Lock and resolve market status & probabilities
  market.status = 'Resolved';
  market.resolutionResult = outcome;
  market.resolutionSource = resolutionSource;
  market.yesProbability = outcome === 'YES' ? 100 : 0;
  market.noProbability = outcome === 'NO' ? 100 : 0;
  market.probabilityHistory.push({
    yesProbability: market.yesProbability,
    timestamp: new Date(),
  });
  await market.save();

  // 2. Fetch all active open positions in this market
  const openPositions = await Position.find({
    marketId: market._id,
    status: 'Open',
  });

  // 3. Group positions by userId to calculate aggregated payouts & results
  const userPositionsMap = new Map();

  for (const position of openPositions) {
    const uid = position.userId.toString();
    if (!userPositionsMap.has(uid)) {
      userPositionsMap.set(uid, []);
    }
    userPositionsMap.get(uid).push(position);
  }

  // 4. Process settlements per user
  for (const [userIdStr, positions] of userPositionsMap.entries()) {
    let totalPayout = 0;
    let totalInvested = 0;
    let netProfitLoss = 0;
    let wonCount = 0;

    for (const position of positions) {
      totalInvested += position.investedAmount;

      if (position.outcome === outcome) {
        // Winning position
        const entryProb = position.entryProbability || 50;
        const payout = Math.round(position.investedAmount * (100 / entryProb));
        totalPayout += payout;
        wonCount++;

        position.status = 'Resolved';
        position.exitValue = payout;
        position.profitLoss = payout - position.investedAmount;
        position.closedAt = new Date();
        await position.save();
      } else {
        // Losing position
        position.status = 'Resolved';
        position.exitValue = 0;
        position.profitLoss = -position.investedAmount;
        position.closedAt = new Date();
        await position.save();
      }

      netProfitLoss += position.profitLoss;
    }

    // Credit winning user's wallet
    const userObj = await User.findById(userIdStr);
    if (userObj) {
      if (totalPayout > 0) {
        userObj.mxpBalance += totalPayout;
        await userObj.save();
      }

      // Send personalized Win or Loss Notification
      if (wonCount > 0) {
        await createAndSendNotification({
          userId: userObj._id,
          title: `🎉 You Won! Market Resolved: ${outcome}`,
          message: `"${market.title}" has closed. Your prediction was CORRECT! You won ${totalPayout} MXP.`,
          type: 'Market Resolved',
          redirectUrl: `/markets/${market._id}`,
        });
      } else {
        const lostAmount = Math.abs(netProfitLoss);
        await createAndSendNotification({
          userId: userObj._id,
          title: `❌ Market Resolved: ${outcome}`,
          message: `"${market.title}" has closed. Your prediction was INCORRECT.${lostAmount > 0 ? ` You lost ${lostAmount} MXP.` : ''}`,
          type: 'Market Resolved',
          redirectUrl: `/markets/${market._id}`,
        });
      }

      // Asynchronously update stats & check achievements
      updateUserStatsAndCheckAchievements(userObj._id, 'TRADE_RESOLVE').catch(console.error);
    }
  }

  // 5. Notify followers who had no open positions
  const followersToNotify = await User.find({
    followedMarkets: market._id,
    _id: { $nin: Array.from(userPositionsMap.keys()) }
  }).select('_id');

  for (const follower of followersToNotify) {
    await createAndSendNotification({
      userId: follower._id,
      title: `Market Closed: ${outcome}`,
      message: `"${market.title}" that you follow has closed and resolved ${outcome}.`,
      type: 'Followed Market Updated',
      redirectUrl: `/markets/${market._id}`,
    });
  }

  // 6. Emit real-time Socket.IO resolution events
  const io = getIo();
  if (io) {
    io.emit('market_resolved', {
      marketId: market._id,
      outcome,
      yesProbability: market.yesProbability,
      noProbability: market.noProbability,
    });
    io.emit('market_update', {
      marketId: market._id,
      status: market.status,
      yesProbability: market.yesProbability,
      noProbability: market.noProbability,
    });
  }

  console.log(`✅ Market "${market.title}" automatically resolved as ${outcome}. Notified ${userPositionsMap.size} traders.`);
  return market;
};
