// TypeScript Interfaces and Types for Client-Server Communication

import { WeaponType } from './constants';

// Player Data
export interface PlayerData {
  id: string;
  name: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  rotation: number;
  health: number;
  maxHealth: number;
  currentWeapon: WeaponType;
  ammo: number;
  isReloading: boolean;
  isDead: boolean;
  kills: number;
  deaths: number;
  team?: string;
}

// Game State
export interface GameState {
  players: Record<string, PlayerData>;
  bullets: BulletData[];
  timestamp: number;
}

// Bullet Data
export interface BulletData {
  id: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  rotation: number;
  ownerId: string;
  damage: number;
  range: number;
  distanceTraveled: number;
}

// Player Input
export interface PlayerInput {
  moveLeft: boolean;
  moveRight: boolean;
  moveUp: boolean;
  moveDown: boolean;
  jump: boolean;
  shoot: boolean;
  reload: boolean;
  aimAngle: number;
  timestamp: number;
  sequenceNumber: number;
}

// Room Data
export interface RoomData {
  id: string;
  name: string;
  playerCount: number;
  maxPlayers: number;
  mapName: string;
  gameMode: string;
}

// Join Room Request
export interface JoinRoomRequest {
  roomId?: string;
  playerName: string;
}

// Shoot Event
export interface ShootEvent {
  playerId: string;
  x: number;
  y: number;
  angle: number;
  weapon: WeaponType;
  timestamp: number;
}

// Hit Event
export interface HitEvent {
  shooterId: string;
  victimId: string;
  damage: number;
  weapon: WeaponType;
  isFatal: boolean;
}

// Death Event
export interface DeathEvent {
  victimId: string;
  killerId?: string;
  weapon?: WeaponType;
  timestamp: number;
}

// Respawn Event
export interface RespawnEvent {
  playerId: string;
  x: number;
  y: number;
  timestamp: number;
}

// Scoreboard Entry
export interface ScoreboardEntry {
  id: string;
  name: string;
  kills: number;
  deaths: number;
  kd: number;
}

// Server Config
export interface ServerConfig {
  tickRate: number;
  maxPlayersPerRoom: number;
  mapWidth: number;
  mapHeight: number;
}

// Client Config
export interface ClientConfig {
  serverUrl: string;
  playerName: string;
  interpolationDelay: number;
}

// Ping Data
export interface PingData {
  clientTime: number;
}

// Pong Data
export interface PongData {
  clientTime: number;
  serverTime: number;
}

// Weapon Switch Event
export interface WeaponSwitchEvent {
  playerId: string;
  weapon: WeaponType;
}

// Reload Event
export interface ReloadEvent {
  playerId: string;
  weapon: WeaponType;
  timestamp: number;
}
