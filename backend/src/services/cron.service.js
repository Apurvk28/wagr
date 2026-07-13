import cron from 'node-cron';
import Market from '../models/market.model.js';
import News from '../models/news.model.js';
import { getIo } from './socket.service.js';
import { syncAiNewsFromGroq } from './aiNews.service.js';
import { generateMarketsSuggestions } from './aiGeneration.service.js';
import { simulateMarketSentiment } from './aiSentiment.service.js';

/**
 * Check and lock expired prediction markets.
 * Runs every minute to find markets that have passed their resolution date.
 */
export const checkExpiredMarkets = async () => {
  try {
    const now = new Date();
    // Fetch live markets that have reached or passed their resolutionDate
    const expiredMarkets = await Market.find({
      status: 'Live',
      resolutionDate: { $lte: now }
    });

    if (expiredMarkets.length === 0) return;

    console.log(`⏰ Found ${expiredMarkets.length} expired prediction markets. Locking and queuing for resolution...`);

    for (const market of expiredMarkets) {
      // Set status to 'Pending Approval' (this acts as the locked admin queue for resolution)
      market.status = 'Pending Approval';
      await market.save();

      // Emit status updates to connected clients
      const io = getIo();
      if (io) {
        io.emit('market_update', {
          marketId: market._id,
          status: market.status,
          yesProbability: market.yesProbability,
          noProbability: market.noProbability,
        });
      }
    }
  } catch (error) {
    console.error('❌ Error checking/locking expired markets:', error.message);
  }
};

/**
 * Daily cleanup job for short-term markets.
 * Archives resolved short-term markets and deletes outdated short-term news.
 */
export const archiveShortTermMarkets = async () => {
  try {
    console.log('🧹 Running daily short-term markets archiving and news cleanup...');
    const now = new Date();

    // 1. Find resolved short-term markets and set status to Archived
    const archivedCount = await Market.updateMany(
      {
        marketType: 'Short-Term',
        status: 'Resolved'
      },
      {
        $set: { status: 'Archived' }
      }
    );
    console.log(`📦 Archived ${archivedCount.modifiedCount} resolved short-term markets.`);

    // 2. Remove outdated news linked to archived markets
    const archivedMarketsList = await Market.find({
      marketType: 'Short-Term',
      status: 'Archived'
    }).select('_id');
    const archivedMarketIds = archivedMarketsList.map(m => m._id);

    if (archivedMarketIds.length > 0) {
      const deletedNews = await News.deleteMany({
        relatedMarket: { $in: archivedMarketIds }
      });
      console.log(`📰 Cleaned up ${deletedNews.deletedCount} outdated news briefings.`);
    }
  } catch (error) {
    console.error('❌ Error archiving short-term markets:', error.message);
  }
};

/**
 * Initializes and starts all scheduled background jobs.
 */
export const startCronJobs = () => {
  console.log('⏰ Initializing Wagr Cron Schedulers...');

  // 1. Every Minute: Check and lock expired markets
  cron.schedule('* * * * *', async () => {
    console.log('[Cron] Checking for expired markets...');
    await checkExpiredMarkets();
  });

  // 2. Every Hour: Fetch latest news & simulate AI market sentiment fluctuations
  cron.schedule('0 * * * *', async () => {
    console.log('[Cron] Fetching latest AI news briefs and simulating market sentiment...');
    try {
      await syncAiNewsFromGroq();
      await simulateMarketSentiment();
    } catch (err) {
      console.error('[Cron] Hourly news and sentiment update failed:', err.message);
    }
  });

  // 3. Every 6 Hours: Generate new Long-Term market suggestions
  cron.schedule('0 */6 * * *', async () => {
    console.log('[Cron] Generating new Long-Term market suggestions...');
    try {
      await generateMarketsSuggestions('Long-Term');
    } catch (err) {
      console.error('[Cron] Long-Term market suggestions generation failed:', err.message);
    }
  });

  // 4. Every Day at Midnight: Archive expired short-term markets & generate a fresh set
  cron.schedule('0 0 * * *', async () => {
    console.log('[Cron] Executing daily archiving, daily news cleanup, and short-term suggestions generation...');
    try {
      await archiveShortTermMarkets();
      await generateMarketsSuggestions('Short-Term');
      await syncAiNewsFromGroq(); // Refresh news immediately for the new markets
    } catch (err) {
      console.error('[Cron] Daily archiving and short-term regeneration failed:', err.message);
    }
  });

  console.log('🚀 All Wagr Cron Schedulers are active and running.');
};
