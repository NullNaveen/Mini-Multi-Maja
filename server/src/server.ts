import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { CONFIG } from './config';
import { GameServer } from './network/GameServer';

const app = express();
const httpServer = createServer(app);

// Configure CORS
app.use(cors({
  origin: CONFIG.CLIENT_URL,
  credentials: true,
}));

app.use(express.json());
app.use(express.static('public'));

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: CONFIG.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingInterval: 10000,
  pingTimeout: 5000,
});

// Initialize game server
const gameServer = new GameServer(io);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// API endpoints
app.get('/api/status', (req, res) => {
  res.json({
    players: io.engine.clientsCount,
    uptime: process.uptime(),
  });
});

// Start server
httpServer.listen(CONFIG.PORT, () => {
  console.log('=================================');
  console.log('🎮 MMM Game Server Started');
  console.log('=================================');
  console.log(`Environment: ${CONFIG.NODE_ENV}`);
  console.log(`Port: ${CONFIG.PORT}`);
  console.log(`Client URL: ${CONFIG.CLIENT_URL}`);
  console.log(`Tick Rate: ${CONFIG.TICK_RATE} Hz`);
  console.log('=================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  gameServer.stop();
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  gameServer.stop();
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
