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
  const { fullName, username, email, password, accessKey } = req.body;

  try {
    // 0. Access Key Check
    if (!process.env.SPECIAL_ACCESS_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Server misconfiguration. Please contact support.',
      });
    }
    if (!accessKey || accessKey.trim() !== process.env.SPECIAL_ACCESS_KEY) {
      return res.status(403).json({
        success: false,
        message: 'Invalid access key.',
      });
    }

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
    const role = 'User';
    const initialBalance = 500;

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

    // 6. Generate JWT immediately & Set httpOnly cookie
    const jwtToken = user.generateJWT();

    res.cookie('wagr_jwt', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

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
 * @desc    Authenticate user login
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  const { email, password, accessKey } = req.body;

  try {
    // 0. Access Key Check
    if (!process.env.SPECIAL_ACCESS_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Server misconfiguration. Please contact support.',
      });
    }
    if (!accessKey || accessKey.trim() !== process.env.SPECIAL_ACCESS_KEY) {
      return res.status(403).json({
        success: false,
        message: 'Invalid access key.',
      });
    }

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

    // 4. Generate JWT token & Set httpOnly cookie
    const jwtToken = user.generateJWT();

    res.cookie('wagr_jwt', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

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
