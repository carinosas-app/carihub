import type { IntelligenceConfig, IntelModuleDefinition } from '../types.js';

export function listIntelModules(intelConfig: IntelligenceConfig): IntelModuleDefinition[] {
  return intelConfig.modules;
}

export function resolveIntelModule(
  intelConfig: IntelligenceConfig,
  moduleId: string
): IntelModuleDefinition | null {
  return intelConfig.modules.find((m) => m.id === moduleId) ?? null;
}

export function moduleIds(intelConfig: IntelligenceConfig): string[] {
  return intelConfig.modules.map((m) => m.id);
}
