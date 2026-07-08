import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import Position from '../models/position.model.js';

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
    }

    await currentUser.save();
    await targetUser.save();

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

