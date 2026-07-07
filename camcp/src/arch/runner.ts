import type { CamcpConfig } from '../policy/permissions.js';
import { runGitAllowed } from '../policy/command-guard.js';
import { aggregateArchReport, writeCamcpReport } from '../reports/aggregator.js';
import type { CamcpReport, ReportFinding } from '../reports/schema.js';
import { checkDomainBoundaries } from './boundary-checker.js';
import { loadArchConfig } from './config-loader.js';
import { scanDuplicates } from './duplicate-scanner.js';
import { loadFrozenPathsFromSsot, pathMatchesFrozen } from './frozen-registry.js';

export interface ArchReportRunResult {
  ok: boolean;
  report: CamcpReport;
  reportPaths: string[];
  extra?: Record<string, unknown>;
}

function changedFilesFromDiff(repoRoot: string, config: CamcpConfig, base: string, head: string): string[] {
  const range = `${base}...${head}`;
  const diff = runGitAllowed(repoRoot, 'diff', ['--name-only', range], config);
  return diff.stdout
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean);
}

export function runArchFrozenViolations(
  repoRoot: string,
  config: CamcpConfig,
  opts: { base?: string; head?: string; includeCamcpFrozen?: boolean; gitCommit?: string | null } = {}
): ArchReportRunResult {
  const t0 = Date.now();
  const archConfig = loadArchConfig();
  const toolCfg = archConfig.tools['arch.frozen_violations']!;
  const base = opts.base ?? 'origin/main';
  const head = opts.head ?? 'HEAD';
  const frozenPaths = loadFrozenPathsFromSsot(repoRoot, toolCfg);
  const changed = changedFilesFromDiff(repoRoot, config, base, head);

  const findings: ReportFinding[] = [];
  let violationCount = 0;

  for (const file of changed) {
    for (const frozen of frozenPaths) {
      if (!pathMatchesFrozen(file, frozen)) continue;
      violationCount++;
      findings.push({
        id: `ARCH-FROZEN-${String(violationCount).padStart(3, '0')}`,
        severity: 'BLOQUEADOR',
        message: `Cambio en módulo congelado: ${file}`,
        impact: frozen.source,
        evidence: frozen.path,
        recommendation: 'Revertir cambio o obtener autorización explícita (ACTA)',
      });
      break;
    }
  }

  if (findings.length === 0) {
    findings.push({
      id: 'ARCH-FROZEN-OK',
      severity: 'PASS',
      message: `Sin violaciones frozen en ${changed.length} archivo(s) cambiado(s) (${base}...${head})`,
    });
  }

  const summary = `Frozen audit: ${frozenPaths.length} path(s) SSOT, ${changed.length} changed, ${violationCount} violation(s).`;
  const report = aggregateArchReport({
    module: 'arch.frozen_violations',
    gitCommit: opts.gitCommit ?? null,
    durationMs: Date.now() - t0,
    summary,
    findings,
    evidencePaths: [`${base}...${head}`],
    ssot: toolCfg.ssot,
  });
  const reportPaths = writeCamcpReport(repoRoot, config, 'arch.frozen_violations', report);

  return {
    ok: report.status === 'PASS',
    report,
    reportPaths,
    extra: { changedFiles: changed, frozenPathCount: frozenPaths.length, violations: violationCount },
  };
}

export function runArchScanDuplicates(
  repoRoot: string,
  config: CamcpConfig,
  opts: { scope?: string[]; minSimilarity?: number; gitCommit?: string | null } = {}
): ArchReportRunResult {
  const t0 = Date.now();
  const archConfig = loadArchConfig();
  const toolCfg = archConfig.tools['arch.scan_duplicates']!;
  const parsed = scanDuplicates(repoRoot, config, {
    scope: opts.scope ?? toolCfg.defaultScope,
    patterns: toolCfg.patterns,
    minSimilarity: opts.minSimilarity,
  });

  const report = aggregateArchReport({
    module: 'arch.scan_duplicates',
    gitCommit: opts.gitCommit ?? null,
    durationMs: Date.now() - t0,
    summary: parsed.summary,
    findings: parsed.findings,
    ssot: toolCfg.ssot,
  });
  const reportPaths = writeCamcpReport(repoRoot, config, 'arch.scan_duplicates', report);

  return {
    ok: report.status === 'PASS' || report.status === 'WARNING',
    report,
    reportPaths,
  };
}

export function runArchDomainBoundaries(
  repoRoot: string,
  _config: CamcpConfig,
  opts: { domain?: string } = {}
): { ok: boolean; data: ReturnType<typeof checkDomainBoundaries>; ssot: string[] } {
  const archConfig = loadArchConfig();
  const toolCfg = archConfig.tools['arch.domain_boundaries']!;
  const result = checkDomainBoundaries(repoRoot, opts);
  const ok = !result.findings.some((f) => f.severity === 'BLOQUEADOR' || f.severity === 'IMPORTANTE');
  return { ok, data: result, ssot: toolCfg.ssot ?? [] };
}
