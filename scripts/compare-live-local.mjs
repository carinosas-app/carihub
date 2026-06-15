const liveBase = "https://carihub-app.web.app";

const pages = ["index.html", "resultados.html", "perfil.html", "registro-banner.html"];
const assets = [
  "css/home.css",
  "css/banners-publicidad.css",
  "js/home-ui.js",
  "js/hero-home.js",
  "js/home-sector-scroll.js",
  "js/banner-inventario-rotacion.js",
  "js/precios-publicidad.js",
  "img/home/banners/ad-banner-pink-01.png",
  "img/resultados/banner-centro.webp",
];

async function head(url) {
  try {
    const r = await fetch(url, { method: "HEAD" });
    return r.status;
  } catch {
    return "FAIL";
  }
}

for (const page of pages) {
  const t = await fetch(`${liveBase}/${page}`).then((r) => r.text());
  const project = t.match(/projectId:\s*"([^"]+)"/)?.[1] || "n/a";
  const scripts = [...t.matchAll(/src="js\/([^"]+)"/g)].map((m) => m[1]);
  console.log(`\n[${page}] size=${t.length} firebase=${project}`);
  console.log("  scripts:", scripts.join(", ") || "(none)");
  console.log("  banners-publicidad.css ref:", t.includes("banners-publicidad.css"));
  console.log("  banner-inventario ref:", t.includes("banner-inventario-rotacion.js"));
}

console.log("\n[assets on live]");
for (const a of assets) {
  console.log(`  ${await head(`${liveBase}/${a}`)} ${a}`);
}
