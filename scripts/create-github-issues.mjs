#!/usr/bin/env node
/**
 * Crea issues en GitHub desde scripts/github-issues-dashboard-plan.json
 *
 * Uso:
 *   set GITHUB_TOKEN=ghp_xxxx   (Windows)
 *   node scripts/create-github-issues.mjs
 *   node scripts/create-github-issues.mjs --dry-run
 *   node scripts/create-github-issues.mjs --from TICKET-030
 *   node scripts/create-github-issues.mjs --plan messenger --dry-run
 *   node scripts/create-github-issues.mjs --plan messenger-sprint-1
 *
 * Token: GitHub → Settings → Developer settings → Personal access tokens
 * Scopes: repo (o public_repo si repo público)
 */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const PLAN_FILES = {
  dashboard: "github-issues-dashboard-plan.json",
  messenger: "github-issues-messenger-master-plan.json",
  "messenger-sprint-1": "github-issues-messenger-sprint-1.json",
};

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const fromIdx = args.indexOf("--from");
const fromId = fromIdx >= 0 ? args[fromIdx + 1] : null;
const planIdx = args.indexOf("--plan");
const planKey = planIdx >= 0 ? args[planIdx + 1] : "dashboard";
const planFile = PLAN_FILES[planKey] || planKey;
const planPath = join(__dirname, planFile);
const plan = JSON.parse(readFileSync(planPath, "utf8"));

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
if (!token && !dryRun) {
  console.error(
    "Falta GITHUB_TOKEN. Crea un PAT en https://github.com/settings/tokens\n" +
      "  PowerShell: $env:GITHUB_TOKEN='ghp_...'; node scripts/create-github-issues.mjs"
  );
  process.exit(1);
}

const [owner, repo] = plan.repo.split("/");
const api = `https://api.github.com/repos/${owner}/${repo}`;

async function gh(path, opts = {}) {
  const res = await fetch(`${api}${path}`, {
    ...opts,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(opts.headers || {}),
    },
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`GitHub ${res.status}: ${data.message || text}`);
  }
  return data;
}

async function ensureLabels() {
  const existing = await gh("/labels?per_page=100");
  const names = new Set(existing.map((l) => l.name));
  for (const name of plan.labels) {
    if (names.has(name)) continue;
    if (dryRun) {
      console.log(`[dry-run] crear label: ${name}`);
      continue;
    }
    const color =
      name.startsWith("p0") ? "b60205"
      : name.startsWith("p1") ? "d93f0b"
      : name.startsWith("p2") ? "fbca04"
      : name.startsWith("p3") ? "0e8a16"
      : "5319e7";
    await gh("/labels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, color, description: name }),
    });
    console.log(`Label creado: ${name}`);
    await sleep(300);
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  let issues = plan.issues;
  if (fromId) {
    const i = issues.findIndex((x) => x.id === fromId);
    if (i < 0) throw new Error(`No encontrado: ${fromId}`);
    issues = issues.slice(i);
  }

  const planLabel = plan.planId || planKey;
  console.log(`Plan: ${planLabel} (${planFile})`);
  console.log(`Repo: ${plan.repo} | Issues: ${issues.length} | dry-run: ${dryRun}\n`);
  if (plan.ordenRecomendado) {
    console.log("Orden recomendado:", plan.ordenRecomendado.join(" → "));
    console.log("");
  }

  if (!dryRun) await ensureLabels();

  const created = [];

  for (const issue of issues) {
    const body = `<!-- ${issue.id} -->\n\n${issue.body}`;
    const payload = {
      title: issue.title,
      body,
      labels: issue.labels || [],
    };

    if (dryRun) {
      console.log(`[dry-run] ${issue.id}: ${issue.title}`);
      created.push({ id: issue.id, url: "(dry-run)" });
      continue;
    }

    const res = await gh("/issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log(`✓ ${issue.id} → #${res.number} ${res.html_url}`);
    created.push({ id: issue.id, number: res.number, url: res.html_url });
    await sleep(800);
  }

  console.log("\n--- Resumen ---");
  created.forEach((c) => console.log(`${c.id}: ${c.url}`));
  console.log(`\nTotal: ${created.length} issues`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
