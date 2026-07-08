import express from 'express';
import {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Optional logout endpoint for clean REST session termination
router.post('/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
});

export default router;
