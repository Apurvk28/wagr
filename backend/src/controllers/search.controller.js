import Market from '../models/market.model.js';
import User from '../models/user.model.js';
import News from '../models/news.model.js';
import Post from '../models/post.model.js';

/**
 * @desc    Global search across markets, users, news, and posts
 * @route   GET /api/v1/search?q=
 * @access  Public
 */
export const globalSearch = async (req, res, next) => {
  try {
    const { q = '' } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters.',
      });
    }

    const query = q.trim();
    const regex = { $regex: query, $options: 'i' };

    // Run all searches in parallel for speed
    const [markets, users, news, posts] = await Promise.all([
      Market.find({
        $or: [{ title: regex }, { description: regex }, { category: regex }],
        status: { $in: ['Live', 'Pending Approval'] },
      })
        .select('title category yesProbability noProbability status resolutionDate')
        .limit(5),

      User.find({
        $or: [{ fullName: regex }, { username: regex }],
        isVerified: true,
      })
        .select('fullName username predictionAccuracy')
        .limit(5),

      News.find({
        $or: [{ headline: regex }, { summary: regex }, { category: regex }],
      })
        .select('headline source category publishedDate url')
        .sort({ publishedDate: -1 })
        .limit(5),

      Post.find({ content: regex })
        .populate('userId', 'fullName username')
        .select('content userId createdAt')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.status(200).json({
      success: true,
      data: {
        query,
        markets,
        users,
        news,
        posts,
        total: markets.length + users.length + news.length + posts.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
