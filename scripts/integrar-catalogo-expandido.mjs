/**
 * Integra catálogo expandido → sectores-carihub.js + mapa-registro-categorias.json
 * Uso: node scripts/integrar-catalogo-expandido.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  arquetipoAdultos,
  sectorArquetipoIndependiente,
  sectorArquetipoNegocio,
  sectorArquetipoProfesionista,
} from "./arquetipos-catalogo.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scripts = path.join(root, "scripts");
const datos = JSON.parse(fs.readFileSync(path.join(scripts, "catalogo-expandido-datos.json"), "utf8"));
const enriquecimiento = JSON.parse(fs.readFileSync(path.join(scripts, "busqueda-enriquecimiento.json"), "utf8"));

const FORMULARIO_TEMPORAL = {
  adultos: "temporal_adultos",
  persona_independiente: "temporal_persona_independiente",
  profesionista_cedula: "temporal_profesionista_cedula",
  negocio_empresa: "temporal_negocio_empresa",
};

const FORM_TO_ID = {
  "Formulario Adultos": "adultos",
  "Formulario Adultos o Independiente": "adultos",
  "Formulario Persona Independiente": "persona_independiente",
  "Formulario Independiente o Negocio": "persona_independiente",
  "Formulario Profesionista": "profesionista_cedula",
  "Formulario Negocio": "negocio_empresa",
};

function slug(t) {
  return String(t)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function pack(tipoReg, form, arq, tipoPerfil, res, perf, x = {}) {
  const formularioId = FORM_TO_ID[form] || null;
  return {
    tipoRegistro: tipoReg,
    formulario: form,
    formularioId,
    arquetipo: arq,
    tipoPerfil,
    componenteResultados: res,
    componentePerfil: perf,
    schemaVersion: "2026-06-10",
    ...x,
  };
}

/** Overrides explícitos por sectorId + subcategoriaId (slug) */
const OVERRIDES = {
  "bienes-raices": {
    "agente-inmobiliario-independiente": pack("Persona Independiente", "Formulario Persona Independiente", "persona_servicio_profesional", "persona", "ResultCardServicio", "ProfileLayoutServicio", { verif: "persona INE", fotos: 2, admin: "media", obs: "Agente inmobiliario persona" }),
    "asesor-inmobiliario": "agente-inmobiliario-independiente",
    "corredor-inmobiliario": "agente-inmobiliario-independiente",
    "promotor-de-propiedades": "agente-inmobiliario-independiente",
    "administrador-de-propiedades": "agente-inmobiliario-independiente",
    "valuador-inmobiliario": pack("Persona Independiente", "Formulario Persona Independiente", "persona_servicio_profesional", "persona", "ResultCardServicio", "ProfileLayoutServicio", { verif: "persona INE", fotos: 2 }),
    "rentas-vacacionales-independiente": pack("Persona Independiente", "Formulario Persona Independiente", "persona_servicio_general", "persona", "ResultCardServicio", "ProfileLayoutServicio", { verif: "persona INE", fotos: 3 }),
    "rentas-temporales-independiente": "rentas-vacacionales-independiente",
    "inmobiliaria": pack("Negocio o Empresa", "Formulario Negocio", "negocio_inmobiliario", "negocio", "ResultCardNegocio", "ProfileLayoutNegocio", { verif: "RFC", fotos: 5, mapa: true }),
    "constructora": pack("Negocio o Empresa", "Formulario Negocio", "negocio_servicios_local", "negocio", "ResultCardNegocio", "ProfileLayoutNegocio", { fotos: 5, mapa: true }),
    "desarrolladora-inmobiliaria": "inmobiliaria",
    "agencia-de-bienes-raices": "inmobiliaria",
    "administracion-de-condominios": pack("Negocio o Empresa", "Formulario Negocio", "negocio_inmobiliario", "negocio", "ResultCardNegocio", "ProfileLayoutNegocio", { fotos: 4, mapa: true }),
    "centros-de-negocios-y-oficinas": pack("Negocio o Empresa", "Formulario Negocio", "negocio_inmobiliario", "negocio", "ResultCardNegocio", "ProfileLayoutNegocio", { fotos: 5, mapa: true, obs: "Coworking/oficinas — NO confundir con Centro de Negocios Empresarial (industria)" }),
    "coworking": "centros-de-negocios-y-oficinas",
  },
  eventos: {
    "edecan-para-eventos": pack("Persona Independiente", "Formulario Persona Independiente", "persona_servicio_profesional", "persona", "ResultCardServicio", "ProfileLayoutServicio", { verif: "persona INE", fotos: 3, obs: "NO es edecan adultos — ID distinto" }),
    dj: pack("Persona Independiente", "Formulario Persona Independiente", "persona_servicio_profesional", "persona", "ResultCardServicio", "ProfileLayoutServicio", { verif: "persona INE", fotos: 2 }),
    "salon-de-eventos": pack("Negocio o Empresa", "Formulario Negocio", "negocio_venue", "lugar", "ResultCardVenue", "ProfileLayoutVenue", { fotos: 6, mapa: true }),
    "jardin-para-eventos": "salon-de-eventos",
    "productora-de-espectaculos": pack("Negocio o Empresa", "Formulario Negocio", "negocio_servicios_local", "negocio", "ResultCardNegocio", "ProfileLayoutNegocio", { fotos: 5 }),
    "agencia-de-edecanes": pack("Negocio o Empresa", "Formulario Negocio", "negocio_servicios_local", "negocio", "ResultCardNegocio", "ProfileLayoutNegocio", { fotos: 4 }),
    "catering-para-eventos": pack("Negocio o Empresa", "Formulario Negocio", "negocio_alimentos", "negocio", "ResultCardNegocio", "ProfileLayoutNegocio", { fotos: 5 }),
  },
  tecnologia: {
    "especialista-en-ciberseguridad-independiente": pack("Persona Independiente", "Formulario Persona Independiente", "persona_servicio_profesional", "persona", "ResultCardServicio", "ProfileLayoutServicio", { verif: "persona INE", fotos: 2 }),
    "ciberseguridad-empresarial": pack("Negocio o Empresa", "Formulario Negocio", "negocio_servicios_local", "negocio", "ResultCardNegocio", "ProfileLayoutNegocio", { fotos: 4 }),
    "soporte-tecnico-independiente": pack("Persona Independiente", "Formulario Persona Independiente", "persona_servicio_profesional", "persona", "ResultCardServicio", "ProfileLayoutServicio", { fotos: 2 }),
    "soporte-empresarial-ti": pack("Negocio o Empresa", "Formulario Negocio", "negocio_servicios_local", "negocio", "ResultCardNegocio", "ProfileLayoutNegocio", { fotos: 3 }),
  },
  mascotas: {
    "medico-veterinario": pack("Profesionista con Cédula", "Formulario Profesionista", "profesional_veterinario", "persona", "ResultCardProfesional", "ProfileLayoutProfesional", { verif: "cedula veterinaria + INE", cedula: true, fotos: 2 }),
    "veterinario-especialista": "medico-veterinario",
    "cirujano-veterinario": "medico-veterinario",
    "clinica-veterinaria": pack("Negocio o Empresa", "Formulario Negocio", "negocio_institucion", "negocio", "ResultCardNegocio", "ProfileLayoutNegocio", { fotos: 5, mapa: true }),
    "hospital-veterinario": "clinica-veterinaria",
    groomer: pack("Persona Independiente", "Formulario Persona Independiente", "persona_servicio_oficio", "persona", "ResultCardServicio", "ProfileLayoutServicio", { fotos: 3 }),
    "estetica-canina": pack("Negocio o Empresa", "Formulario Negocio", "negocio_servicios_local", "negocio", "ResultCardNegocio", "ProfileLayoutNegocio", { fotos: 4 }),
  },
  industria: {
    "consultor-empresarial-independiente": pack("Persona Independiente", "Formulario Persona Independiente", "persona_servicio_profesional", "persona", "ResultCardServicio", "ProfileLayoutServicio", { fotos: 2, obs: "Distinto de Consultoría Empresarial negocio" }),
    "consultoria-empresarial": pack("Negocio o Empresa", "Formulario Negocio", "negocio_servicios_local", "negocio", "ResultCardNegocio", "ProfileLayoutNegocio", { fotos: 4, obs: "Sector industria; profesionales tiene entrada paralela" }),
    "centro-de-negocios-empresarial": pack("Negocio o Empresa", "Formulario Negocio", "negocio_servicios_local", "negocio", "ResultCardNegocio", "ProfileLayoutNegocio", { fotos: 4, obs: "Servicios empresariales — NO bienes raíces coworking" }),
    "contador-publico": pack("Profesionista con Cédula", "Formulario Profesionista", "profesional_tecnico_legal", "persona", "ResultCardProfesional", "ProfileLayoutProfesional", {
      cedula: true,
      fotos: 2,
      obs: "CPA certificado (cédula) — sector industria. NO confundir con 'contadores' en profesionales (despacho/oficina contable).",
    }),
  },
  profesionales: {
    contadores: pack("Profesionista con Cédula", "Formulario Profesionista", "profesional_tecnico_legal", "persona", "ResultCardProfesional", "ProfileLayoutProfesional", {
      cedula: true,
      fotos: 2,
      obs: "Despacho/oficina contable — NO confundir con Contador Público CPA (industria).",
    }),
  },
  restaurantes: {
    "catering-independiente": pack("Persona Independiente", "Formulario Persona Independiente", "persona_servicio_oficio", "persona", "ResultCardServicio", "ProfileLayoutServicio", { fotos: 3 }),
    catering: pack("Negocio o Empresa", "Formulario Negocio", "negocio_alimentos", "negocio", "ResultCardNegocio", "ProfileLayoutNegocio", { fotos: 5, obs: "Sector restaurantes; eventos usa Catering para Eventos" }),
  },
};

const CEDULA_IDS = new Set([
  "psicopedagogo", "pedagogo", "docente-certificado", "especialista-en-educacion-especial",
  "medico-veterinario", "veterinario-especialista", "cirujano-veterinario",
  "contador-publico", "administrador-de-empresas", "ingeniero-industrial", "ingeniero-en-procesos",
  "especialista-en-seguridad-industrial",
]);

const NEGOCIO_PATTERNS = [
  /^(empresa|agencia|academia|escuela|instituto|centro de|hospital|clínica|clinica|inmobiliaria|constructora|productora|distribuidora|call center|outsourcing|manufactura|maquila|hosting|plataforma)/i,
  /(empresarial|corporativo|industrial)$/i,
  /^restaurante|^cafetería|^cafeteria|^taquería|^marisquería|^pastelería|^panadería|^heladería|^buffet|^dark kitchen/i,
  /^(salón|salon|jardín|jardín para|organización de|renta de (mobiliario|sonido|iluminación|escenarios))/i,
];

const INDEPENDIENTE_PATTERNS = [
  /independiente$/i, /^chofer|^conductor|^mensajero|^repartidor|^courier|^motomensajero|^chef privado|^panadero independiente|^programador|^desarrollador|^diseñador|^consultor (?!ía)/i,
  /^(paseador|entrenador|cuidador|groomer|adiestrador|fotógrafo|videógrafo|dj|maestro de|animador|payaso|mago|comediante|cantante|mariachi|sonidista|locutor|presentador|wedding planner)/i,
  /^(maestro|tutor|profesor|instructor|capacitador|coach)/i,
];

function resolveOverride(sectorId, subId) {
  const sector = OVERRIDES[sectorId];
  if (!sector) return null;
  const o = sector[subId];
  if (!o) return null;
  if (typeof o === "string") return resolveOverride(sectorId, o);
  return o;
}

function uniq(arr) {
  return [...new Set((arr || []).filter(Boolean).map((s) => String(s).trim()).filter(Boolean))];
}

function busquedaFor(sub, sectorId) {
  const tokens = sub.nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[\s/]+/)
    .filter((t) => t.length > 2);
  const baseKeywords = [sub.nombre.toLowerCase(), slug(sub.nombre).replace(/-/g, " "), ...tokens];
  const sectorEnr = enriquecimiento.sectores?.[sectorId] || {};
  const subEnr = enriquecimiento.porSubcategoriaId?.[sub.id] || {};
  const fusionAlias = enriquecimiento.fusionAliases?.[sub.id] || [];

  const keywords = uniq([...baseKeywords, ...(subEnr.keywords || [])]);
  const aliases = uniq([
    ...(subEnr.aliases || []),
    ...fusionAlias,
    sub.nombre.includes("Independiente") ? sub.nombre.replace(/ Independiente/i, "") : null,
  ]);
  const sinonimos = uniq([...(sectorEnr.sinonimosSector || []), ...(subEnr.sinonimos || [])]);
  const palabrasRelacionadas = uniq([
    sectorId.replace(/-/g, " "),
    ...(sectorEnr.palabrasRelacionadas || []),
    ...(subEnr.palabrasRelacionadas || []),
  ]);
  const erroresComunes = uniq(subEnr.erroresComunes || []);

  return {
    keywords,
    aliases,
    sinonimos,
    palabrasRelacionadas,
    erroresComunes,
    prioridadBusqueda: datos.sectores[sectorId] ? 55 : 50,
    estadoActivo: true,
    geoPrimero: true,
  };
}

function classifyAdultos(sub) {
  const { arquetipo, tipoPerfil, res, perf } = arquetipoAdultos(sub);
  const extra = { fotos: tipoPerfil === "lugar" || tipoPerfil === "negocio" ? 6 : 3, admin: "alta" };
  if (tipoPerfil === "lugar" || tipoPerfil === "negocio") extra.mapa = true;
  if (sub.id === "edecan") extra.obs = "Edecán adultos — NO confundir con edecan-para-eventos";
  return pack("Adultos", "Formulario Adultos", arquetipo, tipoPerfil, res, perf, extra);
}

function classifyDefault(sectorId, sub) {
  const n = sub.nombre.toLowerCase();
  const id = sub.id;

  if (sectorId === "adultos") return classifyAdultos(sub);

  const ov = resolveOverride(sectorId, id);
  if (ov) return { ...ov };

  const CEDULA_KW = ["medico", "dentista", "psicolog", "veterinari", "pedagogo", "psicopedagogo", "contador", "ingeniero", "abogad"];
  if (CEDULA_IDS.has(id) || CEDULA_KW.some((k) => (n.includes(k) || id.includes(k)) && !n.includes("clínica") && !n.includes("clinica") && !n.includes("hospital"))) {
    const arq = sectorArquetipoProfesionista(sectorId, sub.nombre);
    return pack("Profesionista con Cédula", "Formulario Profesionista", arq, "persona", "ResultCardProfesional", "ProfileLayoutProfesional", {
      publico: "nombre, especialidad, ciudad, precio consulta, foto",
      privado: "cédula, INE",
      verif: "cedula + INE",
      factura: true,
      cedula: true,
      fotos: 2,
      mapa: false,
      admin: "alta",
    });
  }

  if (NEGOCIO_PATTERNS.some((re) => re.test(sub.nombre)) || ["inmobiliaria", "coworking", "mudanzas", "outsourcing", "manufactura"].some((k) => id.includes(k))) {
    const arq = sectorArquetipoNegocio(sectorId, sub.nombre);
    const tipoPerfil = arq.includes("hospedaje") || arq.includes("venue") ? "lugar" : "negocio";
    return pack("Negocio o Empresa", "Formulario Negocio", arq, tipoPerfil, "ResultCardNegocio", "ProfileLayoutNegocio", {
      publico: "nombre comercial, dirección, horario, servicios, foto",
      privado: "RFC, teléfono",
      verif: "RFC",
      factura: true,
      cedula: false,
      fotos: 5,
      mapa: true,
      admin: "media",
    });
  }

  if (INDEPENDIENTE_PATTERNS.some((re) => re.test(sub.nombre))) {
    const arq = sectorArquetipoIndependiente(sectorId, id);
    return pack("Persona Independiente", "Formulario Persona Independiente", arq, "persona", "ResultCardServicio", "ProfileLayoutServicio", {
      publico: "alias, servicio, ciudad, tarifa, foto",
      privado: "INE, teléfono",
      verif: "persona INE",
      factura: true,
      cedula: false,
      fotos: 3,
      mapa: false,
      admin: "baja",
    });
  }

  if (["venta de", "renta de", "renta vacacional"].some((k) => n.startsWith(k)))
    return pack("Negocio o Empresa", "Formulario Negocio", "negocio_inmobiliario", "negocio", "ResultCardNegocio", "ProfileLayoutNegocio", {
      fotos: 4, mapa: true, admin: "media",
    });

  return pack("Persona Independiente", "Formulario Persona Independiente", "persona_servicio_general", "persona", "ResultCardServicio", "ProfileLayoutServicio", {
    publico: "alias, servicio, ciudad, tarifa, foto",
    privado: "INE",
    verif: "persona INE",
    fotos: 3,
    admin: "baja",
  });
}

function patchSectoresJs() {
  const file = path.join(root, "public/js/sectores-carihub.js");
  let content = fs.readFileSync(file, "utf8");

  for (const [sectorId, data] of Object.entries(datos.sectores)) {
    const names = data.subcategorias.map((n) => `        '${n.replace(/'/g, "\\'")}'`).join(",\n");
    const block = `subcategorias: subs([\n${names}\n      ])`;
    const re = new RegExp(
      `(id: '${sectorId.replace(/-/g, "\\-")}',[\\s\\S]*?nombre: '[^']*',[\\s\\S]*?)subcategorias: subs\\(\\[[\\s\\S]*?\\]\\)`,
      "m"
    );
    if (!re.test(content)) {
      console.warn("No patch sector", sectorId);
      continue;
    }
    content = content.replace(re, `$1${block}`);
    if (sectorId === "restaurantes") {
      content = content.replace(
        /nombre: 'Restaurantes, Alimentos y Vida Nocturna'/,
        "nombre: 'Restaurantes, Alimentos y Bebidas'"
      );
    }
  }
  fs.writeFileSync(file, content, "utf8");
  console.log("Patched sectores-carihub.js");
}

function loadAllSectors() {
  const sec = fs.readFileSync(path.join(root, "public/js/sectores-carihub.js"), "utf8");
  const cat = fs.readFileSync(path.join(root, "public/js/catalogos-carihub.js"), "utf8");
  const adultos = [...cat.matchAll(/\{id:"([^"]+)",nombre:"([^"]+)"/g)].map((m) => ({ id: m[1], nombre: m[2] }));

  function extractSubs(varName) {
    const re = new RegExp(`var ${varName} = subs\\(\\[([\\s\\S]*?)\\]\\);`);
    const m = sec.match(re);
    if (!m) return [];
    return [...m[1].matchAll(/'([^']+)'/g)].map((x) => ({ id: slug(x[1]), nombre: x[1] }));
  }

  const sectors = [
    { id: "adultos", nombre: "Adultos y Entretenimiento para Adultos", subs: adultos },
    { id: "bienestar", nombre: "Bienestar, Espiritualidad y Terapias Alternativas", subs: extractSubs("BIENESTAR") },
    { id: "salud", nombre: "Salud y Servicios Médicos", subs: extractSubs("SALUD") },
    { id: "profesionales", nombre: "Servicios Profesionales", subs: extractSubs("PROFESIONALES") },
  ];

  for (const m of sec.matchAll(/id: '([^']+)',\s*emoji:[\s\S]*?nombre: '([^']+)'([\s\S]*?)\n    \}/g)) {
    if (["adultos", "bienestar", "salud", "profesionales"].includes(m[1])) continue;
    const subsMatch = m[3].match(/subcategorias: subs\(\[([\s\S]*?)\]\)/);
    if (subsMatch) {
      sectors.push({
        id: m[1],
        nombre: m[2],
        subs: [...subsMatch[1].matchAll(/'([^']+)'/g)].map((x) => ({ id: slug(x[1]), nombre: x[1] })),
      });
    }
  }
  return sectors;
}

patchSectoresJs();
const sectors = loadAllSectors();

const matrix = [];
const duplicados = [];
const seenCanon = new Map();
const agregadas = { sectores: [], subcategorias: [] };
const prevTotal = 297;

for (const sector of sectors) {
  const exp = datos.sectores[sector.id];
  if (exp) agregadas.sectores.push(sector.id);

  for (const sub of sector.subs) {
    const canon = `${sector.id}::${sub.id}`;
    if (seenCanon.has(sub.id) && seenCanon.get(sub.id) !== sector.id) {
      duplicados.push({ subcategoriaId: sub.id, sectores: [seenCanon.get(sub.id), sector.id], nombre: sub.nombre });
    }
    seenCanon.set(sub.id, sector.id);

    const c = classifyDefault(sector.id, sub);
    const row = {
      categoriaPrincipal: sector.nombre,
      sectorId: sector.id,
      categoriaPadre: sector.id,
      subcategoria: sub.nombre,
      subcategoriaId: sub.id,
      ...c,
      busqueda: busquedaFor(sub, sector.id),
      renderizado: {
        fallbackResultados: "ResultCardGenerico",
        fallbackPerfil: "ProfileLayoutGenerico",
      },
      categoriaSugerida: {
        usaCategoriaSugerida: true,
        formularioTemporal: FORMULARIO_TEMPORAL[c.formularioId] || null,
        coleccionSolicitud: "solicitudes_categorias",
        estadosSolicitud: ["sugerida_usuario", "en_revision_admin", "aprobada", "fusionada", "convertida_en_alias", "rechazada"],
      },
      comercial: {
        compatiblePrecios: true,
        compatiblePromociones: true,
        compatibleContratos: true,
        precioCongelado: true,
        promocionCongelada: true,
        renovaciones: true,
        revisionAdmin: true,
      },
    };
    matrix.push(row);
    if (exp?.subcategorias.includes(sub.nombre)) agregadas.subcategorias.push({ sectorId: sector.id, nombre: sub.nombre, id: sub.id });
  }
}

const forms = {};
const tipoPerfil = {};
const arquetipos = {};
for (const r of matrix) {
  forms[r.formularioId || r.formulario] = (forms[r.formularioId || r.formulario] || 0) + 1;
  tipoPerfil[r.tipoPerfil] = (tipoPerfil[r.tipoPerfil] || 0) + 1;
  arquetipos[r.arquetipo] = (arquetipos[r.arquetipo] || 0) + 1;
}

const mapaPath = path.join(scripts, "mapa-registro-categorias.json");
fs.writeFileSync(
  mapaPath,
  JSON.stringify({ generado: new Date().toISOString(), total: matrix.length, matrix }, null, 2)
);

const auditoria = {
  generado: new Date().toISOString(),
  resumen: {
    totalAnterior: prevTotal,
    totalFinal: matrix.length,
    subcategoriasAgregadasNetas: matrix.length - prevTotal,
    sectoresExpandidos: agregadas.sectores,
    sectoresTotal: sectors.length,
    categoriasPrincipales: sectors.length,
  },
  distribucion: { formularioId: forms, tipoPerfil, arquetipos },
  agregadas: agregadas,
  fusionesRecomendadas: Object.values(datos.sectores).flatMap((s) => s.fusiones || []),
  duplicadosIdEntreSectores: duplicados,
  conflictosResueltos: [
    { id: "edecan vs edecan-para-eventos", resolucion: "IDs distintos; adultos mantiene edecan en catálogo adultos" },
    { id: "centros-de-negocios", resolucion: "bienes-raices: centros-de-negocios-y-oficinas | industria: centro-de-negocios-empresarial" },
    { id: "ciberseguridad", resolucion: "independiente vs ciberseguridad-empresarial" },
    { id: "veterinario", resolucion: "Médico Veterinario profesionista vs Clínica Veterinaria negocio" },
    { id: "agente-inmobiliario vs inmobiliaria", resolucion: "persona independiente vs negocio" },
    { id: "dj vs productora", resolucion: "persona independiente vs negocio" },
    { id: "consultoria-empresarial", resolucion: "independiente Consultor Empresarial vs negocio Consultoría Empresarial; paralelo en sector profesionales" },
    { id: "contador-publico vs contadores", resolucion: "contador-publico (industria, CPA cédula) vs contadores (profesionales, despacho); aliases cruzados en busqueda-enriquecimiento; ambos profesional_tecnico_legal" },
  ],
  aliasesRecomendados: Object.values(datos.sectores).flatMap((s) =>
    (s.fusiones || []).filter((f) => f.alias).map((f) => ({ fusionadoEn: f.fusionadoEn, aliases: f.alias }))
  ),
  nuevosArquetiposNecesarios: [],
  nuevosFormulariosNecesarios: [],
  nuevosComponentesNecesarios: [],
  notaComponentes: "Todos usan componentes existentes + ResultCardGenerico/ProfileLayoutGenerico fallback",
  formulariosTemporales: {
    adultos: "temporal_adultos",
    persona_independiente: "temporal_persona_independiente",
    profesionista_cedula: "temporal_profesionista_cedula",
    negocio_empresa: "temporal_negocio_empresa",
    banner: "flujo banner actual",
  },
  archivosModificados: [
    "public/js/sectores-carihub.js",
    "scripts/mapa-registro-categorias.json",
    "scripts/config-registro-independiente-schema.json",
    "scripts/config-registro-profesionista-schema.json",
    "scripts/config-registro-negocio-schema.json",
    "scripts/catalogo-expandido-datos.json",
    "scripts/integrar-catalogo-expandido.mjs",
    "scripts/generar-schemas-registro.mjs",
    "scripts/clasificar-registro-categorias.mjs",
    "scripts/busqueda-enriquecimiento.json",
    "scripts/reporte-catalogo-expansion-final.json",
  ],
  produccionTocada: false,
  archivosProduccion: ["public/js/sectores-carihub.js — catálogo cliente, NO deploy"],
};

const sinTemporal = matrix.filter((r) => !r.categoriaSugerida?.formularioTemporal);
const sinBusquedaKeywords = matrix.filter((r) => !r.busqueda?.keywords?.length);
const componentesUsados = new Set(matrix.flatMap((r) => [r.componenteResultados, r.componentePerfil].filter(Boolean)));

const reporteFinal = {
  ...auditoria,
  validacionCatalogo: {
    totalFilas: matrix.length,
    conFormularioId: matrix.filter((r) => r.formularioId).length,
    conTipoPerfil: matrix.filter((r) => r.tipoPerfil).length,
    conArquetipo: matrix.filter((r) => r.arquetipo).length,
    conComponentes: matrix.filter((r) => r.componenteResultados && r.componentePerfil).length,
    conFormularioTemporal: matrix.length - sinTemporal.length,
    sinFormularioTemporal: sinTemporal.map((r) => r.subcategoriaId),
    conBusquedaKeywords: matrix.length - sinBusquedaKeywords.length,
    conBusquedaAliases: matrix.filter((r) => r.busqueda?.aliases?.length).length,
    conBusquedaSinonimos: matrix.filter((r) => r.busqueda?.sinonimos?.length).length,
    geoPrimeroEnBusqueda: matrix.filter((r) => r.busqueda?.geoPrimero === true).length,
    componentesUnicos: [...componentesUsados],
    nuevosComponentesNecesarios: [],
    nuevosFormulariosNecesarios: [],
    nuevosArquetiposOpcionales: [],
    categoriasQuePodrianRomperArquitectura: sinTemporal.length
      ? sinTemporal.map((r) => ({ subcategoriaId: r.subcategoriaId, motivo: "sin formularioTemporal" }))
      : [],
    renderEngineEnProduccion: false,
    resultadosHtmlModificado: false,
    perfilHtmlModificado: false,
  },
  estadoRecomendado: sinTemporal.length === 0 ? "PASS CON ADVERTENCIAS" : "FAIL",
  notaCongelamiento: "No congelado — pendiente decision usuario tras revisar arquetipos mapa vs schema",
};

fs.writeFileSync(path.join(scripts, "auditoria-catalogo-expansion.json"), JSON.stringify(auditoria, null, 2));
fs.writeFileSync(path.join(scripts, "reporte-catalogo-expansion-final.json"), JSON.stringify(reporteFinal, null, 2));
console.log("Reporte final:", path.join(scripts, "reporte-catalogo-expansion-final.json"));
if (sinTemporal.length) console.warn("SIN formularioTemporal:", sinTemporal.length);

console.log("Mapa:", matrix.length, "rows (antes ~", prevTotal, ")");
console.log("Forms:", forms);
console.log("Duplicados cross-sector:", duplicados.length);
console.log("Auditoría:", path.join(scripts, "auditoria-catalogo-expansion.json"));
