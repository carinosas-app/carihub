#!/usr/bin/env node
/**
 * Auditoría de consistencia SPEC FieldEngine — solo diseño, sin runtime.
 * Uso: node scripts/validar-spec-fieldengine.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname);

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

const spec = loadJson("SPEC-FIELDENGINE.json");
const fixtures = loadJson("fixtures-fieldengine-golden.json");
const acta = loadJson("ACTA-CONGELAMIENTO-FIELDENGINE.json");
const seguridad = loadJson("config-seguridad-mvp-schema.json");

if (spec.error) {
  console.error(spec.error);
  process.exit(1);
}

// V1 version alignment
check(
  "V01_spec_version",
  spec.versionSpec === "1.0.1",
  `versionSpec=${spec.versionSpec}`
);
check(
  "V02_fixtures_version",
  !fixtures.error && fixtures.version === "1.0.1",
  fixtures.error || `fixtures.version=${fixtures.version}`
);
check(
  "V03_acta_version",
  !acta.error && acta.versionFieldEngine?.semver === "1.0.1",
  acta.error || `acta.semver=${acta.versionFieldEngine?.semver}`
);

// AM1 guardar_borrador
const gateBorrador = spec.securityGates?.reglas?.find((r) => r.accion === "guardar_borrador");
const am1Ok =
  gateBorrador?.requiere?.some((r) => r.includes("restringido")) ?? false;
check("AM1_gate_borrador_restringido", am1Ok, JSON.stringify(gateBorrador?.requiere));

const f10 = fixtures.fixtures?.find((f) => f.id?.startsWith("F10"));
check(
  "AM1_fixture_F10",
  f10?.salidaEsperada?.securityGates?.guardar_borrador === "permitido" &&
    f10?.salidaEsperada?.securityGates?.enviar_revision === "denegado",
  "F10 gates"
);

const gateEnviar = spec.securityGates?.reglas?.find((r) => r.accion === "enviar_revision");
const am1EnviarOk = !gateEnviar?.requiere?.some((r) => r.includes("restringido"));
check("AM1_gate_enviar_sin_restringido", am1EnviarOk, JSON.stringify(gateEnviar?.requiere));

// AM2 visitante
const subCtx = spec.tipos?.FieldEngineContext?.subcategoriaId;
check(
  "AM2_subcategoria_condicional",
  subCtx?.obligatorio === "condicional",
  `obligatorio=${subCtx?.obligatorio}`
);
check(
  "AM2_flujo_visitante",
  !!spec.tipos?.FieldEngineContext?.flujoVisitante,
  "flujoVisitante definido"
);
const f08 = fixtures.fixtures?.find((f) => f.id?.startsWith("F08"));
check(
  "AM2_fixture_F08",
  f08?.entrada?.flujoVisitante === "registro_inicial" && !f08?.entrada?.subcategoriaId,
  "F08 registro inicial sin subcategoriaId"
);
const f11 = fixtures.fixtures?.find((f) => f.id?.startsWith("F11"));
check(
  "AM2_fixture_F11",
  f11?.salidaEsperada?.error === "SUBCATEGORIA_REQUERIDA_UPGRADE_VISITANTE",
  "F11 upgrade error"
);

// AM3 fuentes
const fuentes = spec.fuentesLectura ?? [];
const am3Files = [
  "config-categorias-sugeridas-schema.json",
  "config-renderizado-dinamico-schema.json",
  "config-contratos-carihub-schema.json",
];
for (const f of am3Files) {
  const inSpec = fuentes.some((x) => x.endsWith(f));
  const exists = existsSync(join(root, f));
  check(`AM3_fuente_${f}`, inSpec && exists, `enSpec=${inSpec} exists=${exists}`);
}
check("AM3_snapshot", !!spec.snapshotAlPublicar?.referencia, spec.snapshotAlPublicar?.referencia);
check("AM3_algoritmo_temporal", !!spec.algoritmoResolucion?.ramaTemporal, "ramaTemporal");

// Acta AM closed
if (!acta.error) {
  for (const id of ["AM1", "AM2", "AM3"]) {
    check(
      `ACTA_${id}_cerrado`,
      acta.ajustesObligatoriosCerrados?.[id]?.estado === "CERRADO",
      acta.ajustesObligatoriosCerrados?.[id]?.estado
    );
  }
}

// Seguridad MVP alignment text
if (!seguridad.error) {
  const restr =
    seguridad.estadosSeguridad?.efectos?.restringido?.publicaciones ?? "";
  check(
    "SEG_MVP_restringido_solo_borrador",
    String(restr).includes("solo borrador"),
    restr
  );
}

const failed = checks.filter((c) => !c.ok);
const report = {
  fecha: new Date().toISOString().slice(0, 10),
  specVersion: spec.versionSpec,
  resultado: failed.length === 0 ? "PASS" : "FAIL",
  total: checks.length,
  pass: checks.length - failed.length,
  fail: failed.length,
  checks,
};

const outPath = join(root, "validacion-spec-fieldengine-report.json");
import { writeFileSync } from "node:fs";
writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");

console.log(`\nFieldEngine SPEC consistency: ${report.resultado} (${report.pass}/${report.total})`);
if (failed.length) {
  for (const f of failed) console.log(`  FAIL ${f.id}: ${f.detail}`);
  process.exit(1);
}
