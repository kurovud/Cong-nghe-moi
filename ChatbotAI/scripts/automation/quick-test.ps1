#!/usr/bin/env powershell
# Simple Q&A Chatbot Test

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Q&A CHATBOT SYSTEM - RUNNING TESTS" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health
Write-Host "Test 1: API Health Check..." -ForegroundColor Yellow
try {
    $resp = Invoke-WebRequest -Uri "http://localhost:4000/health" -UseBasicParsing
    Write-Host "Status: $($resp.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($resp.Content)" -ForegroundColor Gray
}
catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Test 2: Chat - Greeting..." -ForegroundColor Yellow
try {
    $body = '{"message":"xin chao","sessionId":"test1"}' 
    $resp = Invoke-WebRequest -Uri "http://localhost:4000/api/chat" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
    $data = $resp.Content | ConvertFrom-Json
    Write-Host "Status: $($resp.StatusCode)" -ForegroundColor Green
    Write-Host "Intent: $($data.data.intent)" -ForegroundColor Cyan
    Write-Host "Agent: $($data.data.agent)" -ForegroundColor Cyan
    Write-Host "Message (first 60 chars): $($data.data.message.Substring(0,[Math]::Min(60,$data.data.message.Length)))..." -ForegroundColor Gray
}
catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Test 3: Chat - Build PC..." -ForegroundColor Yellow
try {
    $body = '{"message":"build pc 12 trieu","sessionId":"test2"}'
    $resp = Invoke-WebRequest -Uri "http://localhost:4000/api/chat" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
    $data = $resp.Content | ConvertFrom-Json
    Write-Host "Status: $($resp.StatusCode)" -ForegroundColor Green
    Write-Host "Intent: $($data.data.intent)" -ForegroundColor Cyan
    Write-Host "Agent: $($data.data.agent)" -ForegroundColor Cyan
    Write-Host "Products: $($data.data.products.Count)" -ForegroundColor Cyan
}
catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Test 4: Chat - Support..." -ForegroundColor Yellow
try {
    $body = '{"message":"bao hanh bao lau?","sessionId":"test3"}'
    $resp = Invoke-WebRequest -Uri "http://localhost:4000/api/chat" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
    $data = $resp.Content | ConvertFrom-Json
    Write-Host "Status: $($resp.StatusCode)" -ForegroundColor Green
    Write-Host "Intent: $($data.data.intent)" -ForegroundColor Cyan
    Write-Host "Agent: $($data.data.agent)" -ForegroundColor Cyan
}
catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ TESTS COMPLETE!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  • Check logs: docker compose logs -f chat-service" -ForegroundColor Gray
Write-Host "  • Read guide: cat GETTING_STARTED.md" -ForegroundColor Gray
Write-Host "  • Full test: .\scripts\smoke-test.ps1" -ForegroundColor Gray
Write-Host ""
