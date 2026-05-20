#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Q&A Chatbot System Quick Test Script
.DESCRIPTION
    Tests all 6 intent types of the Q&A chatbot system
.EXAMPLE
    .\test-chatbot.ps1
#>

# Configuration
$API_URL = "http://localhost:4000"
$TESTS = @(
    @{
        Name = "Greeting"
        Message = "xin chào"
        SessionId = "test-greeting-$(Get-Random)"
        ExpectedIntent = "greeting"
        ExpectedAgent = "advisor"
    },
    @{
        Name = "CPU Comparison"
        Message = "intel hay amd tốt hơn cho gaming?"
        SessionId = "test-compare-$(Get-Random)"
        ExpectedIntent = "compare"
        ExpectedAgent = "compare"
    },
    @{
        Name = "PC Build"
        Message = "build pc 12 triệu"
        SessionId = "test-build-$(Get-Random)"
        ExpectedIntent = "build"
        ExpectedAgent = "build"
    },
    @{
        Name = "Support"
        Message = "bảo hành bao lâu?"
        SessionId = "test-support-$(Get-Random)"
        ExpectedIntent = "support"
        ExpectedAgent = "support"
    },
    @{
        Name = "Recommendation"
        Message = "nên upgrade cpu hay gpu?"
        SessionId = "test-recommendation-$(Get-Random)"
        ExpectedIntent = "recommendation"
        ExpectedAgent = "advisor"
    },
    @{
        Name = "General Knowledge"
        Message = "ddr4 hay ddr5 nên chọn?"
        SessionId = "test-general-$(Get-Random)"
        ExpectedIntent = "general"
        ExpectedAgent = "advisor"
    }
)

# Colors for output
function Write-Header($text) {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║ $text".PadRight(62) + "║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
}

function Write-TestStart($text) {
    Write-Host ""
    Write-Host "🧪 $text" -ForegroundColor Yellow
    Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor Gray
}

function Write-Success($text) {
    Write-Host "✅ $text" -ForegroundColor Green
}

function Write-Error($text) {
    Write-Host "❌ $text" -ForegroundColor Red
}

function Write-Info($text) {
    Write-Host "ℹ️  $text" -ForegroundColor Blue
}

# Main script
Write-Header "Q&A CHATBOT SYSTEM TEST SCRIPT"

Write-Info "API URL: $API_URL"
Write-Info "Testing $(($TESTS).Count) intent types..."

# Test 1: Health Check
Write-TestStart "1️⃣  Health Check"
try {
    $health = Invoke-RestMethod -Uri "$API_URL/health" -Method GET -ErrorAction Stop
    Write-Success "API Gateway is healthy"
    Write-Info "Status: $($health.status)"
}
catch {
    Write-Error "Health check failed: $_"
    Write-Error "Make sure Docker services are running: docker compose up -d"
    exit 1
}

# Test 2-7: Chat Endpoints
$passCount = 0
$failCount = 0

foreach ($i in 0..($TESTS.Count - 1)) {
    $test = $TESTS[$i]
    $testNum = $i + 2
    
    Write-TestStart "$($testNum)️⃣  $($test.Name)"
    Write-Info "Message: ""$($test.Message)"""
    Write-Info "Expected: intent=$($test.ExpectedIntent), agent=$($test.ExpectedAgent)"
    
    try {
        # Prepare request
        $body = @{
            message = $test.Message
            sessionId = $test.SessionId
        } | ConvertTo-Json
        
        # Send request and measure time
        $start = Get-Date
        $response = Invoke-RestMethod -Uri "$API_URL/api/chat" `
            -Method POST `
            -Headers @{"Content-Type" = "application/json"} `
            -Body $body `
            -ErrorAction Stop
        $duration = (Get-Date) - $start
        
        # Check response
        if ($response.success) {
            $data = $response.data
            $intent = $data.intent
            $agent = $data.agent
            
            # Verify intent and agent
            $intentMatch = $intent -eq $test.ExpectedIntent
            $agentMatch = $agent -eq $test.ExpectedAgent
            
            if ($intentMatch -and $agentMatch) {
                Write-Success "Intent and agent matched!"
                Write-Info "Actual: intent=$intent, agent=$agent"
                Write-Info "Response Time: $($duration.TotalMilliseconds)ms"
                Write-Info "Products: $($data.products.Count)"
                Write-Info "Sources: $($data.sources.Count)"
                
                # Check performance
                if ($duration.TotalMilliseconds -lt 100) {
                    Write-Success "Performance: < 100ms ✨"
                }
                else {
                    Write-Info "Performance: $($duration.TotalMilliseconds)ms (acceptable)"
                }
                
                $passCount++
            }
            else {
                Write-Error "Intent/Agent mismatch!"
                Write-Error "Expected: $($test.ExpectedIntent)/$($test.ExpectedAgent)"
                Write-Error "Actual: $intent/$agent"
                $failCount++
            }
        }
        else {
            Write-Error "Request failed: $($response.message)"
            $failCount++
        }
    }
    catch {
        Write-Error "Request failed: $_"
        Write-Info "Make sure chat service is running: docker compose up -d chat-service"
        $failCount++
    }
}

# Test 8: Chat History
Write-TestStart "8️⃣  Chat History Retrieval"
try {
    $sessionId = $TESTS[0].SessionId
    Write-Info "Retrieving history for session: $sessionId"
    
    $history = Invoke-RestMethod -Uri "$API_URL/api/chat/history/$sessionId" `
        -Method GET `
        -ErrorAction Stop
    
    if ($history -is [System.Array]) {
        Write-Success "History retrieved successfully"
        Write-Info "Messages in history: $($history.Count)"
        $passCount++
    }
    else {
        Write-Info "No history found (normal for first test)"
        $passCount++
    }
}
catch {
    Write-Error "History retrieval failed: $_"
    $failCount++
}

# Test 9: Analytics
Write-TestStart "9️⃣  Analytics"
try {
    $analytics = Invoke-RestMethod -Uri "$API_URL/api/chat/analytics" `
        -Method GET `
        -ErrorAction Stop
    
    if ($analytics.success) {
        $data = $analytics.data
        Write-Success "Analytics retrieved successfully"
        Write-Info "Intents tracked: $($data.intents.Count)"
        Write-Info "Agents tracked: $($data.agents.Count)"
        if ($data.intents.Count -gt 0) {
            Write-Info "Top intent: $($data.intents[0].intent) ($($data.intents[0].count) queries)"
        }
        $passCount++
    }
    else {
        Write-Error "Analytics retrieval failed"
        $failCount++
    }
}
catch {
    Write-Error "Analytics request failed: $_"
    $failCount++
}

# Summary
Write-Header "TEST SUMMARY"
Write-Host ""
Write-Host "Total Tests: $($passCount + $failCount)" -ForegroundColor Cyan
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })
Write-Host ""

if ($failCount -eq 0) {
    Write-Success "All tests PASSED! ✨"
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Review response quality in the API responses above"
    Write-Host "  2. Check CHATBOT_QUICK_START.md for more comprehensive tests"
    Write-Host "  3. Run full smoke test: .\scripts\smoke-test.ps1"
    exit 0
}
else {
    Write-Error "Some tests FAILED! ❌"
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  1. Check Docker status: docker compose ps"
    Write-Host "  2. Review service logs: docker compose logs chat-service"
    Write-Host "  3. Check API Gateway: curl http://localhost:4000/health"
    Write-Host "  4. See CHATBOT_QUICK_START.md for detailed troubleshooting"
    exit 1
}
