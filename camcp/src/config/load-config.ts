import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CamcpConfig } from '../policy/permissions.js';

const CAMCP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export function loadConfig(): CamcpConfig {
  const configPath = path.join(CAMCP_ROOT, 'config', 'camcp.config.json');
  const raw = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(raw) as CamcpConfig;
}

export function resolveRepoRoot(config: CamcpConfig): string {
  const envName = config.repoRootEnv || 'CARIHUB_REPO_ROOT';
  const fromEnv = process.env[envName]?.trim();
  if (fromEnv) {
    return path.resolve(fromEnv);
  }
  // camcp/ is one level below repo root
  return path.resolve(CAMCP_ROOT, '..');
}

export function getCamcpRoot(): string {
  return CAMCP_ROOT;
}
