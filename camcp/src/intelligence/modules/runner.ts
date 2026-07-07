import type { CamcpConfig } from '../../policy/permissions.js';
import type { IntelligenceConfig } from '../types.js';
import { aggregateQaRunIntoReport, writeCamcpReport } from '../../reports/aggregator.js';
import type { CamcpReport } from '../../reports/schema.js';
import {
  qaRunFondosStatic,
  qaRunPack,
  qaRunParidadRenderStrict,
  qaRunParidadStatic,
  qaRunParidadVm,
} from '../../tools/qa.tools.js';
import { resolveIntelModule } from './registry.js';

export interface ModuleRunResult {
  moduleId: string;
  qaTool: string;
  ok: boolean;
  qaResult: unknown;
  report: CamcpReport;
  reportPaths: string[];
}

export function runIntelModule(
  repoRoot: string,
  config: CamcpConfig,
  intelConfig: IntelligenceConfig,
  moduleId: string,
  options: {
    sector?: string;
    sub?: string;
    packId?: string;
    layer?: 'motor' | 'persist' | 'render' | 'cierre';
    gitCommit?: string | null;
  } = {}
): ModuleRunResult {
  const mod = resolveIntelModule(intelConfig, moduleId);
  if (!mod) {
    throw new Error(
      `Unknown module: ${moduleId}. Allowed: ${intelConfig.modules.map((m) => m.id).join(', ')}`
    );
  }
  if (mod.requiresPackId && !options.packId) {
    throw new Error(`Module ${moduleId} requires packId`);
  }

  const t0 = Date.now();
  let qaResult: unknown;
  let ok = false;

  switch (moduleId) {
    case 'paridad_static':
      qaResult = qaRunParidadStatic(repoRoot, config, {
        sector: options.sector,
        sub: options.sub,
      });
      ok = (qaResult as { ok: boolean }).ok;
      break;
    case 'paridad_vm':
      qaResult = qaRunParidadVm(repoRoot, config, {
        sector: options.sector,
        sub: options.sub,
      });
      ok = (qaResult as { ok: boolean }).ok;
      break;
    case 'paridad_render_strict':
      qaResult = qaRunParidadRenderStrict(repoRoot, config, { sub: options.sub });
      ok = (qaResult as { ok: boolean }).ok;
      break;
    case 'fondos_static':
      qaResult = qaRunFondosStatic(repoRoot, config);
      ok = (qaResult as { ok: boolean }).ok;
      break;
    case 'pack':
      qaResult = qaRunPack(repoRoot, config, {
        packId: options.packId!,
        layer: options.layer,
      });
      ok = (qaResult as { ok: boolean }).ok;
      break;
    default:
      throw new Error(`Module runner not wired: ${moduleId}`);
  }

  const report = aggregateQaRunIntoReport({
    module: `intel.run_module:${moduleId}`,
    qaTool: mod.qaTool,
    qaResult,
    ok,
    durationMs: Date.now() - t0,
    gitCommit: options.gitCommit ?? null,
  });

  const reportPaths = writeCamcpReport(repoRoot, config, 'intel.run_module', report);

  return {
    moduleId,
    qaTool: mod.qaTool,
    ok,
    qaResult,
    report,
    reportPaths,
  };
}
