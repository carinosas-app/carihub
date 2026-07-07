import type { ReportFinding } from '../../reports/schema.js';
import type { QaRunResult } from '../../qa/report-runner.js';
import fs from 'node:fs';
import path from 'node:path';
import { qaReportDirAbs } from '../json-read.js';

function readStdout(repoRoot: string, qaResult: QaRunResult): string {
  const rel = qaResult.manifest.stdoutPath;
  if (!rel) return qaResult.stdout ?? '';
  const abs = path.resolve(repoRoot, rel);
  if (fs.existsSync(abs)) return fs.readFileSync(abs, 'utf8');
  return qaResult.stdout ?? '';
}

/** Parse QA scripts that emit PASS/FAIL counts and ✓/✗ lines to stdout (no pipeline logic). */
export function parseStdoutCheckFindings(
  repoRoot: string,
  qaResult: QaRunResult,
  ok: boolean,
  opts: { idPrefix: string; label: string }
): { findings: ReportFinding[]; summary: string } {
  const text = readStdout(repoRoot, qaResult);
  const passMatch = text.match(/PASS:\s*(\d+)/);
  const failMatch = text.match(/FAIL:\s*(\d+)/);
  const passCount = passMatch ? Number(passMatch[1]) : null;
  const failCount = failMatch ? Number(failMatch[1]) : null;
  const findings: ReportFinding[] = [];

  const failLines = text.split('\n').filter((l) => l.includes('✗'));
  for (const [i, line] of failLines.slice(0, 12).entries()) {
    const cleaned = line.replace(/^\s*✗\s*/, '').trim();
    findings.push({
      id: `${opts.idPrefix}-FAIL-${i + 1}`,
      severity: 'IMPORTANTE',
      message: cleaned || 'check failed',
      evidence: qaResult.manifest.reportDir,
    });
  }

  if ((failCount ?? 0) > 0 && failLines.length === 0) {
    findings.push({
      id: `${opts.idPrefix}-FAIL-COUNT`,
      severity: 'IMPORTANTE',
      message: `${failCount} check(s) FAIL in ${opts.label}`,
      evidence: qaResult.manifest.reportDir,
    });
  }

  if (!ok) {
    findings.push({
      id: `${opts.idPrefix}-EXIT`,
      severity: 'IMPORTANTE',
      message: `${opts.label} exit=${qaResult.manifest.exitCode}`,
      evidence: qaReportDirAbs(repoRoot, qaResult),
    });
  }

  if (findings.length === 0) {
    findings.push({
      id: `${opts.idPrefix}-PASS`,
      severity: 'PASS',
      message: `${opts.label} PASS`,
    });
  }

  const summary =
    passCount != null && failCount != null
      ? `${opts.label}: ${passCount} pass, ${failCount} fail (exit ${qaResult.manifest.exitCode}).`
      : `${opts.label} delegated (exit ${qaResult.manifest.exitCode}).`;

  return { findings, summary };
}
