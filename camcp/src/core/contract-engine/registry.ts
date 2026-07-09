import fs from 'node:fs';
import path from 'node:path';
import { getCamcpRoot } from '../../config/load-config.js';
import type { ContractDomainPlugin, ContractEngineConfig, SsotDefinition } from './types.js';
import { catalogPlugin } from './plugins/catalog.js';
import { profilePlugin } from './plugins/profile.js';
import { archPlugin } from './plugins/arch.js';

const PLUGINS: Record<string, ContractDomainPlugin> = {
  catalog: catalogPlugin,
  profile: profilePlugin,
  arch: archPlugin,
};

let cachedConfig: ContractEngineConfig | null = null;

export function loadContractEngineConfig(): ContractEngineConfig {
  if (cachedConfig) return cachedConfig;
  const configPath = path.join(getCamcpRoot(), 'config', 'contract-engine.config.json');
  const raw = fs.readFileSync(configPath, 'utf8');
  cachedConfig = JSON.parse(raw) as ContractEngineConfig;
  return cachedConfig;
}

export function getPlugin(pluginId: string | undefined): ContractDomainPlugin | null {
  if (!pluginId) return null;
  return PLUGINS[pluginId] ?? null;
}

export function listSsotsForFacade(facadeId: string, ssotIds?: string[]): SsotDefinition[] {
  const config = loadContractEngineConfig();
  let list = config.ssots.filter((s) => s.facades.includes(facadeId));
  if (ssotIds?.length) {
    const wanted = new Set(ssotIds);
    list = list.filter((s) => wanted.has(s.ssotId));
  }
  return list;
}

export function getSsotById(ssotId: string): SsotDefinition | null {
  const config = loadContractEngineConfig();
  return config.ssots.find((s) => s.ssotId === ssotId) ?? null;
}

export function listRegisteredPlugins(): string[] {
  return Object.keys(PLUGINS);
}

/** Test-only reset. */
export function resetContractEngineConfigCache(): void {
  cachedConfig = null;
}
