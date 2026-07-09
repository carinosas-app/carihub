import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export interface ProfileConfig {
  version: string;
  schemaVersion: string;
  defaults: {
    strictRender: boolean;
    includePrivacy: boolean;
    maxFindingsPerFacet: number;
    maxAgeMs: number;
    failOnBlocker: boolean;
  };
  ssot: {
    schemaIndexPath: string;
    perfilPublicoPath: string;
    supportedVersions: string[];
  };
  delegation: Record<
    string,
    { toolId: string; module: string }
  >;
  handoffPriorities: string[];
  profileHealthGraph: Record<string, { dependsOn: string[] }>;
  lifecycleRuleset: {
    rulesetId: string;
    nestedPerfilKeysBySector: Record<string, string[]>;
  };
  verificationRuleset: {
    rulesetId: string;
    professionalArquetipos: string[];
    cedulaRequiredSectors: string[];
  };
  reservedFacets: Record<string, { code: string; message: string }>;
}

let cached: ProfileConfig | null = null;

function configPath(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, '../../../config/profile.config.json');
}

export function loadProfileConfig(): ProfileConfig {
  if (cached) return cached;
  cached = JSON.parse(fs.readFileSync(configPath(), 'utf8')) as ProfileConfig;
  return cached;
}

export function resetProfileConfigCache(): void {
  cached = null;
}
