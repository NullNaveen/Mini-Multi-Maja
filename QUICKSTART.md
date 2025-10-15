# Quick Start Guide

## Installation & Running

### Windows PowerShell Commands:

```powershell
# 1. Install all dependencies
npm run install:all

# 2. Start development (both server and client)
npm run dev

# The server will start on http://localhost:3000
# The client will start on http://localhost:5173 and open in your browser
```

### Manual Step-by-Step:

```powershell
# If the combined command doesn't work, run these separately:

# Install root dependencies
npm install

# Install shared dependencies
cd shared
npm install
npm run build
cd ..

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..

# Start server (in one terminal)
cd server
npm run dev

# Start client (in another terminal)
cd client
npm run dev
```

## Building for Production

```powershell
# Build all packages
npm run build

# Start production server
npm start
```

## Mobile Builds

### Android:
```powershell
# First time setup
cd client
npx cap init

# Build and open in Android Studio
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

### iOS (macOS only):
```powershell
cd client
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

## Troubleshooting

**Dependencies not installing:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete all node_modules
Remove-Item -Recurse -Force node_modules, client\node_modules, server\node_modules, shared\node_modules

# Reinstall
npm run install:all
```

**Port already in use:**
```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
# Note the PID and kill it:
taskkill /PID <PID> /F

# Or change port in server/src/config.ts
```

**Cannot connect to server:**
- Make sure server is running on port 3000
- Check firewall settings
- For mobile: Use actual IP address instead of localhost

## Game Controls

- **WASD or Arrow Keys**: Move
- **Mouse**: Aim
- **Left Click**: Shoot
- **R**: Reload
- **1, 2, 3, 4**: Switch weapons
- **Space**: Jump
- **TAB**: Show scoreboard
- **ESC**: Quit

## Project Structure

```
MMM/
├── client/          # Phaser 3 game (TypeScript)
├── server/          # Node.js multiplayer server
├── shared/          # Shared types and constants
└── package.json     # Root workspace manager
```

## Development Tips

1. **Hot Reload**: Both client and server support hot reload during development
2. **Debugging**: Check browser console (F12) for client errors
3. **Server Logs**: Check terminal where server is running
4. **Network**: Use browser DevTools Network tab to see WebSocket communication

## Next Steps

1. Customize game settings in `shared/src/constants.ts`
2. Add more weapons, maps, or game modes
3. Improve graphics by replacing placeholder textures
4. Add sound effects and music
5. Implement team-based modes

Enjoy building your multiplayer shooter! 🎮
