/**
 * MP-EVENTOS-DELTAS-V1 — Fase 1: catálogo 37→20 + schema/packs/MATRIZ.
 * Uso: node scripts/apply-eventos-deltas-v1.mjs
 *
 * NO runtime · NO blocks · NO preview/ficha · NO deploy.
 * Fuente de verdad: scripts/eventos-packs-v1.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  CANON_SUBCATEGORIAS,
  LEGACY_TO_CANON,
  NEW_SUBCATEGORIAS,
  EVENTOS_FIELD_REGISTRY,
  SUB_DELTAS,
  SUB_TO_PACK,
  RISK_PROFILE_BY_CANON,
  buildPackPlantillas,
  packPlantillaKey,
  UI_IND_EVENTOS,
  UI_NEG_EVENTOS,
  CATALOG_SEMVER,
  SCHEMA_VERSION,
  SECTOR_ID,
} from "./eventos-packs-v1.mjs";

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
  const palabrasRelacionadas = ["eventos", "fiesta", "boda"];
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
    prioridadBusqueda: 55,
    estadoActivo: true,
    geoPrimero: true,
    legacySubcategoriaIds: legacyIds,
    canonDesde: SCHEMA_VERSION,
  };
}

function adminLevel(canonId, pack) {
  if (["pirotecnia-efectos-especiales", "seguridad-eventos"].includes(canonId)) return "alta";
  if (pack === "SHOW") return "media";
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
    camposPublicosPerfil: (deltaSpec?.deltaFields || []).slice(0, 14),
    previewFicha: deltaSpec?.previewFicha || {},
    textosAyuda: deltaSpec?.textosAyuda || {},
    legacySubcategoriaIds: legacyIdsForCanon(canon.subcategoriaId),
    keywordsIA: slugKeywords(canon.nombre),
  };
  if (canon.subcategoriaId === "pirotecnia-efectos-especiales") {
    delta.sensible = true;
    delta.regulada = true;
    delta.requiresAdminReview = true;
    delta.nivelRevisionAdmin = "alta";
  }
  if (canon.subcategoriaId === "seguridad-eventos") {
    delta.regulada = true;
    delta.requiresAdminReview = true;
    delta.nivelRevisionAdmin = "alta";
  }
  if (canon.subcategoriaId === "shows-para-eventos") {
    delta.coherenciaSensible = true;
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
    metadata: { mp: "MP-EVENTOS-DELTAS-V1", riskProfile: risk },
  };
}

function buildMapaRow(canon, templatePersona, templateNegocio, templateVenue, legacyRows) {
  const isNegocio = canon.formularioId === "negocio_empresa";
  const tpl = canon.pack === "VENUE" ? templateVenue : isNegocio ? templateNegocio : templatePersona;
  const pack = canon.pack;
  const arquetipo = packPlantillaKey(pack);
  const admin = adminLevel(canon.subcategoriaId, pack);

  return {
    categoriaPrincipal: "Eventos, Espectáculos y Fiestas",
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
    renderizado: tpl.renderizado || {
      fallbackResultados: isNegocio ? "ResultCardGenerico" : "ResultCardGenerico",
      fallbackPerfil: isNegocio ? "ProfileLayoutGenerico" : "ProfileLayoutGenerico",
    },
    categoriaSugerida: tpl.categoriaSugerida,
    comercial: tpl.comercial,
    metadata: {
      deltaPack: pack,
      mp: "MP-EVENTOS-DELTAS-V1",
      catalogSemver: CATALOG_SEMVER,
      ...(admin === "alta" ? { requiresAdminReview: true } : {}),
    },
  };
}

function patchSectoresCarihub() {
  const file = path.join(root, "public/js/sectores-carihub.js");
  let content = fs.readFileSync(file, "utf8");
  const names = CANON_SUBCATEGORIAS.map((c) => c.nombre);
  const subsBlock = names.map((n) => `        '${n.replace(/'/g, "\\'")}',`).join("\n");
  const anchor = "id: 'eventos'";
  const start = content.indexOf(anchor);
  if (start < 0) throw new Error("Ancla eventos no encontrada en sectores-carihub.js");
  const subsStart = content.indexOf("subcategorias: subs([", start);
  const subsEnd = content.indexOf("]),", subsStart);
  if (subsStart < 0 || subsEnd < 0) throw new Error("subs eventos no encontrado");
  content = `${content.slice(0, subsStart)}subcategorias: subs([\n${subsBlock}\n      ]),${content.slice(subsEnd + 3)}`;
  fs.writeFileSync(file, content, "utf8");
  console.log("Patched sectores-carihub.js (20 subs canon eventos)");
}

function patchCatalogoExpandido() {
  const rel = "scripts/catalogo-expandido-datos.json";
  const cat = readJson(rel);
  if (!cat.sectores?.eventos) throw new Error("catalogo-expandido sin sector eventos");
  cat.sectores.eventos.subcategorias = CANON_SUBCATEGORIAS.map((c) => c.nombre);
  cat.sectores.eventos.fusiones = [
    ...(cat.sectores.eventos.fusiones || []).filter((f) => !f.mpEventosV1),
    {
      mpEventosV1: true,
      nota: "MP-EVENTOS-DELTAS-V1 — 37 legacy → 20 canon; ver LEGACY_TO_CANON en eventos-packs-v1.mjs",
      legacyCount: 37,
      canonCount: 20,
    },
  ];
  cat.sectores.eventos.legacyToCanon = { ...LEGACY_TO_CANON };
  writeJson(rel, cat);
  console.log("Patched catalogo-expandido-datos.json");
}

function patchMapa() {
  const rel = "scripts/mapa-registro-categorias.json";
  const mapa = readJson(rel);
  const legacyRows = mapa.matrix.filter((r) => r.sectorId === SECTOR_ID);
  const templatePersona = legacyRows.find((r) => r.subcategoriaId === "dj") || legacyRows[0];
  const templateNegocio = legacyRows.find((r) => r.subcategoriaId === "catering-para-eventos");
  const templateVenue = legacyRows.find((r) => r.subcategoriaId === "salon-de-eventos");

  mapa.matrix = mapa.matrix.filter((r) => r.sectorId !== SECTOR_ID);
  for (const canon of CANON_SUBCATEGORIAS) {
    mapa.matrix.push(buildMapaRow(canon, templatePersona, templateNegocio, templateVenue, legacyRows));
  }
  mapa.total = mapa.matrix.length;
  mapa.generado = new Date().toISOString();
  mapa.catalogSemver = CATALOG_SEMVER;
  mapa.eventosLegacyRedirect = { ...LEGACY_TO_CANON };
  writeJson(rel, mapa);
  console.log("Patched mapa-registro-categorias.json (eventos 20 canon, total", mapa.total, ")");
}

function mergeFieldRegistry(schema) {
  schema.meta = schema.meta || {};
  schema.meta.fieldRegistry = schema.meta.fieldRegistry || {};
  Object.assign(schema.meta.fieldRegistry, EVENTOS_FIELD_REGISTRY);
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
  console.log(`Patched ${rel} (eventos subs: ${count})`);
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
      formularioUiId: canon.formularioId === "negocio_empresa" ? UI_NEG_EVENTOS : UI_IND_EVENTOS,
    });
  }

  matriz.asignaciones = rows;
  matriz.version = SCHEMA_VERSION;

  const uiIndExists = matriz.catalogoUi.some((u) => u.formularioUiId === UI_IND_EVENTOS);
  const uiNegExists = matriz.catalogoUi.some((u) => u.formularioUiId === UI_NEG_EVENTOS);

  if (!uiIndExists) {
    matriz.catalogoUi.push({
      formularioUiId: UI_IND_EVENTOS,
      titulo: "Registro · eventos y fiestas (independiente)",
      formularioSchemaId: "persona_independiente",
      arquetipo: "persona_servicio_profesional",
      sectorCluster: "eventos",
      subcategorias: 0,
      publicoUi: {
        labels: {
          alias: "Nombre artístico o comercial",
          servicios: "Detalle de tu servicio para eventos",
          precio: "Cotización desde",
          tagline: "Frase que vende tu servicio",
        },
        obligatoriosExtra: ["especialidadesEvento"],
      },
      privadoUi: { igualSchema: "persona_servicio_profesional" },
    });
  }
  if (!uiNegExists) {
    matriz.catalogoUi.push({
      formularioUiId: UI_NEG_EVENTOS,
      titulo: "Registro · negocio de eventos",
      formularioSchemaId: "negocio_empresa",
      arquetipo: "negocio_servicios_local",
      sectorCluster: "eventos",
      subcategorias: 0,
      publicoUi: {
        labels: {
          alias: "Nombre comercial",
          servicios: "Servicios para eventos",
          precio: "Cotización desde",
        },
        obligatoriosExtra: ["geo", "direccion"],
      },
      privadoUi: { bloqueRepresentante: true },
    });
  }

  const indCount = rows.filter(
    (r) => r.sectorId === SECTOR_ID && r.formularioUiId === UI_IND_EVENTOS
  ).length;
  const negCount = rows.filter(
    (r) => r.sectorId === SECTOR_ID && r.formularioUiId === UI_NEG_EVENTOS
  ).length;

  const uiInd = matriz.catalogoUi.find((u) => u.formularioUiId === UI_IND_EVENTOS);
  const uiNeg = matriz.catalogoUi.find((u) => u.formularioUiId === UI_NEG_EVENTOS);
  if (uiInd) uiInd.subcategorias = indCount;
  if (uiNeg) uiNeg.subcategorias = negCount;

  matriz.resumen.totalSubcategorias = rows.length;
  matriz.resumen.totalFormularioUi = matriz.catalogoUi.length;
  if (matriz.resumen.formulariosSchema) {
    matriz.resumen.formulariosSchema.persona_independiente = rows.filter(
      (r) => r.formularioSchemaId === "persona_independiente"
    ).length;
    matriz.resumen.formulariosSchema.negocio_empresa = rows.filter(
      (r) => r.formularioSchemaId === "negocio_empresa"
    ).length;
  }

  writeJson(rel, matriz);
  console.log("Patched MATRIZ (ui_ind_eventos:", indCount, "ui_neg_eventos:", negCount, ")");
}

function patchBusquedaEnriquecimiento() {
  const rel = "scripts/busqueda-enriquecimiento.json";
  const bus = readJson(rel);
  bus.version = SCHEMA_VERSION;
  bus.legacySubcategoriaRedirectEventos = { ...LEGACY_TO_CANON };

  for (const canon of CANON_SUBCATEGORIAS) {
    const legacyIds = legacyIdsForCanon(canon.subcategoriaId);
    bus.porSubcategoriaId[canon.subcategoriaId] = {
      aliases: uniq([canon.nombre.toLowerCase(), ...legacyIds, ...legacyIds.map((id) => id.replace(/-/g, " "))]),
      sinonimos: legacyIds.map((id) => id.replace(/-/g, " ")),
      palabrasRelacionadas: ["eventos", "fiesta", "boda", "celebracion"],
      legacySubcategoriaIds: legacyIds,
      nota: "MP-EVENTOS-DELTAS-V1 canon",
    };
  }

  for (const [legacyId, canonId] of Object.entries(LEGACY_TO_CANON)) {
    bus.fusionAliases = bus.fusionAliases || {};
    bus.fusionAliases[legacyId] = uniq([...(bus.fusionAliases[legacyId] || []), canonId]);
    if (bus.porSubcategoriaId[legacyId]) {
      bus.porSubcategoriaId[legacyId].redirectTo = canonId;
      bus.porSubcategoriaId[legacyId].nota = `Legacy → ${canonId} (MP-EVENTOS-DELTAS-V1)`;
    }
  }

  writeJson(rel, bus);
  console.log("Patched busqueda-enriquecimiento.json (legacy redirects)");
}

function patchActaCatalogo() {
  const rel = "scripts/ACTA-CONGELAMIENTO-CATALOGO.json";
  const acta = readJson(rel);
  const mapa = readJson("scripts/mapa-registro-categorias.json");
  acta.versionCatalogo.semver = CATALOG_SEMVER;
  acta.versionCatalogo.versionMeta = SCHEMA_VERSION;
  acta.versionCatalogo.versionSchemaRegistro = SCHEMA_VERSION;
  acta.versionCatalogo.nota = "MINOR eventos 37→20 canon MP-EVENTOS-DELTAS-V1";
  acta.metricasFinales.subcategorias = mapa.total;
  acta.metricasFinales.filasMapa = mapa.total;
  acta.procedimientoVersionado.historialVersiones.push({
    semver: CATALOG_SEMVER,
    versionCatalogo: `catalogo-${SCHEMA_VERSION}`,
    fecha: SCHEMA_VERSION,
    evento: "MINOR_MP_EVENTOS_DELTAS_V1",
    validacion: "Pendiente post apply — validar-schemas-registro.mjs",
    notas: "Sector eventos: 37→20 subcategorías canon; packs VENUE..TRANSPORT; legacy via LEGACY_TO_CANON.",
  });
  writeJson(rel, acta);
  console.log("Patched ACTA-CONGELAMIENTO-CATALOGO.json (semver", CATALOG_SEMVER, "total", mapa.total, ")");
}

function patchSchemaMeta() {
  const rel = "scripts/config-registro-schema.meta.json";
  const meta = readJson(rel);
  meta.versionMeta = SCHEMA_VERSION;
  meta.catalogSemver = CATALOG_SEMVER;
  meta.eventosDeltas = {
    mp: "MP-EVENTOS-DELTAS-V1",
    canonSubcategorias: 20,
    legacyMapped: 37,
    legacyRedirect: "busqueda-enriquecimiento.json → legacySubcategoriaRedirectEventos",
  };
  writeJson(rel, meta);
  console.log("Patched config-registro-schema.meta.json");
}

function patchArquetiposCatalogo() {
  const file = path.join(root, "scripts/arquetipos-catalogo.mjs");
  let content = fs.readFileSync(file, "utf8");
  if (content.includes("eventosArquetipoForSub")) {
    console.log("arquetipos-catalogo.mjs: eventos ya parcheado");
    return;
  }

  content = content.replace(
    'from "./bienestar-packs-v1.mjs";',
    'from "./bienestar-packs-v1.mjs";\nimport { SUB_TO_PACK as EVENTOS_SUB_TO_PACK, packPlantillaKey as eventosPackKey } from "./eventos-packs-v1.mjs";'
  );

  const fn = `
export function eventosPackForSub(subcategoriaId) {
  return EVENTOS_SUB_TO_PACK[subcategoriaId] || null;
}

export function eventosArquetipoForSub(subcategoriaId) {
  const pack = eventosPackForSub(subcategoriaId);
  if (!pack) return null;
  return eventosPackKey(pack);
}
`;

  content = content.replace(
    'export function bienestarPackForSub(subcategoriaId) {',
    `${fn}\nexport function bienestarPackForSub(subcategoriaId) {`
  );

  content = content.replace(
    'if (["educacion", "eventos", "tecnologia"].includes(sectorId)) return "persona_servicio_profesional";',
    'if (sectorId === "eventos") {\n    const ev = eventosArquetipoForSub(subcategoriaId);\n    if (ev) return ev;\n    return "persona_servicio_profesional";\n  }\n  if (["educacion", "tecnologia"].includes(sectorId)) return "persona_servicio_profesional";'
  );

  fs.writeFileSync(file, content, "utf8");
  console.log("Patched arquetipos-catalogo.mjs");
}

function exportLegacyAliasesFile() {
  writeJson("scripts/eventos-legacy-subcategoria-aliases.json", {
    version: SCHEMA_VERSION,
    mp: "MP-EVENTOS-DELTAS-V1",
    descripcion: "Redirección legacy subcategoriaId → canon para búsqueda y migración runtime futura",
    legacyToCanon: { ...LEGACY_TO_CANON },
    canonSubcategorias: CANON_SUBCATEGORIAS.map((c) => c.subcategoriaId),
    nuevasSubcategorias: NEW_SUBCATEGORIAS.map((n) => n.subcategoriaId),
  });
  console.log("Wrote eventos-legacy-subcategoria-aliases.json");
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

console.log("\nMP-EVENTOS-DELTAS-V1 Fase 1 apply OK");
console.log("Siguiente: node scripts/qa-eventos-deltas-v1-schema.mjs && node scripts/validar-schemas-registro.mjs");
