import mongoose from 'mongoose';
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
 * Fully atomic and idempotent via Mongoose session transaction.
 * 
 * @param {string} marketId 
 * @param {string} outcome - 'YES' | 'NO'
 * @param {string} [resolutionSource] 
 * @returns {Promise<Object>} The resolved market document
 */
export const executeMarketResolution = async (marketId, outcome, resolutionSource = 'Automated timeline expiration') => {
  const yesProb = outcome === 'YES' ? 100 : 0;
  const noProb = outcome === 'NO' ? 100 : 0;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Atomically claim and transition market status from 'Live'/'Pending Approval' to 'Resolving' within transaction
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
      { new: true, session }
    );

    if (!market) {
      await session.abortTransaction();
      session.endSession();

      // If update returned null, the market was either non-existent or ALREADY Resolving, Resolved, or Cancelled.
      const existingMarket = await Market.findById(marketId);
      if (!existingMarket) {
        throw new Error('Prediction market not found.');
      }
      if (existingMarket.status === 'Resolved' || existingMarket.status === 'Resolving') {
        return existingMarket;
      }
      if (existingMarket.status === 'Cancelled') {
        throw new Error('Cannot resolve a cancelled prediction market.');
      }
      return existingMarket;
    }

    // 2. Fetch all active open positions in this market inside session
    const openPositions = await Position.find({
      marketId: market._id,
      status: 'Open',
    }).session(session);

    // 3. Group positions by userId to calculate aggregated payouts & results
    const userPositionsMap = new Map();
    for (const position of openPositions) {
      const uid = position.userId.toString();
      if (!userPositionsMap.has(uid)) {
        userPositionsMap.set(uid, []);
      }
      userPositionsMap.get(uid).push(position);
    }

    const userNotificationsToDeliver = [];

    // 4. Process settlements per user within transaction
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

        // Update position status inside session
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
          { new: true, session }
        );

        if (!settledPosition) {
          continue;
        }

        if (isWin) {
          totalPayout += payout;
          wonCount++;
        }
        netProfitLoss += profitLoss;
      }

      // Credit winning user's balance inside session
      if (totalPayout > 0) {
        await User.findByIdAndUpdate(
          userIdStr,
          { $inc: { mxpBalance: totalPayout } },
          { session }
        );
      }

      userNotificationsToDeliver.push({
        userId: userIdStr,
        totalPayout,
        netProfitLoss,
        wonCount,
      });
    }

    // 5. Finalize market status to 'Resolved' inside session
    const resolvedMarket = await Market.findByIdAndUpdate(
      market._id,
      { $set: { status: 'Resolved' } },
      { new: true, session }
    );

    // Commit transaction cleanly
    await session.commitTransaction();
    session.endSession();

    // 6. Post-transaction side-effects: notifications, stats, and real-time socket events
    for (const item of userNotificationsToDeliver) {
      const userObj = await User.findById(item.userId);
      if (userObj) {
        if (item.wonCount > 0) {
          await createAndSendNotification({
            userId: userObj._id,
            title: `🎉 You Won! Market Resolved: ${outcome}`,
            message: `"${resolvedMarket.title}" has closed. Your prediction was CORRECT! You won ${item.totalPayout} MXP.`,
            type: 'Market Resolved',
            redirectUrl: `/markets/${resolvedMarket._id}`,
          });
        } else {
          const lostAmount = Math.abs(item.netProfitLoss);
          await createAndSendNotification({
            userId: userObj._id,
            title: `❌ Market Resolved: ${outcome}`,
            message: `"${resolvedMarket.title}" has closed. Your prediction was INCORRECT.${lostAmount > 0 ? ` You lost ${lostAmount} MXP.` : ''}`,
            type: 'Market Resolved',
            redirectUrl: `/markets/${resolvedMarket._id}`,
          });
        }

        updateUserStatsAndCheckAchievements(userObj._id, 'TRADE_RESOLVE').catch(console.error);
      }
    }

    // Notify followers who had no open positions
    const followersToNotify = await User.find({
      followedMarkets: resolvedMarket._id,
      _id: { $nin: Array.from(userPositionsMap.keys()) },
    }).select('_id');

    for (const follower of followersToNotify) {
      await createAndSendNotification({
        userId: follower._id,
        title: `Market Closed: ${outcome}`,
        message: `"${resolvedMarket.title}" that you follow has closed and resolved ${outcome}.`,
        type: 'Followed Market Updated',
        redirectUrl: `/markets/${resolvedMarket._id}`,
      });
    }

    // Emit real-time Socket.IO resolution events
    const io = getIo();
    if (io) {
      io.emit('market_resolved', {
        marketId: resolvedMarket._id,
        outcome,
        yesProbability: resolvedMarket.yesProbability,
        noProbability: resolvedMarket.noProbability,
      });
      io.emit('market_update', {
        marketId: resolvedMarket._id,
        status: resolvedMarket.status,
        yesProbability: resolvedMarket.yesProbability,
        noProbability: resolvedMarket.noProbability,
      });
    }

    console.log(`✅ Market "${resolvedMarket.title}" resolved as ${outcome}. Notified ${userPositionsMap.size} traders.`);
    return resolvedMarket;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
