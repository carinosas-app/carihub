import fs from 'node:fs';
import path from 'node:path';
import type { CamcpConfig } from '../policy/permissions.js';
import { assertReportWritePathAllowed } from '../policy/path-guard.js';
import { resolveReportsRoot } from '../qa/report-runner.js';
import { INDEX_MAX_ENTRIES, REPORT_SCHEMA_VERSION } from './constants.js';
import type { ReportIndexDocument, ReportIndexEntry } from './schema.js';

function readIndexSafe(indexPath: string): ReportIndexDocument {
  try {
    const raw = JSON.parse(fs.readFileSync(indexPath, 'utf8')) as ReportIndexDocument;
    if (raw.schemaVersion === REPORT_SCHEMA_VERSION && Array.isArray(raw.entries)) return raw;
  } catch {
    /* new index */
  }
  return {
    schemaVersion: REPORT_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    maxEntries: INDEX_MAX_ENTRIES,
    entries: [],
  };
}

export function upsertReportIndex(
  repoRoot: string,
  config: CamcpConfig,
  entry: ReportIndexEntry
): string {
  const reportsRoot = resolveReportsRoot(repoRoot, config);
  const indexPath = path.join(reportsRoot, 'index.json');
  assertReportWritePathAllowed(repoRoot, indexPath, config);

  const index = readIndexSafe(indexPath);
  index.entries = index.entries.filter((e) => e.manifestPath !== entry.manifestPath);
  index.entries.unshift(entry);
  if (index.entries.length > index.maxEntries) {
    index.entries = index.entries.slice(0, index.maxEntries);
  }
  index.updatedAt = new Date().toISOString();
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf8');
  return path.relative(repoRoot, indexPath).replace(/\\/g, '/');
}

export function readReportIndex(repoRoot: string, config: CamcpConfig): ReportIndexDocument {
  const indexPath = path.join(resolveReportsRoot(repoRoot, config), 'index.json');
  if (!fs.existsSync(indexPath)) {
    return {
      schemaVersion: REPORT_SCHEMA_VERSION,
      updatedAt: new Date().toISOString(),
      maxEntries: INDEX_MAX_ENTRIES,
      entries: [],
    };
  }
  return readIndexSafe(indexPath);
}
