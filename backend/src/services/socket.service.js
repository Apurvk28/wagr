import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';

let ioInstance = null;

export const initSocket = (io) => {
  ioInstance = io;

  // Socket.IO authentication middleware via httpOnly cookie
  io.use((socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      if (cookieHeader) {
        const cookies = cookie.parse(cookieHeader);
        if (cookies.wagr_jwt) {
          const decoded = jwt.verify(cookies.wagr_jwt, process.env.JWT_SECRET);
          socket.data.userId = decoded.id;
        }
      }
    } catch (err) {
      // Continue connection as guest if cookie is missing or invalid
    }
    next();
  });

  io.on('connection', (socket) => {
    console.log(`User connected to socket: ${socket.id}`);

    // Automatically join user's private notification room if authenticated
    if (socket.data.userId) {
      socket.join(socket.data.userId.toString());
      console.log(`Socket ${socket.id} automatically joined room: ${socket.data.userId}`);
    }

    socket.on('join_user', (userId) => {
      // Only allow joining own user room if authenticated AND userId matches socket.data.userId
      if (socket.data.userId && userId && userId.toString() === socket.data.userId.toString()) {
        socket.join(socket.data.userId.toString());
      } else {
        console.warn(`[Socket Security Alert] Unauthorized room join attempt by socket ${socket.id} (user: ${socket.data.userId || 'Guest'}) for target room: ${userId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected from socket: ${socket.id}`);
    });
  });
};

export const getIo = () => {
  return ioInstance;
};
