import express from 'express';
import { getLeaderboard } from '../controllers/leaderboard.controller.js';

const router = express.Router();

// Public leaderboard access
router.get('/', getLeaderboard);

export default router;
