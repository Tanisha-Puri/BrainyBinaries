import { io } from 'socket.io-client';

const socket = io('ws://localhost:3001');

socket.on('connect', () => {
  console.log('Connected to server:', socket.id);
  socket.emit('join', 'Tanisha Puri');
});

socket.on('podAssigned', (pod) => {
  console.log('Received podAssigned:', pod);
});

socket.on('error', (error) => {
  console.log('Socket error:', error);
});

socket.on('connect_error', (error) => {
  console.log('Connection error:', error);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});