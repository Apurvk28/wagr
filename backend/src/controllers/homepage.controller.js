import { mockMarkets, mockNews, mockPosts } from '../utils/mockData.js';

/**
 * @desc    Get trending prediction markets
 * @route   GET /api/v1/markets/trending
 * @access  Public
 */
export const getTrendingMarkets = async (req, res, next) => {
  try {
    // Return a subset of markets marked as trending (e.g., first 3)
    const trending = mockMarkets.slice(0, 3);
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
 * @desc    Get active prediction markets (high volume)
 * @route   GET /api/v1/markets/active
 * @access  Public
 */
export const getActiveMarkets = async (req, res, next) => {
  try {
    // Sort mock markets by volume descending and return top 3
    const active = [...mockMarkets].sort((a, b) => b.volume - a.volume).slice(0, 3);
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
    res.status(200).json({
      success: true,
      message: 'Latest news retrieved successfully.',
      data: mockNews,
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
    res.status(200).json({
      success: true,
      message: 'Community highlights retrieved successfully.',
      data: mockPosts,
    });
  } catch (error) {
    next(error);
  }
};
