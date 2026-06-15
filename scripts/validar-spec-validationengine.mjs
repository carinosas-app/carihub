#!/usr/bin/env node
/**
 * Auditoría de consistencia SPEC ValidationEngine — solo diseño, sin runtime.
 * Uso: node scripts/validar-spec-validationengine.mjs
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

function flattenAcciones(acciones) {
  const out = [];
  for (const [k, v] of Object.entries(acciones || {})) {
    if (k === "nota" || k === "routingAcciones" || !Array.isArray(v)) continue;
    out.push(...v);
  }
  return out;
}

const checks = [];
function check(id, ok, detail) {
  checks.push({ id, ok, detail });
}

const spec = loadJson("SPEC-VALIDATIONENGINE.json");
const registry = loadJson("registry-validationengine-eventos.json");
const fixtures = loadJson("fixtures-validationengine-golden.json");
const acta = loadJson("ACTA-CONGELAMIENTO-VALIDATIONENGINE.json");
const fieldEngine = loadJson("SPEC-FIELDENGINE.json");

if (spec.error) {
  console.error(spec.error);
  process.exit(1);
}

const orden = spec.algoritmoValidacion?.orden || [];
const pasoAuth = orden.some((s) => s.includes("validateAuth"));
const paso14 = orden.length >= 14;

check("VE01_spec_version", spec.versionSpec === "1.1.0", `versionSpec=${spec.versionSpec}`);
check("VE02_estado_congelado", spec.estado === "CONGELADO", spec.estado);
check("VE03_pipeline_validateAuth", pasoAuth, `pasoAuth=${pasoAuth}`);
check("VE04_pipeline_14_pasos", paso14, `pasos=${orden.length}`);
check(
  "VE05_reglasAuthTurnstile",
  !!spec.algoritmoValidacion?.reglasAuthTurnstile,
  "reglasAuthTurnstile presente"
);
check(
  "VE06_contratoMultiDestino",
  !!spec.eventBusCanonico?.contratoMultiDestino,
  "contratoMultiDestino OB-VE2"
);
check(
  "VE07_sin_mapeoAccionEvento_legacy",
  !spec.eventBusCanonico?.mapeoAccionEvento,
  "mapeoAccionEvento eliminado"
);
check(
  "VE08_registry_archivo",
  spec.eventBusCanonico?.registryAccionEventos?.archivo?.includes("registry-validationengine-eventos"),
  spec.eventBusCanonico?.registryAccionEventos?.archivo
);
const accionesSpec = flattenAcciones(spec.acciones);
const accionesRegistry = Object.keys(registry.error ? {} : registry.acciones || {});
const registryOk =
  !registry.error &&
  accionesSpec.length === accionesRegistry.length &&
  accionesSpec.every((a) => accionesRegistry.includes(a));
check(
  "VE09_registry_completo_60",
  registryOk,
  registry.error || `spec=${accionesSpec.length} registry=${accionesRegistry.length}`
);
check(
  "VE10_guiaErrores",
  !!spec.guiaErrores?.gatesVsEstados?.GATE_SEGURIDAD_DENEGADO,
  "guiaErrores OB-VE5"
);
check(
  "VE11_estado_cuenta_invalido",
  !!spec.errores?.ESTADO_CUENTA_INVALIDO,
  "ESTADO_CUENTA_INVALIDO en catálogo"
);
check(
  "VE12_enviar_revision_admin_notif",
  !!registry.acciones?.enviar_revision?.notificacion?.items?.some(
    (i) => i.tipoEvento === "verificacion_recibida" && i.destinatario?.tipo === "admin"
  ),
  "enviar_revision admin verificaciones OB-VE4"
);
check(
  "VE13_fixtures_count",
  !fixtures.error && fixtures.fixtures?.length >= 24,
  fixtures.error || `fixtures=${fixtures.fixtures?.length}`
);
const v02 = fixtures.fixtures?.find((f) => f.id?.startsWith("V02"));
check(
  "VE14_fixture_v02_fanOutPlan",
  !!v02?.salidaEsperada?.fanOutPlan?.length,
  `v02 items=${v02?.salidaEsperada?.fanOutPlan?.length}`
);
check(
  "VE15_fieldEngine_dep",
  spec.dependenciasCongeladas?.fieldEngine?.includes("1.0.1"),
  spec.dependenciasCongeladas?.fieldEngine
);
check(
  "VE16_implementacion_false",
  spec.implementacionAutorizada === false,
  String(spec.implementacionAutorizada)
);
check(
  "VE17_acta_congelado",
  !acta.error && acta.estadoActa === "CONGELADO" && acta.autorizacion?.estado === "APROBADA",
  acta.error || acta.estadoActa
);
const obItems =
  acta.auditoriaFinalPreCongelamiento?.ajustesObligatoriosPreAprobacion?.items ||
  acta.auditoriaFinalPreCongelamiento?.ajustesObligatoriosPreAprobacion ||
  [];
const obCerrados =
  Array.isArray(obItems) &&
  obItems.every((id) => spec.changelog?.some((c) => c.id === id)) &&
  acta.auditoriaFinalPreCongelamiento?.ajustesObligatoriosPreAprobacion?.estado === "CERRADOS";
check("VE18_acta_ob_ve_checklist", obCerrados, `items=${obItems.length}`);

const feGate = fieldEngine.error
  ? false
  : fieldEngine.securityGates?.reglas?.some((r) => r.accion === "guardar_borrador");
check("VE19_align_fieldengine_gate", feGate, fieldEngine.error || "guardar_borrador en FE");

check(
  "VE20_mensajeria_grupo_renombrado",
  Array.isArray(spec.acciones?.mensajeria) && !spec.acciones?.mensajeria_futura,
  `mensajeria=${spec.acciones?.mensajeria?.length}`
);
const msgEnviar = registry.acciones?.mensaje_enviar;
check(
  "VE21_mensaje_enviar_fanOut",
  !!msgEnviar?.fanOutPlan?.some((i) => i.dominio === "historial_mensajes") &&
    !!msgEnviar?.fanOutPlan?.some((i) => i.dominio === "mensajes" && i.tipoEvento === "mensaje_nuevo"),
  `items=${msgEnviar?.fanOutPlan?.length}`
);
check(
  "VE22_errores_messenger_gates",
  !!spec.errores?.TELEFONO_NO_VERIFICADO &&
    !!spec.errores?.MESSENGER_DESHABILITADO_AMBITO &&
    !!spec.errores?.SPAM_SCORE_UMBRAL,
  "errores messenger gates"
);
check(
  "VE23_fixtures_count_24",
  !fixtures.error && fixtures.fixtures?.length >= 24,
  `fixtures=${fixtures.fixtures?.length}`
);
check(
  "VE24_sin_conversacion_iniciar_registry",
  !registry.error && !registry.acciones?.conversacion_iniciar,
  String(!!registry.acciones?.conversacion_iniciar)
);
check(
  "VE25_compatibilidad_messenger",
  !!spec.compatibilidad?.messenger_1_0_0?.estado,
  spec.compatibilidad?.messenger_1_0_0?.estado
);

const failed = checks.filter((c) => !c.ok);
console.log("ValidationEngine spec checks (post OB-VE):", checks.length);
for (const c of checks) {
  console.log(c.ok ? "  OK" : " FAIL", c.id, "-", c.detail);
}
if (failed.length) {
  console.error(`\n${failed.length} check(s) failed`);
  process.exit(1);
}
console.log("\nTodos los checks de diseño pasaron (OB-VE1–5 cerrados).");
