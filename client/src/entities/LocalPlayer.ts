import Phaser from 'phaser';
import { PlayerData, PlayerInput, WeaponType } from 'mmm-shared';
import { PLAYER_CONFIG, WEAPON_STATS } from 'mmm-shared';

export class LocalPlayer {
  public sprite: Phaser.Physics.Arcade.Sprite;
  private scene: Phaser.Scene;
  private nameText: Phaser.GameObjects.Text;
  private healthBar: Phaser.GameObjects.Graphics;
  private weapon: WeaponType = WeaponType.PISTOL;
  private ammo: number = 12;
  private isReloading: boolean = false;
  private lastShootTime: number = 0;
  private isDead: boolean = false;
  private health: number = 100;
  private maxHealth: number = 100;

  constructor(scene: Phaser.Scene, playerData: PlayerData) {
    this.scene = scene;
    this.weapon = playerData.currentWeapon;
    this.ammo = playerData.ammo;
    this.health = playerData.health;
    this.maxHealth = playerData.maxHealth;
    this.isDead = playerData.isDead;

    // Create sprite
    this.sprite = scene.physics.add.sprite(playerData.x, playerData.y, 'player');
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setGravityY(300);
    this.sprite.setDepth(10);

    // Name tag
    this.nameText = scene.add.text(0, 0, playerData.name, {
      fontSize: '14px',
      color: '#00ff00',
      backgroundColor: '#000000',
      padding: { x: 4, y: 2 },
    });
    this.nameText.setOrigin(0.5);
    this.nameText.setDepth(11);

    // Health bar
    this.healthBar = scene.add.graphics();
    this.healthBar.setDepth(11);
  }

  public update(input: PlayerInput): void {
    if (this.isDead || !this.sprite.active) return;

    // Movement
    const speed = PLAYER_CONFIG.SPEED;
    let velocityX = 0;

    if (input.moveLeft) velocityX -= speed;
    if (input.moveRight) velocityX += speed;

    this.sprite.setVelocityX(velocityX);

    // Jumping
    if (input.jump && this.sprite.body && Math.abs(this.sprite.body.velocity.y) < 10) {
      this.sprite.setVelocityY(PLAYER_CONFIG.JUMP_VELOCITY);
    }

    // Rotation (aim)
    this.sprite.setRotation(input.aimAngle);

    // Shooting
    if (input.shoot && !this.isReloading) {
      this.shoot(input.aimAngle);
    }

    // Update UI elements
    this.updateUI();
  }

  public updateFromServer(playerData: PlayerData): void {
    // Server reconciliation (simple version)
    this.health = playerData.health;
    this.maxHealth = playerData.maxHealth;
    this.weapon = playerData.currentWeapon;
    this.ammo = playerData.ammo;
    this.isReloading = playerData.isReloading;
    this.isDead = playerData.isDead;

    if (this.isDead && this.sprite.active) {
      this.die();
    }
  }

  private shoot(angle: number): void {
    const weapon = WEAPON_STATS[this.weapon];
    const now = Date.now();

    if (now - this.lastShootTime < weapon.fireRate || this.ammo <= 0) {
      return;
    }

    this.lastShootTime = now;
    this.ammo--;

    // Visual feedback
    this.createMuzzleFlash(angle);

    // Play sound
    this.playShootSound();
  }

  private createMuzzleFlash(angle: number): void {
    const distance = 30;
    const x = this.sprite.x + Math.cos(angle) * distance;
    const y = this.sprite.y + Math.sin(angle) * distance;

    const flash = this.scene.add.sprite(x, y, 'muzzleFlash');
    flash.setRotation(angle);
    flash.setAlpha(0.8);
    flash.setDepth(9);

    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 100,
      onComplete: () => flash.destroy(),
    });
  }

  private playShootSound(): void {
    // Web Audio API simple sound (placeholder)
    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 300;
      oscillator.type = 'square';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      // Silent fail if audio context not available
    }
  }

  public startReload(): void {
    this.isReloading = true;
  }

  public switchWeapon(weapon: WeaponType): void {
    this.weapon = weapon;
    this.ammo = WEAPON_STATS[weapon].magazineSize;
    this.isReloading = false;
  }

  public die(): void {
    this.isDead = true;
    this.sprite.setAlpha(0.3);
    this.sprite.setTint(0xff0000);
    
    // Death effect
    this.createBloodEffect();
  }

  public respawn(x: number, y: number): void {
    this.sprite.setPosition(x, y);
    this.sprite.setVelocity(0, 0);
    this.sprite.setAlpha(1);
    this.sprite.clearTint();
    this.isDead = false;
    this.health = this.maxHealth;
    this.weapon = WeaponType.PISTOL;
    this.ammo = WEAPON_STATS[WeaponType.PISTOL].magazineSize;
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

  public getWeapon(): WeaponType {
    return this.weapon;
  }

  public getAmmo(): number {
    return this.ammo;
  }

  public isReloadingWeapon(): boolean {
    return this.isReloading;
  }

  public getHealth(): number {
    return this.health;
  }

  public getMaxHealth(): number {
    return this.maxHealth;
  }

  public destroy(): void {
    this.sprite.destroy();
    this.nameText.destroy();
    this.healthBar.destroy();
  }
}
