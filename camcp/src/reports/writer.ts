import fs from 'node:fs';
import path from 'node:path';
import type { CamcpConfig } from '../policy/permissions.js';
import { assertReportWritePathAllowed } from '../policy/path-guard.js';
import { makeReportRunDir } from '../qa/report-runner.js';
import type { CamcpReport, ReportFinding } from './schema.js';
import { maxSeverity, statusFromSeverity } from './schema.js';

function makeRunId(): string {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

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
        `| ${f.id} | ${f.severity} | ${f.message.replace(/\|/g, '/')} | ${f.impact ?? '-'} | ${f.recommendation ?? '-'} |`
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

export function writeCamcpReport(
  repoRoot: string,
  config: CamcpConfig,
  toolName: string,
  report: CamcpReport
): string[] {
  const { reportDir } = makeReportRunDir(repoRoot, config, toolName);
  const reportMd = path.join(reportDir, 'report.md');
  const findingsJson = path.join(reportDir, 'findings.json');
  const summaryJson = path.join(reportDir, 'summary.json');

  for (const p of [reportMd, findingsJson, summaryJson]) {
    assertReportWritePathAllowed(repoRoot, p, config);
  }

  fs.writeFileSync(reportMd, renderReportMarkdown(report), 'utf8');
  fs.writeFileSync(findingsJson, JSON.stringify(report.findings, null, 2), 'utf8');
  fs.writeFileSync(
    summaryJson,
    JSON.stringify(
      {
        module: report.module,
        status: report.status,
        maxSeverity: report.maxSeverity,
        runId: report.runId,
        findingCount: report.findings.length,
      },
      null,
      2
    ),
    'utf8'
  );

  return [
    path.relative(repoRoot, reportMd).replace(/\\/g, '/'),
    path.relative(repoRoot, findingsJson).replace(/\\/g, '/'),
    path.relative(repoRoot, summaryJson).replace(/\\/g, '/'),
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
  const maxSev = maxSeverity(input.findings.length ? input.findings : [{ id: 'PASS', severity: 'PASS', message: 'OK' }]);
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
