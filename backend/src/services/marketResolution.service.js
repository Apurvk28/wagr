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
  const yesProb = outcome === 'YES' ? 100 : 0;
  const noProb = outcome === 'NO' ? 100 : 0;

  // 1. Atomically claim and transition market status from 'Live'/'Pending Approval' to 'Resolving'
  // This guarantees only ONE execution thread/process can acquire the market for settlement.
  const market = await Market.findOneAndUpdate(
    {
      _id: marketId,
      status: { $in: ['Live', 'Pending Approval'] },
    },
    {
      $set: {
        status: 'Resolving',
        resolutionResult: outcome,
        resolutionSource: resolutionSource,
        yesProbability: yesProb,
        noProbability: noProb,
      },
      $push: {
        probabilityHistory: {
          yesProbability: yesProb,
          timestamp: new Date(),
        },
      },
    },
    { new: true }
  );

  if (!market) {
    // If update returned null, the market was either non-existent or ALREADY Resolving, Resolved, or Cancelled.
    const existingMarket = await Market.findById(marketId);
    if (!existingMarket) {
      throw new Error('Prediction market not found.');
    }
    // Return existing document safely without re-executing payouts or position loops!
    return existingMarket;
  }

  try {
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

        const isWin = position.outcome === outcome;
        const entryProb = position.entryProbability || 50;
        const payout = isWin ? Math.round(position.investedAmount * (100 / entryProb)) : 0;
        const profitLoss = isWin ? payout - position.investedAmount : -position.investedAmount;

        // Atomically claim position settlement to prevent position-level race conditions
        const settledPosition = await Position.findOneAndUpdate(
          { _id: position._id, status: 'Open' },
          {
            $set: {
              status: 'Resolved',
              exitValue: payout,
              profitLoss: profitLoss,
              closedAt: new Date(),
            },
          },
          { new: true }
        );

        if (!settledPosition) {
          // Position was already settled or closed concurrently
          continue;
        }

        if (isWin) {
          totalPayout += payout;
          wonCount++;
        }
        netProfitLoss += profitLoss;
      }

      // Credit winning user's wallet atomically
      if (totalPayout > 0) {
        await User.findByIdAndUpdate(userIdStr, {
          $inc: { mxpBalance: totalPayout },
        });
      }

      const userObj = await User.findById(userIdStr);
      if (userObj) {
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
      _id: { $nin: Array.from(userPositionsMap.keys()) },
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

    // 6. Finalize market status to 'Resolved'
    market.status = 'Resolved';
    await market.save();

    // 7. Emit real-time Socket.IO resolution events
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
  } catch (err) {
    // Revert status if error occurred during settlement
    market.status = 'Live';
    await market.save();
    throw err;
  }
};
