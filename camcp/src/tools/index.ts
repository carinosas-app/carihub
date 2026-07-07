import type { ToolDefinition } from '../registry/tool-definition.js';
import { FILESYSTEM_TOOL_DEFINITIONS } from './filesystem.definitions.js';
import { GIT_TOOL_DEFINITIONS } from './git.definitions.js';

/** Single registry entry point — add new namespace arrays here only. */
export const ALL_TOOL_DEFINITIONS: ToolDefinition[] = [
  ...FILESYSTEM_TOOL_DEFINITIONS,
  ...GIT_TOOL_DEFINITIONS,
];
