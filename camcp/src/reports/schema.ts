import type { ReportSeverity } from '../intelligence/types.js';

export type ReportStatus = 'PASS' | 'WARNING' | 'FAIL';

export interface ReportFinding {
  id: string;
  severity: ReportSeverity;
  message: string;
  impact?: string;
  recommendation?: string;
  evidence?: string;
}

export interface CamcpReport {
  module: string;
  status: ReportStatus;
  maxSeverity: ReportSeverity;
  runId: string;
  gitCommit: string | null;
  generatedAt: string;
  durationMs: number;
  summary: string;
  findings: ReportFinding[];
  evidencePaths: string[];
  suggestedQa?: string[];
}

export function maxSeverity(findings: ReportFinding[]): ReportSeverity {
  const order: ReportSeverity[] = ['BLOQUEADOR', 'IMPORTANTE', 'WARNING', 'INFO', 'PASS'];
  for (const s of order) {
    if (findings.some((f) => f.severity === s)) return s;
  }
  return 'PASS';
}

export function statusFromSeverity(severity: ReportSeverity): ReportStatus {
  if (severity === 'BLOQUEADOR' || severity === 'IMPORTANTE') return 'FAIL';
  if (severity === 'WARNING') return 'WARNING';
  return 'PASS';
}
