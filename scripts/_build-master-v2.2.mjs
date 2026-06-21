/**
 * Genera scripts/github-issues-master-v2.2.json desde v2.1 (congelado LAUNCH-6D).
 * Uso: node scripts/_build-master-v2.2.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcPath = join(__dirname, "github-issues-master-v2.json");
const outPath = join(__dirname, "github-issues-master-v2.2.json");

const v21 = JSON.parse(readFileSync(srcPath, "utf8"));

/** Opción A — 23 tickets LAUNCH-6D (6 dominios). Sin Comunidad VIP día 1. */
const LAUNCH_FINAL_23 = [
  "BAN-010",
  "ECO-000",
  "ECO-015",
  "ECO-010",
  "ECO-020",
  "ECO-030",
  "ECO-031",
  "ECO-040",
  "ECO-055",
  "ECO-080",
  "EST-000",
  "EST-010",
  "EST-020",
  "EST-030",
  "LIVE-000",
  "LIVE-010",
  "LIVE-020",
  "ADM-000",
  "ADM-020",
  "ADM-010",
  "ADM-030",
  "TICKET-012",
  "TICKET-013",
];

/** Dependencias previas al slice (no cuentan en los 23 pero preceden implementación). */
const LAUNCH_PREREQUISITES = ["TICKET-001", "TICKET-003"];

if (LAUNCH_FINAL_23.length !== 23) {
  throw new Error(`LAUNCH_FINAL_23 debe tener 23 tickets, tiene ${LAUNCH_FINAL_23.length}`);
}

const MERGED_INTO = {
  "EST-040": "ECO-040",
};

const SUPERSEDES_BY = {
  "ECO-055": ["ECO-050"],
  "ECO-015": [],
  "BAN-010": [],
  "ADM-000": [],
  "ADM-020": [],
  "ECO-040": ["EST-040"],
};

const LAUNCH_DEP_FIXES = {
  "ECO-000": { dependencies: [], blockedBy: [] },
  "EST-000": { dependencies: [], blockedBy: [] },
  "LIVE-000": { dependencies: [], blockedBy: [] },
  "ECO-010": { dependencies: ["ECO-000"], blockedBy: ["ECO-000"] },
  "ECO-015": { dependencies: ["ECO-000"], blockedBy: ["ECO-000"] },
  "ECO-020": {
    dependencies: ["ECO-010", "ECO-015", "BAN-010"],
    blockedBy: ["ECO-010", "ECO-015", "BAN-010"],
  },
  "EST-030": {
    dependencies: ["EST-020", "ECO-020"],
    blockedBy: ["EST-020", "ECO-020"],
  },
  "LIVE-020": {
    dependencies: ["LIVE-010", "ECO-020"],
    blockedBy: ["LIVE-010", "ECO-020"],
  },
  "ECO-055": {
    dependencies: ["ECO-040", "ECO-030"],
    blockedBy: ["ECO-040", "ECO-030"],
  },
  "ECO-080": {
    dependencies: ["ECO-040", "ECO-055"],
    blockedBy: ["ECO-040", "ECO-055"],
  },
  "ADM-000": {
    dependencies: ["ECO-010"],
    blockedBy: ["ECO-010"],
  },
  "ADM-020": {
    dependencies: ["ECO-015", "BAN-010"],
    blockedBy: ["ECO-015", "BAN-010"],
  },
  "ADM-030": {
    dependencies: ["ECO-030"],
    blockedBy: ["ECO-030"],
    priority: "P1",
  },
  "TICKET-012": {
    dependencies: ["TICKET-001", "BAN-010"],
    blockedBy: ["TICKET-001", "BAN-010"],
  },
};

const NEW_TICKETS = [
  {
    id: "BAN-010",
    title: "[P0] Slots publicitarios — acta + inventario + checkout slotId",
    body: `## Objetivo
Acta y runtime de slots publicitarios: inventario, capacidad, rotación, disponibilidad y slotId en checkout.

## Alcance
- **22 slots** en scripts/seed-configuracion-publicidad.json (superset operativo).
- **17 slots core MVP** (plan maestro): home(9) + resultados(4) + perfil(4).
- **Extended post-MVP en datos**: sin_resultados(4) + registro_superior(1) — tier documentado, no requiere tickets extra.
- Inventario por slotId: capacidad, rotación, ocupación, disponibilidad para checkout.
- Enlace registro-banner / checkout con slotId válido.

## Dependencias
- ECO-000

## Archivos afectados
- scripts/seed-configuracion-publicidad.json
- scripts/PLAN-MAESTRO-BANNERS-PUBLICIDAD.json
- scripts/ANEXO-ESTRATEGICO-BANNERS-PUBLICIDAD.json
- public/registro-banner.html
- public/js/banner-registro.js
- public/js/banner-*.js

## Qué NO tocar
- Rediseñar shell 3 columnas dashboard-rentero.html
- Métricas avanzadas de slots (post-lanzamiento)

## Criterios de aceptación
- [ ] Acta slots alineada seed 22 + subset core 17 documentado
- [ ] slotId en orden/checkout banner validado contra inventario
- [ ] Capacidad/rotación impiden double-book del mismo slot
- [ ] UI registro-banner y home/resultados usan mismos slotIds
- [ ] Banner impago/vencido refleja estado en rail (TICKET-052 DONE)

## Riesgo si se implementa mal
Banners en slots incorrectos, overbooking, checkout sin slot = imposible publicar banners.`,
    labels: ["payments", "backend", "p0-blocker", "launch-6d"],
    priority: "P0",
    phase: "4-banners-slots",
    block: "Slots publicitarios",
    dependencies: ["ECO-000"],
    affectedFiles: [
      "scripts/seed-configuracion-publicidad.json",
      "public/registro-banner.html",
      "public/js/banner-registro.js",
    ],
    riskLevel: "critical",
    status: "pending",
    doNotTouch: ["Rediseñar shell 3 columnas dashboard-rentero.html"],
    duplicateOf: null,
    supersedes: [],
    blockedBy: ["ECO-000"],
    acceptanceCriteria: [
      "Acta slots alineada seed 22 + subset core 17 documentado",
      "slotId en orden/checkout banner validado contra inventario",
      "Capacidad/rotación impiden double-book del mismo slot",
    ],
    launchBlocker: true,
    milestone: "LAUNCH-6D",
    launchPhase: "launch",
  },
  {
    id: "ECO-015",
    title: "[P0] PricingResolver + ContractFactory + promos congeladas",
    body: `## Objetivo
Motor de precios unificado y contratos congelados al checkout (banners + perfiles).

## Alcance
- PricingResolver: IVA, periodo, video×2, overrides admin, planes perfil (incl. plan vip visibilidad).
- ContractFactory: snapshot precio/promo en ordenes_pago — contrato activo inmutable.
- Promociones congeladas banners y perfiles (config-promociones-banners, planes perfiles).
- **NO** Comunidad VIP / suscripciones recurrentes (post-lanzamiento, opción A).

## Dependencias
- ECO-000

## Archivos afectados
- scripts/SPEC-PAGOS-CONTRATOS.json
- scripts/config-precios-planes-perfiles-schema.json
- scripts/config-promociones-banners-schema.json
- functions/payments/

## Qué NO tocar
- Activación desde frontend sin webhook
- ECO-070 suscripciones VIP comunidad

## Criterios de aceptación
- [ ] PricingResolver cubre banner, perfil, estado, live
- [ ] ContractFactory escribe snapshot en ordenes_pago
- [ ] Promo congelada no altera contratos activos
- [ ] ECO-020 consume precio solo vía resolver (no cálculo en cliente)

## Riesgo si se implementa mal
Precios inconsistentes, promos retroactivas, fraude de checkout.`,
    labels: ["payments", "backend", "p0-blocker", "launch-6d"],
    priority: "P0",
    phase: "5-economico",
    block: "ECO / PAY",
    dependencies: ["ECO-000"],
    affectedFiles: [
      "scripts/SPEC-PAGOS-CONTRATOS.json",
      "functions/payments/",
    ],
    riskLevel: "critical",
    status: "pending",
    doNotTouch: ["Activación desde frontend sin webhook"],
    duplicateOf: null,
    supersedes: [],
    blockedBy: ["ECO-000"],
    acceptanceCriteria: [
      "PricingResolver cubre banner, perfil, estado, live",
      "ContractFactory escribe snapshot en ordenes_pago",
      "ECO-020 consume precio solo vía resolver",
    ],
    launchBlocker: true,
    milestone: "LAUNCH-6D",
    launchPhase: "launch",
  },
  {
    id: "ADM-000",
    title: "[P0] Cola revisión unificada perfiles + banners + moderación operativa",
    body: `## Objetivo
Panel admin: revisar, aprobar, rechazar, autorizar pago, confirmar pago, publicar, pausar/suspender perfiles y banners.

## Alcance
- Máquina de estados config-estados-revision-publicacion-schema.json.
- Cola: enviado_revision, correccion_solicitada, autorizado_para_pago, pago_confirmado, revision_post_pago, publicado, activo, suspendido.
- **Estados/Lives MVP**: publicación tras pago + gates VE; moderación post-hoc vía suspender (no cola pre-publicación obligatoria).
- Acciones admin: revisar, publicar, pausar, suspender, ofrecer renovación (enlace ECO-055).

## Dependencias
- ECO-010

## Archivos afectados
- scripts/config-estados-revision-publicacion-schema.json
- public/admin.html
- firestore.rules

## Qué NO tocar
- Admin lee chats completos rutinario
- Audit log unificado AUD-* (post-lanzamiento)

## Criterios de aceptación
- [ ] Perfil/banner no publica sin flujo admin definido
- [ ] revision_post_pago bloquea auto-publicar tras cambios importantes
- [ ] Suspender pausa producto público
- [ ] Admin puede autorizar pago y confirmar pago (flujo manual alternativo documentado)
- [ ] Publicar perfil y publicar banner operativos desde admin

## Riesgo si se implementa mal
Contenido no revisado en prod, publicación sin pago, bypass de moderación.`,
    labels: ["admin", "p0-blocker", "launch-6d"],
    priority: "P0",
    phase: "8-admin",
    block: "Admin",
    dependencies: ["ECO-010"],
    affectedFiles: [
      "public/admin.html",
      "scripts/config-estados-revision-publicacion-schema.json",
    ],
    riskLevel: "critical",
    status: "pending",
    doNotTouch: ["Admin lee chats completos rutinario"],
    duplicateOf: null,
    supersedes: [],
    blockedBy: ["ECO-010"],
    acceptanceCriteria: [
      "Perfil/banner no publica sin flujo admin definido",
      "Suspender pausa producto público",
      "Publicar perfil y banner operativos desde admin",
    ],
    launchBlocker: true,
    milestone: "LAUNCH-6D",
    launchPhase: "launch",
  },
  {
    id: "ADM-020",
    title: "[P1] Admin comercial — precios, promos, slots (sin romper activos)",
    body: `## Objetivo
Admin configura precios, promociones y parámetros de slots sin alterar contratos activos.

## Alcance
- Editar config precios planes perfiles, promos banners, factores periodo/IVA.
- Overrides slot pricing en inventario BAN-010.
- Cambios aplican solo a nuevas órdenes; ContractFactory preserva activos.

## Dependencias
- ECO-015
- BAN-010

## Archivos afectados
- public/admin.html
- scripts/config-precios-planes-perfiles-schema.json
- scripts/config-promociones-banners-schema.json
- scripts/seed-configuracion-publicidad.json

## Qué NO tocar
- Modificar montos de ordenes_pago pagadas
- Comunidad VIP (post-lanzamiento)

## Criterios de aceptación
- [ ] Admin edita precios/promos con validación schema
- [ ] Contratos activos mantienen snapshot original
- [ ] Cambios slots reflejan en checkout nuevo

## Riesgo si se implementa mal
Retroactivo en contratos, ingresos incorrectos.`,
    labels: ["admin", "payments", "p1-next", "launch-6d"],
    priority: "P1",
    phase: "8-admin",
    block: "Admin",
    dependencies: ["ECO-015", "BAN-010"],
    affectedFiles: ["public/admin.html"],
    riskLevel: "high",
    status: "pending",
    doNotTouch: ["Modificar montos de ordenes_pago pagadas"],
    duplicateOf: null,
    supersedes: [],
    blockedBy: ["ECO-015", "BAN-010"],
    acceptanceCriteria: [
      "Admin edita precios/promos con validación schema",
      "Contratos activos mantienen snapshot original",
    ],
    launchBlocker: false,
    milestone: "LAUNCH-6D",
    launchPhase: "launch",
  },
  {
    id: "ECO-055",
    title: "[P1] Renovación unificada — todos los productos",
    body: `## Objetivo
Flujo de renovación unificado para perfil, banner, estado, live.

## Alcance
- CTA renovar en dashboard (ECO-080) → checkout renovación vía ECO-020.
- Webhook activa extensión de vigencia (ECO-030/031).
- Avisos pre-vencimiento opcionales (ECO-050 fusionado aquí, no ticket separado).
- Banner impago: bloqueo conversaciones hasta renovar.

## Dependencias
- ECO-040
- ECO-030

## Archivos afectados
- public/dashboard-rentero.html
- public/js/dashboard-banner-metrics.js
- functions/payments/
- functions/index.js

## Qué NO tocar
- Suscripciones VIP recurrentes (ECO-070 post-lanzamiento)

## Criterios de aceptación
- [ ] Renovar perfil, banner, estado, live desde dashboard
- [ ] Renovación crea nueva orden con ContractFactory
- [ ] Vigencia extendida solo tras webhook confirmado
- [ ] Producto vencido muestra CTA renovar

## Riesgo si se implementa mal
Renovaciones gratis, servicios activos sin cobro.`,
    labels: ["payments", "dashboard", "p1-next", "launch-6d"],
    priority: "P1",
    phase: "5-economico",
    block: "ECO / PAY",
    dependencies: ["ECO-040", "ECO-030"],
    affectedFiles: [
      "public/dashboard-rentero.html",
      "functions/payments/",
    ],
    riskLevel: "high",
    status: "pending",
    doNotTouch: ["Suscripciones VIP recurrentes"],
    duplicateOf: null,
    supersedes: ["ECO-050"],
    blockedBy: ["ECO-040", "ECO-030"],
    acceptanceCriteria: [
      "Renovar perfil, banner, estado, live desde dashboard",
      "Vigencia extendida solo tras webhook confirmado",
    ],
    launchBlocker: false,
    milestone: "LAUNCH-6D",
    launchPhase: "launch",
  },
];

const ORDEN_LAUNCH_6D = [
  ...LAUNCH_PREREQUISITES,
  "ECO-000",
  "BAN-010",
  "ECO-015",
  "ECO-010",
  "ADM-000",
  "ECO-020",
  "ECO-030",
  "ECO-031",
  "EST-000",
  "LIVE-000",
  "EST-010",
  "LIVE-010",
  "TICKET-013",
  "TICKET-012",
  "EST-020",
  "LIVE-020",
  "EST-030",
  "ECO-040",
  "ECO-055",
  "ECO-080",
  "ADM-020",
  "ADM-010",
  "ADM-030",
];

function cloneIssue(issue) {
  return JSON.parse(JSON.stringify(issue));
}

const issueMap = new Map(v21.issues.map((i) => [i.id, cloneIssue(i)]));

// Insert new tickets (replace if somehow exist)
for (const t of NEW_TICKETS) {
  issueMap.set(t.id, cloneIssue(t));
}

const issues = [];

for (const [id, issue] of issueMap) {
  const isLaunch = LAUNCH_FINAL_23.includes(id);
  const mergedInto = MERGED_INTO[id];

  if (mergedInto) {
    issue.status = "merged";
    issue.mergedInto = mergedInto;
    issue.launchPhase = "post-launch";
    issue.milestone = "post-launch";
    issue.launchBlocker = false;
    if (!issue.supersedes?.length) issue.supersedes = [];
  } else if (LAUNCH_PREREQUISITES.includes(id)) {
    issue.launchPhase = "prerequisite";
    issue.milestone = "pre-LAUNCH-6D";
    if (!issue.labels.includes("launch-6d")) {
      issue.labels = [...(issue.labels || []), "launch-6d"];
    }
  } else if (issue.status === "reference" || issue.duplicateOf) {
    issue.launchPhase = "reference";
    issue.milestone = issue.milestone || "reference";
  } else if (issue.status === "done") {
    issue.launchPhase = issue.launchPhase || "done-pre-freeze";
    issue.milestone = issue.milestone || "sprint-1";
  } else if (isLaunch) {
    issue.milestone = "LAUNCH-6D";
    issue.launchPhase = "launch";
    if (!issue.labels.includes("launch-6d")) {
      issue.labels = [...(issue.labels || []), "launch-6d"];
    }
    const fixes = LAUNCH_DEP_FIXES[id];
    if (fixes) {
      if (fixes.dependencies) issue.dependencies = fixes.dependencies;
      if (fixes.blockedBy) issue.blockedBy = fixes.blockedBy;
      if (fixes.priority) issue.priority = fixes.priority;
    }
  } else {
    issue.launchPhase = "post-launch";
    issue.milestone = "post-launch";
    issue.launchBlocker = false;
  }

  // ECO-020: quitar VIP de criterios (opción A)
  if (id === "ECO-020") {
    issue.body = issue.body.replace(
      "Un flujo para banner, estado, live, VIP",
      "Un flujo para banner, perfil, estado, live (sin Comunidad VIP)"
    );
    issue.acceptanceCriteria = (issue.acceptanceCriteria || []).map((c) =>
      c.replace("banner, estado, live, VIP", "banner, perfil, estado, live")
    );
  }

  if (id === "ECO-040") {
    issue.supersedes = [...new Set([...(issue.supersedes || []), "EST-040"])];
    issue.title = issue.title.replace(
      "Activar/desactivar por vencimiento",
      "Vencimiento centralizado — todos los productos"
    );
  }

  if (id === "ECO-050") {
    issue.status = "merged";
    issue.mergedInto = "ECO-055";
    issue.launchPhase = "post-launch";
    issue.milestone = "post-launch";
    issue.launchBlocker = false;
  }

  issues.push(issue);
}

// Sort: launch order first, then block order from v2.1
const orderIndex = new Map(ORDEN_LAUNCH_6D.map((id, i) => [id, i]));
issues.sort((a, b) => {
  const ai = orderIndex.has(a.id) ? orderIndex.get(a.id) : 1000 + issues.indexOf(a);
  const bi = orderIndex.has(b.id) ? orderIndex.get(b.id) : 1000 + issues.indexOf(b);
  return ai - bi;
});

const stats = {
  total: issues.length,
  launch6D: LAUNCH_FINAL_23.length,
  postLaunch: issues.filter((i) => i.launchPhase === "post-launch").length,
  merged: issues.filter((i) => i.status === "merged").length,
  done: issues.filter((i) => i.status === "done").length,
  partial: issues.filter((i) => i.status === "partial").length,
  pending: issues.filter((i) => i.status === "pending").length,
  reference: issues.filter((i) => i.status === "reference").length,
  launchBlockers: issues.filter((i) => i.launchBlocker && i.launchPhase === "launch").length,
};

const out = {
  ...v21,
  planId: "master-v2.2",
  version: "2.2.0",
  generatedAt: "2026-06-20",
  frozen: true,
  descripcion:
    "Backlog maestro CariHub v2.2 CONGELADO. Opción A: 23 tickets LAUNCH-6D, sin Comunidad VIP día 1. 5 consolidados nuevos. Post-lanzamiento marcado.",
  launchFreeze: {
    version: "2.2.0",
    option: "A",
    milestone: "LAUNCH-6D",
    vipComunidadDay1: false,
    frozenAt: "2026-06-20",
    ticketCount: LAUNCH_FINAL_23.length,
    tickets: LAUNCH_FINAL_23,
    prerequisites: LAUNCH_PREREQUISITES,
    ordenImplementacion: ORDEN_LAUNCH_6D,
    dominios: [
      "Estados",
      "Lives",
      "Slots publicitarios",
      "Sistema de precios",
      "Dashboard anunciante",
      "Dashboard administrador",
    ],
  },
  fusiones: [
    {
      mergedInto: "BAN-010",
      consolidates:
        "acta slots, inventario, capacidad, rotación, disponibilidad, slotId checkout",
      absorbedIds: [],
    },
    {
      mergedInto: "ECO-015",
      consolidates: "PricingResolver, ContractFactory, promos congeladas banners+perfiles",
      absorbedIds: [],
    },
    {
      mergedInto: "ADM-000",
      consolidates:
        "cola revisión unificada perfiles/banners, moderación operativa, suspender/publicar",
      absorbedIds: [],
    },
    {
      mergedInto: "ADM-020",
      consolidates: "admin comercial precios promos slots sin romper activos",
      absorbedIds: [],
    },
    {
      mergedInto: "ECO-055",
      consolidates: "renovación unificada todos productos",
      absorbedIds: ["ECO-050"],
    },
    {
      mergedInto: "ECO-040",
      consolidates: "vencimiento centralizado todos productos",
      absorbedIds: ["EST-040"],
    },
  ],
  ordenRecomendadoBloques: [
    "LAUNCH-6D-implementacion",
    "post-launch-messenger",
    "post-launch-vip",
    "post-launch-crypto-passkeys",
  ],
  ordenRecomendadoLaunch6D: ORDEN_LAUNCH_6D,
  dependenciasCriticas: [
    "ECO-015 antes de ECO-020 (PricingResolver)",
    "BAN-010 antes de checkout banner y TICKET-012",
    "ADM-000 antes de publicar perfiles/banners",
    "ECO-030/031 bloquean activación automática",
    "ECO-040 vencimiento centralizado (fusiona EST-040)",
    "ECO-055 renovación unificada (fusiona ECO-050 avisos)",
    "Opción A: sin VIP-*, sin ECO-070",
    "ECO-000 sin dep MSG-000 en slice lanzamiento",
  ],
  labels: [...(v21.labels || []), "launch-6d", "post-launch"],
  statistics: stats,
  issues,
  launchBlockers: issues
    .filter((i) => i.launchBlocker && i.launchPhase === "launch")
    .map((i) => i.id),
  criticalRisks: issues
    .filter((i) => i.riskLevel === "critical" && i.launchPhase === "launch")
    .map((i) => i.id),
  siguienteSprintRecomendado: {
    id: "LAUNCH-6D-S1",
    nombre: "Foundation + ECO acta + BAN-010 + ECO-015",
    tickets: [
      "TICKET-001",
      "TICKET-003",
      "ECO-000",
      "BAN-010",
      "ECO-015",
      "ECO-010",
    ],
    objetivo:
      "Firebase único, multi-perfil, acta económico, slots inventario, motor precios — base para checkout",
  },
};

out.siguienteSprintRecomendado.objetivo =
  "Firebase único, multi-perfil, acta económico, slots inventario, motor precios — base para checkout";

writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n", "utf8");
console.log(`Written ${outPath}`);
console.log(`LAUNCH-6D tickets: ${LAUNCH_FINAL_23.length}`);
console.log(`Total issues: ${issues.length}`);
console.log(`Launch blockers: ${stats.launchBlockers}`);
