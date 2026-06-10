$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$v3 = Split-Path -Parent $MyInvocation.MyCommand.Path
$ref = Join-Path $v3 'referencia-limpia.png'
$mock = Join-Path $v3 'v36-mockup-completo.png'
if (-not (Test-Path $mock)) { throw "Falta: $mock" }

$imgRef = [System.Drawing.Image]::FromFile($ref)
$imgMock = [System.Drawing.Image]::FromFile($mock)
$h = $imgRef.Height
$w = $imgRef.Width

# Recortar mockup a la misma altura que referencia (alineado arriba)
$mockCrop = New-Object System.Drawing.Bitmap($w, $h)
$g2 = [System.Drawing.Graphics]::FromImage($mockCrop)
$g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g2.DrawImage($imgMock, 0, 0, $w, $h)
$g2.Dispose()

function Save-Crop($img, $y, $cropH, $name) {
  $crop = New-Object System.Drawing.Bitmap($w, $cropH)
  $gc = [System.Drawing.Graphics]::FromImage($crop)
  $gc.DrawImage($img, 0, 0, (New-Object System.Drawing.Rectangle(0, $y, $w, $cropH)), [System.Drawing.GraphicsUnit]::Pixel)
  $gc.Dispose()
  $crop.Save((Join-Path $v3 $name), [System.Drawing.Imaging.ImageFormat]::Png)
  $crop.Dispose()
}

Save-Crop $imgMock 0 320 'v36-mockup-mobile-top.png'
Save-Crop $imgMock 320 320 'v36-mockup-mobile-middle.png'
Save-Crop $imgMock 640 320 'v36-mockup-mobile-bottom.png'
$imgMock.Save((Join-Path $v3 'v36-mockup-mobile-completo.png'), [System.Drawing.Imaging.ImageFormat]::Png)

$gap = 16
$labelH = 36
$canvas = New-Object System.Drawing.Bitmap((521 * 2 + $gap), ($h + $labelH))
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.Clear([System.Drawing.Color]::FromArgb(230, 230, 230))
$font = New-Object System.Drawing.Font('Arial', 11, [System.Drawing.FontStyle]::Bold)
$g.DrawString('REFERENCIA (sin UI iPhone)', $font, [System.Drawing.Brushes]::Black, 12, 8)
$g.DrawString('MOCKUP v3.6 HTML/CSS', $font, [System.Drawing.Brushes]::Black, (521 + $gap + 12), 8)
$g.DrawImage($imgRef, 0, $labelH, $w, $h)
$g.DrawImage($mockCrop, (521 + $gap), $labelH, $w, $h)
$g.Dispose()
$out = Join-Path $v3 'v36-comparativa-lado-a-lado.png'
$canvas.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)

$imgRef.Dispose(); $imgMock.Dispose(); $mockCrop.Dispose(); $canvas.Dispose()
Write-Output $out
