import type { ToolDefinition } from './tool-definition.js';

let liveRegistry: ToolDefinition[] = [];

/** Called once from tools/index.ts after ALL_TOOL_DEFINITIONS is assembled. */
export function setLiveRegistry(tools: ToolDefinition[]): void {
  liveRegistry = tools;
}

export function getLiveRegistry(): ToolDefinition[] {
  return liveRegistry;
}
