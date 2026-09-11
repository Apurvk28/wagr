import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import { initSocket } from './src/services/socket.service.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Integrate Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Initialize socket service room management
initSocket(io);

// Start node-cron background jobs
import { startCronJobs } from './src/services/cron.service.js';
startCronJobs();

// Set global Socket.io instance for routes/services usage
app.set('io', io);

// Production check for SPECIAL_ACCESS_KEY
if (process.env.NODE_ENV === 'production' && !process.env.SPECIAL_ACCESS_KEY) {
  console.error('❌ SPECIAL_ACCESS_KEY is required in production. Exiting.');
  process.exit(1);
}

// Start server
const PORT = process.env.PORT || 5000;

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use by another running backend process.`);
    console.error(`👉 To free the port, run: npx kill-port ${PORT}`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
