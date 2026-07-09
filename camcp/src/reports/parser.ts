import fs from 'node:fs';
import path from 'node:path';
import type { CamcpConfig } from '../policy/permissions.js';
import { resolveReportsRoot } from '../qa/report-runner.js';
import type { QaRunManifest } from '../qa/report-runner.js';
import { normalizeFindings } from './normalize.js';
import type { CamcpReportDocument, ReportFinding, ReportManifestDocument, ReportStatus } from './schema.js';
import { isReportManifestV2, isReportV2 } from './schema.js';

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

function isQaRunManifest(data: unknown): data is QaRunManifest {
  return (
    !!data &&
    typeof data === 'object' &&
    typeof (data as QaRunManifest).tool === 'string' &&
    typeof (data as QaRunManifest).scriptPath === 'string'
  );
}

function findLatestQaManifest(reportsRoot: string): QaRunManifest | null {
  const pointer = path.join(reportsRoot, 'last-run.json');
  if (fs.existsSync(pointer)) {
    const data = readJsonSafe(pointer);
    if (isQaRunManifest(data)) return data;
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
      if (!isQaRunManifest(data)) continue;
      const stat = fs.statSync(full);
      if (stat.mtimeMs > latestMtime) {
        latestMtime = stat.mtimeMs;
        latestManifest = data;
      }
    }
  };
  walk(reportsRoot);
  return latestManifest;
}

function findLatestCamcpReportMd(
  reportsRoot: string,
  repoRoot: string,
  prefix: string
): string | null {
  if (!fs.existsSync(reportsRoot)) return null;
  let latest: string | null = null;
  let latestMtime = 0;
  for (const ns of fs.readdirSync(reportsRoot, { withFileTypes: true })) {
    if (!ns.isDirectory() || !ns.name.startsWith(prefix)) continue;
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

function findLatestParityReportMd(reportsRoot: string, repoRoot: string): string | null {
  return findLatestCamcpReportMd(reportsRoot, repoRoot, 'parity.');
}

function findLatestDataReportMd(reportsRoot: string, repoRoot: string): string | null {
  return findLatestCamcpReportMd(reportsRoot, repoRoot, 'data.');
}

function findLatestArchReportMd(reportsRoot: string, repoRoot: string): string | null {
  return findLatestCamcpReportMd(reportsRoot, repoRoot, 'arch.');
}

/** Read canonical report.json; falls back to legacy findings.json + summary.json. */
export function readCamcpReportFromDir(reportDirAbs: string): CamcpReportDocument | null {
  const reportJson = path.join(reportDirAbs, 'report.json');
  if (fs.existsSync(reportJson)) {
    const data = readJsonSafe(reportJson);
    if (isReportV2(data)) return data;
  }

  const findingsJson = path.join(reportDirAbs, 'findings.json');
  const summaryJson = path.join(reportDirAbs, 'summary.json');
  if (!fs.existsSync(findingsJson)) return null;

  const findingsRaw = readJsonSafe(findingsJson);
  const summaryRaw = readJsonSafe(summaryJson) as Record<string, unknown> | null;
  if (!Array.isArray(findingsRaw)) return null;

  const toolId =
    (typeof summaryRaw?.toolId === 'string' && summaryRaw.toolId) ||
    (typeof summaryRaw?.module === 'string' && summaryRaw.module) ||
    'legacy.unknown';

  const normalized = normalizeFindings(findingsRaw as ReportFinding[], {
    toolId,
    defaultCategory: 'legacy',
  });

  const maxSeverity =
    (typeof summaryRaw?.maxSeverity === 'string' ? summaryRaw.maxSeverity : null) ??
    normalized[0]?.severity ??
    'PASS';

  const legacyStatus: ReportStatus =
    typeof summaryRaw?.status === 'string' &&
    (summaryRaw.status === 'PASS' || summaryRaw.status === 'WARNING' || summaryRaw.status === 'FAIL')
      ? summaryRaw.status
      : maxSeverity === 'BLOQUEADOR' || maxSeverity === 'IMPORTANTE'
        ? 'FAIL'
        : maxSeverity === 'WARNING'
          ? 'WARNING'
          : 'PASS';

  return {
    schemaVersion: '2.0.0',
    reportId: `legacy:${toolId}`,
    tool: {
      id: toolId,
      namespace: toolId.split('.')[0] ?? toolId,
      facet: null,
      capability: 'report-only',
    },
    status: legacyStatus,
    maxSeverity: maxSeverity as CamcpReportDocument['maxSeverity'],
    counts: {
      total: normalized.length,
      bloqueador: normalized.filter((f) => f.severity === 'BLOQUEADOR').length,
      importante: normalized.filter((f) => f.severity === 'IMPORTANTE').length,
      warning: normalized.filter((f) => f.severity === 'WARNING').length,
      info: normalized.filter((f) => f.severity === 'INFO').length,
      pass: normalized.filter((f) => f.severity === 'PASS').length,
    },
    summary: typeof summaryRaw?.summary === 'string' ? summaryRaw.summary : 'Legacy report',
    findings: normalized,
    domains: ['CAMCP'],
    ssot: { snapshots: [], reusePolicy: 'reference-only' },
    provenance: { engines: [{ id: 'reports-engine', version: '2.0.0' }] },
    evidence: [],
    suggestedNext: { tools: [], qaModules: [] },
    git: {
      commit: typeof summaryRaw?.gitCommit === 'string' ? summaryRaw.gitCommit : null,
      branch: null,
      worktreeId: null,
    },
    timing: {
      generatedAt: new Date().toISOString(),
      durationMs: 0,
      runId: typeof summaryRaw?.runId === 'string' ? summaryRaw.runId : 'legacy',
    },
  };
}

export function readCamcpManifestFromDir(reportDirAbs: string): ReportManifestDocument | null {
  const manifestPath = path.join(reportDirAbs, 'manifest.json');
  if (!fs.existsSync(manifestPath)) return null;
  const data = readJsonSafe(manifestPath);
  return isReportManifestV2(data) ? data : null;
}

export function parseLastReport(repoRoot: string, config: CamcpConfig): ParsedReportSummary {
  const reportsRoot = resolveReportsRoot(repoRoot, config);
  const manifest = findLatestQaManifest(reportsRoot);
  const parityReportMd = findLatestParityReportMd(reportsRoot, repoRoot);
  const dataReportMd = findLatestDataReportMd(reportsRoot, repoRoot);
  const archReportMd = findLatestArchReportMd(reportsRoot, repoRoot);

  if (!manifest) {
    const camcpReports: Array<{ path: string; preview: string }> = [];
    if (parityReportMd && fs.existsSync(path.join(repoRoot, parityReportMd))) {
      const text = fs.readFileSync(path.join(repoRoot, parityReportMd), 'utf8');
      camcpReports.push({ path: parityReportMd, preview: text.slice(0, 500) });
    }
    if (dataReportMd && fs.existsSync(path.join(repoRoot, dataReportMd))) {
      const text = fs.readFileSync(path.join(repoRoot, dataReportMd), 'utf8');
      camcpReports.push({ path: dataReportMd, preview: text.slice(0, 500) });
    }
    if (archReportMd && fs.existsSync(path.join(repoRoot, archReportMd))) {
      const text = fs.readFileSync(path.join(repoRoot, archReportMd), 'utf8');
      camcpReports.push({ path: archReportMd, preview: text.slice(0, 500) });
    }
    return {
      manifest: null,
      reportDir: null,
      jsonReports: [],
      markdownReports: [],
      camcpReports,
      stdoutPreview: null,
      ok: camcpReports.length
        ? camcpReports[0]!.preview.includes('Estado | PASS') ||
          camcpReports[0]!.preview.includes('| **Estado** | PASS |')
        : null,
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

  if (dataReportMd && fs.existsSync(path.join(repoRoot, dataReportMd))) {
    const text = fs.readFileSync(path.join(repoRoot, dataReportMd), 'utf8');
    if (!camcpReports.some((r) => r.path === dataReportMd)) {
      camcpReports.unshift({ path: dataReportMd, preview: text.slice(0, 500) });
    }
  }

  if (archReportMd && fs.existsSync(path.join(repoRoot, archReportMd))) {
    const text = fs.readFileSync(path.join(repoRoot, archReportMd), 'utf8');
    if (!camcpReports.some((r) => r.path === archReportMd)) {
      camcpReports.unshift({ path: archReportMd, preview: text.slice(0, 500) });
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
