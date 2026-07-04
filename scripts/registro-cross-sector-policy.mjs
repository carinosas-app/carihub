/**
 * Política transversal registro — fugas adultos, colaboraciones, fotos, privados.
 * MP-REGISTRO-CROSS-SECTOR-POLICY-V1
 */

/** Campos de adultos/escort/contenido que NO deben aparecer fuera sector adultos */
export const HIDE_ADULT_LEAKS = [
  "nivelServicio",
  "modalidades",
  "precioDesde",
  "medidas",
  "talla",
  "orientacion",
  "serviciosAdultos",
  "disponibilidadAgenda",
  "nivelPremium",
  "realizaTrios",
  "haceColaboraciones",
  "colaboraCon",
  "mostrarColaboraciones",
  "colaboracionContenido",
  "videoPresentacion",
  "tipoCitaPreferida",
  "disponiblePara",
  "buscanConocer",
  "experienciaVip",
  "distintivosVip",
  "presentacionFemboy",
  "presentacionTom",
  "estiloPredominante",
  "atiendoA",
  "mostrarAtiendoA",
];

/** Sectores donde SÍ aplican colaboraciones estilo adultos (blocks adultos) */
export const SECTORS_ADULT_COLLAB = new Set(["adultos"]);

/** Sectores con colaboraciones comerciales / profesionales (B2B, no escort) */
export const SECTORS_BUSINESS_COLLAB = new Set([
  "profesionales",
  "tecnologia",
  "eventos",
  "restaurantes",
  "bienestar",
  "industria",
  "comercio",
  "educacion",
  "transporte",
  "automotriz",
  "mascotas",
  "hogar",
]);

export const COLABORACIONES_COMERCIALES_OPTIONS = [
  { value: "si_activo", label: "Sí, colaboro activamente" },
  { value: "ocasional", label: "Ocasionalmente" },
  { value: "convenir", label: "A convenir por proyecto" },
  { value: "no", label: "No por ahora" },
];

export const TIPOS_COLABORACION_COMERCIAL = [
  "Otros profesionales",
  "Empresas / marcas",
  "Proveedores",
  "Freelancers",
  "Creadores de contenido",
  "Instituciones",
  "Otro",
];

/** Fotos mínimas sugeridas por sector (fallback si no hay blocks) */
export const FOTOS_MIN_BY_SECTOR = {
  adultos: 3,
  salud: 2,
  profesionales: 2,
  bienestar: 2,
  eventos: 3,
  restaurantes: 3,
  tecnologia: 2,
  "bienes-raices": 4,
  automotriz: 3,
  transporte: 2,
  educacion: 2,
  hogar: 2,
  industria: 3,
  mascotas: 3,
  comercio: 3,
};

export const GALLERY_HINT_BY_SECTOR = {
  adultos: "Foto principal y galería — muestra tu mejor imagen profesional.",
  salud: "Foto principal (rostro o consultorio) y 1–2 fotos de espacio o credenciales visibles.",
  profesionales: "Foto profesional y opcionalmente oficina, equipo o material de trabajo.",
  bienestar: "Foto del espacio, sesión o práctica — ambiente acogedor y profesional.",
  eventos: "Fotos de eventos reales, montaje o portfolio — mínimo 2 del servicio.",
  restaurantes: "Platillos, local y ambiente — lo que verá quien busca dónde comer.",
  tecnologia: "Foto profesional y opcional captura de proyectos o workspace (sin datos sensibles).",
  "bienes-raices": "Fachada, interiores y plano — ayuda a quien busca propiedad.",
  generico: "Foto principal y hasta 3 extras que muestren tu servicio o negocio.",
};

/** Campos privados extra por sector (además de formulario base) */
export const SECTOR_PRIVATE_EXTRAS = {
  salud: ["cedulaNumero", "cedulaEspecialidad"],
  profesionales: ["cedulaNumero", "cedulaProfesion"],
  tecnologia: ["portfolioPrivado", "certificacionesTI"],
  restaurantes: ["licenciaOperacion", "rfc"],
  eventos: ["licenciaOperacion", "polizaResponsabilidadCivil"],
  "bienes-raices": ["rfc", "licenciaOperacion"],
  automotriz: ["rfc"],
  industria: ["rfc", "licenciaOperacion"],
};

export function sectorAllowsBusinessCollab(sectorId) {
  return SECTORS_BUSINESS_COLLAB.has(String(sectorId || "").trim());
}

export function mergeHideAdultLeaks(hideFields = []) {
  return [...new Set([...hideFields, ...HIDE_ADULT_LEAKS])];
}
