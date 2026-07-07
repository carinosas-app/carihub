import { z } from 'zod';
import type { ToolDefinition } from '../registry/tool-definition.js';
import {
  dataHydrateAudit,
  dataPersistAudit,
  dataPipelineStatus,
  dataSchemaAlignment,
} from './data.tools.js';

export const DATA_TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'data.pipeline_status',
    namespace: 'data',
    capability: 'report-only',
    description:
      'Data pipeline stage health (mock→map→slim→hydrate) — reuses qa.run_paridad_vm + runQaScript + reports/aggregator',
    inputSchema: {
      sector: z.string().optional(),
      sub: z.string().optional(),
      maxSubs: z.number().int().min(1).optional(),
      failFast: z.boolean().optional(),
    },
    handler: (ctx, input) => {
      const i = input as { sector?: string; sub?: string; maxSubs?: number; failFast?: boolean };
      return dataPipelineStatus(ctx.repoRoot, ctx.config, i);
    },
  },
  {
    name: 'data.persist_audit',
    namespace: 'data',
    capability: 'report-only',
    description:
      'P0 persist + privacy audit — reuses qa.run_p0_persist_privacy → scripts/qa-p0-reg-persist-privacy.mjs',
    inputSchema: {},
    handler: (ctx) => dataPersistAudit(ctx.repoRoot, ctx.config),
  },
  {
    name: 'data.hydrate_audit',
    namespace: 'data',
    capability: 'report-only',
    description:
      'Submit-hydrate read-path audit — reuses qa.run_submit_hydrate → scripts/qa-mp-submit-hydrate.mjs',
    inputSchema: {},
    handler: (ctx) => dataHydrateAudit(ctx.repoRoot, ctx.config),
  },
  {
    name: 'data.schema_alignment',
    namespace: 'data',
    capability: 'report-only',
    description:
      'Mapa↔schema-index alignment — reuses qa.run_validar_schemas → scripts/validar-schemas-registro.mjs',
    inputSchema: {},
    handler: (ctx) => dataSchemaAlignment(ctx.repoRoot, ctx.config),
  },
];
