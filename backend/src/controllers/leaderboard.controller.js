import User from '../models/user.model.js';

/**
 * @desc    Get global leaderboard rankings
 * @route   GET /api/v1/leaderboard
 * @access  Public
 */
export const getLeaderboard = async (req, res, next) => {
  try {
    const { sortBy = 'profit', limit = 50 } = req.query;

    let sortOption = {};
    if (sortBy === 'accuracy') {
      sortOption = { predictionAccuracy: -1, portfolioValue: -1 };
    } else {
      // Default to sorting by portfolioValue (profit)
      sortOption = { portfolioValue: -1, mxpBalance: -1 };
    }

    // Exclude Admins and suspended users from competition
    const query = {
      role: 'User',
      isSuspended: { $ne: true },
    };

    const users = await User.find(query)
      .select('fullName username mxpBalance portfolioValue predictionAccuracy achievements')
      .sort(sortOption)
      .limit(Number(limit));

    // Map output with clean response fields and rank
    const leaderboardData = users.map((user, idx) => ({
      rank: idx + 1,
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      mxpBalance: user.mxpBalance,
      portfolioValue: user.portfolioValue,
      predictionAccuracy: user.predictionAccuracy,
      badgesCount: user.achievements?.length || 0,
    }));

    res.status(200).json({
      success: true,
      data: leaderboardData,
    });
  } catch (error) {
    next(error);
  }
};
