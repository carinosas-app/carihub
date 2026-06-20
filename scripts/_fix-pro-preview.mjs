import fs from 'fs';
const p = 'c:/Users/ilser/carihub/public/preview/dashboard-cuenta-pro.html';
let lines = fs.readFileSync(p, 'utf8').split('\n');
const start = lines.findIndex(l => l.trim() === '<div class="app">');
if (start < 0) { console.error('start not found'); process.exit(1); }
const head = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3, user-scalable=yes">
<title>Cariñosas · Panel profesional</title>
<link rel="stylesheet" href="../css/dashboard-rentero-pro.css">
</head>
<body class="dash-pro">
<div class="pro-scale-viewport" id="proScaleViewport">
<div class="pro-canvas" id="proCanvas">
`;
let tail = lines.slice(start).join('\n');
tail = tail.replace('<div class="app">', '');
tail = tail.replace(/class="hdr"/g, 'class="pro-hdr"');
tail = tail.replace(/hdr__/g, 'pro-hdr__');
tail = tail.replace(/class="ic-btn"/g, 'class="pro-ic"');
tail = tail.replace(/class="btn-pub"/g, 'class="pro-btn-pub"');
tail = tail.replace(/class="body"/g, 'class="pro-body dashboard-rentero"');
tail = tail.replace(/class="side-l"/g, 'class="pro-left dashboard-col dashboard-left"');
tail = tail.replace(/class="main"/g, 'class="pro-main dashboard-col dashboard-center"');
tail = tail.replace(/class="side-r"/g, 'class="pro-right dashboard-col dashboard-right"');
tail = tail.replace(/class="mob-nav"/g, 'class="pro-mob-nav"');
if (!tail.includes('pro-scale-viewport')) {
  tail = tail.replace('</body>', '</div></div>\n<script>\n(function(){\n  function fit(){\n    var c=document.getElementById("proCanvas"),v=document.getElementById("proScaleViewport"),D=1280,w=window.innerWidth;\n    if(!c||!v)return;\n    if(w>=D){c.style.transform="";c.style.width="";v.style.height="";return;}\n    var s=w/D;c.style.width=D+"px";c.style.transform="scale("+s+")";c.style.transformOrigin="top left";v.style.height=(c.offsetHeight*s)+"px";\n  }\n  fit();window.addEventListener("resize",fit);\n})();\n</script>\n</body>');
}
fs.writeFileSync(p, head + tail);
console.log('fixed preview pro');
