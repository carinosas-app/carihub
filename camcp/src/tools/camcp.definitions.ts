import type { ToolDefinition } from '../registry/tool-definition.js';
import {
  camcpHealth,
  camcpListTools,
  camcpSelfCheck,
  camcpValidateConfig,
  camcpVersion,
} from './camcp.tools.js';

/**
 * Kernel consolidation tools (`camcp.*`).
 * Handlers read the live registry via getLiveRegistry() — no circular import with index.ts.
 */
export const CAMCP_TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'camcp.version',
    namespace: 'camcp',
    capability: 'read-only',
    description:
      'Expose CAMCP version, commit, build date, namespaces, tool count and capabilities (kernel)',
    inputSchema: {},
    handler: (ctx) => camcpVersion(ctx.repoRoot, ctx.config),
  },
  {
    name: 'camcp.self_check',
    namespace: 'camcp',
    capability: 'report-only',
    description:
      'Run CAMCP self-check: registry, capabilities, config, repoRoot, reportsDir, SDK, Node, Git, Path/Command guards',
    inputSchema: {},
    handler: (ctx) => camcpSelfCheck(ctx.repoRoot, ctx.config),
  },
  {
    name: 'camcp.list_tools',
    namespace: 'camcp',
    capability: 'read-only',
    description: 'Automatic tool catalog grouped by namespace (name, capability, description)',
    inputSchema: {},
    handler: (ctx) => camcpListTools(ctx.repoRoot, ctx.config),
  },
  {
    name: 'camcp.validate_config',
    namespace: 'camcp',
    capability: 'report-only',
    description:
      'Validate camcp.config.json: mode, reportsDir, repoRoot, denyWritePaths, gitAllowedSubcommands',
    inputSchema: {},
    handler: (ctx) => camcpValidateConfig(ctx.repoRoot, ctx.config),
  },
  {
    name: 'camcp.health',
    namespace: 'camcp',
    capability: 'read-only',
    description: 'Compact CAMCP health summary (version + self-check status + registry/config OK)',
    inputSchema: {},
    handler: (ctx) => camcpHealth(ctx.repoRoot, ctx.config),
  },
];
