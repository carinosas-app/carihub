/**
 * Genera public/js/data/registro-profesionales-blocks.js desde plantilla salud.
 * Uso: node scripts/generate-profesionales-blocks.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SUB_TO_PACK } from "./profesionales-packs-v1.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const MODALIDAD = [
  "{ value: 'consultorio', label: 'Consultorio / oficina' }",
  "{ value: 'videollamada', label: 'Videollamada' }",
  "{ value: 'hibrido', label: 'Presencial y en línea' }",
  "{ value: 'visita_cliente', label: 'Visita al cliente' }",
].join(",\n        ");

const UNIDAD = [
  "{ value: 'por_consulta', label: 'Por consulta' }",
  "{ value: 'por_hora', label: 'Por hora' }",
  "{ value: 'por_proyecto', label: 'Por proyecto' }",
  "{ value: 'por_mes', label: 'Por mes' }",
].join(",\n        ");

const ANOS = [
  "{ value: '1_3', label: '1–3 años' }",
  "{ value: '4_7', label: '4–7 años' }",
  "{ value: '8_15', label: '8–15 años' }",
  "{ value: '16_mas', label: '16+ años' }",
].join(",\n        ");

const TAMANO_EQUIPO = [
  "{ value: 'individual', label: 'Profesional individual' }",
  "{ value: 'pequeno_2_5', label: 'Equipo pequeño (2–5)' }",
  "{ value: 'mediano_6_15', label: 'Equipo mediano (6–15)' }",
  "{ value: 'grande_16_mas', label: 'Equipo grande (16+)' }",
].join(",\n        ");

const subToPackStr = Object.entries(SUB_TO_PACK)
  .map(([k, v]) => `    '${k}': '${v}'`)
  .join(",\n");

let out = fs.readFileSync(path.join(root, "public/js/data/registro-salud-blocks.js"), "utf8");

out = out
  .replace(/Salud/g, "Profesionales")
  .replace(/salud/g, "profesionales")
  .replace(/MP-SALUD-DELTAS-V1/g, "MP-PROFESIONALES-DELTAS-V1")
  .replace(/ui_prof_salud/g, "ui_prof_legal")
  .replace(/ui_ind_salud_auxiliar/g, "ui_ind_profesional")
  .replace(/MODALIDAD_CLINICA/g, "MODALIDAD_PROF")
  .replace(/MODALIDAD_CON_VISITA/g, "MODALIDAD_PROF");

out = out.replace(/var SUB_TO_PACK = \{[\s\S]*?\};/, `var SUB_TO_PACK = {\n${subToPackStr}\n  };`);

out = out.replace(
  /function packBlocksA\(\) \{[\s\S]*?\n  \}/,
  `function packBlocksA() {
    return [{
      id: 'packA_cedula',
      title: 'Profesionista con cédula',
      hint: 'Datos públicos — cédula se valida en sección privada.',
      fields: [
        { id: 'nombreProfesional', label: 'Nombre profesional público', type: 'text', required: true },
        { id: 'especialidadProfesional', label: 'Especialidad o área principal', type: 'text', required: true },
        { id: 'serviciosProfesionales', label: 'Servicios profesionales', type: 'checklist', required: true, options: ['Consulta', 'Asesoría', 'Dictamen', 'Representación', 'Proyecto', 'Otro'] },
        { id: 'modalidadAtencionProfesional', label: 'Modalidad de atención', type: 'select', required: true, options: [${MODALIDAD}] },
        { id: 'precioConsulta', label: 'Tarifa / honorarios desde (MXN)', type: 'text', required: true },
        { id: 'unidadConsulta', label: 'Unidad de cobro', type: 'select', required: false, options: [${UNIDAD}] },
        { id: 'horarioAtencion', label: 'Horario de atención', type: 'text', required: true },
        { id: 'anosExperienciaProfesional', label: 'Años de experiencia', type: 'select', required: false, options: [${ANOS}] }
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
  "packB_despacho",
  "Despacho / firma profesional",
  "Servicios del despacho — áreas y equipo.",
  `{ id: 'serviciosDespacho', label: 'Servicios del despacho', type: 'checklist', required: true, options: ['Consulta', 'Litigio', 'Contratos', 'Asesoría corporativa', 'Due diligence', 'Otro'] },
        { id: 'areasPracticaDespacho', label: 'Áreas de práctica', type: 'checklist', required: true, options: ['Civil', 'Penal', 'Laboral', 'Mercantil', 'Fiscal', 'Familiar', 'Otro'] },
        { id: 'tamanoEquipoDespacho', label: 'Tamaño del equipo', type: 'select', required: true, options: [${TAMANO_EQUIPO}] },
        { id: 'modalidadAtencionProfesional', label: 'Modalidad de atención', type: 'select', required: true, options: [${MODALIDAD}] }`
);

replacePack(
  "packBlocksC",
  "packC_fiscal",
  "Legal, fiscal y trámites",
  "Servicios fiscales, legales o gestión.",
  `{ id: 'serviciosFiscalesLegales', label: 'Servicios fiscales / legales', type: 'checklist', required: true, options: ['Declaraciones', 'Contabilidad', 'Auditoría', 'Trámites', 'Notaría', 'Correduría', 'Otro'] },
        { id: 'tiposClientesProfesionales', label: 'Tipos de clientes', type: 'checklist', required: false, options: ['Personas físicas', 'PyME', 'Corporativo', 'Gobierno', 'Otro'] },
        { id: 'modalidadAtencionProfesional', label: 'Modalidad de atención', type: 'select', required: true, options: [${MODALIDAD}] }`
);

replacePack(
  "packBlocksD",
  "packD_tecnico",
  "Arquitectura y servicios técnicos",
  "Especialidad técnica y entregables.",
  `{ id: 'especialidadTecnica', label: 'Especialidad técnica', type: 'checklist', required: true, options: ['Arquitectura', 'Ingeniería civil', 'Topografía', 'Avalúos', 'Peritaje', 'Otro'] },
        { id: 'serviciosTecnicos', label: 'Servicios técnicos', type: 'checklist', required: true, options: ['Proyecto ejecutivo', 'Supervisión', 'Dictamen', 'Levantamiento', 'Inspección', 'Otro'] },
        { id: 'modalidadAtencionProfesional', label: 'Modalidad de atención', type: 'select', required: true, options: [${MODALIDAD}] },
        { id: 'softwareHerramientas', label: 'Software / herramientas (opcional)', type: 'text', required: false, placeholder: 'Ej. AutoCAD, Revit' }`
);

replacePack(
  "packBlocksE",
  "packE_consultoria",
  "Consultoría y recursos humanos",
  "Áreas de consultoría e industrias.",
  `{ id: 'areasConsultoria', label: 'Áreas de consultoría', type: 'checklist', required: true, options: ['Estrategia', 'Finanzas', 'RH', 'Operaciones', 'Transformación', 'Otro'] },
        { id: 'serviciosConsultoria', label: 'Servicios de consultoría', type: 'checklist', required: true, options: ['Diagnóstico', 'Implementación', 'Capacitación', 'Coaching', 'Reclutamiento', 'Otro'] },
        { id: 'modalidadAtencionProfesional', label: 'Modalidad de atención', type: 'select', required: true, options: [${MODALIDAD}] },
        { id: 'industriasAtendidas', label: 'Industrias atendidas', type: 'checklist', required: false, options: ['Manufactura', 'Retail', 'Tecnología', 'Salud', 'Construcción', 'Otro'] }`
);

replacePack(
  "packBlocksF",
  "packF_creativo",
  "Creativo, marketing y comunicación",
  "Servicios creativos — incluye portafolio si aplica.",
  `{ id: 'serviciosCreativos', label: 'Servicios creativos', type: 'checklist', required: true, options: ['Branding', 'Diseño gráfico', 'Video', 'Foto', 'Redes sociales', 'PR', 'Otro'] },
        { id: 'especialidadCreativa', label: 'Especialidad creativa', type: 'checklist', required: true, options: ['Identidad visual', 'Packaging', 'Motion', 'Editorial', 'UX/UI', 'Otro'] },
        { id: 'modalidadAtencionProfesional', label: 'Modalidad de atención', type: 'select', required: true, options: [${MODALIDAD}] },
        { id: 'portfolioURL', label: 'Portafolio (URL opcional)', type: 'url', required: false, placeholder: 'https://' }`
);

out = out.replace(
  /function packBlocksG\(isFunerario\) \{[\s\S]*?\n  \}/,
  `function packBlocksG() {
    return [{
      id: 'packG_finanzas',
      title: 'Seguros, finanzas y comercio',
      fields: [
        { id: 'serviciosFinancieros', label: 'Servicios financieros / comerciales', type: 'checklist', required: true, options: ['Seguros', 'Inversiones', 'Patrimonio', 'Comercio exterior', 'Certificaciones', 'Consultoría ambiental', 'Otro'] },
        { id: 'tiposClientesProfesionales', label: 'Tipos de clientes', type: 'checklist', required: false, options: ['Personas físicas', 'PyME', 'Corporativo', 'Otro'] },
        { id: 'modalidadAtencionProfesional', label: 'Modalidad de atención', type: 'select', required: true, options: [${MODALIDAD}] }
      ]
    }];
  }`
);

replacePack(
  "packBlocksH",
  "packH_empresa",
  "Negocio / empresa profesional",
  "Datos del establecimiento — servicios y especialidades.",
  `{ id: 'serviciosEmpresariales', label: 'Servicios empresariales', type: 'checklist', required: true, options: ['Consultoría', 'Capacitación', 'Marketing', 'Logística', 'Protección civil', 'RSE', 'Diseño industrial', 'Otro'] },
        { id: 'especialidadesEmpresa', label: 'Especialidades de la empresa', type: 'text', required: true, placeholder: 'Ej. Consultoría estratégica, capacitación' },
        { id: 'tamanoEmpresaAtendida', label: 'Tamaño de empresas atendidas', type: 'checklist', required: false, options: ['PyME', 'Mediana', 'Corporativo', 'Startup', 'Otro'] }`
);

out = out.replace(/title: 'Perfil de profesionales'/g, "title: 'Perfil profesional'");
out = out.replace(/title: 'Establecimiento de profesionales'/g, "title: 'Empresa de servicios profesionales'");

out = out.replace(
  /var PACK_OBLIGATORIOS = \{[\s\S]*?\};/,
  `var PACK_OBLIGATORIOS = {
    A: ['nombreProfesional', 'especialidadProfesional', 'serviciosProfesionales', 'modalidadAtencionProfesional', 'precioConsulta', 'horarioAtencion'],
    B: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'serviciosDespacho', 'areasPracticaDespacho', 'tamanoEquipoDespacho', 'modalidadAtencionProfesional'],
    C: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'serviciosFiscalesLegales', 'modalidadAtencionProfesional'],
    D: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'especialidadTecnica', 'serviciosTecnicos', 'modalidadAtencionProfesional'],
    E: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'areasConsultoria', 'serviciosConsultoria', 'modalidadAtencionProfesional'],
    F: ['alias', 'tarifaDesde', 'horarioDetalle', 'serviciosCreativos', 'especialidadCreativa', 'modalidadAtencionProfesional'],
    G: ['alias', 'certificaciones', 'tarifaDesde', 'horarioDetalle', 'serviciosFinancieros', 'modalidadAtencionProfesional'],
    H: ['nombreComercial', 'serviciosEmpresariales', 'especialidadesEmpresa', 'direccion', 'horarioDetalle']
  };`
);

out = out.replace(
  /if \(pack === 'F' \|\| pack === 'G'\) return 'negocio_empresa';/,
  "if (pack === 'H') return 'negocio_empresa';"
);

out = out.replace(
  /if \(pack === 'A'\) \{[\s\S]*?\} else if \(pack === 'F' \|\| pack === 'G'\)/,
  `if (pack === 'A') {
      blocks = packBlocksA();
    } else if (pack === 'H')`
);

out = out.replace(
  /uiIds: pack === 'A' \? \['ui_prof_legal'\] : \(pack === 'F' \|\| pack === 'G' \? \['ui_neg_profesional'\] : \['ui_ind_profesional'\]\)/,
  "uiIds: pack === 'A' ? ['ui_prof_legal'] : (pack === 'H' ? ['ui_neg_profesional'] : ['ui_ind_profesional'])"
);

out = out.replace(
  /fotosMin: pack === 'A' \? 2 : \(pack === 'G' \? 3 : 2\)/,
  "fotosMin: pack === 'A' ? 2 : (pack === 'H' ? 3 : 2)"
);

out = out.replace(
  /function appendPackBlocks\(pack, canonId\) \{[\s\S]*?\n  \}/,
  `function appendPackBlocks(pack) {
    var fn = PACK_BUILDERS[pack] || packBlocksB;
    return fn();
  }`
);

out = out.replace(
  /global\.CARIHUB_REGISTRO_SALUD_SECTOR_BLOCKS/g,
  "global.CARIHUB_REGISTRO_PROFESIONALES_SECTOR_BLOCKS"
);

out = out.replace(
  /global\.CARIHUB_SALUD_SUB_CANON_META/g,
  "global.CARIHUB_PROFESIONALES_SUB_CANON_META"
);

out = out.replace(
  /global\.CARIHUB_SALUD_SUB_DELTAS/g,
  "global.CARIHUB_PROFESIONALES_SUB_DELTAS"
);

const outPath = path.join(root, "public/js/data/registro-profesionales-blocks.js");
fs.writeFileSync(outPath, out, "utf8");
console.log("Wrote", outPath);
