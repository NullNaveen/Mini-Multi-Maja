import Phaser from 'phaser';
import { NetworkManager } from '../network/NetworkManager';
import { PlayerData, GameState, PlayerInput, WeaponType } from 'mmm-shared';
import { GAME_CONFIG } from 'mmm-shared';
import { RemotePlayer } from '../entities/RemotePlayer';
import { LocalPlayer } from '../entities/LocalPlayer';
import { Bullet } from '../entities/Bullet';
import { GameUI } from '../ui/GameUI';

export class GameScene extends Phaser.Scene {
  private networkManager!: NetworkManager;
  private localPlayer!: LocalPlayer;
  private remotePlayers: Map<string, RemotePlayer> = new Map();
  private bullets: Map<string, Bullet> = new Map();
  private gameUI!: GameUI;
  
  // Input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private keys!: { [key: string]: Phaser.Input.Keyboard.Key };
  
  // Map
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  
  // State
  private playerId: string = '';
  private inputSequence: number = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: any): void {
    this.playerId = data.roomData.playerId;
    console.log('Game initialized with player ID:', this.playerId);
  }

  create(): void {
    // Setup physics
    this.physics.world.setBounds(0, 0, GAME_CONFIG.MAP_WIDTH, GAME_CONFIG.MAP_HEIGHT);
    this.physics.world.setFPS(60);

    // Background
    this.cameras.main.setBackgroundColor('#87CEEB');

    // Create map
    this.createMap();

    // Setup input
    this.setupInput();

    // Initialize network manager
    this.networkManager = NetworkManager.getInstance();
    this.setupNetworkCallbacks();

    // Create UI
    this.gameUI = new GameUI(this);

    // Setup camera
    this.cameras.main.setBounds(0, 0, GAME_CONFIG.MAP_WIDTH, GAME_CONFIG.MAP_HEIGHT);
    this.cameras.main.setZoom(1);
  }

  private createMap(): void {
    // Create platforms group
    this.platforms = this.physics.add.staticGroup();

    // Ground
    const groundY = GAME_CONFIG.MAP_HEIGHT - 50;
    for (let x = 0; x < GAME_CONFIG.MAP_WIDTH; x += 64) {
      const ground = this.platforms.create(x + 32, groundY, 'ground');
      ground.setScale(1, 1.5);
      ground.refreshBody();
    }

    // Platforms
    this.createPlatform(400, 600, 200);
    this.createPlatform(800, 500, 200);
    this.createPlatform(1200, 600, 200);
    this.createPlatform(1600, 500, 200);
    this.createPlatform(2000, 600, 200);
    
    this.createPlatform(600, 800, 150);
    this.createPlatform(1000, 700, 150);
    this.createPlatform(1400, 800, 150);
    this.createPlatform(1800, 700, 150);

    // Mid-level platforms
    this.createPlatform(400, 300, 150);
    this.createPlatform(1200, 300, 150);
    this.createPlatform(2000, 300, 150);
  }

  private createPlatform(x: number, y: number, width: number): void {
    const platformWidth = 64;
    const count = Math.ceil(width / platformWidth);
    
    for (let i = 0; i < count; i++) {
      const platform = this.platforms.create(x + i * platformWidth, y, 'platform');
      platform.setDisplaySize(platformWidth, 16);
      platform.refreshBody();
    }
  }

  private setupInput(): void {
    // Keyboard
    this.cursors = this.input.keyboard!.createCursorKeys();
    
    const keyboard = this.input.keyboard!;
    this.wasd = {
      W: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    this.keys = {
      R: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R),
      SPACE: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      ONE: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
      TWO: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
      THREE: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
      FOUR: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR),
    };

    // Mouse input
    this.input.setDefaultCursor('none');
  }

  private setupNetworkCallbacks(): void {
    // Game state updates
    this.networkManager.onGameState = (state: GameState) => {
      this.handleGameState(state);
    };

    // Player joined
    this.networkManager.onPlayerJoined = (playerData: PlayerData) => {
      this.addRemotePlayer(playerData);
    };

    // Player left
    this.networkManager.onPlayerLeft = (playerId: string) => {
      this.removeRemotePlayer(playerId);
    };

    // Player respawned
    this.networkManager.onPlayerRespawn = (data: any) => {
      if (data.playerId === this.playerId && this.localPlayer) {
        this.localPlayer.respawn(data.x, data.y);
      } else {
        const remotePlayer = this.remotePlayers.get(data.playerId);
        if (remotePlayer) {
          remotePlayer.respawn(data.x, data.y);
        }
      }
    };
  }

  private handleGameState(state: GameState): void {
    // Update or create players
    Object.entries(state.players).forEach(([id, playerData]) => {
      if (id === this.playerId) {
        // Update or create local player
        if (!this.localPlayer) {
          this.createLocalPlayer(playerData);
        } else {
          this.localPlayer.updateFromServer(playerData);
        }
      } else {
        // Update or create remote players
        const remotePlayer = this.remotePlayers.get(id);
        if (remotePlayer) {
          remotePlayer.updateFromServer(playerData);
        } else {
          this.addRemotePlayer(playerData);
        }
      }
    });

    // Remove disconnected players
    this.remotePlayers.forEach((player, id) => {
      if (!state.players[id]) {
        this.removeRemotePlayer(id);
      }
    });

    // Update bullets
    this.updateBullets(state.bullets);
  }

  private createLocalPlayer(playerData: PlayerData): void {
    this.localPlayer = new LocalPlayer(this, playerData);
    
    // Add collision with platforms
    this.physics.add.collider(this.localPlayer.sprite, this.platforms);
    
    // Camera follows player
    this.cameras.main.startFollow(this.localPlayer.sprite, true, 0.1, 0.1);
  }

  private addRemotePlayer(playerData: PlayerData): void {
    if (this.remotePlayers.has(playerData.id)) return;
    
    const remotePlayer = new RemotePlayer(this, playerData);
    this.remotePlayers.set(playerData.id, remotePlayer);
    
    // Add collision with platforms
    this.physics.add.collider(remotePlayer.sprite, this.platforms);
  }

  private removeRemotePlayer(playerId: string): void {
    const player = this.remotePlayers.get(playerId);
    if (player) {
      player.destroy();
      this.remotePlayers.delete(playerId);
    }
  }

  private updateBullets(bulletsData: any[]): void {
    const activeBulletIds = new Set(bulletsData.map(b => b.id));

    // Remove bullets that no longer exist
    this.bullets.forEach((bullet, id) => {
      if (!activeBulletIds.has(id)) {
        bullet.destroy();
        this.bullets.delete(id);
      }
    });

    // Update or create bullets
    bulletsData.forEach((bulletData) => {
      const bullet = this.bullets.get(bulletData.id);
      if (bullet) {
        bullet.update(bulletData);
      } else {
        const newBullet = new Bullet(this, bulletData);
        this.bullets.set(bulletData.id, newBullet);
      }
    });
  }

  update(_time: number, _delta: number): void {
    if (!this.localPlayer || !this.localPlayer.sprite.active) return;

    // Collect input
    const input = this.collectInput();

    // Update local player with input
    this.localPlayer.update(input);

    // Send input to server
    this.networkManager.sendPlayerInput(input);

    // Update remote players
    this.remotePlayers.forEach((_player) => {
      _player.update();
    });

    // Update UI
    if (this.gameUI && this.localPlayer) {
      this.gameUI.update(this.localPlayer, this.remotePlayers);
    }

    // Update bullets
    this.bullets.forEach((bullet) => {
      bullet.updatePosition();
    });

    // Handle weapon switching
    this.handleWeaponSwitch();

    // Handle reload
    if (Phaser.Input.Keyboard.JustDown(this.keys.R)) {
      this.networkManager.sendReload();
      this.localPlayer.startReload();
    }
  }

  private collectInput(): PlayerInput {
    const pointer = this.input.activePointer;
    
    // Calculate aim angle
    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    const angle = Phaser.Math.Angle.Between(
      this.localPlayer.sprite.x,
      this.localPlayer.sprite.y,
      worldPoint.x,
      worldPoint.y
    );

    return {
      moveLeft: this.wasd.A.isDown || this.cursors.left!.isDown,
      moveRight: this.wasd.D.isDown || this.cursors.right!.isDown,
      moveUp: this.wasd.W.isDown || this.cursors.up!.isDown,
      moveDown: this.wasd.S.isDown || this.cursors.down!.isDown,
      jump: this.keys.SPACE.isDown,
      shoot: pointer.isDown,
      reload: this.keys.R.isDown,
      aimAngle: angle,
      timestamp: Date.now(),
      sequenceNumber: this.inputSequence++,
    };
  }

  private handleWeaponSwitch(): void {
    if (Phaser.Input.Keyboard.JustDown(this.keys.ONE)) {
      this.switchWeapon(WeaponType.PISTOL);
    } else if (Phaser.Input.Keyboard.JustDown(this.keys.TWO)) {
      this.switchWeapon(WeaponType.RIFLE);
    } else if (Phaser.Input.Keyboard.JustDown(this.keys.THREE)) {
      this.switchWeapon(WeaponType.SHOTGUN);
    } else if (Phaser.Input.Keyboard.JustDown(this.keys.FOUR)) {
      this.switchWeapon(WeaponType.SNIPER);
    }
  }

  private switchWeapon(weapon: WeaponType): void {
    this.networkManager.sendWeaponSwitch(weapon);
    this.localPlayer.switchWeapon(weapon);
  }

  shutdown(): void {
    this.networkManager.disconnect();
  }
}
