import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import Position from '../models/position.model.js';
import { createAndSendNotification } from '../services/notification.service.js';
import { updateUserStatsAndCheckAchievements } from '../services/achievement.service.js';

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/users/profile
 * @access  Private
 */
export const getProfile = async (req, res, next) => {
  try {
    // req.user is already populated by the protect middleware
    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully.',
      data: {
        id: req.user._id,
        fullName: req.user.fullName,
        username: req.user.username,
        email: req.user.email,
        mxpBalance: req.user.mxpBalance,
        portfolioValue: req.user.portfolioValue,
        predictionAccuracy: req.user.predictionAccuracy,
        followersCount: req.user.followers?.length || 0,
        followingCount: req.user.following?.length || 0,
        role: req.user.role,
        isVerified: req.user.isVerified,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile info
 * @route   PUT /api/v1/users/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  const { fullName } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Update editable fields
    if (fullName) user.fullName = fullName.trim();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        mxpBalance: user.mxpBalance,
        portfolioValue: user.portfolioValue,
        predictionAccuracy: user.predictionAccuracy,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Adjust admin balance (+/- MXP)
 * @route   POST /api/v1/users/admin/balance
 * @access  Private/Admin
 */
export const adjustAdminBalance = async (req, res, next) => {
  const { amount } = req.body;

  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can adjust balances.',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const diff = Number(amount);
    if (isNaN(diff)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid adjustment amount.',
      });
    }

    user.mxpBalance = Math.max(0, user.mxpBalance + diff);
    user.portfolioValue = Math.max(0, user.portfolioValue + diff);
    await user.save();

    res.status(200).json({
      success: true,
      message: `Balance adjusted by ${diff >= 0 ? '+' : ''}${diff} MXP.`,
      data: {
        mxpBalance: user.mxpBalance,
        portfolioValue: user.portfolioValue,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get public profile of another user
 * @route   GET /api/v1/users/profile/:username
 * @access  Public
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Calculations for accuracy, posts count and markets count
    const totalPosts = await Post.countDocuments({ userId: user._id });
    
    const participatedMarketIds = await Position.distinct('marketId', { userId: user._id });
    const marketsParticipated = participatedMarketIds.length;

    const resolvedPositions = await Position.find({ userId: user._id, status: 'Resolved' });
    const wins = resolvedPositions.filter(p => p.profitLoss > 0).length;
    const totalResolved = resolvedPositions.length;
    const calculatedAccuracy = totalResolved > 0 ? Math.round((wins / totalResolved) * 100) : 0;

    // Check if the current user (if logged in) is following this profile
    let isFollowing = false;
    if (req.user) {
      isFollowing = user.followers.includes(req.user._id);
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        followersCount: user.followers?.length || 0,
        followingCount: user.following?.length || 0,
        totalPosts,
        marketsParticipated,
        predictionAccuracy: calculatedAccuracy,
        isFollowing,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle follow a user
 * @route   POST /api/v1/users/:id/follow
 * @access  Private
 */
export const toggleFollowUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId.toString() === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself.',
      });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId.toString());
      targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId.toString());
    } else {
      // Follow
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);

      // Trigger follow notification
      await createAndSendNotification({
        userId: targetUserId,
        sender: currentUserId,
        title: 'New Follower',
        message: `${currentUser.fullName} (@${currentUser.username}) started following you.`,
        type: 'Follow',
        redirectUrl: `/user/${currentUser.username}`,
      });
    }

    await currentUser.save();
    await targetUser.save();

    // Trigger achievement checks for target user asynchronously
    if (!isFollowing) {
      updateUserStatsAndCheckAchievements(targetUserId, 'FOLLOW').catch(console.error);
    }

    res.status(200).json({
      success: true,
      message: isFollowing ? 'Unfollowed user successfully.' : 'Followed user successfully.',
      data: {
        isFollowing: !isFollowing,
        followersCount: targetUser.followers.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle follow a market category
 * @route   POST /api/v1/users/categories/follow
 * @access  Private
 */
export const toggleFollowCategory = async (req, res, next) => {
  try {
    const { category } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (!category || category.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category is required.',
      });
    }

    const cleanCategory = category.trim();
    const isFollowing = user.followedCategories.includes(cleanCategory);

    if (isFollowing) {
      user.followedCategories = user.followedCategories.filter(cat => cat !== cleanCategory);
    } else {
      user.followedCategories.push(cleanCategory);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: isFollowing ? `Unfollowed category "${cleanCategory}" successfully.` : `Followed category "${cleanCategory}" successfully.`,
      data: {
        isFollowing: !isFollowing,
        followedCategories: user.followedCategories,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's full portfolio (open positions + live P&L)
 * @route   GET /api/v1/users/portfolio
 * @access  Private
 */
export const getPortfolio = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch all open positions with populated market data
    const openPositions = await Position.find({ userId, status: 'Open' })
      .populate('marketId', 'title category yesProbability noProbability status resolutionDate')
      .sort({ createdAt: -1 });

    // Calculate live P&L for each open position
    const positionsWithPnL = openPositions.map(pos => {
      const market = pos.marketId;
      let currentProbability = pos.outcome === 'YES'
        ? (market?.yesProbability ?? pos.entryProbability)
        : (market?.noProbability ?? pos.entryProbability);

      const currentValue = Math.round(pos.investedAmount * (currentProbability / pos.entryProbability));
      const unrealizedPnL = currentValue - pos.investedAmount;

      return {
        _id: pos._id,
        market: market
          ? { _id: market._id, title: market.title, category: market.category, status: market.status, resolutionDate: market.resolutionDate }
          : null,
        outcome: pos.outcome,
        investedAmount: pos.investedAmount,
        entryProbability: pos.entryProbability,
        currentValue,
        unrealizedPnL,
        status: pos.status,
        createdAt: pos.createdAt,
      };
    });

    // Compute aggregate stats from resolved positions
    const resolvedPositions = await Position.find({ userId, status: 'Resolved' });
    const wins = resolvedPositions.filter(p => p.profitLoss > 0).length;
    const totalResolved = resolvedPositions.length;
    const winRate = totalResolved > 0 ? Math.round((wins / totalResolved) * 100) : 0;

    const totalUnrealizedPnL = positionsWithPnL.reduce((sum, p) => sum + p.unrealizedPnL, 0);

    // Ensure achievements are loaded
    const userDoc = await User.findById(userId).select('achievements');

    res.status(200).json({
      success: true,
      data: {
        mxpBalance: req.user.mxpBalance,
        portfolioValue: req.user.portfolioValue,
        predictionAccuracy: req.user.predictionAccuracy,
        winRate,
        totalResolved,
        wins,
        openPositionsCount: openPositions.length,
        totalUnrealizedPnL,
        achievements: userDoc?.achievements || [],
        openPositions: positionsWithPnL,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's complete trade history (closed + resolved)
 * @route   GET /api/v1/users/trades
 * @access  Private
 */
export const getTradingHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const trades = await Position.find({
      userId,
      status: { $in: ['Closed', 'Resolved'] },
    })
      .populate('marketId', 'title category status resolvedOutcome')
      .sort({ closedAt: -1 });

    res.status(200).json({
      success: true,
      data: trades,
    });
  } catch (error) {
    next(error);
  }
};
