import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");

const pages = ["index.html", "resultados.html", "perfil.html", "admin.html", "registro-banner.html"];
const cssFiles = fs
  .readdirSync(path.join(publicDir, "css"), { withFileTypes: true })
  .filter((d) => d.isFile() && d.name.endsWith(".css"))
  .map((d) => `css/${d.name}`);

const jsRoots = [
  "js/banner-inventario-rotacion.js",
  "js/precios-publicidad.js",
  "js/home-ui.js",
  "js/hero-home.js",
  "js/home-sector-scroll.js",
  "js/home-bridge.js",
  "js/adultos-cat-picker.js",
  "js/sectores-carihub.js",
  "js/catalogos-carihub.js",
  "js/home-vcards.js",
  "js/sector-scroll-data.js",
  "js/categoria-iconos.js",
  "js/modal-carihub.js",
];

const staticPattern = /(?:src|href)=["']((?!https?:|\/\/|#|mailto:|data:)[^"']+)["']/g;
const urlPattern = /url\(["']?(?!https?:|data:)([^"')]+)["']?\)/g;

const missing = [];
const found = new Set();

function resolveAsset(fromFile, asset) {
  const clean = asset.split("?")[0].split("#")[0];
  if (!clean || clean.includes("${")) return null;
  if (clean.startsWith("/")) return path.join(publicDir, clean.replace(/^\//, ""));
  return path.normalize(path.join(publicDir, fromFile, "..", clean));
}

function check(from, asset) {
  const full = resolveAsset(from, asset);
  if (!full || !full.startsWith(publicDir)) return;
  found.add(asset);
  if (!fs.existsSync(full)) missing.push({ from, asset, resolved: path.relative(publicDir, full) });
}

for (const page of pages) {
  const html = fs.readFileSync(path.join(publicDir, page), "utf8");
  let m;
  while ((m = staticPattern.exec(html))) check(page, m[1]);
}

for (const cssFile of cssFiles) {
  const css = fs.readFileSync(path.join(publicDir, cssFile), "utf8");
  for (const m of css.matchAll(urlPattern)) check(cssFile, m[1]);
}

for (const rel of jsRoots) {
  found.add(rel);
  const full = path.join(publicDir, rel);
  if (!fs.existsSync(full)) missing.push({ from: "required-js", asset: rel, resolved: rel });
  else {
    const js = fs.readFileSync(full, "utf8");
    for (const m of js.matchAll(/["'](\/(?:js|img|css)\/[^"']+)["']/g)) check(rel, m[1]);
  }
}

console.log(
  JSON.stringify(
    {
      uniqueStaticAssets: found.size,
      missing,
      ok: missing.length === 0,
      cssFilesScanned: cssFiles.length,
      jsFilesScanned: jsRoots.length,
    },
    null,
    2,
  ),
);
