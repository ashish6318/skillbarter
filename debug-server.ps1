# Debug Server Script
Write-Host "🔍 Debugging Skill Barter Server..." -ForegroundColor Yellow

Write-Host "`n1. Checking if MongoDB is running..." -ForegroundColor Cyan
$mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "✅ MongoDB is running (PID: $($mongoProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "❌ MongoDB is not running!" -ForegroundColor Red
    Write-Host "   Please start MongoDB first" -ForegroundColor Yellow
}

Write-Host "`n2. Checking if port 5000 is available..." -ForegroundColor Cyan
$portCheck = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($portCheck) {
    Write-Host "❌ Port 5000 is already in use!" -ForegroundColor Red
    Write-Host "   Process using port: $($portCheck.OwningProcess)" -ForegroundColor Yellow
} else {
    Write-Host "✅ Port 5000 is available" -ForegroundColor Green
}

Write-Host "`n3. Checking server dependencies..." -ForegroundColor Cyan
if (Test-Path "server\node_modules") {
    Write-Host "✅ Server node_modules found" -ForegroundColor Green
} else {
    Write-Host "❌ Server node_modules missing!" -ForegroundColor Red
    Write-Host "   Run: cd server && npm install" -ForegroundColor Yellow
}

Write-Host "`n4. Starting server with verbose logging..." -ForegroundColor Cyan
Set-Location "server"
$env:DEBUG = "*"
$env:NODE_ENV = "development"
node index.js
