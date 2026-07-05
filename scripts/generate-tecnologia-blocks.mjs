/**
 * Genera public/js/data/registro-tecnologia-blocks.js desde plantilla profesionales.
 * Uso: node scripts/generate-tecnologia-blocks.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SUB_TO_PACK, PACK_NEGOCIO_SUBS } from "./tecnologia-packs-v1.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const MODALIDAD = [
  "{ value: 'remoto', label: '100% remoto / en línea' }",
  "{ value: 'presencial', label: 'Presencial en oficina o taller' }",
  "{ value: 'hibrido', label: 'Remoto y presencial' }",
  "{ value: 'visita_cliente', label: 'Visita al cliente / sitio' }",
  "{ value: 'domicilio', label: 'Servicio a domicilio' }",
].join(",\n        ");

const ANOS = [
  "{ value: '1_3', label: '1–3 años' }",
  "{ value: '4_7', label: '4–7 años' }",
  "{ value: '8_15', label: '8–15 años' }",
  "{ value: '16_mas', label: '16+ años' }",
].join(",\n        ");

const TIEMPO_SOPORTE = [
  "{ value: 'mismo_dia', label: 'Mismo día' }",
  "{ value: '24h', label: 'Dentro de 24 horas' }",
  "{ value: '48h', label: '24–48 horas' }",
  "{ value: 'por_cita', label: 'Con cita programada' }",
  "{ value: 'sla_contrato', label: 'Según SLA / contrato' }",
].join(",\n        ");

const subToPackStr = Object.entries(SUB_TO_PACK)
  .map(([k, v]) => `    '${k}': '${v}'`)
  .join(",\n");

const negocioSubsStr = [...PACK_NEGOCIO_SUBS].map((s) => `'${s}'`).join(", ");

let out = fs.readFileSync(path.join(root, "public/js/data/registro-profesionales-blocks.js"), "utf8");

out = out
  .replace(/Profesionales/g, "Tecnologia")
  .replace(/profesionales/g, "tecnologia")
  .replace(/MP-PROFESIONALES-DELTAS-V1/g, "MP-TECNOLOGIA-DELTAS-V1")
  .replace(/ui_prof_legal/g, "ui_ind_tecnologia")
  .replace(/ui_ind_salud_auxiliar/g, "ui_ind_tecnologia")
  .replace(/ui_neg_servicios_local/g, "ui_neg_tecnologia")
  .replace(/MODALIDAD_PROF/g, "MODALIDAD_TI")
  .replace(/modalidadAtencionProfesional/g, "modalidadServicioTI")
  .replace(/profesionalesPerfil/g, "tecnologiaPerfil")
  .replace(/requiresCedula: true, nivelRevisionAdmin: 'alta'/g, "requiresCedula: false")
  .replace(/profesionales_pack_/g, "tecnologia_pack_");

out = out.replace(/var SUB_TO_PACK = \{[\s\S]*?\};/, `var SUB_TO_PACK = {\n${subToPackStr}\n  };`);

out = out.replace(
  /function packBlocksA\(\) \{[\s\S]*?\n  \}/,
  `function packBlocksA() {
    return [{
      id: 'packA_dev',
      title: 'Desarrollo profesional',
      hint: 'Stack, servicios y modalidad — incluye portafolio si aplica.',
      fields: [
        { id: 'stackTecnologico', label: 'Stack / tecnologías principales', type: 'checklist', required: true, options: ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Otro'] },
        { id: 'serviciosDesarrollo', label: 'Servicios de desarrollo', type: 'checklist', required: true, options: ['Desarrollo a medida', 'APIs', 'Mantenimiento', 'MVP', 'Otro'] },
        { id: 'modalidadServicioTI', label: 'Modalidad de servicio', type: 'select', required: true, options: [${MODALIDAD}] },
        { id: 'lenguajesFrameworks', label: 'Lenguajes y frameworks', type: 'text', required: false, placeholder: 'Ej. React, Node, PostgreSQL' },
        { id: 'tipoProyectosDev', label: 'Tipos de proyecto', type: 'checklist', required: false, options: ['Web', 'Mobile', 'Backend', 'SaaS', 'Otro'] },
        { id: 'anosExperienciaTI', label: 'Años de experiencia', type: 'select', required: false, options: [${ANOS}] },
        { id: 'portfolioURL', label: 'Portafolio (URL)', type: 'url', required: false, placeholder: 'https://' }
      ]
    }];
  }`
);

function replacePack(fnName, id, title, hint, fieldsLines) {
  out = out.replace(
    new RegExp(`function ${fnName}\\(\\) \\{[\\s\\S]*?\\n  \\}`),
    `function ${fnName}() {
    return [{
      id: '${id}',
      title: '${title}',
      hint: '${hint}',
      fields: [
        ${fieldsLines}
      ]
    }];
  }`
  );
}

replacePack(
  "packBlocksB",
  "packB_soporte",
  "Soporte y reparación",
  "Servicios de soporte, reparación y cobertura.",
  `{ id: 'serviciosSoporteTI', label: 'Servicios de soporte TI', type: 'checklist', required: true, options: ['Soporte remoto', 'Soporte presencial', 'Instalación', 'Backup', 'Recuperación de datos', 'Otro'] },
        { id: 'tiposEquipoSoporte', label: 'Equipos que atiendes', type: 'checklist', required: true, options: ['PC Windows', 'Mac', 'Laptop', 'Servidor', 'Impresora', 'Red', 'Otro'] },
        { id: 'serviciosReparacion', label: 'Reparaciones y mantenimiento', type: 'checklist', required: false, options: ['Diagnóstico', 'Formateo', 'Cambio SSD/RAM', 'Limpieza', 'Malware', 'Otro'] },
        { id: 'modalidadServicioTI', label: 'Modalidad de servicio', type: 'select', required: true, options: [${MODALIDAD}] },
        { id: 'tiempoRespuestaSoporte', label: 'Tiempo de respuesta', type: 'select', required: true, options: [${TIEMPO_SOPORTE}] },
        { id: 'tiposClientesSoporte', label: 'Tipos de clientes', type: 'checklist', required: false, options: ['Personas', 'PyME', 'Corporativo', 'Otro'] },
        { id: 'garantiaServicio', label: 'Garantía del servicio', type: 'text', required: false, placeholder: 'Ej. 30 días mano de obra' }`
);

replacePack(
  "packBlocksC",
  "packC_marketing",
  "Marketing digital",
  "Servicios y canales de marketing digital.",
  `{ id: 'serviciosMarketingDigital', label: 'Servicios de marketing digital', type: 'checklist', required: true, options: ['SEO', 'SEM', 'Social media', 'Email marketing', 'Contenido', 'Otro'] },
        { id: 'canalesMarketing', label: 'Canales que manejas', type: 'checklist', required: true, options: ['Google', 'Meta', 'TikTok', 'LinkedIn', 'YouTube', 'Otro'] },
        { id: 'especialidadMarketing', label: 'Especialidad', type: 'checklist', required: false, options: ['B2B', 'B2C', 'E-commerce', 'Local', 'Otro'] },
        { id: 'modalidadServicioTI', label: 'Modalidad de servicio', type: 'select', required: true, options: [${MODALIDAD}] },
        { id: 'herramientasMarketing', label: 'Herramientas / plataformas', type: 'text', required: false, placeholder: 'Ej. Google Analytics, HubSpot' },
        { id: 'portfolioURL', label: 'Portafolio (URL)', type: 'url', required: false, placeholder: 'https://' }`
);

replacePack(
  "packBlocksD",
  "packD_consultoria",
  "Consultoría y ciberseguridad",
  "Áreas de consultoría TI y servicios de seguridad.",
  `{ id: 'areasConsultoriaTI', label: 'Áreas de consultoría TI', type: 'checklist', required: true, options: ['Infraestructura', 'Nube', 'Seguridad', 'Redes', 'Transformación digital', 'Otro'] },
        { id: 'serviciosConsultoriaTI', label: 'Servicios de consultoría', type: 'checklist', required: true, options: ['Diagnóstico', 'Roadmap', 'Implementación', 'Capacitación', 'Auditoría', 'Otro'] },
        { id: 'serviciosCiberseguridad', label: 'Servicios de ciberseguridad', type: 'checklist', required: false, options: ['Pentesting', 'Vulnerabilidades', 'Hardening', 'SOC', 'Awareness', 'Otro'] },
        { id: 'modalidadServicioTI', label: 'Modalidad de servicio', type: 'select', required: true, options: [${MODALIDAD}] },
        { id: 'certificacionesSeguridad', label: 'Certificaciones de seguridad', type: 'checklist', required: false, options: ['CEH', 'OSCP', 'Security+', 'ISO 27001', 'Otro'] },
        { id: 'industriasAtendidas', label: 'Industrias atendidas', type: 'checklist', required: false, options: ['Retail', 'Manufactura', 'Servicios', 'Salud', 'Finanzas', 'Otro'] }`
);

replacePack(
  "packBlocksE",
  "packE_negocio",
  "Negocio / agencia TI",
  "Datos del establecimiento — servicios y especialidades.",
  `{ id: 'serviciosEmpresaTI', label: 'Servicios de la empresa', type: 'checklist', required: true, options: ['Marketing digital', 'Desarrollo', 'Soporte TI', 'Hosting', 'Venta equipos', 'Otro'] },
        { id: 'especialidadesEmpresaTI', label: 'Especialidades de la empresa', type: 'text', required: true, placeholder: 'Ej. Agencia SEO B2B, soporte empresarial' },
        { id: 'tamanoEmpresaAtendida', label: 'Tamaño de clientes atendidos', type: 'checklist', required: false, options: ['PyME', 'Mediana', 'Corporativo', 'Startup', 'Otro'] }`
);

replacePack(
  "packBlocksF",
  "packF_creative",
  "Creativo e infraestructura",
  "Diseño, audiovisual, cloud o telecom.",
  `{ id: 'serviciosCreativosTI', label: 'Servicios creativos / audiovisual', type: 'checklist', required: true, options: ['Diseño gráfico', 'UX/UI', 'Video', 'Motion', 'Branding', 'Otro'] },
        { id: 'especialidadCreativaTI', label: 'Especialidad creativa', type: 'checklist', required: true, options: ['Digital', 'Editorial', 'Producto', 'Motion', 'Infraestructura', 'Otro'] },
        { id: 'modalidadServicioTI', label: 'Modalidad de servicio', type: 'select', required: true, options: [${MODALIDAD}] },
        { id: 'serviciosInfraTI', label: 'Servicios de infraestructura', type: 'checklist', required: false, options: ['Hosting', 'Cloud', 'Redes', 'Dominios', 'DevOps', 'Otro'] },
        { id: 'plataformasInfra', label: 'Plataformas / proveedores', type: 'checklist', required: false, options: ['AWS', 'Azure', 'Google Cloud', 'cPanel', 'Cisco', 'Otro'] },
        { id: 'portfolioURL', label: 'Portafolio (URL)', type: 'url', required: false, placeholder: 'https://' },
        { id: 'softwareHerramientas', label: 'Software / herramientas', type: 'text', required: false, placeholder: 'Ej. Figma, Adobe, DaVinci' }`
);

out = out.replace(
  /function packBlocksG\(\) \{[\s\S]*?\n  \}/,
  ""
);

out = out.replace(
  /function packBlocksH\(\) \{[\s\S]*?\n  \}/,
  ""
);

out = out.replace(
  /var PACK_BUILDERS = \{[\s\S]*?\};/,
  `var PACK_BUILDERS = {
    A: packBlocksA,
    B: packBlocksB,
    C: packBlocksC,
    D: packBlocksD,
    E: packBlocksE,
    F: packBlocksF
  };`
);

out = out.replace(
  /var PACK_OBLIGATORIOS = \{[\s\S]*?\};/,
  `var PACK_OBLIGATORIOS = {
    A: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'stackTecnologico', 'serviciosDesarrollo', 'modalidadServicioTI'],
    B: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'serviciosSoporteTI', 'tiposEquipoSoporte', 'modalidadServicioTI', 'coberturaGeografica', 'tiempoRespuestaSoporte'],
    C: ['alias', 'tarifaDesde', 'horarioDetalle', 'serviciosMarketingDigital', 'canalesMarketing', 'modalidadServicioTI'],
    D: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'areasConsultoriaTI', 'serviciosConsultoriaTI', 'modalidadServicioTI'],
    E: ['nombreComercial', 'serviciosEmpresaTI', 'especialidadesEmpresaTI', 'direccion', 'horarioDetalle'],
    F: ['alias', 'tarifaDesde', 'horarioDetalle', 'serviciosCreativosTI', 'especialidadCreativaTI', 'modalidadServicioTI']
  };`
);

out = out.replace(
  /function personaBaseBlocks\(\) \{[\s\S]*?\n  \}/,
  `function personaBaseBlocks() {
    return [{
      id: 'tecnologiaBase',
      title: 'Perfil tecnología',
      fields: [
        { id: 'alias', label: 'Nombre público', type: 'text', required: true },
        { id: 'tagline', label: 'Frase corta', type: 'text', required: false, maxLength: 100 },
        {
          id: 'certificaciones',
          label: 'Certificaciones / formación',
          type: 'textarea',
          required: true,
          rows: 2,
          placeholder: 'Certificaciones, cursos o experiencia relevante'
        }
      ]
    }, {
      id: 'tecnologiaTarifaHorario',
      title: 'Tarifa y horario',
      fields: [
        { id: 'tarifaDesde', label: 'Tarifa desde (MXN)', type: 'text', required: true },
        { id: 'horarioDetalle', label: 'Horario de atención', type: 'text', required: true }
      ]
    }];
  }`
);

out = out.replace(
  /function negocioBaseBlocks\(\) \{[\s\S]*?\n  \}/,
  `function negocioBaseBlocks() {
    return [{
      id: 'tecnologiaNegocioBase',
      title: 'Empresa de tecnología',
      fields: [
        { id: 'nombreComercial', label: 'Nombre comercial', type: 'text', required: true },
        { id: 'tagline', label: 'Frase corta', type: 'text', required: false, maxLength: 100 },
        { id: 'direccion', label: 'Dirección o zona pública', type: 'textarea', required: true, rows: 2 },
        { id: 'horarioDetalle', label: 'Horario', type: 'text', required: true }
      ]
    }];
  }`
);

out = out.replace(
  /var MODALIDAD_TI = \[[\s\S]*?\];/,
  `var MODALIDAD_TI = [
    { value: 'remoto', label: '100% remoto / en línea' },
    { value: 'presencial', label: 'Presencial en oficina o taller' },
    { value: 'hibrido', label: 'Remoto y presencial' },
    { value: 'visita_cliente', label: 'Visita al cliente / sitio' },
    { value: 'domicilio', label: 'Servicio a domicilio' }
  ];`
);

out = out.replace(
  /var ANOS_EXPERIENCIA = \[[\s\S]*?\];/,
  `var ANOS_EXPERIENCIA_TI = [
    { value: '1_3', label: '1–3 años' },
    { value: '4_7', label: '4–7 años' },
    { value: '8_15', label: '8–15 años' },
    { value: '16_mas', label: '16+ años' }
  ];`
);

out = out.replace(/ANOS_EXPERIENCIA/g, "ANOS_EXPERIENCIA_TI");

out = out.replace(
  /var FIELD_LABELS = \{[\s\S]*?\};/,
  `var FIELD_LABELS = {
    modalidadServicioTI: 'Modalidad de servicio',
    stackTecnologico: 'Stack / tecnologías principales',
    lenguajesFrameworks: 'Lenguajes y frameworks',
    serviciosDesarrollo: 'Servicios de desarrollo',
    tipoProyectosDev: 'Tipos de proyecto',
    serviciosSoporteTI: 'Servicios de soporte TI',
    tiposEquipoSoporte: 'Equipos que atiendes',
    serviciosReparacion: 'Reparaciones y mantenimiento',
    tiempoRespuestaSoporte: 'Tiempo de respuesta',
    tiposClientesSoporte: 'Tipos de clientes',
    garantiaServicio: 'Garantía del servicio',
    serviciosMarketingDigital: 'Servicios de marketing digital',
    canalesMarketing: 'Canales que manejas',
    especialidadMarketing: 'Especialidad',
    herramientasMarketing: 'Herramientas / plataformas',
    areasConsultoriaTI: 'Áreas de consultoría TI',
    serviciosConsultoriaTI: 'Servicios de consultoría',
    serviciosCiberseguridad: 'Servicios de ciberseguridad',
    certificacionesSeguridad: 'Certificaciones de seguridad',
    serviciosEmpresaTI: 'Servicios de la empresa',
    especialidadesEmpresaTI: 'Especialidades de la empresa',
    tamanoEmpresaAtendida: 'Tamaño de clientes atendidos',
    serviciosCreativosTI: 'Servicios creativos / audiovisual',
    especialidadCreativaTI: 'Especialidad creativa',
    plataformasInfra: 'Plataformas / proveedores',
    serviciosInfraTI: 'Servicios de infraestructura',
    softwareHerramientas: 'Software / herramientas',
    portfolioURL: 'Portafolio (URL)',
    anosExperienciaTI: 'Años de experiencia',
    industriasAtendidas: 'Industrias atendidas',
    diferenciadorProfesional: 'Tu sello profesional',
    coberturaGeografica: 'Zona de atención',
    tiempoRespuestaConsulta: 'Tiempo de respuesta a consultas',
    colaboracionesComerciales: '¿Colaboras con otros profesionales o negocios?',
    tiposColaboracionComercial: 'Tipo de colaboraciones'
  };`
);

out = out.replace(
  /if \(fieldId === 'modalidadServicioTI'\)/,
  "if (fieldId === 'modalidadServicioTI')"
);

out = out.replace(
  /if \(fieldId === 'anosExperienciaProfesional'\)/,
  "if (fieldId === 'anosExperienciaTI')"
);

out = out.replace(
  /global\.CARIHUB_REGISTRO_PROFESIONALES_SECTOR_BLOCKS/g,
  "global.CARIHUB_REGISTRO_TECNOLOGIA_SECTOR_BLOCKS"
);

out = out.replace(
  /global\.CARIHUB_PROFESIONALES_SUB_CANON_META/g,
  "global.CARIHUB_TECNOLOGIA_SUB_CANON_META"
);

out = out.replace(
  /global\.CARIHUB_PROFESIONALES_SUB_DELTAS/g,
  "global.CARIHUB_TECNOLOGIA_SUB_DELTAS"
);

out = out.replace(/sectorId: 'profesionales'/g, "sectorId: 'tecnologia'");
out = out.replace(/id: 'profesionales_sector_packs'/g, "id: 'tecnologia_sector_packs'");

out = out.replace(
  /function mergeObligatoriosFromDelta\(packOblig, subId\) \{/,
  `var NEGOCIO_SUBS = new Set([${negocioSubsStr}]);

  function isNegocioSub(subId) {
    return NEGOCIO_SUBS.has(slugSubId(subId));
  }

  function mergeObligatoriosFromDelta(packOblig, subId) {`
);

out = out.replace(
  /function inferFormularioId\(pack, ctx\) \{[\s\S]*?return 'persona_independiente';\s*\}/,
  `function inferFormularioId(pack, ctx) {
    if (ctx && ctx.formularioId) return ctx.formularioId;
    var subId = slugSubId((ctx && ctx.subcategoriaId) || (ctx && ctx.subcategoria) || '');
    if (isNegocioSub(subId)) return 'negocio_empresa';
    return 'persona_independiente';
  }`
);

out = out.replace(
  /function buildConfig\(ctx\) \{[\s\S]*?packFlags:[\s\S]*?\}\s*\}/,
  `function buildConfig(ctx) {
    ctx = ctx || {};
    var canonId = resolveCanonSubId(ctx.subcategoriaId || ctx.subcategoria || '');
    var pack = resolvePack(canonId);
    var formularioId = inferFormularioId(pack, ctx);
    var blocks;
    if (isNegocioSub(canonId)) {
      blocks = negocioBaseBlocks().concat(appendPackBlocks(pack));
    } else {
      blocks = personaBaseBlocks().concat(appendPackBlocks(pack));
    }
    blocks = applySubDeltaToBlocks(blocks, canonId);
    return {
      id: 'tecnologia_pack_' + pack.toLowerCase(),
      deltaPack: pack,
      canonSubcategoriaId: canonId,
      sectorId: 'tecnologia',
      formularioId: formularioId,
      uiIds: isNegocioSub(canonId) ? ['ui_neg_tecnologia'] : ['ui_ind_tecnologia'],
      fotosMin: isNegocioSub(canonId) ? 3 : 2,
      obligatorios: mergeObligatoriosFromDelta(PACK_OBLIGATORIOS[pack] || PACK_OBLIGATORIOS.B, canonId),
      blocks: blocks,
      nestedProfileKey: 'tecnologiaPerfil',
      packFlags: {}
    };
  }`
);

const outPath = path.join(root, "public/js/data/registro-tecnologia-blocks.js");
fs.writeFileSync(outPath, out, "utf8");
console.log("Wrote", outPath);
