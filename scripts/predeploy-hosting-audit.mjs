import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");

const keyPages = [
  "index.html",
  "resultados.html",
  "perfil.html",
  "admin.html",
  "registro-banner.html",
];

function read(file) {
  return fs.readFileSync(path.join(publicDir, file), "utf8");
}

function existsPublic(rel) {
  const clean = rel.replace(/^\//, "").split("?")[0].split("#")[0];
  if (!clean || clean.startsWith("http") || clean.startsWith("//") || clean.startsWith("mailto:")) {
    return { skip: true };
  }
  const full = path.join(publicDir, decodeURIComponent(clean));
  return { skip: false, ok: fs.existsSync(full), clean };
}

function extractAssets(html) {
  const assets = new Set();
  for (const m of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) assets.add(m[1]);
  for (const m of html.matchAll(/url\(["']?([^"')]+)["']?\)/g)) assets.add(m[1]);
  return [...assets];
}

const report = {
  firebase: {},
  carinosasInKeyPages: [],
  carinosasElsewhere: [],
  missingAssets: [],
  assetsByPage: {},
  bannersPublicidad: {},
  bannerInventario: {},
  jsSyntax: [],
  gitSummary: {},
  hostingScope: {},
};

for (const page of keyPages) {
  const html = read(page);
  const project = html.match(/projectId:\s*"([^"]+)"/)?.[1] || null;
  report.firebase[page] = { projectId: project, ok: project === "carihub-app" };
  if (/carinosas-app/.test(html)) report.carinosasInKeyPages.push(page);

  const assets = extractAssets(html);
  const missing = [];
  for (const a of assets) {
    const chk = existsPublic(a);
    if (chk.skip) continue;
    if (!chk.ok) missing.push({ page, asset: chk.clean });
  }
  report.assetsByPage[page] = { referenced: assets.filter((a) => !a.startsWith("http")).length, missing };
  report.missingAssets.push(...missing);
}

const allPublicHtmlJs = [];
function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (/\.(html|js)$/.test(ent.name)) allPublicHtmlJs.push(p);
  }
}
walk(publicDir);
for (const f of allPublicHtmlJs) {
  const rel = path.relative(publicDir, f).replace(/\\/g, "/");
  if (keyPages.includes(rel)) continue;
  const txt = fs.readFileSync(f, "utf8");
  if (txt.includes("carinosas-app")) report.carinosasElsewhere.push(rel);
}

report.bannersPublicidad = {
  cssExists: fs.existsSync(path.join(publicDir, "css/banners-publicidad.css")),
  referencedIn: Object.fromEntries(
    keyPages.map((p) => [p, read(p).includes("banners-publicidad.css")])
  ),
  note: "resultados.html usa CSS inline de banners (equivalente local); perfil.html usa css/banners-publicidad.css",
};

report.bannerInventario = {
  jsExists: fs.existsSync(path.join(publicDir, "js/banner-inventario-rotacion.js")),
  referencedInRegistro: read("registro-banner.html").includes("banner-inventario-rotacion.js"),
  scriptTag: read("registro-banner.html").match(/<script[^>]+banner-inventario-rotacion\.js[^>]*>/)?.[0] || null,
};

const jsFiles = [
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
];
for (const f of jsFiles) {
  try {
    execSync(`node --check "${path.join(publicDir, f)}"`, { stdio: "pipe" });
    report.jsSyntax.push({ file: f, ok: true });
  } catch (e) {
    report.jsSyntax.push({ file: f, ok: false });
  }
}

const porcelain = execSync("git status --porcelain", { cwd: root, encoding: "utf8" }).trim().split(/\r?\n/).filter(Boolean);
report.gitSummary = {
  modified: porcelain.filter((l) => l.startsWith(" M") || l.startsWith("M ")).length,
  untracked: porcelain.filter((l) => l.startsWith("??")).length,
  criticalUncommitted: porcelain.filter((l) => /public\/(index|resultados|perfil|admin|registro-banner)|firestore\.rules|banner-inventario|banners-publicidad|home\.css/.test(l)),
};

const firebaseJson = JSON.parse(fs.readFileSync(path.join(root, "firebase.json"), "utf8"));
report.hostingScope = {
  deployCommand: "firebase deploy --only hosting --project carihub-app",
  affects: ["Firebase Hosting (carpeta public/)"],
  doesNotAffect: ["Firestore rules", "Firestore indexes", "Cloud Functions", "Storage rules"],
  publicFolder: firebaseJson.hosting.public,
  ignorePatterns: firebaseJson.hosting.ignore,
  previewFolderWillDeploy: fs.existsSync(path.join(publicDir, "preview")),
  indexLegacyWillDeploy: fs.existsSync(path.join(publicDir, "index-legacy.html")),
};

console.log(JSON.stringify(report, null, 2));
