import { z } from 'zod';
import type { ToolDefinition } from '../registry/tool-definition.js';
import {
  parityRenderStrict,
  parityStatic,
  parityVm,
} from './parity.tools.js';

export const PARITY_TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'parity.static',
    namespace: 'parity',
    capability: 'report-only',
    description:
      'Static registro↔schema parity audit — delegates qa.run_paridad_static, emits CAMCP REPORT',
    inputSchema: {
      sector: z.string().optional().describe('Filter by sector id'),
      sub: z.string().optional().describe('Filter by subcategoria id'),
    },
    handler: (ctx, input) => {
      const i = input as { sector?: string; sub?: string };
      return parityStatic(ctx.repoRoot, ctx.config, i);
    },
  },
  {
    name: 'parity.vm',
    namespace: 'parity',
    capability: 'report-only',
    description:
      'VM pipeline parity (mock→map→slim→hydrate) — delegates qa.run_paridad_vm, emits CAMCP REPORT',
    inputSchema: {
      sector: z.string().optional(),
      sub: z.string().optional(),
      maxSubs: z.number().int().min(1).optional(),
      failFast: z.boolean().optional(),
    },
    handler: (ctx, input) => {
      const i = input as { sector?: string; sub?: string; maxSubs?: number; failFast?: boolean };
      return parityVm(ctx.repoRoot, ctx.config, i);
    },
  },
  {
    name: 'parity.render_strict',
    namespace: 'parity',
    capability: 'report-only',
    description:
      'Strict render parity perfil-publico — delegates qa.run_paridad_render_strict, emits CAMCP REPORT',
    inputSchema: {
      sub: z.string().optional().describe('Subcategoria id, e.g. abogados'),
      compareWith: z.string().optional().describe('Path to baseline render-summary.json'),
    },
    handler: (ctx, input) => {
      const i = input as { sub?: string; compareWith?: string };
      return parityRenderStrict(ctx.repoRoot, ctx.config, i);
    },
  },
];
