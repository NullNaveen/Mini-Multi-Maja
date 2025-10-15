import { BulletData } from 'mmm-shared';
import { CONFIG } from '../config';

export class Bullet {
  public id: string;
  public x: number;
  public y: number;
  public velocityX: number;
  public velocityY: number;
  public rotation: number;
  public ownerId: string;
  public damage: number;
  public range: number;
  public distanceTraveled: number;
  public isActive: boolean = true;

  constructor(data: BulletData) {
    this.id = data.id;
    this.x = data.x;
    this.y = data.y;
    this.velocityX = data.velocityX;
    this.velocityY = data.velocityY;
    this.rotation = data.rotation;
    this.ownerId = data.ownerId;
    this.damage = data.damage;
    this.range = data.range;
    this.distanceTraveled = data.distanceTraveled;
  }

  public update(deltaTime: number): void {
    const dx = (this.velocityX * deltaTime) / 1000;
    const dy = (this.velocityY * deltaTime) / 1000;

    this.x += dx;
    this.y += dy;

    const distance = Math.sqrt(dx * dx + dy * dy);
    this.distanceTraveled += distance;

    // Deactivate if out of range or out of bounds
    if (
      this.distanceTraveled >= this.range ||
      this.x < 0 ||
      this.x > CONFIG.MAP_WIDTH ||
      this.y < 0 ||
      this.y > CONFIG.MAP_HEIGHT
    ) {
      this.isActive = false;
    }
  }

  public getData(): BulletData {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      velocityX: this.velocityX,
      velocityY: this.velocityY,
      rotation: this.rotation,
      ownerId: this.ownerId,
      damage: this.damage,
      range: this.range,
      distanceTraveled: this.distanceTraveled,
    };
  }
}
