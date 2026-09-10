import express from 'express';
import {
  register,
  login,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', (req, res) => {
  res.clearCookie('wagr_jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.COOKIE_SAME_SITE || 'lax',
  });
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
});

export default router;
