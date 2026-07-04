/**
 * MP-COMERCIO-DELTAS-V1 — deltas públicos detallados por subcategoría (9).
 */
import { SUB_TO_PACK, PACK_LABELS, formularioIdForSub, PACK_NEGOCIO_SUBS } from "./comercio-packs-v1.mjs";
import { SUB_EXTRA_PROFILES } from "./comercio-sub-extra-fields.mjs";

export const PACK_DELTA_BASE = {
  A: {
    blockTitle: "Abastos y conveniencia",
    blockHint: "Categorías, modalidad de venta y formas de pago.",
    aliasPlaceholder: "Ej. Abarrotes · Surte diario",
    deltaFields: ["categoriasProducto", "serviciosComercio", "modalidadVentaComercio", "formasPagoComercio"],
    obligatoriosDelta: [
      "alias",
      "categoriasProducto",
      "modalidadVentaComercio",
      "formasPagoComercio",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  B: {
    blockTitle: "Moda y calzado",
    blockHint: "Líneas, géneros y modalidad de venta.",
    aliasPlaceholder: "Ej. Tienda de ropa · Moda casual",
    deltaFields: ["categoriasProducto", "generosModa", "modalidadVentaComercio", "marcasComercializadas"],
    obligatoriosDelta: [
      "alias",
      "categoriasProducto",
      "generosModa",
      "modalidadVentaComercio",
      "formasPagoComercio",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  C: {
    blockTitle: "Retail especializado",
    blockHint: "Productos, servicios y formas de pago de tu tienda.",
    aliasPlaceholder: "Ej. Ferretería · Herramientas y plomería",
    deltaFields: ["categoriasProducto", "serviciosComercio", "modalidadVentaComercio", "formasPagoComercio"],
    obligatoriosDelta: [
      "alias",
      "categoriasProducto",
      "serviciosComercio",
      "modalidadVentaComercio",
      "formasPagoComercio",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
  D: {
    blockTitle: "Mayoreo y distribución",
    blockHint: "Servicios de mayoreo, clientes y cobertura.",
    aliasPlaceholder: "Ej. Mayoreo · Surtido a negocios",
    deltaFields: ["serviciosMayoreo", "volumenMinimoPedido", "tiposClientesComercio", "modalidadVentaComercio"],
    obligatoriosDelta: [
      "alias",
      "serviciosMayoreo",
      "volumenMinimoPedido",
      "tiposClientesComercio",
      "modalidadVentaComercio",
      "coberturaGeografica",
      "tarifaDesde",
      "horarioDetalle",
    ],
  },
};

export const SUB_DELTA_PATCHES = {
  abarrotes: { blockTitle: "Abarrotes" },
  "tiendas-de-conveniencia": { blockTitle: "Tiendas de conveniencia" },
  zapaterias: { blockTitle: "Zapaterías" },
  "tiendas-de-ropa": { blockTitle: "Tiendas de ropa" },
  "farmacias-de-barrio": { blockTitle: "Farmacias de barrio" },
  papelerias: { blockTitle: "Papelerías" },
  ferreterias: { blockTitle: "Ferreterías" },
  mayoreo: { blockTitle: "Mayoreo" },
  distribuidoras: {
    blockTitle: "Distribuidoras",
    deltaFields: [
      "serviciosEmpresaComercio",
      "especialidadesEmpresaComercio",
      "tiposClientesComercio",
      "flotaEntrega",
      "modalidadVentaComercio",
    ],
    obligatoriosDelta: [
      "nombreComercial",
      "serviciosEmpresaComercio",
      "especialidadesEmpresaComercio",
      "tiposClientesComercio",
      "flotaEntrega",
      "modalidadVentaComercio",
      "direccion",
      "horarioDetalle",
      "geo",
    ],
  },
};

function mergeDelta(subId, nombre, pack) {
  const base = PACK_DELTA_BASE[pack] || PACK_DELTA_BASE.A;
  const patch = SUB_DELTA_PATCHES[subId] || {};
  const extra = SUB_EXTRA_PROFILES[subId] || {};
  const mergedFieldOptions = {
    ...(base.fieldOptions || {}),
    ...(patch.fieldOptions || {}),
    ...(extra.fieldOptions || {}),
  };
  const extraFields = [...new Set([...(extra.extraFields || []), ...(patch.extraFields || [])])];
  const hideFields = [...new Set([...(extra.hideFields || []), ...(patch.hideFields || [])])];
  const obligSet = new Set([
    ...(patch.obligatoriosDelta || base.obligatoriosDelta || []),
    ...(extra.obligatoriosExtra || []),
  ]);
  return {
    canonSubcategoriaId: subId,
    deltaPack: pack,
    formularioId: formularioIdForSub(subId),
    nombre,
    packLabel: PACK_LABELS[pack] || pack,
    blockTitle: extra.blockTitle || patch.blockTitle || nombre,
    blockHint: extra.blockHint || patch.blockHint || base.blockHint || "",
    aliasPlaceholder: extra.aliasPlaceholder || patch.aliasPlaceholder || base.aliasPlaceholder || "",
    deltaFields: patch.deltaFields || base.deltaFields || [],
    extraFields: extraFields.length ? extraFields : undefined,
    hideFields: hideFields.length ? hideFields : undefined,
    obligatoriosDelta: [...obligSet],
    textosAyuda: { ...(base.textosAyuda || {}), ...(patch.textosAyuda || {}), ...(extra.textosAyuda || {}) },
    fieldLabels: { ...(base.fieldLabels || {}), ...(patch.fieldLabels || {}), ...(extra.fieldLabels || {}) },
    fieldOptions: Object.keys(mergedFieldOptions).length ? mergedFieldOptions : undefined,
    negocioLocal: PACK_NEGOCIO_SUBS.has(subId),
    personaIndependiente: !PACK_NEGOCIO_SUBS.has(subId),
  };
}

export function buildComercioSubDeltas(catalogRows) {
  const SUB_CANON_META = {};
  const SUB_DELTAS = {};
  for (const row of catalogRows) {
    const subId = row.subcategoriaId;
    const pack = SUB_TO_PACK[subId];
    if (!pack) continue;
    const delta = mergeDelta(subId, row.subcategoria || row.nombre || subId, pack);
    SUB_CANON_META[subId] = {
      canonSubcategoriaId: subId,
      nombre: delta.nombre,
      deltaPack: pack,
      formularioId: delta.formularioId,
    };
    SUB_DELTAS[subId] = delta;
  }
  return { SUB_CANON_META, SUB_DELTAS };
}
