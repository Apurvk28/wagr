import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js';
import Market from '../models/market.model.js';
import User from '../models/user.model.js';

/**
 * @desc    Create a new community post
 * @route   POST /api/v1/community/posts
 * @access  Private
 */
export const createPost = async (req, res, next) => {
  try {
    const { content, linkedMarket } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Post content cannot be empty.',
      });
    }

    // AI/Auto-moderation keyword validation
    const blacklist = ['spam_post', 'scam_deal', 'abuse_text', 'inappropriate_terms'];
    const hasFlagged = blacklist.some(term => content.toLowerCase().includes(term));
    if (hasFlagged) {
      return res.status(400).json({
        success: false,
        message: 'Your post was flagged by automated AI moderation for inappropriate content.',
      });
    }

    // Verify linked market if provided
    if (linkedMarket) {
      const marketExists = await Market.findById(linkedMarket);
      if (!marketExists) {
        return res.status(404).json({
          success: false,
          message: 'Linked prediction market not found.',
        });
      }
    }

    const post = await Post.create({
      userId: req.user._id,
      content: content.trim(),
      linkedMarket: linkedMarket || null,
    });

    const populatedPost = await Post.findById(post._id)
      .populate('userId', 'fullName username')
      .populate('linkedMarket', 'title status');

    res.status(201).json({
      success: true,
      message: 'Post published successfully.',
      data: populatedPost,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all community posts with filters
 * @route   GET /api/v1/community/posts
 * @access  Public
 */
export const getPosts = async (req, res, next) => {
  try {
    const { marketId, username, feed, sortBy } = req.query;
    const query = {};

    // 1. Filter by linked market
    if (marketId) {
      query.linkedMarket = marketId;
    }

    // 2. Filter by author username
    if (username) {
      const author = await User.findOne({ username: username.toLowerCase() });
      if (author) {
        query.userId = author._id;
      } else {
        // Return empty list if user doesn't exist
        return res.status(200).json({ success: true, data: [] });
      }
    }

    // 3. Filter by follow network feed (logged-in only)
    if (feed === 'following' && req.user) {
      query.userId = { $in: req.user.following };
    }

    let posts = await Post.find(query)
      .populate('userId', 'fullName username followers following')
      .populate('linkedMarket', 'title yesProbability noProbability status')
      .lean();

    // 4. Client-side sort by recency or popular engagement (likes length + comments count)
    posts = posts.map(post => ({
      ...post,
      likesCount: post.likes ? post.likes.length : 0,
    }));

    if (sortBy === 'popular') {
      posts.sort((a, b) => {
        const scoreA = a.likesCount + (a.commentsCount || 0) * 2;
        const scoreB = b.likesCount + (b.commentsCount || 0) * 2;
        return scoreB - scoreA;
      });
    } else {
      // Default: Newest first
      posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle post like status
 * @route   POST /api/v1/community/posts/:id/like
 * @access  Private
 */
export const toggleLikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.',
      });
    }

    const hasLiked = post.likes.includes(req.user._id);
    if (hasLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: hasLiked ? 'Post unliked.' : 'Post liked.',
      data: {
        likesCount: post.likes.length,
        hasLiked: !hasLiked,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a comment or reply on a post
 * @route   POST /api/v1/community/posts/:postId/comments
 * @access  Private
 */
export const createComment = async (req, res, next) => {
  try {
    const { content, parentId } = req.body;
    const { postId } = req.params;

    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Comment content cannot be empty.',
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Parent post not found.',
      });
    }

    // Verify parent comment if it is a nested reply
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: 'Parent comment thread not found.',
        });
      }
    }

    const comment = await Comment.create({
      postId,
      userId: req.user._id,
      content: content.trim(),
      parentId: parentId || null,
    });

    // Increment commentsCount in post
    post.commentsCount += 1;
    await post.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'fullName username');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully.',
      data: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all comments for a post
 * @route   GET /api/v1/community/posts/:postId/comments
 * @access  Public
 */
export const getPostComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.',
      });
    }

    const comments = await Comment.find({ postId })
      .populate('userId', 'fullName username')
      .sort({ createdAt: 1 }); // Oldest first (chronological conversation)

    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};
