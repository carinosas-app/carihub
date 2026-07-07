import { z } from 'zod';
import type { ToolDefinition } from '../registry/tool-definition.js';
import {
  qaListCatalog,
  qaParseLastReport,
  qaRunFondosStatic,
  qaRunPack,
  qaRunParidadRenderStrict,
  qaRunParidadStatic,
  qaRunParidadVm,
} from './qa.tools.js';

export const QA_TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'qa.list_catalog',
    namespace: 'qa',
    capability: 'report-only',
    description: 'List QA scripts detected under scripts/qa-*.mjs and known pack registry',
    inputSchema: {},
    handler: (ctx) => qaListCatalog(ctx.repoRoot),
  },
  {
    name: 'qa.run_paridad_static',
    namespace: 'qa',
    capability: 'report-only',
    description: 'Run scripts/qa-paridad-reg-pub-static.mjs (adapter, no rewrite)',
    inputSchema: {
      sector: z.string().optional().describe('Filter by sector id'),
      sub: z.string().optional().describe('Filter by subcategoria id'),
    },
    handler: (ctx, input) => {
      const i = input as { sector?: string; sub?: string };
      return qaRunParidadStatic(ctx.repoRoot, ctx.config, i);
    },
  },
  {
    name: 'qa.run_paridad_vm',
    namespace: 'qa',
    capability: 'report-only',
    description: 'Run scripts/qa-paridad-reg-pub-vm.mjs (adapter, no rewrite)',
    inputSchema: {
      sector: z.string().optional(),
      sub: z.string().optional(),
      maxSubs: z.number().int().min(1).optional(),
      failFast: z.boolean().optional(),
    },
    handler: (ctx, input) => {
      const i = input as { sector?: string; sub?: string; maxSubs?: number; failFast?: boolean };
      return qaRunParidadVm(ctx.repoRoot, ctx.config, i);
    },
  },
  {
    name: 'qa.run_paridad_render_strict',
    namespace: 'qa',
    capability: 'report-only',
    description: 'Run scripts/qa-paridad-reg-pub-render.mjs --strict (adapter, no rewrite)',
    inputSchema: {
      sub: z.string().optional().describe('Subcategoria id, e.g. abogados'),
      compareWith: z.string().optional().describe('Path to normal render-summary.json baseline'),
    },
    handler: (ctx, input) => {
      const i = input as { sub?: string; compareWith?: string };
      return qaRunParidadRenderStrict(ctx.repoRoot, ctx.config, i);
    },
  },
  {
    name: 'qa.run_fondos_static',
    namespace: 'qa',
    capability: 'report-only',
    description: 'Run scripts/qa-fondos-static.mjs (adapter, no rewrite)',
    inputSchema: {},
    handler: (ctx) => qaRunFondosStatic(ctx.repoRoot, ctx.config),
  },
  {
    name: 'qa.run_pack',
    namespace: 'qa',
    capability: 'report-only',
    description: 'Run an existing domain pack script chain via adapter (motor/persist/render/cierre)',
    inputSchema: {
      packId: z.string().describe('Pack id from catalog packRegistry'),
      layer: z
        .enum(['motor', 'persist', 'render', 'cierre'])
        .optional()
        .describe('Run single layer; omit to run cierre or full chain'),
    },
    handler: (ctx, input) => {
      const i = input as { packId: string; layer?: 'motor' | 'persist' | 'render' | 'cierre' };
      return qaRunPack(ctx.repoRoot, ctx.config, i);
    },
  },
  {
    name: 'qa.parse_last_report',
    namespace: 'qa',
    capability: 'report-only',
    description: 'Parse the most recent report under agent-tools/camcp-reports/',
    inputSchema: {},
    handler: (ctx) => qaParseLastReport(ctx.repoRoot, ctx.config),
  },
];
