import fs from 'node:fs';
import path from 'node:path';
import { getCamcpRoot } from '../../config/load-config.js';
import type { FacadeRegistration, InvalidationRegistryConfig, WatchRegistration } from './types.js';

let cachedConfig: InvalidationRegistryConfig | null = null;

export function loadInvalidationRegistryConfig(): InvalidationRegistryConfig {
  if (cachedConfig) return cachedConfig;
  const configPath = path.join(getCamcpRoot(), 'config', 'invalidation-registry.json');
  const raw = fs.readFileSync(configPath, 'utf8');
  cachedConfig = JSON.parse(raw) as InvalidationRegistryConfig;
  return cachedConfig;
}

export function resetInvalidationRegistryCache(): void {
  cachedConfig = null;
}

export function listFacadeRegistrations(): FacadeRegistration[] {
  return loadInvalidationRegistryConfig().facades;
}

export function getFacadeRegistration(facadeId: string): FacadeRegistration | null {
  return listFacadeRegistrations().find((f) => f.facadeId === facadeId) ?? null;
}

export function listAllWatches(): Array<WatchRegistration & { facadeId: string }> {
  const out: Array<WatchRegistration & { facadeId: string }> = [];
  for (const facade of listFacadeRegistrations()) {
    for (const reg of facade.registrations) {
      out.push({ ...reg, facadeId: facade.facadeId });
    }
  }
  return out;
}

export function registryVersion(): string {
  return loadInvalidationRegistryConfig().registryVersion;
}
