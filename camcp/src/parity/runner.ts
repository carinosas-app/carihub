import type { CamcpConfig } from '../policy/permissions.js';
import type { QaRunResult } from '../qa/report-runner.js';
import {
  qaRunParidadRenderStrict,
  qaRunParidadStatic,
  qaRunParidadVm,
} from '../tools/qa.tools.js';
import { aggregateParityReport, writeCamcpReport } from '../reports/aggregator.js';
import type { CamcpReport } from '../reports/schema.js';
import { listQaEvidencePaths } from './json-read.js';
import { parseParityRenderFindings } from './parsers/render.js';
import { parseParityStaticFindings } from './parsers/static.js';
import { parseParityVmFindings } from './parsers/vm.js';

export interface ParityRunResult {
  ok: boolean;
  qaTool: string;
  qaResult: QaRunResult;
  report: CamcpReport;
  reportPaths: string[];
}

export function runParityStatic(
  repoRoot: string,
  config: CamcpConfig,
  opts: { sector?: string; sub?: string; gitCommit?: string | null } = {}
): ParityRunResult {
  const t0 = Date.now();
  const qaResult = qaRunParidadStatic(repoRoot, config, opts);
  const ok = qaResult.ok;
  const parsed = parseParityStaticFindings(repoRoot, qaResult, ok);
  const report = aggregateParityReport({
    module: 'parity.static',
    qaTool: 'qa.run_paridad_static',
    gitCommit: opts.gitCommit ?? null,
    durationMs: Date.now() - t0,
    summary: parsed.summary,
    findings: parsed.findings,
    evidencePaths: listQaEvidencePaths(repoRoot, qaResult),
  });
  const reportPaths = writeCamcpReport(repoRoot, config, 'parity.static', report);
  return { ok: report.status === 'PASS', qaTool: 'qa.run_paridad_static', qaResult, report, reportPaths };
}

export function runParityVm(
  repoRoot: string,
  config: CamcpConfig,
  opts: {
    sector?: string;
    sub?: string;
    maxSubs?: number;
    failFast?: boolean;
    gitCommit?: string | null;
  } = {}
): ParityRunResult {
  const t0 = Date.now();
  const qaResult = qaRunParidadVm(repoRoot, config, opts);
  const ok = qaResult.ok;
  const parsed = parseParityVmFindings(repoRoot, qaResult, ok);
  const report = aggregateParityReport({
    module: 'parity.vm',
    qaTool: 'qa.run_paridad_vm',
    gitCommit: opts.gitCommit ?? null,
    durationMs: Date.now() - t0,
    summary: parsed.summary,
    findings: parsed.findings,
    evidencePaths: listQaEvidencePaths(repoRoot, qaResult),
  });
  const reportPaths = writeCamcpReport(repoRoot, config, 'parity.vm', report);
  return { ok: report.status === 'PASS', qaTool: 'qa.run_paridad_vm', qaResult, report, reportPaths };
}

export function runParityRenderStrict(
  repoRoot: string,
  config: CamcpConfig,
  opts: { sub?: string; compareWith?: string; gitCommit?: string | null } = {}
): ParityRunResult {
  const t0 = Date.now();
  const qaResult = qaRunParidadRenderStrict(repoRoot, config, opts);
  const ok = qaResult.ok;
  const parsed = parseParityRenderFindings(repoRoot, qaResult, ok);
  const report = aggregateParityReport({
    module: 'parity.render_strict',
    qaTool: 'qa.run_paridad_render_strict',
    gitCommit: opts.gitCommit ?? null,
    durationMs: Date.now() - t0,
    summary: parsed.summary,
    findings: parsed.findings,
    evidencePaths: listQaEvidencePaths(repoRoot, qaResult),
    extra: { coveragePercent: parsed.coveragePercent },
  });
  const reportPaths = writeCamcpReport(repoRoot, config, 'parity.render_strict', report);
  return { ok: report.status === 'PASS', qaTool: 'qa.run_paridad_render_strict', qaResult, report, reportPaths };
}
