import type { ToolCapability } from '../../policy/permissions.js';
import type { ToolDefinition } from '../../registry/tool-definition.js';
import { listNamespaces } from './version.js';

export interface CamcpToolCatalogEntry {
  namespace: string;
  name: string;
  capability: ToolCapability;
  description: string;
}

export interface CamcpToolCatalog {
  generatedAt: string;
  toolCount: number;
  namespaces: string[];
  byNamespace: Record<string, CamcpToolCatalogEntry[]>;
  tools: CamcpToolCatalogEntry[];
}

export function buildToolCatalog(tools: ToolDefinition[]): CamcpToolCatalog {
  const entries: CamcpToolCatalogEntry[] = tools.map((t) => ({
    namespace: t.namespace,
    name: t.name,
    capability: t.capability,
    description: t.description,
  }));

  const namespaces = listNamespaces(tools);
  const byNamespace: Record<string, CamcpToolCatalogEntry[]> = {};
  for (const ns of namespaces) {
    byNamespace[ns] = entries.filter((e) => e.namespace === ns).sort((a, b) => a.name.localeCompare(b.name));
  }

  return {
    generatedAt: new Date().toISOString(),
    toolCount: entries.length,
    namespaces,
    byNamespace,
    tools: [...entries].sort((a, b) => a.name.localeCompare(b.name)),
  };
}
