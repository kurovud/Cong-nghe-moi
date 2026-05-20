#!/usr/bin/env powershell
# Simple test script

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     Q&A CHATBOT SYSTEM - RUNNING TESTS ✨         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "1️⃣  Testing API Gateway Health..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "http://localhost:4000/health" -Method GET -UseBasicParsing
    Write-Host "✅ API Gateway is healthy!" -ForegroundColor Green
    Write-Host "   Response: $($health.Content)" -ForegroundColor Gray
}
catch {
    Write-Host "❌ Health check failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "2️⃣  Testing Chat - Greeting..." -ForegroundColor Yellow
try {
    $body = @{
        message = "xin chào"
        sessionId = "test-greeting"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/chat" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $body `
        -UseBasicParsing
    
    $data = $response.Content | ConvertFrom-Json
    
    Write-Host "✅ Chat response received!" -ForegroundColor Green
    Write-Host "   Intent: $($data.data.intent)" -ForegroundColor Cyan
    Write-Host "   Agent: $($data.data.agent)" -ForegroundColor Cyan
    Write-Host "   Message: $($data.data.message.Substring(0, [Math]::Min(50, $data.data.message.Length)))..." -ForegroundColor Gray
}
catch {
    Write-Host "❌ Chat test failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "3️⃣  Testing Chat - CPU Comparison..." -ForegroundColor Yellow
try {
    $body = @{
        message = "intel hay amd tốt hơn cho gaming?"
        sessionId = "test-compare"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/chat" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $body `
        -UseBasicParsing
    
    $data = $response.Content | ConvertFrom-Json
    
    Write-Host "✅ Comparison test passed!" -ForegroundColor Green
    Write-Host "   Intent: $($data.data.intent)" -ForegroundColor Cyan
    Write-Host "   Agent: $($data.data.agent)" -ForegroundColor Cyan
    Write-Host "   Products returned: $($data.data.products.Count)" -ForegroundColor Cyan
}
catch {
    Write-Host "❌ Comparison test failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "4️⃣  Testing Chat - PC Build..." -ForegroundColor Yellow
try {
    $body = @{
        message = "build pc 12 triệu"
        sessionId = "test-build"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/chat" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $body `
        -UseBasicParsing
    
    $data = $response.Content | ConvertFrom-Json
    
    Write-Host "✅ Build test passed!" -ForegroundColor Green
    Write-Host "   Intent: $($data.data.intent)" -ForegroundColor Cyan
    Write-Host "   Agent: $($data.data.agent)" -ForegroundColor Cyan
    Write-Host "   Products returned: $($data.data.products.Count)" -ForegroundColor Cyan
}
catch {
    Write-Host "❌ Build test failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "5️⃣  Testing Chat - Support..." -ForegroundColor Yellow
try {
    $body = @{
        message = "bảo hành bao lâu?"
        sessionId = "test-support"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/chat" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $body `
        -UseBasicParsing
    
    $data = $response.Content | ConvertFrom-Json
    
    Write-Host "✅ Support test passed!" -ForegroundColor Green
    Write-Host "   Intent: $($data.data.intent)" -ForegroundColor Cyan
    Write-Host "   Agent: $($data.data.agent)" -ForegroundColor Cyan
}
catch {
    Write-Host "❌ Support test failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "6️⃣  Testing Chat - General Knowledge..." -ForegroundColor Yellow
try {
    $body = @{
        message = "ddr4 hay ddr5 nên chọn?"
        sessionId = "test-general"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/chat" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $body `
        -UseBasicParsing
    
    $data = $response.Content | ConvertFrom-Json
    
    Write-Host "✅ General knowledge test passed!" -ForegroundColor Green
    Write-Host "   Intent: $($data.data.intent)" -ForegroundColor Cyan
    Write-Host "   Agent: $($data.data.agent)" -ForegroundColor Cyan
}
catch {
    Write-Host "❌ General knowledge test failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "═════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "✨ TESTS COMPLETE! ✨" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Check Docker logs: docker compose logs chat-service" -ForegroundColor Gray
Write-Host "  2. Review CHATBOT_QUICK_START.md for more tests" -ForegroundColor Gray
Write-Host "  3. Run full smoke test: .\scripts\smoke-test.ps1" -ForegroundColor Gray
Write-Host ""
