const setupSockets = (io) => {
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);
  
      socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
      });
  
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  };
  
  const emitRoadmapUpdate = (io, userId, roadmap) => {
    io.to(userId).emit('roadmapUpdate', roadmap);
  };
  
  module.exports = { setupSockets, emitRoadmapUpdate };