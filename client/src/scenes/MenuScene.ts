import Phaser from 'phaser';
import { NetworkManager } from '../network/NetworkManager';
import { CONFIG, savePlayerName } from '../config';

export class MenuScene extends Phaser.Scene {
  private networkManager!: NetworkManager;
  private nameInput: HTMLInputElement | null = null;
  private connectButton: HTMLButtonElement | null = null;
  private statusText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    console.log('MenuScene: create started');
    this.networkManager = NetworkManager.getInstance();

    // Background
    this.cameras.main.setBackgroundColor('#1e1e2e');

    // Title
    const title = this.add.text(
      this.cameras.main.centerX,
      100,
      'MMM',
      {
        fontSize: '72px',
        color: '#00ff00',
        fontStyle: 'bold',
      }
    );
    title.setOrigin(0.5);

    // Subtitle
    const subtitle = this.add.text(
      this.cameras.main.centerX,
      170,
      'Multiplayer Shooting Game',
      {
        fontSize: '24px',
        color: '#ffffff',
      }
    );
    subtitle.setOrigin(0.5);

    // Create HTML inputs
    this.createInputs();

    // Instructions
    const instructions = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 150,
      'Controls:\nWASD/Arrows - Move | Mouse - Aim | Left Click - Shoot\nR - Reload | 1-4 - Switch Weapon | Space - Jump',
      {
        fontSize: '16px',
        color: '#aaaaaa',
        align: 'center',
      }
    );
    instructions.setOrigin(0.5);

    // Status text
    this.statusText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 100,
      '',
      {
        fontSize: '18px',
        color: '#ffff00',
      }
    );
    this.statusText.setOrigin(0.5);

    // Network callbacks
    this.networkManager.onConnect = () => {
      this.statusText.setText('Connected! Joining game...');
      this.networkManager.joinRoom(undefined, CONFIG.PLAYER_NAME);
    };

    this.networkManager.onRoomJoined = (data) => {
      console.log('Starting game with data:', data);
      this.cleanupInputs();
      this.scene.start('GameScene', { roomData: data });
    };

    this.networkManager.onDisconnect = () => {
      this.statusText.setText('Disconnected from server. Please try again.');
      if (this.connectButton) {
        this.connectButton.disabled = false;
        this.connectButton.textContent = 'Connect';
      }
    };
  }

  private createInputs(): void {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Name input
    this.nameInput = document.createElement('input');
    this.nameInput.type = 'text';
    this.nameInput.placeholder = 'Enter your name';
    this.nameInput.value = CONFIG.PLAYER_NAME;
    this.nameInput.maxLength = 20;
    this.nameInput.style.position = 'absolute';
    this.nameInput.style.left = `${centerX - 150}px`;
    this.nameInput.style.top = `${centerY - 50}px`;
    this.nameInput.style.width = '300px';
    this.nameInput.style.height = '40px';
    this.nameInput.style.fontSize = '18px';
    this.nameInput.style.padding = '8px';
    this.nameInput.style.border = '2px solid #00ff00';
    this.nameInput.style.borderRadius = '5px';
    this.nameInput.style.backgroundColor = '#2e2e3e';
    this.nameInput.style.color = '#ffffff';
    this.nameInput.style.textAlign = 'center';
    document.body.appendChild(this.nameInput);

    // Connect button
    this.connectButton = document.createElement('button');
    this.connectButton.textContent = 'Connect & Play';
    this.connectButton.style.position = 'absolute';
    this.connectButton.style.left = `${centerX - 100}px`;
    this.connectButton.style.top = `${centerY + 10}px`;
    this.connectButton.style.width = '200px';
    this.connectButton.style.height = '50px';
    this.connectButton.style.fontSize = '20px';
    this.connectButton.style.fontWeight = 'bold';
    this.connectButton.style.backgroundColor = '#00ff00';
    this.connectButton.style.color = '#000000';
    this.connectButton.style.border = 'none';
    this.connectButton.style.borderRadius = '5px';
    this.connectButton.style.cursor = 'pointer';
    this.connectButton.onclick = () => this.handleConnect();
    document.body.appendChild(this.connectButton);
  }

  private async handleConnect(): Promise<void> {
    if (!this.nameInput || !this.connectButton) return;

    const playerName = this.nameInput.value.trim();
    if (!playerName) {
      this.statusText.setText('Please enter a name!');
      return;
    }

    savePlayerName(playerName);
    CONFIG.PLAYER_NAME = playerName;

    this.connectButton.disabled = true;
    this.connectButton.textContent = 'Connecting...';
    this.statusText.setText('Connecting to server...');

    try {
      await this.networkManager.connect();
    } catch (error) {
      console.error('Connection failed:', error);
      this.statusText.setText('Connection failed. Please check server.');
      this.connectButton.disabled = false;
      this.connectButton.textContent = 'Connect & Play';
    }
  }

  private cleanupInputs(): void {
    if (this.nameInput) {
      document.body.removeChild(this.nameInput);
      this.nameInput = null;
    }
    if (this.connectButton) {
      document.body.removeChild(this.connectButton);
      this.connectButton = null;
    }
  }

  shutdown(): void {
    this.cleanupInputs();
  }
}
