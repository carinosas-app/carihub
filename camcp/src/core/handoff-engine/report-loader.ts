import fs from 'node:fs';
import path from 'node:path';
import type { CamcpConfig } from '../../policy/permissions.js';
import { readReportIndex } from '../../reports/index-manager.js';
import { readCamcpReportFromDir } from '../../reports/parser.js';
import type {
  CamcpReportDocument,
  ReportIndexEntry,
  ReportManifestDocument,
  ReportStatus,
} from '../../reports/schema.js';
import type { ReportSeverity } from '../../intelligence/types.js';
import { isReportManifestV2 } from '../../reports/schema.js';
import { resolveReportsRoot } from '../../qa/report-runner.js';
import type { HandoffInput } from './types.js';
import { loadHandoffConfig } from './config-loader.js';

export interface LoadedReport {
  toolId: string;
  facet: string | null;
  runId: string;
  reportDir: string;
  reportRef: string;
  manifestPath: string;
  document: CamcpReportDocument | null;
  legacy: boolean;
  ssotHashes: Record<string, string>;
  ssotVersions: Record<string, string>;
  generatedAt: string;
  status: ReportStatus;
  maxSeverity: ReportSeverity;
  gitCommit: string | null;
  gitBranch: string | null;
  missing: boolean;
}

function readJsonSafe(filePath: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function loadManifest(manifestAbs: string): ReportManifestDocument | null {
  const data = readJsonSafe(manifestAbs);
  return isReportManifestV2(data) ? data : null;
}

function loadSsotSnapshot(reportDir: string): {
  hashes: Record<string, string>;
  versions: Record<string, string>;
} {
  const snapPath = path.join(reportDir, 'ssot-snapshot.json');
  const hashes: Record<string, string> = {};
  const versions: Record<string, string> = {};
  const data = readJsonSafe(snapPath) as {
    snapshots?: Array<{ ssotId: string; contentHash?: string; versionField?: string | null }>;
  } | null;
  if (!data?.snapshots) return { hashes, versions };
  for (const s of data.snapshots) {
    if (s.contentHash) hashes[s.ssotId] = s.contentHash;
    if (s.versionField) versions[s.ssotId] = s.versionField;
  }
  return { hashes, versions };
}

function entryToLoaded(
  repoRoot: string,
  entry: ReportIndexEntry,
  includeV1: boolean
): LoadedReport | null {
  const manifestAbs = path.resolve(repoRoot, entry.manifestPath);
  if (!fs.existsSync(manifestAbs)) return null;
  const reportDir = path.dirname(manifestAbs);
  const document = readCamcpReportFromDir(reportDir);
  const legacy = !document || document.schemaVersion !== '2.0.0';
  if (legacy && !includeV1) return null;

  const manifest = loadManifest(manifestAbs);
  const snap = loadSsotSnapshot(reportDir);
  const ssotHashes = { ...entry.ssotHash, ...snap.hashes };
  const ssotVersions = manifest?.ssotVersions ?? snap.versions;

  return {
    toolId: entry.toolId,
    facet: entry.facet,
    runId: entry.runId,
    reportDir,
    reportRef: path.join(path.dirname(entry.manifestPath), 'report.json').replace(/\\/g, '/'),
    manifestPath: entry.manifestPath,
    document,
    legacy,
    ssotHashes,
    ssotVersions,
    generatedAt: entry.generatedAt,
    status: entry.status,
    maxSeverity: entry.maxSeverity,
    gitCommit: entry.gitCommit ?? manifest?.git.commit ?? null,
    gitBranch: manifest?.git.branch ?? null,
    missing: !document && !fs.existsSync(path.join(reportDir, 'findings.json')),
  };
}

export function selectIndexEntries(
  entries: ReportIndexEntry[],
  input: HandoffInput,
  now: Date
): ReportIndexEntry[] {
  const cfg = loadHandoffConfig();
  const mode = input.reports?.mode ?? cfg.defaults.reportsMode;
  const maxAgeMs = input.reports?.maxAgeMs ?? cfg.defaults.maxAgeMs;
  const toolIds = input.reports?.toolIds ?? [];
  const runIds = new Set(input.reports?.runIds ?? []);
  const cutoff = now.getTime() - maxAgeMs;

  let filtered = entries.filter((e) => {
    if (e.toolId === 'context.handoff') return false;
    if (new Date(e.generatedAt).getTime() < cutoff) return false;
    return true;
  });

  if (mode === 'explicit') {
    const allowed = new Set(toolIds);
    filtered = filtered.filter((e) => allowed.has(e.toolId));
    if (runIds.size) {
      filtered = filtered.filter((e) => runIds.has(e.runId));
    }
  } else if (mode === 'latest') {
    const latestByTool = new Map<string, ReportIndexEntry>();
    for (const e of filtered) {
      const prev = latestByTool.get(e.toolId);
      if (!prev || new Date(e.generatedAt) > new Date(prev.generatedAt)) {
        latestByTool.set(e.toolId, e);
      }
    }
    filtered = [...latestByTool.values()];
  } else {
    const latestByToolFacet = new Map<string, ReportIndexEntry>();
    for (const e of filtered) {
      const key = `${e.toolId}:${e.facet ?? ''}`;
      const prev = latestByToolFacet.get(key);
      if (!prev || new Date(e.generatedAt) > new Date(prev.generatedAt)) {
        latestByToolFacet.set(key, e);
      }
    }
    filtered = [...latestByToolFacet.values()];
  }

  return filtered.sort(
    (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
  );
}

export function loadReportsForHandoff(
  repoRoot: string,
  config: CamcpConfig,
  input: HandoffInput,
  now: Date = new Date()
): LoadedReport[] {
  const includeV1 = input.reports?.includeV1Reports ?? true;
  const index = readReportIndex(repoRoot, config);
  const selected = selectIndexEntries(index.entries, input, now);
  const loaded: LoadedReport[] = [];
  for (const entry of selected) {
    const report = entryToLoaded(repoRoot, entry, includeV1);
    if (report) loaded.push(report);
  }
  return loaded;
}

export function findLatestHandoffBrief(
  repoRoot: string,
  config: CamcpConfig
): { briefId: string; path: string } | null {
  const index = readReportIndex(repoRoot, config);
  const handoffEntries = index.entries.filter((e) => e.toolId === 'context.handoff');
  if (!handoffEntries.length) return null;
  const latest = handoffEntries[0]!;
  const reportDir = path.dirname(path.resolve(repoRoot, latest.manifestPath));
  const briefPath = path.join(reportDir, 'handoff-brief.json');
  if (!fs.existsSync(briefPath)) return null;
  const data = readJsonSafe(briefPath) as { briefId?: string } | null;
  return {
    briefId: data?.briefId ?? `${latest.runId}:handoff`,
    path: path.relative(repoRoot, briefPath).replace(/\\/g, '/'),
  };
}

export function findLatestGitContextPath(
  repoRoot: string,
  config: CamcpConfig
): string | null {
  const reportsRoot = resolveReportsRoot(repoRoot, config);
  const index = readReportIndex(repoRoot, config);
  const wt = index.entries.find((e) => e.toolId === 'git.worktree');
  if (wt) {
    const ctx = path.join(path.dirname(path.resolve(repoRoot, wt.manifestPath)), 'git-context.json');
    if (fs.existsSync(ctx)) {
      return path.relative(repoRoot, ctx).replace(/\\/g, '/');
    }
  }
  if (!fs.existsSync(reportsRoot)) return null;
  let latest: string | null = null;
  let latestMtime = 0;
  const ns = path.join(reportsRoot, 'git.worktree');
  if (!fs.existsSync(ns)) return null;
  for (const run of fs.readdirSync(ns, { withFileTypes: true })) {
    if (!run.isDirectory()) continue;
    const ctx = path.join(ns, run.name, 'git-context.json');
    if (!fs.existsSync(ctx)) continue;
    const m = fs.statSync(ctx).mtimeMs;
    if (m > latestMtime) {
      latestMtime = m;
      latest = path.relative(repoRoot, ctx).replace(/\\/g, '/');
    }
  }
  return latest;
}
