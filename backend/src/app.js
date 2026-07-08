import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables immediately before other imports
dotenv.config();

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import homepageRoutes from './routes/homepage.routes.js';
import marketRoutes from './routes/market.routes.js';
import newsRoutes from './routes/news.routes.js';
import communityRoutes from './routes/community.routes.js';

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// HTTP request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});
app.use('/api/', apiLimiter);

// Mount API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/markets', marketRoutes);
app.use('/api/v1/news', newsRoutes);
app.use('/api/v1/community', communityRoutes);
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

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || [],
  });
});

export default app;
