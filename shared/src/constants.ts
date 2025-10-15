// Game Configuration Constants
export const GAME_CONFIG = {
  // Canvas
  WIDTH: 1280,
  HEIGHT: 720,
  
  // Physics
  GRAVITY: 800,
  FRICTION: 0.9,
  
  // Server
  TICK_RATE: 60, // Server updates per second
  INTERPOLATION_OFFSET: 100, // ms
  
  // Game Rules
  MAX_PLAYERS_PER_ROOM: 10,
  RESPAWN_TIME: 3000, // ms
  MATCH_TIME: 600, // seconds (10 minutes)
  KILLS_TO_WIN: 25,
  
  // Map
  MAP_WIDTH: 2560,
  MAP_HEIGHT: 1440,
  
  // Camera
  CAMERA_LERP: 0.1,
  CAMERA_DEADZONE: 0.2,
};

// Player Constants
export const PLAYER_CONFIG = {
  MAX_HEALTH: 100,
  SPEED: 200,
  SPRINT_MULTIPLIER: 1.5,
  JUMP_VELOCITY: -400,
  SIZE: {
    WIDTH: 32,
    HEIGHT: 48,
  },
  COLLISION: {
    WIDTH: 28,
    HEIGHT: 44,
  },
  NAME_TAG_OFFSET_Y: -30,
};

// Weapon Stats
export enum WeaponType {
  PISTOL = 'PISTOL',
  RIFLE = 'RIFLE',
  SHOTGUN = 'SHOTGUN',
  SNIPER = 'SNIPER',
}

export interface WeaponStats {
  name: string;
  damage: number;
  fireRate: number; // ms between shots
  magazineSize: number;
  reloadTime: number; // ms
  bulletSpeed: number;
  bulletSpread: number; // degrees
  bulletsPerShot: number;
  range: number;
  automatic: boolean;
}

export const WEAPON_STATS: Record<WeaponType, WeaponStats> = {
  [WeaponType.PISTOL]: {
    name: 'Pistol',
    damage: 15,
    fireRate: 300,
    magazineSize: 12,
    reloadTime: 1200,
    bulletSpeed: 800,
    bulletSpread: 3,
    bulletsPerShot: 1,
    range: 600,
    automatic: false,
  },
  [WeaponType.RIFLE]: {
    name: 'Assault Rifle',
    damage: 20,
    fireRate: 120,
    magazineSize: 30,
    reloadTime: 2000,
    bulletSpeed: 1000,
    bulletSpread: 5,
    bulletsPerShot: 1,
    range: 800,
    automatic: true,
  },
  [WeaponType.SHOTGUN]: {
    name: 'Shotgun',
    damage: 12,
    fireRate: 800,
    magazineSize: 6,
    reloadTime: 2500,
    bulletSpeed: 600,
    bulletSpread: 15,
    bulletsPerShot: 8,
    range: 300,
    automatic: false,
  },
  [WeaponType.SNIPER]: {
    name: 'Sniper Rifle',
    damage: 75,
    fireRate: 1200,
    magazineSize: 5,
    reloadTime: 3000,
    bulletSpeed: 1500,
    bulletSpread: 0.5,
    bulletsPerShot: 1,
    range: 1200,
    automatic: false,
  },
};

// Network Events
export const NETWORK_EVENTS = {
  // Connection
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  
  // Room Management
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'leaveRoom',
  ROOM_JOINED: 'roomJoined',
  ROOM_LEFT: 'roomLeft',
  ROOM_LIST: 'roomList',
  REQUEST_ROOM_LIST: 'requestRoomList',
  
  // Game State
  GAME_STATE: 'gameState',
  PLAYER_JOINED: 'playerJoined',
  PLAYER_LEFT: 'playerLeft',
  
  // Player Actions
  PLAYER_INPUT: 'playerInput',
  PLAYER_MOVE: 'playerMove',
  PLAYER_SHOOT: 'playerShoot',
  PLAYER_RELOAD: 'playerReload',
  PLAYER_SWITCH_WEAPON: 'playerSwitchWeapon',
  
  // Game Events
  PLAYER_HIT: 'playerHit',
  PLAYER_DIED: 'playerDied',
  PLAYER_RESPAWN: 'playerRespawn',
  BULLET_FIRED: 'bulletFired',
  
  // Sync
  SYNC_PLAYERS: 'syncPlayers',
  PING: 'ping',
  PONG: 'pong',
};

// Colors
export const COLORS = {
  PRIMARY: 0x00ff00,
  SECONDARY: 0xff0000,
  HEALTH_BAR: 0x00ff00,
  HEALTH_BAR_BG: 0xff0000,
  FRIENDLY: 0x00ff00,
  ENEMY: 0xff0000,
  NEUTRAL: 0xffff00,
  UI_BG: 0x000000,
  UI_TEXT: 0xffffff,
};

// UI Constants
export const UI_CONFIG = {
  HEALTH_BAR_WIDTH: 100,
  HEALTH_BAR_HEIGHT: 10,
  MINIMAP_SIZE: 200,
  MINIMAP_SCALE: 0.1,
  KILL_FEED_MAX: 5,
  KILL_FEED_DURATION: 5000,
};

// Asset Keys
export const ASSET_KEYS = {
  // Sprites
  PLAYER: 'player',
  BULLET: 'bullet',
  GROUND: 'ground',
  PLATFORM: 'platform',
  
  // Weapons
  PISTOL_SPRITE: 'pistol',
  RIFLE_SPRITE: 'rifle',
  SHOTGUN_SPRITE: 'shotgun',
  SNIPER_SPRITE: 'sniper',
  
  // Effects
  MUZZLE_FLASH: 'muzzleFlash',
  EXPLOSION: 'explosion',
  BLOOD: 'blood',
  
  // UI
  CROSSHAIR: 'crosshair',
  HEALTH_BAR: 'healthBar',
  
  // Audio
  SHOOT_PISTOL: 'shootPistol',
  SHOOT_RIFLE: 'shootRifle',
  SHOOT_SHOTGUN: 'shootShotgun',
  SHOOT_SNIPER: 'shootSniper',
  RELOAD: 'reload',
  HIT: 'hit',
  DEATH: 'death',
  BGM: 'backgroundMusic',
};
