import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    console.log('BootScene: preload started');
    // Create loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px Arial',
        color: '#ffffff',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2,
      text: '0%',
      style: {
        font: '18px Arial',
        color: '#ffffff',
      },
    });
    percentText.setOrigin(0.5, 0.5);

    // Update loading bar
    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x00ff00, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
      percentText.setText(`${Math.floor(value * 100)}%`);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    // Load assets
    this.loadAssets();
  }

  private loadAssets(): void {
    // Simple colored rectangles as placeholders for sprites
    // These will be replaced with actual sprites later
    
    // Create placeholder textures
    this.createPlaceholderTextures();

    // Load audio (we'll use web audio API for simple sounds)
    // Actual sound files will be added later
  }

  private createPlaceholderTextures(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.setVisible(false);

    // Player texture (green rectangle)
    graphics.fillStyle(0x00ff00);
    graphics.fillRect(0, 0, 32, 48);
    graphics.generateTexture('player', 32, 48);
    graphics.clear();

    // Bullet texture (yellow circle)
    graphics.fillStyle(0xffff00);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('bullet', 8, 8);
    graphics.clear();

    // Ground texture (brown rectangle)
    graphics.fillStyle(0x8b4513);
    graphics.fillRect(0, 0, 64, 32);
    graphics.generateTexture('ground', 64, 32);
    graphics.clear();

    // Platform texture (gray rectangle)
    graphics.fillStyle(0x666666);
    graphics.fillRect(0, 0, 64, 16);
    graphics.generateTexture('platform', 64, 16);
    graphics.clear();

    // Crosshair (circle with cross)
    graphics.lineStyle(2, 0xff0000);
    graphics.strokeCircle(16, 16, 12);
    graphics.lineBetween(16, 4, 16, 28);
    graphics.lineBetween(4, 16, 28, 16);
    graphics.generateTexture('crosshair', 32, 32);
    graphics.clear();

    // Muzzle flash (orange circle)
    graphics.fillStyle(0xff6600, 0.8);
    graphics.fillCircle(8, 8, 8);
    graphics.generateTexture('muzzleFlash', 16, 16);
    graphics.clear();

    // Blood particle (red circle)
    graphics.fillStyle(0xff0000);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('blood', 8, 8);
    graphics.clear();

    // Weapon icons
    // Pistol (small rectangle)
    graphics.fillStyle(0x333333);
    graphics.fillRect(0, 0, 16, 8);
    graphics.generateTexture('pistol', 16, 8);
    graphics.clear();

    // Rifle (longer rectangle)
    graphics.fillStyle(0x333333);
    graphics.fillRect(0, 0, 24, 8);
    graphics.generateTexture('rifle', 24, 8);
    graphics.clear();

    // Shotgun (thick rectangle)
    graphics.fillStyle(0x333333);
    graphics.fillRect(0, 0, 20, 10);
    graphics.generateTexture('shotgun', 20, 10);
    graphics.clear();

    // Sniper (long thin rectangle)
    graphics.fillStyle(0x333333);
    graphics.fillRect(0, 0, 32, 6);
    graphics.generateTexture('sniper', 32, 6);
    graphics.clear();
  }

  create(): void {
    console.log('BootScene: create started');
    // Hide loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
      console.log('BootScene: loading screen hidden');
    }

    // Start menu scene
    console.log('BootScene: starting MenuScene');
    this.scene.start('MenuScene');
  }
}
