# Descarga Poppins + Dancing Script (subconjunto latin) y genera public/fonts/fonts.css
# para tener las fuentes LOCALES (la UI se ve igual sin internet).
$ErrorActionPreference = "Stop"
$ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
$cssUrl = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Dancing+Script:wght@600;700&display=swap"
$outDir = Join-Path (Get-Location) "public\fonts"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$css = (Invoke-WebRequest -Uri $cssUrl -UserAgent $ua -UseBasicParsing -TimeoutSec 30).Content
$rx = [regex]::new("/\*\s*([\w-]+)\s*\*/\s*@font-face\s*\{(.*?)\}", "Singleline")
$out = "/* Fuentes locales CariHub - generado por scripts/descargar-fuentes.ps1 */`n"
$seen = @{}

foreach ($m in $rx.Matches($css)) {
  $subset = $m.Groups[1].Value
  if ($subset -ne "latin" -and $subset -ne "latin-ext") { continue }
  $body = $m.Groups[2].Value
  $fam = [regex]::Match($body, "font-family:\s*'([^']+)'").Groups[1].Value
  $weight = [regex]::Match($body, "font-weight:\s*(\d+)").Groups[1].Value
  $style = [regex]::Match($body, "font-style:\s*(\w+)").Groups[1].Value
  $range = [regex]::Match($body, "unicode-range:\s*([^;]+);").Groups[1].Value
  $url = [regex]::Match($body, "url\(([^)]+)\)\s*format\('woff2'\)").Groups[1].Value
  if (-not $fam -or -not $url) { continue }
  $file = ("{0}-{1}-{2}-{3}.woff2" -f ($fam -replace '\s',''), $weight, $style, $subset)
  if (-not $seen.ContainsKey($url)) {
    $seen[$url] = $file
    Invoke-WebRequest -Uri $url -UserAgent $ua -UseBasicParsing -TimeoutSec 30 -OutFile (Join-Path $outDir $file)
    Write-Output ("OK " + $file)
  }
  $out += "@font-face{font-family:'$fam';font-style:$style;font-weight:$weight;font-display:swap;src:url('$($seen[$url])') format('woff2');unicode-range:$range;}`n"
}
Set-Content -Path (Join-Path $outDir "fonts.css") -Value $out -Encoding UTF8
Write-Output "CSS -> public/fonts/fonts.css"
