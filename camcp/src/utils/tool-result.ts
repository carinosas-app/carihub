import type { CamcpToolResult, ToolCapability } from '../policy/permissions.js';
import { getGitCommitShort } from '../policy/command-guard.js';

export function makeToolResult<T>(
  tool: string,
  capability: ToolCapability,
  repoRoot: string,
  gitCommit: string | null,
  started: number,
  data: T
): CamcpToolResult<T> {
  return {
    ok: true,
    capability,
    data,
    meta: {
      tool,
      durationMs: Date.now() - started,
      gitCommit,
      timestamp: new Date().toISOString(),
      repoRoot,
    },
  };
}

export function makeToolError(
  tool: string,
  capability: ToolCapability,
  repoRoot: string,
  gitCommit: string | null,
  started: number,
  code: string,
  message: string
): CamcpToolResult {
  return {
    ok: false,
    capability,
    meta: {
      tool,
      durationMs: Date.now() - started,
      gitCommit,
      timestamp: new Date().toISOString(),
      repoRoot,
    },
    error: { code, message },
  };
}

export function getMetaGitCommit(repoRoot: string, config: import('../policy/permissions.js').CamcpConfig): string | null {
  return getGitCommitShort(repoRoot, config);
}
