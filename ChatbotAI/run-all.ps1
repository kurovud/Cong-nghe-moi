<#
.SYNOPSIS
    Startup script for the entire AI Chatbot project
    
.DESCRIPTION
    Orchestrates Docker Compose startup and frontend development server
    Handles database initialization, seed data loading, and service startup
    
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File run-all.ps1
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Get actual project root (where this script is)
$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path

# Verify prerequisites
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "❌ Docker not found. Install Docker Desktop."
    exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "❌ npm not found. Install Node.js 20+."
    exit 1
}

Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🚀 AI CHATBOT - Full Stack Startup" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

Write-Host "📁 Project root: $ROOT" -ForegroundColor Gray

# Change to project root
Push-Location $ROOT

try {
    # Step 1: Start Docker Compose
    Write-Host "`n📦 Step 1: Starting Docker Stack..." -ForegroundColor Yellow
    Write-Host "   This includes: PostgreSQL, Redis, API Gateway, Chat Service, and other microservices" -ForegroundColor Gray
    
    docker compose up -d --remove-orphans
    
    Write-Host "✅ Docker stack started (detached)" -ForegroundColor Green
    Write-Host "⏳ Waiting 15 seconds for services to stabilize..." -ForegroundColor Gray
    Start-Sleep -Seconds 15
    
    # Step 2: Check services health
    Write-Host "`n🔍 Step 2: Verifying services..." -ForegroundColor Yellow
    
    $services = @("postgres", "redis", "api-gateway", "chat-service")
    $healthy = 0
    foreach ($svc in $services) {
        $status = docker compose ps $svc --format "{{.State}}" 2>$null
        if ($status -like "*Up*" -or $status -like "*running*") {
            Write-Host "   ✓ $svc : Running" -ForegroundColor Green
            $healthy++
        } else {
            Write-Host "   ⚠ $svc : Not ready (may still be starting)" -ForegroundColor Yellow
        }
    }
    
    # Step 3: Setup frontend
    Write-Host "`n⚛️  Step 3: Preparing Next.js Frontend..." -ForegroundColor Yellow
    
    $frontendPath = Join-Path $ROOT "frontend"
    if (Test-Path $frontendPath) {
        $envPath = Join-Path $frontendPath ".env.local"
        if (-not (Test-Path $envPath)) {
            Set-Content -Path $envPath -Value "NEXT_PUBLIC_API_URL=http://localhost:4000" -Encoding UTF8
            Write-Host "   ✓ Created .env.local" -ForegroundColor Green
        } else {
            Write-Host "   ✓ .env.local already exists" -ForegroundColor Gray
        }
    }
    
    # Step 4: Start frontend dev server
    Write-Host "`n🎨 Step 4: Starting Frontend Dev Server..." -ForegroundColor Yellow
    Write-Host "   Next.js will start on: http://localhost:3000" -ForegroundColor Gray
    Write-Host "   API Gateway: http://localhost:4000" -ForegroundColor Gray
    
    Write-Host "`n✨ All systems starting up..." -ForegroundColor Green
    
    Push-Location $frontendPath
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm.cmd run dev"
    Pop-Location
    
    Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "✅ STARTUP COMPLETE" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    
    Write-Host @"
    
🌐 Access the application:
   Frontend UI:  http://localhost:3000
   API Gateway:  http://localhost:4000
   Chat API:     http://localhost:4007

📊 Docker Services Status:
   $ docker compose ps

📝 View Logs:
   $ docker compose logs -f chat-service
   $ docker compose logs -f api-gateway

🧪 Quick Test:
   $ pwsh -File scripts/automation/quick-test.ps1

📚 Documentation:
   ./docs/QUICK_START.md
   ./docs/PRODUCTION_READY.md
   ./PROJECT_STRUCTURE.md

🛑 Stop Everything:
   $ docker compose down
   (Ctrl+C in frontend terminal)
   
"@ -ForegroundColor Cyan
    
} finally {
    Pop-Location
}
