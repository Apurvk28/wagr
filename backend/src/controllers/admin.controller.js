import User from '../models/user.model.js';
import Market from '../models/market.model.js';
import Position from '../models/position.model.js';
import Post from '../models/post.model.js';
import MxpRequest from '../models/mxpRequest.model.js';
import { checkExpiredMarkets, archiveShortTermMarkets } from '../services/cron.service.js';
import { generateMarketsSuggestions } from '../services/aiGeneration.service.js';
import { syncAiNewsFromGroq } from '../services/aiNews.service.js';
import { createAndSendNotification } from '../services/notification.service.js';

/**
 * @desc    Get admin dashboard statistics
 * @route   GET /api/v1/admin/dashboard
 * @access  Private/Admin
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalMarkets,
      liveMarkets,
      pendingMarkets,
      totalPositions,
      resolvedMarkets,
      totalPosts,
    ] = await Promise.all([
      User.countDocuments(),
      Market.countDocuments(),
      Market.countDocuments({ status: 'Live' }),
      Market.countDocuments({ status: 'Pending Approval' }),
      Position.countDocuments(),
      Market.countDocuments({ status: 'Resolved' }),
      Post.countDocuments(),
    ]);

    // Calculate total trading volume across all positions
    const volumeAgg = await Position.aggregate([
      { $group: { _id: null, total: { $sum: '$investedAmount' } } },
    ]);
    const totalVolume = volumeAgg.length > 0 ? volumeAgg[0].total : 0;

    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        recentUsers,
        totalMarkets,
        liveMarkets,
        resolvedMarkets,
        pendingMarkets,
        totalPositions,
        totalVolume,
        totalPosts,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users (with optional search)
 * @route   GET /api/v1/admin/users?search=
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { search = '' } = req.query;

    const query = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: 'i' } },
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const users = await User.find(query)
      .select('-password -verificationToken -resetPasswordToken -resetPasswordExpire')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle suspend/unsuspend a user
 * @route   PUT /api/v1/admin/users/:id/suspend
 * @access  Private/Admin
 */
export const suspendUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.role === 'Admin') {
      return res.status(400).json({ success: false, message: 'Cannot suspend another administrator.' });
    }

    // Toggle isSuspended — add field dynamically if it doesn't exist
    user.isSuspended = !user.isSuspended;
    await user.save();

    res.status(200).json({
      success: true,
      message: user.isSuspended ? 'User suspended successfully.' : 'User unsuspended successfully.',
      data: { isSuspended: user.isSuspended },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all pending market submissions
 * @route   GET /api/v1/admin/markets/pending
 * @access  Private/Admin
 */
export const getAllPendingMarkets = async (req, res, next) => {
  try {
    const markets = await Market.find({ status: 'Pending Approval' })
      .populate('createdBy', 'fullName username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: markets,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a community post (admin moderation)
 * @route   DELETE /api/v1/admin/posts/:id
 * @access  Private/Admin
 */
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Community post deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all community posts (for admin moderation)
 * @route   GET /api/v1/admin/posts
 * @access  Private/Admin
 */
export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'fullName username')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Manually trigger cron background updates
 * @route   POST /api/v1/admin/cron/trigger
 * @access  Private/Admin
 */
export const triggerCronJobs = async (req, res, next) => {
  try {
    console.log('⚡ Manually triggering simulated V1.1 cron background tasks...');
    await checkExpiredMarkets();
    await archiveShortTermMarkets();
    await generateMarketsSuggestions('Short-Term');
    await generateMarketsSuggestions('Long-Term');
    await syncAiNewsFromGroq();

    res.status(200).json({
      success: true,
      message: 'Simulated daily updates and AI news fetches triggered successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all user MXP credit requests
 * @route   GET /api/v1/admin/mxp-requests
 * @access  Private/Admin
 */
export const getAdminMxpRequests = async (req, res, next) => {
  try {
    const requests = await MxpRequest.find()
      .populate('userId', 'fullName username email mxpBalance')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve user MXP credit request
 * @route   PUT /api/v1/admin/mxp-requests/:id/approve
 * @access  Private/Admin
 */
export const approveMxpRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await MxpRequest.findById(id).populate('userId');
    if (!request) {
      return res.status(404).json({ success: false, message: 'MXP request not found.' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({ success: false, message: `Request is already ${request.status}.` });
    }

    const user = await User.findById(request.userId._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    user.mxpBalance += request.amount;
    await user.save();

    request.status = 'Approved';
    request.adminNote = req.body.adminNote || 'Approved by Administrator';
    await request.save();

    await createAndSendNotification({
      userId: user._id,
      title: '🎁 MXP Request Approved!',
      message: `Your request for ${request.amount.toLocaleString()} MXP has been approved by Admin! Your new balance is ${user.mxpBalance.toLocaleString()} MXP.`,
      type: 'Market_Settlement',
    });

    res.status(200).json({
      success: true,
      message: `Approved ${request.amount} MXP grant for ${user.username}.`,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reject user MXP credit request
 * @route   PUT /api/v1/admin/mxp-requests/:id/reject
 * @access  Private/Admin
 */
export const rejectMxpRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await MxpRequest.findById(id).populate('userId');
    if (!request) {
      return res.status(404).json({ success: false, message: 'MXP request not found.' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({ success: false, message: `Request is already ${request.status}.` });
    }

    request.status = 'Rejected';
    request.adminNote = req.body.adminNote || 'Declined by Administrator';
    await request.save();

    await createAndSendNotification({
      userId: request.userId._id,
      title: '⚠️ MXP Request Update',
      message: `Your request for ${request.amount.toLocaleString()} MXP was reviewed and declined by Admin.`,
      type: 'System',
    });

    res.status(200).json({
      success: true,
      message: 'MXP request declined.',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};
