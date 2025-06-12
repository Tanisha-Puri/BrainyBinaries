export const setupSockets = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('join', (userId) => {
      console.log(`User ${userId} joined room`);
      socket.join(userId);
    });
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
    // Add error logging
    socket.on('error', (error) => {
      console.log('Socket error:', error);
    });
  });
  // Log WebSocket server errors
  io.on('error', (error) => {
    console.log('WebSocket server error:', error);
  });
};