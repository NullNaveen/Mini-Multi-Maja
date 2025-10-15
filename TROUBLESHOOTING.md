# Troubleshooting Guide

Common issues and their solutions when setting up or running MMM.

## Installation Issues

### "npm install fails"

**Problem:** Dependencies won't install

**Solutions:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete all node_modules folders
Remove-Item -Recurse -Force node_modules, client\node_modules, server\node_modules, shared\node_modules

# Try again
npm run install:all
```

**Or install manually:**
```powershell
# Root
npm install

# Shared
cd shared
npm install
npm run build
cd ..

# Server
cd server
npm install
cd ..

# Client
cd client
npm install
cd ..
```

### "Cannot find module 'mmm-shared'"

**Problem:** Shared package not built

**Solution:**
```powershell
cd shared
npm install
npm run build
cd ..
```

### "TypeScript errors everywhere"

**Problem:** Dependencies not installed or IDE not recognizing them

**Solutions:**
1. Make sure all dependencies are installed
2. Restart VS Code or your IDE
3. Try: `npm install` in each directory
4. Reload TypeScript server in VS Code: Ctrl+Shift+P > "TypeScript: Restart TS Server"

## Runtime Issues

### "Server won't start"

**Error:** `Port 3000 is already in use`

**Solution:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change the port in server/src/config.ts
```

**Error:** `Cannot find module`

**Solution:**
```powershell
cd server
npm install
npm run build
```

### "Client won't start"

**Error:** `Port 5173 is already in use`

**Solution:**
```powershell
# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or edit client/vite.config.ts to use different port
```

### "Cannot connect to server"

**Problem:** Client can't reach server

**Checklist:**
1. ✓ Is server running? Check http://localhost:3000/health
2. ✓ Check `client/src/config.ts` - is SERVER_URL correct?
3. ✓ Check firewall settings
4. ✓ Try different browser
5. ✓ Clear browser cache and cookies

**For mobile/other devices:**
```typescript
// In client/src/config.ts, use actual IP address:
SERVER_URL: 'http://192.168.1.100:3000'
```

Find your IP:
```powershell
ipconfig
# Look for IPv4 Address
```

### "Game loads but no players appear"

**Problem:** Network connection issue

**Solutions:**
1. Check browser console (F12) for errors
2. Check Network tab - are WebSocket connections failing?
3. Make sure server is running
4. Try refreshing the page
5. Check server logs for errors

### "High latency / Lag"

**Problem:** Network performance issues

**Solutions:**
1. Check ping display in game (top left)
2. Close other applications using network
3. Use wired connection instead of WiFi
4. If hosting server yourself, use better hosting
5. Adjust `TICK_RATE` in server config (lower = less CPU)

### "Game crashes / Freezes"

**Problem:** Performance or code issue

**Solutions:**
1. Check browser console for errors
2. Try different browser
3. Lower game quality settings (future feature)
4. Check RAM usage - close other tabs
5. Update graphics drivers

## Build Issues

### "Production build fails"

**Error:** Build errors in Vite or TypeScript

**Solutions:**
```powershell
# Clean and rebuild
Remove-Item -Recurse -Force dist, client\dist, server\dist

# Build shared first
cd shared
npm run build
cd ..

# Then build server
cd server
npm run build
cd ..

# Then build client
cd client
npm run build
cd ..
```

### "Mobile build fails"

**Android Issues:**

**Error:** `ANDROID_HOME not set`

**Solution:**
```powershell
# Set environment variable (replace path with your installation)
$env:ANDROID_HOME = "C:\Users\YourName\AppData\Local\Android\Sdk"

# Or add permanently:
# System Properties > Environment Variables > New
# Variable: ANDROID_HOME
# Value: C:\Users\YourName\AppData\Local\Android\Sdk
```

**Error:** `Gradle build failed`

**Solution:**
1. Open Android Studio
2. File > Invalidate Caches / Restart
3. Build > Clean Project
4. Build > Rebuild Project

**iOS Issues:**

**Error:** `xcodebuild not found`

**Solution:**
- Install Xcode from Mac App Store
- Run: `xcode-select --install`

**Error:** `Signing certificate not found`

**Solution:**
1. Open project in Xcode
2. Select target > Signing & Capabilities
3. Select your development team
4. Let Xcode automatically manage signing

## Development Issues

### "Hot reload not working"

**Problem:** Changes don't appear automatically

**Solutions:**
1. Save the file (Ctrl+S)
2. Wait a few seconds
3. Check terminal for compilation errors
4. Restart dev server
5. Hard refresh browser (Ctrl+Shift+R)

### "TypeScript errors but game works"

**Problem:** Type errors don't prevent runtime

**What to do:**
- These are warnings from TypeScript
- Game may still work but could have bugs
- Fix errors for better reliability
- Check `tsconfig.json` settings

### "Game works locally but not on deployed version"

**Problem:** Environment differences

**Checklist:**
1. ✓ Check environment variables are set correctly
2. ✓ Make sure server URL is production URL, not localhost
3. ✓ Check CORS settings on server
4. ✓ Verify WebSocket connections allowed
5. ✓ Check browser console for specific errors

## Performance Issues

### "Low FPS"

**Problem:** Game running slowly

**Solutions:**
1. Close other browser tabs
2. Update graphics drivers
3. Try different browser (Chrome usually fastest)
4. Lower game resolution (edit GAME_CONFIG)
5. Disable browser extensions

### "High memory usage"

**Problem:** Browser using too much RAM

**Solutions:**
1. Refresh page periodically
2. Check for memory leaks in code
3. Limit number of particles/effects
4. Close other applications

## Debugging Tips

### Enable Debug Mode

In `client/src/config.ts`:
```typescript
DEBUG: true,
SHOW_FPS: true,
```

In `server/src/server.ts`:
```typescript
// Add debug logging
console.log('Debug:', someVariable);
```

### Check Phaser Debug

In `client/src/main.ts`:
```typescript
physics: {
  arcade: {
    debug: true, // Shows collision boxes
  }
}
```

### Monitor Network Traffic

1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter by WS (WebSocket)
4. Check messages being sent/received

### Check Server Logs

Server logs appear in terminal where you ran `npm run dev:server`

Look for:
- Connection messages
- Error messages
- Player join/leave events

## Still Having Issues?

### Collect Information:

1. **Your setup:**
   - Node.js version: `node --version`
   - npm version: `npm --version`
   - OS: Windows version
   - Browser: Name and version

2. **Error messages:**
   - Browser console errors (F12)
   - Server terminal errors
   - Build errors

3. **Steps to reproduce:**
   - What you did
   - What happened
   - What you expected

### Get Help:

1. Check existing issues on GitHub
2. Search for similar problems online
3. Create new GitHub issue with details above
4. Ask in community forums

### Quick Diagnostic

Run this to check your environment:
```powershell
Write-Host "=== Environment Check ===" -ForegroundColor Green
Write-Host "Node.js: $(node --version)"
Write-Host "npm: $(npm --version)"
Write-Host "Current directory: $(Get-Location)"
Write-Host ""
Write-Host "Checking files..." -ForegroundColor Yellow
if (Test-Path "package.json") { Write-Host "✓ package.json found" -ForegroundColor Green } else { Write-Host "✗ package.json missing" -ForegroundColor Red }
if (Test-Path "client") { Write-Host "✓ client/ folder found" -ForegroundColor Green } else { Write-Host "✗ client/ folder missing" -ForegroundColor Red }
if (Test-Path "server") { Write-Host "✓ server/ folder found" -ForegroundColor Green } else { Write-Host "✗ server/ folder missing" -ForegroundColor Red }
if (Test-Path "shared") { Write-Host "✓ shared/ folder found" -ForegroundColor Green } else { Write-Host "✗ shared/ folder missing" -ForegroundColor Red }
Write-Host ""
Write-Host "Checking node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") { Write-Host "✓ Root dependencies installed" -ForegroundColor Green } else { Write-Host "✗ Root dependencies missing - run: npm install" -ForegroundColor Red }
if (Test-Path "client\node_modules") { Write-Host "✓ Client dependencies installed" -ForegroundColor Green } else { Write-Host "✗ Client dependencies missing" -ForegroundColor Red }
if (Test-Path "server\node_modules") { Write-Host "✓ Server dependencies installed" -ForegroundColor Green } else { Write-Host "✗ Server dependencies missing" -ForegroundColor Red }
if (Test-Path "shared\node_modules") { Write-Host "✓ Shared dependencies installed" -ForegroundColor Green } else { Write-Host "✗ Shared dependencies missing" -ForegroundColor Red }
```

Save this as `check-environment.ps1` and run it!

## Prevention Tips

### Before you start coding:

1. ✓ Make sure all dependencies are installed
2. ✓ Test that basic setup works
3. ✓ Commit working code before making changes
4. ✓ Test changes incrementally

### Good practices:

1. Save files frequently
2. Check terminal for errors after changes
3. Test in browser after each feature
4. Keep dependencies updated (but carefully)
5. Use version control (git)

---

**Remember:** Most issues are due to:
1. Dependencies not installed
2. Wrong directory
3. Port conflicts
4. Environment variables not set
5. Firewall blocking connections

Start with the basics and work your way up! 🔧
