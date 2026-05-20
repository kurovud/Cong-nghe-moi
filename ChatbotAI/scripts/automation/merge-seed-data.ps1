#!/usr/bin/env powershell
<#
.SYNOPSIS
Merge seed-data additions into main seed files (faq.json, knowledge.json)
.DESCRIPTION
Combines FAQ additions and knowledge additions with existing seed data
#>

$ROOT = $PSScriptRoot
$SEED_DIR = "$ROOT\scripts\seed-data"

Write-Host "Merging seed-data additions..." -ForegroundColor Cyan
Write-Host ""

# 1. Merge FAQ
Write-Host "1) Merging FAQ..." -ForegroundColor Yellow
$faq_main = Get-Content "$SEED_DIR\faq.json" | ConvertFrom-Json
$faq_add = Get-Content "$SEED_DIR\faq-additions.json" | ConvertFrom-Json

$faq_merged = @($faq_main) + @($faq_add)
Write-Host "   Original FAQ: $($faq_main.Count) entries"
Write-Host "   Additions: $($faq_add.Count) entries"
Write-Host "   Merged total: $($faq_merged.Count) entries"

$faq_merged | ConvertTo-Json -Depth 10 | Out-File "$SEED_DIR\faq.json" -Encoding UTF8
Write-Host "   ✅ Merged to faq.json" -ForegroundColor Green
Write-Host ""

# 2. Merge Knowledge
Write-Host "2) Merging Knowledge Base..." -ForegroundColor Yellow
$kb_main = Get-Content "$SEED_DIR\knowledge.json" | ConvertFrom-Json
$kb_add = Get-Content "$SEED_DIR\knowledge-additions.json" | ConvertFrom-Json

$kb_merged = @($kb_main) + @($kb_add)
Write-Host "   Original KB: $($kb_main.Count) entries"
Write-Host "   Additions: $($kb_add.Count) entries"
Write-Host "   Merged total: $($kb_merged.Count) entries"

$kb_merged | ConvertTo-Json -Depth 10 | Out-File "$SEED_DIR\knowledge.json" -Encoding UTF8
Write-Host "   ✅ Merged to knowledge.json" -ForegroundColor Green
Write-Host ""

# 3. Cleanup (optional - remove temp files)
Write-Host "3) Cleanup..." -ForegroundColor Yellow
Remove-Item "$SEED_DIR\faq-additions.json" -Force
Remove-Item "$SEED_DIR\knowledge-additions.json" -Force
Write-Host "   ✅ Removed temporary files" -ForegroundColor Green
Write-Host ""

# 4. Summary
Write-Host "✅ Seed-data merge complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  FAQ: $($faq_merged.Count) total entries (added $($faq_add.Count))"
Write-Host "  Knowledge: $($kb_merged.Count) total entries (added $($kb_add.Count))"
Write-Host ""
Write-Host "Next: Run seed scripts to populate database" -ForegroundColor Gray
Write-Host "  cd services/auth-service && npm run seed" -ForegroundColor Gray
Write-Host "  cd ../paper-service && npm run seed" -ForegroundColor Gray
Write-Host "  cd ../review-service && npm run seed" -ForegroundColor Gray
