$ErrorActionPreference = 'Stop'
$outFile = Join-Path $PSScriptRoot 'home-html-real-mockup-v4.html'
$transcripts = @(
    'C:\Users\ilser\.cursor\projects\c-Users-ilser-carihub\agent-transcripts\9c0ea5a1-81db-4d28-a730-3b5e297f9624\9c0ea5a1-81db-4d28-a730-3b5e297f9624.jsonl',
    'C:\Users\ilser\.cursor\projects\c-Users-ilser-carihub\agent-transcripts\67114142-a009-4ff8-a5e9-ad1766f3b690\67114142-a009-4ff8-a5e9-ad1766f3b690.jsonl'
)

$content = $null
$ops = 0

foreach ($transcript in $transcripts) {
    if (-not (Test-Path $transcript)) { continue }
    Get-Content $transcript -Encoding UTF8 | ForEach-Object {
        if ($_ -notmatch 'home-html-real-mockup-v4\.html') { return }
        try {
            $row = $_ | ConvertFrom-Json
        } catch { return }
        $msg = $row.message
        if (-not $msg) { return }
        $parts = @()
        if ($msg.content -is [string]) { $parts = @($msg.content) }
        elseif ($msg.content) { $parts = $msg.content }
        foreach ($part in $parts) {
            if ($part.type -ne 'tool_use') { continue }
            $name = $part.name
            $input = $part.input
            if (-not $input) { continue }
            $path = $input.path
            if ($path -notmatch 'home-html-real-mockup-v4\.html$') { continue }

            if ($name -eq 'Write' -and $input.contents) {
                $content = $input.contents
                $ops++
                Write-Host "WRITE from $([IO.Path]::GetFileName($transcript))"
            }
            elseif ($name -eq 'StrReplace' -and $null -ne $content) {
                $old = $input.old_string
                $new = $input.new_string
                if ([string]::IsNullOrEmpty($old)) { continue }
                if ($content.Contains($old)) {
                    if ($input.replace_all) {
                        $content = $content.Replace($old, $new)
                    } else {
                        $idx = $content.IndexOf($old)
                        $content = $content.Substring(0, $idx) + $new + $content.Substring($idx + $old.Length)
                    }
                    $ops++
                } else {
                    Write-Warning "StrReplace miss ($([IO.Path]::GetFileName($transcript))): $($old.Substring(0, [Math]::Min(80, $old.Length)))..."
                }
            }
        }
    }
}

if (-not $content) {
    Write-Error 'No content recovered'
    exit 1
}

# Backup corrupted file
$bak = $outFile + '.corrupt-bak'
if (Test-Path $outFile) { Copy-Item $outFile $bak -Force }

[System.IO.File]::WriteAllText($outFile, $content, [Text.UTF8Encoding]::new($false))
Write-Host "Recovered $outFile - $ops ops, $($content.Length) bytes"
if ($content -match 'MOCKUP v([0-9.]+)') { Write-Host "Version tag: $($Matches[0])" }
