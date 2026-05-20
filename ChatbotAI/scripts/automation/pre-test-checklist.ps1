#!/usr/bin/env powershell
<#
.SYNOPSIS
    Quick Pre-Testing Checklist
.DESCRIPTION
    Verify all files are in place before testing
#>

Write-Host "
╔═══════════════════════════════════════════════════════════════╗
║          PRE-TESTING CHECKLIST - Quick Verification          ║
╚═══════════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

$projectRoot = "d:\KLTN\ChatbotAI\ChatbotAI"
$passed = 0
$failed = 0

function Check-File($path, $description) {
    if (Test-Path $path) {
        Write-Host "✅ $description" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ $description (MISSING: $path)" -ForegroundColor Red
        return $false
    }
}

Write-Host ""
Write-Host "Checking Q&A System Files..." -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────────────────" -ForegroundColor Gray

$files = @(
    @{ Path = "$projectRoot/services/scheduler-service/src/data/qa-dataset.ts"; Desc = "Q&A Dataset (26+ records)" },
    @{ Path = "$projectRoot/services/scheduler-service/src/services/chatbot.service.ts"; Desc = "Chatbot Service" },
    @{ Path = "$projectRoot/services/scheduler-service/src/data/qa-coverage-map.ts"; Desc = "Coverage Map (20+ tests)" },
    @{ Path = "$projectRoot/services/scheduler-service/README_QA_SYSTEM.md"; Desc = "Technical Documentation" },
)

foreach ($file in $files) {
    if (Check-File $file.Path $file.Desc) {
        $passed++
    } else {
        $failed++
    }
}

Write-Host ""
Write-Host "Checking Documentation Files..." -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────────────────" -ForegroundColor Gray

$docs = @(
    @{ Path = "$projectRoot/GETTING_STARTED.md"; Desc = "Getting Started Guide" },
    @{ Path = "$projectRoot/CHATBOT_QUICK_START.md"; Desc = "Testing Guide" },
    @{ Path = "$projectRoot/SETUP_VERIFICATION.md"; Desc = "Verification Checklist" },
    @{ Path = "$projectRoot/CHATBOT_TRANSFORMATION_SUMMARY.md"; Desc = "Transformation Summary" },
    @{ Path = "$projectRoot/IMPLEMENTATION_COMPLETE.md"; Desc = "Implementation Summary" },
    @{ Path = "$projectRoot/PROJECT_UPDATE_SUMMARY.md"; Desc = "Project Update Summary" },
)

foreach ($doc in $docs) {
    if (Check-File $doc.Path $doc.Desc) {
        $passed++
    } else {
        $failed++
    }
}

Write-Host ""
Write-Host "Checking Test Scripts..." -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────────────────" -ForegroundColor Gray

$scripts = @(
    @{ Path = "$projectRoot/test-chatbot.ps1"; Desc = "Chatbot Test Script" },
    @{ Path = "$projectRoot/scripts/smoke-test.ps1"; Desc = "Smoke Test Script" },
)

foreach ($script in $scripts) {
    if (Check-File $script.Path $script.Desc) {
        $passed++
    } else {
        $failed++
    }
}

Write-Host ""
Write-Host "Checking Updated Files..." -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────────────────" -ForegroundColor Gray

$updated = @(
    @{ Path = "$projectRoot/README.md"; Desc = "Main README (updated)" },
    @{ Path = "$projectRoot/services/scheduler-service/package.json"; Desc = "package.json (Gemini removed)" },
    @{ Path = "$projectRoot/services/scheduler-service/src/controllers/chat.controller.ts"; Desc = "Chat Controller (updated import)" },
)

foreach ($file in $updated) {
    if (Check-File $file.Path $file.Desc) {
        $passed++
    } else {
        $failed++
    }
}

Write-Host ""
Write-Host "Checking Docker & Environment..." -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────────────────" -ForegroundColor Gray

# Check Docker
if (& { docker --version 2>&1 | Out-Null; $? }) {
    Write-Host "✅ Docker installed" -ForegroundColor Green
    $passed++
} else {
    Write-Host "❌ Docker not installed or not in PATH" -ForegroundColor Red
    $failed++
}

# Check Docker Compose
if (& { docker compose version 2>&1 | Out-Null; $? }) {
    Write-Host "✅ Docker Compose installed" -ForegroundColor Green
    $passed++
} else {
    Write-Host "❌ Docker Compose not installed" -ForegroundColor Red
    $failed++
}

# Check Node.js
$nodeVersion = & node --version 2>&1
if ($nodeVersion -match "v[0-9]+\.[0-9]+\.[0-9]+") {
    $majorVersion = [int]($nodeVersion -replace "v([0-9]+)\..*", '$1')
    if ($majorVersion -ge 20) {
        Write-Host "✅ Node.js $nodeVersion (required: ≥20)" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "❌ Node.js $nodeVersion (required: ≥20)" -ForegroundColor Red
        $failed++
    }
} else {
    Write-Host "❌ Node.js not found" -ForegroundColor Red
    $failed++
}

Write-Host ""
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "═════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Passed: $passed ✅" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })
Write-Host ""

if ($failed -eq 0) {
    Write-Host "✨ ALL CHECKS PASSED! ✨" -ForegroundColor Green
    Write-Host ""
    Write-Host "You're ready to test! Next steps:" -ForegroundColor Yellow
    Write-Host "  1. cd d:\KLTN\ChatbotAI\ChatbotAI" -ForegroundColor Gray
    Write-Host "  2. docker compose up -d" -ForegroundColor Gray
    Write-Host "  3. .\test-chatbot.ps1" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "⚠️  SOME CHECKS FAILED!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please verify:" -ForegroundColor Yellow
    Write-Host "  1. All files are present in the project" -ForegroundColor Gray
    Write-Host "  2. Docker Desktop is installed and running" -ForegroundColor Gray
    Write-Host "  3. Node.js ≥20 is installed" -ForegroundColor Gray
}

Write-Host ""
