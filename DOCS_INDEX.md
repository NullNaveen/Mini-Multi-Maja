# 📚 Documentation Index

Welcome to the MMM Multiplayer Shooting Game documentation!

This guide will help you find what you need quickly.

## 🚀 Getting Started (Start Here!)

**New to the project?** Follow these in order:

1. **[README.md](README.md)** - Project overview and quick introduction
2. **[QUICKSTART.md](QUICKSTART.md)** - Fast setup and installation (5 minutes)
3. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete feature list and architecture

**Installation:**
```powershell
# Automatic installation (recommended)
.\install.ps1

# Or manual
npm run install:all

# Start the game
npm run dev
```

## 📖 Main Documentation

### Core Documents

| Document | Description | When to Read |
|----------|-------------|--------------|
| [README.md](README.md) | Main project overview | First thing to read |
| [QUICKSTART.md](QUICKSTART.md) | Fast setup guide | When installing |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Complete details | To understand everything |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Common problems & solutions | When something breaks |

### Development

| Document | Description | When to Read |
|----------|-------------|--------------|
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute | Before making changes |
| [ROADMAP.md](ROADMAP.md) | Future features & ideas | Planning improvements |
| [LICENSE](LICENSE) | Legal stuff | Before distributing |

### Deployment

| Document | Description | When to Read |
|----------|-------------|--------------|
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment | Going live |
| [client/assets/ATTRIBUTION.md](client/assets/ATTRIBUTION.md) | Asset credits | Adding graphics/sounds |

## 🎯 Quick Links by Task

### "I want to..."

#### Install and Run
→ [QUICKSTART.md](QUICKSTART.md)
→ Run: `.\install.ps1` then `npm run dev`

#### Understand the Code
→ [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Architecture section
→ Look at: `client/src/` and `server/src/`

#### Fix a Problem
→ [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
→ Check browser console (F12)
→ Check server logs

#### Deploy to Production
→ [DEPLOYMENT.md](DEPLOYMENT.md)
→ Section: Deploy Server + Deploy Web Client

#### Add New Features
→ [ROADMAP.md](ROADMAP.md) - Feature ideas
→ [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute
→ Edit code in `client/src/` or `server/src/`

#### Build for Mobile
→ [DEPLOYMENT.md](DEPLOYMENT.md)
→ Section: Build Android App / Build iOS App

#### Change Game Settings
→ Edit: `shared/src/constants.ts`
→ [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Customization section

#### Add Graphics/Sounds
→ [client/assets/ATTRIBUTION.md](client/assets/ATTRIBUTION.md)
→ Edit: `client/src/scenes/BootScene.ts` (asset loading)

#### Understand Multiplayer
→ [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Networking section
→ Look at: `client/src/network/` and `server/src/network/`

## 📁 Code Navigation

### Client (Phaser 3 Game)
```
client/src/
├── scenes/           # Game scenes
│   ├── BootScene.ts    # Asset loading
│   ├── MenuScene.ts    # Main menu
│   └── GameScene.ts    # Gameplay (IMPORTANT!)
├── entities/         # Game objects
│   ├── LocalPlayer.ts  # Your character
│   ├── RemotePlayer.ts # Other players
│   └── Bullet.ts       # Bullet physics
├── network/          # Multiplayer
│   └── NetworkManager.ts # Socket.io client
├── ui/               # User interface
│   └── GameUI.ts       # HUD, menus
├── config.ts         # Client settings
└── main.ts          # Entry point (START HERE!)
```

### Server (Node.js)
```
server/src/
├── game/            # Game logic
│   ├── Player.ts      # Player entity
│   ├── Bullet.ts      # Bullet entity
│   └── Room.ts        # Game room (IMPORTANT!)
├── network/         # Multiplayer
│   └── GameServer.ts  # Socket.io server (IMPORTANT!)
├── config.ts        # Server settings
└── server.ts       # Entry point (START HERE!)
```

### Shared (Common Code)
```
shared/src/
├── constants.ts     # Game configuration (EDIT THIS!)
├── types.ts         # TypeScript interfaces
└── index.ts        # Exports
```

## 🔧 Configuration Files

### Game Settings
- **`shared/src/constants.ts`** - Game balance (weapons, player stats)
- **`server/src/config.ts`** - Server settings (tick rate, max players)
- **`client/src/config.ts`** - Client settings (server URL)

### Build Settings
- **`package.json`** - Dependencies and scripts (root, client, server, shared)
- **`tsconfig.json`** - TypeScript configuration
- **`vite.config.ts`** - Vite build configuration (client)
- **`capacitor.config.json`** - Mobile app configuration

### Environment
- **`.env`** - Environment variables (create from `.env.example`)

## 🎮 Game Features Reference

### Implemented Features
See [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - "What Has Been Built" section

### Future Features
See [ROADMAP.md](ROADMAP.md)

### Weapons
See [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - "Weapons System" section

### Controls
See [README.md](README.md) - "How to Play" section

## 🐛 Debugging

### Common Issues
1. **Can't connect** → [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - "Cannot connect to server"
2. **Port in use** → [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - "Port already in use"
3. **Dependencies fail** → [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - "npm install fails"
4. **Game crashes** → Check browser console (F12)

### Debug Tools
- Browser Console: F12
- Server Logs: Check terminal
- Network Tab: F12 > Network > Filter by WS
- Phaser Debug: Set `debug: true` in physics config

## 📚 External Resources

### Technologies Used
- **Phaser 3**: https://phaser.io/docs
- **Socket.io**: https://socket.io/docs/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Vite**: https://vitejs.dev/guide/
- **Capacitor**: https://capacitorjs.com/docs

### Learning Resources
- [Phaser 3 Examples](https://phaser.io/examples)
- [Socket.io Tutorial](https://socket.io/get-started/chat)
- [Game Networking](https://www.gabrielgambetta.com/client-server-game-architecture.html)

### Asset Resources
- **Kenney.nl** - https://kenney.nl/assets
- **OpenGameArt** - https://opengameart.org/
- **Freesound** - https://freesound.org/

## ❓ FAQ

### How do I start the game?
```powershell
npm run dev
# Then open http://localhost:5173
```

### How do I change weapon stats?
Edit `shared/src/constants.ts` → `WEAPON_STATS`

### How do I add a new weapon?
1. Add to `WeaponType` enum
2. Add stats to `WEAPON_STATS`
3. Add texture in `BootScene.ts`
4. Add keybinding in `GameScene.ts`

### How do I deploy?
See [DEPLOYMENT.md](DEPLOYMENT.md)

### How do I contribute?
See [CONTRIBUTING.md](CONTRIBUTING.md)

### Where are the graphics?
Currently placeholder (colored shapes).
Replace in `client/src/scenes/BootScene.ts`
See [client/assets/ATTRIBUTION.md](client/assets/ATTRIBUTION.md)

### Can I use this commercially?
Yes! MIT License. See [LICENSE](LICENSE)

### How do I get help?
1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Check browser console for errors
3. Search existing GitHub issues
4. Create new GitHub issue

## 📞 Support

### If you're stuck:

1. **Check the docs** - You're in the right place!
2. **Read error messages** - They usually tell you what's wrong
3. **Search the code** - Use VS Code search (Ctrl+Shift+F)
4. **Ask for help** - Create a GitHub issue

### Before asking for help, include:

- What you're trying to do
- What you tried
- What error message you got
- Your Node.js version (`node --version`)
- Your OS (Windows, Mac, Linux)

## 🎯 Common Workflows

### Daily Development
```powershell
# Start game
npm run dev

# Make changes to code
# Browser auto-reloads

# Test multiplayer: Open multiple browser windows
```

### Adding a Feature
1. Read [ROADMAP.md](ROADMAP.md) for ideas
2. Read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines
3. Edit code in `client/src/` or `server/src/`
4. Test locally
5. Commit changes

### Deploying
1. Read [DEPLOYMENT.md](DEPLOYMENT.md)
2. Build: `npm run build`
3. Deploy server (Railway, Heroku, etc.)
4. Deploy client (Netlify, Vercel, etc.)
5. Update environment variables

### Building for Mobile
1. Read [DEPLOYMENT.md](DEPLOYMENT.md) - Mobile section
2. Build web: `cd client && npm run build`
3. Add platform: `npx cap add android` or `npx cap add ios`
4. Open IDE: `npx cap open android` or `npx cap open ios`
5. Build in Android Studio or Xcode

## 🎓 Learning Path

### Beginner Path
1. Install and run the game
2. Play and understand mechanics
3. Read through `client/src/main.ts`
4. Explore `client/src/scenes/`
5. Try changing weapon stats
6. Add a simple feature (new weapon)

### Intermediate Path
1. Understand client-server architecture
2. Study `NetworkManager.ts` and `GameServer.ts`
3. Learn about game loops and updates
4. Understand physics and collision
5. Add a game mode
6. Optimize performance

### Advanced Path
1. Implement lag compensation
2. Add anti-cheat measures
3. Create matchmaking system
4. Optimize network protocol
5. Scale to multiple servers
6. Add database persistence

## 🗺️ Site Map

```
MMM/
├── 📖 Documentation
│   ├── README.md (START HERE)
│   ├── QUICKSTART.md
│   ├── PROJECT_SUMMARY.md
│   ├── TROUBLESHOOTING.md
│   ├── DEPLOYMENT.md
│   ├── CONTRIBUTING.md
│   ├── ROADMAP.md
│   ├── LICENSE
│   └── DOCS_INDEX.md (YOU ARE HERE)
│
├── 🎮 Client (Game)
│   └── See "Code Navigation" above
│
├── 🖥️ Server (Backend)
│   └── See "Code Navigation" above
│
├── 🔄 Shared (Common)
│   └── See "Code Navigation" above
│
└── 🛠️ Scripts
    ├── install.ps1 (Installation)
    └── start.ps1 (Start game)
```

---

## 🚀 Ready to Start?

**First time?**
1. Read [README.md](README.md)
2. Run [install.ps1](install.ps1)
3. Run `npm run dev`
4. Play!

**Want to code?**
1. Read [CONTRIBUTING.md](CONTRIBUTING.md)
2. Browse [ROADMAP.md](ROADMAP.md) for ideas
3. Check [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for architecture
4. Start coding!

**Need help?**
1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Ask for help on GitHub

---

**Happy gaming and coding! 🎮💻**

*This project is open source and community-driven. Contributions welcome!*
