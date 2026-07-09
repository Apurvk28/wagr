import Market from '../models/market.model.js';
import Position from '../models/position.model.js';
import User from '../models/user.model.js';
import { createAndSendNotification } from '../services/notification.service.js';

/**
 * @desc    Get all prediction markets (with search/filters)
 * @route   GET /api/v1/markets
 * @access  Public
 */
export const getMarkets = async (req, res, next) => {
  try {
    const { search, category, status } = req.query;

    const query = {};

    // Filter by search keyword
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by status (default is not Draft)
    if (status) {
      query.status = status;
    } else {
      query.status = { $ne: 'Draft' };
    }

    // Fetch markets sorted by status (Live first), then resolution date
    const markets = await Market.find(query)
      .sort({ status: 1, resolutionDate: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Markets retrieved successfully.',
      data: markets.map(m => {
        const obj = m.toObject();
        obj.participants = m.participants.length;
        return obj;
      }),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single market details
 * @route   GET /api/v1/markets/:id
 * @access  Public
 */
export const getMarketById = async (req, res, next) => {
  try {
    const market = await Market.findById(req.params.id);

    if (!market) {
      return res.status(404).json({
        success: false,
        message: 'Prediction market not found.',
      });
    }

    const marketObj = market.toObject();
    marketObj.participants = market.participants.length;

    res.status(200).json({
      success: true,
      message: 'Market details retrieved successfully.',
      data: marketObj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit a new prediction market
 * @route   POST /api/v1/markets
 * @access  Private
 */
export const createMarket = async (req, res, next) => {
  try {
    const { title, description, category, resolutionDate } = req.body;

    if (!title || !description || !category || !resolutionDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields.',
      });
    }

    if (new Date(resolutionDate) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Resolution date must be in the future.',
      });
    }

    // Standard users create Pending Approval markets, Admins create Live markets directly
    const status = req.user.role === 'Admin' ? 'Live' : 'Pending Approval';

    const market = await Market.create({
      title,
      description,
      category,
      resolutionDate,
      status,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: status === 'Live' ? 'Market created and listed successfully.' : 'Market submitted successfully for review.',
      data: market,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Open a trade position (Buy YES or NO)
 * @route   POST /api/v1/markets/:id/trade
 * @access  Private
 */
export const openTrade = async (req, res, next) => {
  try {
    const { outcome, amount } = req.body;
    const marketId = req.params.id;
    const user = req.user;

    // 1. Input validations
    if (!outcome || !['YES', 'NO'].includes(outcome)) {
      return res.status(400).json({
        success: false,
        message: 'Please choose outcome YES or NO.',
      });
    }

    const tradeAmount = Number(amount);
    if (isNaN(tradeAmount) || tradeAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid investment amount greater than zero.',
      });
    }

    // 2. Fetch market & validate status
    const market = await Market.findById(marketId);
    if (!market) {
      return res.status(404).json({
        success: false,
        message: 'Prediction market not found.',
      });
    }

    if (market.status !== 'Live') {
      return res.status(400).json({
        success: false,
        message: 'Trading is disabled for this market.',
      });
    }

    if (new Date(market.resolutionDate) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This market has reached its resolution date and is locked.',
      });
    }

    // 3. Wallet check
    if (user.mxpBalance < tradeAmount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient funds. Your available balance is ${user.mxpBalance} MXP.`,
      });
    }

    // 5. Determine current market probability for this outcome
    const currentProb = outcome === 'YES' ? market.yesProbability : market.noProbability;

    // 6. Deduct MXP from user balance
    user.mxpBalance -= tradeAmount;
    await user.save();

    // 7. Create new position entry for this trade
    const position = await Position.create({
      userId: user._id,
      marketId: market._id,
      outcome,
      investedAmount: tradeAmount,
      entryProbability: currentProb,
    });

    // Register user as participant if not already present in market
    if (!market.participants.includes(user._id)) {
      market.participants.push(user._id);
      market.participantsCount = market.participants.length;
    }

    // 8. Update Market pools and volume
    if (outcome === 'YES') {
      market.totalYesPool += tradeAmount;
    } else {
      market.totalNoPool += tradeAmount;
    }
    market.volume += tradeAmount;

    // Recalculating yesProbability & noProbability (handled in pre-save hook)
    // Save market (pushes new record to history and updates status)
    market.probabilityHistory.push({
      yesProbability: Math.round(((market.totalYesPool + 1000) / (market.totalYesPool + market.totalNoPool + 2000)) * 100),
      timestamp: new Date(),
    });
    await market.save();

    // 9. Emit real-time updates via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.emit('market_update', {
        marketId: market._id,
        yesProbability: market.yesProbability,
        noProbability: market.noProbability,
        volume: market.volume,
        participantsCount: market.participantsCount,
        probabilityHistory: market.probabilityHistory,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trade executed successfully.',
      data: {
        position,
        userBalance: user.mxpBalance,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Close an open trade position before market resolution
 * @route   POST /api/v1/markets/:id/close
 * @access  Private
 */
export const closeTrade = async (req, res, next) => {
  try {
    const marketId = req.params.id;
    const { positionId } = req.body;
    const user = req.user;

    // 1. Fetch active open position
    const query = { userId: user._id, status: 'Open' };
    if (positionId || req.query.positionId) {
      query._id = positionId || req.query.positionId;
    } else {
      query.marketId = marketId;
    }

    const position = await Position.findOne(query);

    if (!position) {
      return res.status(400).json({
        success: false,
        message: 'No active open position found in this prediction market.',
      });
    }

    // 2. Fetch market & validate status
    const market = await Market.findById(marketId);
    if (!market) {
      return res.status(404).json({
        success: false,
        message: 'Prediction market not found.',
      });
    }

    if (market.status !== 'Live') {
      return res.status(400).json({
        success: false,
        message: 'Manual position closure is disabled because the market is not active.',
      });
    }

    // 3. Calculate dynamic exit value
    const currentProb = position.outcome === 'YES' ? market.yesProbability : market.noProbability;
    const exitVal = Math.round(position.investedAmount * (currentProb / position.entryProbability));

    // 4. Return MXP exit value to user balance
    user.mxpBalance += exitVal;
    await user.save();

    // 5. Finalize Position document
    position.status = 'Closed';
    position.exitValue = exitVal;
    position.profitLoss = exitVal - position.investedAmount;
    position.closedAt = new Date();
    await position.save();

    // 6. Deduct initial investment amount from pools (keeps pool dynamics accurate)
    if (position.outcome === 'YES') {
      market.totalYesPool = Math.max(0, market.totalYesPool - position.investedAmount);
    } else {
      market.totalNoPool = Math.max(0, market.totalNoPool - position.investedAmount);
    }
    
    // Add exit value to volume
    market.volume += exitVal;

    // Recalculating probabilities and saving
    market.probabilityHistory.push({
      yesProbability: Math.round(((market.totalYesPool + 1000) / (market.totalYesPool + market.totalNoPool + 2000)) * 100),
      timestamp: new Date(),
    });
    await market.save();

    // 7. Emit Socket.IO updates
    const io = req.app.get('io');
    if (io) {
      io.emit('market_update', {
        marketId: market._id,
        yesProbability: market.yesProbability,
        noProbability: market.noProbability,
        volume: market.volume,
        participantsCount: market.participantsCount,
        probabilityHistory: market.probabilityHistory,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Position closed successfully.',
      data: {
        position,
        userBalance: user.mxpBalance,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Resolve a prediction market (Admin Only)
 * @route   POST /api/v1/markets/:id/resolve
 * @access  Private/Admin
 */
export const resolveMarket = async (req, res, next) => {
  try {
    const { outcome, resolutionSource } = req.body;
    const marketId = req.params.id;

    if (!outcome || !['YES', 'NO'].includes(outcome)) {
      return res.status(400).json({
        success: false,
        message: 'Please specify the winning outcome: YES or NO.',
      });
    }

    const market = await Market.findById(marketId);
    if (!market) {
      return res.status(404).json({
        success: false,
        message: 'Prediction market not found.',
      });
    }

    if (market.status !== 'Live' && market.status !== 'Pending Approval') {
      return res.status(400).json({
        success: false,
        message: 'This market is not active or has already been resolved.',
      });
    }

    // 1. Lock and resolve market settings
    market.status = 'Resolved';
    market.resolutionResult = outcome;
    market.resolutionSource = resolutionSource || 'Official administrative verification';
    market.yesProbability = outcome === 'YES' ? 100 : 0;
    market.noProbability = outcome === 'NO' ? 100 : 0;
    market.probabilityHistory.push({
      yesProbability: market.yesProbability,
      timestamp: new Date(),
    });
    await market.save();

    // 2. Fetch all active open positions in this market
    const openPositions = await Position.find({
      marketId: market._id,
      status: 'Open',
    });

    // 3. Process settlements for each participant and send notifications
    const notifiedUsers = new Set();
    for (const position of openPositions) {
      if (position.outcome === outcome) {
        // Winning positions receive payout based on 100% target settlement
        const payout = Math.round(position.investedAmount * (100 / position.entryProbability));

        // Credit user wallet
        const participant = await User.findById(position.userId);
        if (participant) {
          participant.mxpBalance += payout;
          await participant.save();
        }

        // Finalize winning position
        position.status = 'Resolved';
        position.exitValue = payout;
        position.profitLoss = payout - position.investedAmount;
        position.closedAt = new Date();
        await position.save();
      } else {
        // Losing positions expire worthless
        position.status = 'Resolved';
        position.exitValue = 0;
        position.profitLoss = -position.investedAmount;
        position.closedAt = new Date();
        await position.save();
      }

      // Send notification once per unique participant
      const uid = position.userId.toString();
      if (!notifiedUsers.has(uid)) {
        notifiedUsers.add(uid);
        const won = position.outcome === outcome;
        await createAndSendNotification({
          userId: position.userId,
          title: `Market Resolved: ${outcome}`,
          message: `"${market.title}" has been resolved ${outcome}. You ${won ? 'won' : 'lost'} this prediction.`,
          type: 'Market Resolved',
          redirectUrl: `/markets/${market._id}`,
        });
      }
    }

    // 4. Emit real-time resolution update
    const io = req.app.get('io');
    if (io) {
      io.emit('market_resolved', {
        marketId: market._id,
        outcome,
        yesProbability: market.yesProbability,
        noProbability: market.noProbability,
      });
    }

    res.status(200).json({
      success: true,
      message: `Market resolved successfully. Winning outcome: ${outcome}.`,
      data: market,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel a prediction market (Admin Only)
 * @route   POST /api/v1/markets/:id/cancel
 * @access  Private/Admin
 */
export const cancelMarket = async (req, res, next) => {
  try {
    const marketId = req.params.id;

    const market = await Market.findById(marketId);
    if (!market) {
      return res.status(404).json({
        success: false,
        message: 'Prediction market not found.',
      });
    }

    if (market.status !== 'Live' && market.status !== 'Pending Approval') {
      return res.status(400).json({
        success: false,
        message: 'Only active or pending approval markets can be cancelled.',
      });
    }

    // 1. Lock and cancel market settings
    market.status = 'Cancelled';
    await market.save();

    // 2. Fetch all active open positions in this market
    const openPositions = await Position.find({
      marketId: market._id,
      status: 'Open',
    });

    // 3. Issue full refunds to all participants and send notifications
    const cancelNotifiedUsers = new Set();
    for (const position of openPositions) {
      const participant = await User.findById(position.userId);
      if (participant) {
        participant.mxpBalance += position.investedAmount;
        await participant.save();
      }

      // Close position with entry value (break-even refund)
      position.status = 'Closed';
      position.exitValue = position.investedAmount;
      position.profitLoss = 0;
      position.closedAt = new Date();
      await position.save();

      // Send notification once per unique participant
      const uid = position.userId.toString();
      if (!cancelNotifiedUsers.has(uid)) {
        cancelNotifiedUsers.add(uid);
        await createAndSendNotification({
          userId: position.userId,
          title: 'Market Cancelled',
          message: `"${market.title}" was cancelled. Your investment of ${position.investedAmount} MXP has been fully refunded.`,
          type: 'Market Cancelled',
          redirectUrl: `/markets/${market._id}`,
        });
      }
    }

    // 4. Emit Socket.IO cancellation event
    const io = req.app.get('io');
    if (io) {
      io.emit('market_cancelled', {
        marketId: market._id,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Market cancelled successfully. All participant investments have been refunded.',
      data: market,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's active open position in a single market
 * @route   GET /api/v1/markets/:id/position
 * @access  Private
 */
export const getUserPositionInMarket = async (req, res, next) => {
  try {
    const positions = await Position.find({
      userId: req.user._id,
      marketId: req.params.id,
      status: 'Open',
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: positions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle follow/watch a prediction market
 * @route   POST /api/v1/markets/:id/follow
 * @access  Private
 */
export const toggleFollowMarket = async (req, res, next) => {
  try {
    const marketId = req.params.id;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const market = await Market.findById(marketId);
    if (!market) {
      return res.status(404).json({ success: false, message: 'Market not found.' });
    }

    const isFollowing = user.followedMarkets.some(id => id.toString() === marketId.toString());

    if (isFollowing) {
      user.followedMarkets = user.followedMarkets.filter(id => id.toString() !== marketId.toString());
    } else {
      user.followedMarkets.push(marketId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: isFollowing ? 'Market unfollowed.' : 'Market followed. You will be notified of updates.',
      data: { isFollowing: !isFollowing },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve a pending market (Admin Only) — sets status to Live and notifies submitter & category followers
 * @route   POST /api/v1/markets/:id/approve
 * @access  Private/Admin
 */
export const approveMarket = async (req, res, next) => {
  try {
    const market = await Market.findById(req.params.id);
    if (!market) {
      return res.status(404).json({ success: false, message: 'Market not found.' });
    }
    if (market.status !== 'Pending Approval') {
      return res.status(400).json({ success: false, message: 'Only pending markets can be approved.' });
    }

    market.status = 'Live';
    await market.save();

    // Notify market submitter
    if (market.createdBy) {
      await createAndSendNotification({
        userId: market.createdBy,
        title: 'Market Approved',
        message: `Your submitted market "${market.title}" has been approved and is now live!`,
        type: 'Admin Announcement',
        redirectUrl: `/markets/${market._id}`,
      });
    }

    // Notify users following this category
    const categoryFollowers = await User.find({
      followedCategories: market.category,
      _id: { $ne: market.createdBy },
    }).select('_id');

    for (const follower of categoryFollowers) {
      await createAndSendNotification({
        userId: follower._id,
        title: 'New Market in Your Category',
        message: `A new prediction market is live in ${market.category}: "${market.title}"`,
        type: 'New Market',
        redirectUrl: `/markets/${market._id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Market approved and published successfully.',
      data: market,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reject a pending market (Admin Only) — sets status to Archived and notifies submitter
 * @route   POST /api/v1/markets/:id/reject
 * @access  Private/Admin
 */
export const rejectMarket = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const market = await Market.findById(req.params.id);
    if (!market) {
      return res.status(404).json({ success: false, message: 'Market not found.' });
    }
    if (market.status !== 'Pending Approval') {
      return res.status(400).json({ success: false, message: 'Only pending markets can be rejected.' });
    }

    market.status = 'Archived';
    await market.save();

    // Notify market submitter
    if (market.createdBy) {
      await createAndSendNotification({
        userId: market.createdBy,
        title: 'Market Submission Rejected',
        message: `Your submitted market "${market.title}" was not approved.${reason ? ` Reason: ${reason}` : ''}`,
        type: 'Admin Announcement',
        redirectUrl: `/markets`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Market rejected and archived.',
      data: market,
    });
  } catch (error) {
    next(error);
  }
};
