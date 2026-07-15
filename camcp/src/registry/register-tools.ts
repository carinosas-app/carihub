import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CamcpConfig, ToolCapability } from '../policy/permissions.js';
import { allToolsNonDestructive } from '../policy/permissions.js';
import { PathGuardError } from '../policy/path-guard.js';
import { CommandGuardError } from '../policy/command-guard.js';
import { getMetaGitCommit, makeToolError, makeToolResult } from '../utils/tool-result.js';
import {
  assertToolDefinitionsValid,
  type ToolContext,
  type ToolDefinition,
} from './tool-definition.js';

function toolText(payload: unknown): { content: Array<{ type: 'text'; text: string }> } {
  return {
    content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],
  };
}

function wrapToolResult(
  tool: ToolDefinition,
  ctx: ToolContext,
  started: number,
  run: () => unknown
): { content: Array<{ type: 'text'; text: string }> } {
  const gitCommit = getMetaGitCommit(ctx.repoRoot, ctx.config);
  const extras = {
    namespace: tool.namespace,
    camcpVersion: ctx.config.version,
  };
  try {
    const result = makeToolResult(
      tool.name,
      tool.capability,
      ctx.repoRoot,
      gitCommit,
      started,
      run(),
      { ...extras, exitCode: 0 }
    );
    return toolText(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const code =
      err instanceof PathGuardError
        ? 'PATH_GUARD'
        : err instanceof CommandGuardError
          ? 'COMMAND_GUARD'
          : 'TOOL_ERROR';
    const result = makeToolError(
      tool.name,
      tool.capability,
      ctx.repoRoot,
      gitCommit,
      started,
      code,
      message,
      { ...extras, exitCode: 1 }
    );
    return toolText(result);
  }
}

function annotationsForCapability(capability: ToolCapability) {
  return {
    readOnlyHint: capability === 'read-only' || capability === 'report-only',
    destructiveHint: capability === 'write-capable',
  };
}

export function registerToolDefinitions(
  server: McpServer,
  tools: ToolDefinition[],
  ctx: ToolContext,
  options: { requireNonDestructive?: boolean; requireReadOnly?: boolean } = {}
): void {
  assertToolDefinitionsValid(tools);

  const requireSafe = options.requireNonDestructive ?? options.requireReadOnly ?? false;
  if (requireSafe) {
    const meta = tools.map((t) => ({
      name: t.name,
      capability: t.capability,
      namespace: t.namespace,
      description: t.description,
    }));
    if (!allToolsNonDestructive(meta)) {
      throw new Error('All registered tools must be read-only or report-only');
    }
  }

  for (const tool of tools) {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: tool.inputSchema,
        annotations: annotationsForCapability(tool.capability),
      },
      async (input) => {
        const started = Date.now();
        return wrapToolResult(tool, ctx, started, () => tool.handler(ctx, input));
      }
    );
  }
}
