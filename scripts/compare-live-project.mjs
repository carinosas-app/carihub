const live = 'https://carihub-app.web.app';
const pages = ['index.html', 'resultados.html', 'perfil.html', 'admin.html', 'registro-banner.html'];
const assets = [
  '/js/banner-inventario-rotacion.js',
  '/css/banners-publicidad.css',
  '/js/home-sector-scroll.js',
  '/css/home.css',
];

for (const p of pages) {
  const t = await fetch(`${live}/${p}`).then((r) => r.text());
  const m = t.match(/projectId:\s*["']([^"']+)["']/);
  console.log(`${p}\tprojectId=${m?.[1] ?? 'NOT_FOUND'}\tbytes=${t.length}`);
}

console.log('\nLive asset status:');
for (const a of assets) {
  const r = await fetch(live + a, { method: 'HEAD' });
  console.log(`${a}\t${r.status}`);
}
