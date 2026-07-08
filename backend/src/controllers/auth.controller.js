import crypto from 'crypto';
import User from '../models/user.model.js';

// Password Validation Regex
// Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  const { fullName, username, email, password } = req.body;

  try {
    // 1. Inputs validation
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all registration fields.',
      });
    }

    // 2. Password strength check
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
      });
    }

    // 3. Username uniqueness check
    const usernameLower = username.trim().toLowerCase();
    const usernameExists = await User.findOne({ username: usernameLower });
    if (usernameExists) {
      return res.status(400).json({
        success: false,
        message: 'Username is already taken.',
      });
    }

    // 4. Email uniqueness check
    const emailLower = email.trim().toLowerCase();
    const emailExists = await User.findOne({ email: emailLower });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered.',
      });
    }

    // 5. Create User (immediately verified and credited)
    const isApurv = emailLower === 'apurv@gmail.com';
    const role = isApurv ? 'Admin' : 'User';
    const initialBalance = isApurv ? 100000000 : 500;

    const user = await User.create({
      fullName,
      username: usernameLower,
      email: emailLower,
      password,
      role,
      isVerified: true,
      mxpBalance: initialBalance,
      portfolioValue: initialBalance,
    });

    // 6. Generate JWT immediately
    const jwtToken = user.generateJWT();

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to Wagr.io.',
      token: jwtToken,
      data: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        mxpBalance: user.mxpBalance,
        portfolioValue: user.portfolioValue,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify email address
 * @route   POST /api/v1/auth/verify-email
 * @access  Public
 */
export const verifyEmail = async (req, res, next) => {
  const { token } = req.body;

  try {
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Missing verification token.',
      });
    }

    // Find user with verification token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token.',
      });
    }

    // Update user properties
    user.isVerified = true;
    user.verificationToken = undefined;
    user.mxpBalance = 500; // Credit initial MXP wallet
    user.portfolioValue = 500; // Initial portfolio value

    await user.save();

    // Generate authenticated JWT
    const jwtToken = user.generateJWT();

    res.status(200).json({
      success: true,
      message: 'Email verification successful! 500 MXP has been credited to your wallet.',
      token: jwtToken,
      data: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        mxpBalance: user.mxpBalance,
        portfolioValue: user.portfolioValue,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user login
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    // 2. Find user (with password selected explicitly)
    const emailLower = email.trim().toLowerCase();
    const user = await User.findOne({ email: emailLower }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 3. Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }



    // 5. Generate JWT token
    const jwtToken = user.generateJWT();

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token: jwtToken,
      data: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        mxpBalance: user.mxpBalance,
        portfolioValue: user.portfolioValue,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Request forgot password token
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address.',
      });
    }

    const emailLower = email.trim().toLowerCase();
    const user = await User.findOne({ email: emailLower });

    if (!user) {
      // For security, do not expose if email exists or not. Simply return success.
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a password reset link has been sent.',
      });
    }

    // Generate reset password token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Save to user model
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    await user.save();

    // Mock send password reset email (Log to console)
    const resetLink = `${process.env.CLIENT_URL || 'http://localhost:3003'}/reset-password?token=${resetToken}`;
    console.log('\n==================================================');
    console.log('🔑 [MOCK EMAIL] Password Reset Link Sent');
    console.log(`To: ${user.email}`);
    console.log(`Link: ${resetLink}`);
    console.log('==================================================\n');

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password using token
 * @route   POST /api/v1/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;

  try {
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide token and new password.',
      });
    }

    // Password strength check
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
      });
    }

    // Find user with valid token and not expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token.',
      });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};
