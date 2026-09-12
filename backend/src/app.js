import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Load environment variables immediately before other imports
dotenv.config();

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import homepageRoutes from './routes/homepage.routes.js';
import marketRoutes from './routes/market.routes.js';
import newsRoutes from './routes/news.routes.js';
import communityRoutes from './routes/community.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import adminRoutes from './routes/admin.routes.js';
import searchRoutes from './routes/search.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import { csrfProtection } from './middleware/csrf.middleware.js';

const app = express();

// Trust reverse proxy (1 hop for Render) so express-rate-limit receives real client IP
app.set('trust proxy', 1);

// Security HTTP headers
app.use(helmet());

// CORS configuration with whitelist protection
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/$/, ''))
  : ['http://localhost:3003', 'http://localhost:5173'];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Origin not allowed by CLIENT_URL whitelist'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Wagr-CSRF'],
};
app.use(cors(corsOptions));

// HTTP request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsers & Cookie parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CSRF Defense Middleware for state-changing requests
app.use(csrfProtection);

// Global rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // High throughput limit to prevent 429 rate-limiting on client data fetches
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

// Stricter rate limiter scoped specifically to authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 login/register attempts per IP per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

app.use('/api/', apiLimiter);

// Mount API Routes
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/markets', marketRoutes);
app.use('/api/v1/news', newsRoutes);
app.use('/api/v1/community', communityRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);
app.use('/api/v1', homepageRoutes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Wagr API is running smoothly.',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

// Centralized error handling middleware (sanitized for production)
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err.stack || err.message);

  const isProd = process.env.NODE_ENV === 'production';
  const statusCode = err.status || err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: isProd && statusCode === 500 ? 'Internal Server Error' : (err.message || 'Internal Server Error'),
    ...(isProd ? {} : { errors: err.errors || [] }),
  });
});

export default app;
