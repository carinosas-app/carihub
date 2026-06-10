Add-Type -AssemblyName System.Drawing
$src = Join-Path $PSScriptRoot 'referencia-limpia.png'
$out = Join-Path $PSScriptRoot 'assets\silueta-mujer.png'
$img = [System.Drawing.Image]::FromFile($src)
$scale = $img.Width / 521.0
$x = [int](10 * $scale)
$y = [int](8 * $scale)
$w = [int](46 * $scale)
$h = [int](44 * $scale)
$rect = New-Object System.Drawing.Rectangle $x, $y, $w, $h
$bmp = New-Object System.Drawing.Bitmap $w, $h
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($img, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$img.Dispose()
Write-Output "Wrote $out ($w x $h)"
