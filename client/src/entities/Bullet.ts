import Phaser from 'phaser';
import { BulletData } from 'mmm-shared';

export class Bullet {
  private sprite: Phaser.GameObjects.Sprite;
  private scene: Phaser.Scene;
  private data: BulletData;

  constructor(scene: Phaser.Scene, bulletData: BulletData) {
    this.scene = scene;
    this.data = bulletData;

    // Create bullet sprite
    this.sprite = scene.add.sprite(bulletData.x, bulletData.y, 'bullet');
    this.sprite.setRotation(bulletData.rotation);
    this.sprite.setDepth(5);
    this.sprite.setScale(0.8);

    // Add trail effect
    this.createTrail();
  }

  private createTrail(): void {
    const particles = this.scene.add.particles(this.data.x, this.data.y, 'bullet', {
      follow: this.sprite,
      speed: 0,
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.5, end: 0 },
      lifespan: 200,
      frequency: 50,
    });

    // Cleanup particles when bullet is destroyed
    this.sprite.once('destroy', () => {
      particles.destroy();
    });
  }

  public update(bulletData: BulletData): void {
    this.data = bulletData;
  }

  public updatePosition(): void {
    // Update position based on server data
    this.sprite.setPosition(this.data.x, this.data.y);
    this.sprite.setRotation(this.data.rotation);
  }

  public destroy(): void {
    if (this.sprite && this.sprite.active) {
      // Create impact effect
      const impact = this.scene.add.sprite(this.sprite.x, this.sprite.y, 'muzzleFlash');
      impact.setScale(0.5);
      impact.setAlpha(0.6);

      this.scene.tweens.add({
        targets: impact,
        alpha: 0,
        scale: 0,
        duration: 150,
        onComplete: () => impact.destroy(),
      });

      this.sprite.destroy();
    }
  }
}
