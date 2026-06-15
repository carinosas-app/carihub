import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const base = "http://localhost:8782";
const pages = [
  "index.html",
  "resultados.html",
  "perfil.html?id=test",
  "admin.html",
  "registro-banner.html?slot=home_hero_1",
];

const results = [];
for (const page of pages) {
  const url = `${base}/${page}`;
  const res = await fetch(url);
  const text = await res.text();
  const html = { status: res.status, text };
  const refs = [...html.text.matchAll(/(?:src|href)=["']((?!https?:|\/\/|#|data:)[^"']+)["']/g)]
    .map((m) => m[1].replace(/^\//, "").split("?")[0])
    .filter((a) => !a.includes("${"));
  const missing = [];
  for (const asset of [...new Set(refs)]) {
    const full = path.join(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "public"), asset);
    if (!fs.existsSync(full)) missing.push(asset);
  }
  const project = html.text.match(/projectId:\s*"([^"]+)"/)?.[1] || "n/a";
  results.push({ page, http: html.status, projectId: project, missingAssets: missing });
}

console.log(JSON.stringify(results, null, 2));
