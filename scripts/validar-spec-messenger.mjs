#!/usr/bin/env node
/**
 * Auditoría consistencia SPEC Messenger v1.0.0 — solo diseño, post OB-MSG.
 * Uso: node scripts/validar-spec-messenger.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = __dirname;

function loadJson(rel) {
  const p = join(root, rel);
  if (!existsSync(p)) return { error: `archivo no existe: ${rel}` };
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch (e) {
    return { error: `JSON inválido ${rel}: ${e.message}` };
  }
}

const checks = [];
function check(id, ok, detail) {
  checks.push({ id, ok, detail });
}

const spec = loadJson("SPEC-MESSENGER.json");
const fixtures = loadJson("fixtures-messenger-golden.json");
const fanout = loadJson("registry-messenger-fanout-propuesta.json");
const acta = loadJson("ACTA-CONGELAMIENTO-MESSENGER.json");
const anexo = loadJson("ANEXO-MESSENGER-INTEGRACION-DASHBOARDS.json");
const propuestaVE = loadJson("PROPUESTA-ACTA-MINOR-VALIDATIONENGINE-MESSENGER.json");
const ve = loadJson("SPEC-VALIDATIONENGINE.json");
const auditFinal = loadJson("AUDITORIA-FINAL-SPEC-MESSENGER.json");

if (spec.error) {
  console.error(spec.error);
  process.exit(1);
}

const estados = spec.estadosConversacion?.valores || [];
const catalogo = spec.integracionValidationEngine?.accionesCatalogo || [];
const fanoutKeys = Object.keys(fanout.acciones || {});

check("MSG01_spec_version", spec.versionSpec === "1.0.0", spec.versionSpec);
check(
  "MSG02_estado_congelado",
  spec.estado === "CONGELADO",
  spec.estado
);
check(
  "MSG03_implementacion_false",
  spec.implementacionAutorizada === false,
  String(spec.implementacionAutorizada)
);
check(
  "MSG04_ob_msg_checklist",
  ["OB-MSG-1", "OB-MSG-2", "OB-MSG-3", "OB-MSG-4", "OB-MSG-5", "OB-MSG-6", "OB-MSG-7", "OB-MSG-8"].every(
    (id) => spec.ajustesObligatoriosCerrados?.[id] === "CERRADO"
  ),
  JSON.stringify(spec.ajustesObligatoriosCerrados)
);
check(
  "MSG05_sin_solicitud_aceptada_global",
  !estados.includes("solicitud_aceptada") && !estados.includes("archivada"),
  estados.join(",")
);
check(
  "MSG06_meta_canonica",
  spec.modeloDatos?.conversacionesMeta?.fuenteCanonicaPreferenciasLocales === true,
  "meta"
);
check(
  "MSG07_conversacion_iniciar_bifurcado",
  !!spec.conversacionIniciar?.bifurcacion?.directa && !!spec.conversacionIniciar?.bifurcacion?.solicitud,
  "bifurcacion"
);
check(
  "MSG08_conversacion_id_algoritmo",
  !!spec.modeloDatos?.conversacionId?.algoritmo,
  spec.modeloDatos?.conversacionId?.algoritmo
);
check(
  "MSG09_fanout_variantes_iniciar",
  fanoutKeys.includes("conversacion_iniciar_directa") && fanoutKeys.includes("conversacion_iniciar_solicitud"),
  fanoutKeys.filter((k) => k.includes("iniciar")).join(",")
);
check(
  "MSG10_fanout_cobertura",
  (fanout.cobertura?.entradasRegistry || 0) >= 23,
  `registry=${fanout.cobertura?.entradasRegistry}`
);
check(
  "MSG11_admin_automatizaciones_suspendir",
  catalogo.includes("admin_automatizaciones_suspendir"),
  "catalogo"
);
check(
  "MSG12_telefono_gate_documentado",
  !!spec.integracionValidationEngine?.gatesMessengerValidateStates?.telefonoVerificado,
  "telefono"
);
check(
  "MSG13_spam_score_canonico",
  spec.antiSpam?.spamScore?.campoCanonico === "usuarios.mensajeria.spamScore",
  spec.antiSpam?.spamScore?.campoCanonico
);
check(
  "MSG14_anexo_dashboards",
  !anexo.error && anexo.obMSG === "OB-MSG-7",
  anexo.error || anexo.obMSG
);
check(
  "MSG15_ve_minor_telefono",
  (propuestaVE.cambiosPropuestos || []).some((c) => c.id === "VE-MINOR-05"),
  "VE-MINOR-05"
);
check(
  "MSG16_fixtures_count",
  !fixtures.error && fixtures.fixtures?.length >= 28,
  fixtures.error || `fixtures=${fixtures.fixtures?.length}`
);
check(
  "MSG17_fixture_m25_directa",
  fixtures.fixtures?.some((f) => f.id === "M25_conversacion_iniciar_directa_empresa"),
  "M25"
);
check(
  "MSG18_acta_ob_pendiente_cerrado",
  !acta.error &&
    acta.auditoriaFinalPreCongelamiento?.ajustesObligatoriosPreAprobacion?.estado === "CERRADOS",
  acta.error || acta.auditoriaFinalPreCongelamiento?.ajustesObligatoriosPreAprobacion?.estado
);
check(
  "MSG19_acta_congelado",
  acta.estadoActa === "CONGELADO" && acta.estado === "CONGELADO",
  acta.estadoActa
);
check(
  "MSG20_ve_no_modificado",
  !ve.error && ve.estado === "CONGELADO",
  ve.error || ve.estado
);
check(
  "MSG21_congelamiento_aprobado",
  spec.veredictoCongelamiento?.recomendacion === "CONGELADO",
  spec.veredictoCongelamiento?.recomendacion
);

const failed = checks.filter((c) => !c.ok);
console.log("Messenger spec checks (post OB-MSG):", checks.length);
for (const c of checks) {
  console.log(`  ${c.ok ? "OK" : "FAIL"} ${c.id} - ${c.detail}`);
}
if (failed.length) {
  console.error(`\n${failed.length} check(s) failed`);
  process.exit(1);
}
console.log("\nTodos los checks de diseño Messenger pasaron (OB-MSG cerrados).");
