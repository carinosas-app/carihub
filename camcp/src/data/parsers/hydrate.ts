import type { QaRunResult } from '../../qa/report-runner.js';
import { parseStdoutCheckFindings } from './stdout-checks.js';

export function parseDataHydrateFindings(repoRoot: string, qaResult: QaRunResult, ok: boolean) {
  return parseStdoutCheckFindings(repoRoot, qaResult, ok, {
    idPrefix: 'DATA-HYDRATE',
    label: 'Submit-hydrate read-path audit',
  });
}
