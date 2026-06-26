/**
 * Validación cruzada: mapa-registro-categorias.json ↔ schemas de registro + precios.
 * Uso: node scripts/validar-schemas-registro.mjs
 * Salida: consola + scripts/validacion-schemas-report.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scripts = path.join(root, "scripts");

const META = JSON.parse(fs.readFileSync(path.join(scripts, "config-registro-schema.meta.json"), "utf8"));
const MAPA = JSON.parse(fs.readFileSync(path.join(scripts, "mapa-registro-categorias.json"), "utf8"));

const SCHEMA_FILES = {
  adultos: "config-registro-adultos-schema.json",
  persona_independiente: "config-registro-independiente-schema.json",
  profesionista_cedula: "config-registro-profesionista-schema.json",
  negocio_empresa: "config-registro-negocio-schema.json",
};

const PRECIOS_FILE = "config-precios-planes-perfiles-schema.json";
const COMPONENTES_RESULTADOS = new Set([
  "ResultCardPersona", "ResultCardProfesional", "ResultCardNegocio", "ResultCardAdultos",
  "ResultCardVenue", "ResultCardServicio", "ResultCardPareja", "ResultCardUnicorn", "ResultCardCreador",
  "ResultCardEspectaculo", "ResultCardGenerico",
]);
const COMPONENTES_PERFIL = new Set([
  "ProfileLayoutPersona", "ProfileLayoutProfesional", "ProfileLayoutNegocio", "ProfileLayoutAdultos",
  "ProfileLayoutVenue", "ProfileLayoutServicio", "ProfileLayoutPareja", "ProfileLayoutCreador",
  "ProfileLayoutEspectaculo", "ProfileLayoutGenerico", "ProfileLayoutHospedaje",
]);
const FORMULARIO_TEMPORAL = {
  adultos: "temporal_adultos",
  persona_independiente: "temporal_persona_independiente",
  profesionista_cedula: "temporal_profesionista_cedula",
  negocio_empresa: "temporal_negocio_empresa",
};
const SECTORES_EXPANSION = new Set([
  "bienes-raices", "eventos", "transporte", "educacion", "tecnologia", "restaurantes", "mascotas", "industria",
]);
const COMMERCIAL_FILES = {
  promocionesPerfiles: "config-promociones-perfiles-schema.json",
  promocionesBanners: "config-promociones-banners-schema.json",
  contratos: "config-contratos-carihub-schema.json",
  estados: "config-estados-revision-publicacion-schema.json",
  visitante: "config-registro-visitante-schema.json",
  categoriasSugeridas: "config-categorias-sugeridas-schema.json",
  renderizado: "config-renderizado-dinamico-schema.json",
  componentesUI: "config-registro-componentes-ui-schema.json",
};
const CUENTAS_FILE = "config-cuentas-usuario-schema.json";
const FORM_MAP = META.convenciones.mapaFormularioToFormularioId;
const TIPOS_REGISTRO = META.convenciones.tiposRegistroComercial || [
  "adultos",
  "persona_independiente",
  "profesionista_cedula",
  "negocio_empresa",
  "usuario_visitante",
];
const PERIODOS_COMERCIALES = META.convenciones.periodosComerciales || ["semanal", "quincenal", "mensual"];
const ESTADOS_REVISION = META.convenciones.estadosRevision || [];
const TIPO_PERFIL_VALIDOS = new Set(META.convenciones.tipoPerfilValidos);
const CAMPOS_SISTEMA = new Set(META.convenciones.camposSistema);
const ANIDADOS = META.convenciones.camposAnidadosPermitidos;
const PLANES_REQUERIDOS = ["basico", "destacado", "premium", "vip"];

const errors = [];
const warnings = [];
const recommendations = [];

function err(code, msg, ctx = {}) {
  errors.push({ severidad: "error", code, mensaje: msg, ...ctx });
}
function warn(code, msg, ctx = {}) {
  warnings.push({ severidad: "advertencia", code, mensaje: msg, ...ctx });
}
function rec(msg) {
  recommendations.push(msg);
}

const ALIASES = META.convenciones.aliasesSubcategoriaId || {};

function canonicalId(id) {
  const c = String(id || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return ALIASES[c] || c;
}

function isValidSubIdFormat(id) {
  if (!id || typeof id !== "string") return false;
  if (!id.trim()) return false;
  if (/^\s|\s$/.test(id) && !id.includes(" ")) return false;
  return true;
}

function loadSchemas() {
  const schemas = {};
  for (const [fid, file] of Object.entries(SCHEMA_FILES)) {
    schemas[fid] = JSON.parse(fs.readFileSync(path.join(scripts, file), "utf8"));
  }
  schemas._precios = JSON.parse(fs.readFileSync(path.join(scripts, PRECIOS_FILE), "utf8"));
  schemas._comercial = {};
  for (const [key, file] of Object.entries(COMMERCIAL_FILES)) {
    const full = path.join(scripts, file);
    if (!fs.existsSync(full)) {
      err("COMERCIAL_ARCHIVO_FALTANTE", `Falta schema comercial: ${file}`, { archivo: file });
      continue;
    }
    schemas._comercial[key] = JSON.parse(fs.readFileSync(full, "utf8"));
  }
  return schemas;
}

function resolveFieldRoot(fieldRef) {
  if (!fieldRef) return null;
  if (fieldRef.includes(".")) return fieldRef.split(".")[0];
  if (fieldRef.includes("[")) return fieldRef.split("[")[0];
  return fieldRef;
}

function fieldExistsInRegistry(fieldRef, registry) {
  const root = resolveFieldRoot(fieldRef);
  if (CAMPOS_SISTEMA.has(root)) return true;
  if (root in registry) return true;
  if (root in ANIDADOS) {
    const sub = fieldRef.includes(".") ? fieldRef.split(".")[1] : null;
    if (!sub) return true;
    return ANIDADOS[root].includes(sub);
  }
  return false;
}

function collectFieldsFromLists(lists, registry, ctx, label) {
  const invalid = [];
  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const f of list) {
      if (!fieldExistsInRegistry(f, registry)) {
        invalid.push({ campo: f, contexto: label, ...ctx });
      }
    }
  }
  return invalid;
}

function getPlantilla(schema, arquetipo) {
  const p = schema.plantillasArquetipo?.[arquetipo];
  if (!p) return null;
  if (p.heredaDe && !p.componentes) {
    const parentKey = p.heredaDe.replace("plantillasArquetipo.", "");
    const parent = schema.plantillasArquetipo[parentKey];
    return { ...parent, ...p };
  }
  return p;
}

function mergedTextosAyuda(schema, sub) {
  const plantilla = getPlantilla(schema, sub.arquetipo);
  return {
    ...(plantilla?.textosAyuda || {}),
    ...(sub.delta?.textosAyuda || {}),
    ...(sub.textosAyuda || {}),
  };
}

function mergedKeywords(schema, sub) {
  const plantilla = getPlantilla(schema, sub.arquetipo);
  const kw = [...(plantilla?.keywordsIA || []), ...(sub.keywordsIA || []), ...(sub.delta?.keywordsIA || [])];
  return kw.filter(Boolean);
}

function validateSchemaStructure(formularioId, schema, fileName) {
  const vs = schema.versionSchema || schema.version;
  if (!vs) err("SCHEMA_SIN_VERSION", `${fileName}: falta versionSchema (o version)`, { formularioId });
  if (!schema.formularioId) err("SCHEMA_SIN_FORMULARIO_ID", `${fileName}: falta formularioId en raíz`, { fileName });
  else if (schema.formularioId !== formularioId) {
    err("SCHEMA_FORMULARIO_ID_MISMATCH", `${fileName}: formularioId ${schema.formularioId} ≠ esperado ${formularioId}`, { formularioId });
  }

  const meta = schema.meta;
  if (!meta?.fieldRegistry || !Object.keys(meta.fieldRegistry).length) {
    err("SCHEMA_SIN_FIELD_REGISTRY", `${fileName}: meta.fieldRegistry vacío o ausente`, { formularioId });
    return;
  }
  if (!meta.verificacionTipos || !Object.keys(meta.verificacionTipos).length) {
    err("SCHEMA_SIN_VERIFICACION", `${fileName}: falta meta.verificacionTipos`, { formularioId });
  }
  if (!meta.facturacionTipos || !Object.keys(meta.facturacionTipos).length) {
    err("SCHEMA_SIN_FACTURACION", `${fileName}: falta meta.facturacionTipos`, { formularioId });
  }
  if (!meta.componentesUI || !Object.keys(meta.componentesUI).length) {
    err("SCHEMA_SIN_COMPONENTES_UI", `${fileName}: falta meta.componentesUI`, { formularioId });
  }
  if (!meta.firestoreRecomendado) {
    err("SCHEMA_SIN_FIRESTORE", `${fileName}: falta meta.firestoreRecomendado`, { formularioId });
  }
  if (!schema.plantillasArquetipo || !Object.keys(schema.plantillasArquetipo).length) {
    err("SCHEMA_SIN_ARQUETIPOS", `${fileName}: falta plantillasArquetipo`, { formularioId });
  }
  if (!Array.isArray(schema.subcategorias)) {
    err("SCHEMA_SIN_SUBCATEGORIAS", `${fileName}: subcategorias no es array`, { formularioId });
  }

  const registry = meta.fieldRegistry;
  const base = meta.base || {};
  const fieldLists = [
    ["camposPublicosResultados", base.camposPublicosResultados],
    ["camposPublicosPerfil", base.camposPublicosPerfil],
    ["camposPrivados", base.camposPrivados],
    ["obligatorios", base.obligatorios],
    ["opcionales", base.opcionales],
  ];

  const invalidFields = [];
  for (const [label, list] of fieldLists) {
    invalidFields.push(...collectFieldsFromLists([list], registry, { formularioId, archivo: fileName }, `meta.base.${label}`));
  }

  for (const f of invalidFields) {
    err("CAMPO_INVALIDO_REGISTRY", `Campo '${f.campo}' en ${f.contexto} no existe en fieldRegistry`, f);
  }

  const noPublicos = new Set(base.noPublicos || []);
  const camposPrivados = new Set((base.camposPrivados || []).map(resolveFieldRoot));

  for (const np of noPublicos) {
    const root = resolveFieldRoot(np);
    const desc = registry[root];
    if (desc && desc.privado !== true && !camposPrivados.has(root)) {
      warn("CAMPO_NO_PUBLICO_SIN_PRIVADO", `Campo '${np}' está en noPublicos pero no tiene privado:true ni está en camposPrivados`, {
        formularioId,
        campo: np,
      });
    }
  }

  for (const [arqName, arq] of Object.entries(schema.plantillasArquetipo || {})) {
    if (!arq.tipoPerfil || !TIPO_PERFIL_VALIDOS.has(arq.tipoPerfil)) {
      if (!arq.heredaDe) err("ARQUETIPO_TIPO_PERFIL", `Arquetipo '${arqName}' tipoPerfil inválido: ${arq.tipoPerfil}`, { formularioId, arquetipo: arqName });
    }
    const comp = arq.componentes || (arq.heredaDe ? getPlantilla(schema, arqName)?.componentes : null);
    if (comp) {
      for (const compName of Object.values(comp)) {
        if (!meta.componentesUI[compName]) {
          warn("COMPONENTE_UI_NO_REGISTRADO", `Componente '${compName}' de arquetipo '${arqName}' no está en meta.componentesUI`, { formularioId, componente: compName });
        }
      }
    }
    const fMin = arq.fotosMin ?? base.fotosMin;
    const fMax = arq.fotosMax ?? base.fotosMax;
    if (fMin != null && fMax != null && fMin > fMax) {
      err("FOTOS_MIN_MAYOR_MAX", `Arquetipo '${arqName}': fotosMin (${fMin}) > fotosMax (${fMax})`, { formularioId, arquetipo: arqName });
    }
  }

  const bMin = base.fotosMin;
  const bMax = base.fotosMax;
  if (bMin != null && bMax != null && bMin > bMax) {
    err("FOTOS_MIN_MAYOR_MAX", `${fileName}: meta.base fotosMin > fotosMax`, { formularioId });
  }

  const arquetipoNames = new Set(Object.keys(schema.plantillasArquetipo || {}));
  const subIds = new Set();
  const subIdsCanon = new Map();

  for (const sub of schema.subcategorias || []) {
    if (!sub.subcategoriaId || !String(sub.subcategoriaId).trim()) {
      err("SUB_ID_VACIO", `Subcategoría sin subcategoriaId en ${fileName}`, { formularioId, nombre: sub.nombre });
      continue;
    }
    if (!isValidSubIdFormat(sub.subcategoriaId)) {
      warn("SUB_ID_FORMATO", `subcategoriaId con formato dudoso: '${sub.subcategoriaId}'`, { formularioId });
    }
    const canon = canonicalId(sub.subcategoriaId);
    if (subIdsCanon.has(canon)) {
      err("SUB_ID_DUPLICADO_SCHEMA", `subcategoriaId duplicado (canónico '${canon}') en ${fileName}`, {
        formularioId,
        ids: [subIdsCanon.get(canon), sub.subcategoriaId],
      });
    }
    subIdsCanon.set(canon, sub.subcategoriaId);
    subIds.add(canon);

    if (!sub.arquetipo) err("SUB_SIN_ARQUETIPO", `Sub '${sub.subcategoriaId}' sin arquetipo`, { formularioId });
    else if (!arquetipoNames.has(sub.arquetipo) && !sub.heredaDe?.includes(sub.arquetipo)) {
      err("ARQUETIPO_INVALIDO", `Sub '${sub.subcategoriaId}' arquetipo '${sub.arquetipo}' no existe en plantillasArquetipo`, {
        formularioId,
        arquetipo: sub.arquetipo,
      });
    }

    if (!sub.tipoPerfil || !TIPO_PERFIL_VALIDOS.has(sub.tipoPerfil)) {
      err("TIPO_PERFIL_INVALIDO", `Sub '${sub.subcategoriaId}' tipoPerfil inválido: ${sub.tipoPerfil}`, {
        formularioId,
        tipoPerfil: sub.tipoPerfil,
      });
    }

    const kw = mergedKeywords(schema, sub);
    if (!kw.length) {
      warn("SUB_SIN_KEYWORDS_IA", `Sub '${sub.subcategoriaId}' sin keywordsIA (ni en plantilla)`, { formularioId, subcategoriaId: sub.subcategoriaId });
    }

    const ayuda = mergedTextosAyuda(schema, sub);
    const plantilla = getPlantilla(schema, sub.arquetipo);
    const minAyuda = plantilla?.textosAyuda ? Object.keys(plantilla.textosAyuda).length : 0;
    if (minAyuda === 0 && Object.keys(ayuda).length === 0 && !kw.length) {
      warn("SUB_SIN_TEXTOS_AYUDA", `Sub '${sub.subcategoriaId}' sin textosAyuda ni keywordsIA fallback`, { formularioId, subcategoriaId: sub.subcategoriaId });
    }

    const delta = sub.delta || {};
    const plantillaResolved = getPlantilla(schema, sub.arquetipo);
    const lists = [
      delta.camposPublicosResultados,
      delta.camposPublicosPerfil,
      delta.camposPrivados,
      delta.obligatoriosExtra,
      plantillaResolved?.camposPublicosResultados,
      plantillaResolved?.camposPublicosPerfil,
      plantillaResolved?.camposPrivados,
      plantillaResolved?.obligatoriosExtra,
    ];
    for (const inv of collectFieldsFromLists(lists, registry, { formularioId, subcategoriaId: sub.subcategoriaId }, "delta/plantilla")) {
      err("CAMPO_INVALIDO_DELTA", `Sub '${sub.subcategoriaId}': campo '${inv.campo}' inválido`, inv);
    }

    const fMinSub = delta.fotosMin ?? plantillaResolved?.fotosMin ?? base.fotosMin;
    const fMaxSub = delta.fotosMax ?? plantillaResolved?.fotosMax ?? base.fotosMax;
    if (fMinSub != null && fMaxSub != null && fMinSub > fMaxSub) {
      err("FOTOS_MIN_MAYOR_MAX", `Sub '${sub.subcategoriaId}': fotosMin > fotosMax`, { formularioId, subcategoriaId: sub.subcategoriaId });
    }
  }

  return { subIdsCanon, subIds };
}

function validatePreciosSchema(precios) {
  const fileName = PRECIOS_FILE;
  const vs = precios.versionSchema || precios.version;
  if (!vs) err("PRECIOS_SIN_VERSION", `${fileName}: falta versionSchema`);
  if (precios.formularioId !== "config_precios_planes_perfiles") {
    err("PRECIOS_FORMULARIO_ID", `formularioId debe ser config_precios_planes_perfiles`, { actual: precios.formularioId });
  }

  for (const plan of PLANES_REQUERIDOS) {
    if (!precios.planes?.[plan]) err("PRECIOS_PLAN_FALTANTE", `Falta plan '${plan}'`, { plan });
    else if (precios.planes[plan].activo !== true && precios.planes[plan].activo !== false) {
      warn("PLAN_SIN_ACTIVO", `Plan '${plan}' sin campo activo explícito`);
    }
  }

  if (!precios.resolucionPrecio?.algoritmo?.length) {
    err("PRECIOS_SIN_ALGORITMO", "Falta resolucionPrecio.algoritmo");
  }
  if (!precios.resolucionPrecio?.especificidadOverride?.length) {
    err("PRECIOS_SIN_JERARQUIA", "Falta jerarquía de overrides en resolucionPrecio.especificidadOverride");
  }

  const ejemplos = precios.overrides?.ejemplos || [];
  for (const ov of ejemplos) {
    if (!ov.modoPrecio || !["automatico", "manual"].includes(ov.modoPrecio)) {
      err("PRECIOS_OVERRIDE_MODO", `Override '${ov.id}' sin modoPrecio automatico|manual`, { overrideId: ov.id });
    }
  }
  if (!precios.overrides?.campos?.modoPrecio) {
    warn("PRECIOS_OVERRIDE_SCHEMA", "Documentar overrides.campos.modoPrecio (recomendado)");
  }

  if (!precios.historialCambios?.coleccion) {
    err("PRECIOS_SIN_HISTORIAL", "Falta historialCambios.coleccion propuesto");
  }

  if (!precios.firestoreRecomendado?.documento) {
    err("PRECIOS_SIN_FIRESTORE", "Falta firestoreRecomendado.documento");
  }

  const adminEditable = precios.firestoreRecomendado?.escritura === "admin solamente" || precios.iaArquitecto?.puedeModificar === false;
  if (!adminEditable && !precios.firestoreRecomendado?.escritura) {
    warn("PRECIOS_ADMIN_EDIT", "Añadir firestoreRecomendado.escritura: admin solamente para edición futura Admin");
  }

  if (!precios.alineacionBanners?.coleccionParalela) {
    warn("PRECIOS_BANNERS_ALINEACION", "Documentar alineacionBanners.coleccionParalela");
  }
  if (precios.formularioId === "configuracion_publicidad" || precios.coleccionFirestore === "configuracion_publicidad") {
    err("PRECIOS_MEZCLADOS_BANNERS", "Schema precios perfiles mezclado con banners");
  }
  if (JSON.stringify(precios).includes("precios_banners") && !precios.alineacionBanners) {
    warn("PRECIOS_REF_BANNERS", "Referencias a banners solo permitidas en alineacionBanners");
  }

  const global = precios.preciosBase?.global;
  if (!global) err("PRECIOS_SIN_GLOBAL", "Falta preciosBase.global");
  else {
    for (const plan of PLANES_REQUERIDOS) {
      if (typeof global[plan] !== "number" || global[plan] <= 0) {
        err("PRECIOS_GLOBAL_PLAN", `preciosBase.global.${plan} inválido`, { plan });
      }
    }
    if (global.basico >= global.premium) {
      err("PRECIOS_JERARQUIA_PLANES", "basico >= premium en precios global");
    }
  }

  if (!precios.politicaPrecioCongelado?.regla) {
    err("PRECIOS_SIN_CONGELADO", "Falta politicaPrecioCongelado en schema precios perfiles");
  }
  if (!precios.versionadoPrecios?.campoVersion) {
    err("PRECIOS_SIN_VERSIONADO", "Falta versionadoPrecios en schema precios perfiles");
  }
  if (!precios.dimensionesPrecio?.ejes?.length) {
    err("PRECIOS_SIN_DIMENSIONES", "Falta dimensionesPrecio.ejes (precio multi-dimensional)");
  }
  if (!precios.separacionObligatoria?.banners) {
    err("PRECIOS_SIN_SEPARACION", "Falta separacionObligatoria.banners");
  }
  const visitantePrecios = precios.preciosBase?.porFormulario?.usuario_visitante;
  if (!visitantePrecios) {
    err("PRECIOS_VISITANTE_FALTANTE", "Falta preciosBase.porFormulario.usuario_visitante");
  }
  if (!precios.usuarioVisitante?.cobraRegistroInicial) {
    err("PRECIOS_VISITANTE_POLITICA", "Falta usuarioVisitante.cobraRegistroInicial");
  }
  const factores = precios.factoresPeriodo || {};
  if (factores.anual != null) {
    warn("PRECIOS_PERIODO_ANUAL", "factoresPeriodo.anual presente; periodos permitidos son semanal|quincenal|mensual");
  }
  for (const p of PERIODOS_COMERCIALES) {
    if (typeof factores[p] !== "number") warn("PRECIOS_FACTOR_PERIODO", `Falta factorPeriodo.${p}`);
  }
}

function validateCommercialArchitecture(schemas) {
  const c = schemas._comercial || {};
  const precios = schemas._precios;
  const checks = META.validacionesComercialesObligatorias?.checks || [];
  const result = { checksDocumentados: checks.length, checksPass: 0, detalle: [] };

  function pass(id, ok, msg) {
    result.detalle.push({ id, ok, mensaje: msg });
    if (ok) result.checksPass++;
    else err("COMERCIAL_CHECK_FAIL", `[${id}] ${msg}`);
  }

  const contratos = c.contratos;
  const promoP = c.promocionesPerfiles;
  const promoB = c.promocionesBanners;
  const estados = c.estados;
  const visitante = c.visitante;

  pass(
    "existencia_precio_congelado",
    !!(contratos?.politicaPrecioCongelado?.regla && precios?.politicaPrecioCongelado?.regla),
    "politicaPrecioCongelado en contratos y precios"
  );
  pass(
    "existencia_promocion_congelada",
    !!(promoP?.politicaPromocionCongelada?.regla && promoB?.politicaPromocionCongelada?.regla),
    "politicaPromocionCongelada en promociones perfiles y banners"
  );
  pass(
    "existencia_versionado_precios",
    !!(precios?.versionadoPrecios?.campoVersion && contratos?.contratoPerfil?.camposObligatorios?.versionPrecio),
    "versionPrecio en precios y contratoPerfil"
  );
  pass(
    "existencia_versionado_promociones",
    !!(promoP?.versionadoPromociones?.campoContrato && promoB?.versionadoPromociones?.campoContrato),
    "versionPromocion en promociones perfiles y banners"
  );
  pass(
    "existencia_contratos_activos",
    !!(contratos?.contratoPerfil?.coleccion && contratos?.contratoBanner?.coleccion),
    "colecciones contratos_perfiles y contratos_banners"
  );
  pass(
    "existencia_historial",
    !!(precios?.historialCambios?.coleccion && promoP?.versionadoPromociones?.historialColeccion && promoB?.versionadoPromociones?.historialColeccion),
    "historial precios y promociones"
  );
  pass(
    "promociones_separadas_de_precios",
    !!(promoP?.separacionObligatoria?.nuncaMezclar && promoB?.separacionObligatoria?.nuncaMezclar),
    "separacionObligatoria.nuncaMezclar en ambas promociones"
  );
  pass(
    "existencia_overrides",
    !!(precios?.overrides?.campos && contratos?.contratoPerfil?.camposObligatorios?.overrideAplicado),
    "overrides precios + overrideAplicado en contrato"
  );
  pass(
    "separacion_perfiles_banners",
    !!(contratos?.separacionColecciones?.perfiles?.precios && contratos?.separacionColecciones?.banners?.precios),
    "separacionColecciones perfiles vs banners"
  );
  pass(
    "usuario_visitante_cuenta_pagada_sin_perfil_publico_inicial",
    !!(
      visitante?.politicaComercial?.cobraRegistroInicial &&
      visitante?.politicaComercial?.publicaPerfilAlInicio === false &&
      visitante?.meta?.base?.camposPublicosPerfil?.length === 0
    ),
    "visitante paga, sin perfil público inicial"
  );
  pass(
    "compatibilidad_admin",
    !!(estados?.adminAcciones && promoP?.adminFuturo?.acciones?.length && precios?.adminFuturo?.acciones?.length),
    "adminAcciones y adminFuturo documentados"
  );
  pass(
    "compatibilidad_renovaciones",
    !!(contratos?.renovaciones?.reglas?.length),
    "renovaciones.reglas en contratos"
  );
  pass(
    "compatibilidad_vencimientos",
    !!(estados?.estados?.vencido && contratos?.contratoPerfil?.camposObligatorios?.fechaVencimiento),
    "estado vencido + fechaVencimiento en contrato"
  );
  pass(
    "compatibilidad_revision_admin",
    !!(
      estados?.reglasGlobales?.some((r) => /revisi[oó]n admin|auto-aprobar|sin revisi[oó]n admin/i.test(String(r))) ||
      estados?.flujos?.perfiles_personales_primer_mes_gratis ||
      estados?.adminAcciones
    ),
    "reglasGlobales y flujos exigen revisión admin"
  );
  pass(
    "compatibilidad_revision_post_pago",
    !!(estados?.revisionPostPago && estados?.estados?.revision_post_pago),
    "revisionPostPago + estado revision_post_pago"
  );
  pass(
    "compatibilidad_ia_arquitecto",
    !!(contratos?.compatibilidadIA?.ningunaIAPuede?.length && precios?.iaArquitecto?.puedeModificar === false),
    "IA no modifica contratos ni precios"
  );

  if (promoP) {
    const pmg = promoP.tiposPromocion?.primer_mes_gratis;
    if (!pmg?.aplicaA?.length) err("PROMO_PERFIL_PRIMER_MES", "Falta promoción primer_mes_gratis");
    const n2x1 = promoP.tiposPromocion?.negocio_2x1;
    if (!n2x1?.pagoAdelantado) err("PROMO_NEGOCIO_2X1", "Falta negocio_2x1 con pagoAdelantado");
  } else {
    err("PROMO_PERFILES_FALTANTE", "Falta config-promociones-perfiles-schema.json");
  }

  if (promoB) {
    const tabla = promoB.tipoPromocionLanzamiento?.tabla;
    if (!tabla?.length) err("PROMO_BANNER_TABLA", "Falta tabla promoción banners");
    else {
      for (const row of tabla) {
        if (row.diasTotales !== row.diasPagados + row.diasBonificados) {
          err("PROMO_BANNER_MATH", `Tabla banner inconsistente: ${row.diasContratados} días`, { row });
        }
      }
    }
    const campos = promoB.contratoBanner?.camposObligatorios || [];
    const req = ["diasPagados", "diasBonificados", "diasTotales", "requiereRevisionPostPago", "datosModificadosDespuesDePago"];
    for (const f of req) {
      if (!campos.includes(f)) err("PROMO_BANNER_CAMPO", `contratoBanner falta campo ${f}`);
    }
  } else {
    err("PROMO_BANNERS_FALTANTE", "Falta config-promociones-banners-schema.json");
  }

  if (estados) {
    const estadoIds = Object.keys(estados.estados || {});
    for (const e of ESTADOS_REVISION.length ? ESTADOS_REVISION : estadoIds) {
      if (!estados.estados?.[e]) err("ESTADO_FALTANTE", `Falta estado administrativo: ${e}`);
    }
    if (!estados.flujos?.banners?.pagoAdelantadoObligatorio) {
      warn("FLUJO_BANNER_PAGO", "Documentar pagoAdelantadoObligatorio en flujo banners");
    }
  } else {
    err("ESTADOS_FALTANTE", "Falta config-estados-revision-publicacion-schema.json");
  }

  for (const tipo of TIPOS_REGISTRO) {
    if (tipo === "usuario_visitante") continue;
    if (!precios?.preciosBase?.porFormulario?.[tipo]) {
      warn("PRECIO_TIPO_REGISTRO", `Sin preciosBase.porFormulario para ${tipo}`);
    }
  }

  const snap = precios?.versionadoPrecios?.snapshotEnContrato || [];
  const contratoCampos = contratos?.contratoPerfil?.camposObligatorios || {};
  for (const campo of ["precioContratado", "planContratado", "periodoContratado", "promocionAplicada", "estadoContrato"]) {
    if (!snap.includes(campo) && !contratoCampos[campo]) {
      warn("SNAPSHOT_CONTRATO_CAMPO", `Campo contrato '${campo}' no en snapshot ni camposObligatorios`);
    }
  }

  return result;
}

function validateRenderizadoDinamico(schemas) {
  const rd = schemas._comercial?.renderizado;
  const cu = schemas._comercial?.componentesUI;
  if (!rd) {
    err("RENDERIZADO_FALTANTE", "Falta config-renderizado-dinamico-schema.json");
    return { ok: false };
  }
  if (!cu) {
    err("COMPONENTES_UI_FALTANTE", "Falta config-registro-componentes-ui-schema.json");
    return { ok: false };
  }
  if (!rd.snapshotAlPublicar?.camposObligatorios?.schemaVersion) {
    err("RENDER_SIN_SCHEMA_VERSION", "Falta snapshot schemaVersion al publicar");
  }
  if (!rd.componentesResultados?.registrados?.includes("ResultCardGenerico")) {
    err("RENDER_SIN_FALLBACK_RESULTADOS", "Falta ResultCardGenerico");
  }
  if (!rd.componentesPerfil?.registrados?.includes("ProfileLayoutGenerico")) {
    err("RENDER_SIN_FALLBACK_PERFIL", "Falta ProfileLayoutGenerico");
  }
  if (!rd.fallbackObligatorio?.nuncaMostrar?.length) {
    err("RENDER_SIN_PRIVACIDAD", "Falta lista nuncaMostrar");
  }
  if (!cu.profileLayouts?.ProfileLayoutGenerico?.esFallback) {
    warn("LAYOUT_GENERICO", "ProfileLayoutGenerico debe marcarse esFallback");
  }
  return {
    ok: !errors.some((e) => e.code.startsWith("RENDER_") || e.code.startsWith("COMPONENTES_UI")),
  };
}

function validateCategoriasSugeridas(schemas) {
  const cs = schemas._comercial?.categoriasSugeridas;
  const estados = schemas._comercial?.estados;
  if (!cs) {
    err("CATEGORIAS_SUGERIDAS_FALTANTE", "Falta config-categorias-sugeridas-schema.json");
    return { ok: false };
  }
  const temporales = Object.keys(cs.formulariosTemporales || {});
  const req = [
    "temporal_adultos",
    "temporal_persona_independiente",
    "temporal_profesionista_cedula",
    "temporal_negocio_empresa",
  ];
  for (const t of req) {
    if (!temporales.includes(t)) err("TEMPORAL_FORM_FALTANTE", `Falta formulario temporal: ${t}`);
  }
  if (!cs.coleccionSolicitudes?.camposObligatorios?.estadoSolicitudCategoria) {
    err("SOLICITUDES_CATEGORIA_CAMPOS", "Falta coleccionSolicitudes.camposObligatorios");
  }
  const estSol = Object.keys(cs.estadosSolicitudCategoria || {});
  for (const e of ["sugerida_usuario", "aprobada", "fusionada", "convertida_en_alias", "rechazada"]) {
    if (!estSol.includes(e)) err("ESTADO_SOLICITUD_CAT", `Falta estado solicitud: ${e}`);
  }
  if (estados && !estados.estados?.requiere_revision_categoria) {
    err("ESTADO_REG_CAT", "Falta requiere_revision_categoria en estados-revision-publicacion");
  }
  if (!cs.integracionBusqueda?.opcionesUI?.length) {
    warn("CAT_SUG_BUSQUEDA", "Documentar integracionBusqueda.opcionesUI");
  }
  return { ok: errors.filter((e) => e.code.startsWith("CATEGORIAS_") || e.code.startsWith("TEMPORAL_") || e.code.startsWith("ESTADO_SOL") || e.code.startsWith("ESTADO_REG_CAT")).length === 0 };
}

function validateMapaCatalogoCompleto() {
  const matrix = MAPA.matrix || [];
  let ok = true;
  const expandidos = matrix.filter((r) => SECTORES_EXPANSION.has(r.sectorId));

  for (const row of matrix) {
    const ctx = { subcategoriaId: row.subcategoriaId, sectorId: row.sectorId };
    if (!row.formularioId) {
      err("MAPA_SIN_FORMULARIO_ID", `Falta formularioId en mapa`, ctx);
      ok = false;
    }
    if (!row.tipoPerfil) err("MAPA_SIN_TIPO_PERFIL", `Falta tipoPerfil`, ctx);
    if (!row.arquetipo) err("MAPA_SIN_ARQUETIPO", `Falta arquetipo`, ctx);
    if (!row.componenteResultados) err("MAPA_SIN_COMPONENTE_RES", `Falta componenteResultados`, ctx);
    else if (!COMPONENTES_RESULTADOS.has(row.componenteResultados)) {
      warn("MAPA_COMPONENTE_RES_DESCONOCIDO", `componenteResultados '${row.componenteResultados}' no en registro oficial`, ctx);
    }
    if (!row.componentePerfil) err("MAPA_SIN_COMPONENTE_PERFIL", `Falta componentePerfil`, ctx);
    else if (!COMPONENTES_PERFIL.has(row.componentePerfil)) {
      warn("MAPA_COMPONENTE_PERFIL_DESCONOCIDO", `componentePerfil '${row.componentePerfil}' no en registro oficial`, ctx);
    }
    const esperadoTemporal = FORMULARIO_TEMPORAL[row.formularioId];
    const temporal = row.categoriaSugerida?.formularioTemporal;
    if (!temporal) err("MAPA_SIN_FORM_TEMPORAL", `Falta categoriaSugerida.formularioTemporal`, ctx);
    else if (temporal !== esperadoTemporal) {
      err("MAPA_FORM_TEMPORAL_MISMATCH", `formularioTemporal '${temporal}' ≠ esperado '${esperadoTemporal}'`, ctx);
      ok = false;
    }
    if (!row.busqueda?.keywords?.length) warn("MAPA_BUSQUEDA_KEYWORDS", `Sin busqueda.keywords`, ctx);
    if (!row.busqueda?.geoPrimero) warn("MAPA_BUSQUEDA_GEO", `busqueda.geoPrimero no marcado`, ctx);
    if (!row.renderizado?.fallbackResultados || !row.renderizado?.fallbackPerfil) {
      warn("MAPA_SIN_FALLBACK_RENDER", `Falta renderizado fallback`, ctx);
    }
    if (!row.comercial?.compatiblePrecios) warn("MAPA_COMERCIAL_FLAG", `Falta comercial.compatiblePrecios`, ctx);
  }

  for (const row of expandidos) {
    if (!row.busqueda?.keywords?.length) {
      err("EXPANSION_SIN_KEYWORDS", `Sector expandido sin keywords: ${row.subcategoriaId}`, { sectorId: row.sectorId });
      ok = false;
    }
    if (!row.busqueda?.palabrasRelacionadas?.length) {
      warn("EXPANSION_SIN_RELACIONADAS", `Sin palabrasRelacionadas`, { subcategoriaId: row.subcategoriaId });
    }
  }

  const preciosForms = ["adultos", "persona_independiente", "profesionista_cedula", "negocio_empresa", "usuario_visitante"];
  const precios = schemasRef._precios;
  for (const fid of preciosForms) {
    if (fid === "usuario_visitante") continue;
    const used = matrix.some((r) => r.formularioId === fid);
    if (used && !precios?.preciosBase?.porFormulario?.[fid]) {
      warn("CATALOGO_SIN_PRECIO_FORM", `formularioId ${fid} en catálogo sin precio en schema`);
    }
  }

  return { ok, total: matrix.length, expandidos: expandidos.length };
}

let schemasRef = {};

function validateMapaVsSchemas(schemas) {
  const schemaIndex = new Map();
  for (const [fid, schema] of Object.entries(schemas)) {
    if (fid === "_precios") continue;
    for (const sub of schema.subcategorias || []) {
      const canon = canonicalId(sub.subcategoriaId);
      if (!schemaIndex.has(canon)) schemaIndex.set(canon, []);
      schemaIndex.get(canon).push({ formularioId: fid, subcategoriaId: sub.subcategoriaId, schema: schema.formularioId || fid });
    }
  }

  const mapRows = MAPA.matrix;
  const mapCanonSet = new Set();
  const missingInSchemas = [];
  const formularioInvalido = [];
  const arquetipoMapMismatch = [];

  for (const row of mapRows) {
    const canon = canonicalId(row.subcategoriaId);
    if (!row.subcategoriaId?.trim()) err("MAPA_ID_VACIO", "Fila mapa sin subcategoriaId", { subcategoria: row.subcategoria });
    if (mapCanonSet.has(canon)) {
      err("MAPA_ID_DUPLICADO", `subcategoriaId duplicado en mapa (canónico: ${canon})`, { subcategoriaId: row.subcategoriaId });
    }
    mapCanonSet.add(canon);

    const expectedForm = FORM_MAP[row.formulario];
    if (!expectedForm) {
      formularioInvalido.push({ subcategoriaId: row.subcategoriaId, formulario: row.formulario });
      err("MAPA_FORMULARIO_DESCONOCIDO", `Formulario mapa desconocido: '${row.formulario}'`, { subcategoriaId: row.subcategoriaId });
      continue;
    }

    const entries = schemaIndex.get(canon);
    if (!entries?.length) {
      missingInSchemas.push({
        subcategoriaId: row.subcategoriaId,
        subcategoria: row.subcategoria,
        formularioMapa: row.formulario,
        formularioIdEsperado: expectedForm,
        sectorId: row.sectorId,
      });
      err("SUB_FALTANTE_SCHEMA", `Mapa '${row.subcategoriaId}' (${row.subcategoria}) no encontrado en schema '${expectedForm}'`, {
        subcategoriaId: row.subcategoriaId,
        formularioId: expectedForm,
      });
      continue;
    }

    if (entries.length > 1) {
      const forms = [...new Set(entries.map((e) => e.formularioId))];
      if (forms.length > 1) {
        err("SUB_DUPLICADA_ENTRE_SCHEMAS", `subcategoriaId '${canon}' en múltiples schemas: ${forms.join(", ")}`, {
          subcategoriaId: row.subcategoriaId,
          schemas: forms,
        });
      }
    }

    const entry = entries.find((e) => e.formularioId === expectedForm) || entries[0];
    if (entry.formularioId !== expectedForm) {
      err("SUB_FORMULARIO_MISMATCH", `Sub '${row.subcategoriaId}' en schema ${entry.formularioId}, mapa espera ${expectedForm}`, {
        subcategoriaId: row.subcategoriaId,
        mapa: expectedForm,
        schema: entry.formularioId,
      });
    }

    const schema = schemas[expectedForm];
    const sub = (schema.subcategorias || []).find((s) => canonicalId(s.subcategoriaId) === canon);
    if (sub && row.arquetipo && sub.arquetipo !== row.arquetipo) {
      arquetipoMapMismatch.push({
        subcategoriaId: row.subcategoriaId,
        mapa: row.arquetipo,
        schema: sub.arquetipo,
      });
      warn("ARQUETIPO_MAPA_SCHEMA_DIFF", `Sub '${row.subcategoriaId}': mapa arquetipo '${row.arquetipo}' ≠ schema '${sub.arquetipo}'`, {
        subcategoriaId: row.subcategoriaId,
      });
    }
    if (sub && row.tipoPerfil && sub.tipoPerfil !== row.tipoPerfil) {
      warn("TIPO_PERFIL_MAPA_SCHEMA_DIFF", `Sub '${row.subcategoriaId}': mapa tipoPerfil '${row.tipoPerfil}' ≠ schema '${sub.tipoPerfil}'`, {
        subcategoriaId: row.subcategoriaId,
      });
    }
  }

  const extraInSchemas = [];
  for (const [canon, entries] of schemaIndex) {
    if (!mapCanonSet.has(canon)) {
      for (const e of entries) {
        extraInSchemas.push({ subcategoriaId: e.subcategoriaId, formularioId: e.formularioId });
        warn("SUB_EXTRA_SCHEMA", `Sub '${e.subcategoriaId}' en schema ${e.formularioId} pero no en mapa`, {
          subcategoriaId: e.subcategoriaId,
          formularioId: e.formularioId,
        });
      }
    }
  }

  const covered = mapRows.filter((r) => schemaIndex.has(canonicalId(r.subcategoriaId))).length;

  return {
    totalMapa: mapRows.length,
    totalCubierto: covered,
    faltantes: missingInSchemas,
    duplicadasEntreSchemas: errors.filter((e) => e.code === "SUB_DUPLICADA_ENTRE_SCHEMAS"),
    extraEnSchemas: extraInSchemas,
    formularioInvalido,
    arquetipoMapMismatch,
  };
}

function identidadCheck(id, ok, mensaje, severidad = "ok") {
  return { id, ok, mensaje, severidad };
}

function validateIdentidadUsuario(schemas) {
  const identidad = META.identidadUsuario;
  const detalle = [];
  let checksPass = 0;

  function record(check) {
    detalle.push(check);
    if (check.ok) checksPass++;
    else if (check.severidad === "error") {
      err("IDENTIDAD_" + check.id.toUpperCase(), check.mensaje, { checkId: check.id });
    } else {
      warn("IDENTIDAD_" + check.id.toUpperCase(), check.mensaje, { checkId: check.id });
    }
  }

  const checksDocumentados = identidad?.validacionesObligatorias?.checks?.length || 15;

  if (!identidad) {
    record(identidadCheck("meta_identidadUsuario_existe", false, "Falta sección identidadUsuario en config-registro-schema.meta.json", "error"));
    return { ok: false, checksDocumentados, checksPass: 0, detalle };
  }
  record(identidadCheck("meta_identidadUsuario_existe", true, "Sección identidadUsuario presente en meta schema"));

  const cuentasPath = path.join(scripts, CUENTAS_FILE);
  const cuentasExists = fs.existsSync(cuentasPath);
  record(
    identidadCheck(
      "schema_cuentas_usuario_existe",
      cuentasExists,
      cuentasExists ? `Schema ${CUENTAS_FILE} presente` : `Falta ${CUENTAS_FILE}`,
      cuentasExists ? "ok" : "error"
    )
  );
  const cuentas = cuentasExists ? JSON.parse(fs.readFileSync(cuentasPath, "utf8")) : null;

  const registroConPerfil = ["adultos", "persona_independiente", "profesionista_cedula", "negocio_empresa"];
  let perfilesOk = true;
  for (const fid of registroConPerfil) {
    const schema = schemas[fid];
    const fsRec = schema?.meta?.firestoreRecomendado;
    const raiz =
      fsRec?.documentoPerfil?.raiz ||
      fsRec?.colecciones?.perfiles?.camposRaiz ||
      fsRec?.documentoPerfil?.camposRaiz;
    const tieneUsuarioId = Array.isArray(raiz) && raiz.includes("usuarioId");
    if (!tieneUsuarioId) {
      perfilesOk = false;
      record(
        identidadCheck(
          "perfiles_usuarioId_en_schemas_registro",
          false,
          `Schema ${fid} sin usuarioId en firestoreRecomendado.documentoPerfil`,
          "error"
        )
      );
    }
  }
  if (perfilesOk) {
    record(
      identidadCheck(
        "perfiles_usuarioId_en_schemas_registro",
        true,
        "Schemas registro perfiles documentan usuarioId obligatorio en perfiles/{perfilId}"
      )
    );
  }

  const cs = schemas._comercial?.categoriasSugeridas;
  const solUsuarioId = cs?.coleccionSolicitudes?.camposObligatorios?.usuarioId;
  record(
    identidadCheck(
      "solicitudes_categorias_usuarioId",
      !!solUsuarioId,
      solUsuarioId
        ? "solicitudes_categorias.usuarioId en config-categorias-sugeridas-schema.json"
        : "Falta usuarioId en coleccionSolicitudes.camposObligatorios",
      solUsuarioId ? "ok" : "error"
    )
  );

  const contratos = schemas._comercial?.contratos;
  const cpUsuarioId = contratos?.contratoPerfil?.camposObligatorios?.usuarioId;
  record(
    identidadCheck(
      "contratos_perfiles_usuarioId",
      !!cpUsuarioId,
      cpUsuarioId
        ? "contratos_perfiles.usuarioId documentado en config-contratos-carihub-schema.json"
        : "Falta usuarioId en contratoPerfil.camposObligatorios",
      cpUsuarioId ? "ok" : "error"
    )
  );

  const promoBanners = schemas._comercial?.promocionesBanners;
  const cbCampos = promoBanners?.contratoBanner?.camposObligatorios || [];
  const cbUsuarioId = cbCampos.includes("usuarioId");
  const cbAnuncianteId = cbCampos.includes("anuncianteId");
  const metaBannerFk = identidad.reglasFK?.["contratos_banners.usuarioId"]?.obligatorio === true;
  record(
    identidadCheck(
      "contratos_banners_usuarioId_anuncianteId",
      cbUsuarioId && cbAnuncianteId,
      cbUsuarioId && cbAnuncianteId
        ? "contratos_banners con usuarioId y anuncianteId en promociones-banners"
        : `Diseño FK meta exige usuarioId+anuncianteId; promociones-banners solo tiene: ${cbCampos.filter((c) => /usuario|anunciante/i.test(c)).join(", ") || "ninguno"} — agregar en schema diseño`,
      cbUsuarioId && cbAnuncianteId ? "ok" : "advertencia"
    )
  );
  if (!metaBannerFk) {
    record(
      identidadCheck(
        "contratos_banners_meta_fk",
        false,
        "Meta reglasFK contratos_banners.usuarioId no documentada",
        "error"
      )
    );
  }

  const solAnunciosMeta = identidad.colecciones?.solicitudes_anuncios;
  const tieneFkAnuncios =
    solAnunciosMeta?.fkObligatorias?.includes("usuarioId") ||
    solAnunciosMeta?.fkAlternativas?.includes("uidAnunciante");
  record(
    identidadCheck(
      "solicitudes_anuncios_usuarioId_o_uidAnunciante",
      !!tieneFkAnuncios,
      tieneFkAnuncios
        ? "solicitudes_anuncios: usuarioId o uidAnunciante documentado en meta"
        : "Falta FK solicitudes_anuncios en meta",
      tieneFkAnuncios ? "ok" : "error"
    )
  );

  const pagosMeta = identidad.colecciones?.pagos?.fkObligatorias?.includes("usuarioId");
  record(
    identidadCheck(
      "pagos_usuarioId_documentado",
      !!pagosMeta,
      pagosMeta ? "pagos.usuarioId documentado en meta" : "Falta pagos.usuarioId en meta",
      pagosMeta ? "ok" : "error"
    )
  );

  const denunciasFk =
    identidad.reglasFK?.["denuncias.perfilId"]?.obligatorio &&
    identidad.reglasFK?.["denuncias.reportadoId"];
  record(
    identidadCheck(
      "denuncias_fk_documentadas",
      !!denunciasFk,
      denunciasFk ? "denuncias: perfilId + reportadoId/perfilId en meta reglasFK" : "Falta reglasFK denuncias",
      denunciasFk ? "ok" : "error"
    )
  );

  const mensajeriaMeta =
    identidad.colecciones?.mensajeriaFutura?.reglaEnvio &&
    identidad.estados?.estadoMensajeria?.length;
  const mensajeriaCuentas = cuentas?.firestore?.usuarios?.subobjetos?.mensajeria?.estadoMensajeria;
  record(
    identidadCheck(
      "mensajeria_estadoMensajeria_documentado",
      !!(mensajeriaMeta && mensajeriaCuentas),
      mensajeriaMeta && mensajeriaCuentas
        ? "estadoMensajeria documentado en meta + config-cuentas-usuario"
        : "Falta estadoMensajeria en meta o config-cuentas-usuario",
      mensajeriaMeta && mensajeriaCuentas ? "ok" : "advertencia"
    )
  );

  const visitante = schemas._comercial?.visitante;
  const upgradeVisitante =
    visitante?.politicaComercial?.puedeCrearPerfilDespues === true &&
    identidad.conversionCuenta?.sinNuevoAuthUser === true &&
    cuentas?.conversionCuenta?.regla;
  record(
    identidadCheck(
      "visitante_upgrade_sin_nueva_cuenta",
      !!upgradeVisitante,
      upgradeVisitante
        ? "Visitante puede evolucionar conservando usuarioId (sin nuevo Auth user)"
        : "Falta documentar upgrade visitante sin nueva cuenta",
      upgradeVisitante ? "ok" : "error"
    )
  );

  const rolesOk =
    Array.isArray(identidad.rolesCuenta?.valores) &&
    identidad.rolesCuenta.valores.includes("anunciante") &&
    !identidad.tiposCuenta?.valores?.includes("admin");
  record(
    identidadCheck(
      "roles_multirol_documentado",
      rolesOk,
      rolesOk ? "rolesCuenta[] multirol documentado (anunciante, admin, …)" : "Falta rolesCuenta en meta",
      rolesOk ? "ok" : "error"
    )
  );

  record(
    identidadCheck(
      "admin_es_rol_no_tipoCuenta",
      !identidad.tiposCuenta?.valores?.includes("admin"),
      !identidad.tiposCuenta?.valores?.includes("admin")
        ? "admin solo en rolesCuenta, no en tiposCuenta"
        : "admin no debe ser tipoCuenta",
      !identidad.tiposCuenta?.valores?.includes("admin") ? "ok" : "error"
    )
  );

  const favOk = identidad.colecciones?.favoritos?.ruta?.includes("favoritos");
  record(
    identidadCheck(
      "favoritos_subcoleccion_documentada",
      !!favOk,
      favOk ? "favoritos como subcolección usuarios/{id}/favoritos documentado" : "Falta favoritos en meta",
      favOk ? "ok" : "error"
    )
  );

  const perfilIdsOk =
    identidad.modeloRecomendado?.perfilPrincipalId &&
    identidad.modeloRecomendado?.perfilIds;
  record(
    identidadCheck(
      "perfilPrincipalId_perfilIds_documentado",
      !!perfilIdsOk,
      perfilIdsOk ? "perfilPrincipalId + perfilIds[] en modelo recomendado" : "Falta punteros perfil en meta",
      perfilIdsOk ? "ok" : "error"
    )
  );

  const messengerFk =
    identidad.reglasFK?.["mensajes.emisorId"]?.obligatorio &&
    identidad.reglasFK?.["mensajes.receptorId"]?.obligatorio;
  record(
    identidadCheck(
      "mensajes_fk_futuro",
      !!messengerFk,
      messengerFk
        ? "mensajes.emisorId y receptorId documentados (cuando exista Messenger)"
        : "Falta reglasFK mensajes",
      messengerFk ? "ok" : "advertencia"
    )
  );

  const erroresIdentidad = detalle.filter((c) => !c.ok && c.severidad === "error").length;
  return {
    ok: erroresIdentidad === 0,
    checksDocumentados: detalle.length,
    checksPass,
    checksFail: detalle.filter((c) => !c.ok).length,
    erroresIdentidad,
    advertenciasIdentidad: detalle.filter((c) => !c.ok && c.severidad !== "error").length,
    detalle,
  };
}

function buildRecommendations(mapResult, schemas) {
  if (!schemas.adultos?.formularioId) {
    rec("Agregar formularioId: 'adultos' y versionSchema en config-registro-adultos-schema.json");
  }
  if (schemas.adultos?.$schema?.includes("adultos-schema.meta")) {
    rec("Actualizar $schema de Adultos a ./config-registro-schema.meta.json");
  }
  for (const item of mapResult.faltantes) {
    if (item.formularioIdEsperado === "adultos") {
      rec(`Alinear subcategoriaId Adultos '${item.subcategoriaId}' con catálogo (IDs con espacio vs slug) o agregar entrada en schema Adultos`);
    } else {
      rec(`Agregar subcategoría '${item.subcategoriaId}' a schema ${item.formularioIdEsperado}`);
    }
  }
  if (mapResult.arquetipoMapMismatch.length) {
    rec("Sincronizar arquetipos entre mapa-registro-categorias.json y schemas (regenerar mapa o schemas)");
  }
  rec("Ejecutar validar-schemas-registro.mjs en CI antes de programar FieldEngine");
  rec("Tras corregir FAIL: regenerar mapa con clasificar-registro-categorias.mjs si cambia catálogo");
  if (META.identidadUsuario) {
    rec("Congelar diseño identidadUsuario antes de FieldEngine/ValidationEngine/Messenger");
    rec("Migración legacy: usuarios/{uid} monolito → hub + perfiles/{perfilId} con perfilId=uid en fase 1");
  }
}

function main() {
  const schemas = loadSchemas();
  schemasRef = schemas;

  for (const [fid, file] of Object.entries(SCHEMA_FILES)) {
    validateSchemaStructure(fid, schemas[fid], file);
  }
  validatePreciosSchema(schemas._precios);
  const comercialResult = validateCommercialArchitecture(schemas);
  const categoriasSugeridasOk = validateCategoriasSugeridas(schemas);
  const renderizadoOk = validateRenderizadoDinamico(schemas);
  const mapaCatalogo = validateMapaCatalogoCompleto();
  const mapResult = validateMapaVsSchemas(schemas);
  const identidadResult = validateIdentidadUsuario(schemas);
  buildRecommendations(mapResult, schemas);

  const estado = errors.length === 0 ? (warnings.length === 0 ? "PASS" : "PASS CON ADVERTENCIAS") : "FAIL";

  const report = {
    generado: new Date().toISOString(),
    estado,
    resumen: {
      totalSubcategoriasMapa: mapResult.totalMapa,
      totalSubcategoriasCubiertasSchemas: mapResult.totalCubierto,
      totalErrores: errors.length,
      totalAdvertencias: warnings.length,
      schemasValidados: Object.keys(SCHEMA_FILES).concat([PRECIOS_FILE, ...Object.values(COMMERCIAL_FILES)]),
      categoriasSugeridas: categoriasSugeridasOk.ok !== false,
      renderizadoDinamico: renderizadoOk.ok !== false,
      mapaCatalogoCompleto: mapaCatalogo.ok,
      filasMapa: mapaCatalogo.total,
      filasSectorExpandido: mapaCatalogo.expandidos,
      arquitecturaComercial: {
        checksDocumentados: comercialResult.checksDocumentados,
        checksPass: comercialResult.checksPass,
        checksFail: comercialResult.checksDocumentados - comercialResult.checksPass,
      },
      identidadUsuario: {
        checksDocumentados: identidadResult.checksDocumentados,
        checksPass: identidadResult.checksPass,
        checksFail: identidadResult.erroresIdentidad,
        advertencias: identidadResult.advertenciasIdentidad,
        ok: identidadResult.ok,
      },
    },
    identidadUsuario: identidadResult,
    faltantes: mapResult.faltantes,
    duplicadas: errors.filter((e) => e.code === "SUB_DUPLICADA_ENTRE_SCHEMAS" || e.code === "SUB_ID_DUPLICADO_SCHEMA" || e.code === "MAPA_ID_DUPLICADO"),
    camposInvalidos: errors.filter((e) => e.code.startsWith("CAMPO_INVALIDO")),
    camposPrivadosMalMarcados: warnings.filter((e) => e.code === "CAMPO_NO_PUBLICO_SIN_PRIVADO"),
    arquetiposInvalidos: errors.filter((e) => e.code === "ARQUETIPO_INVALIDO"),
    tipoPerfilInvalidos: errors.filter((e) => e.code === "TIPO_PERFIL_INVALIDO"),
    formulariosInvalidos: errors.filter((e) => e.code.includes("FORMULARIO")),
    fotosMinMax: errors.filter((e) => e.code === "FOTOS_MIN_MAYOR_MAX"),
    preciosPlanes: errors.filter((e) => e.code.startsWith("PRECIOS_")).concat(warnings.filter((e) => e.code.startsWith("PRECIOS_") || e.code.startsWith("PLAN_"))),
    arquitecturaComercial: {
      ...comercialResult,
      erroresComerciales: errors.filter((e) => e.code.startsWith("COMERCIAL_") || e.code.startsWith("PROMO_") || e.code.startsWith("ESTADO_")),
    },
    recomendaciones: [...new Set(recommendations)],
    errores: errors,
    advertencias: warnings,
  };

  const outPath = path.join(scripts, "validacion-schemas-report.json");
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");

  console.log("=== Validación schemas CariHub ===");
  console.log("Estado:", estado);
  console.log("Mapa:", mapResult.totalMapa, "| Cubiertas:", mapResult.totalCubierto, "| Faltantes:", mapResult.faltantes.length);
  console.log("Errores:", errors.length, "| Advertencias:", warnings.length);
  console.log(
    "Arquitectura comercial:",
    comercialResult.checksPass + "/" + comercialResult.checksDocumentados,
    "checks"
  );
  console.log(
    "Identidad usuario:",
    identidadResult.checksPass + "/" + identidadResult.checksDocumentados,
    "checks",
    identidadResult.ok ? "OK" : "CON GAPS"
  );
  if (identidadResult.detalle?.filter((c) => !c.ok).length) {
    console.log("  Gaps identidad:");
    identidadResult.detalle
      .filter((c) => !c.ok)
      .forEach((c) => console.log(`  [${c.severidad}] ${c.id}: ${c.mensaje}`));
  }
  console.log("Reporte:", outPath);
  if (errors.length) {
    console.log("\n--- Errores (primeros 15) ---");
    errors.slice(0, 15).forEach((e) => console.log(`[${e.code}] ${e.mensaje}`));
  }
  if (warnings.length && errors.length < 10) {
    console.log("\n--- Advertencias (primeros 10) ---");
    warnings.slice(0, 10).forEach((w) => console.log(`[${w.code}] ${w.mensaje}`));
  }
  process.exit(estado === "FAIL" ? 1 : 0);
}

main();
