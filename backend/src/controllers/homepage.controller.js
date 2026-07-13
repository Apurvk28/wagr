import Market from '../models/market.model.js';
import News from '../models/news.model.js';
import Post from '../models/post.model.js';

/**
 * @desc    Get trending prediction markets (highest volume live markets)
 * @route   GET /api/v1/markets/trending
 * @access  Public
 */
export const getTrendingMarkets = async (req, res, next) => {
  try {
    const trending = await Market.find({ status: 'Live' })
      .sort({ volume: -1 })
      .limit(3);

    res.status(200).json({
      success: true,
      message: 'Trending markets retrieved successfully.',
      data: trending,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get active prediction markets (highest participants count live markets)
 * @route   GET /api/v1/markets/active
 * @access  Public
 */
export const getActiveMarkets = async (req, res, next) => {
  try {
    const active = await Market.find({ status: 'Live' })
      .sort({ participantsCount: -1, volume: -1 })
      .limit(3);

    res.status(200).json({
      success: true,
      message: 'Active markets retrieved successfully.',
      data: active,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get latest news articles
 * @route   GET /api/v1/news/latest
 * @access  Public
 */
export const getLatestNews = async (req, res, next) => {
  try {
    const latestNews = await News.find()
      .populate('relatedMarket', 'title status yesProbability noProbability marketType')
      .sort({ publishedDate: -1, createdAt: -1 })
      .limit(3);

    res.status(200).json({
      success: true,
      message: 'Latest news retrieved successfully.',
      data: latestNews,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get community highlights posts
 * @route   GET /api/v1/community/highlights
 * @access  Public
 */
export const getCommunityHighlights = async (req, res, next) => {
  try {
    // Fetch latest community posts and populate author details
    const posts = await Post.find()
      .populate('userId', 'fullName username')
      .sort({ createdAt: -1 })
      .limit(3);

    // Map to include likesCount fields for frontend rendering compatibility
    const mappedPosts = posts.map(post => {
      const doc = post.toObject();
      return {
        ...doc,
        likesCount: doc.likes ? doc.likes.length : 0
      };
    });

    res.status(200).json({
      success: true,
      message: 'Community highlights retrieved successfully.',
      data: mappedPosts,
    });
  } catch (error) {
    next(error);
  }
};
