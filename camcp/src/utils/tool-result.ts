import type { CamcpToolResult, ToolCapability } from '../policy/permissions.js';
import type { CamcpConfig } from '../policy/permissions.js';
import { getGitCommitShort } from '../policy/command-guard.js';

export interface ToolResultExtras {
  namespace?: string;
  camcpVersion?: string;
  exitCode?: number;
}

export function makeToolResult<T>(
  tool: string,
  capability: ToolCapability,
  repoRoot: string,
  gitCommit: string | null,
  started: number,
  data: T,
  extras: ToolResultExtras = {}
): CamcpToolResult<T> {
  return {
    ok: true,
    capability,
    data,
    meta: {
      tool,
      namespace: extras.namespace,
      capability,
      camcpVersion: extras.camcpVersion,
      durationMs: Date.now() - started,
      gitCommit,
      timestamp: new Date().toISOString(),
      repoRoot,
      exitCode: extras.exitCode ?? 0,
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
  message: string,
  extras: ToolResultExtras = {}
): CamcpToolResult {
  return {
    ok: false,
    capability,
    meta: {
      tool,
      namespace: extras.namespace,
      capability,
      camcpVersion: extras.camcpVersion,
      durationMs: Date.now() - started,
      gitCommit,
      timestamp: new Date().toISOString(),
      repoRoot,
      exitCode: extras.exitCode ?? 1,
    },
    error: { code, message },
  };
}

export function getMetaGitCommit(repoRoot: string, config: CamcpConfig): string | null {
  return getGitCommitShort(repoRoot, config);
}
