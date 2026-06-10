Add-Type -AssemblyName System.Drawing
$src = Join-Path $PSScriptRoot 'assets\logo-ref-usuario.png'
$bmp = [System.Drawing.Bitmap]::FromFile($src)

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

function Save-Crop($rect, $dest) {
  $crop = $bmp.Clone($rect, $bmp.PixelFormat)
  $clean = Remove-WhiteBg $crop
  $tmp = "$dest.tmp.png"
  $clean.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
  $crop.Dispose(); $clean.Dispose()
  Move-Item -Force $tmp $dest
}

# Wordmark rosa solo — sin silueta (x desde donde empieza Cariñosas)
$wmRect = [System.Drawing.Rectangle]::new(173, 44, 815, 195)
Save-Crop $wmRect (Join-Path $PSScriptRoot 'assets\user\logo-wordmark-carinosa.png')
Write-Output "wordmark $($wmRect.Width)x$($wmRect.Height) y=$($wmRect.Y)"

# Tagline gris oscuro — sin zona rosa intermedia
$tgRect = [System.Drawing.Rectangle]::new(173, 249, 822, 38)
Save-Crop $tgRect (Join-Path $PSScriptRoot 'assets\user\logo-tagline.png')
Write-Output "tagline $($tgRect.Width)x$($tgRect.Height) y=$($tgRect.Y)"

$bmp.Dispose()
