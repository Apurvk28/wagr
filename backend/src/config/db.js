import mongoose from 'mongoose';

import User from '../models/user.model.js';
import Market from '../models/market.model.js';
import News from '../models/news.model.js';
import { mockMarkets } from '../utils/mockData.js';

const seedDatabase = async () => {
  try {
    // Find or create generic system admin user (always check on startup)
    let admin = await User.findOne({ email: 'admin@wagr.io' });
    if (!admin) {
      admin = await User.create({
        fullName: 'Wagr Administrator',
        username: 'admin',
        email: 'admin@wagr.io',
        password: 'AdminPassword123!',
        role: 'Admin',
        isVerified: true,
        mxpBalance: 10000,
        portfolioValue: 10000,
      });
      console.log('👑 Created default administrator user: admin@wagr.io / AdminPassword123!');
    }

    // Always clean up any "test" or "test 1" markets on startup
    const deletedTestCount = await Market.deleteMany({ title: /test 1|test/i });
    if (deletedTestCount.deletedCount > 0) {
      console.log(`🧹 Cleaned up ${deletedTestCount.deletedCount} manual test markets from database.`);
    }

    const marketCount = await Market.countDocuments();
    if (marketCount > 0) {
      return;
    }

    console.log('🌱 Seeding database with default event contracts...');

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Insert mock markets
    const marketsToInsert = [
      ...mockMarkets.map(m => {
        const { _id, participants, ...rest } = m;
        return {
          ...rest,
          marketType: 'Long-Term',
          createdBy: admin._id,
          participants: [], // Initialize database participants as empty array
          // Seed some history points for recharts graphing
          probabilityHistory: [
            { yesProbability: m.yesProbability - 8, timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000) },
            { yesProbability: m.yesProbability + 5, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            { yesProbability: m.yesProbability, timestamp: new Date() }
          ]
        };
      }),
      // 6th Long-Term Market
      {
        title: 'Will SpaceX complete a Starship lunar landing demonstration in 2026?',
        description: 'Resolves to YES if SpaceX successfully conducts an uncrewed Starship lunar landing demonstration mission as part of NASA Artemis contract by December 31, 2026.',
        category: 'Technology',
        marketType: 'Long-Term',
        yesProbability: 55,
        noProbability: 45,
        volume: 76500,
        status: 'Live',
        resolutionDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),
        createdBy: admin._id,
        participants: [],
        probabilityHistory: [
          { yesProbability: 50, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          { yesProbability: 55, timestamp: new Date() }
        ]
      },
      // Short-Term Daily Markets (6 items)
      {
        title: 'Will the S&P 500 close green today?',
        description: 'Resolves to YES if the S&P 500 Index closes higher than yesterday\'s close today. This market will lock and archive at the end of the day.',
        category: 'Finance',
        marketType: 'Short-Term',
        yesProbability: 51,
        noProbability: 49,
        volume: 32400,
        status: 'Live',
        resolutionDate: endOfToday,
        createdBy: admin._id,
        participants: [],
        probabilityHistory: [
          { yesProbability: 50, timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) },
          { yesProbability: 51, timestamp: new Date() }
        ]
      },
      {
        title: 'Will Google announce a new Gemini update today?',
        description: 'Resolves to YES if Google officially announces or releases an update to the Gemini model family today. This market will lock and archive at the end of the day.',
        category: 'Artificial Intelligence',
        marketType: 'Short-Term',
        yesProbability: 45,
        noProbability: 55,
        volume: 18900,
        status: 'Live',
        resolutionDate: endOfToday,
        createdBy: admin._id,
        participants: [],
        probabilityHistory: [
          { yesProbability: 48, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
          { yesProbability: 45, timestamp: new Date() }
        ]
      },
      {
        title: 'Will NVIDIA stock close above $135 today?',
        description: 'Resolves to YES if NVIDIA common stock closes above $135 in normal Nasdaq trading hours today.',
        category: 'Finance',
        marketType: 'Short-Term',
        yesProbability: 55,
        noProbability: 45,
        volume: 45000,
        status: 'Live',
        resolutionDate: endOfToday,
        createdBy: admin._id,
        participants: [],
        probabilityHistory: [
          { yesProbability: 50, timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
          { yesProbability: 55, timestamp: new Date() }
        ]
      },
      {
        title: 'Will Bitcoin close above $120,000 today?',
        description: 'Resolves to YES if the index price of Bitcoin closes above $120,000 at 23:59 UTC today on global feeds.',
        category: 'Finance',
        marketType: 'Short-Term',
        yesProbability: 40,
        noProbability: 60,
        volume: 89000,
        status: 'Live',
        resolutionDate: endOfToday,
        createdBy: admin._id,
        participants: [],
        probabilityHistory: [
          { yesProbability: 42, timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
          { yesProbability: 40, timestamp: new Date() }
        ]
      },
      {
        title: 'Will SpaceX successfully launch a Falcon 9 rocket today?',
        description: 'Resolves to YES if SpaceX successfully launches and completes first stage recovery of a Falcon 9 mission today.',
        category: 'Technology',
        marketType: 'Short-Term',
        yesProbability: 85,
        noProbability: 15,
        volume: 12000,
        status: 'Live',
        resolutionDate: endOfToday,
        createdBy: admin._id,
        participants: [],
        probabilityHistory: [
          { yesProbability: 80, timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) },
          { yesProbability: 85, timestamp: new Date() }
        ]
      },
      {
        title: 'Will OpenAI release a new product update today?',
        description: 'Resolves to YES if OpenAI issues an official press release or conducts a product announcement today.',
        category: 'Artificial Intelligence',
        marketType: 'Short-Term',
        yesProbability: 50,
        noProbability: 50,
        volume: 15000,
        status: 'Live',
        resolutionDate: endOfToday,
        createdBy: admin._id,
        participants: [],
        probabilityHistory: [
          { yesProbability: 50, timestamp: new Date() }
        ]
      }
    ];

    const insertedMarkets = await Market.insertMany(marketsToInsert);
    console.log(`✅ Successfully seeded database with ${insertedMarkets.length} event contracts.`);

    // Seed default news briefings mapped to generated markets
    const newsCount = await News.countDocuments();
    if (newsCount === 0 && insertedMarkets.length >= 3) {
      console.log('🌱 Seeding database with default news briefings...');
      const defaultNews = [
        {
          headline: 'Global Leaders Call for Urgent AI Development Regulations',
          summary: 'Governments worldwide are convening to establish frameworks for advanced AI systems. Discussions focus on compute limits, safety audits, and safety checkpoints.',
          source: 'Reuters',
          url: 'https://reuters.com/ai-safety-summit-2026',
          category: 'Artificial Intelligence',
          relatedMarket: insertedMarkets[0]._id,
          aiSummary: 'AI Impact: Regulatory clarity increases the likelihood of structured rollouts, pushing YES probabilities up.'
        },
        {
          headline: 'Tech Giants Form Alliance for Next-Gen Computing Infrastructure',
          summary: 'A new coalition of semiconductor firms and software developers is coordinating to build high-performance computing centers.',
          source: 'TechCrunch',
          url: 'https://techcrunch.com/datacenters-semiconductor-alliance',
          category: 'Technology',
          relatedMarket: insertedMarkets[1]._id,
          aiSummary: 'AI Impact: Strong hardware alliance speeds up timeline forecasts.'
        },
        {
          headline: 'Wall Street Indices Hit New Record Highs Amid Tech Surge',
          summary: 'Major indices posted significant gains today as tech sectors rally on positive corporate earnings and low inflation data.',
          source: 'Bloomberg',
          url: 'https://bloomberg.com/wall-street-record-highs',
          category: 'Finance',
          relatedMarket: insertedMarkets[2]._id,
          aiSummary: 'AI Impact: Bullish sentiment increases trading volume projections.'
        }
      ];
      await News.insertMany(defaultNews);
      console.log('✅ Successfully seeded database with default news briefings.');
    }
  } catch (error) {
    console.error(`❌ Database seeding failed: ${error.message}`);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedDatabase();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
