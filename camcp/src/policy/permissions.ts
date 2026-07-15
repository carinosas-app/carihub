export type ToolCapability = 'read-only' | 'report-only' | 'write-capable';

export interface CamcpConfig {
  version: string;
  mode: 'read-only' | 'report-only' | 'full';
  repoRootEnv: string;
  reportsDir: string;
  denyWritePaths: string[];
  denyReadPatterns: string[];
  gitAllowedSubcommands: string[];
  filesystemMaxReadBytes: number;
  filesystemMaxSearchResults: number;
  filesystemMaxTreeDepth: number;
  filesystemMaxListEntries: number;
}

export interface ToolMeta {
  name: string;
  capability: ToolCapability;
  description: string;
  namespace: string;
}

export interface CamcpToolResult<T = unknown> {
  ok: boolean;
  capability: ToolCapability;
  data?: T;
  meta: {
    tool: string;
    namespace?: string;
    capability?: ToolCapability;
    camcpVersion?: string;
    durationMs: number;
    gitCommit: string | null;
    timestamp: string;
    repoRoot: string;
    exitCode?: number;
  };
  error?: { code: string; message: string };
}

export function assertReadOnlyMode(config: CamcpConfig): void {
  if (config.mode !== 'read-only' && config.mode !== 'report-only') {
    throw new Error(`CAMCP supports mode=read-only|report-only (got ${config.mode})`);
  }
}

export function allToolsNonDestructive(tools: ToolMeta[]): boolean {
  return tools.every((t) => t.capability === 'read-only' || t.capability === 'report-only');
}

/** @deprecated use allToolsNonDestructive */
export function allToolsReadOnly(tools: ToolMeta[]): boolean {
  return allToolsNonDestructive(tools);
}
