# 🎮 MMM - Multiplayer Shooting Game

A fully functional, real-time multiplayer shooting game built with Phaser 3, TypeScript, Node.js, and Socket.io. Playable on Web, Android, and iOS.

## 🚀 Features

- **Real-time Multiplayer**: Up to 10 players per room using WebSocket (Socket.io)
- **Multiple Weapons**: Pistol, Rifle, Shotgun, Sniper with unique stats
- **Smooth Gameplay**: Client-side prediction and server reconciliation
- **Cross-Platform**: Web, Android, iOS support
- **Room System**: Join or create game rooms
- **Scoring System**: Kill tracking, deaths, and leaderboard
- **Modern UI**: Health bars, ammo counter, minimap, kill feed
- **Visual Effects**: Muzzle flash, bullet trails, explosions, blood particles

## 🛠️ Tech Stack

- **Frontend**: Phaser 3 (TypeScript)
- **Backend**: Node.js + Express + Socket.io
- **Build**: Vite
- **Mobile**: Capacitor
- **Assets**: Free open-source assets

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- For Android: Android Studio
- For iOS: Xcode (macOS only)

## 🔧 Installation

### 1. Clone and Install Dependencies

```bash
# Navigate to project folder
cd MMM

# Install all dependencies (root, client, server, shared)
npm run install:all
```

### 2. Run Development Server

```bash
# Start both server and client in development mode
npm run dev

# Or run separately:
npm run dev:server  # Server on http://localhost:3000
npm run dev:client  # Client on http://localhost:5173
```

The game will be available at `http://localhost:5173`

## 🎯 How to Play

### Web/Desktop Controls:
- **Movement**: WASD or Arrow Keys
- **Aim**: Mouse
- **Shoot**: Left Mouse Button
- **Reload**: R
- **Switch Weapon**: 1, 2, 3, 4 (or Mouse Wheel)
- **Jump**: Space

### Mobile Controls:
- **Virtual Joystick**: Left side for movement
- **Aim Joystick**: Right side for aiming
- **Shoot Button**: Auto-fire when aiming
- **Weapon Switch**: On-screen buttons

## 🏗️ Building for Production

### Web Build
```bash
npm run build
npm start  # Serves production build on port 3000
```

### Android Build
```bash
# First time setup
npm run mobile:init
npm run mobile:android

# This will:
# 1. Build the web app
# 2. Add Android platform
# 3. Sync assets
# 4. Open Android Studio
```

In Android Studio:
1. Wait for Gradle sync to complete
2. Connect device or start emulator
3. Click Run ▶️

### iOS Build (macOS only)
```bash
npm run mobile:ios

# This will open Xcode
```

In Xcode:
1. Select target device/simulator
2. Click Run ▶️

## 📁 Project Structure

```
MMM/
├── client/              # Phaser 3 game client
│   ├── src/
│   │   ├── scenes/      # Game scenes (Boot, Menu, Game)
│   │   ├── entities/    # Player, Bullet, Weapon classes
│   │   ├── ui/          # HUD, Menus, Overlays
│   │   ├── network/     # Socket.io client manager
│   │   ├── utils/       # Helpers and utilities
│   │   └── main.ts      # Entry point
│   ├── assets/          # Sprites, sounds, music
│   ├── public/          # Static files
│   └── index.html
├── server/              # Node.js multiplayer server
│   ├── src/
│   │   ├── game/        # Game logic (Player, Room, GameState)
│   │   ├── network/     # Socket.io handlers
│   │   └── server.ts    # Express + Socket.io setup
│   └── package.json
├── shared/              # Shared types and constants
│   ├── src/
│   │   ├── types.ts     # TypeScript interfaces
│   │   └── constants.ts # Game configuration
│   └── package.json
└── package.json         # Root workspace config
```

## 🎨 Assets

All assets are free and open-source from:
- [Kenney.nl](https://kenney.nl/) - Sprites and UI
- [OpenGameArt.org](https://opengameart.org/) - Characters and effects
- [Freesound.org](https://freesound.org/) - Sound effects
- [Incompetech](https://incompetech.com/) - Background music

## 🔧 Configuration

### Server Configuration
Edit `server/src/config.ts`:
- Port number
- Maximum players per room
- Game tick rate
- Physics settings

### Game Configuration
Edit `shared/src/constants.ts`:
- Player speed and health
- Weapon stats (damage, fire rate, ammo)
- Map size
- Respawn time

## 🌐 Deployment

### Deploy Server (Heroku, Railway, etc.)
```bash
# Server can be deployed to any Node.js hosting
cd server
npm run build
# Set environment variables and deploy
```

### Deploy Client (Netlify, Vercel, GitHub Pages)
```bash
cd client
npm run build
# Deploy the dist/ folder
```

### Environment Variables
Server needs:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - production/development
- `CLIENT_URL` - CORS allowed origin

## 🎮 Game Modes (Future)

- [ ] Team Deathmatch
- [ ] Capture the Flag
- [ ] Battle Royale
- [ ] Free for All (implemented)

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Change port in server/src/config.ts or set environment variable
PORT=3001 npm run dev:server
```

**Mobile build fails:**
```bash
# Ensure you have Android Studio or Xcode installed
# For Android: Set ANDROID_HOME environment variable
# For iOS: Requires macOS with Xcode
```

**Connection issues:**
- Check firewall settings
- Ensure server URL is correct in client config
- For mobile: Use actual IP address, not localhost

## 📝 License

This project uses open-source assets and code. See individual asset licenses in the `client/assets/` directory.

## 🤝 Contributing

Feel free to fork, modify, and improve this game!

## 📧 Support

For issues and questions, please open a GitHub issue.

---

**Built with ❤️ using Phaser 3, Node.js, and Socket.io**
