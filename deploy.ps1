param(
    [string]$ProjectName = "amazemend",
    [string]$Branch = "main",
    [string]$DownloadUrl = "",
    [switch]$SkipPlaceholderCheck,
    [switch]$SkipDeploy
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Find-Npx {
    $fromPath = Get-Command npx.cmd -ErrorAction SilentlyContinue
    if ($fromPath) { return $fromPath.Source }

    $localNpx = Join-Path $env:LOCALAPPDATA "Programs\nodejs-v24.19.0\npx.cmd"
    if (Test-Path $localNpx) { return $localNpx }

    throw "npx.cmd was not found. Install Node.js/npm first."
}

function Set-ConfigDownloadUrl {
    param([string]$Url)

    if (-not $Url) { return }

    $configPath = Join-Path $Root "assets\js\config.js"
    $content = Get-Content -Raw $configPath
    $escaped = $Url.Replace("\", "\\").Replace('"', '\"')
    $content = $content -replace 'downloadUrl:\s*"[^"]*"', "downloadUrl: `"$escaped`""
    Set-Content -Path $configPath -Value $content -Encoding UTF8
    Write-Host "Updated downloadUrl in assets/js/config.js"
}

function Assert-NoPlaceholders {
    if ($SkipPlaceholderCheck) { return }

    $configPath = Join-Path $Root "assets\js\config.js"
    $content = Get-Content -Raw $configPath
    if ($content -match "replace-with-") {
        throw "assets/js/config.js still contains replace-with-* placeholders. Fill Paddle settings first, or pass -SkipPlaceholderCheck."
    }
}

$npx = Find-Npx

Push-Location $Root
try {
    Set-ConfigDownloadUrl $DownloadUrl
    Assert-NoPlaceholders

    if (-not $SkipDeploy) {
        Write-Host "Deploying Website to Cloudflare Pages project '$ProjectName'..."
        & $npx wrangler pages deploy . --project-name $ProjectName --branch $Branch
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    }

    Write-Host ""
    Write-Host "Website deployment script finished."
}
finally {
    Pop-Location
}
