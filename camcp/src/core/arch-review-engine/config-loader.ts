import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export interface ArchReviewConfig {
  version: string;
  schemaVersion: string;
  defaults: {
    maxFindingsPerFacet: number;
    maxAgeMs: number;
    gitContextMaxAgeMs: number;
    failOnBlocker: boolean;
  };
  delegation: Record<string, { toolId: string; module: string }>;
  handoffPriorities: string[];
  archReviewHealthGraph: Record<string, { dependsOn: string[] }>;
}

let cached: ArchReviewConfig | null = null;

function configPath(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, '../../../config/arch-review.config.json');
}

export function loadArchReviewConfig(): ArchReviewConfig {
  if (cached) return cached;
  cached = JSON.parse(fs.readFileSync(configPath(), 'utf8')) as ArchReviewConfig;
  return cached;
}

export function resetArchReviewConfigCache(): void {
  cached = null;
}
