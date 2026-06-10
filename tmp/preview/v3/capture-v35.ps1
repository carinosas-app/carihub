$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$v3 = Split-Path -Parent $MyInvocation.MyCommand.Path
$cdpJson = 'C:\Users\ilser\.cursor\browser-logs\cdp-response-Page.captureScreenshot-2026-06-07T08-06-33-724Z.json'
if (-not (Test-Path $cdpJson)) { throw "Ejecutar captura CDP antes de este script" }

$json = Get-Content $cdpJson -Raw | ConvertFrom-Json
$bytes = [Convert]::FromBase64String($json.data)
$stream = New-Object IO.MemoryStream(,$bytes)
$full = [System.Drawing.Image]::FromStream($stream)
$stream.Dispose()

# CDP scale=2 → redimensionar a 521x894
$mock = New-Object System.Drawing.Bitmap(521, 894)
$g = [System.Drawing.Graphics]::FromImage($mock)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($full, 0, 0, 521, 894)
$g.Dispose()
$full.Dispose()

$mockPath = Join-Path $v3 'v35-mockup-completo.png'
$mock.Save($mockPath, [System.Drawing.Imaging.ImageFormat]::Png)

# Capturas parciales móvil
function Save-Crop($img, $y, $h, $name) {
  $crop = New-Object System.Drawing.Bitmap(521, $h)
  $gc = [System.Drawing.Graphics]::FromImage($crop)
  $gc.DrawImage($img, 0, 0, (New-Object System.Drawing.Rectangle(0, $y, 521, $h)), [System.Drawing.GraphicsUnit]::Pixel)
  $gc.Dispose()
  $crop.Save((Join-Path $v3 $name), [System.Drawing.Imaging.ImageFormat]::Png)
  $crop.Dispose()
}
Save-Crop $mock 0 320 'v35-mockup-mobile-top.png'
Save-Crop $mock 300 320 'v35-mockup-mobile-middle.png'
Save-Crop $mock 574 320 'v35-mockup-mobile-bottom.png'

# Comparativa lado a lado
$ref = Join-Path $v3 'referencia-limpia.png'
$imgRef = [System.Drawing.Image]::FromFile($ref)
$h = [Math]::Min($imgRef.Height, 894)
$gap = 16
$labelH = 36
$canvas = New-Object System.Drawing.Bitmap((521 * 2 + $gap), ($h + $labelH))
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.Clear([System.Drawing.Color]::FromArgb(230, 230, 230))
$font = New-Object System.Drawing.Font('Arial', 11, [System.Drawing.FontStyle]::Bold)
$g.DrawString('REFERENCIA (sin UI iPhone)', $font, [System.Drawing.Brushes]::Black, 12, 8)
$g.DrawString('MOCKUP v3.5 HTML/CSS', $font, [System.Drawing.Brushes]::Black, (521 + $gap + 12), 8)
$g.DrawImage($imgRef, 0, $labelH, 521, $h)
$g.DrawImage($mock, (521 + $gap), $labelH, 521, $h)
$g.Dispose()
$out = Join-Path $v3 'v35-comparativa-lado-a-lado.png'
$canvas.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)

$mock.Dispose(); $imgRef.Dispose(); $canvas.Dispose()
Write-Output "OK: $mockPath"
Write-Output "OK: $out"
