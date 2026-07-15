import type { ToolDefinition } from '../registry/tool-definition.js';
import { setLiveRegistry } from '../registry/live-registry.js';
import { FILESYSTEM_TOOL_DEFINITIONS } from './filesystem.definitions.js';
import { GIT_TOOL_DEFINITIONS } from './git.definitions.js';
import { GIT_WORKTREE_TOOL_DEFINITIONS } from './git-worktree.definitions.js';
import { QA_TOOL_DEFINITIONS } from './qa.definitions.js';
import { INTEL_TOOL_DEFINITIONS } from './intel.definitions.js';
import { PARITY_TOOL_DEFINITIONS } from './parity.definitions.js';
import { DATA_TOOL_DEFINITIONS } from './data.definitions.js';
import { ARCH_TOOL_DEFINITIONS } from './arch.definitions.js';
import { CATALOG_TOOL_DEFINITIONS } from './catalog.definitions.js';
import { PROFILE_TOOL_DEFINITIONS } from './profile.definitions.js';
import { INVALIDATION_TOOL_DEFINITIONS } from './invalidation.definitions.js';
import { CAMCP_TOOL_DEFINITIONS } from './camcp.definitions.js';

/** Single registry entry point — add new namespace arrays here only. */
export const ALL_TOOL_DEFINITIONS: ToolDefinition[] = [
  ...FILESYSTEM_TOOL_DEFINITIONS,
  ...GIT_TOOL_DEFINITIONS,
  ...GIT_WORKTREE_TOOL_DEFINITIONS,
  ...QA_TOOL_DEFINITIONS,
  ...INTEL_TOOL_DEFINITIONS,
  ...PARITY_TOOL_DEFINITIONS,
  ...DATA_TOOL_DEFINITIONS,
  ...ARCH_TOOL_DEFINITIONS,
  ...CATALOG_TOOL_DEFINITIONS,
  ...PROFILE_TOOL_DEFINITIONS,
  ...INVALIDATION_TOOL_DEFINITIONS,
  ...CAMCP_TOOL_DEFINITIONS,
];

setLiveRegistry(ALL_TOOL_DEFINITIONS);
