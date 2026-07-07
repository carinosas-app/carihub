/**
 * QA-PARIDAD-REG-PUB — Fase A: catálogo estático (443 subs, FieldContract, gaps).
 * node scripts/qa-paridad-reg-pub-static.mjs [--sector salud] [--sub medicos-generales] [--out dir]
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

import { makeCtx, loadRegistroBlocksStack, REPO } from './qa-paridad-reg-pub/lib/vm-context.mjs';
import {
  loadSchemaIndex,
  listSubcategorias,
  ctxFromSchemaEntry,
  schemaResolvedFromEntry,
} from './qa-paridad-reg-pub/lib/catalog-loader.mjs';
import { extractFieldContracts } from './qa-paridad-reg-pub/lib/field-extractor.mjs';
import { collectBlocksSubMaps, analyzeGaps } from './qa-paridad-reg-pub/lib/gap-analyzer.mjs';
import { writeJson, buildMarkdownSummary } from './qa-paridad-reg-pub/lib/report-writer.mjs';
import { slugSubId } from './qa-paridad-reg-pub/lib/slug.mjs';

function parseArgs(argv) {
  const out = { sector: null, sub: null, outDir: null };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--sector' && argv[i + 1]) out.sector = argv[++i];
    else if (argv[i] === '--sub' && argv[i + 1]) out.sub = argv[++i];
    else if (argv[i] === '--out' && argv[i + 1]) out.outDir = argv[++i];
  }
  return out;
}

function gitCommitShort() {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: REPO, encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function resolveNestedKey(ctx, sectorId, mergedCfg) {
  if (mergedCfg?.nestedProfileKey) return mergedCfg.nestedProfileKey;
  const Registry = ctx.CariHubSectorContractRegistry;
  if (Registry?.resolveNestedKey) {
    const k = Registry.resolveNestedKey(sectorId);
    if (k) return k;
  }
  return null;
}

function main() {
  const args = parseArgs(process.argv);
  const runId = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outBase =
    args.outDir ||
    path.join(REPO, 'agent-tools', 'qa-paridad-reports', runId);

  console.log('[Fase A] Cargando VM blocks stack…');
  const ctx = makeCtx();
  const loadedScripts = loadRegistroBlocksStack(ctx);

  const PB = ctx.CariHubRegistroPublicBlocks;
  if (!PB?.resolveConfig || !PB.mergedConfig) {
    console.error('FAIL: CariHubRegistroPublicBlocks no cargado');
    process.exit(3);
  }

  const index = loadSchemaIndex(ctx);
  const schemaEntries = listSubcategorias(index, {
    sectorId: args.sector || undefined,
    subcategoriaId: args.sub || undefined,
  });

  console.log(`[Fase A] Procesando ${schemaEntries.length} subcategorías…`);

  const blocksMaps = collectBlocksSubMaps(ctx);
  const allFieldContracts = [];
  const subResults = [];
  const bySubcategoria = {};

  for (const entry of schemaEntries) {
    const regCtx = ctxFromSchemaEntry(entry);
    const resolved = schemaResolvedFromEntry(entry);
    const rawCfg = PB.resolveConfig(regCtx, resolved);
    const hasResolveConfig = !!rawCfg;
    let mergedCfg = null;
    let fieldContracts = [];
    let nestedProfileKey = null;
    let error = null;

    if (rawCfg) {
      try {
        mergedCfg = PB.mergedConfig(rawCfg, regCtx);
        nestedProfileKey = resolveNestedKey(ctx, entry.sectorId, mergedCfg);
        fieldContracts = extractFieldContracts(entry, mergedCfg, nestedProfileKey);
        allFieldContracts.push(...fieldContracts);
      } catch (e) {
        error = e.message;
      }
    }

    const subRecord = {
      subcategoriaId: entry.subcategoriaId,
      subcategoria: entry.subcategoria,
      sectorId: entry.sectorId,
      categoriaPrincipal: entry.categoriaPrincipal,
      arquetipo: entry.arquetipo,
      tipoPerfil: entry.tipoPerfil,
      formularioId: entry.formularioId,
      componentePerfil: entry.componentePerfil || null,
      componenteResultados: entry.componenteResultados || null,
      hasResolveConfig,
      configId: mergedCfg?.id || rawCfg?.id || null,
      deltaPack: mergedCfg?.deltaPack || rawCfg?.deltaPack || null,
      nestedProfileKey,
      fieldCount: fieldContracts.length,
      blockCount: mergedCfg?.blocks?.length || 0,
      obligatorios: mergedCfg?.obligatorios || [],
      error,
      fields: fieldContracts,
    };
    subResults.push(subRecord);
    bySubcategoria[slugSubId(entry.subcategoriaId)] = subRecord;
  }

  const gaps = analyzeGaps(
    listSubcategorias(index),
    subResults,
    blocksMaps
  );

  const withConfig = subResults.filter((r) => r.hasResolveConfig).length;
  const withFields = subResults.filter((r) => r.fieldCount > 0).length;
  const privateFieldCount = allFieldContracts.filter((f) => f.privacy.isPrivateField).length;
  const toggleFieldCount = allFieldContracts.filter((f) => f.privacy.isTogglePublic).length;

  const sectorAgg = new Map();
  for (const r of subResults) {
    const sid = r.sectorId || 'unknown';
    if (!sectorAgg.has(sid)) {
      sectorAgg.set(sid, { sectorId: sid, total: 0, withConfig: 0, fieldCount: 0 });
    }
    const row = sectorAgg.get(sid);
    row.total++;
    if (r.hasResolveConfig) row.withConfig++;
    row.fieldCount += r.fieldCount;
  }

  const catalog = {
    meta: {
      agentVersion: '1.0.0-fase-a',
      phase: 'A',
      runId,
      gitCommit: gitCommitShort(),
      generatedAt: new Date().toISOString(),
      schemaIndexVersion: index.version || null,
      schemaTotal: index.total || schemaEntries.length,
      loadedScripts,
      blocksGlobals: blocksMaps.map((b) => ({
        globalName: b.globalName,
        sectorId: b.sectorId,
        subToPackCount: b.keys.length,
      })),
      decisions: {
        playwrightInjection: 'page.evaluate (opción A)',
        phaseCInCi: false,
        reportsGitignored: true,
      },
    },
    summary: {
      totalSchemaSubs: schemaEntries.length,
      withResolveConfig: withConfig,
      withoutResolveConfig: schemaEntries.length - withConfig,
      withFields,
      totalFieldContracts: allFieldContracts.length,
      privateFieldCount,
      toggleFieldCount,
      blocksSubToPackTotal: blocksMaps.reduce((n, m) => n + m.keys.length, 0),
    },
    gaps,
    bySector: [...sectorAgg.values()].sort((a, b) => a.sectorId.localeCompare(b.sectorId)),
    subcategorias: subResults.map(({ fields, ...rest }) => ({
      ...rest,
      fieldIds: fields.map((f) => f.blockFieldId),
    })),
    fieldInventory: allFieldContracts,
    bySubcategoriaDetailed: bySubcategoria,
  };

  const risks = [
    {
      nivel: 'importante',
      texto: `${gaps.schemaWithoutResolveConfig.length} subs en schema-index sin resolveConfig — registro dinámico no disponible.`,
    },
    {
      nivel: 'importante',
      texto: 'Fase A no valida pipeline ni render; gaps de persist/hydrate/DOM requieren Fase B/C.',
    },
    {
      nivel: 'mejora',
      texto: `${gaps.blocksSubNotInSchema.length} entradas SUB_TO_PACK sin match en schema-index (aliases o drift).`,
    },
    {
      nivel: 'mejora',
      texto: `${gaps.schemaSubMissingInSubToPack.length} subs con config pero slug ausente en SUB_TO_PACK (pack default).`,
    },
  ];
  catalog.risks = risks;

  writeJson(path.join(outBase, 'catalog.json'), catalog);
  writeJson(path.join(outBase, 'gaps.json'), gaps);
  writeJson(path.join(outBase, 'field-inventory.json'), allFieldContracts);

  const md = buildMarkdownSummary({ meta: catalog.meta, summary: catalog.summary, gaps, bySector: catalog.bySector, risks });
  fs.mkdirSync(outBase, { recursive: true });
  fs.writeFileSync(path.join(outBase, 'summary.md'), md, 'utf8');

  console.log('\n=== QA Paridad Fase A — completado ===');
  console.log('Salida:', outBase);
  console.log('Subcategorías:', catalog.summary.totalSchemaSubs);
  console.log('Con resolveConfig:', catalog.summary.withResolveConfig);
  console.log('Sin resolveConfig:', catalog.summary.withoutResolveConfig);
  console.log('FieldContracts:', catalog.summary.totalFieldContracts);
  console.log('Gaps sin resolveConfig:', gaps.schemaWithoutResolveConfig.length);
  console.log('Gaps SUB_TO_PACK ↔ schema:', gaps.blocksSubNotInSchema.length, 'blocks→schema,', gaps.schemaSubMissingInSubToPack.length, 'schema→blocks');

  if (gaps.schemaWithoutResolveConfig.length > 0 && !args.sector && !args.sub) {
    process.exit(0);
  }
  process.exit(0);
}

main();
