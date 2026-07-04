/**
 * MP-COMERCIO-DELTAS-V1 — campos extra, ocultos y opciones por subcategoría (9 subs).
 */
import {
  mergeHideAdultLeaks,
  HIDE_ADULT_LEAKS,
  COLABORACIONES_COMERCIALES_OPTIONS,
  TIPOS_COLABORACION_COMERCIAL,
} from "./registro-cross-sector-policy.mjs";
import { mergeEnrichmentV2 } from "./comercio-sub-enrichment-v2.mjs";

export const MODALIDAD_VENTA_COMERCIO = [
  { value: "tienda_fisica", label: "Tienda física" },
  { value: "online", label: "Solo en línea" },
  { value: "ambos", label: "Tienda y en línea" },
  { value: "delivery", label: "Principalmente delivery / reparto" },
];

export const ENTREGA_DOMICILIO = [
  { value: "si", label: "Sí, entrego a domicilio" },
  { value: "no", label: "No, solo en tienda" },
  { value: "solo_zona", label: "Solo en mi zona" },
  { value: "convenir", label: "A convenir" },
];

export const FORMAS_PAGO_COMERCIO = [
  { value: "efectivo", label: "Efectivo" },
  { value: "tarjeta", label: "Tarjeta" },
  { value: "transferencia", label: "Transferencia" },
  { value: "msi", label: "Meses sin intereses" },
  { value: "credito", label: "Crédito / fiado" },
  { value: "otro", label: "Otro" },
];

export { HIDE_ADULT_LEAKS };

const COLAB_OPTS = {
  colaboracionesComerciales: COLABORACIONES_COMERCIALES_OPTIONS,
  tiposColaboracionComercial: TIPOS_COLABORACION_COMERCIAL,
};

const COMMON = {
  extraFields: [
    "diferenciadorComercio",
    "coberturaGeografica",
    "colaboracionesComerciales",
    "tiposColaboracionComercial",
  ],
  hideFields: mergeHideAdultLeaks([]),
  fieldOptions: { ...COLAB_OPTS },
  textosAyuda: {
    diferenciadorComercio: "Ej. Precios bajos · Surte diario · Atención personalizada",
    coberturaGeografica: "Colonia, municipio o zona de reparto.",
    colaboracionesComerciales: "¿Trabajas con marcas, proveedores o negocios aliados?",
  },
};

const A_ABASTOS = {
  ...COMMON,
  extraFields: [
    "categoriasProducto",
    "serviciosComercio",
    "modalidadVentaComercio",
    "formasPagoComercio",
    "entregaDomicilio",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: [
    "categoriasProducto",
    "modalidadVentaComercio",
    "formasPagoComercio",
    "coberturaGeografica",
  ],
  fieldOptions: {
    modalidadVentaComercio: MODALIDAD_VENTA_COMERCIO,
    entregaDomicilio: ENTREGA_DOMICILIO,
    formasPagoComercio: FORMAS_PAGO_COMERCIO,
    ...COLAB_OPTS,
  },
};

const B_MODA = {
  ...COMMON,
  extraFields: [
    "categoriasProducto",
    "generosModa",
    "marcasComercializadas",
    "modalidadVentaComercio",
    "serviciosComercio",
    "formasPagoComercio",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: [
    "categoriasProducto",
    "generosModa",
    "modalidadVentaComercio",
    "formasPagoComercio",
  ],
  fieldOptions: {
    modalidadVentaComercio: MODALIDAD_VENTA_COMERCIO.filter((o) => o.value !== "delivery"),
    formasPagoComercio: FORMAS_PAGO_COMERCIO,
    ...COLAB_OPTS,
  },
};

const C_ESPECIAL = {
  ...COMMON,
  extraFields: [
    "categoriasProducto",
    "serviciosComercio",
    "modalidadVentaComercio",
    "formasPagoComercio",
    "entregaDomicilio",
    "marcasComercializadas",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: [
    "categoriasProducto",
    "serviciosComercio",
    "modalidadVentaComercio",
    "formasPagoComercio",
  ],
  fieldOptions: {
    modalidadVentaComercio: MODALIDAD_VENTA_COMERCIO,
    entregaDomicilio: ENTREGA_DOMICILIO,
    formasPagoComercio: FORMAS_PAGO_COMERCIO,
    ...COLAB_OPTS,
  },
};

const D_MAYOREO = {
  ...COMMON,
  extraFields: [
    "serviciosMayoreo",
    "volumenMinimoPedido",
    "tiposClientesComercio",
    "modalidadVentaComercio",
    "formasPagoComercio",
    "entregaDomicilio",
    ...COMMON.extraFields,
  ],
  obligatoriosExtra: [
    "serviciosMayoreo",
    "volumenMinimoPedido",
    "tiposClientesComercio",
    "modalidadVentaComercio",
    "coberturaGeografica",
  ],
  fieldOptions: {
    modalidadVentaComercio: MODALIDAD_VENTA_COMERCIO.filter((o) =>
      ["tienda_fisica", "ambos", "delivery"].includes(o.value)
    ),
    entregaDomicilio: ENTREGA_DOMICILIO,
    formasPagoComercio: FORMAS_PAGO_COMERCIO,
    ...COLAB_OPTS,
  },
};

const D_NEGOCIO = {
  extraFields: [
    "serviciosEmpresaComercio",
    "especialidadesEmpresaComercio",
    "tiposClientesComercio",
    "flotaEntrega",
    "modalidadVentaComercio",
    "formasPagoComercio",
    "diferenciadorComercio",
    "colaboracionesComerciales",
    "tiposColaboracionComercial",
  ],
  hideFields: mergeHideAdultLeaks([]),
  obligatoriosExtra: [
    "serviciosEmpresaComercio",
    "especialidadesEmpresaComercio",
    "tiposClientesComercio",
    "flotaEntrega",
    "modalidadVentaComercio",
  ],
  fieldOptions: {
    modalidadVentaComercio: MODALIDAD_VENTA_COMERCIO.filter((o) => o.value !== "online"),
    formasPagoComercio: FORMAS_PAGO_COMERCIO,
    ...COLAB_OPTS,
  },
  textosAyuda: {
    ...COMMON.textosAyuda,
    flotaEntrega: "Ej. Reparto diario CDMX · 5 unidades",
  },
};

export const SUB_EXTRA_PROFILES = {
  abarrotes: {
    ...A_ABASTOS,
    blockTitle: "Abarrotes",
    aliasPlaceholder: "Ej. Abarrotes La Esquina · Surte diario",
    fieldOptions: {
      ...A_ABASTOS.fieldOptions,
      categoriasProducto: [
        "Despensa",
        "Lácteos",
        "Bebidas",
        "Botanas",
        "Limpieza",
        "Higiene personal",
        "Frutas y verduras",
        "Otro",
      ],
      serviciosComercio: ["Venta mostrador", "Pedidos", "Apartado", "Delivery", "Recargas", "Otro"],
    },
  },
  "tiendas-de-conveniencia": {
    ...A_ABASTOS,
    blockTitle: "Tiendas de conveniencia",
    aliasPlaceholder: "Ej. Mini súper 24 h · Col. Centro",
    fieldOptions: {
      ...A_ABASTOS.fieldOptions,
      categoriasProducto: [
        "Snacks",
        "Bebidas",
        "Lácteos",
        "Panadería",
        "Higiene",
        "Servicios",
        "Otro",
      ],
      serviciosComercio: ["24 horas", "Recargas", "Pago servicios", "Café", "Delivery", "Otro"],
    },
  },
  zapaterias: {
    ...B_MODA,
    blockTitle: "Zapaterías",
    aliasPlaceholder: "Ej. Zapatería · Calzado familiar",
    fieldOptions: {
      ...B_MODA.fieldOptions,
      categoriasProducto: ["Calzado casual", "Deportivo", "Formal", "Infantil", "Otro"],
      generosModa: ["Hombre", "Mujer", "Niño", "Unisex", "Otro"],
      marcasComercializadas: ["Nacional", "Importado", "Marca propia", "Varias marcas", "Otro"],
      serviciosComercio: ["Venta retail", "Mayoreo chico", "Ajustes", "Otro"],
    },
  },
  "tiendas-de-ropa": {
    ...B_MODA,
    blockTitle: "Tiendas de ropa",
    aliasPlaceholder: "Ej. Boutique · Moda casual",
    fieldOptions: {
      ...B_MODA.fieldOptions,
      categoriasProducto: ["Casual", "Formal", "Deportiva", "Infantil", "Accesorios", "Otro"],
      generosModa: ["Hombre", "Mujer", "Niño", "Unisex", "Otro"],
      marcasComercializadas: ["Marca propia", "Nacional", "Importado", "Varias marcas", "Otro"],
      serviciosComercio: ["Venta retail", "Mayoreo chico", "Personal shopper", "Otro"],
    },
  },
  "farmacias-de-barrio": {
    ...C_ESPECIAL,
    blockTitle: "Farmacias de barrio",
    aliasPlaceholder: "Ej. Farmacia del barrio · Entrega local",
    fieldOptions: {
      ...C_ESPECIAL.fieldOptions,
      categoriasProducto: [
        "Medicamentos",
        "Genéricos",
        "Dermocosmética",
        "Bebés",
        "Suplementos",
        "Otro",
      ],
      serviciosComercio: ["Venta mostrador", "Entrega a domicilio", "Toma de presión", "Otro"],
      marcasComercializadas: ["Genéricos", "Patente", "Mixto", "Otro"],
    },
  },
  papelerias: {
    ...C_ESPECIAL,
    blockTitle: "Papelerías",
    aliasPlaceholder: "Ej. Papelería · Útiles y copias",
    fieldOptions: {
      ...C_ESPECIAL.fieldOptions,
      categoriasProducto: [
        "Útiles escolares",
        "Oficina",
        "Impresión",
        "Regalos",
        "Arte",
        "Otro",
      ],
      serviciosComercio: ["Copias", "Impresión", "Engargolado", "Venta retail", "Otro"],
      marcasComercializadas: [],
    },
    extraFields: C_ESPECIAL.extraFields.filter((f) => f !== "marcasComercializadas"),
  },
  ferreterias: {
    ...C_ESPECIAL,
    blockTitle: "Ferreterías",
    aliasPlaceholder: "Ej. Ferretería · Herramientas y plomería",
    fieldOptions: {
      ...C_ESPECIAL.fieldOptions,
      categoriasProducto: [
        "Herramientas",
        "Plomería",
        "Eléctrico",
        "Pintura",
        "Construcción",
        "Jardín",
        "Otro",
      ],
      serviciosComercio: ["Asesoría", "Cortes", "Pedidos especiales", "Delivery", "Otro"],
      marcasComercializadas: ["Truper", "Condor", "Urrea", "Genérico", "Varias", "Otro"],
    },
  },
  mayoreo: {
    ...D_MAYOREO,
    blockTitle: "Mayoreo",
    aliasPlaceholder: "Ej. Mayoreo · Surtido a negocios",
    fieldOptions: {
      ...D_MAYOREO.fieldOptions,
      serviciosMayoreo: ["Mayoreo", "Medio mayoreo", "Surtido", "Entrega programada", "Otro"],
      tiposClientesComercio: ["Negocios", "Restaurantes", "Tienditas", "Eventos", "Otro"],
    },
  },
  distribuidoras: {
    ...D_NEGOCIO,
    blockTitle: "Distribuidoras",
    blockHint: "Servicios B2B, cobertura de entrega y especialidades.",
    fieldOptions: {
      ...D_NEGOCIO.fieldOptions,
      serviciosEmpresaComercio: [
        "Distribución B2B",
        "Rutas fijas",
        "Cross-dock",
        "Surtido",
        "Crédito comercial",
        "Otro",
      ],
      tiposClientesComercio: ["Retail", "Restaurantes", "Industria", "Gobierno", "Otro"],
    },
  },
};

for (const subId of Object.keys(SUB_EXTRA_PROFILES)) {
  SUB_EXTRA_PROFILES[subId] = mergeEnrichmentV2(SUB_EXTRA_PROFILES[subId], subId);
  const p = SUB_EXTRA_PROFILES[subId];
  p.hideFields = mergeHideAdultLeaks(p.hideFields || []);
  if (subId !== "distribuidoras") {
    p.extraFields = [...new Set([...(p.extraFields || []), "colaboracionesComerciales"])];
  }
  p.fieldOptions = p.fieldOptions || {};
  if (!p.fieldOptions.colaboracionesComerciales) {
    p.fieldOptions.colaboracionesComerciales = COLABORACIONES_COMERCIALES_OPTIONS;
  }
  if (!p.fieldOptions.tiposColaboracionComercial) {
    p.fieldOptions.tiposColaboracionComercial = TIPOS_COLABORACION_COMERCIAL;
  }
}
