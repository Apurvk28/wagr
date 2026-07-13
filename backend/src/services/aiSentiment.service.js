import Market from '../models/market.model.js';
import { getIo } from './socket.service.js';

/**
 * Periodically adjust active prediction markets' liquidity pools 
 * to simulate buying/selling sentiment, controlled momentum, and volatility.
 */
export const simulateMarketSentiment = async () => {
  try {
    const liveMarkets = await Market.find({ status: 'Live' });
    if (liveMarkets.length === 0) return;

    console.log(`🧠 Simulating AI market sentiment fluctuations for ${liveMarkets.length} live markets...`);

    for (const market of liveMarkets) {
      // 1. Determine adjustments based on marketType
      const isShortTerm = market.marketType === 'Short-Term';
      
      // Determine simulation amount: 100-500 for Short-Term, 10-50 for Long-Term
      const minStake = isShortTerm ? 100 : 10;
      const maxStake = isShortTerm ? 500 : 50;
      const amount = Math.floor(Math.random() * (maxStake - minStake + 1)) + minStake;

      // Randomly decide direction: BUY YES (sentiment up) or BUY NO (sentiment down)
      const action = Math.random() > 0.5 ? 'YES' : 'NO';

      // 2. Adjust pools accordingly
      if (action === 'YES') {
        market.totalYesPool += amount;
      } else {
        market.totalNoPool += amount;
      }

      // Add to volume to simulate active trading
      market.volume += amount;

      // Add history point (pre-save hook will compute probabilities and append initial history if empty,
      // but here we push a fresh point to probabilityHistory)
      const totalPool = market.totalYesPool + market.totalNoPool;
      const C = 1000;
      const yesProb = Math.round(((market.totalYesPool + C) / (totalPool + 2 * C)) * 100);
      
      market.probabilityHistory.push({
        yesProbability: yesProb,
        timestamp: new Date(),
      });

      // Keep history capped to last 50 points to prevent document bloat
      if (market.probabilityHistory.length > 50) {
        market.probabilityHistory.shift();
      }

      await market.save();

      // 3. Emit real-time updates via Socket.IO
      const io = getIo();
      if (io) {
        io.emit('market_update', {
          marketId: market._id,
          yesProbability: market.yesProbability,
          noProbability: market.noProbability,
          volume: market.volume,
          participantsCount: market.participantsCount,
          probabilityHistory: market.probabilityHistory,
        });
      }
    }
    console.log('✅ AI Market sentiment simulation updates broadcasted successfully.');
  } catch (error) {
    console.error('❌ Error simulating AI market sentiment:', error.message);
  }
};
