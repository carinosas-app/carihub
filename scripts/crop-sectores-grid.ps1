Add-Type -AssemblyName System.Drawing
$src = "C:\Users\ilser\.cursor\projects\c-Users-ilser-carihub\assets\c__Users_ilser_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-06-08_at_7.35.24_PM__1_-8cf3f549-e55a-4b35-8529-39eb8826f58e.png"
$outDir = "C:\Users\ilser\carihub\public\img\home\sectores"
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }

$ids = @(
  "01-adultos","02-bienestar","03-salud","04-profesionales","05-automotriz",
  "06-hogar","07-comercio","08-bienes-raices","09-eventos","10-transporte",
  "11-educacion","12-tecnologia","13-restaurantes","14-mascotas","15-industria"
)

$img = [System.Drawing.Image]::FromFile($src)
$cols = 5
$rows = 3
$padX = [int]($img.Width * 0.012)
$padY = [int]($img.Height * 0.018)
$cellW = [int](($img.Width - $padX * 2) / $cols)
$cellH = [int](($img.Height - $padY * 2) / $rows)

Write-Output "Source: $($img.Width)x$($img.Height) cell=${cellW}x${cellH}"

for ($i = 0; $i -lt 15; $i++) {
  $col = $i % $cols
  $row = [math]::Floor($i / $cols)
  $x = $padX + ($col * $cellW)
  $y = $padY + ($row * $cellH)
  $rect = New-Object System.Drawing.Rectangle $x, $y, $cellW, $cellH
  $bmp = New-Object System.Drawing.Bitmap $cellW, $cellH
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.DrawImage($img, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  $dest = Join-Path $outDir ("sector-" + $ids[$i] + ".png")
  $bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Output "Wrote $dest"
}

$img.Dispose()
Write-Output "Done."
