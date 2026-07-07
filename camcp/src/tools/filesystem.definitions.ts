import { z } from 'zod';
import type { ToolDefinition } from '../registry/tool-definition.js';
import {
  filesystemList,
  filesystemRead,
  filesystemSearch,
  filesystemTree,
} from './filesystem.tools.js';

export const FILESYSTEM_TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'filesystem.list',
    namespace: 'filesystem',
    capability: 'read-only',
    description: 'List directory entries under repo root',
    inputSchema: {
      path: z.string().optional().describe('Relative path under repo root'),
      glob: z.string().optional().describe('Optional glob filter on entry names'),
    },
    handler: (ctx, input) => {
      const i = input as { path?: string; glob?: string };
      return filesystemList(ctx.repoRoot, { path: i.path, glob: i.glob }, ctx.config);
    },
  },
  {
    name: 'filesystem.read',
    namespace: 'filesystem',
    capability: 'read-only',
    description: 'Read a text file under repo root',
    inputSchema: {
      path: z.string().describe('Relative file path under repo root'),
      offset: z.number().int().min(0).optional().describe('0-based line offset'),
      limit: z.number().int().min(1).optional().describe('Max lines to return'),
    },
    handler: (ctx, input) => {
      const i = input as { path: string; offset?: number; limit?: number };
      return filesystemRead(
        ctx.repoRoot,
        { path: i.path, offset: i.offset, limit: i.limit },
        ctx.config
      );
    },
  },
  {
    name: 'filesystem.search',
    namespace: 'filesystem',
    capability: 'read-only',
    description: 'Search file contents with ripgrep-style pattern',
    inputSchema: {
      pattern: z.string().describe('Search pattern (regex)'),
      path: z.string().optional().describe('Relative path to search under'),
      glob: z.string().optional().describe('Optional glob filter'),
    },
    handler: (ctx, input) => {
      const i = input as { pattern: string; path?: string; glob?: string };
      return filesystemSearch(
        ctx.repoRoot,
        { pattern: i.pattern, path: i.path, glob: i.glob },
        ctx.config
      );
    },
  },
  {
    name: 'filesystem.tree',
    namespace: 'filesystem',
    capability: 'read-only',
    description: 'Directory tree under repo root',
    inputSchema: {
      path: z.string().optional().describe('Relative directory path'),
      depth: z.number().int().min(1).max(8).optional().describe('Max tree depth'),
    },
    handler: (ctx, input) => {
      const i = input as { path?: string; depth?: number };
      return filesystemTree(ctx.repoRoot, { path: i.path, depth: i.depth }, ctx.config);
    },
  },
];
