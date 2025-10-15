# 🐛 Debugging Guide

## Current Status

✅ **Servers Running Successfully**
- Game Server: `http://localhost:3000`
- Client: `http://localhost:5173`

## Known Issues & Solutions

### Issue 1: "Cannot find module 'socket.io-client'"

**Problem**: TypeScript shows error about missing socket.io-client types.

**Root Cause**: The project uses npm workspaces, so dependencies are installed in the root `node_modules` folder, not in individual package folders.

**Status**: ✅ RESOLVED - socket.io-client is installed in root node_modules

**Verification**:
```powershell
Test-Path "C:\Users\Nike\Documents\Programming\Projects\Games\MMM\node_modules\socket.io-client"
# Should return: True
```

### Issue 2: Game Stuck on Loading Screen

**Symptoms**: Browser shows "MMM" title and "Loading..." text but doesn't proceed to menu.

**Possible Causes**:
1. JavaScript error preventing scene transition
2. Asset loading failure
3. Module import error (socket.io-client not found by browser)

**Debugging Steps**:

#### Step 1: Check Browser Console
1. Open browser at `http://localhost:5173`
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for errors (red text)

**Expected Console Output** (if working):
```
MMM - Multiplayer Shooting Game
Version 1.0.0
Loading game...
BootScene: preload started
BootScene: create started
BootScene: loading screen hidden
BootScene: starting MenuScene
MenuScene: create started
```

**If you see errors**:
- **"Cannot find module 'socket.io-client'"**: The browser can't load the module
- **"NetworkManager is not defined"**: Import issue
- **"Failed to fetch"**: Vite can't load a file

#### Step 2: Check Network Tab
1. In Developer Tools, go to **Network** tab
2. Refresh the page (F5)
3. Look for failed requests (red or status 404)

**Common Issues**:
- `socket.io-client` shows 404: Module not found
- `main.ts` shows error: TypeScript compilation failed
- `mmm-shared` shows error: Shared module not built

#### Step 3: Check Vite Terminal Output
Look at the Vite output in the terminal for any errors:
```
[1] ERROR: Failed to resolve...
[1] Error transforming...
```

### Issue 3: Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**: Kill all Node.js processes
```powershell
taskkill /F /IM node.exe
npm run dev
```

## Quick Fixes

### Fix 1: Reinstall All Dependencies
```powershell
cd C:\Users\Nike\Documents\Programming\Projects\Games\MMM

# Clean install
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Rebuild shared module
cd shared
npm run build
cd ..

# Restart servers
npm run dev
```

### Fix 2: Clear Browser Cache
1. Open browser console (F12)
2. Right-click the Refresh button
3. Select "Empty Cache and Hard Reload"

### Fix 3: Check File Permissions
If you see `EPERM` errors:
```powershell
# Run PowerShell as Administrator
# Navigate to project folder
cd C:\Users\Nike\Documents\Programming\Projects\Games\MMM

# Reset permissions (if needed)
icacls . /reset /T
```

## Testing the Game

### Test 1: Single Player (No Multiplayer)
1. Open `http://localhost:5173`
2. Enter a player name
3. Click "Connect & Play"
4. You should see a game world with platforms

### Test 2: Multiplayer
1. Open `http://localhost:5173` in first browser tab
2. Enter name "Player1" and connect
3. Open `http://localhost:5173` in second browser tab
4. Enter name "Player2" and connect
5. Both players should see each other

### Test 3: Network Connection
Check if client connects to server:
1. Look at the terminal output
2. You should see: `Player connected: <socket-id>`
3. When joining: `Player <name> (id) joined room <room-id>`

## Common Errors & Solutions

| Error | Solution |
|-------|----------|
| `Cannot find module 'socket.io-client'` | Already installed in root node_modules - TypeScript warning only |
| `Failed to resolve entry for package 'mmm-shared'` | Run `cd shared && npm run build` |
| `EADDRINUSE` | Run `taskkill /F /IM node.exe` |
| Game stuck on loading | Check browser console (F12) for errors |
| TypeScript errors | Install `@types/node` in server: `cd server && npm i -D @types/node` |

## Debug Mode

To enable more verbose logging:

### Client Debug Mode
Edit `client/src/main.ts`:
```typescript
// Change debug to true
physics: {
  default: 'arcade',
  arcade: {
    gravity: { y: GAME_CONFIG.GRAVITY, x: 0 },
    debug: true,  // Enable physics debug
  },
},
```

### Server Debug Mode
Edit `server/src/config.ts`:
```typescript
export const CONFIG = {
  DEBUG: true,  // Add this line
  // ... rest of config
};
```

## Getting Help

If you're still stuck:

1. **Check this file first**: Make sure you've tried all solutions above
2. **Browser Console**: Take a screenshot of any errors in F12 console
3. **Terminal Output**: Copy the full terminal output
4. **Network Tab**: Check if any files are failing to load (404 errors)

## Current Debug Additions

I've added console.log statements to:
- `BootScene.ts` - Shows when preload/create are called
- `MenuScene.ts` - Shows when menu is created

These will help identify where the game is getting stuck.

## Next Steps

1. **Open browser at**: `http://localhost:5173`
2. **Press F12** to open Developer Tools
3. **Check Console tab** for the debug messages
4. **Report back** what you see in the console

The game should show:
```
BootScene: preload started
BootScene: create started
BootScene: loading screen hidden
BootScene: starting MenuScene
MenuScene: create started
```

If it stops before "MenuScene: create started", there's an issue with the scene transition.
