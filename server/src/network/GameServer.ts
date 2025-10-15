import { Server, Socket } from 'socket.io';
import { Room } from '../game/Room';
import {
  NETWORK_EVENTS,
  JoinRoomRequest,
  RoomData,
  PlayerInput,
  ShootEvent,
  WeaponSwitchEvent,
  ReloadEvent,
  WeaponType,
} from 'mmm-shared';
import { CONFIG } from '../config';

export class GameServer {
  private io: Server;
  private rooms: Map<string, Room>;
  private playerRooms: Map<string, string>; // playerId -> roomId
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(io: Server) {
    this.io = io;
    this.rooms = new Map();
    this.playerRooms = new Map();

    // Create default room
    this.createRoom('default', 'Main Room');

    this.setupEventHandlers();
    this.startGameLoop();
  }

  private setupEventHandlers(): void {
    this.io.on(NETWORK_EVENTS.CONNECTION, (socket: Socket) => {
      console.log(`Player connected: ${socket.id}`);

      // Handle join room
      socket.on(NETWORK_EVENTS.JOIN_ROOM, (data: JoinRoomRequest) => {
        this.handleJoinRoom(socket, data);
      });

      // Handle leave room
      socket.on(NETWORK_EVENTS.LEAVE_ROOM, () => {
        this.handleLeaveRoom(socket);
      });

      // Handle player input
      socket.on(NETWORK_EVENTS.PLAYER_INPUT, (input: PlayerInput) => {
        this.handlePlayerInput(socket.id, input);
      });

      // Handle shoot
      socket.on(NETWORK_EVENTS.PLAYER_SHOOT, (event: ShootEvent) => {
        this.handlePlayerShoot(socket.id, event);
      });

      // Handle reload
      socket.on(NETWORK_EVENTS.PLAYER_RELOAD, (event: ReloadEvent) => {
        this.handlePlayerReload(socket.id);
      });

      // Handle weapon switch
      socket.on(NETWORK_EVENTS.PLAYER_SWITCH_WEAPON, (event: WeaponSwitchEvent) => {
        this.handleWeaponSwitch(socket.id, event.weapon);
      });

      // Handle disconnect
      socket.on(NETWORK_EVENTS.DISCONNECT, () => {
        this.handleDisconnect(socket);
      });

      // Handle ping
      socket.on(NETWORK_EVENTS.PING, (data: { clientTime: number }) => {
        socket.emit(NETWORK_EVENTS.PONG, {
          clientTime: data.clientTime,
          serverTime: Date.now(),
        });
      });

      // Handle room list request
      socket.on(NETWORK_EVENTS.REQUEST_ROOM_LIST, () => {
        this.sendRoomList(socket);
      });
    });
  }

  private handleJoinRoom(socket: Socket, data: JoinRoomRequest): void {
    const roomId = data.roomId || 'default';
    let room = this.rooms.get(roomId);

    if (!room) {
      room = this.createRoom(roomId, `Room ${roomId}`);
    }

    if (room.isFull()) {
      socket.emit(NETWORK_EVENTS.ROOM_LEFT, { error: 'Room is full' });
      return;
    }

    // Add player to room
    const player = room.addPlayer(socket.id, data.playerName);
    this.playerRooms.set(socket.id, roomId);

    // Join socket room
    socket.join(roomId);

    // Notify player
    socket.emit(NETWORK_EVENTS.ROOM_JOINED, {
      roomId,
      playerId: socket.id,
      gameState: room.getGameState(),
    });

    // Notify other players
    socket.to(roomId).emit(NETWORK_EVENTS.PLAYER_JOINED, {
      player: player.getData(),
    });

    console.log(`Player ${data.playerName} (${socket.id}) joined room ${roomId}`);
  }

  private handleLeaveRoom(socket: Socket): void {
    const roomId = this.playerRooms.get(socket.id);
    if (!roomId) return;

    const room = this.rooms.get(roomId);
    if (room) {
      room.removePlayer(socket.id);

      // Notify other players
      socket.to(roomId).emit(NETWORK_EVENTS.PLAYER_LEFT, {
        playerId: socket.id,
      });

      // Delete empty rooms (except default)
      if (room.players.size === 0 && roomId !== 'default') {
        this.rooms.delete(roomId);
      }
    }

    socket.leave(roomId);
    this.playerRooms.delete(socket.id);

    socket.emit(NETWORK_EVENTS.ROOM_LEFT, { roomId });
  }

  private handlePlayerInput(playerId: string, input: PlayerInput): void {
    const roomId = this.playerRooms.get(playerId);
    if (!roomId) return;

    const room = this.rooms.get(roomId);
    if (!room) return;

    room.handlePlayerInput(playerId, input);
  }

  private handlePlayerShoot(playerId: string, event: ShootEvent): void {
    const roomId = this.playerRooms.get(playerId);
    if (!roomId) return;

    const room = this.rooms.get(roomId);
    if (!room) return;

    room.handleShoot(event);

    // Broadcast shoot event to other players
    this.io.to(roomId).emit(NETWORK_EVENTS.BULLET_FIRED, event);
  }

  private handlePlayerReload(playerId: string): void {
    const roomId = this.playerRooms.get(playerId);
    if (!roomId) return;

    const room = this.rooms.get(roomId);
    if (!room) return;

    const player = room.getPlayer(playerId);
    if (player) {
      player.startReload();
    }
  }

  private handleWeaponSwitch(playerId: string, weapon: WeaponType): void {
    const roomId = this.playerRooms.get(playerId);
    if (!roomId) return;

    const room = this.rooms.get(roomId);
    if (!room) return;

    const player = room.getPlayer(playerId);
    if (player) {
      player.switchWeapon(weapon);
    }
  }

  private handleDisconnect(socket: Socket): void {
    console.log(`Player disconnected: ${socket.id}`);
    this.handleLeaveRoom(socket);
  }

  private createRoom(id: string, name: string): Room {
    const room = new Room(id, name);
    this.rooms.set(id, room);
    return room;
  }

  private sendRoomList(socket: Socket): void {
    const roomList: RoomData[] = [];
    this.rooms.forEach((room) => {
      roomList.push({
        id: room.id,
        name: room.name,
        playerCount: room.players.size,
        maxPlayers: room.maxPlayers,
        mapName: 'Default Map',
        gameMode: 'Free For All',
      });
    });
    socket.emit(NETWORK_EVENTS.ROOM_LIST, roomList);
  }

  private startGameLoop(): void {
    const tickRate = 1000 / CONFIG.TICK_RATE;

    this.updateInterval = setInterval(() => {
      this.rooms.forEach((room, roomId) => {
        // Update game state
        room.update();

        // Broadcast game state to all players in room
        const gameState = room.getGameState();
        this.io.to(roomId).emit(NETWORK_EVENTS.GAME_STATE, gameState);

        // Check for deaths and handle respawns
        room.players.forEach((player) => {
          if (player.isDead) {
            // Schedule respawn after delay
            setTimeout(() => {
              room.respawnPlayer(player.id);
              this.io.to(roomId).emit(NETWORK_EVENTS.PLAYER_RESPAWN, {
                playerId: player.id,
                x: player.x,
                y: player.y,
                timestamp: Date.now(),
              });
            }, 3000);
          }
        });
      });
    }, tickRate);
  }

  public stop(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}
