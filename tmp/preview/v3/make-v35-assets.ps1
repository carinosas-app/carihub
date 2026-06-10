$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$v3 = Split-Path -Parent $MyInvocation.MyCommand.Path
$assets = Join-Path $v3 'assets'
$refSrc = Join-Path $v3 'referencia.png'

if (-not (Test-Path $refSrc)) {
  $refSrc = 'C:\Users\ilser\.cursor\projects\c-Users-ilser-carihub\assets\c__Users_ilser_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_referencia-e03263eb-4443-462e-a654-ec3fa3e7ce2b.png'
  Copy-Item $refSrc (Join-Path $v3 'referencia.png') -Force
}

# referencia-limpia: sin barra Safari ni botones flotantes
$img = [System.Drawing.Image]::FromFile($refSrc)
$w = $img.Width
$h = $img.Height
$cropBottom = 130
$cropH = [Math]::Max(400, $h - $cropBottom)
$bmp = New-Object System.Drawing.Bitmap($w, $cropH)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($img, 0, 0, (New-Object System.Drawing.Rectangle(0, 0, $w, $cropH)), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$refLimpia = Join-Path $v3 'referencia-limpia.png'
$bmp.Save($refLimpia, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$img.Dispose()
Write-Output "referencia-limpia ${w}x${cropH}"

# Tarjetas categoría HD desde slice 04-categorias.png
$catSlice = Join-Path $assets '04-categorias.png'
$img = [System.Drawing.Image]::FromFile($catSlice)
$padX = 14
$titleH = 36
$gapX = 9
$gapY = 8
$cardW = 158
$cardH = 57
$names = @('escort','spa','swinger','contenido','trans','sexshop')
$idx = 0
for ($row = 0; $row -lt 2; $row++) {
  for ($col = 0; $col -lt 3; $col++) {
    $x = $padX + $col * ($cardW + $gapX)
    $y = $titleH + $row * ($cardH + $gapY)
    $crop = New-Object System.Drawing.Bitmap($cardW, $cardH)
    $gc = [System.Drawing.Graphics]::FromImage($crop)
    $gc.DrawImage($img, 0, 0, (New-Object System.Drawing.Rectangle($x, $y, $cardW, $cardH)), [System.Drawing.GraphicsUnit]::Pixel)
    $gc.Dispose()
    $out = Join-Path $assets ("cat-hd-" + $names[$idx] + '.png')
    $crop.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
    $crop.Dispose()
  $idx++ }
}
$img.Dispose()
Write-Output "cat-hd-*.png generadas ($cardW x $cardH)"
