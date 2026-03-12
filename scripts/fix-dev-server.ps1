# PowerShell script to fix dev server lock issues
# Usage: .\scripts\fix-dev-server.ps1

Write-Host "🔧 Fixing dev server lock issue..." -ForegroundColor Cyan

# Kill all Node.js processes
Write-Host "Stopping all Node.js processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Clear .next directory
Write-Host "Clearing .next directory..." -ForegroundColor Yellow
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue

# Verify
$nodeCount = (Get-Process -Name node -ErrorAction SilentlyContinue | Measure-Object).Count
if ($nodeCount -eq 0) {
    Write-Host "✅ All Node.js processes stopped" -ForegroundColor Green
} else {
    Write-Host "⚠️ Warning: $nodeCount Node.js process(es) still running" -ForegroundColor Yellow
}

if (-not (Test-Path ".next")) {
    Write-Host "✅ .next directory cleared" -ForegroundColor Green
} else {
    Write-Host "⚠️ Warning: .next directory still exists" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Ready to start dev server! Run: npm run dev" -ForegroundColor Green
