import fs from 'node:fs';
import path from 'node:path';
import type { CamcpConfig } from '../policy/permissions.js';
import { assertReportWritePathAllowed } from '../policy/path-guard.js';
import { makeReportRunDir } from '../qa/report-runner.js';
import { countFindings, maxSeverityFromFindings } from './counts.js';
import { REPORT_SCHEMA_VERSION, SSOT_SNAPSHOT_POLICY } from './constants.js';
import { upsertReportIndex } from './index-manager.js';
import { normalizeFindings } from './normalize.js';
import type {
  CamcpReport,
  CamcpReportDocument,
  EvidenceRef,
  ReportFinding,
  ReportFindingNormalized,
  ReportManifestDocument,
  ReportSummaryDocument,
  SsotSnapshotDocument,
  WriteReportOptions,
} from './schema.js';
import { parseToolNamespace, statusFromSeverity } from './schema.js';

function makeRunId(): string {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

function formatImpactCell(impact: ReportFinding['impact']): string {
  if (!impact) return '-';
  if (typeof impact === 'string') return impact.replace(/\|/g, '/');
  const surfaces = impact.surfaces?.join(', ') ?? '-';
  const flags = [
    impact.blocksMerge ? 'blocksMerge' : null,
    impact.breaksContract ? 'breaksContract' : null,
  ]
    .filter(Boolean)
    .join('; ');
  return flags ? `${surfaces} (${flags})` : surfaces;
}

function formatRecommendationCell(rec: ReportFinding['recommendation']): string {
  if (!rec) return '-';
  if (typeof rec === 'string') return rec.replace(/\|/g, '/');
  return [rec.action, rec.hint].filter(Boolean).join(': ').replace(/\|/g, '/');
}

export function renderReportMarkdownV2(
  doc: CamcpReportDocument,
  toolName: string,
  runId: string
): string {
  const facet = doc.tool.facet;
  const gitLabel = doc.git.commit
    ? `${doc.git.commit}${doc.git.branch ? ` @ ${doc.git.branch}` : ''}`
    : 'n/a';

  const lines = [
    '# CAMCP REPORT v2',
    '',
    '| Campo | Valor |',
    '|-------|-------|',
    `| **Schema** | ${doc.schemaVersion} |`,
    `| **Tool** | ${toolName}${facet ? ` (facet: ${facet})` : ''} |`,
    `| **Estado** | ${doc.status} |`,
    `| **Severidad máxima** | ${doc.maxSeverity} |`,
    `| **Run ID** | ${runId} |`,
    `| **Git** | ${gitLabel} |`,
    `| **Duración** | ${doc.timing.durationMs}ms |`,
    '',
  ];

  if (doc.ssot.snapshots.length) {
    lines.push('## SSOT referenciados', '');
    for (const s of doc.ssot.snapshots) {
      const ver = s.versionField ? ` @ ${s.versionField}` : '';
      const hash = s.contentHash ? ` (${s.contentHash.slice(0, 20)}…)` : '';
      lines.push(`- ${s.ssotId}${ver}${hash}`);
    }
    lines.push('');
  }

  lines.push('## Resumen', '', doc.summary, '', `## Hallazgos (${doc.counts.total})`, '');

  if (doc.findings.length === 0) {
    lines.push('_Sin hallazgos._', '');
  } else {
    lines.push('| ID | Code | Sev | Conf | Dominio | Título |');
    lines.push('|----|------|-----|------|---------|--------|');
    for (const f of doc.findings) {
      lines.push(
        `| ${f.id} | ${f.code} | ${f.severity} | ${f.confidence} | ${f.domain} | ${f.title.replace(/\|/g, '/')} |`
      );
    }
    lines.push('');
  }

  if (doc.evidence.length) {
    lines.push('## Evidencia', '');
    for (const e of doc.evidence) {
      lines.push(`- [${e.kind}] ${e.path}${e.label ? ` — ${e.label}` : ''}`);
    }
    lines.push('');
  }

  const suggestedTools = doc.suggestedNext.tools ?? [];
  const suggestedQa = doc.suggestedNext.qaModules ?? [];
  if (suggestedTools.length || suggestedQa.length) {
    lines.push('## Siguiente paso sugerido', '');
    for (const t of suggestedTools) lines.push(`- ${t}`);
    for (const q of suggestedQa) lines.push(`- intel.run_module ${q}`);
    lines.push('');
  }

  return lines.join('\n');
}

/** Legacy v1 markdown header for backward-compatible readers. */
export function renderReportMarkdown(report: CamcpReport): string {
  const lines = [
    '# CAMCP REPORT',
    '',
    '| Campo | Valor |',
    '|-------|-------|',
    `| **Módulo** | ${report.module} |`,
    `| **Estado** | ${report.status} |`,
    `| **Severidad máxima** | ${report.maxSeverity} |`,
    `| **Run ID** | ${report.runId} |`,
    `| **Git commit** | ${report.gitCommit ?? 'n/a'} |`,
    `| **Duración** | ${report.durationMs}ms |`,
    '',
    '## Resumen ejecutivo',
    '',
    report.summary,
    '',
    '## Hallazgos',
    '',
  ];

  if (report.findings.length === 0) {
    lines.push('_Sin hallazgos._', '');
  } else {
    lines.push('| ID | Severidad | Hallazgo | Impacto | Recomendación |');
    lines.push('|----|-----------|----------|---------|---------------|');
    for (const f of report.findings) {
      lines.push(
        `| ${f.id} | ${f.severity} | ${f.message.replace(/\|/g, '/')} | ${formatImpactCell(f.impact)} | ${formatRecommendationCell(f.recommendation)} |`
      );
    }
    lines.push('');
  }

  if (report.suggestedQa?.length) {
    lines.push('## QA sugerido', '', report.suggestedQa.map((q) => `- ${q}`).join('\n'), '');
  }

  if (report.evidencePaths.length) {
    lines.push('## Evidencia', '', ...report.evidencePaths.map((p) => `- ${p}`), '');
  }

  return lines.join('\n');
}

function collectEvidenceRefs(
  findings: ReportFindingNormalized[],
  evidencePaths: string[]
): EvidenceRef[] {
  const seen = new Set<string>();
  const refs: EvidenceRef[] = [];

  for (const f of findings) {
    for (const e of f.evidence) {
      const key = `${e.kind}|${e.path}`;
      if (seen.has(key)) continue;
      seen.add(key);
      refs.push(e);
    }
  }

  for (const p of evidencePaths) {
    const key = `file|${p}`;
    if (seen.has(key)) continue;
    seen.add(key);
    refs.push({ kind: 'file', path: p, label: 'Report evidence path' });
  }

  return refs;
}

function buildSsotSnapshot(
  report: CamcpReport,
  options: WriteReportOptions | undefined,
  gitCommit: string | null
): SsotSnapshotDocument {
  if (options?.ssot) return options.ssot;
  const snapshots = report.ssot?.snapshots ?? [];
  return {
    schemaVersion: REPORT_SCHEMA_VERSION,
    capturedAt: report.generatedAt,
    gitCommit,
    snapshots,
    policy: SSOT_SNAPSHOT_POLICY,
  };
}

function ssotVersionsFromSnapshot(snapshot: SsotSnapshotDocument): Record<string, string> {
  const out: Record<string, string> = {};
  for (const s of snapshot.snapshots) {
    out[s.ssotId] = s.versionField ?? s.contentHash ?? 'unknown';
  }
  return out;
}

function ssotHashesFromSnapshot(snapshot: SsotSnapshotDocument): Record<string, string> {
  const out: Record<string, string> = {};
  for (const s of snapshot.snapshots) {
    if (s.contentHash) out[s.ssotId] = s.contentHash;
  }
  return out;
}

export function buildCamcpReportDocument(
  toolName: string,
  runId: string,
  report: CamcpReport,
  options?: WriteReportOptions
): CamcpReportDocument {
  const facet = options?.facet ?? report.tool?.facet ?? null;
  const capability = options?.capability ?? report.tool?.capability ?? 'report-only';
  const normalized = normalizeFindings(report.findings, {
    toolId: toolName,
    defaultCategory: facet ?? report.module,
  });
  const counts = countFindings(normalized);
  const maxSev = maxSeverityFromFindings(normalized);
  const status = statusFromSeverity(maxSev);
  const ssotSnapshot = buildSsotSnapshot(report, options, report.gitCommit);
  const evidence = collectEvidenceRefs(normalized, report.evidencePaths);
  const domains = options?.domains ?? report.domains ?? [parseToolNamespace(toolName).toUpperCase()];

  const provenance = options?.provenance ??
    report.provenance ?? {
      engines: [{ id: 'reports-engine', version: REPORT_SCHEMA_VERSION }],
    };

  const suggestedNext = options?.suggestedNext ??
    report.suggestedNext ?? {
      tools: [],
      qaModules: report.suggestedQa ?? [],
    };

  const git = {
    commit: options?.git?.commit ?? report.git?.commit ?? report.gitCommit,
    branch: options?.git?.branch ?? report.git?.branch ?? null,
    worktreeId: options?.git?.worktreeId ?? report.git?.worktreeId ?? null,
  };

  return {
    $schema: 'https://carihub.local/camcp/schemas/camcp-report@2.0.0.json',
    schemaVersion: REPORT_SCHEMA_VERSION,
    reportId: `${runId}:${toolName}${facet ? `:${facet}` : ''}`,
    tool: {
      id: toolName,
      namespace: parseToolNamespace(toolName),
      facet,
      capability,
    },
    status,
    maxSeverity: maxSev,
    counts,
    summary: report.summary,
    findings: normalized,
    domains,
    ssot: {
      snapshots: ssotSnapshot.snapshots,
      reusePolicy: SSOT_SNAPSHOT_POLICY,
    },
    provenance,
    evidence,
    suggestedNext,
    git,
    timing: {
      generatedAt: report.generatedAt,
      durationMs: report.durationMs,
      runId,
    },
  };
}

export function writeCamcpReport(
  repoRoot: string,
  config: CamcpConfig,
  toolName: string,
  report: CamcpReport,
  options?: WriteReportOptions
): string[] {
  const { runId, reportDir } = makeReportRunDir(repoRoot, config, toolName);
  const doc = buildCamcpReportDocument(toolName, runId, report, options);
  const ssotSnapshot = buildSsotSnapshot(report, options, report.gitCommit);

  const reportJson = path.join(reportDir, 'report.json');
  const manifestJson = path.join(reportDir, 'manifest.json');
  const findingsJson = path.join(reportDir, 'findings.json');
  const summaryJson = path.join(reportDir, 'summary.json');
  const ssotSnapshotJson = path.join(reportDir, 'ssot-snapshot.json');
  const reportMd = path.join(reportDir, 'report.md');

  for (const p of [reportJson, manifestJson, findingsJson, summaryJson, ssotSnapshotJson, reportMd]) {
    assertReportWritePathAllowed(repoRoot, p, config);
  }

  const manifest: ReportManifestDocument = {
    schemaVersion: REPORT_SCHEMA_VERSION,
    runId,
    toolId: toolName,
    facet: doc.tool.facet,
    capability: doc.tool.capability,
    status: doc.status,
    maxSeverity: doc.maxSeverity,
    generatedAt: doc.timing.generatedAt,
    durationMs: doc.timing.durationMs,
    git: doc.git,
    engines: doc.provenance.engines.map((e) => e.id),
    ssotVersions: ssotVersionsFromSnapshot(ssotSnapshot),
    artifacts: {
      reportJson: 'report.json',
      findingsJson: 'findings.json',
      summaryJson: 'summary.json',
      reportMd: 'report.md',
      ssotSnapshot: 'ssot-snapshot.json',
    },
    delegatedRuns: options?.delegatedRuns ?? [],
  };

  const summary: ReportSummaryDocument = {
    schemaVersion: REPORT_SCHEMA_VERSION,
    module: report.module,
    toolId: toolName,
    facet: doc.tool.facet,
    status: doc.status,
    maxSeverity: doc.maxSeverity,
    runId,
    findingCount: doc.counts.total,
    counts: doc.counts,
    gitCommit: doc.git.commit,
    generatedAt: doc.timing.generatedAt,
  };

  fs.writeFileSync(reportJson, JSON.stringify(doc, null, 2), 'utf8');
  fs.writeFileSync(manifestJson, JSON.stringify(manifest, null, 2), 'utf8');
  fs.writeFileSync(findingsJson, JSON.stringify(doc.findings, null, 2), 'utf8');
  fs.writeFileSync(summaryJson, JSON.stringify(summary, null, 2), 'utf8');
  fs.writeFileSync(ssotSnapshotJson, JSON.stringify(ssotSnapshot, null, 2), 'utf8');
  fs.writeFileSync(reportMd, renderReportMarkdownV2(doc, toolName, runId), 'utf8');

  const manifestRel = path.relative(repoRoot, manifestJson).replace(/\\/g, '/');
  upsertReportIndex(repoRoot, config, {
    runId,
    toolId: toolName,
    facet: doc.tool.facet,
    status: doc.status,
    maxSeverity: doc.maxSeverity,
    gitCommit: doc.git.commit,
    ssotHash: ssotHashesFromSnapshot(ssotSnapshot),
    manifestPath: manifestRel,
    generatedAt: doc.timing.generatedAt,
  });

  return [
    path.relative(repoRoot, reportMd).replace(/\\/g, '/'),
    path.relative(repoRoot, reportJson).replace(/\\/g, '/'),
    path.relative(repoRoot, manifestJson).replace(/\\/g, '/'),
    path.relative(repoRoot, findingsJson).replace(/\\/g, '/'),
    path.relative(repoRoot, summaryJson).replace(/\\/g, '/'),
    path.relative(repoRoot, ssotSnapshotJson).replace(/\\/g, '/'),
  ];
}

export function buildReportFromFindings(input: {
  module: string;
  runId?: string;
  gitCommit: string | null;
  durationMs: number;
  summary: string;
  findings: ReportFinding[];
  evidencePaths?: string[];
  suggestedQa?: string[];
}): CamcpReport {
  const findings = input.findings.length
    ? input.findings
    : [{ id: 'PASS', severity: 'PASS' as const, message: 'OK' }];
  const normalized = normalizeFindings(findings, { toolId: input.module, defaultCategory: input.module });
  const maxSev = maxSeverityFromFindings(normalized);
  return {
    module: input.module,
    status: statusFromSeverity(maxSev),
    maxSeverity: maxSev,
    runId: input.runId ?? makeRunId(),
    gitCommit: input.gitCommit,
    generatedAt: new Date().toISOString(),
    durationMs: input.durationMs,
    summary: input.summary,
    findings: input.findings,
    evidencePaths: input.evidencePaths ?? [],
    suggestedQa: input.suggestedQa,
  };
}
