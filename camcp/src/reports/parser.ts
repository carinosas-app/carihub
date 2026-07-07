import fs from 'node:fs';
import path from 'node:path';
import type { CamcpConfig } from '../policy/permissions.js';
import { resolveReportsRoot } from '../qa/report-runner.js';
import type { QaRunManifest } from '../qa/report-runner.js';

export interface ParsedReportSummary {
  manifest: QaRunManifest | null;
  reportDir: string | null;
  jsonReports: Array<{ path: string; data: unknown }>;
  markdownReports: Array<{ path: string; preview: string }>;
  camcpReports: Array<{ path: string; preview: string }>;
  stdoutPreview: string | null;
  ok: boolean | null;
}

function readJsonSafe(filePath: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function findLatestManifest(reportsRoot: string): QaRunManifest | null {
  const pointer = path.join(reportsRoot, 'last-run.json');
  if (fs.existsSync(pointer)) {
    const data = readJsonSafe(pointer);
    if (data && typeof data === 'object') return data as QaRunManifest;
  }

  let latestManifest: QaRunManifest | null = null;
  let latestMtime = 0;
  if (!fs.existsSync(reportsRoot)) return null;

  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (entry.name !== 'manifest.json') continue;
      const data = readJsonSafe(full);
      if (!data || typeof data !== 'object') continue;
      const stat = fs.statSync(full);
      if (stat.mtimeMs > latestMtime) {
        latestMtime = stat.mtimeMs;
        latestManifest = data as QaRunManifest;
      }
    }
  };
  walk(reportsRoot);
  return latestManifest;
}

function findLatestParityReportMd(reportsRoot: string, repoRoot: string): string | null {
  if (!fs.existsSync(reportsRoot)) return null;
  let latest: string | null = null;
  let latestMtime = 0;
  for (const ns of fs.readdirSync(reportsRoot, { withFileTypes: true })) {
    if (!ns.isDirectory() || !ns.name.startsWith('parity.')) continue;
    const nsPath = path.join(reportsRoot, ns.name);
    for (const run of fs.readdirSync(nsPath, { withFileTypes: true })) {
      if (!run.isDirectory()) continue;
      const md = path.join(nsPath, run.name, 'report.md');
      if (!fs.existsSync(md)) continue;
      const mtime = fs.statSync(md).mtimeMs;
      if (mtime > latestMtime) {
        latestMtime = mtime;
        latest = path.relative(repoRoot, md).replace(/\\/g, '/');
      }
    }
  }
  return latest;
}

export function parseLastReport(repoRoot: string, config: CamcpConfig): ParsedReportSummary {
  const reportsRoot = resolveReportsRoot(repoRoot, config);
  const manifest = findLatestManifest(reportsRoot);
  const parityReportMd = findLatestParityReportMd(reportsRoot, repoRoot);

  if (!manifest) {
    const camcpReports: Array<{ path: string; preview: string }> = [];
    if (parityReportMd && fs.existsSync(path.join(repoRoot, parityReportMd))) {
      const text = fs.readFileSync(path.join(repoRoot, parityReportMd), 'utf8');
      camcpReports.push({ path: parityReportMd, preview: text.slice(0, 500) });
    }
    return {
      manifest: null,
      reportDir: null,
      jsonReports: [],
      markdownReports: [],
      camcpReports,
      stdoutPreview: null,
      ok: camcpReports.length ? camcpReports[0]!.preview.includes('Estado | PASS') : null,
    };
  }

  const reportDirAbs = path.resolve(repoRoot, manifest.reportDir);
  const jsonReports: Array<{ path: string; data: unknown }> = [];
  const markdownReports: Array<{ path: string; preview: string }> = [];
  const camcpReports: Array<{ path: string; preview: string }> = [];

  if (fs.existsSync(reportDirAbs)) {
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
          continue;
        }
        const rel = path.relative(repoRoot, full).replace(/\\/g, '/');
        if (entry.name.endsWith('.json') && entry.name !== 'manifest.json') {
          const data = readJsonSafe(full);
          if (data !== null) jsonReports.push({ path: rel, data });
        }
        if (entry.name.endsWith('.md')) {
          const text = fs.readFileSync(full, 'utf8');
          const item = { path: rel, preview: text.slice(0, 500) };
          if (entry.name === 'report.md') camcpReports.push(item);
          else markdownReports.push(item);
        }
      }
    };
    walk(reportDirAbs);
  }

  if (parityReportMd && fs.existsSync(path.join(repoRoot, parityReportMd))) {
    const text = fs.readFileSync(path.join(repoRoot, parityReportMd), 'utf8');
    if (!camcpReports.some((r) => r.path === parityReportMd)) {
      camcpReports.unshift({ path: parityReportMd, preview: text.slice(0, 500) });
    }
  }

  let stdoutPreview: string | null = null;
  const stdoutAbs = path.resolve(repoRoot, manifest.stdoutPath);
  if (fs.existsSync(stdoutAbs)) {
    stdoutPreview = fs.readFileSync(stdoutAbs, 'utf8').slice(0, 2000);
  }

  return {
    manifest,
    reportDir: manifest.reportDir,
    jsonReports,
    markdownReports,
    camcpReports,
    stdoutPreview,
    ok: manifest.exitCode === 0,
  };
}
