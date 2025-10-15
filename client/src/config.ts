export const CONFIG = {
  // Server
  SERVER_URL: import.meta.env.VITE_SERVER_URL || 'http://localhost:3000',
  
  // Game
  GAME_WIDTH: 1280,
  GAME_HEIGHT: 720,
  SCALE_MODE: 'FIT',
  
  // Player
  PLAYER_NAME: localStorage.getItem('playerName') || `Player_${Math.floor(Math.random() * 1000)}`,
  
  // Network
  INTERPOLATION_DELAY: 100, // ms
  PING_INTERVAL: 5000, // ms
  
  // Debug
  DEBUG: import.meta.env.DEV,
  SHOW_FPS: true,
};

export const savePlayerName = (name: string) => {
  localStorage.setItem('playerName', name);
};
