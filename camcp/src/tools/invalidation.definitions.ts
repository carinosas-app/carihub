import { z } from 'zod';
import type { ToolDefinition } from '../registry/tool-definition.js';
import {
  invalidationEvaluate,
  invalidationExplain,
  invalidationWatchList,
} from './invalidation.tools.js';

export const INVALIDATION_TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'invalidation.watch_list',
    namespace: 'invalidation',
    capability: 'read-only',
    description:
      'List invalidation registry watches — reuses invalidation-registry; SSOT: invalidation-registry.json',
    inputSchema: {},
    handler: () => invalidationWatchList(),
  },
  {
    name: 'invalidation.explain',
    namespace: 'invalidation',
    capability: 'read-only',
    description:
      'Explain which watches invalidate a completed check id — reuses invalidation-registry/explain',
    inputSchema: {
      checkId: z.string().describe('Completed check id, e.g. catalog.audit:summary'),
    },
    handler: (_ctx, input) => {
      const i = input as { checkId: string };
      return invalidationExplain(i.checkId);
    },
  },
  {
    name: 'invalidation.evaluate',
    namespace: 'invalidation',
    capability: 'read-only',
    description:
      'Evaluate completed checks against current SSOT/git fingerprints — reuses invalidation-registry/evaluate',
    inputSchema: {
      completedChecks: z
        .array(z.record(z.unknown()))
        .optional()
        .describe('Completed check records from prior CAMCP reports'),
      forceRefresh: z.boolean().optional(),
      facadeId: z.string().optional().describe('Contract gate facade for snapshots'),
      facet: z.string().optional(),
    },
    handler: (ctx, input) => {
      const i = input as {
        completedChecks?: Array<Record<string, unknown>>;
        forceRefresh?: boolean;
        facadeId?: string;
        facet?: string;
      };
      return invalidationEvaluate(ctx.repoRoot, ctx.config, {
        completedChecks: i.completedChecks as import('../core/invalidation-registry/types.js').CompletedCheck[] | undefined,
        forceRefresh: i.forceRefresh,
        facadeId: i.facadeId,
        facet: i.facet,
      });
    },
  },
];
