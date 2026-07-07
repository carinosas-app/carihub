import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

import { makePipelineCtx } from './vm-pipeline-context.mjs';
import { loadSchemaIndex, listSubcategorias, ctxFromSchemaEntry, schemaResolvedFromEntry } from './catalog-loader.mjs';
import { applyFinalizeChain } from './finalize-chain.mjs';
import { buildMockBloques } from './mock-generator.mjs';
import { extractFieldContracts } from './field-extractor.mjs';
import { createPlaywrightSession, newPage } from './playwright-context.mjs';
import { navigateAndPaint, buildPreviewPayload } from './fixture-injector.mjs';
import { domExtractorSource, extractSectionTexts, findTextMatches } from './dom-extractor.mjs';
import { runRenderChecks } from './render-checker.mjs';
import { runRenderPrivacyChecks } from './render-privacy-checker.mjs';
import { captureScreenshots } from './screenshot-capture.mjs';
import { aggregateRenderStatus, isBlocker } from './severity.mjs';
import { slugSubId } from './slug.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RENDER_MAP = JSON.parse(
  readFileSync(path.join(__dirname, 'render-map.json'), 'utf8')
);

function resolveNestedKey(ctx, sectorId, mergedCfg) {
  if (mergedCfg?.nestedProfileKey) return mergedCfg.nestedProfileKey;
  const Registry = ctx.CariHubSectorContractRegistry;
  if (Registry?.resolveNestedKey) {
    const k = Registry.resolveNestedKey(sectorId);
    if (k) return k;
  }
  return null;
}

/** Build hydrated profile (same chain as Fase B, without modifying pipeline-runner). */
function buildPipelineArtifacts(ctx, schemaEntry) {
  const PB = ctx.CariHubRegistroPublicBlocks;
  const Submit = ctx.CariHubRegistroPerfilSubmit;
  const Reg = ctx.CariHubResultadosRegistrados;
  const regCtx = ctxFromSchemaEntry(schemaEntry);
  const schemaResuelto = schemaResolvedFromEntry(schemaEntry);

  const rawCfg = PB.resolveConfig(regCtx, schemaResuelto);
  if (!rawCfg) return { error: 'sin resolveConfig' };

  const mergedCfg = PB.mergedConfig(rawCfg, regCtx);
  let nestedProfileKey = resolveNestedKey(ctx, schemaEntry.sectorId, mergedCfg);
  const fieldContracts = extractFieldContracts(schemaEntry, mergedCfg, nestedProfileKey);

  const mockBloques = buildMockBloques(mergedCfg, regCtx, fieldContracts);
  const finalized = applyFinalizeChain(mockBloques, regCtx, PB);
  const mapped = PB.mapToPerfil({}, finalized, regCtx);
  if (!nestedProfileKey) {
    for (const k of PB.PROFILE_NESTED_KEYS || []) {
      if (mapped[k]) {
        nestedProfileKey = k;
        break;
      }
    }
  }

  const draft = {
    contexto: regCtx,
    schemaResuelto,
    camposPublicos: {
      alias: 'QA Paridad C',
      edad: 28,
      bloquesPublicos: finalized,
      descripcionCorta: finalized.tagline || 'Tag QA',
      precioDesde: finalized.precioConsulta || finalized.precioDesde || '999',
      pais: 'México',
      estado: 'Nuevo León',
      ciudad: 'Monterrey',
      zona: 'Centro',
    },
    contactoPublico: { whatsapp: '5218000000000' },
  };
  const priv = {
    correoAcceso: 'priv@qa.test',
    telefonoPrivado: '8112345678',
    mayorEdadConfirmado: true,
    nombrePersonal: 'Nombre Real QA',
    fechaNacimiento: '1990-01-01',
  };

  const fullDoc = Submit.buildUsuarioDoc('uid_qa_c', draft, priv, {}, {});
  const slimDoc = Submit.slimProfileForFirestore(fullDoc);
  const hydrated = Reg.normalizar({ id: 'uid_qa_c', exists: true, data: () => slimDoc });

  return {
    regCtx,
    mergedCfg,
    fieldContracts,
    finalized,
    hydrated,
    nestedProfileKey,
    pipelineOk: hydrated?.__hydratedFromBloques === true,
  };
}

function mapEntryForSub(subcategoriaId, nestedProfileKey) {
  const slug = slugSubId(subcategoriaId);
  const entry = RENDER_MAP[slug];
  if (!entry) return null;
  return { ...entry, nestedProfileKey };
}

/**
 * @param {object} opts
 */
export async function runSubRender(opts) {
  const { ctx, schemaEntry, session, shotsDir, strict = false } = opts;
  const subSlug = slugSubId(schemaEntry.subcategoriaId);
  const started = Date.now();

  const base = {
    subcategoriaId: schemaEntry.subcategoriaId,
    sectorId: schemaEntry.sectorId,
    arquetipo: schemaEntry.arquetipo,
    status: 'fail',
    injectionMode: null,
    pipelineOk: false,
    renderResults: [],
    screenshots: {},
    summary: { pass: 0, fail: 0, warn: 0, skip: 0, blockers: 0 },
    durationMs: 0,
  };

  const mapEntry = mapEntryForSub(schemaEntry.subcategoriaId, null);
  if (!mapEntry) {
    return { ...base, pipelineError: `sin render-map para ${subSlug}`, status: 'skipped' };
  }

  let artifacts;
  try {
    artifacts = buildPipelineArtifacts(ctx, schemaEntry);
  } catch (e) {
    return { ...base, pipelineError: e.message, status: 'error' };
  }

  if (artifacts.error) {
    return { ...base, pipelineError: artifacts.error, status: 'skipped' };
  }
  if (!artifacts.pipelineOk) {
    return { ...base, pipelineError: 'Fase B hydrate falló (__hydratedFromBloques)', status: 'fail' };
  }

  const mapWithNested = { ...mapEntry, nestedProfileKey: artifacts.nestedProfileKey };

  const payload = buildPreviewPayload(mapEntry, artifacts.hydrated, {}, { strict });
  if (strict) base.strictMode = true;

  const page = await newPage(session);
  try {
    const nav = await navigateAndPaint(session, page, payload, mapEntry, { strict });
    base.injectionMode = nav.injectionMode;
    base.pipelineOk = true;
    base.url = nav.url;
    base.paintOk = nav.paintOk !== false;
    if (nav.pageErrors?.length) base.pageErrors = nav.pageErrors;
    if (nav.consoleErrors?.length) base.consoleErrors = nav.consoleErrors;

    if (strict && (nav.pageErrors?.length || nav.paintOk === false)) {
      const errMsg = nav.pageErrors?.[0]?.message || nav.paintError || 'paint timeout';
      base.runtimeCrash = {
        message: errMsg,
        stack: nav.pageErrors?.[0]?.stack || null,
        pageErrors: nav.pageErrors || [],
        consoleErrors: nav.consoleErrors || [],
        paintOk: nav.paintOk === true,
        paintError: nav.paintError || null,
        sessionStoragePresent: nav.sessionStoragePresent === true,
      };
    }

    const extractFn = domExtractorSource();
    const dom = await page.evaluate(extractFn, {
      scopeSelector: mapEntry.scopeSelector,
      forbiddenSelectors: mapEntry.forbiddenSelectors,
    });

    base.dataVista = dom.dataVista;
    base.dataTema = dom.dataTema;
    base.pcardCount = dom.pcardCount;

    const sectionTexts = await extractSectionTexts(page, mapEntry.sections, mapEntry.forbiddenSelectors);

    const presenceAndLocation = runRenderChecks({
      fieldContracts: artifacts.fieldContracts,
      mergedCfg: artifacts.mergedCfg,
      regCtx: artifacts.regCtx,
      hydrated: artifacts.hydrated,
      finalized: artifacts.finalized,
      dom,
      sectionTexts,
      mapEntry: mapWithNested,
      subcategoriaId: schemaEntry.subcategoriaId,
    });

    const privacy = runRenderPrivacyChecks({
      dom,
      fieldContracts: artifacts.fieldContracts,
      mapEntry: mapWithNested,
      subcategoriaId: schemaEntry.subcategoriaId,
    });

    const demoForbidden = [];
    for (const needle of mapEntry.demoForbiddenNeedles || []) {
      const match = findTextMatches(dom, [needle], sectionTexts);
      if (match.count > 0) {
        demoForbidden.push({
          subcategoriaId: schemaEntry.subcategoriaId,
          check: 'demo-forbidden',
          status: 'fail',
          severity: 'bloqueador',
          reason: `contenido demo sintético visible: ${needle}`,
          blockFieldId: '*',
          expectedText: needle,
        });
      }
    }

    base.renderResults = [...presenceAndLocation, ...privacy.filter((p) => p.blockFieldId !== '*' || p.status === 'fail'), ...demoForbidden];

    if (base.runtimeCrash) {
      base.renderResults.unshift({
        subcategoriaId: schemaEntry.subcategoriaId,
        check: 'runtime',
        status: 'fail',
        severity: 'bloqueador',
        reason: `Runtime crash or incomplete paint: ${base.runtimeCrash.message}`,
        blockFieldId: '*',
        stack: base.runtimeCrash.stack,
      });
    }

    base.summary = aggregateRenderStatus(base.renderResults);
    base.status = base.summary.subStatus;

    if (dom.dataPerfilTipo && mapEntry.dataPerfilTipo && dom.dataPerfilTipo !== mapEntry.dataPerfilTipo) {
      base.vistaMismatch = { expected: mapEntry.dataPerfilTipo, actual: dom.dataPerfilTipo, attr: 'data-perfil-tipo' };
    } else if (dom.dataVista && (mapEntry.dataVista ?? mapEntry.vista) !== dom.dataVista && !mapEntry.dataPerfilTipo) {
      base.vistaMismatch = { expected: mapEntry.dataVista ?? mapEntry.vista, actual: dom.dataVista, attr: 'data-vista' };
    }

    base.screenshots = await captureScreenshots(page, shotsDir, subSlug);
  } finally {
    await page.close();
  }

  base.durationMs = Date.now() - started;
  return base;
}

export function aggregateRenderResults(subResults) {
  const summary = {
    totalSubs: subResults.length,
    processed: 0,
    subsPass: 0,
    subsFail: 0,
    subsSkipped: 0,
    renderChecksTotal: 0,
    presencePass: 0,
    presenceFail: 0,
    locationWarn: 0,
    locationFail: 0,
    duplicateWarn: 0,
    privacyDomViolations: 0,
    runtimeCrashes: 0,
    blockers: 0,
    screenshotsCaptured: 0,
  };

  const failures = [];

  for (const sub of subResults) {
    if (sub.status === 'skipped') {
      summary.subsSkipped++;
      continue;
    }
    if (sub.pipelineError && !sub.pipelineOk) {
      summary.subsFail++;
      failures.push({
        subcategoriaId: sub.subcategoriaId,
        check: 'pipeline',
        status: 'fail',
        severity: 'bloqueador',
        reason: sub.pipelineError,
      });
      continue;
    }

    summary.processed++;
    if (sub.status === 'pass') summary.subsPass++;
    else summary.subsFail++;

    if (sub.runtimeCrash) {
      summary.runtimeCrashes++;
      failures.push({
        subcategoriaId: sub.subcategoriaId,
        sectorId: sub.sectorId,
        check: 'runtime',
        status: 'fail',
        severity: 'bloqueador',
        reason: sub.runtimeCrash.message,
        stack: sub.runtimeCrash.stack,
        pageErrors: sub.runtimeCrash.pageErrors,
        consoleErrors: sub.runtimeCrash.consoleErrors,
      });
    }

    if (sub.screenshots?.full) summary.screenshotsCaptured++;

    for (const r of sub.renderResults || []) {
      if (r.status === 'skip') continue;
      summary.renderChecksTotal++;
      if (r.check === 'presence' && r.status === 'pass') summary.presencePass++;
      if (r.check === 'presence' && r.status === 'fail') {
        summary.presenceFail++;
        failures.push(r);
      }
      if (r.check === 'location' && r.status === 'fail') {
        summary.locationFail++;
        failures.push(r);
      }
      if (r.check === 'location' && r.status === 'warn') summary.locationWarn++;
      if (r.check === 'duplicate' && r.status === 'warn') summary.duplicateWarn++;
      if (r.check === 'absence' && r.status === 'fail') {
        summary.privacyDomViolations++;
        summary.blockers++;
        failures.push(r);
      }
      if (r.check === 'runtime' && r.status === 'fail') {
        summary.blockers++;
      }
      if (r.severity === 'bloqueador' && r.status === 'fail' && r.check !== 'runtime') summary.blockers++;
    }
  }

  const topFailures = [...subResults]
    .filter((s) => s.status === 'fail')
    .map((s) => ({
      subcategoriaId: s.subcategoriaId,
      sectorId: s.sectorId,
      failCount: s.summary?.fail || 0,
      topReasons: (s.renderResults || [])
        .filter((r) => r.status === 'fail')
        .slice(0, 3)
        .map((r) => `${r.blockFieldId}: ${r.reason}`),
    }))
    .sort((a, b) => b.failCount - a.failCount);

  return { summary, failures, topFailures };
}

export const SMOKE_SUBS = ['medicos-generales', 'dominatrix', 'unicorns'];
