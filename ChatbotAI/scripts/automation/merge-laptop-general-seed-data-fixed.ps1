#!/usr/bin/env pwsh

# Merge Laptop/General Scenario Additions
# Purpose: Merge laptop-general-qa-additions.json into production files

param(
    [switch]$DryRun = $false,
    [switch]$Verify
)

if (-not $Verify) { $Verify = $true }

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

# Paths
$scriptRoot = $PSScriptRoot
if ([string]::IsNullOrEmpty($scriptRoot)) {
    $scriptRoot = (Get-Location).Path
}
$seedDataPath = Join-Path -Path $scriptRoot -ChildPath "scripts\seed-data"
$qaAdditionsPath = Join-Path -Path $seedDataPath -ChildPath "laptop-general-qa-additions.json"
$faqAdditionsPath = Join-Path -Path $seedDataPath -ChildPath "laptop-general-faq-additions.json"
$kbAdditionsPath = Join-Path -Path $seedDataPath -ChildPath "laptop-general-knowledge-additions.json"
$faqPath = Join-Path -Path $seedDataPath -ChildPath "faq.json"
$knowledgePath = Join-Path -Path $seedDataPath -ChildPath "knowledge.json"

Write-Host ""
Write-Host "========================================"
Write-Host "LAPTOP/GENERAL EXPANSION MERGE"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ================================================
# PART 1: Display Q&A Info
# ================================================
Write-Host "[1/3] Q&A Dataset" -ForegroundColor Yellow

if (Test-Path $qaAdditionsPath) {
    try {
        $qaAdditions = Get-Content $qaAdditionsPath -Raw | ConvertFrom-Json
        $qaCount = @($qaAdditions).Count
        
        Write-Host "Found $qaCount Q&A records from laptop-general-qa-additions.json" -ForegroundColor Green
        Write-Host "Note: Q&A entries should be imported into qa-dataset.ts"
        
        # Display sample entries
        Write-Host ""
        Write-Host "Sample entries:" -ForegroundColor Gray
        $qaAdditions[0..2] | ForEach-Object {
            Write-Host "  - $($_.id): $($_.questions[0])" -ForegroundColor Gray
        }
    }
    catch {
        Write-Host "Error loading Q&A additions: $_" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "No Q&A additions found" -ForegroundColor Yellow
}

# ================================================
# PART 2: Merge FAQ additions into faq.json
# ================================================
Write-Host ""
Write-Host "[2/3] FAQ Merge" -ForegroundColor Yellow

if (Test-Path $faqAdditionsPath) {
    try {
        # Read existing FAQ
        $existingFaq = Get-Content $faqPath -Raw | ConvertFrom-Json
        $existingCount = @($existingFaq).Count
        Write-Host "Loaded $existingCount existing FAQ entries" -ForegroundColor Green
        
        # Read additions
        $faqAdditions = Get-Content $faqAdditionsPath -Raw | ConvertFrom-Json
        $additionsCount = @($faqAdditions).Count
        Write-Host "Loaded $additionsCount new FAQ entries" -ForegroundColor Green
        
        # Merge
        $mergedFaq = @($existingFaq) + @($faqAdditions)
        $mergedCount = @($mergedFaq).Count
        
        if (-not $DryRun) {
            $mergedFaq | ConvertTo-Json -Depth 10 | Set-Content $faqPath
            Write-Host "Merged FAQ: $existingCount + $additionsCount = $mergedCount total" -ForegroundColor Green
        }
        else {
            Write-Host "[DRY RUN] Would merge: $existingCount + $additionsCount = $mergedCount total" -ForegroundColor Yellow
        }
        
        # Display sample
        Write-Host ""
        Write-Host "Sample new entries:" -ForegroundColor Gray
        $faqAdditions[0..2] | ForEach-Object {
            $q = $_.question.Substring(0, [Math]::Min(50, $_.question.Length))
            Write-Host "  - $($_.id): $q..." -ForegroundColor Gray
        }
    }
    catch {
        Write-Host "Error processing FAQ: $_" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "No FAQ additions found" -ForegroundColor Yellow
}

# ================================================
# PART 3: Merge Knowledge additions into knowledge.json
# ================================================
Write-Host ""
Write-Host "[3/3] Knowledge Base Merge" -ForegroundColor Yellow

if (Test-Path $kbAdditionsPath) {
    try {
        # Read existing KB
        $existingKb = Get-Content $knowledgePath -Raw | ConvertFrom-Json
        $existingKbCount = @($existingKb).Count
        Write-Host "Loaded $existingKbCount existing KB entries" -ForegroundColor Green
        
        # Read additions
        $kbAdditions = Get-Content $kbAdditionsPath -Raw | ConvertFrom-Json
        $kbAdditionsCount = @($kbAdditions).Count
        Write-Host "Loaded $kbAdditionsCount new KB entries" -ForegroundColor Green
        
        # Merge
        $mergedKb = @($existingKb) + @($kbAdditions)
        $mergedKbCount = @($mergedKb).Count
        
        if (-not $DryRun) {
            $mergedKb | ConvertTo-Json -Depth 10 | Set-Content $knowledgePath
            Write-Host "Merged Knowledge: $existingKbCount + $kbAdditionsCount = $mergedKbCount total" -ForegroundColor Green
        }
        else {
            Write-Host "[DRY RUN] Would merge: $existingKbCount + $kbAdditionsCount = $mergedKbCount total" -ForegroundColor Yellow
        }
        
        # Display sample
        Write-Host ""
        Write-Host "Sample new entries:" -ForegroundColor Gray
        $kbAdditions | ForEach-Object {
            $t = $_.title.Substring(0, [Math]::Min(50, $_.title.Length))
            Write-Host "  - $($_.id): $t..." -ForegroundColor Gray
        }
    }
    catch {
        Write-Host "Error processing Knowledge: $_" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "No Knowledge additions found" -ForegroundColor Yellow
}

# ================================================
# VERIFICATION
# ================================================
if ($Verify) {
    Write-Host ""
    Write-Host "========================================"
    Write-Host "VERIFICATION"
    Write-Host "========================================" -ForegroundColor Cyan
    
    try {
        $faqFinal = Get-Content $faqPath -Raw | ConvertFrom-Json
        $faqFinalCount = @($faqFinal).Count
        Write-Host "FAQ Final: $faqFinalCount entries" -ForegroundColor Green
        
        $kbFinal = Get-Content $knowledgePath -Raw | ConvertFrom-Json
        $kbFinalCount = @($kbFinal).Count
        Write-Host "Knowledge Final: $kbFinalCount entries" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "Total new entries added: $($additionsCount + $kbAdditionsCount + $qaCount)" -ForegroundColor Green
        Write-Host "  Q&A: $qaCount (for manual integration)" -ForegroundColor Gray
        Write-Host "  FAQ: $additionsCount (auto-merged)" -ForegroundColor Gray
        Write-Host "  KB: $kbAdditionsCount (auto-merged)" -ForegroundColor Gray
    }
    catch {
        Write-Host "Verification error: $_" -ForegroundColor Red
    }
}

# ================================================
# SUMMARY
# ================================================
Write-Host ""
Write-Host "========================================"
Write-Host "SUMMARY"
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Merge Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Additions:"
Write-Host "  * Q&A Dataset: $qaCount entries (manual merge recommended)"
Write-Host "  * FAQ: $additionsCount entries merged"
Write-Host "  * Knowledge: $kbAdditionsCount entries merged"
Write-Host ""
Write-Host "Next Steps:"
Write-Host "  1. Verify merged files are valid"
Write-Host "  2. Re-run seed scripts: npm run seed:all"
Write-Host "  3. Test chatbot: npm run test:chat"
Write-Host ""
