import { z } from 'zod';
import type { ToolDefinition } from '../registry/tool-definition.js';
import {
  archDomainBoundaries,
  archFrozenViolations,
  archReview,
  archScanDuplicates,
} from './arch.tools.js';

export const ARCH_TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'arch.frozen_violations',
    namespace: 'arch',
    capability: 'report-only',
    description:
      'Frozen module violations via git diff — SSOT: ACTA-CONGELAMIENTO + .cursor/rules; reuses git.diff + reports/aggregator',
    inputSchema: {
      base: z.string().optional().describe('Base ref (default origin/main)'),
      head: z.string().optional().describe('Head ref (default HEAD)'),
      includeCamcpFrozen: z.boolean().optional(),
    },
    handler: (ctx, input) => {
      const i = input as { base?: string; head?: string; includeCamcpFrozen?: boolean };
      return archFrozenViolations(ctx.repoRoot, ctx.config, i);
    },
  },
  {
    name: 'arch.scan_duplicates',
    namespace: 'arch',
    capability: 'report-only',
    description:
      'Static duplicate code scan — SSOT: repo source files; reuses filesystem.search',
    inputSchema: {
      scope: z.array(z.string()).optional(),
      minSimilarity: z.number().min(0).max(1).optional(),
    },
    handler: (ctx, input) => {
      const i = input as { scope?: string[]; minSimilarity?: number };
      return archScanDuplicates(ctx.repoRoot, ctx.config, i);
    },
  },
  {
    name: 'arch.domain_boundaries',
    namespace: 'arch',
    capability: 'read-only',
    description:
      'Domain boundary drift check — SSOT: MAPA-MAESTRO + intelligence.config + gpt-knowledge; reuses intelligence/contracts/loader + intelligence.config.json',
    inputSchema: {
      domain: z.string().optional().describe('Filter single APP_* domain'),
    },
    handler: (ctx, input) => {
      const i = input as { domain?: string };
      return archDomainBoundaries(ctx.repoRoot, ctx.config, i);
    },
  },
  {
    name: 'arch.review',
    namespace: 'arch',
    capability: 'report-only',
    description:
      'Composite architecture review — reuses arch-review-engine; delegates arch.* + intel.*',
    inputSchema: {
      facet: z
        .enum(['summary', 'scope', 'frozen', 'boundaries', 'duplicates', 'impact', 'graph', 'full'])
        .optional()
        .describe('Review facet (default summary)'),
      scope: z
        .object({
          paths: z.array(z.string()).optional(),
          domain: z.string().optional(),
          baseRef: z.string().optional(),
          headRef: z.string().optional(),
        })
        .optional(),
      operator: z
        .object({
          forceRefresh: z.boolean().optional(),
        })
        .optional(),
    },
    handler: (ctx, input) => {
      const i = input as Parameters<typeof archReview>[2];
      return archReview(ctx.repoRoot, ctx.config, i);
    },
  },
];
