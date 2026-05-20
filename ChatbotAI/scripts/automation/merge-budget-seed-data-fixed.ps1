#!/usr/bin/env powershell
<#
.SYNOPSIS
Merge budget-related Q&A, FAQ, and knowledge entries into main seed files
.DESCRIPTION
Combines budget-focused additions with existing seed data
#>

$ROOT = $PSScriptRoot
$SEED_DIR = "$ROOT\scripts\seed-data"

Write-Host "Merging budget-related seed-data..." -ForegroundColor Cyan
Write-Host ""

# 1. Merge Budget FAQ
Write-Host "1) Merging Budget FAQ..." -ForegroundColor Yellow
$faq_main = Get-Content "$SEED_DIR\faq.json" | ConvertFrom-Json
$budget_faq = Get-Content "$SEED_DIR\budget-faq-additions.json" | ConvertFrom-Json

$faq_merged = @($faq_main) + @($budget_faq)
Write-Host "   Original FAQ: $($faq_main.Count) entries"
Write-Host "   Budget FAQ additions: $($budget_faq.Count) entries"
Write-Host "   Merged total: $($faq_merged.Count) entries"

$faq_merged | ConvertTo-Json -Depth 10 | Out-File "$SEED_DIR\faq.json" -Encoding UTF8
Write-Host "   OK - Merged to faq.json" -ForegroundColor Green
Write-Host ""

# 2. Merge Budget Knowledge
Write-Host "2) Merging Budget Knowledge Base..." -ForegroundColor Yellow
$kb_main = Get-Content "$SEED_DIR\knowledge.json" | ConvertFrom-Json
$budget_kb = Get-Content "$SEED_DIR\budget-knowledge-additions.json" | ConvertFrom-Json

$kb_merged = @($kb_main) + @($budget_kb)
Write-Host "   Original KB: $($kb_main.Count) entries"
Write-Host "   Budget KB additions: $($budget_kb.Count) entries"
Write-Host "   Merged total: $($kb_merged.Count) entries"

$kb_merged | ConvertTo-Json -Depth 10 | Out-File "$SEED_DIR\knowledge.json" -Encoding UTF8
Write-Host "   OK - Merged to knowledge.json" -ForegroundColor Green
Write-Host ""

# 3. Cleanup temporary files
Write-Host "3) Cleanup..." -ForegroundColor Yellow
Remove-Item "$SEED_DIR\budget-faq-additions.json" -Force
Remove-Item "$SEED_DIR\budget-knowledge-additions.json" -Force
Remove-Item "$SEED_DIR\budget-qa-additions.json" -Force
Write-Host "   OK - Removed temporary files" -ForegroundColor Green
Write-Host ""

# 4. Summary
Write-Host "Budget seed-data merge complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  FAQ: $($faq_merged.Count) total entries"
Write-Host "  Knowledge: $($kb_merged.Count) total entries"
Write-Host ""
Write-Host "New Q&A Categories:" -ForegroundColor Yellow
Write-Host "  - Budget and Pricing recommendations"
Write-Host "  - CPU vs GPU allocation strategy"
Write-Host "  - Budget tiers (5T to 25T+)"
Write-Host "  - Timing and sales strategy"
Write-Host "  - Upgrade paths and planning"
Write-Host "  - Component deals and best value"
Write-Host "  - Used vs new comparison"
Write-Host "  - Prebuilt vs custom PC analysis"
Write-Host "  - Price history and trends"
Write-Host "  - Cost of ownership analysis"
Write-Host ""
Write-Host "Next steps: Run seed scripts to populate database"
