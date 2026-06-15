const base = "https://carihub-app.web.app";
const pages = [
  "index.html",
  "resultados.html",
  "perfil.html",
  "admin.html",
  "registro-banner.html",
];
const assets = ["/js/banner-inventario-rotacion.js", "/css/banners-publicidad.css"];

const pageResults = [];
for (const page of pages) {
  const res = await fetch(`${base}/${page}`);
  const text = await res.text();
  const projectId = text.match(/projectId:\s*["']([^"']+)["']/)?.[1] ?? "NOT_FOUND";
  pageResults.push({ page, status: res.status, ok: res.ok, projectId, bytes: text.length });
}

const assetResults = [];
for (const asset of assets) {
  const res = await fetch(base + asset, { method: "HEAD" });
  assetResults.push({ asset, status: res.status, ok: res.ok });
}

console.log(JSON.stringify({ base, pageResults, assetResults }, null, 2));
