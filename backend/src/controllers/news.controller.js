import News from '../models/news.model.js';
import { syncAiNewsFromGroq } from '../services/aiNews.service.js';

/**
 * @desc    Get all news articles (with search, category, and market filters)
 * @route   GET /api/v1/news
 * @access  Public
 */
export const getNewsFeed = async (req, res, next) => {
  try {
    const { search, category, marketId } = req.query;

    const query = {};

    // Filter by search keywords in headline or summary
    if (search) {
      query.$or = [
        { headline: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by related prediction market ID
    if (marketId) {
      query.relatedMarket = marketId;
    }

    // Fetch news sorted by published date (newest first)
    const newsFeed = await News.find(query)
      .populate('relatedMarket', 'title status yesProbability noProbability')
      .sort({ publishedDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'News feed retrieved successfully.',
      data: newsFeed,
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
      .populate('relatedMarket', 'title status yesProbability noProbability');

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
