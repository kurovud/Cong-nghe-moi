# PC Shop Backend - Startup Script
# Usage: .\scripts\startup.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PC Shop Backend - Setup & Start" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

# Step 1: Install dependencies
Write-Host "`n[1/6] Installing common library..." -ForegroundColor Yellow
Set-Location "$root\common"
npm install 2>$null
npm run build 2>$null

$services = @(
    "api-gateway", "auth-service", "paper-service", 
    "conference-service", "review-service", "notification-service",
    "file-service", "scheduler-service"
)

Write-Host "`n[2/6] Installing service dependencies..." -ForegroundColor Yellow
foreach ($svc in $services) {
    Write-Host "  $svc..." -ForegroundColor Gray
    Set-Location "$root\services\$svc"
    npm install 2>$null
}

# Step 3: Generate Prisma clients
Write-Host "`n[3/6] Generating Prisma clients..." -ForegroundColor Yellow
$prismaServices = @("auth-service", "paper-service", "conference-service", "review-service")
foreach ($svc in $prismaServices) {
    Write-Host "  $svc..." -ForegroundColor Gray
    Set-Location "$root\services\$svc"
    npx prisma generate 2>$null
}

# Step 4: Push schemas to database (requires running PostgreSQL)
Write-Host "`n[4/6] Pushing Prisma schemas to database..." -ForegroundColor Yellow
Write-Host "  (Requires PostgreSQL running on localhost:5432)" -ForegroundColor Gray
foreach ($svc in $prismaServices) {
    Write-Host "  $svc..." -ForegroundColor Gray
    Set-Location "$root\services\$svc"
    npx prisma db push --accept-data-loss 2>$null
}

# Step 5: Import CSV seed data
Write-Host "`n[5/6] Importing CSV seed data..." -ForegroundColor Yellow
Set-Location $root
npx tsx scripts/import-csv.ts 2>$null

# Step 6: Seed databases
Write-Host "`n[6/6] Seeding databases..." -ForegroundColor Yellow
foreach ($svc in $prismaServices) {
    Write-Host "  $svc..." -ForegroundColor Gray
    Set-Location "$root\services\$svc"
    npm run seed 2>$null
}

Set-Location $root
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  Setup complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nTo start all services with Docker:" -ForegroundColor Cyan
Write-Host "  docker compose up -d" -ForegroundColor White
Write-Host "`nOr start services individually:" -ForegroundColor Cyan
Write-Host "  cd services/api-gateway && npm run dev" -ForegroundColor White
Write-Host "  cd services/auth-service && npm run dev" -ForegroundColor White
Write-Host "  etc." -ForegroundColor White
Write-Host "`nFrontend:" -ForegroundColor Cyan
Write-Host "  cd frontend && npm run dev" -ForegroundColor White
