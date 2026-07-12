import { z } from 'zod';
import type { ToolDefinition } from '../registry/tool-definition.js';
import { profileAudit } from './profile.tools.js';

const profileFacet = z.enum([
  'summary',
  'registration',
  'parity',
  'public_fields',
  'private_fields',
  'render',
  'lifecycle',
  'verification',
  'full',
]);

export const PROFILE_TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'profile.audit',
    namespace: 'profile',
    capability: 'report-only',
    description:
      'Registro↔perfil público parity audit — reuses profile-parity-engine; delegates parity.* / data.*',
    inputSchema: {
      facet: profileFacet.optional().describe('Audit facet (default summary)'),
      scope: z
        .object({
          sectorId: z.string().optional(),
          subcategoriaIds: z.array(z.string()).optional(),
          packId: z.string().nullable().optional(),
          allSubsInSector: z.boolean().optional(),
        })
        .optional(),
      operator: z
        .object({
          forceRefresh: z.boolean().optional(),
        })
        .optional(),
    },
    handler: (ctx, input) => {
      return profileAudit(ctx.repoRoot, ctx.config, input as Parameters<typeof profileAudit>[2]);
    },
  },
];
