import fs from 'node:fs';
import path from 'node:path';
import type { CamcpConfig } from '../../policy/permissions.js';
import { getGitCommitShort } from '../../policy/command-guard.js';
import type { ToolDefinition } from '../../registry/tool-definition.js';
import { getCamcpRoot } from '../../config/load-config.js';

/** Process-lifetime build stamp (set once when this module loads). */
export const CAMCP_BUILD_DATE = new Date().toISOString();

export interface CamcpVersionInfo {
  camcpVersion: string;
  packageVersion: string;
  configVersion: string;
  commit: string | null;
  buildDate: string;
  namespaces: string[];
  toolCount: number;
  capabilities: Array<'read-only' | 'report-only' | 'write-capable'>;
  nodeVersion: string;
  platform: NodeJS.Platform;
}

function readPackageVersion(): string {
  try {
    const pkgPath = path.join(getCamcpRoot(), 'package.json');
    const raw = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as { version?: string };
    return raw.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

export function listNamespaces(tools: ToolDefinition[]): string[] {
  return [...new Set(tools.map((t) => t.namespace))].sort();
}

export function listCapabilities(
  tools: ToolDefinition[]
): Array<'read-only' | 'report-only' | 'write-capable'> {
  return [...new Set(tools.map((t) => t.capability))].sort() as Array<
    'read-only' | 'report-only' | 'write-capable'
  >;
}

export function getCamcpVersionInfo(
  repoRoot: string,
  config: CamcpConfig,
  tools: ToolDefinition[]
): CamcpVersionInfo {
  const packageVersion = readPackageVersion();
  return {
    camcpVersion: config.version || packageVersion,
    packageVersion,
    configVersion: config.version,
    commit: getGitCommitShort(repoRoot, config),
    buildDate: CAMCP_BUILD_DATE,
    namespaces: listNamespaces(tools),
    toolCount: tools.length,
    capabilities: listCapabilities(tools),
    nodeVersion: process.version,
    platform: process.platform,
  };
}
