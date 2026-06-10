$srcDir = 'C:\Users\ilser\.cursor\projects\c-Users-ilser-carihub\assets'
$destDir = Join-Path $PSScriptRoot 'assets\user'
New-Item -ItemType Directory -Force -Path $destDir | Out-Null

$map = @{
  'hero-carinosa-motel-spa-runway.png' = '*2.13.13_PM-2bff9c6a*'
  'hero-antro-restaurante.png'          = '*2.13.13_PM__1_-6a426630*'
  'hero-club-swinger.png'               = '*2.13.13_PM__2_-4a2dcee5*'
  'hero-lesbianas.png'                  = '*2.13.13_PM__3_-175afe42*'
  'hero-calle-negocios-dia.png'         = '*2.13.14_PM__1_-32f1187c*'
  'hero-negocios-grid-noche.png'        = '*2.13.14_PM__2_-ae875cc9*'
  'hero-spa-interior.png'               = '*2.13.14_PM__3_-77ccc020*'
  'hero-bar-neon.png'                   = '*2.13.14_PM__4_-22efc667*'
  'hero-escort-gay.png'                 = '*2.13.14_PM__5_-f1ac9724*'
  'hero-motel-spa-fachada.png'          = '*2.13.14_PM-7586ff51*'
  'hero-motel-noche-rojo.png'           = '*6.54.58_AM__1_-a5b341e5*'
}

foreach ($pair in $map.GetEnumerator()) {
  $hit = Get-ChildItem $srcDir -Filter $pair.Value | Select-Object -First 1
  if (-not $hit) { Write-Warning "missing $($pair.Key) pattern $($pair.Value)"; continue }
  Copy-Item -Force $hit.FullName (Join-Path $destDir $pair.Key)
  Write-Host "OK $($pair.Key) <- $($hit.Name.Substring(0, [Math]::Min(60, $hit.Name.Length)))"
}
