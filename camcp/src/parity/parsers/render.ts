import type { ReportFinding } from '../../reports/schema.js';
import type { QaRunResult } from '../../qa/report-runner.js';
import { readQaArtifact } from '../json-read.js';

interface RenderSummary {
  summary?: {
    totalSubs?: number;
    subsPass?: number;
    subsFail?: number;
    strictMode?: boolean;
    coverageNote?: string;
  };
  strictComparison?: { rows?: unknown[] };
}

interface RenderFailure {
  subcategoriaId?: string;
  reason?: string;
  stage?: string;
  strictMode?: boolean;
}

export function parseParityRenderFindings(
  repoRoot: string,
  qaResult: QaRunResult,
  ok: boolean
): { findings: ReportFinding[]; summary: string; coveragePercent?: number } {
  const render = readQaArtifact<RenderSummary>(repoRoot, qaResult, 'render-summary.json');
  const failures = readQaArtifact<RenderFailure[]>(repoRoot, qaResult, 'failures-render.json') ?? [];
  const findings: ReportFinding[] = [];
  const rs = render?.summary;

  if ((rs?.subsFail ?? 0) > 0) {
    findings.push({
      id: 'PARITY-RENDER-FAIL',
      severity: 'IMPORTANTE',
      message: `${rs!.subsFail}/${rs!.totalSubs ?? '?'} sub(s) FAIL en render strict`,
      impact: 'Perfil público DOM no coincide con pipeline VM',
      recommendation: 'Revisar failures-render.json y screenshots',
    });
  }

  for (const [i, f] of failures.slice(0, 12).entries()) {
    findings.push({
      id: `PARITY-RENDER-F${i + 1}`,
      severity: 'IMPORTANTE',
      message: `${f.subcategoriaId ?? '?'}: ${f.reason ?? f.stage ?? 'render fail'}`,
    });
  }

  if (failures.length > 12) {
    findings.push({
      id: 'PARITY-RENDER-MORE',
      severity: 'INFO',
      message: `${failures.length - 12} render failure(s) adicionales en failures-render.json`,
    });
  }

  if (!ok && !findings.some((f) => f.severity === 'IMPORTANTE' || f.severity === 'BLOQUEADOR')) {
    findings.push({
      id: 'PARITY-RENDER-EXIT',
      severity: 'IMPORTANTE',
      message: `qa.run_paridad_render_strict exit=${qaResult.manifest.exitCode}`,
      evidence: qaResult.manifest.reportDir,
    });
  }

  if (findings.length === 0) {
    findings.push({
      id: 'PARITY-RENDER-PASS',
      severity: 'PASS',
      message: 'Render strict parity PASS for scoped run',
    });
  }

  const total = rs?.totalSubs ?? 0;
  const pass = rs?.subsPass ?? 0;
  const coveragePercent = total > 0 ? Math.round((pass / total) * 100) : undefined;

  const summary = rs
    ? `Render strict: ${pass}/${total} pass (strict=${rs.strictMode !== false}), coverage≈${coveragePercent ?? 'n/a'}%.`
    : `Render strict delegated to qa.run_paridad_render_strict (exit ${qaResult.manifest.exitCode}).`;

  return { findings, summary, coveragePercent };
}
