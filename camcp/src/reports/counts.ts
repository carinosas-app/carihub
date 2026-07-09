import type { ReportSeverity } from '../intelligence/types.js';
import type { FindingCounts, ReportFindingNormalized } from './schema.js';

const SEVERITIES: ReportSeverity[] = ['BLOQUEADOR', 'IMPORTANTE', 'WARNING', 'INFO', 'PASS'];

export function countFindings(findings: ReportFindingNormalized[]): FindingCounts {
  const counts: FindingCounts = {
    total: findings.length,
    bloqueador: 0,
    importante: 0,
    warning: 0,
    info: 0,
    pass: 0,
  };
  for (const f of findings) {
    switch (f.severity) {
      case 'BLOQUEADOR':
        counts.bloqueador += 1;
        break;
      case 'IMPORTANTE':
        counts.importante += 1;
        break;
      case 'WARNING':
        counts.warning += 1;
        break;
      case 'INFO':
        counts.info += 1;
        break;
      case 'PASS':
        counts.pass += 1;
        break;
      default:
        break;
    }
  }
  return counts;
}

export function maxSeverityFromFindings(findings: ReportFindingNormalized[]): ReportSeverity {
  for (const s of SEVERITIES) {
    if (findings.some((f) => f.severity === s)) return s;
  }
  return 'PASS';
}
