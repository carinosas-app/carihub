import type { QaRunResult } from '../../qa/report-runner.js';
import { parseStdoutCheckFindings } from './stdout-checks.js';

export function parseDataPersistFindings(repoRoot: string, qaResult: QaRunResult, ok: boolean) {
  return parseStdoutCheckFindings(repoRoot, qaResult, ok, {
    idPrefix: 'DATA-PERSIST',
    label: 'P0 persist-privacy audit',
  });
}
