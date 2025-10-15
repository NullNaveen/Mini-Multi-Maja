export const CONFIG = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  
  // Game Settings
  TICK_RATE: 60,
  MAX_PLAYERS_PER_ROOM: 10,
  
  // Physics
  GRAVITY: 800,
  MAX_VELOCITY: 1000,
  
  // Map
  MAP_WIDTH: 2560,
  MAP_HEIGHT: 1440,
  
  // Spawn Points
  SPAWN_POINTS: [
    { x: 400, y: 500 },
    { x: 800, y: 500 },
    { x: 1200, y: 500 },
    { x: 1600, y: 500 },
    { x: 2000, y: 500 },
    { x: 400, y: 900 },
    { x: 800, y: 900 },
    { x: 1200, y: 900 },
    { x: 1600, y: 900 },
    { x: 2000, y: 900 },
  ],
};
