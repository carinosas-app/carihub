/**
 * MP-RESTAURANTES-GASTRONOMIA-BEBIDAS-V1 — Fase 1: catálogo 32→24 + schema/packs/MATRIZ.
 * Uso: node scripts/apply-gastronomia-deltas-v1.mjs
 *
 * NO runtime blocks · NO preview/ficha/render · NO deploy.
 * Fuente de verdad: scripts/gastronomia-packs-v1.mjs
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import {
  CANON_SUBCATEGORIAS,
  LEGACY_TO_CANON,
  NEW_SUBCATEGORIAS,
  ADULTOS_REDIRECTS,
  EVENTOS_REDIRECTS,
  GASTRONOMIA_FIELD_REGISTRY,
  SUB_DELTAS,
  SUB_TO_PACK,
  RISK_PROFILE_BY_CANON,
  REGULATED_CANON_SUBS,
  buildPackPlantillas,
  packPlantillaKey,
  UI_IND_GASTRONOMIA,
  UI_NEG_GASTRONOMIA,
  CATALOG_SEMVER,
  SCHEMA_VERSION,
  GASTRONOMIA_SCHEMA_REVISION,
  SECTOR_ID,
  SECTOR_PUBLIC_NAME,
} from "./gastronomia-packs-v1.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}

function writeJson(rel, data) {
  fs.writeFileSync(path.join(root, rel), JSON.stringify(data, null, 2) + "\n", "utf8");
}

function uniq(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function slugKeywords(nombre) {
  return uniq([
    nombre.toLowerCase(),
    ...nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .split(/[\s/'()]+/)
      .filter((t) => t.length > 2),
  ]);
}

function legacyIdsForCanon(canonId) {
  return Object.entries(LEGACY_TO_CANON)
    .filter(([, c]) => c === canonId)
    .map(([l]) => l);
}

function buildBusqueda(canon, legacyRows) {
  const legacyIds = legacyIdsForCanon(canon.subcategoriaId);
  const keywords = slugKeywords(canon.nombre);
  const aliases = [];
  const sinonimos = [];
  const palabrasRelacionadas = ["comida", "restaurante", "gastronomia", "bebidas"];
  const erroresComunes = [];

  for (const legId of legacyIds) {
    aliases.push(legId.replace(/-/g, " "));
    const leg = legacyRows.find((r) => r.subcategoriaId === legId);
    if (!leg?.busqueda) continue;
    keywords.push(...(leg.busqueda.keywords || []));
    aliases.push(...(leg.busqueda.aliases || []));
    sinonimos.push(...(leg.busqueda.sinonimos || []));
    palabrasRelacionadas.push(...(leg.busqueda.palabrasRelacionadas || []));
    erroresComunes.push(...(leg.busqueda.erroresComunes || []));
  }

  return {
    keywords: uniq(keywords),
    aliases: uniq(aliases),
    sinonimos: uniq(sinonimos),
    palabrasRelacionadas: uniq(palabrasRelacionadas),
    erroresComunes: uniq(erroresComunes),
    prioridadBusqueda: 50,
    estadoActivo: true,
    geoPrimero: true,
    legacySubcategoriaIds: legacyIds,
    canonDesde: SCHEMA_VERSION,
  };
}

function adminLevel(canonId) {
  if (REGULATED_CANON_SUBS.has(canonId)) return "media";
  return "baja";
}

function buildSchemaSub(canon) {
  const pack = canon.pack;
  const arquetipo = packPlantillaKey(pack);
  const deltaSpec = SUB_DELTAS[canon.subcategoriaId];
  const risk = RISK_PROFILE_BY_CANON[canon.subcategoriaId] || {};
  const delta = {
    deltaPack: pack,
    canonSubcategoriaId: canon.subcategoriaId,
    obligatoriosDelta: deltaSpec?.obligatoriosDelta || [],
    camposPublicosPerfil: deltaSpec?.camposPublicosPerfil || (deltaSpec?.deltaFields || []).slice(0, 14),
    camposPrivadosPerfil: deltaSpec?.camposPrivadosPerfil || [],
    previewFicha: deltaSpec?.previewFicha || {},
    textosAyuda: deltaSpec?.textosAyuda || {},
    legacySubcategoriaIds: legacyIdsForCanon(canon.subcategoriaId),
    keywordsIA: slugKeywords(canon.nombre),
    nestedProfileKey: "gastronomiaPerfil",
  };
  if (REGULATED_CANON_SUBS.has(canon.subcategoriaId)) {
    delta.regulada = true;
    if (canon.subcategoriaId === "dark-kitchen") {
      delta.requiresAdminReview = "condicional";
      delta.privacidadDireccion = true;
    }
    if (["bares", "cervecerias", "cantinas-vinotecas", "distribuidoras-alimentos-bebidas"].includes(canon.subcategoriaId)) {
      delta.declarativaAlcohol = true;
    }
  }
  return {
    subcategoriaId: canon.subcategoriaId,
    nombre: canon.nombre,
    sectorId: SECTOR_ID,
    arquetipo,
    tipoPerfil: canon.tipoPerfil,
    heredaDe: `plantillasArquetipo.${arquetipo}`,
    delta,
    keywordsIA: slugKeywords(canon.nombre),
    metadata: { mp: "MP-RESTAURANTES-GASTRONOMIA-BEBIDAS-V1", riskProfile: risk, schemaRevision: GASTRONOMIA_SCHEMA_REVISION },
  };
}

function buildMapaRow(canon, templatePersona, templateNegocio, legacyRows) {
  const isNegocio = canon.formularioId === "negocio_empresa";
  const tpl = isNegocio ? templateNegocio : templatePersona;
  const pack = canon.pack;
  const arquetipo = packPlantillaKey(pack);
  const admin = adminLevel(canon.subcategoriaId);

  return {
    categoriaPrincipal: SECTOR_PUBLIC_NAME,
    sectorId: SECTOR_ID,
    categoriaPadre: SECTOR_ID,
    subcategoria: canon.nombre,
    subcategoriaId: canon.subcategoriaId,
    tipoRegistro: isNegocio ? "Negocio o Empresa" : "Persona Independiente",
    formulario: isNegocio ? "Formulario Negocio" : "Formulario Persona Independiente",
    formularioId: canon.formularioId,
    arquetipo,
    tipoPerfil: canon.tipoPerfil,
    componenteResultados: isNegocio ? "ResultCardNegocio" : "ResultCardServicio",
    componentePerfil: isNegocio ? "ProfileLayoutNegocio" : "ProfileLayoutServicio",
    schemaVersion: SCHEMA_VERSION,
    verif: isNegocio ? "negocio INE+RFC" : "persona INE",
    fotos: isNegocio ? 5 : 3,
    mapa: isNegocio,
    admin,
    busqueda: buildBusqueda(canon, legacyRows),
    renderizado: tpl?.renderizado || {
      fallbackResultados: "ResultCardGenerico",
      fallbackPerfil: "ProfileLayoutGenerico",
    },
    categoriaSugerida: tpl?.categoriaSugerida
      ? {
          ...tpl.categoriaSugerida,
          formularioTemporal: isNegocio ? "temporal_negocio_empresa" : "temporal_persona_independiente",
        }
      : tpl?.categoriaSugerida,
    comercial: tpl?.comercial,
    metadata: {
      deltaPack: pack,
      mp: "MP-RESTAURANTES-GASTRONOMIA-BEBIDAS-V1",
      catalogSemver: CATALOG_SEMVER,
      nestedProfileKey: "gastronomiaPerfil",
    },
  };
}

function patchSectoresCarihub() {
  const file = path.join(root, "public/js/sectores-carihub.js");
  let content = fs.readFileSync(file, "utf8");
  const names = CANON_SUBCATEGORIAS.map((c) => c.nombre);
  const subsBlock = names.map((n) => `        '${n.replace(/'/g, "\\'")}',`).join("\n");
  const anchor = "id: 'restaurantes'";
  const start = content.indexOf(anchor);
  if (start < 0) throw new Error("Ancla restaurantes no encontrada en sectores-carihub.js");
  content = content.replace(
    /id: 'restaurantes',\s*\n\s*emoji:[^\n]+\n\s*nombre: '[^']+'/,
    `id: 'restaurantes',\n      emoji: '🍔',\n      nombre: '${SECTOR_PUBLIC_NAME.replace(/'/g, "\\'")}'`
  );
  const subsStart = content.indexOf("subcategorias: subs([", start);
  const subsEnd = content.indexOf("]),", subsStart);
  if (subsStart < 0 || subsEnd < 0) throw new Error("subs restaurantes no encontrado");
  content = `${content.slice(0, subsStart)}subcategorias: subs([\n${subsBlock}\n      ]),${content.slice(subsEnd + 3)}`;
  fs.writeFileSync(file, content, "utf8");
  console.log("Patched sectores-carihub.js (24 subs canon gastronomía + nombre público)");
}

function patchCatalogoExpandido() {
  const rel = "scripts/catalogo-expandido-datos.json";
  const cat = readJson(rel);
  if (!cat.sectores?.restaurantes) throw new Error("catalogo-expandido sin sector restaurantes");
  cat.sectores.restaurantes.nombre = SECTOR_PUBLIC_NAME;
  cat.sectores.restaurantes.subcategorias = CANON_SUBCATEGORIAS.map((c) => c.nombre);
  cat.sectores.restaurantes.fusiones = [
    ...(cat.sectores.restaurantes.fusiones || []).filter((f) => !f.mpGastronomiaV1),
    {
      mpGastronomiaV1: true,
      nota: "MP-RESTAURANTES-GASTRONOMIA-BEBIDAS-V1 — 32 legacy → 24 canon; 7 exclusiones Adultos/Eventos",
      legacyCount: 32,
      canonCount: 24,
      excluidosAdultos: Object.keys(ADULTOS_REDIRECTS),
      excluidosEventos: Object.keys(EVENTOS_REDIRECTS),
    },
  ];
  cat.sectores.restaurantes.legacyToCanon = { ...LEGACY_TO_CANON };
  cat.sectores.restaurantes.exclusionRedirects = { adultos: ADULTOS_REDIRECTS, eventos: EVENTOS_REDIRECTS };
  writeJson(rel, cat);
  console.log("Patched catalogo-expandido-datos.json");
}

function patchMapa() {
  const rel = "scripts/mapa-registro-categorias.json";
  const mapa = readJson(rel);
  const legacyRows = mapa.matrix.filter((r) => r.sectorId === SECTOR_ID);
  const templatePersona = legacyRows.find((r) => r.subcategoriaId === "chef-privado") || legacyRows[0];
  const templateNegocio = legacyRows.find((r) => r.subcategoriaId === "restaurante") || legacyRows.find((r) => r.formularioId === "negocio_empresa");

  mapa.matrix = mapa.matrix.filter((r) => r.sectorId !== SECTOR_ID);
  for (const canon of CANON_SUBCATEGORIAS) {
    mapa.matrix.push(buildMapaRow(canon, templatePersona, templateNegocio, legacyRows));
  }
  mapa.total = mapa.matrix.length;
  mapa.generado = new Date().toISOString();
  mapa.catalogSemver = CATALOG_SEMVER;
  mapa.gastronomiaLegacyRedirect = { ...LEGACY_TO_CANON };
  mapa.gastronomiaExclusionRedirects = { adultos: ADULTOS_REDIRECTS, eventos: EVENTOS_REDIRECTS };
  writeJson(rel, mapa);
  console.log("Patched mapa-registro-categorias.json (restaurantes 24 canon, total", mapa.total, ")");
}

function mergeFieldRegistry(schema) {
  schema.meta = schema.meta || {};
  schema.meta.fieldRegistry = schema.meta.fieldRegistry || {};
  Object.assign(schema.meta.fieldRegistry, GASTRONOMIA_FIELD_REGISTRY);
}

function patchSchema(rel, formularioId) {
  const schema = readJson(rel);
  schema.versionSchema = SCHEMA_VERSION;
  schema.version = SCHEMA_VERSION;
  mergeFieldRegistry(schema);
  Object.assign(schema.plantillasArquetipo, buildPackPlantillas());

  schema.subcategorias = schema.subcategorias.filter((s) => s.sectorId !== SECTOR_ID);
  for (const canon of CANON_SUBCATEGORIAS.filter((c) => c.formularioId === formularioId)) {
    schema.subcategorias.push(buildSchemaSub(canon));
  }
  writeJson(rel, schema);
  const count = schema.subcategorias.filter((s) => s.sectorId === SECTOR_ID).length;
  console.log(`Patched ${rel} (gastronomía subs: ${count})`);
}

function patchMatriz() {
  const rel = "scripts/MATRIZ-FORMULARIO-UI-REGISTRO.json";
  const matriz = readJson(rel);
  const rows = matriz.asignaciones.filter((r) => r.sectorId !== SECTOR_ID);

  for (const canon of CANON_SUBCATEGORIAS) {
    const arquetipo = packPlantillaKey(canon.pack);
    rows.push({
      subcategoriaId: canon.subcategoriaId,
      subcategoria: canon.nombre,
      sectorId: SECTOR_ID,
      formularioSchemaId: canon.formularioId,
      arquetipo,
      formularioUiId: canon.formularioId === "negocio_empresa" ? UI_NEG_GASTRONOMIA : UI_IND_GASTRONOMIA,
    });
  }

  matriz.asignaciones = rows;
  matriz.version = SCHEMA_VERSION;

  const uiIndExists = matriz.catalogoUi.some((u) => u.formularioUiId === UI_IND_GASTRONOMIA);
  const uiNegExists = matriz.catalogoUi.some((u) => u.formularioUiId === UI_NEG_GASTRONOMIA);

  if (!uiIndExists) {
    matriz.catalogoUi.push({
      formularioUiId: UI_IND_GASTRONOMIA,
      titulo: "Registro · gastronomía (independiente)",
      formularioSchemaId: "persona_independiente",
      arquetipo: "persona_servicio_profesional",
      sectorCluster: "restaurantes",
      subcategorias: 0,
      publicoUi: {
        labels: {
          alias: "Nombre comercial o profesional",
          servicios: "Detalle de tu servicio gastronómico",
          precio: "Precio desde",
          tagline: "Frase que vende tu oficio",
        },
        obligatoriosExtra: ["permisoManipulacionAlimentos"],
      },
      privadoUi: { igualSchema: "persona_servicio_profesional" },
    });
  }
  if (!uiNegExists) {
    matriz.catalogoUi.push({
      formularioUiId: UI_NEG_GASTRONOMIA,
      titulo: "Registro · negocio gastronómico",
      formularioSchemaId: "negocio_empresa",
      arquetipo: "negocio_alimentos",
      sectorCluster: "restaurantes",
      subcategorias: 0,
      publicoUi: {
        labels: {
          alias: "Nombre comercial",
          servicios: "Especialidad y servicios",
          precio: "Precio promedio desde",
        },
        obligatoriosExtra: ["geo", "permisoManipulacionAlimentos"],
      },
      privadoUi: { bloqueRepresentante: true },
    });
  }

  const indCount = rows.filter((r) => r.sectorId === SECTOR_ID && r.formularioUiId === UI_IND_GASTRONOMIA).length;
  const negCount = rows.filter((r) => r.sectorId === SECTOR_ID && r.formularioUiId === UI_NEG_GASTRONOMIA).length;

  const uiInd = matriz.catalogoUi.find((u) => u.formularioUiId === UI_IND_GASTRONOMIA);
  const uiNeg = matriz.catalogoUi.find((u) => u.formularioUiId === UI_NEG_GASTRONOMIA);
  if (uiInd) uiInd.subcategorias = indCount;
  if (uiNeg) uiNeg.subcategorias = negCount;

  matriz.resumen.totalSubcategorias = rows.length;
  if (matriz.resumen.formulariosSchema) {
    matriz.resumen.formulariosSchema.persona_independiente = rows.filter((r) => r.formularioSchemaId === "persona_independiente").length;
    matriz.resumen.formulariosSchema.negocio_empresa = rows.filter((r) => r.formularioSchemaId === "negocio_empresa").length;
  }

  writeJson(rel, matriz);
  console.log("Patched MATRIZ (ui_ind_gastronomia:", indCount, "ui_neg_gastronomia:", negCount, ")");
}

function patchBusquedaEnriquecimiento() {
  const rel = "scripts/busqueda-enriquecimiento.json";
  const bus = readJson(rel);
  bus.legacySubcategoriaRedirectGastronomia = { ...LEGACY_TO_CANON };
  bus.gastronomiaExclusionRedirectsAdultos = { ...ADULTOS_REDIRECTS };
  bus.gastronomiaExclusionRedirectsEventos = { ...EVENTOS_REDIRECTS };

  for (const canon of CANON_SUBCATEGORIAS) {
    const legacyIds = legacyIdsForCanon(canon.subcategoriaId);
    bus.porSubcategoriaId[canon.subcategoriaId] = {
      aliases: uniq([canon.nombre.toLowerCase(), ...legacyIds, ...legacyIds.map((id) => id.replace(/-/g, " "))]),
      sinonimos: legacyIds.map((id) => id.replace(/-/g, " ")),
      palabrasRelacionadas: ["comida", "restaurante", "gastronomia", "bebidas", "menu"],
      legacySubcategoriaIds: legacyIds,
      nota: "MP-RESTAURANTES-GASTRONOMIA-BEBIDAS-V1 canon",
    };
  }

  for (const [legacyId, canonId] of Object.entries(LEGACY_TO_CANON)) {
    bus.fusionAliases = bus.fusionAliases || {};
    bus.fusionAliases[legacyId] = uniq([...(bus.fusionAliases[legacyId] || []), canonId]);
    if (bus.porSubcategoriaId[legacyId]) {
      bus.porSubcategoriaId[legacyId].redirectTo = canonId;
      bus.porSubcategoriaId[legacyId].nota = `Legacy → ${canonId} (MP-RESTAURANTES-GASTRONOMIA-BEBIDAS-V1)`;
    }
  }

  for (const [legacyId, dest] of Object.entries(ADULTOS_REDIRECTS)) {
    if (bus.porSubcategoriaId[legacyId]) {
      bus.porSubcategoriaId[legacyId].redirectToSector = "adultos";
      bus.porSubcategoriaId[legacyId].redirectTo = dest;
      bus.porSubcategoriaId[legacyId].nota = "Exclusión F0 → Adultos (antros/vida nocturna)";
    }
  }
  for (const [legacyId, dest] of Object.entries(EVENTOS_REDIRECTS)) {
    if (bus.porSubcategoriaId[legacyId]) {
      bus.porSubcategoriaId[legacyId].redirectToSector = "eventos";
      bus.porSubcategoriaId[legacyId].redirectTo = dest;
      bus.porSubcategoriaId[legacyId].nota = "Exclusión F0 → Eventos (catering/banquetes/mesero)";
    }
  }

  writeJson(rel, bus);
  console.log("Patched busqueda-enriquecimiento.json (gastronomía redirects + exclusiones)");
}

function patchActaCatalogo() {
  const rel = "scripts/ACTA-CONGELAMIENTO-CATALOGO.json";
  const acta = readJson(rel);
  const mapa = readJson("scripts/mapa-registro-categorias.json");
  acta.versionCatalogo.semver = CATALOG_SEMVER;
  acta.versionCatalogo.versionMeta = SCHEMA_VERSION;
  acta.versionCatalogo.versionSchemaRegistro = SCHEMA_VERSION;
  acta.versionCatalogo.nota = "MINOR gastronomía 32→24 canon MP-RESTAURANTES-GASTRONOMIA-BEBIDAS-V1";
  acta.metricasFinales.subcategorias = mapa.total;
  acta.metricasFinales.filasMapa = mapa.total;
  acta.procedimientoVersionado.historialVersiones.push({
    semver: CATALOG_SEMVER,
    versionCatalogo: `catalogo-${SCHEMA_VERSION}`,
    fecha: SCHEMA_VERSION,
    evento: "MINOR_MP_GASTRONOMIA_V1",
    validacion: "Pendiente post apply — qa-gastronomia-deltas-v1-schema.mjs",
    notas:
      "Sector restaurantes: 32→24 canon; nested gastronomiaPerfil; exclusiones Adultos (2) y Eventos (5); packs LOCAL_DINE..B2B_DIST.",
  });
  writeJson(rel, acta);
  console.log("Patched ACTA-CONGELAMIENTO-CATALOGO.json");
}

function patchSchemaMeta() {
  const rel = "scripts/config-registro-schema.meta.json";
  const meta = readJson(rel);
  meta.versionMeta = SCHEMA_VERSION;
  meta.catalogSemver = CATALOG_SEMVER;
  meta.gastronomiaDeltas = {
    schemaRevision: GASTRONOMIA_SCHEMA_REVISION,
    mp: "MP-RESTAURANTES-GASTRONOMIA-BEBIDAS-V1",
    sectorId: SECTOR_ID,
    sectorPublicName: SECTOR_PUBLIC_NAME,
    nestedProfileKey: "gastronomiaPerfil",
    canonSubcategorias: 24,
    legacyMapped: 25,
    legacyExcludedAdultos: 2,
    legacyExcludedEventos: 5,
    legacyRedirect: "busqueda-enriquecimiento.json → legacySubcategoriaRedirectGastronomia",
  };
  writeJson(rel, meta);
  console.log("Patched config-registro-schema.meta.json");
}

function patchArquetiposCatalogo() {
  const file = path.join(root, "scripts/arquetipos-catalogo.mjs");
  let content = fs.readFileSync(file, "utf8");
  if (content.includes("gastronomiaArquetipoForSub")) {
    console.log("arquetipos-catalogo.mjs: gastronomía ya parcheado");
    return;
  }

  content = content.replace(
    'from "./eventos-packs-v1.mjs";',
    'from "./eventos-packs-v1.mjs";\nimport { SUB_TO_PACK as GASTRONOMIA_SUB_TO_PACK, packPlantillaKey as gastronomiaPackKey } from "./gastronomia-packs-v1.mjs";'
  );

  const fn = `
export function gastronomiaPackForSub(subcategoriaId) {
  return GASTRONOMIA_SUB_TO_PACK[subcategoriaId] || null;
}

export function gastronomiaArquetipoForSub(subcategoriaId) {
  const pack = gastronomiaPackForSub(subcategoriaId);
  if (!pack) return null;
  return gastronomiaPackKey(pack);
}
`;

  content = content.replace(
    'export function eventosPackForSub(subcategoriaId) {',
    `${fn}\nexport function eventosPackForSub(subcategoriaId) {`
  );

  content = content.replace(
    'if (sectorId === "eventos") {',
    'if (sectorId === "restaurantes") {\n    const ga = gastronomiaArquetipoForSub(subcategoriaId);\n    if (ga) return ga;\n    return "persona_servicio_profesional";\n  }\n  if (sectorId === "eventos") {'
  );

  content = content.replace(
    'export function sectorArquetipoNegocio(sectorId, nombre, subcategoriaId) {\n  const n = nombre.toLowerCase();',
    'export function sectorArquetipoNegocio(sectorId, nombre, subcategoriaId) {\n  if (sectorId === "restaurantes" && subcategoriaId) {\n    const ga = gastronomiaArquetipoForSub(subcategoriaId);\n    if (ga) return ga;\n  }\n  const n = nombre.toLowerCase();'
  );

  fs.writeFileSync(file, content, "utf8");
  console.log("Patched arquetipos-catalogo.mjs (gastronomía packs)");
}

function exportLegacyAliasesFile() {
  writeJson("scripts/gastronomia-legacy-subcategoria-aliases.json", {
    version: SCHEMA_VERSION,
    mp: "MP-RESTAURANTES-GASTRONOMIA-BEBIDAS-V1",
    descripcion: "Redirección legacy subcategoriaId → canon gastronomía + exclusiones Adultos/Eventos",
    legacyToCanon: { ...LEGACY_TO_CANON },
    exclusionAdultos: { ...ADULTOS_REDIRECTS },
    exclusionEventos: { ...EVENTOS_REDIRECTS },
    canonSubcategorias: CANON_SUBCATEGORIAS.map((c) => c.subcategoriaId),
    nuevasSubcategorias: NEW_SUBCATEGORIAS.map((n) => n.subcategoriaId),
  });
  console.log("Wrote gastronomia-legacy-subcategoria-aliases.json");
}

patchSectoresCarihub();
patchCatalogoExpandido();
patchMapa();
patchSchema("scripts/config-registro-independiente-schema.json", "persona_independiente");
patchSchema("scripts/config-registro-negocio-schema.json", "negocio_empresa");
patchMatriz();
patchBusquedaEnriquecimiento();
patchActaCatalogo();
patchSchemaMeta();
patchArquetiposCatalogo();
exportLegacyAliasesFile();

function rebuildSchemaIndex() {
  const r = spawnSync(process.execPath, ["scripts/build-registro-schema-lite.mjs"], {
    cwd: root,
    stdio: "inherit",
  });
  if (r.status !== 0) {
    throw new Error("build-registro-schema-lite.mjs failed");
  }
}

rebuildSchemaIndex();

console.log("\nMP-RESTAURANTES-GASTRONOMIA-BEBIDAS-V1 Fase 1 apply OK");
console.log("Siguiente: node scripts/qa-gastronomia-deltas-v1-schema.mjs");
