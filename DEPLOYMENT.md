# Deployment Guide

This guide covers deploying the MMM multiplayer shooting game to various platforms.

## Table of Contents
1. [Deploy Server](#deploy-server)
2. [Deploy Web Client](#deploy-web-client)
3. [Build Android App](#build-android-app)
4. [Build iOS App](#build-ios-app)
5. [Environment Variables](#environment-variables)

---

## Deploy Server

### Option 1: Railway (Recommended - Free Tier Available)

1. Install Railway CLI:
```powershell
npm install -g @railway/cli
```

2. Login and deploy:
```powershell
cd server
railway login
railway init
railway up
```

3. Set environment variables in Railway dashboard:
```
PORT=3000
NODE_ENV=production
CLIENT_URL=https://your-client-url.com
```

### Option 2: Heroku

1. Install Heroku CLI and login:
```powershell
heroku login
```

2. Create app and deploy:
```powershell
cd server
heroku create mmm-game-server
git init
git add .
git commit -m "Initial deploy"
git push heroku main
```

3. Set environment variables:
```powershell
heroku config:set NODE_ENV=production
heroku config:set CLIENT_URL=https://your-client-url.com
```

### Option 3: DigitalOcean / AWS / Azure

1. Create a server instance (Ubuntu 20.04+)
2. SSH into server
3. Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. Clone repository:
```bash
git clone your-repo-url
cd MMM/server
npm install
npm run build
```

5. Set up PM2 for process management:
```bash
sudo npm install -g pm2
pm2 start dist/server.js --name mmm-server
pm2 startup
pm2 save
```

6. Set up Nginx as reverse proxy:
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/mmm
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. Enable site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/mmm /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

8. Set up SSL with Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Deploy Web Client

### Option 1: Netlify (Recommended)

1. Install Netlify CLI:
```powershell
npm install -g netlify-cli
```

2. Build and deploy:
```powershell
cd client
npm run build
netlify deploy --prod --dir=dist
```

3. Set environment variable in Netlify dashboard:
```
VITE_SERVER_URL=https://your-server-url.com
```

### Option 2: Vercel

1. Install Vercel CLI:
```powershell
npm install -g vercel
```

2. Deploy:
```powershell
cd client
npm run build
vercel --prod
```

3. Add environment variable in Vercel dashboard

### Option 3: GitHub Pages

1. Install gh-pages:
```powershell
cd client
npm install --save-dev gh-pages
```

2. Add to package.json:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. Deploy:
```powershell
npm run deploy
```

### Option 4: Firebase Hosting

1. Install Firebase CLI:
```powershell
npm install -g firebase-tools
```

2. Initialize and deploy:
```powershell
cd client
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## Build Android App

### Prerequisites:
- Android Studio installed
- Java JDK 11 or higher
- Android SDK configured

### Steps:

1. **Build web app:**
```powershell
cd client
npm run build
```

2. **Initialize Capacitor (first time only):**
```powershell
npx cap init
# Enter:
# App name: MMM Shooter
# App ID: com.mmm.shooter
# Web dir: dist
```

3. **Add Android platform:**
```powershell
npx cap add android
```

4. **Update server URL:**
Edit `client/src/config.ts`:
```typescript
SERVER_URL: 'https://your-production-server.com'
```

Rebuild:
```powershell
npm run build
npx cap sync android
```

5. **Open in Android Studio:**
```powershell
npx cap open android
```

6. **In Android Studio:**
- Wait for Gradle sync to complete
- Build > Generate Signed Bundle / APK
- Select "APK" or "Android App Bundle"
- Create or select signing key
- Choose "release" build variant
- Build APK

7. **Output location:**
```
client/android/app/build/outputs/apk/release/app-release.apk
```

### Testing:
```powershell
# Install on connected device
npx cap run android
```

### Publishing to Google Play:
1. Create Google Play Developer account ($25 one-time fee)
2. Create new app in Play Console
3. Upload Android App Bundle (.aab file)
4. Fill in store listing, content rating, pricing
5. Submit for review

---

## Build iOS App

### Prerequisites:
- macOS with Xcode installed
- Apple Developer account ($99/year)
- CocoaPods installed: `sudo gem install cocoapods`

### Steps:

1. **Build web app:**
```bash
cd client
npm run build
```

2. **Add iOS platform:**
```bash
npx cap add ios
```

3. **Update server URL for production:**
Edit `client/src/config.ts` with production URL

4. **Sync and open Xcode:**
```bash
npm run build
npx cap sync ios
npx cap open ios
```

5. **In Xcode:**
- Select your development team in project settings
- Choose target device (iPhone, iPad, or generic iOS device)
- Set deployment target (iOS 13+)
- Product > Archive
- Distribute App > App Store Connect
- Upload to App Store

### Testing:
```bash
# Run on simulator
npx cap run ios

# Run on device (device must be registered)
# Open in Xcode and run
```

### Publishing to App Store:
1. Create app in App Store Connect
2. Upload build from Xcode
3. Fill in app information, screenshots
4. Submit for review
5. Wait for Apple approval (1-3 days typically)

---

## Environment Variables

### Server (.env):
```bash
PORT=3000
NODE_ENV=production
CLIENT_URL=https://your-client-url.com
```

### Client (.env):
```bash
VITE_SERVER_URL=https://your-server-url.com
```

### Important Notes:

1. **CORS**: Server must allow client URL in CORS settings
2. **WebSocket**: Ensure server supports WebSocket connections
3. **HTTPS**: Use HTTPS for production (required for mobile)
4. **Ports**: Default is 3000 for server, but can be changed

---

## Performance Optimization

### Before deployment:

1. **Minify code:**
Already handled by Vite build

2. **Compress assets:**
```powershell
# Install imagemin for asset compression
npm install -g imagemin-cli

# Optimize images
imagemin client/assets/**/*.png --out-dir=client/assets/
```

3. **Enable gzip on server:**
Add to server/src/server.ts:
```typescript
import compression from 'compression';
app.use(compression());
```

4. **CDN for static assets:**
Upload build assets to CDN (Cloudflare, etc.)

---

## Monitoring & Debugging

### Server Monitoring:
```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs mmm-server

# Restart server
pm2 restart mmm-server
```

### Client Analytics:
Add Google Analytics or similar to track usage

### Error Tracking:
Consider adding Sentry or similar for error tracking

---

## Scaling

### For high traffic:

1. **Use Redis for session management**
2. **Add load balancer** (Nginx, AWS ALB)
3. **Run multiple server instances**
4. **Use dedicated game server hosting** (Photon, Colyseus, etc.)
5. **Implement room-based server distribution**

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Rate limiting implemented
- [ ] Input validation on server
- [ ] CORS properly configured
- [ ] WebSocket authentication
- [ ] Regular security updates
- [ ] Firewall configured

---

## Support & Maintenance

### Regular Tasks:
1. Monitor server logs
2. Check error rates
3. Update dependencies monthly
4. Monitor player feedback
5. Track server costs
6. Backup game data

### Useful Commands:
```powershell
# Update dependencies
npm outdated
npm update

# Check for security vulnerabilities
npm audit
npm audit fix

# Monitor server health
curl https://your-server.com/health
```

---

## Troubleshooting

**"Cannot connect to server":**
- Check if server is running
- Verify SERVER_URL is correct
- Check firewall rules
- Ensure WebSocket is enabled

**"App crashes on mobile":**
- Check Capacitor logs
- Test on different devices
- Verify all assets loaded
- Check memory usage

**"High latency":**
- Check server location
- Use CDN for assets
- Optimize game tick rate
- Consider regional servers

---

Good luck with your deployment! 🚀

For additional help, check:
- [Phaser Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Socket.io Documentation](https://socket.io/docs/)
- [Capacitor Documentation](https://capacitorjs.com/docs)
