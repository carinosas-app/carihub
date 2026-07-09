import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export interface HandoffConfig {
  version: string;
  schemaVersion: string;
  defaults: {
    minSeverity: string;
    includeWarnings: boolean;
    includeHypothesis: boolean;
    maxOpenFindings: number;
    maxOpenFindingsContinuation: number;
    maxAgeMs: number;
    reportsMode: string;
    contextBudget: {
      maxEstimatedTokens: number;
      warnThreshold: number;
      criticalThreshold: number;
    };
  };
  forbiddenActionDefaults: string[];
  suggestedToolChainMax: number;
}

let cached: HandoffConfig | null = null;

function configPath(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, '../../../config/handoff.config.json');
}

export function loadHandoffConfig(): HandoffConfig {
  if (cached) return cached;
  cached = JSON.parse(fs.readFileSync(configPath(), 'utf8')) as HandoffConfig;
  return cached;
}
