# MMM Game - Start Script for Windows
# Run this script with: .\start.ps1

Write-Host "=============================================" -ForegroundColor Green
Write-Host "  MMM - Multiplayer Shooting Game" -ForegroundColor Green
Write-Host "  Starting Development Servers..." -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "✗ Dependencies not installed!" -ForegroundColor Red
    Write-Host "Please run: .\install.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "Starting server and client..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Server will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Client will be available at: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Start both server and client
npm run dev
