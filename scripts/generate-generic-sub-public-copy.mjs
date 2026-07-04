/**
 * Genera copy público legacy (labels/placeholders) por subcategoría — 443 subs.
 * Para sectores sin blocks dinámicos: mejora alias, servicios, descripción, horario.
 * node scripts/generate-generic-sub-public-copy.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { sectorAllowsBusinessCollab } from "./registro-cross-sector-policy.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mapa = JSON.parse(fs.readFileSync(path.join(root, "scripts/mapa-registro-categorias.json"), "utf8"));

/** Sectores con blocks dinámicos propios — no duplicar copy legacy */
const SECTORS_WITH_BLOCKS = new Set([
  "adultos",
  "salud",
  "bienestar",
  "profesionales",
  "eventos",
  "restaurantes",
  "tecnologia",
  "automotriz",
  "transporte",
  "comercio",
  "hogar",
  "mascotas",
  "bienes-raices",
  "educacion",
  "industria",
]);

function serviciosLabel(sectorId, nombre) {
  const n = String(nombre || "").toLowerCase();
  if (sectorId === "tecnologia") return "Servicios técnicos que ofreces";
  if (sectorId === "automotriz") return "Servicios automotrices";
  if (sectorId === "transporte") return "Servicios de transporte / logística";
  if (sectorId === "hogar") return "Oficios y servicios a domicilio";
  if (sectorId === "mascotas") return "Servicios para mascotas";
  if (sectorId === "educacion") return "Cursos, clases o servicios educativos";
  if (sectorId === "industria") return "Servicios industriales / manufactura";
  if (sectorId === "comercio") return "Productos o servicios comerciales";
  if (sectorId === "bienes-raices") return "Características del inmueble o servicio inmobiliario";
  if (n.includes("reparación") || n.includes("reparacion")) return "Reparaciones y servicios incluidos";
  return "Servicios u ofertas principales";
}

function descripcionPlaceholder(sectorId, nombre) {
  if (sectorId === "bienes-raices") return "Ej. Departamento luminoso · 2 rec · amenidades";
  if (sectorId === "automotriz") return "Ej. Mecánica general · Diagnóstico sin costo";
  if (sectorId === "hogar") return "Ej. Plomería urgente · Garantía por escrito";
  if (sectorId === "tecnologia") return "Ej. Soporte TI mismo día · Remoto y presencial";
  return `Ej. ${nombre} · Atención profesional en tu zona`;
}

function serviciosPlaceholder(sectorId, subId, nombre) {
  if (subId.includes("soporte") || subId.includes("reparacion") || subId.includes("comput")) {
    return "Ej. Formateo, limpieza, redes, respaldo, antivirus, visita a domicilio";
  }
  if (sectorId === "mascotas") return "Ej. Consulta, vacunas, grooming, paseo, guardería";
  if (sectorId === "educacion") return "Ej. Clases particulares, certificación, tutorías en línea";
  if (sectorId === "bienes-raices") return "Ej. 85 m², 2 rec, estacionamiento, amenidades";
  return "Describe servicios concretos — evita frases genéricas vacías";
}

const COPY = {};

for (const row of mapa.matrix) {
  const subId = row.subcategoriaId;
  const sectorId = row.sectorId;
  const nombre = row.subcategoria || subId;
  const entry = {
    sectorId,
    nombre,
    labels: {
      alias: row.formularioId === "negocio_empresa" ? "Nombre comercial" : "Nombre público",
      descripcion: "Frase que te represente en resultados",
      servicios: serviciosLabel(sectorId, nombre),
      precio: row.formularioId === "negocio_empresa" ? "Precio o tarifa desde" : "Tarifa desde",
      horario: row.formularioId === "negocio_empresa" ? "Horario de atención" : "Horario disponible",
    },
    placeholders: {
      alias: `Ej. ${nombre} · tu ciudad o especialidad`,
      descripcion: descripcionPlaceholder(sectorId, nombre),
      servicios: serviciosPlaceholder(sectorId, subId, nombre),
      precio: "Ej. $500 MXN / visita · $1,200 / mes",
      horario: "Ej. Lun–Vie 9:00–19:00 · Citas previas",
    },
    notaPublica: "",
  };

  if (sectorAllowsBusinessCollab(sectorId) && !SECTORS_WITH_BLOCKS.has(sectorId)) {
    entry.notaPublica =
      "Si colaboras con otros profesionales o negocios, menciónalo en servicios o descripción.";
  }

  if (!SECTORS_WITH_BLOCKS.has(sectorId)) {
    entry.blockHint = `Perfil público — ${nombre}. Sé específico: qué ofreces, a quién y en qué zona.`;
  }

  COPY[subId] = entry;
}

const out = `/** Auto-generado — copy legacy público por sub (443). MP-GENERIC-SUB-PUBLIC-COPY-V1 */
(function (global) {
  'use strict';
  global.CARIHUB_GENERIC_SUB_PUBLIC_COPY = ${JSON.stringify(COPY, null, 2)};
})(typeof window !== 'undefined' ? window : globalThis);
`;

const outPath = path.join(root, "public/js/data/registro-generic-sub-public-copy.js");
fs.writeFileSync(outPath, out, "utf8");
console.log("Wrote", outPath, "entries:", Object.keys(COPY).length);
