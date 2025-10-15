import { PlayerData, BulletData, WeaponType } from 'mmm-shared';
import { PLAYER_CONFIG, WEAPON_STATS } from 'mmm-shared';
import { CONFIG } from '../config';

export class Player {
  public id: string;
  public name: string;
  public x: number;
  public y: number;
  public velocityX: number = 0;
  public velocityY: number = 0;
  public rotation: number = 0;
  public health: number;
  public maxHealth: number;
  public currentWeapon: WeaponType;
  public ammo: number;
  public isReloading: boolean = false;
  public isDead: boolean = false;
  public kills: number = 0;
  public deaths: number = 0;
  public lastShootTime: number = 0;
  public reloadStartTime: number = 0;
  public team?: string;

  constructor(id: string, name: string, spawnPoint: { x: number; y: number }) {
    this.id = id;
    this.name = name;
    this.x = spawnPoint.x;
    this.y = spawnPoint.y;
    this.health = PLAYER_CONFIG.MAX_HEALTH;
    this.maxHealth = PLAYER_CONFIG.MAX_HEALTH;
    this.currentWeapon = WeaponType.PISTOL;
    this.ammo = WEAPON_STATS[WeaponType.PISTOL].magazineSize;
  }

  public update(deltaTime: number): void {
    // Apply gravity
    this.velocityY += (CONFIG.GRAVITY * deltaTime) / 1000;

    // Apply velocity
    this.x += (this.velocityX * deltaTime) / 1000;
    this.y += (this.velocityY * deltaTime) / 1000;

    // Clamp velocity
    this.velocityX = Math.max(-CONFIG.MAX_VELOCITY, Math.min(CONFIG.MAX_VELOCITY, this.velocityX));
    this.velocityY = Math.max(-CONFIG.MAX_VELOCITY, Math.min(CONFIG.MAX_VELOCITY, this.velocityY));

    // Map boundaries
    this.x = Math.max(0, Math.min(CONFIG.MAP_WIDTH, this.x));
    this.y = Math.max(0, Math.min(CONFIG.MAP_HEIGHT, this.y));

    // Ground collision (simplified)
    if (this.y >= CONFIG.MAP_HEIGHT - 100) {
      this.y = CONFIG.MAP_HEIGHT - 100;
      this.velocityY = 0;
    }

    // Check reload completion
    if (this.isReloading) {
      const reloadTime = WEAPON_STATS[this.currentWeapon].reloadTime;
      if (Date.now() - this.reloadStartTime >= reloadTime) {
        this.completeReload();
      }
    }
  }

  public shoot(angle: number, timestamp: number): BulletData[] | null {
    if (this.isDead || this.isReloading || this.ammo <= 0) {
      return null;
    }

    const weapon = WEAPON_STATS[this.currentWeapon];
    const now = Date.now();

    // Check fire rate
    if (now - this.lastShootTime < weapon.fireRate) {
      return null;
    }

    this.lastShootTime = now;
    this.ammo--;

    // Create bullets
    const bullets: BulletData[] = [];
    for (let i = 0; i < weapon.bulletsPerShot; i++) {
      const spread = (Math.random() - 0.5) * weapon.bulletSpread * (Math.PI / 180);
      const bulletAngle = angle + spread;

      bullets.push({
        id: `${this.id}_${timestamp}_${i}`,
        x: this.x,
        y: this.y,
        velocityX: Math.cos(bulletAngle) * weapon.bulletSpeed,
        velocityY: Math.sin(bulletAngle) * weapon.bulletSpeed,
        rotation: bulletAngle,
        ownerId: this.id,
        damage: weapon.damage,
        range: weapon.range,
        distanceTraveled: 0,
      });
    }

    // Auto reload if empty
    if (this.ammo === 0) {
      this.startReload();
    }

    return bullets;
  }

  public startReload(): void {
    if (this.isReloading || this.isDead) return;

    const weapon = WEAPON_STATS[this.currentWeapon];
    if (this.ammo >= weapon.magazineSize) return;

    this.isReloading = true;
    this.reloadStartTime = Date.now();
  }

  public completeReload(): void {
    this.isReloading = false;
    this.ammo = WEAPON_STATS[this.currentWeapon].magazineSize;
  }

  public switchWeapon(weapon: WeaponType): void {
    if (this.isDead || this.isReloading) return;

    this.currentWeapon = weapon;
    this.ammo = WEAPON_STATS[weapon].magazineSize;
  }

  public takeDamage(damage: number): boolean {
    if (this.isDead) return false;

    this.health -= damage;
    if (this.health <= 0) {
      this.health = 0;
      this.isDead = true;
      this.deaths++;
      return true; // Player died
    }
    return false; // Player survived
  }

  public respawn(spawnPoint: { x: number; y: number }): void {
    this.x = spawnPoint.x;
    this.y = spawnPoint.y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.health = this.maxHealth;
    this.isDead = false;
    this.currentWeapon = WeaponType.PISTOL;
    this.ammo = WEAPON_STATS[WeaponType.PISTOL].magazineSize;
    this.isReloading = false;
  }

  public getData(): PlayerData {
    return {
      id: this.id,
      name: this.name,
      x: this.x,
      y: this.y,
      velocityX: this.velocityX,
      velocityY: this.velocityY,
      rotation: this.rotation,
      health: this.health,
      maxHealth: this.maxHealth,
      currentWeapon: this.currentWeapon,
      ammo: this.ammo,
      isReloading: this.isReloading,
      isDead: this.isDead,
      kills: this.kills,
      deaths: this.deaths,
      team: this.team,
    };
  }
}
