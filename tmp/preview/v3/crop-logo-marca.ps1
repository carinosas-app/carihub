Add-Type -AssemblyName System.Drawing
$src = Join-Path $PSScriptRoot 'referencia-limpia.png'
if (-not (Test-Path $src)) {
  $src = Join-Path $PSScriptRoot '..\..\..\public\portada.PNG'
}
$out = Join-Path $PSScriptRoot 'assets\logo-marca.png'
$img = [System.Drawing.Image]::FromFile($src)
# Silueta + Cariñosas cursiva completa (sin subtítulo embebido)
$scale = $img.Width / 521.0
$x = [int](10 * $scale); $y = [int](8 * $scale)
$w = [int](178 * $scale); $h = [int](44 * $scale)
$rect = New-Object System.Drawing.Rectangle $x, $y, $w, $h
$bmp = New-Object System.Drawing.Bitmap $w, $h
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($img, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$img.Dispose()
Write-Output "Wrote $out"
