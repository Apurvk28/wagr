import express from 'express';
import {
  createPost,
  getPosts,
  toggleLikePost,
  createComment,
  getPostComments,
} from '../controllers/post.controller.js';
import { protect, optional } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/posts')
  .get(optional, getPosts)
  .post(protect, createPost);

router.post('/posts/:id/like', protect, toggleLikePost);

router.route('/posts/:postId/comments')
  .get(optional, getPostComments)
  .post(protect, createComment);

export default router;
