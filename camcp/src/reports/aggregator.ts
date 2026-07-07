import type { CamcpReport, ReportFinding } from './schema.js';
import { buildReportFromFindings } from './writer.js';
import type { ImpactAnalysis } from '../intelligence/types.js';

export function aggregateImpactReport(input: {
  analysis: ImpactAnalysis;
  gitCommit: string | null;
  durationMs: number;
}): CamcpReport {
  const findings: ReportFinding[] = input.analysis.findings.map((f) => ({
    id: f.id,
    severity: f.severity,
    message: f.message,
    impact: f.domain,
    recommendation:
      f.recommendedModules.length > 0
        ? `Run intel.run_module: ${f.recommendedModules.join(', ')}`
        : undefined,
  }));

  return buildReportFromFindings({
    module: 'intel.impact',
    gitCommit: input.gitCommit,
    durationMs: input.durationMs,
    summary: `Impact analysis ${input.analysis.range}: ${input.analysis.changedFiles.length} file(s), ${input.analysis.affectedDomains.length} domain(s) affected.`,
    findings,
    suggestedQa: input.analysis.recommendedModules.map((m) => `intel.run_module ${m}`),
  });
}

export function aggregateQaRunIntoReport(input: {
  module: string;
  qaTool: string;
  qaResult: unknown;
  ok: boolean;
  durationMs: number;
  gitCommit: string | null;
}): CamcpReport {
  const manifest = (input.qaResult as { manifest?: { reportDir?: string; exitCode?: number } }).manifest;
  const findings: ReportFinding[] = [
    {
      id: 'QA-RUN-1',
      severity: input.ok ? 'PASS' : 'IMPORTANTE',
      message: `${input.qaTool} exit=${manifest?.exitCode ?? 'unknown'}`,
      impact: input.ok ? 'None' : 'QA failure',
      recommendation: input.ok ? undefined : 'Review stdout/stderr in report dir',
      evidence: manifest?.reportDir,
    },
  ];

  return buildReportFromFindings({
    module: input.module,
    gitCommit: input.gitCommit,
    durationMs: input.durationMs,
    summary: `Delegated to ${input.qaTool}. Status: ${input.ok ? 'PASS' : 'FAIL'}.`,
    findings,
    evidencePaths: manifest?.reportDir ? [manifest.reportDir] : [],
  });
}

export { writeCamcpReport } from './writer.js';
