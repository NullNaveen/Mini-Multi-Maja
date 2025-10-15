# MMM Game - Automated Installation Script for Windows
# Run this script with: .\install.ps1

Write-Host "=============================================" -ForegroundColor Green
Write-Host "  MMM - Multiplayer Shooting Game" -ForegroundColor Green
Write-Host "  Automated Installation Script" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Write-Host "Recommended version: 18.x or higher" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✓ npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm is not installed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Starting installation process..." -ForegroundColor Yellow
Write-Host ""

# Install root dependencies
Write-Host "Step 1/4: Installing root dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install root dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Root dependencies installed" -ForegroundColor Green
Write-Host ""

# Install and build shared module
Write-Host "Step 2/4: Installing shared module..." -ForegroundColor Cyan
Set-Location shared
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install shared dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "Building shared module..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to build shared module" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✓ Shared module ready" -ForegroundColor Green
Set-Location ..
Write-Host ""

# Install server dependencies
Write-Host "Step 3/4: Installing server dependencies..." -ForegroundColor Cyan
Set-Location server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install server dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✓ Server dependencies installed" -ForegroundColor Green
Set-Location ..
Write-Host ""

# Install client dependencies
Write-Host "Step 4/4: Installing client dependencies..." -ForegroundColor Cyan
Set-Location client
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install client dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✓ Client dependencies installed" -ForegroundColor Green
Set-Location ..
Write-Host ""

# Create environment files if they don't exist
Write-Host "Setting up environment files..." -ForegroundColor Cyan
if (-not (Test-Path "server\.env")) {
    Copy-Item "server\.env.example" "server\.env"
    Write-Host "✓ Created server/.env" -ForegroundColor Green
}
if (-not (Test-Path "client\.env")) {
    Copy-Item "client\.env.example" "client\.env"
    Write-Host "✓ Created client/.env" -ForegroundColor Green
}
Write-Host ""

# Success message
Write-Host "=============================================" -ForegroundColor Green
Write-Host "  ✓ Installation Complete!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Start the game:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Or start server and client separately:" -ForegroundColor White
Write-Host "   Terminal 1: npm run dev:server" -ForegroundColor Cyan
Write-Host "   Terminal 2: npm run dev:client" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Open browser to:" -ForegroundColor White
Write-Host "   http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. For more information, see:" -ForegroundColor White
Write-Host "   - README.md        (overview)" -ForegroundColor Gray
Write-Host "   - QUICKSTART.md    (quick start guide)" -ForegroundColor Gray
Write-Host "   - PROJECT_SUMMARY.md (complete details)" -ForegroundColor Gray
Write-Host ""
Write-Host "Happy gaming! 🎮" -ForegroundColor Green
Write-Host ""
