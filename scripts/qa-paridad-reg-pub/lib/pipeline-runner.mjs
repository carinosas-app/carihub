import { applyFinalizeChain } from './finalize-chain.mjs';
import { buildMockBloques } from './mock-generator.mjs';
import { extractFieldContracts } from './field-extractor.mjs';
import {
  ctxFromSchemaEntry,
  schemaResolvedFromEntry,
} from './catalog-loader.mjs';
import { runParityChecks, runSubIntegrityChecks } from './parity-checker.mjs';
import { runPrivacyChecks } from './privacy-checker.mjs';
import { runContaminationChecks } from './contamination-checker.mjs';

function resolveNestedKey(ctx, sectorId, mergedCfg) {
  if (mergedCfg?.nestedProfileKey) return mergedCfg.nestedProfileKey;
  const Registry = ctx.CariHubSectorContractRegistry;
  if (Registry?.resolveNestedKey) {
    const k = Registry.resolveNestedKey(sectorId);
    if (k) return k;
  }
  return inferNestedFromMapped(null, ctx);
}

function inferNestedFromMapped(mapped, ctx) {
  const PB = ctx.CariHubRegistroPublicBlocks;
  const keys = PB?.PROFILE_NESTED_KEYS || [];
  for (const k of keys) {
    if (mapped?.[k]) return k;
  }
  return null;
}

/**
 * @param {object} opts
 * @returns {Promise<object>}
 */
export function runSubPipeline(opts) {
  const { ctx, schemaEntry } = opts;
  const PB = ctx.CariHubRegistroPublicBlocks;
  const Submit = ctx.CariHubRegistroPerfilSubmit;
  const Reg = ctx.CariHubResultadosRegistrados;
  const Guard = ctx.CariHubPublicPrivacyGuard;

  const regCtx = ctxFromSchemaEntry(schemaEntry);
  const schemaResuelto = schemaResolvedFromEntry(schemaEntry);
  const started = Date.now();

  const base = {
    subcategoriaId: schemaEntry.subcategoriaId,
    sectorId: schemaEntry.sectorId,
    arquetipo: schemaEntry.arquetipo,
    pipelineError: null,
    stages: {},
    fieldResults: [],
    subIntegrity: [],
    privacyResults: [],
    contaminationResults: [],
    summary: { pass: 0, fail: 0, warn: 0, skip: 0 },
    durationMs: 0,
  };

  const rawCfg = PB.resolveConfig(regCtx, schemaResuelto);
  if (!rawCfg) {
    return {
      ...base,
      pipelineError: 'sin resolveConfig',
      status: 'skipped',
    };
  }

  let mergedCfg;
  let fieldContracts;
  let nestedProfileKey;

  try {
    mergedCfg = PB.mergedConfig(rawCfg, regCtx);
    nestedProfileKey = resolveNestedKey(ctx, schemaEntry.sectorId, mergedCfg);
    fieldContracts = extractFieldContracts(schemaEntry, mergedCfg, nestedProfileKey);
  } catch (e) {
    return {
      ...base,
      pipelineError: e.message,
      status: 'error',
    };
  }

  let mockBloques;
  let finalized;
  let mapped;
  let fullDoc;
  let slimDoc;
  let hydrated;

  try {
    mockBloques = buildMockBloques(mergedCfg, regCtx, fieldContracts);
    finalized = applyFinalizeChain(mockBloques, regCtx, PB);
    base.stages.mock = { ok: true, fieldCount: Object.keys(finalized).length };

    mapped = PB.mapToPerfil({}, finalized, regCtx);
    base.stages.map = { ok: true, keys: Object.keys(mapped).length };
    if (!nestedProfileKey) nestedProfileKey = inferNestedFromMapped(mapped, ctx);

    const draft = {
      contexto: regCtx,
      schemaResuelto,
      camposPublicos: {
        alias: 'QA Paridad B',
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

    fullDoc = Submit.buildUsuarioDoc('uid_qa_b', draft, priv, {}, {});
    base.stages.build = { ok: true, subcategoriaId: fullDoc.subcategoriaId, sectorId: fullDoc.sectorId };

    slimDoc = Submit.slimProfileForFirestore(fullDoc);
    base.stages.slim = {
      ok: !!slimDoc?.camposPublicos?.bloquesPublicos,
      hasNested: nestedProfileKey ? !!slimDoc?.[nestedProfileKey] : null,
    };

    const mockFs = { id: 'uid_qa_b', exists: true, data: () => slimDoc };
    hydrated = Reg.normalizar(mockFs);
    base.stages.hydrate = {
      ok: hydrated?.__hydratedFromBloques === true,
      nestedKey: nestedProfileKey,
    };
    base.stages.privacyGuard = { ok: !hydrated?.datosPrivados && !hydrated?.verificacion };
  } catch (e) {
    return {
      ...base,
      pipelineError: e.message,
      status: 'error',
      durationMs: Date.now() - started,
    };
  }

  const parityResults = runParityChecks({
    fieldContracts,
    mergedCfg,
    regCtx,
    mockBloques: finalized,
    mapped,
    slimDoc,
    hydrated,
    nestedProfileKey,
  });

  const subIntegrity = runSubIntegrityChecks({ mapped, slimDoc, hydrated, nestedProfileKey });
  const privacyResults = runPrivacyChecks({
    fieldContracts,
    slimDoc,
    hydrated,
    guard: Guard,
    nestedProfileKey,
  }).map((r) => ({ ...r, subcategoriaId: schemaEntry.subcategoriaId }));

  const contaminationResults = runContaminationChecks({
    slimDoc,
    hydrated,
    nestedProfileKey,
    profileNestedKeys: PB.PROFILE_NESTED_KEYS,
  }).map((r) => ({ ...r, subcategoriaId: schemaEntry.subcategoriaId }));

  const allResults = [...parityResults, ...privacyResults.filter((r) => r.status === 'fail')];

  for (const r of allResults) {
    if (r.status === 'pass') base.summary.pass++;
    else if (r.status === 'fail') base.summary.fail++;
    else if (r.status === 'warn') base.summary.warn++;
    else if (r.status === 'skip') base.summary.skip++;
  }

  for (const si of subIntegrity) {
    if (si.status === 'fail') base.summary.fail++;
    else base.summary.pass++;
  }

  for (const cr of contaminationResults) {
    if (cr.status === 'fail') base.summary.fail++;
    else if (cr.status === 'warn') base.summary.warn++;
    else base.summary.pass++;
  }

  const hasBlocker =
    subIntegrity.some((s) => s.status === 'fail') ||
    privacyResults.some((p) => p.status === 'fail' && p.severity === 'bloqueador') ||
    contaminationResults.some((c) => c.status === 'fail');

  base.fieldResults = parityResults;
  base.subIntegrity = subIntegrity;
  base.privacyResults = privacyResults;
  base.contaminationResults = contaminationResults;
  base.nestedProfileKey = nestedProfileKey;
  base.durationMs = Date.now() - started;
  base.status = hasBlocker || base.pipelineError ? 'fail' : base.summary.fail > 0 ? 'fail' : 'pass';

  return base;
}

export function aggregateResults(subResults) {
  const summary = {
    totalSubs: subResults.length,
    processed: 0,
    pipelineErrors: 0,
    subsPass: 0,
    subsFail: 0,
    subsSkipped: 0,
    fieldChecksTotal: 0,
    fieldPass: 0,
    fieldFail: 0,
    fieldWarn: 0,
    fieldSkip: 0,
    privacyViolations: 0,
    contaminationHits: 0,
  };

  const failures = [];

  for (const sub of subResults) {
    if (sub.pipelineError && sub.status === 'skipped') {
      summary.subsSkipped++;
      continue;
    }
    if (sub.pipelineError) {
      summary.pipelineErrors++;
      summary.subsFail++;
      failures.push({
        subcategoriaId: sub.subcategoriaId,
        sectorId: sub.sectorId,
        stage: 'pipeline',
        status: 'fail',
        severity: 'bloqueador',
        reason: sub.pipelineError,
      });
      continue;
    }

    summary.processed++;
    if (sub.status === 'pass') summary.subsPass++;
    else summary.subsFail++;

    for (const fr of sub.fieldResults || []) {
      summary.fieldChecksTotal++;
      if (fr.status === 'pass') summary.fieldPass++;
      else if (fr.status === 'fail') {
        summary.fieldFail++;
        failures.push(fr);
      } else if (fr.status === 'warn') summary.fieldWarn++;
      else if (fr.status === 'skip') summary.fieldSkip++;
    }

    for (const pr of sub.privacyResults || []) {
      if (pr.status === 'fail') {
        summary.privacyViolations++;
        failures.push({ ...pr, subcategoriaId: sub.subcategoriaId, sectorId: sub.sectorId });
      }
    }

    for (const cr of sub.contaminationResults || []) {
      if (cr.status === 'fail') {
        summary.contaminationHits++;
        failures.push({ ...cr, subcategoriaId: sub.subcategoriaId, sectorId: sub.sectorId });
      }
    }

    for (const si of sub.subIntegrity || []) {
      if (si.status === 'fail') {
        failures.push({
          subcategoriaId: sub.subcategoriaId,
          sectorId: sub.sectorId,
          blockFieldId: si.name,
          stage: 'sub_integrity',
          status: 'fail',
          severity: si.severity || 'bloqueador',
          reason: si.reason,
        });
      }
    }
  }

  const topFailures = [...subResults]
    .filter((s) => s.status === 'fail' && !s.pipelineError)
    .sort((a, b) => (b.summary?.fail || 0) - (a.summary?.fail || 0))
    .slice(0, 10)
    .map((s) => ({
      subcategoriaId: s.subcategoriaId,
      sectorId: s.sectorId,
      failCount: s.summary?.fail || 0,
    }));

  return { summary, failures, topFailures };
}
