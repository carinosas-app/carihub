import type { z } from 'zod';
import type { CamcpConfig, ToolCapability } from '../policy/permissions.js';

export interface ToolContext {
  repoRoot: string;
  config: CamcpConfig;
}

export type ToolInputSchema = Record<string, z.ZodTypeAny>;

export interface ToolDefinition<TInput = Record<string, unknown>> {
  name: string;
  namespace: string;
  capability: ToolCapability;
  description: string;
  inputSchema: ToolInputSchema;
  handler: (ctx: ToolContext, input: TInput) => unknown;
}

export function assertToolDefinitionsValid(tools: ToolDefinition[]): void {
  const names = new Set<string>();
  for (const tool of tools) {
    if (!tool.name?.trim()) {
      throw new Error('ToolDefinition missing name');
    }
    if (!tool.capability) {
      throw new Error(`Tool ${tool.name} missing capability`);
    }
    if (!tool.namespace?.trim()) {
      throw new Error(`Tool ${tool.name} missing namespace`);
    }
    if (typeof tool.handler !== 'function') {
      throw new Error(`Tool ${tool.name} missing handler`);
    }
    if (!tool.inputSchema || typeof tool.inputSchema !== 'object') {
      throw new Error(`Tool ${tool.name} missing inputSchema`);
    }
    if (names.has(tool.name)) {
      throw new Error(`Duplicate tool name: ${tool.name}`);
    }
    names.add(tool.name);
  }
}

export function toolMetaFromDefinitions(tools: ToolDefinition[]) {
  return tools.map((tool) => ({
    name: tool.name,
    capability: tool.capability,
    namespace: tool.namespace,
    description: tool.description,
  }));
}
