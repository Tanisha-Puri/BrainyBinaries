import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import podRoutes from './routes/podRoutes.js';
import { setupSockets } from './sockets/socketHandler.js';
import { initializeProfileEmbeddings } from '../utils/matcher.js';

const app = express();
const server = http.createServer(app);
// Add CORS to socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for testing
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/pods', podRoutes);

setupSockets(io);

const PORT = process.env.PORT || 3001;

initializeProfileEmbeddings()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize profile embeddings:', error);
    process.exit(1);
  });