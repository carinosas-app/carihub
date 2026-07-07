import fs from 'node:fs';
import path from 'node:path';
import type { QaRunResult } from '../qa/report-runner.js';

export function readJsonSafe<T = unknown>(filePath: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
  } catch {
    return null;
  }
}

export function qaReportDirAbs(repoRoot: string, qaResult: QaRunResult): string {
  return path.resolve(repoRoot, qaResult.manifest.reportDir);
}

export function readQaArtifact<T = unknown>(
  repoRoot: string,
  qaResult: QaRunResult,
  fileName: string
): T | null {
  const full = path.join(qaReportDirAbs(repoRoot, qaResult), fileName);
  if (!fs.existsSync(full)) return null;
  return readJsonSafe<T>(full);
}

export function listQaEvidencePaths(repoRoot: string, qaResult: QaRunResult): string[] {
  return qaResult.reportFiles.slice(0, 20);
}
