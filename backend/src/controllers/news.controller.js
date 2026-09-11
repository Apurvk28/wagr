import News from '../models/news.model.js';
import { syncAiNewsFromGroq } from '../services/aiNews.service.js';

/**
 * @desc    Get all news articles (with search, category, and market filters)
 * @route   GET /api/v1/news
 * @access  Public
 */
export const getNewsFeed = async (req, res, next) => {
  try {
    const { search, category, marketId, type } = req.query;

    const query = {};

    // Filter by search keywords in headline or summary
    if (search) {
      const safeSearch = search.trim();
      query.$or = [
        { headline: { $regex: safeSearch, $options: 'i' } },
        { summary: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by related prediction market ID
    if (marketId) {
      query.relatedMarket = marketId;
    }

    // Handle explicit news section types: 'market' (Market-Related News) vs 'general' (General News)
    if (type === 'market') {
      query.relatedMarket = { $ne: null };
    } else if (type === 'general') {
      query.$or = [
        { relatedMarket: null },
        { relatedMarket: { $exists: false } }
      ];
    }

    const limitCap = type === 'market' ? 10 : (type === 'general' ? 15 : 25);

    // Fetch news sorted by published date (newest first)
    const newsFeed = await News.find(query)
      .populate({
        path: 'relatedMarket',
        select: 'title status yesProbability noProbability marketType resolutionDate',
      })
      .sort({ publishedDate: -1, createdAt: -1 })
      .limit(limitCap);

    // Filter out articles where relatedMarket populate failed or market is not Live (for market-type queries)
    const filteredData = type === 'market' 
      ? newsFeed.filter(n => n.relatedMarket && n.relatedMarket.status === 'Live') 
      : newsFeed;

    res.status(200).json({
      success: true,
      message: 'News feed retrieved successfully.',
      data: filteredData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single news article detail
 * @route   GET /api/v1/news/:id
 * @access  Public
 */
export const getNewsById = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id)
      .populate('relatedMarket', 'title status yesProbability noProbability marketType');

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News briefing not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'News briefing retrieved successfully.',
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Trigger AI news processing & synchronization (Admin Only)
 * @route   POST /api/v1/news/fetch
 * @access  Private/Admin
 */
export const triggerAiNewsFetch = async (req, res, next) => {
  try {
    // Calling our background LLM service
    const syncedArticles = await syncAiNewsFromGroq();

    res.status(200).json({
      success: true,
      message: `AI News synchronization completed successfully. Synced ${syncedArticles.length} new articles.`,
      data: syncedArticles,
    });
  } catch (error) {
    next(error);
  }
};
