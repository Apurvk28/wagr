import User from '../models/user.model.js';
import Position from '../models/position.model.js';
import Market from '../models/market.model.js';
import { createAndSendNotification } from './notification.service.js';

export const ACHIEVEMENTS = {
  FIRST_STEP: {
    code: 'FIRST_STEP',
    title: 'First Step Badge Unlocked!',
    message: 'Placed your first prediction position on wagr.io.',
  },
  PROPHET_1: {
    code: 'PROPHET_1',
    title: 'Prophet I Badge Unlocked!',
    message: 'Predicted 5 resolved markets correctly.',
  },
  ACCURACY_ELITE: {
    code: 'ACCURACY_ELITE',
    title: 'Accuracy Elite Badge Unlocked!',
    message: 'Maintained an accuracy rate of >= 80% over 5+ resolved positions.',
  },
  MXP_TYCOON: {
    code: 'MXP_TYCOON',
    title: 'MXP Tycoon Badge Unlocked!',
    message: 'Reached a portfolio value of 10,000 MXP or more.',
  },
  MARKET_PIONEER: {
    code: 'MARKET_PIONEER',
    title: 'Market Pioneer Badge Unlocked!',
    message: 'Proposed a market that was approved by an administrator.',
  },
  INFLUENCER: {
    code: 'INFLUENCER',
    title: 'Influencer Badge Unlocked!',
    message: 'Gained 3 or more followers on wagr.io.',
  },
};

/**
 * Recalculates user's accuracy and portfolio value, saves to database,
 * and triggers achievement check logic.
 * @param {string} userId - ID of the user
 * @param {string} triggerType - 'TRADE_OPEN' | 'TRADE_RESOLVE' | 'MARKET_APPROVE' | 'FOLLOW' | 'PORTFOLIO_UPDATE'
 */
export const updateUserStatsAndCheckAchievements = async (userId, triggerType) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // 1. Recalculate predictionAccuracy
    const resolvedPositions = await Position.find({ userId, status: 'Resolved' });
    const wins = resolvedPositions.filter(p => p.profitLoss > 0).length;
    const totalResolved = resolvedPositions.length;
    const accuracy = totalResolved > 0 ? Math.round((wins / totalResolved) * 100) : 0;
    user.predictionAccuracy = accuracy;

    // 2. Recalculate portfolioValue = mxpBalance + sum(open positions current values)
    const openPositions = await Position.find({ userId, status: 'Open' }).populate('marketId');
    let openPositionsValue = 0;
    for (const pos of openPositions) {
      const market = pos.marketId;
      if (market) {
        const currentProb = pos.outcome === 'YES' ? market.yesProbability : market.noProbability;
        const currentValue = Math.round(pos.investedAmount * (currentProb / pos.entryProbability));
        openPositionsValue += currentValue;
      } else {
        openPositionsValue += pos.investedAmount;
      }
    }
    user.portfolioValue = user.mxpBalance + openPositionsValue;
    await user.save();

    // 3. Unlocks calculation
    const unlockedCodes = new Set(user.achievements.map(a => a.code));
    const toUnlock = [];

    const unlock = (badgeCode) => {
      if (!unlockedCodes.has(badgeCode)) {
        toUnlock.push(badgeCode);
      }
    };

    // Badge 1: FIRST_STEP
    if (triggerType === 'TRADE_OPEN') {
      const positionsCount = await Position.countDocuments({ userId });
      if (positionsCount > 0) {
        unlock('FIRST_STEP');
      }
    }

    // Badge 2: PROPHET_1 & Badge 3: ACCURACY_ELITE
    if (triggerType === 'TRADE_RESOLVE') {
      if (wins >= 5) {
        unlock('PROPHET_1');
      }
      if (totalResolved >= 5 && accuracy >= 80) {
        unlock('ACCURACY_ELITE');
      }
    }

    // Badge 4: MXP_TYCOON
    if (user.portfolioValue >= 10000) {
      unlock('MXP_TYCOON');
    }

    // Badge 5: MARKET_PIONEER
    if (triggerType === 'MARKET_APPROVE') {
      const approvedCount = await Market.countDocuments({ createdBy: userId, status: 'Live' });
      if (approvedCount > 0) {
        unlock('MARKET_PIONEER');
      }
    }

    // Badge 6: INFLUENCER
    if (triggerType === 'FOLLOW') {
      if (user.followers && user.followers.length >= 3) {
        unlock('INFLUENCER');
      }
    }

    // Apply new unlocks
    if (toUnlock.length > 0) {
      const now = new Date();
      toUnlock.forEach(code => {
        user.achievements.push({ code, unlockedAt: now });
      });

      await user.save();

      // Send real-time notification/toast for each unlock
      for (const code of toUnlock) {
        const meta = ACHIEVEMENTS[code];
        if (meta) {
          await createAndSendNotification({
            userId,
            title: meta.title,
            message: meta.message,
            type: 'Verification', // Reuses verification toast style
            redirectUrl: '/dashboard',
          });
        }
      }
    }
  } catch (error) {
    console.error('❌ Error updating user stats/achievements:', error);
  }
};
