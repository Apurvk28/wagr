import express from 'express';
import { globalSearch } from '../controllers/search.controller.js';

const router = express.Router();

// Public route — no auth required
router.get('/', globalSearch);

export default router;
