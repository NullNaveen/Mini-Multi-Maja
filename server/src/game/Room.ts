import { Player } from './Player';
import { Bullet } from './Bullet';
import { GameState, PlayerInput, ShootEvent, HitEvent, DeathEvent } from 'mmm-shared';
import { PLAYER_CONFIG } from 'mmm-shared';
import { CONFIG } from '../config';

export class Room {
  public id: string;
  public name: string;
  public players: Map<string, Player>;
  public bullets: Map<string, Bullet>;
  public maxPlayers: number;
  public lastUpdateTime: number;

  constructor(id: string, name: string, maxPlayers: number = CONFIG.MAX_PLAYERS_PER_ROOM) {
    this.id = id;
    this.name = name;
    this.players = new Map();
    this.bullets = new Map();
    this.maxPlayers = maxPlayers;
    this.lastUpdateTime = Date.now();
  }

  public addPlayer(id: string, name: string): Player {
    const spawnPoint = this.getRandomSpawnPoint();
    const player = new Player(id, name, spawnPoint);
    this.players.set(id, player);
    return player;
  }

  public removePlayer(id: string): void {
    this.players.delete(id);
  }

  public getPlayer(id: string): Player | undefined {
    return this.players.get(id);
  }

  public isFull(): boolean {
    return this.players.size >= this.maxPlayers;
  }

  public update(): void {
    const now = Date.now();
    const deltaTime = now - this.lastUpdateTime;
    this.lastUpdateTime = now;

    // Update players
    this.players.forEach((player) => {
      player.update(deltaTime);
    });

    // Update bullets
    this.bullets.forEach((bullet) => {
      bullet.update(deltaTime);

      // Check collisions with players
      this.players.forEach((player) => {
        if (player.id === bullet.ownerId || player.isDead || !bullet.isActive) {
          return;
        }

        const dx = bullet.x - player.x;
        const dy = bullet.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Simple collision detection
        if (distance < PLAYER_CONFIG.SIZE.WIDTH / 2) {
          bullet.isActive = false;
          player.takeDamage(bullet.damage);

          // Award kill to shooter if player died
          const shooter = this.players.get(bullet.ownerId);
          if (player.isDead && shooter) {
            shooter.kills++;
          }
        }
      });
    });

    // Remove inactive bullets
    this.bullets.forEach((bullet, id) => {
      if (!bullet.isActive) {
        this.bullets.delete(id);
      }
    });
  }

  public handlePlayerInput(playerId: string, input: PlayerInput): void {
    const player = this.players.get(playerId);
    if (!player || player.isDead) return;

    // Update player velocity based on input
    let moveX = 0;
    let moveY = 0;

    if (input.moveLeft) moveX -= 1;
    if (input.moveRight) moveX += 1;
    if (input.moveUp) moveY -= 1;
    if (input.moveDown) moveY += 1;

    // Normalize diagonal movement
    if (moveX !== 0 && moveY !== 0) {
      moveX *= 0.707;
      moveY *= 0.707;
    }

    player.velocityX = moveX * PLAYER_CONFIG.SPEED;
    player.velocityY = moveY * PLAYER_CONFIG.SPEED;
    player.rotation = input.aimAngle;

    // Handle jump
    if (input.jump && Math.abs(player.velocityY) < 10) {
      player.velocityY = PLAYER_CONFIG.JUMP_VELOCITY;
    }

    // Handle shooting
    if (input.shoot) {
      const bullets = player.shoot(input.aimAngle, input.timestamp);
      if (bullets) {
        bullets.forEach((bulletData) => {
          const bullet = new Bullet(bulletData);
          this.bullets.set(bullet.id, bullet);
        });
      }
    }

    // Handle reload
    if (input.reload) {
      player.startReload();
    }
  }

  public handleShoot(event: ShootEvent): void {
    const player = this.players.get(event.playerId);
    if (!player) return;

    const bullets = player.shoot(event.angle, event.timestamp);
    if (bullets) {
      bullets.forEach((bulletData) => {
        const bullet = new Bullet(bulletData);
        this.bullets.set(bullet.id, bullet);
      });
    }
  }

  public respawnPlayer(playerId: string): void {
    const player = this.players.get(playerId);
    if (!player) return;

    const spawnPoint = this.getRandomSpawnPoint();
    player.respawn(spawnPoint);
  }

  public getGameState(): GameState {
    const playersData: Record<string, any> = {};
    this.players.forEach((player, id) => {
      playersData[id] = player.getData();
    });

    const bulletsData = Array.from(this.bullets.values()).map((bullet) => bullet.getData());

    return {
      players: playersData,
      bullets: bulletsData,
      timestamp: Date.now(),
    };
  }

  private getRandomSpawnPoint(): { x: number; y: number } {
    const spawnPoints = CONFIG.SPAWN_POINTS;
    return spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
  }
}
