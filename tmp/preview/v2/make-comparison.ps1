Add-Type -AssemblyName System.Drawing
$refPath = "C:\Users\ilser\carihub\tmp\preview\v2\referencia.png"
$mockPath = "C:\Users\ilser\AppData\Local\Temp\cursor\screenshots\v2-mockup-fullpage.png"
if (-not (Test-Path $mockPath)) { $mockPath = "C:\Users\ilser\carihub\tmp\preview\v2\v2-mockup-fullpage.png" }
$outPath = "C:\Users\ilser\carihub\tmp\preview\v2\comparacion-referencia-vs-mockup.png"
$ref = [System.Drawing.Image]::FromFile($refPath)
$mock = [System.Drawing.Image]::FromFile($mockPath)
$targetW = 390
$refH = [int]($ref.Height * ($targetW / $ref.Width))
$mockH = [int]($mock.Height * ($targetW / $mock.Width))
$pad = 24
$labelH = 36
$totalH = $labelH + $refH + $pad + $labelH + $mockH + $pad
$canvas = New-Object System.Drawing.Bitmap ($targetW * 2 + $pad * 3), $totalH
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.Clear([System.Drawing.Color]::FromArgb(236,236,236))
$font = New-Object System.Drawing.Font "Arial", 11, [System.Drawing.FontStyle]::Bold
$brush = [System.Drawing.Brushes]::Black
$g.DrawString("REFERENCIA", $font, $brush, $pad, 8)
$g.DrawString("MOCKUP v2", $font, $brush, ($targetW + $pad * 2), 8)
$g.DrawImage($ref, $pad, $labelH, $targetW, $refH)
$y2 = $labelH + $refH + $pad + $labelH
$g.DrawImage($mock, $pad, $y2, $targetW, $mockH)
$g.Dispose()
$canvas.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$ref.Dispose(); $mock.Dispose(); $canvas.Dispose()
Write-Output $outPath
