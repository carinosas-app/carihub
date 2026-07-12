import { z } from 'zod';
import type { ToolDefinition } from '../registry/tool-definition.js';
import { catalogAudit } from './catalog.tools.js';

const catalogFacet = z.enum([
  'summary',
  'duplicates',
  'aliases',
  'placement',
  'taxonomy',
  'gaps',
  'assets',
  'full',
]);

export const CATALOG_TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'catalog.audit',
    namespace: 'catalog',
    capability: 'report-only',
    description:
      'Catalog taxonomy audit — reuses catalog-engine + contract-engine; SSOT: registro-schema-index',
    inputSchema: {
      facet: catalogFacet.optional().describe('Audit facet (default summary)'),
      operator: z
        .object({
          forceFullScan: z.boolean().optional(),
        })
        .optional(),
    },
    handler: (ctx, input) => {
      return catalogAudit(ctx.repoRoot, ctx.config, input as Parameters<typeof catalogAudit>[2]);
    },
  },
];
