import Phaser from 'phaser';
import { PlayerData } from 'mmm-shared';
import { PLAYER_CONFIG } from 'mmm-shared';

export class RemotePlayer {
  public sprite: Phaser.Physics.Arcade.Sprite;
  private scene: Phaser.Scene;
  private nameText: Phaser.GameObjects.Text;
  private healthBar: Phaser.GameObjects.Graphics;
  private targetX: number = 0;
  private targetY: number = 0;
  private targetRotation: number = 0;
  private isDead: boolean = false;
  private health: number = 100;
  private maxHealth: number = 100;

  constructor(scene: Phaser.Scene, playerData: PlayerData) {
    this.scene = scene;
    this.health = playerData.health;
    this.maxHealth = playerData.maxHealth;
    this.isDead = playerData.isDead;

    // Create sprite
    this.sprite = scene.physics.add.sprite(playerData.x, playerData.y, 'player');
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setGravityY(300);
    this.sprite.setTint(0xff6666); // Different color for remote players
    this.sprite.setDepth(10);

    // Name tag
    this.nameText = scene.add.text(0, 0, playerData.name, {
      fontSize: '14px',
      color: '#ff6666',
      backgroundColor: '#000000',
      padding: { x: 4, y: 2 },
    });
    this.nameText.setOrigin(0.5);
    this.nameText.setDepth(11);

    // Health bar
    this.healthBar = scene.add.graphics();
    this.healthBar.setDepth(11);

    this.targetX = playerData.x;
    this.targetY = playerData.y;
    this.targetRotation = playerData.rotation;

    if (this.isDead) {
      this.sprite.setAlpha(0.3);
    }
  }

  public updateFromServer(playerData: PlayerData): void {
    this.targetX = playerData.x;
    this.targetY = playerData.y;
    this.targetRotation = playerData.rotation;
    this.health = playerData.health;
    this.maxHealth = playerData.maxHealth;
    
    // Update velocity for smoother interpolation
    if (this.sprite.body) {
      this.sprite.setVelocity(playerData.velocityX, playerData.velocityY);
    }

    // Handle death state
    if (playerData.isDead && !this.isDead) {
      this.die();
    } else if (!playerData.isDead && this.isDead) {
      this.respawn(playerData.x, playerData.y);
    }
  }

  public update(): void {
    if (!this.sprite.active) return;

    // Interpolate position
    const lerpFactor = 0.2;
    const currentX = this.sprite.x;
    const currentY = this.sprite.y;
    const currentRotation = this.sprite.rotation;

    this.sprite.x = Phaser.Math.Linear(currentX, this.targetX, lerpFactor);
    this.sprite.y = Phaser.Math.Linear(currentY, this.targetY, lerpFactor);
    this.sprite.rotation = Phaser.Math.Angle.RotateTo(currentRotation, this.targetRotation, 0.1);

    // Update UI
    this.updateUI();
  }

  private die(): void {
    this.isDead = true;
    this.sprite.setAlpha(0.3);
    this.createBloodEffect();
  }

  public respawn(x: number, y: number): void {
    this.sprite.setPosition(x, y);
    this.sprite.setAlpha(1);
    this.isDead = false;
    this.health = this.maxHealth;
  }

  private createBloodEffect(): void {
    const particles = this.scene.add.particles(this.sprite.x, this.sprite.y, 'blood', {
      speed: { min: 50, max: 150 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 500,
      quantity: 20,
    });

    this.scene.time.delayedCall(500, () => {
      particles.destroy();
    });
  }

  private updateUI(): void {
    // Position name tag
    this.nameText.setPosition(this.sprite.x, this.sprite.y + PLAYER_CONFIG.NAME_TAG_OFFSET_Y);

    // Draw health bar
    this.healthBar.clear();
    
    const barWidth = 50;
    const barHeight = 5;
    const barX = this.sprite.x - barWidth / 2;
    const barY = this.sprite.y + PLAYER_CONFIG.NAME_TAG_OFFSET_Y - 15;

    // Background
    this.healthBar.fillStyle(0x000000, 0.5);
    this.healthBar.fillRect(barX, barY, barWidth, barHeight);

    // Health
    const healthPercent = this.health / this.maxHealth;
    const healthWidth = barWidth * healthPercent;
    
    const healthColor = healthPercent > 0.5 ? 0x00ff00 : healthPercent > 0.25 ? 0xffff00 : 0xff0000;
    this.healthBar.fillStyle(healthColor);
    this.healthBar.fillRect(barX, barY, healthWidth, barHeight);
  }

  public destroy(): void {
    this.sprite.destroy();
    this.nameText.destroy();
    this.healthBar.destroy();
  }
}
