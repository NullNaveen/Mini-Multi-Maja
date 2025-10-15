import Phaser from 'phaser';
import { LocalPlayer } from '../entities/LocalPlayer';
import { RemotePlayer } from '../entities/RemotePlayer';
import { WEAPON_STATS } from 'mmm-shared';
import { NetworkManager } from '../network/NetworkManager';

export class GameUI {
  private scene: Phaser.Scene;
  private healthText!: Phaser.GameObjects.Text;
  private ammoText!: Phaser.GameObjects.Text;
  private weaponText!: Phaser.GameObjects.Text;
  private killFeedText!: Phaser.GameObjects.Text;
  private scoreboardContainer!: Phaser.GameObjects.Container;
  private scoreboardVisible: boolean = false;
  private crosshair!: Phaser.GameObjects.Sprite;
  private pingText!: Phaser.GameObjects.Text;
  private fpsText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createUI();
  }

  private createUI(): void {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // Health display (bottom left)
    this.healthText = this.scene.add.text(20, height - 80, 'Health: 100', {
      fontSize: '24px',
      color: '#00ff00',
      fontStyle: 'bold',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
    });
    this.healthText.setScrollFactor(0);
    this.healthText.setDepth(100);

    // Ammo display (bottom left, under health)
    this.ammoText = this.scene.add.text(20, height - 45, 'Ammo: 12/12', {
      fontSize: '20px',
      color: '#ffff00',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
    });
    this.ammoText.setScrollFactor(0);
    this.ammoText.setDepth(100);

    // Weapon display (bottom center)
    this.weaponText = this.scene.add.text(width / 2, height - 60, 'Pistol', {
      fontSize: '22px',
      color: '#ffffff',
      fontStyle: 'bold',
      backgroundColor: '#000000',
      padding: { x: 15, y: 8 },
    });
    this.weaponText.setOrigin(0.5);
    this.weaponText.setScrollFactor(0);
    this.weaponText.setDepth(100);

    // Kill feed (top right)
    this.killFeedText = this.scene.add.text(width - 20, 20, '', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 8, y: 4 },
      align: 'right',
    });
    this.killFeedText.setOrigin(1, 0);
    this.killFeedText.setScrollFactor(0);
    this.killFeedText.setDepth(100);

    // Crosshair (center)
    this.crosshair = this.scene.add.sprite(0, 0, 'crosshair');
    this.crosshair.setScrollFactor(0);
    this.crosshair.setDepth(99);
    this.crosshair.setScale(0.8);
    this.crosshair.setAlpha(0.7);

    // Ping display (top left)
    this.pingText = this.scene.add.text(20, 20, 'Ping: 0ms', {
      fontSize: '14px',
      color: '#00ff00',
      backgroundColor: '#000000',
      padding: { x: 6, y: 3 },
    });
    this.pingText.setScrollFactor(0);
    this.pingText.setDepth(100);

    // FPS display (top left, under ping)
    this.fpsText = this.scene.add.text(20, 45, 'FPS: 60', {
      fontSize: '14px',
      color: '#00ff00',
      backgroundColor: '#000000',
      padding: { x: 6, y: 3 },
    });
    this.fpsText.setScrollFactor(0);
    this.fpsText.setDepth(100);

    // Instructions
    const instructions = this.scene.add.text(width / 2, 20, 
      'Press TAB to show scoreboard | ESC to quit', {
      fontSize: '14px',
      color: '#aaaaaa',
      backgroundColor: '#000000',
      padding: { x: 6, y: 3 },
    });
    instructions.setOrigin(0.5, 0);
    instructions.setScrollFactor(0);
    instructions.setDepth(100);

    // Scoreboard container (hidden by default)
    this.scoreboardContainer = this.scene.add.container(width / 2, height / 2);
    this.scoreboardContainer.setScrollFactor(0);
    this.scoreboardContainer.setDepth(101);
    this.scoreboardContainer.setVisible(false);

    // TAB key to toggle scoreboard
    const tabKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
    tabKey?.on('down', () => {
      this.toggleScoreboard();
    });
  }

  public update(localPlayer: LocalPlayer, remotePlayers: Map<string, RemotePlayer>): void {
    // Update health
    const health = localPlayer.getHealth();
    const maxHealth = localPlayer.getMaxHealth();
    this.healthText.setText(`Health: ${health}/${maxHealth}`);
    
    const healthPercent = health / maxHealth;
    if (healthPercent > 0.5) {
      this.healthText.setColor('#00ff00');
    } else if (healthPercent > 0.25) {
      this.healthText.setColor('#ffff00');
    } else {
      this.healthText.setColor('#ff0000');
    }

    // Update ammo
    const ammo = localPlayer.getAmmo();
    const weapon = localPlayer.getWeapon();
    const maxAmmo = WEAPON_STATS[weapon].magazineSize;
    
    if (localPlayer.isReloadingWeapon()) {
      this.ammoText.setText('Reloading...');
      this.ammoText.setColor('#ff6600');
    } else {
      this.ammoText.setText(`Ammo: ${ammo}/${maxAmmo}`);
      this.ammoText.setColor(ammo > maxAmmo * 0.3 ? '#ffff00' : '#ff0000');
    }

    // Update weapon
    this.weaponText.setText(WEAPON_STATS[weapon].name);

    // Update crosshair position to follow mouse
    const pointer = this.scene.input.activePointer;
    this.crosshair.setPosition(pointer.x, pointer.y);

    // Update ping
    const networkManager = NetworkManager.getInstance();
    const ping = networkManager.getPing();
    this.pingText.setText(`Ping: ${ping}ms`);
    this.pingText.setColor(ping < 50 ? '#00ff00' : ping < 100 ? '#ffff00' : '#ff0000');

    // Update FPS
    const fps = Math.round(this.scene.game.loop.actualFps);
    this.fpsText.setText(`FPS: ${fps}`);
  }

  private toggleScoreboard(): void {
    this.scoreboardVisible = !this.scoreboardVisible;
    this.scoreboardContainer.setVisible(this.scoreboardVisible);

    if (this.scoreboardVisible) {
      this.updateScoreboard();
    }
  }

  private updateScoreboard(): void {
    // Clear existing scoreboard content
    this.scoreboardContainer.removeAll(true);

    // Create scoreboard background
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x000000, 0.8);
    bg.fillRoundedRect(-300, -200, 600, 400, 10);
    this.scoreboardContainer.add(bg);

    // Title
    const title = this.scene.add.text(0, -170, 'SCOREBOARD', {
      fontSize: '32px',
      color: '#00ff00',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);
    this.scoreboardContainer.add(title);

    // Headers
    const headers = this.scene.add.text(0, -130, 'Player                    Kills    Deaths    K/D', {
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    headers.setOrigin(0.5);
    this.scoreboardContainer.add(headers);

    // TODO: Populate with actual player data from game state
    // For now, show placeholder
    const placeholder = this.scene.add.text(0, -90, 'Scoreboard data will be populated from game state', {
      fontSize: '16px',
      color: '#aaaaaa',
    });
    placeholder.setOrigin(0.5);
    this.scoreboardContainer.add(placeholder);
  }

  public addKillFeed(killerName: string, victimName: string, weaponName: string): void {
    const message = `${killerName} [${weaponName}] ${victimName}`;
    this.killFeedText.setText(message);

    // Fade out after 5 seconds
    this.scene.time.delayedCall(5000, () => {
      this.killFeedText.setText('');
    });
  }
}
