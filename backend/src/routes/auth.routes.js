import express from 'express';
import {
  register,
  login,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieSecure = process.env.COOKIE_SECURE !== undefined
    ? process.env.COOKIE_SECURE === 'true'
    : isProduction;
  const cookieSameSite = process.env.COOKIE_SAME_SITE || (cookieSecure ? 'none' : 'lax');

  res.clearCookie('wagr_jwt', {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: cookieSameSite,
  });
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
});

export default router;
