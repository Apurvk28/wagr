let ioInstance = null;

export const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`User connected to socket: ${socket.id}`);

    // Join room for specific user so we can emit private notifications
    socket.on('join_user', (userId) => {
      if (userId) {
        socket.join(userId.toString());
        console.log(`Socket ${socket.id} joined room: ${userId}`);
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
