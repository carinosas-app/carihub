Add-Type -AssemblyName System.Drawing

$port = "C:\Users\ilser\carihub\public\portada.PNG"
$outDir = "C:\Users\ilser\carihub\tmp\preview\v2\assets"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function Crop-Image {
  param([string]$Source, [string]$Name, [int]$X, [int]$Y, [int]$W, [int]$H)
  $img = [System.Drawing.Image]::FromFile($Source)
  $rect = New-Object System.Drawing.Rectangle $X, $Y, $W, $H
  $bmp = New-Object System.Drawing.Bitmap $W, $H
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($img, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  $path = Join-Path $outDir "$Name.png"
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose(); $img.Dispose()
}

# portada.PNG 1024x1536
Crop-Image $port "logo-hd" 18 22 290 92
Crop-Image $port "icon-heart-hd" 900 34 56 56
Crop-Image $port "icon-menu-hd" 962 34 52 52
Crop-Image $port "hero-photo-hd" 470 78 548 430
Crop-Image $port "icon-categoria" 52 548 44 44
Crop-Image $port "icon-pais" 276 548 44 44
Crop-Image $port "icon-estado" 500 548 44 44
Crop-Image $port "icon-ciudad" 724 548 44 44
Crop-Image $port "zonas-row" 24 710 976 150
Crop-Image $port "cat-escort" 70 900 250 250
Crop-Image $port "cat-spa" 380 900 250 250
Crop-Image $port "cat-swinger" 690 900 250 250
Crop-Image $port "cat-contenido" 70 1170 250 250
Crop-Image $port "cat-trans" 380 1170 250 250
Crop-Image $port "cat-sexshop" 690 1170 250 250
Crop-Image $port "cta-cerca" 24 1260 490 150
Crop-Image $port "cta-registro" 520 1260 490 150
Crop-Image $port "trust-shield" 36 1420 120 100
Crop-Image $port "trust-lock" 286 1420 120 100
Crop-Image $port "trust-chat" 536 1420 120 100
Crop-Image $port "trust-heart" 786 1420 120 100

Copy-Item "C:\Users\ilser\carihub\public\banners\mini\banner-mini-2.webp" "$outDir\ad-principal-izq.webp" -Force
Copy-Item "C:\Users\ilser\carihub\public\banners\home\home1.webp" "$outDir\ad-principal-der.webp" -Force
Copy-Item "C:\Users\ilser\carihub\public\banners\home\home2.webp" "$outDir\ad-inferior.webp" -Force

Write-Output "done"
