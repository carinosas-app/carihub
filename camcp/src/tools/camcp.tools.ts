import type { CamcpConfig } from '../policy/permissions.js';
import type { ToolDefinition } from '../registry/tool-definition.js';
import { getLiveRegistry } from '../registry/live-registry.js';
import { makeReportRunDir } from '../qa/report-runner.js';
import {
  buildToolCatalog,
  executionManifestFromContext,
  getCamcpVersionInfo,
  runCamcpHealth,
  runCamcpSelfCheck,
  validateCamcpConfig,
  writeExecutionManifest,
} from '../core/camcp-core/index.js';

function toolsOr(explicit?: ToolDefinition[]): ToolDefinition[] {
  return explicit && explicit.length > 0 ? explicit : getLiveRegistry();
}

function findToolMeta(
  tools: ToolDefinition[],
  name: string
): { namespace: string; capability: ToolDefinition['capability'] } {
  const t = tools.find((x) => x.name === name);
  return {
    namespace: t?.namespace ?? 'camcp',
    capability: t?.capability ?? 'read-only',
  };
}

function withExecutionReport(
  repoRoot: string,
  config: CamcpConfig,
  tools: ToolDefinition[],
  toolName: string,
  started: number,
  exitCode: number,
  data: unknown
) {
  const meta = findToolMeta(tools, toolName);
  const { runId, reportDir } = makeReportRunDir(repoRoot, config, toolName);
  const execution = executionManifestFromContext({
    repoRoot,
    config,
    tools,
    tool: toolName,
    namespace: meta.namespace,
    capability: meta.capability,
    durationMs: Date.now() - started,
    exitCode,
    runId,
  });
  const executionManifestPath = writeExecutionManifest(repoRoot, config, reportDir, execution);
  return {
    ...((typeof data === 'object' && data !== null ? data : { value: data }) as Record<string, unknown>),
    execution,
    reportDir,
    executionManifestPath,
  };
}

export function camcpVersion(repoRoot: string, config: CamcpConfig, tools?: ToolDefinition[]) {
  return getCamcpVersionInfo(repoRoot, config, toolsOr(tools));
}

export function camcpListTools(_repoRoot: string, _config: CamcpConfig, tools?: ToolDefinition[]) {
  return buildToolCatalog(toolsOr(tools));
}

export function camcpValidateConfig(repoRoot: string, config: CamcpConfig, tools?: ToolDefinition[]) {
  const started = Date.now();
  const all = toolsOr(tools);
  const result = validateCamcpConfig(config, repoRoot);
  return withExecutionReport(
    repoRoot,
    config,
    all,
    'camcp.validate_config',
    started,
    result.ok ? 0 : 1,
    result
  );
}

export function camcpSelfCheck(repoRoot: string, config: CamcpConfig, tools?: ToolDefinition[]) {
  const started = Date.now();
  const all = toolsOr(tools);
  const result = runCamcpSelfCheck(repoRoot, config, all);
  return withExecutionReport(repoRoot, config, all, 'camcp.self_check', started, result.ok ? 0 : 1, result);
}

export function camcpHealth(repoRoot: string, config: CamcpConfig, tools?: ToolDefinition[]) {
  return runCamcpHealth(repoRoot, config, toolsOr(tools));
}
