#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { assertReadOnlyMode } from './policy/permissions.js';
import { loadConfig, resolveRepoRoot } from './config/load-config.js';
import { registerToolDefinitions } from './registry/register-tools.js';
import { ALL_TOOL_DEFINITIONS } from './tools/index.js';

async function main(): Promise<void> {
  const config = loadConfig();
  assertReadOnlyMode(config);

  const repoRoot = resolveRepoRoot(config);
  const server = new McpServer(
    {
      name: 'carihub-architecture-mcp',
      version: config.version,
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  registerToolDefinitions(server, ALL_TOOL_DEFINITIONS, { repoRoot, config }, {
    requireNonDestructive: true,
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('[CAMCP] Fatal:', err);
  process.exit(1);
});
