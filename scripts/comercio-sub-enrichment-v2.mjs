/**
 * MP-COMERCIO-ENRICH-V2 — copy, hints y labels por sub (9 subs).
 */
const BASE_AYUDA = {
  modalidadVentaComercio: "Tienda física, en línea, ambos o solo delivery — nunca hotel ni modalidad escort.",
  categoriasProducto: "Sé específico con las categorías que realmente manejas.",
  serviciosComercio: "Apartado, pedidos, surtido, asesoría…",
  formasPagoComercio: "Efectivo, tarjeta, transferencia, meses sin intereses…",
  entregaDomicilio: "Indica si entregas y en qué zona.",
  coberturaGeografica: "Colonia, municipio o zona de reparto.",
  diferenciadorComercio: "Ej. Precios bajos · Surte diario · Abierto 24 h",
  colaboracionesComerciales: "¿Trabajas con marcas, proveedores o negocios vecinos?",
  serviciosMayoreo: "Mayoreo, medio mayoreo, surtido a negocios…",
  volumenMinimoPedido: "Ej. $500 mínimo · 12 piezas · 1 caja",
};

function enrich(blockHint, extra = {}) {
  return {
    blockHint,
    fieldLabels: extra.fieldLabels || {},
    textosAyuda: { ...BASE_AYUDA, ...(extra.textosAyuda || {}) },
    extraFields: extra.extraFields,
  };
}

/** @type {Record<string, object>} */
export const SUB_ENRICHMENT_V2 = {
  abarrotes: enrich(
    "Abarrotes de barrio — categorías, horario y entrega generan confianza.",
    { fieldLabels: { categoriasProducto: "¿Qué surtes en tu abarrotes?" } }
  ),
  "tiendas-de-conveniencia": enrich(
    "Tienda de conveniencia — productos, horario extendido y servicios extra.",
    { fieldLabels: { serviciosComercio: "Servicios además de venta" } }
  ),
  zapaterias: enrich(
    "Zapatería — géneros, marcas y servicios (ajustes, mayoreo chico).",
    { fieldLabels: { generosModa: "¿A quién vendes?", marcasComercializadas: "Marcas principales" } }
  ),
  "tiendas-de-ropa": enrich(
    "Tienda de ropa — líneas, géneros y modalidad física u online.",
    { fieldLabels: { categoriasProducto: "Tipos de prenda", generosModa: "Géneros / edades" } }
  ),
  "farmacias-de-barrio": enrich(
    "Farmacia de barrio — productos, servicios y formas de pago.",
    { fieldLabels: { serviciosComercio: "Servicios de farmacia", categoriasProducto: "Categorías de producto" } }
  ),
  papelerias: enrich(
    "Papelería — útiles, impresión y servicios escolares/oficina.",
    { fieldLabels: { categoriasProducto: "Productos y servicios" } }
  ),
  ferreterias: enrich(
    "Ferretería — categorías, marcas y asesoría técnica.",
    { fieldLabels: { categoriasProducto: "Departamentos de ferretería", marcasComercializadas: "Marcas de herramientas" } }
  ),
  mayoreo: enrich(
    "Mayoreo — pedido mínimo, tipos de cliente y cobertura de entrega.",
    { fieldLabels: { serviciosMayoreo: "¿Qué ofreces en mayoreo?", tiposClientesComercio: "¿A quién vendes?" } }
  ),
  distribuidoras: enrich(
    "Distribuidora — servicios B2B, flota y especialidades de la empresa.",
    {
      fieldLabels: {
        serviciosEmpresaComercio: "Servicios de la distribuidora",
        flotaEntrega: "Cobertura de entrega / flota",
      },
    }
  ),
};

export function mergeEnrichmentV2(baseProfile, subId) {
  const enrichData = SUB_ENRICHMENT_V2[subId];
  if (!enrichData) return baseProfile;
  const out = { ...baseProfile };
  if (enrichData.blockHint) out.blockHint = enrichData.blockHint;
  if (enrichData.fieldLabels) {
    out.fieldLabels = { ...(out.fieldLabels || {}), ...enrichData.fieldLabels };
  }
  out.textosAyuda = { ...(out.textosAyuda || {}), ...(enrichData.textosAyuda || {}) };
  if (enrichData.extraFields) {
    out.extraFields = [...new Set([...(out.extraFields || []), ...enrichData.extraFields])];
  }
  return out;
}
