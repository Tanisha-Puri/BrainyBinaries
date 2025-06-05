const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const roadmapRoutes = require('./routes/roadmapRoutes');
const { setupSockets } = require('./sockets/socketHandler');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/roadmap', roadmapRoutes);

setupSockets(io);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});