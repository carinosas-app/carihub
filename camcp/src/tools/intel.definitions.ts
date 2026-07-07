import { z } from 'zod';
import type { ToolDefinition } from '../registry/tool-definition.js';
import {
  intelCacheStatus,
  intelGraph,
  intelImpact,
  intelListDomains,
  intelParseReport,
  intelRunModule,
} from './intel.tools.js';

export const INTEL_TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'intel.list_domains',
    namespace: 'intel',
    capability: 'read-only',
    description: 'List CariHub domains from MAPA-MAESTRO + intelligence config anchors',
    inputSchema: {},
    handler: (ctx) => intelListDomains(ctx.repoRoot),
  },
  {
    name: 'intel.graph',
    namespace: 'intel',
    capability: 'report-only',
    description: 'Return intelligence graph (domain→files→QA). refresh=true rebuilds cache in camcp-reports/.cache/',
    inputSchema: {
      refresh: z.boolean().optional().describe('Rebuild graph cache under camcp-reports/.cache/'),
    },
    handler: (ctx, input) => {
      const i = input as { refresh?: boolean };
      return intelGraph(ctx.repoRoot, ctx.config, { refresh: i.refresh });
    },
  },
  {
    name: 'intel.impact',
    namespace: 'intel',
    capability: 'report-only',
    description: 'Analyze git diff impact by domain and suggest QA modules',
    inputSchema: {
      base: z.string().optional(),
      head: z.string().optional(),
      paths: z.array(z.string()).optional().describe('Explicit paths instead of git diff'),
    },
    handler: (ctx, input) => {
      const i = input as { base?: string; head?: string; paths?: string[] };
      return intelImpact(ctx.repoRoot, ctx.config, i);
    },
  },
  {
    name: 'intel.run_module',
    namespace: 'intel',
    capability: 'report-only',
    description: 'Run a registered QA module (paridad_*, fondos_static, pack) via adapter',
    inputSchema: {
      moduleId: z.string().describe('Module id from intel.list_domains modules'),
      sector: z.string().optional(),
      sub: z.string().optional(),
      packId: z.string().optional(),
      layer: z.enum(['motor', 'persist', 'render', 'cierre']).optional(),
    },
    handler: (ctx, input) => {
      const i = input as {
        moduleId: string;
        sector?: string;
        sub?: string;
        packId?: string;
        layer?: 'motor' | 'persist' | 'render' | 'cierre';
      };
      return intelRunModule(ctx.repoRoot, ctx.config, i);
    },
  },
  {
    name: 'intel.cache_status',
    namespace: 'intel',
    capability: 'read-only',
    description: 'List intelligence cache entries under agent-tools/camcp-reports/.cache/',
    inputSchema: {},
    handler: (ctx) => intelCacheStatus(ctx.repoRoot, ctx.config),
  },
  {
    name: 'intel.parse_report',
    namespace: 'intel',
    capability: 'read-only',
    description: 'Parse latest CAMCP/QA report via Reports Engine',
    inputSchema: {},
    handler: (ctx) => intelParseReport(ctx.repoRoot, ctx.config),
  },
];
