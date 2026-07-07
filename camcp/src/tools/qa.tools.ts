import path from 'node:path';
import { scanQaCatalog, listParidadEntries, listPackEntries } from '../qa/catalog.js';
import { parseLastReport } from '../qa/parse-report.js';
import { QA_PACKS, resolvePack, resolvePackScripts, type PackLayer } from '../qa/packs.js';
import { runQaScript, runQaScriptChain } from '../qa/report-runner.js';
import type { CamcpConfig } from '../policy/permissions.js';

export function qaListCatalog(repoRoot: string) {
  const catalog = scanQaCatalog(repoRoot);
  return {
    total: catalog.length,
    paridad: listParidadEntries(catalog),
    packs: listPackEntries(catalog),
    packRegistry: QA_PACKS.map((p) => ({
      id: p.id,
      label: p.label,
      domain: p.domain,
      layers: Object.keys(p.layers),
      cierreScript: p.cierreScript,
    })),
    entries: catalog,
  };
}

export function qaRunParidadStatic(
  repoRoot: string,
  config: CamcpConfig,
  opts: { sector?: string; sub?: string } = {}
) {
  return runQaScript(
    repoRoot,
    config,
    'qa.run_paridad_static',
    'scripts/qa-paridad-reg-pub-static.mjs',
    [...(opts.sector ? ['--sector', opts.sector] : []), ...(opts.sub ? ['--sub', opts.sub] : [])],
    { passOutDir: true }
  );
}

export function qaRunParidadVm(
  repoRoot: string,
  config: CamcpConfig,
  opts: { sector?: string; sub?: string; maxSubs?: number; failFast?: boolean } = {}
) {
  return runQaScript(
    repoRoot,
    config,
    'qa.run_paridad_vm',
    'scripts/qa-paridad-reg-pub-vm.mjs',
    [
      ...(opts.sector ? ['--sector', opts.sector] : []),
      ...(opts.sub ? ['--sub', opts.sub] : []),
      ...(opts.maxSubs != null ? ['--max-subs', String(opts.maxSubs)] : []),
      ...(opts.failFast ? ['--fail-fast'] : []),
    ],
    { passOutDir: true }
  );
}

export function qaRunParidadRenderStrict(
  repoRoot: string,
  config: CamcpConfig,
  opts: { sub?: string; compareWith?: string } = {}
) {
  return runQaScript(
    repoRoot,
    config,
    'qa.run_paridad_render_strict',
    'scripts/qa-paridad-reg-pub-render.mjs',
    [
      '--strict',
      ...(opts.sub ? ['--sub', opts.sub] : []),
      ...(opts.compareWith ? ['--compare-with', opts.compareWith] : []),
    ],
    { passOutDir: true }
  );
}

export function qaRunFondosStatic(repoRoot: string, config: CamcpConfig) {
  return runQaScript(repoRoot, config, 'qa.run_fondos_static', 'scripts/qa-fondos-static.mjs');
}

export function qaRunP0PersistPrivacy(repoRoot: string, config: CamcpConfig) {
  return runQaScript(
    repoRoot,
    config,
    'qa.run_p0_persist_privacy',
    'scripts/qa-p0-reg-persist-privacy.mjs'
  );
}

export function qaRunSubmitHydrate(repoRoot: string, config: CamcpConfig) {
  return runQaScript(repoRoot, config, 'qa.run_submit_hydrate', 'scripts/qa-mp-submit-hydrate.mjs');
}

export function qaRunValidarSchemas(repoRoot: string, config: CamcpConfig) {
  return runQaScript(
    repoRoot,
    config,
    'qa.run_validar_schemas',
    'scripts/validar-schemas-registro.mjs'
  );
}

export function qaRunPack(
  repoRoot: string,
  config: CamcpConfig,
  opts: { packId: string; layer?: PackLayer }
) {
  const pack = resolvePack(opts.packId);
  if (!pack) {
    throw new Error(`Unknown pack: ${opts.packId}. Known: ${QA_PACKS.map((p) => p.id).join(', ')}`);
  }
  const scripts = resolvePackScripts(pack, opts.layer);
  if (scripts.length === 1) {
    return runQaScript(repoRoot, config, 'qa.run_pack', scripts[0]!);
  }
  return runQaScriptChain(repoRoot, config, 'qa.run_pack', scripts);
}

export function qaParseLastReport(repoRoot: string, config: CamcpConfig) {
  return parseLastReport(repoRoot, config);
}
