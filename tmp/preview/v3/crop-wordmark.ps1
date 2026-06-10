Add-Type -AssemblyName System.Drawing
$src = Join-Path $PSScriptRoot 'assets\logo-ref-usuario.png'
$bmp = [System.Drawing.Bitmap]::FromFile($src)
$w = $bmp.Width
$h = $bmp.Height
$minX = $w; $minY = $h; $maxX = 0; $maxY = 0
$startX = [int]($w * 0.16)
$yTextTop = 50
$yTextBottom = 140

for ($y = $yTextTop; $y -lt $yTextBottom; $y++) {
  for ($x = $startX; $x -lt $w; $x++) {
    $c = $bmp.GetPixel($x, $y)
    if ($c.R -gt 245 -and $c.G -gt 245 -and $c.B -gt 245) { continue }
    if ($c.R -lt 160 -or $c.G -gt 140) { continue }
    if ($c.B -lt 80) { continue }
    if ($x -lt $minX) { $minX = $x }
    if ($y -lt $minY) { $minY = $y }
    if ($x -gt $maxX) { $maxX = $x }
    if ($y -gt $maxY) { $maxY = $y }
  }
}
for ($y = $yTextBottom; $y -lt $h; $y++) {
  for ($x = $minX; $x -lt $w; $x++) {
    $c = $bmp.GetPixel($x, $y)
    if ($c.R -gt 245 -and $c.G -gt 245 -and $c.B -gt 245) { continue }
    if ($c.R -lt 160 -or $c.G -gt 140) { continue }
    if ($c.B -lt 80) { continue }
    if ($x -gt $maxX) { $maxX = $x }
    if ($y -gt $maxY) { $maxY = $y }
  }
}

$padX = 8; $padTop = 6; $padBottom = 14
$cropX = [Math]::Max(0, $minX - $padX)
$cropY = [Math]::Max(0, $minY - $padTop)
$cropW = [Math]::Min($w - $cropX, ($maxX - $minX) + ($padX * 2))
$cropH = [Math]::Min($h - $cropY, ($maxY - $minY) + $padTop + $padBottom)
Write-Output "pink box $minX,$minY - $maxX,$maxY -> crop $cropX,$cropY ${cropW}x${cropH}"

function Remove-WhiteBg([System.Drawing.Bitmap]$inputBmp) {
  $out = [System.Drawing.Bitmap]::new($inputBmp.Width, $inputBmp.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  for ($y = 0; $y -lt $inputBmp.Height; $y++) {
    for ($x = 0; $x -lt $inputBmp.Width; $x++) {
      $c = $inputBmp.GetPixel($x, $y)
      if ($c.R -gt 245 -and $c.G -gt 245 -and $c.B -gt 245) {
        $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
      } else {
        $out.SetPixel($x, $y, $c)
      }
    }
  }
  return $out
}

$rect = [System.Drawing.Rectangle]::new($cropX, $cropY, $cropW, $cropH)
$crop = $bmp.Clone($rect, $bmp.PixelFormat)
$clean = Remove-WhiteBg $crop
$out = Join-Path $PSScriptRoot 'assets\user\logo-wordmark-carinosa.png'
$tmp = $out + '.tmp.png'
$clean.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
$crop.Dispose(); $clean.Dispose(); $bmp.Dispose()
Move-Item -Force $tmp $out
Write-Output 'wordmark auto-cropped'
