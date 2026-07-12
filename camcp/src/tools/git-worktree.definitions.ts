import { z } from 'zod';
import type { ToolDefinition } from '../registry/tool-definition.js';
import { gitWorktree } from './git-worktree.tools.js';

const gitWorktreeFacet = z.enum([
  'state',
  'diff',
  'pr_status',
  'conflicts',
  'stale',
  'cleanup_report',
  'recommend',
  'full',
]);

export const GIT_WORKTREE_TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'git.worktree',
    namespace: 'git',
    capability: 'report-only',
    description:
      'Git context + worktree + PR status audit — reuses git-context-engine/runner; SSOT: git + gh pr (read-only)',
    inputSchema: {
      facet: gitWorktreeFacet.optional().describe('Audit facet (default state)'),
      worktreePath: z.string().nullable().optional(),
      git: z
        .object({
          baseRef: z.string().optional(),
          remoteRef: z.string().optional(),
          headRef: z.string().optional(),
          includeUntracked: z.boolean().optional(),
        })
        .optional(),
      pr: z
        .object({
          number: z.number().int().optional(),
          inferFromBranch: z.boolean().optional(),
        })
        .optional(),
    },
    handler: (ctx, input) => {
      return gitWorktree(ctx.repoRoot, ctx.config, input as Parameters<typeof gitWorktree>[2]);
    },
  },
];
