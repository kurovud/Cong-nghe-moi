<#
Run-All PowerShell orchestrator
Usage: From repo root run: `powershell -ExecutionPolicy Bypass -File run-all.ps1`
This script will:
  - build `common`
  - push Prisma schemas for services that use Prisma
  - run seed scripts where available
  - build and start Docker Compose
  - start the frontend dev server in a new terminal window
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Run-All root: $ROOT"

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error 'Docker not found. Install Docker Desktop.'
    exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error 'npm not found. Install Node.js.'
    exit 1
}

Push-Location $ROOT

Write-Host 'Starting Docker Compose (detached)...' -ForegroundColor Cyan
docker compose up -d

if (Test-Path (Join-Path $ROOT 'frontend')) {
    $frontend = Join-Path $ROOT 'frontend'
    if (-not (Test-Path (Join-Path $frontend '.env.local'))) {
        Set-Content -Path (Join-Path $frontend '.env.local') -Value "NEXT_PUBLIC_API_URL=http://localhost:4000" -Encoding UTF8
        Write-Host 'Created frontend/.env.local' -ForegroundColor Green
    } else {
        Write-Host 'frontend/.env.local exists — not modifying.' -ForegroundColor Gray
    }
    Write-Host 'Installing frontend dependencies...' -ForegroundColor Cyan
    Push-Location $frontend
    npm install
    Pop-Location
    Start-Process -FilePath 'powershell' -ArgumentList '-NoExit','-Command',"cd `"$frontend`"; npm run dev"
    Write-Host 'Frontend started in a new window.' -ForegroundColor Green
} else {
    Write-Host 'No frontend folder present — skipping frontend start.' -ForegroundColor Yellow
}

Write-Host 'Run-All finished. Check http://localhost:4000/health and http://localhost:3000' -ForegroundColor Cyan

Pop-Location
