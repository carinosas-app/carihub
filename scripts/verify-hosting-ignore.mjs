import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const firebase = JSON.parse(fs.readFileSync(path.join(root, "firebase.json"), "utf8"));
const ignore = firebase.hosting.ignore;

function matchPattern(rel, pattern) {
  const norm = rel.replace(/\\/g, "/");
  if (pattern === "firebase.json") return norm === "firebase.json";
  if (pattern === "index-legacy.html") return norm === "index-legacy.html";
  if (pattern === "preview/**") return norm.startsWith("preview/");
  if (pattern === "**/.*") return /(^|\/)\./.test(norm);
  if (pattern === "**/node_modules/**") return norm.includes("/node_modules/");
  if (pattern === "functions/**") return norm.startsWith("functions/");
  if (pattern === "**/* copy.html") return norm.endsWith(" copy.html");
  if (pattern === "**/*.backup.html") return norm.endsWith(".backup.html");
  if (pattern === "**/*.backup-*.html") return /\.backup-.*\.html$/.test(norm);
  if (pattern === "**/parches/**") return norm.includes("/parches/");
  return false;
}

function shouldIgnore(rel) {
  return ignore.some((pattern) => matchPattern(rel, pattern));
}

const all = [];
const deployed = [];

for (const abs of fs.readdirSync(publicDir, { recursive: true })) {
  const full = path.join(publicDir, abs);
  if (!fs.statSync(full).isFile()) continue;
  const rel = abs.replace(/\\/g, "/");
  all.push(rel);
  if (!shouldIgnore(rel)) deployed.push(rel);
}

console.log(
  JSON.stringify(
    {
      hostingOnlyCommand: "firebase deploy --only hosting --project carihub-app",
      deployAffects: ["Firebase Hosting (public/)"],
      deployDoesNotAffect: ["Firestore rules", "Firestore indexes", "Cloud Functions", "Storage rules"],
      previewExcluded: !deployed.some((f) => f.startsWith("preview/")),
      indexLegacyExcluded: !deployed.includes("index-legacy.html"),
      previewOnDisk: all.filter((f) => f.startsWith("preview/")).length,
      indexLegacyOnDisk: all.includes("index-legacy.html"),
      totalOnDisk: all.length,
      wouldDeploy: deployed.length,
      firebaseIgnore: ignore,
    },
    null,
    2,
  ),
);
