import type { ToolDefinition } from '../registry/tool-definition.js';
import { FILESYSTEM_TOOL_DEFINITIONS } from './filesystem.definitions.js';
import { GIT_TOOL_DEFINITIONS } from './git.definitions.js';
import { QA_TOOL_DEFINITIONS } from './qa.definitions.js';
import { INTEL_TOOL_DEFINITIONS } from './intel.definitions.js';
import { PARITY_TOOL_DEFINITIONS } from './parity.definitions.js';

/** Single registry entry point — add new namespace arrays here only. */
export const ALL_TOOL_DEFINITIONS: ToolDefinition[] = [
  ...FILESYSTEM_TOOL_DEFINITIONS,
  ...GIT_TOOL_DEFINITIONS,
  ...QA_TOOL_DEFINITIONS,
  ...INTEL_TOOL_DEFINITIONS,
  ...PARITY_TOOL_DEFINITIONS,
];
