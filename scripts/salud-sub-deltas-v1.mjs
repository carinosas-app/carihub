/**
 * MP-SALUD-DELTAS-V1 — deltas públicos detallados por subcategoría (50).
 */
import { SUB_TO_PACK, PACK_LABELS, formularioIdForSub } from "./salud-packs-v1.mjs";
import { SUB_EXTRA_PROFILES } from "./salud-sub-extra-fields.mjs";

export const PACK_DELTA_BASE = {
  A: {
    blockTitle: "Profesional de salud (cédula)",
    blockHint: "Datos públicos de consulta — cédula se valida en privado.",
    aliasPlaceholder: "Ej. Dra. Ana Pérez · Medicina general",
    deltaFields: ["especialidad", "subespecialidad", "serviciosProfesionales", "segurosAceptados", "consultaEnLinea", "precioConsulta", "unidadConsulta", "horarioAtencion"],
    obligatoriosDelta: ["nombreProfesional", "especialidad", "serviciosProfesionales", "precioConsulta", "horarioAtencion", "segurosAceptados"],
    textosAyuda: {
      especialidad: "Debe ser coherente con tu cédula profesional.",
      serviciosProfesionales: "Consultas, procedimientos ambulatorios, etc.",
      segurosAceptados: "Indica aseguradoras o 'solo particular'.",
    },
  },
  B: {
    blockTitle: "Consulta / especialidad",
    blockHint: "Si tienes cédula profesional, usa el formulario Profesionista.",
    aliasPlaceholder: "Ej. Dr. García · Dermatología",
    deltaFields: ["especialidadServicio", "modalidadConsulta", "segurosAceptadosSalud", "atencionDomicilioSalud"],
    obligatoriosDelta: ["alias", "especialidadServicio", "modalidadConsulta", "certificaciones", "tarifaDesde", "horarioDetalle"],
    textosAyuda: {
      certificaciones: "Título o certificación; profesionales titulados deben usar formulario con cédula.",
    },
  },
  C: {
    blockTitle: "Cuidado y rehabilitación",
    blockHint: "Servicios de cuidado — declara certificaciones y cobertura.",
    aliasPlaceholder: "Ej. Enfermería a domicilio CDMX",
    deltaFields: ["serviciosCuidado", "atencionDomicilioSalud", "coberturaDomicilioZona"],
    obligatoriosDelta: ["alias", "serviciosCuidado", "atencionDomicilioSalud", "certificaciones", "tarifaDesde", "horarioDetalle"],
  },
  D: {
    blockTitle: "Diagnóstico y laboratorio",
    blockHint: "Estudios ofrecidos y tiempos de entrega — incluye ubicación.",
    aliasPlaceholder: "Ej. Laboratorio Clínico Norte",
    deltaFields: ["estudiosOfrecidos", "tiempoEntregaResultados", "tomaMuestrasDomicilio"],
    obligatoriosDelta: ["alias", "estudiosOfrecidos", "tiempoEntregaResultados", "horarioDetalle", "geo"],
  },
  E: {
    blockTitle: "Farmacia y productos médicos",
    blockHint: "Surtido y venta con receta — punto fijo o consultar.",
    aliasPlaceholder: "Ej. Farmacia del Centro",
    deltaFields: ["categoriasFarmacia", "surtidoFarmaceutico", "ventaConReceta"],
    obligatoriosDelta: ["alias", "categoriasFarmacia", "surtidoFarmaceutico", "horarioDetalle", "geo"],
  },
  F: {
    blockTitle: "Clínica / centro de salud",
    blockHint: "Datos del establecimiento — servicios y especialidades.",
    aliasPlaceholder: "Ej. Clínica Integral Sur",
    deltaFields: ["serviciosClinica", "especialidadesClinica", "urgencias24h"],
    obligatoriosDelta: ["nombreComercial", "serviciosClinica", "especialidadesClinica", "direccion", "horarioDetalle", "geo"],
  },
  G: {
    blockTitle: "Institución / residencial",
    blockHint: "Hospital, residencia o servicios institucionales.",
    aliasPlaceholder: "Ej. Hospital Privado Las Palmas",
    deltaFields: ["serviciosHospital", "nivelesAtencion", "serviciosResidencia", "serviciosFunerarios", "capacidadResidentes"],
    obligatoriosDelta: ["nombreComercial", "direccion", "horarioDetalle", "geo"],
  },
  H: {
    blockTitle: "Salud corporativa / ocupacional",
    blockHint: "Servicios a empresas — certificaciones y cobertura.",
    aliasPlaceholder: "Ej. Salud Ocupacional MX",
    deltaFields: ["serviciosCorporativos", "coberturaEmpresas"],
    obligatoriosDelta: ["alias", "serviciosCorporativos", "coberturaEmpresas", "certificaciones", "tarifaDesde", "horarioDetalle"],
  },
};

export const SUB_DELTA_PATCHES = {
  "medicos-generales": {
    blockTitle: "Medicina general",
    aliasPlaceholder: "Ej. Dra. Ana · Medicina general",
    fieldOptions: {
      serviciosProfesionales: ["Consulta general", "Control crónico", "Certificados", "Vacunación", "Otro"],
    },
  },
  "especialistas-medicos": {
    blockTitle: "Especialista médico",
    textosAyuda: { subespecialidad: "Subespecialidad si aplica (ej. cardiología intervencionista)." },
  },
  psicologos: {
    blockTitle: "Psicología clínica",
    fieldOptions: {
      serviciosProfesionales: ["Terapia individual", "Terapia de pareja", "Terapia familiar", "Evaluación psicológica", "Otro"],
    },
    textosAyuda: { serviciosProfesionales: "No incluyas diagnósticos en texto público." },
  },
  "ambulancias-y-traslado-medico": {
    blockTitle: "Ambulancias y traslado médico",
    deltaFields: ["modalidadTraslado", "coberturaEmergencias", "serviciosProfesionales", "horarioAtencion", "precioConsulta"],
    fieldOptions: {
      modalidadTraslado: ["Básica", "Medicalizada", "UCI móvil", "Traslado programado", "Otro"],
    },
  },
  "equipo-medico": {
    blockTitle: "Equipo médico / instrumental",
    fieldOptions: {
      serviciosProfesionales: ["Venta", "Renta", "Mantenimiento", "Capacitación uso", "Otro"],
    },
  },
  "examenes-medicos-para-empresas": {
    blockTitle: "Exámenes médicos empresariales",
    fieldOptions: { serviciosProfesionales: ["Examen médico ingreso", "Periódico", "Espirometría", "Audiometría", "Paquete ejecutivo"] },
  },
  "servicios-medicos-empresariales": { blockTitle: "Servicios médicos empresariales" },
  "seguros-medicos": {
    blockTitle: "Seguros médicos / agente",
    textosAyuda: { serviciosProfesionales: "Planes, coberturas y asesoría — no promesas de aprobación." },
  },
  "gastos-medicos-mayores": { blockTitle: "Gastos médicos mayores" },
  "dentistas-y-clinicas-dentales": {
    blockTitle: "Odontología / clínica dental",
    aliasPlaceholder: "Ej. Clínica Dental Sonrisa",
    fieldOptions: {
      especialidadServicio: ["Odontología general", "Ortodoncia", "Endodoncia", "Implantes", "Estética dental"],
    },
  },
  psiquiatras: {
    blockTitle: "Psiquiatría",
    textosAyuda: { especialidadServicio: "Si tienes cédula médica de psiquiatría, usa formulario Profesionista." },
  },
  nutriologos: {
    blockTitle: "Nutrición clínica",
    fieldOptions: { especialidadServicio: ["Consulta nutricional", "Plan alimenticio", "Deportiva", "Clínica", "Otro"] },
  },
  fisioterapeutas: {
    blockTitle: "Fisioterapia / rehabilitación",
    fieldOptions: { especialidadServicio: ["Rehabilitación", "Deportiva", "Neurológica", "Postoperatoria", "Otro"] },
  },
  quiropracticos: { blockTitle: "Quiropráctica" },
  "oftalmologia-y-opticas": {
    blockTitle: "Oftalmología / óptica",
    fieldOptions: { especialidadServicio: ["Consulta oftalmológica", "Optometría", "Lentes", "Cirugía refractiva", "Otro"] },
  },
  "audiologia-y-aparatos-auditivos": {
    blockTitle: "Audiología",
    fieldOptions: { especialidadServicio: ["Audiometría", "Adaptación audífonos", "Implante coclear info", "Otro"] },
  },
  "ginecologia-y-obstetricia": { blockTitle: "Ginecología y obstetricia" },
  urologia: { blockTitle: "Urología" },
  pediatria: { blockTitle: "Pediatría" },
  dermatologia: { blockTitle: "Dermatología" },
  cardiologia: { blockTitle: "Cardiología" },
  "cirugia-general": { blockTitle: "Cirugía general" },
  "cirugia-plastica-y-estetica": { blockTitle: "Cirugía plástica y estética" },
  "medicina-estetica": { blockTitle: "Medicina estética" },
  "enfermeria-a-domicilio": {
    blockTitle: "Enfermería a domicilio",
    fieldOptions: {
      serviciosCuidado: ["Curaciones", "Aplicación medicamentos", "Toma de signos", "Cuidados paliativos", "Otro"],
    },
  },
  "cuidado-de-adultos-mayores": {
    blockTitle: "Cuidado de adultos mayores",
    fieldOptions: {
      serviciosCuidado: ["Compañía", "Higiene", "Movilización", "Administración medicamentos", "Noche", "Otro"],
    },
  },
  "rehabilitacion-fisica": {
    blockTitle: "Rehabilitación física",
    fieldOptions: { serviciosCuidado: ["Terapia física", "Ejercicio terapéutico", "Electroterapia", "Hidroterapia", "Otro"] },
  },
  "terapias-de-lenguaje": {
    blockTitle: "Terapia de lenguaje",
    fieldOptions: { serviciosCuidado: ["Lenguaje infantil", "Deglución", "Voz", "Neurológica", "Otro"] },
  },
  "terapias-de-aprendizaje": {
    blockTitle: "Terapia de aprendizaje",
    fieldOptions: { serviciosCuidado: ["Dislexia", "TDAH apoyo", "Integración sensorial", "Otro"] },
  },
  "laboratorios-clinicos": {
    blockTitle: "Laboratorio clínico",
    fieldOptions: {
      estudiosOfrecidos: ["Química sanguínea", "Hemograma", "Uroanálisis", "Perfil lipídico", "COVID/PCR", "Otro"],
    },
  },
  "estudios-de-diagnostico-e-imagen": {
    blockTitle: "Diagnóstico por imagen",
    fieldOptions: { estudiosOfrecidos: ["Rayos X", "Ultrasonido", "Tomografía", "Resonancia", "Mamografía", "Otro"] },
  },
  "ultrasonidos-y-rayos-x": {
    blockTitle: "Ultrasonido y rayos X",
    fieldOptions: { estudiosOfrecidos: ["Ultrasonido", "Rayos X", "Doppler", "Otro"] },
  },
  "laboratorios-dentales": {
    blockTitle: "Laboratorio dental",
    fieldOptions: { estudiosOfrecidos: ["Prótesis", "Ortodoncia lab", "Coronas", "Otro"] },
  },
  "bancos-de-sangre": {
    blockTitle: "Banco de sangre",
    fieldOptions: { estudiosOfrecidos: ["Donación", "Tipificación", "Plasma", "Otro"] },
  },
  farmacias: {
    blockTitle: "Farmacia",
    fieldOptions: { categoriasFarmacia: ["Medicamentos", "Genéricos", "OTC", "Dermocosmética", "Otro"] },
  },
  "farmacias-especializadas": {
    blockTitle: "Farmacia especializada",
    fieldOptions: { categoriasFarmacia: ["Alto costo", "Oncología", "Controlado con receta", "Biologics info", "Otro"] },
  },
  "protesis-y-ortesis": {
    blockTitle: "Prótesis y órtesis",
    fieldOptions: { categoriasFarmacia: ["Prótesis", "Órtesis", "Ayudas técnicas", "Otro"] },
  },
  "oxigeno-medicinal": {
    blockTitle: "Oxígeno medicinal",
    fieldOptions: { categoriasFarmacia: ["Tanques", "Concentradores", "Renta", "Recargas", "Otro"] },
  },
  "clinicas-medicas": {
    blockTitle: "Clínica médica",
    fieldOptions: {
      serviciosClinica: ["Consulta externa", "Urgencias", "Hospitalización corta", "Laboratorio", "Imagen", "Otro"],
    },
  },
  "centros-de-rehabilitacion": {
    blockTitle: "Centro de rehabilitación",
    fieldOptions: { serviciosClinica: ["Física", "Adicciones", "Neurológica", "Deportiva", "Otro"] },
  },
  "centros-de-salud-mental": {
    blockTitle: "Centro de salud mental",
    fieldOptions: { serviciosClinica: ["Psicoterapia", "Psiquiatría", "Grupos", "Internamiento ambulatorio", "Otro"] },
  },
  "clinicas-de-adicciones": { blockTitle: "Clínica de adicciones" },
  "clinicas-de-fertilidad": { blockTitle: "Clínica de fertilidad" },
  "seguridad-e-higiene-industrial": {
    blockTitle: "Seguridad e higiene industrial",
    fieldOptions: { serviciosClinica: ["Evaluación riesgos", "Capacitación", "Monitoreo ambiental", "Otro"] },
  },
  "hospitales-privados": {
    blockTitle: "Hospital privado",
    fieldOptions: {
      serviciosHospital: ["Urgencias", "Hospitalización", "Cirugía", "UCI", "Parto", "Otro"],
      nivelesAtencion: ["Primero", "Segundo", "Tercer nivel"],
    },
  },
  "casas-de-retiro": {
    blockTitle: "Casa de retiro",
    fieldOptions: { serviciosResidencia: ["Alojamiento", "Alimentación", "Enfermería", "Actividades", "Otro"] },
  },
  "asilos-y-residencias-asistidas": {
    blockTitle: "Asilo / residencia asistida",
    fieldOptions: { serviciosResidencia: ["Cuidado 24h", "Asistencia médica", "Rehabilitación", "Otro"] },
  },
  "servicios-funerarios": {
    blockTitle: "Servicios funerarios",
    fieldOptions: { serviciosFunerarios: ["Velación", "Cremación", "Traslado", "Previsión", "Otro"] },
    deltaFields: ["serviciosFunerarios", "horarioDetalle"],
  },
  "salud-ocupacional": {
    blockTitle: "Salud ocupacional",
    fieldOptions: {
      serviciosCorporativos: ["Examen preocupacional", "Periódico", "Programa NOM-035", "Campo", "Otro"],
    },
  },
  "medicina-del-trabajo": {
    blockTitle: "Medicina del trabajo",
    fieldOptions: { serviciosCorporativos: ["Atención en planta", "Urgencias laborales", "Ergonomía", "Otro"] },
  },
};

function mergeDelta(subId, nombre, pack) {
  const base = PACK_DELTA_BASE[pack] || PACK_DELTA_BASE.B;
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
    formularioId: formularioIdForSub(subId, pack),
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
    negocioLocal: pack === "F",
    negocioInstitucion: pack === "G",
    profesionistaCedula: pack === "A",
  };
}

export function buildSaludSubDeltas(catalogRows) {
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
