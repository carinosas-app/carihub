import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");

const pages = ["index.html", "resultados.html", "perfil.html", "admin.html", "registro-banner.html"];
const extraRoots = [
  "css/home.css",
  "css/banners-publicidad.css",
  "js/banner-inventario-rotacion.js",
  "js/precios-publicidad.js",
];

const staticPattern = /(?:src|href)=["']((?!https?:|\/\/|#|mailto:|data:)[^"']+)["']/g;

const missing = [];
const found = new Set();

for (const page of pages) {
  const html = fs.readFileSync(path.join(publicDir, page), "utf8");
  let m;
  while ((m = staticPattern.exec(html))) {
    const asset = m[1].split("?")[0];
    if (asset.includes("${")) continue;
    found.add(asset);
    const rel = asset.replace(/^\//, "");
    const full = path.join(publicDir, rel);
    if (!fs.existsSync(full)) missing.push({ from: page, asset: rel });
  }
}

for (const cssFile of ["css/home.css", "css/banners-publicidad.css"]) {
  const cssPath = path.join(publicDir, cssFile);
  if (!fs.existsSync(cssPath)) continue;
  const css = fs.readFileSync(cssPath, "utf8");
  for (const m of css.matchAll(/url\(["']?(?!https?:|data:)([^"')]+)["']?\)/g)) {
    const asset = m[1].split("?")[0];
    found.add(asset);
    const full = path.join(publicDir, cssFile, "..", asset);
    const resolved = path.normalize(full);
    if (!resolved.startsWith(publicDir)) continue;
    if (!fs.existsSync(resolved)) missing.push({ from: cssFile, asset });
  }
}

for (const rel of extraRoots) {
  found.add(rel);
  if (!fs.existsSync(path.join(publicDir, rel))) missing.push({ from: "required", asset: rel });
}

console.log(JSON.stringify({ uniqueStaticAssets: found.size, missing, ok: missing.length === 0 }, null, 2));
