import { z } from 'zod';
import type { ToolDefinition } from '../registry/tool-definition.js';
import { gitStatus, gitLog, gitDiff, gitBranch, gitScopeCheck } from './git.tools.js';

export const GIT_TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'git.status',
    namespace: 'git',
    capability: 'read-only',
    description: 'Git working tree status',
    inputSchema: {},
    handler: (ctx) => gitStatus(ctx.repoRoot, ctx.config),
  },
  {
    name: 'git.log',
    namespace: 'git',
    capability: 'read-only',
    description: 'Recent git commits',
    inputSchema: {
      n: z.number().int().min(1).max(100).optional().describe('Number of commits'),
      since: z.string().optional().describe('Git --since filter'),
    },
    handler: (ctx, input) => {
      const i = input as { n?: number; since?: string };
      return gitLog(ctx.repoRoot, { n: i.n, since: i.since }, ctx.config);
    },
  },
  {
    name: 'git.diff',
    namespace: 'git',
    capability: 'read-only',
    description: 'Git diff stat or patch',
    inputSchema: {
      base: z.string().optional().describe('Base ref (default origin/main)'),
      head: z.string().optional().describe('Head ref (default HEAD)'),
      stat: z.boolean().optional().describe('Stat only (default true)'),
    },
    handler: (ctx, input) => {
      const i = input as { base?: string; head?: string; stat?: boolean };
      return gitDiff(ctx.repoRoot, { base: i.base, head: i.head, stat: i.stat }, ctx.config);
    },
  },
  {
    name: 'git.branch',
    namespace: 'git',
    capability: 'read-only',
    description: 'Current branch and tracking info',
    inputSchema: {},
    handler: (ctx) => gitBranch(ctx.repoRoot, ctx.config),
  },
  {
    name: 'git.scope_check',
    namespace: 'git',
    capability: 'read-only',
    description: 'Validate changed files against allowed path scope',
    inputSchema: {
      allowedPaths: z.array(z.string()).describe('Allowed path prefixes'),
      base: z.string().optional().describe('Base ref for diff (default origin/main)'),
    },
    handler: (ctx, input) => {
      const i = input as { allowedPaths: string[]; base?: string };
      return gitScopeCheck(
        ctx.repoRoot,
        { allowedPaths: i.allowedPaths, base: i.base },
        ctx.config
      );
    },
  },
];
