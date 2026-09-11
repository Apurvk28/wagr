import cron from 'node-cron';
import Market from '../models/market.model.js';
import User from '../models/user.model.js';
import { syncAiNewsFromGroq } from './aiNews.service.js';
import { generateMarketsSuggestions } from './aiGeneration.service.js';
import { simulateMarketSentiment } from './aiSentiment.service.js';
import { executeMarketResolution } from './marketResolution.service.js';
import { APP_TIMEZONE, isInShortTermMaintenanceWindow } from '../utils/dateUtils.js';

/**
 * Check and resolve expired prediction markets automatically when their resolutionDate is reached.
 * Runs every minute to find active markets where resolutionDate <= now.
 */
export const checkExpiredMarkets = async () => {
  try {
    const now = new Date();
    const expiredMarkets = await Market.find({
      status: 'Live',
      resolutionDate: { $lte: now }
    });

    if (expiredMarkets.length === 0) return;

    console.log(`⏰ Found ${expiredMarkets.length} expired prediction markets. Auto-resolving and distributing payouts...`);

    for (const market of expiredMarkets) {
      const winningOutcome = market.yesProbability >= 50 ? 'YES' : 'NO';
      await executeMarketResolution(market._id, winningOutcome, 'Automated timeline expiration');
    }
  } catch (error) {
    console.error('❌ Error checking/resolving expired markets:', error.message);
  }
};

/**
 * Ensures there are active (Live) markets of the specified type in the database.
 * If below target count (e.g. 4), calls generateMarketsSuggestions to draft more.
 */
export const ensureMinimumMarkets = async (marketType) => {
  try {
    if (marketType === 'Short-Term' && isInShortTermMaintenanceWindow()) {
      console.log('[Cron] Short-Term markets are in daily break window (11:00 PM - 12:05 AM). Skipping creation.');
      return;
    }

    const now = new Date();
    const activeCount = await Market.countDocuments({
      status: 'Live',
      marketType,
      resolutionDate: { $gt: now }
    });

    if (activeCount < 4) {
      console.log(`[Cron] Active ${marketType} markets count (${activeCount}) below 4. Generating new proposals...`);
      const generated = await generateMarketsSuggestions(marketType);
      if (generated.length > 0) {
        // Auto-approve system-generated suggestions so they are immediately Live
        await Market.updateMany(
          { status: 'Pending Approval', marketType },
          { $set: { status: 'Live' } }
        );
      }
    }
  } catch (error) {
    console.error(`❌ Error maintaining active markets count for ${marketType}:`, error.message);
  }
};

/**
 * Initializes and starts all scheduled background jobs.
 */
export const startCronJobs = () => {
  console.log('⏰ Initializing Wagr Cron Schedulers...');

  // 1. Every Minute: Check for expired markets and resolve them
  cron.schedule('* * * * *', async () => {
    await checkExpiredMarkets();
  });

  // 2. Every Hour: Sync AI news briefs and simulate market sentiment fluctuations
  cron.schedule('0 * * * *', async () => {
    console.log('[Cron] Hourly news sync and market sentiment simulation...');
    try {
      await syncAiNewsFromGroq();
      await simulateMarketSentiment();
      await ensureMinimumMarkets('Long-Term');
      await ensureMinimumMarkets('Short-Term');
    } catch (err) {
      console.error('[Cron] Hourly task failed:', err.message);
    }
  });

  // 3. Every 6 Hours: Draft new Long-Term markets
  cron.schedule('0 */6 * * *', async () => {
    console.log('[Cron] Generating 6-hour Long-Term market suggestions...');
    try {
      await generateMarketsSuggestions('Long-Term');
    } catch (err) {
      console.error('[Cron] 6-hour Long-Term generation failed:', err.message);
    }
  });

  // 4. Daily at 12:05 AM in Wagr's configured timezone: Generate fresh Short-Term markets for the new calendar day
  cron.schedule('5 0 * * *', async () => {
    console.log(`🌅 [Cron 12:05 AM ${APP_TIMEZONE}] Executing daily Short-Term market refresh for new calendar cycle...`);
    try {
      await generateMarketsSuggestions('Short-Term');
      // Auto-approve newly created short-term markets to make them Live for today's trading
      await Market.updateMany(
        { status: 'Pending Approval', marketType: 'Short-Term' },
        { $set: { status: 'Live' } }
      );
      await syncAiNewsFromGroq();
    } catch (err) {
      console.error('[Cron] Daily 12:05 AM Short-Term refresh failed:', err.message);
    }
  }, { timezone: APP_TIMEZONE });

  console.log('🚀 All Wagr Cron Schedulers are active and running.');
};
