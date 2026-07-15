import fs from 'node:fs';
import path from 'node:path';
import type { CamcpConfig, ToolCapability } from '../../policy/permissions.js';
import { assertReportWritePathAllowed } from '../../policy/path-guard.js';
import { getCamcpVersionInfo } from './version.js';
import type { ToolDefinition } from '../../registry/tool-definition.js';

/** Standardized execution manifest for every CAMCP run. */
export interface CamcpExecutionManifest {
  schemaVersion: 'camcp-execution-manifest@1.0.0';
  camcpVersion: string;
  commit: string | null;
  tool: string;
  namespace: string;
  capability: ToolCapability;
  durationMs: number;
  timestamp: string;
  exitCode: number;
  buildDate?: string;
  runId?: string;
}

export function buildExecutionManifest(input: {
  camcpVersion: string;
  commit: string | null;
  tool: string;
  namespace: string;
  capability: ToolCapability;
  durationMs: number;
  timestamp?: string;
  exitCode: number;
  buildDate?: string;
  runId?: string;
}): CamcpExecutionManifest {
  return {
    schemaVersion: 'camcp-execution-manifest@1.0.0',
    camcpVersion: input.camcpVersion,
    commit: input.commit,
    tool: input.tool,
    namespace: input.namespace,
    capability: input.capability,
    durationMs: input.durationMs,
    timestamp: input.timestamp ?? new Date().toISOString(),
    exitCode: input.exitCode,
    buildDate: input.buildDate,
    runId: input.runId,
  };
}

export function executionManifestFromContext(input: {
  repoRoot: string;
  config: CamcpConfig;
  tools: ToolDefinition[];
  tool: string;
  namespace: string;
  capability: ToolCapability;
  durationMs: number;
  exitCode: number;
  runId?: string;
}): CamcpExecutionManifest {
  const info = getCamcpVersionInfo(input.repoRoot, input.config, input.tools);
  return buildExecutionManifest({
    camcpVersion: info.camcpVersion,
    commit: info.commit,
    tool: input.tool,
    namespace: input.namespace,
    capability: input.capability,
    durationMs: input.durationMs,
    exitCode: input.exitCode,
    buildDate: info.buildDate,
    runId: input.runId,
  });
}

export function writeExecutionManifest(
  repoRoot: string,
  config: CamcpConfig,
  reportDir: string,
  manifest: CamcpExecutionManifest
): string {
  const outPath = path.join(reportDir, 'execution-manifest.json');
  assertReportWritePathAllowed(repoRoot, outPath, config);
  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2), 'utf8');
  return outPath;
}
