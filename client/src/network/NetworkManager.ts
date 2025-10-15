import io from 'socket.io-client';
import {
  NETWORK_EVENTS,
  GameState,
  PlayerInput,
  ShootEvent,
  PlayerData,
  JoinRoomRequest,
  WeaponType,
} from 'mmm-shared';
import { CONFIG } from '../config';

export class NetworkManager {
  private static instance: NetworkManager;
  private socket: ReturnType<typeof io> | null = null;
  private connected: boolean = false;
  private ping: number = 0;
  private lastPingTime: number = 0;

  // Callbacks
  public onConnect: (() => void) | null = null;
  public onDisconnect: (() => void) | null = null;
  public onRoomJoined: ((data: any) => void) | null = null;
  public onGameState: ((state: GameState) => void) | null = null;
  public onPlayerJoined: ((player: PlayerData) => void) | null = null;
  public onPlayerLeft: ((playerId: string) => void) | null = null;
  public onBulletFired: ((event: ShootEvent) => void) | null = null;
  public onPlayerRespawn: ((data: any) => void) | null = null;

  private constructor() {}

  public static getInstance(): NetworkManager {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(CONFIG.SERVER_URL, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 5,
        });

        this.socket.on('connect', () => {
          console.log('Connected to server');
          this.connected = true;
          if (this.onConnect) this.onConnect();
          this.startPingMonitor();
          resolve();
        });

  this.socket.on('connect_error', (error: Error) => {
          console.error('Connection error:', error);
          reject(error);
        });

        this.socket.on('disconnect', () => {
          console.log('Disconnected from server');
          this.connected = false;
          if (this.onDisconnect) this.onDisconnect();
        });

        this.setupEventHandlers();
      } catch (error) {
        reject(error);
      }
    });
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Room events
  this.socket.on(NETWORK_EVENTS.ROOM_JOINED, (data: any) => {
      console.log('Room joined:', data);
      if (this.onRoomJoined) this.onRoomJoined(data);
    });

    // Game state updates
    this.socket.on(NETWORK_EVENTS.GAME_STATE, (state: GameState) => {
      if (this.onGameState) this.onGameState(state);
    });

    // Player events
    this.socket.on(NETWORK_EVENTS.PLAYER_JOINED, (data: { player: PlayerData }) => {
      if (this.onPlayerJoined) this.onPlayerJoined(data.player);
    });

    this.socket.on(NETWORK_EVENTS.PLAYER_LEFT, (data: { playerId: string }) => {
      if (this.onPlayerLeft) this.onPlayerLeft(data.playerId);
    });

    // Shooting events
    this.socket.on(NETWORK_EVENTS.BULLET_FIRED, (event: ShootEvent) => {
      if (this.onBulletFired) this.onBulletFired(event);
    });

    // Respawn events
  this.socket.on(NETWORK_EVENTS.PLAYER_RESPAWN, (data: any) => {
      if (this.onPlayerRespawn) this.onPlayerRespawn(data);
    });

    // Ping/Pong
    this.socket.on(NETWORK_EVENTS.PONG, (data: { clientTime: number; serverTime: number }) => {
      this.ping = Date.now() - data.clientTime;
    });
  }

  public joinRoom(roomId: string | undefined, playerName: string): void {
    if (!this.socket) return;

    const request: JoinRoomRequest = {
      roomId,
      playerName,
    };

    this.socket.emit(NETWORK_EVENTS.JOIN_ROOM, request);
  }

  public leaveRoom(): void {
    if (!this.socket) return;
    this.socket.emit(NETWORK_EVENTS.LEAVE_ROOM);
  }

  public sendPlayerInput(input: PlayerInput): void {
    if (!this.socket || !this.connected) return;
    this.socket.emit(NETWORK_EVENTS.PLAYER_INPUT, input);
  }

  public sendShoot(event: ShootEvent): void {
    if (!this.socket || !this.connected) return;
    this.socket.emit(NETWORK_EVENTS.PLAYER_SHOOT, event);
  }

  public sendReload(): void {
    if (!this.socket || !this.connected) return;
    this.socket.emit(NETWORK_EVENTS.PLAYER_RELOAD, {
      playerId: this.socket.id,
      timestamp: Date.now(),
    });
  }

  public sendWeaponSwitch(weapon: WeaponType): void {
    if (!this.socket || !this.connected) return;
    this.socket.emit(NETWORK_EVENTS.PLAYER_SWITCH_WEAPON, {
      playerId: this.socket.id,
      weapon,
    });
  }

  public requestRoomList(): void {
    if (!this.socket) return;
    this.socket.emit(NETWORK_EVENTS.REQUEST_ROOM_LIST);
  }

  private startPingMonitor(): void {
    setInterval(() => {
      if (this.socket && this.connected) {
        this.lastPingTime = Date.now();
        this.socket.emit(NETWORK_EVENTS.PING, { clientTime: this.lastPingTime });
      }
    }, CONFIG.PING_INTERVAL);
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  public isConnected(): boolean {
    return this.connected && this.socket !== null;
  }

  public getPing(): number {
    return this.ping;
  }

  public getSocketId(): string | undefined {
    return this.socket?.id;
  }
}
