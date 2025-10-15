import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { GAME_CONFIG } from 'mmm-shared';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_CONFIG.WIDTH,
  height: GAME_CONFIG.HEIGHT,
  parent: 'game-container',
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: GAME_CONFIG.GRAVITY, x: 0 },
      debug: false,
    },
  },
  scene: [BootScene, MenuScene, GameScene],
  audio: {
    disableWebAudio: false,
  },
};

// Create game instance
const game = new Phaser.Game(config);

// Prevent context menu on right click
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// Handle window resize
window.addEventListener('resize', () => {
  game.scale.refresh();
});

// Export for debugging
(window as any).game = game;

console.log('MMM - Multiplayer Shooting Game');
console.log('Version 1.0.0');
console.log('Loading game...');
