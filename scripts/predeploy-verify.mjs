import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const base = "http://localhost:8782";
const apiKey = "AIzaSyCp68DynjT63T9wHorCLxwBGkSEo_mYPUI";

const pages = [
  "index.html",
  "resultados.html",
  "perfil.html",
  "registro-banner.html?slot=home_hero_1",
  "admin.html"
];

const report = {
  pages: {},
  firestore: {},
  firebaseProjects: {},
  assets: {}
};

for (const page of pages) {
  const url = `${base}/${page}`;
  try {
    const res = await fetch(url);
    const text = await res.text();
    report.pages[page] = {
      status: res.status,
      ok: res.ok,
      hasCarihubApp: text.includes("carihub-app"),
      hasCarinosasApp: text.includes("carinosas-app")
    };
  } catch (error) {
    report.pages[page] = { ok: false, error: error.message };
  }
}

const perfil = fs.readFileSync(path.join(root, "public", "perfil.html"), "utf8");
report.perfilBanners = {
  topSlots: [
    perfil.includes("slot=perfil_izquierda"),
    perfil.includes("slot=perfil_centro"),
    perfil.includes("slot=perfil_derecha")
  ].every(Boolean),
  bottomSlot: perfil.includes("slot=perfil_inferior"),
  rotation: perfil.includes("startResAdRotation"),
  noPlaceholders:
    !perfil.includes("DESTACADO") &&
    !perfil.includes("PUBLICIDAD") &&
    !perfil.includes("abrirInfoAnuncio")
};

const firestoreUrl = `https://firestore.googleapis.com/v1/projects/carihub-app/databases/(default)/documents/configuracion_publicidad/precios_banners?key=${apiKey}`;
try {
  const res = await fetch(firestoreUrl);
  const data = await res.json().catch(() => ({}));
  report.firestore = {
    httpStatus: res.status,
    ok: res.ok,
    error: data.error?.message || null,
    hasSlots: Boolean(data.fields?.slots),
    slotCount: data.fields?.slots?.mapValue?.fields
      ? Object.keys(data.fields.slots.mapValue.fields).length
      : 0,
    usesFallbackUntilRulesDeploy: !res.ok
  };
} catch (error) {
  report.firestore = { ok: false, error: error.message, usesFallbackUntilRulesDeploy: true };
}

const htmlFiles = ["index.html", "resultados.html", "perfil.html", "admin.html", "registro-banner.html"];
for (const file of htmlFiles) {
  const text = fs.readFileSync(path.join(root, "public", file), "utf8");
  report.firebaseProjects[file] = {
    carihubApp: /projectId:\s*["']carihub-app["']/.test(text),
    carinosasApp: /projectId:\s*["']carinosas-app["']/.test(text)
  };
}

const seedPath = path.join(root, "scripts", "seed-configuracion-publicidad.json");
if (fs.existsSync(seedPath)) {
  const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));
  report.seed = { slots: Object.keys(seed.slots || {}).length, path: "scripts/seed-configuracion-publicidad.json" };
}

console.log(JSON.stringify(report, null, 2));
