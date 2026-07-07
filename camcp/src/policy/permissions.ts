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
    durationMs: number;
    gitCommit: string | null;
    timestamp: string;
    repoRoot: string;
  };
  error?: { code: string; message: string };
}

export function assertReadOnlyMode(config: CamcpConfig): void {
  if (config.mode !== 'read-only') {
    throw new Error(`CAMCP Fase 1 only supports mode=read-only (got ${config.mode})`);
  }
}

export function allToolsReadOnly(tools: ToolMeta[]): boolean {
  return tools.every((t) => t.capability === 'read-only');
}
