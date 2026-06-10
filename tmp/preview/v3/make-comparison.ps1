$v3 = Split-Path -Parent $MyInvocation.MyCommand.Path
$ref = Join-Path $v3 "referencia-limpia.png"
$mock = Join-Path $v3 "v3-mockup-completo.png"
$out = Join-Path $v3 "v3-comparativa-lado-a-lado.png"
Add-Type -AssemblyName System.Drawing
$imgRef = [System.Drawing.Image]::FromFile($ref)
$imgMock = [System.Drawing.Image]::FromFile($mock)
$cropH = $imgRef.Height
$w = $imgRef.Width
$mockBmp = New-Object System.Drawing.Bitmap($w, $cropH)
$g2 = [System.Drawing.Graphics]::FromImage($mockBmp)
$g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g2.DrawImage($imgMock, 0, 0, $w, $cropH)
$g2.Dispose()
$gap = 16
$labelH = 36
$totalW = $w * 2 + $gap
$totalH = $cropH + $labelH
$canvas = New-Object System.Drawing.Bitmap($totalW, $totalH)
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.Clear([System.Drawing.Color]::FromArgb(230, 230, 230))
$font = New-Object System.Drawing.Font("Arial", 11, [System.Drawing.FontStyle]::Bold)
$brush = [System.Drawing.Brushes]::Black
$g.DrawString("REFERENCIA LIMPIA (sin artefactos)", $font, $brush, 12, 8)
$g.DrawString("MOCKUP v3.1", $font, $brush, ($w + $gap + 12), 8)
$g.DrawImage($imgRef, 0, $labelH)
$g.DrawImage($mockBmp, ($w + $gap), $labelH)
$g.Dispose()
$canvas.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$mockBmp.Dispose(); $imgRef.Dispose(); $imgMock.Dispose(); $canvas.Dispose()
Write-Output $out
