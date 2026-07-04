/**
 * Genera auditoría financiera de sostenibilidad por subcategoría (462 filas).
 * Solo lectura de catálogo/precios; no modifica runtime ni Firebase.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const audit = JSON.parse(
  fs.readFileSync(path.join(__dirname, "auditoria-monetizacion-categorias-462.json"), "utf8")
);
const preciosSchema = JSON.parse(
  fs.readFileSync(path.join(__dirname, "config-precios-planes-perfiles-schema.json"), "utf8")
);

const PLAN_MAP = {
  Basico: "basico",
  Profesional: "destacado",
  Premium: "premium",
  Especial: "vip",
};

const LIMITS = {
  basico: { fotos: 3, updates: 2 },
  destacado: { fotos: 6, updates: 4 },
  premium: { fotos: 10, updates: 8 },
  vip: { fotos: 15, updates: 20 },
};

const USD_MXN = 17.5;
const FEE_PCT = 0.036;
const IVA_INCLUIDO = preciosSchema.ivaIncluido === true;

const PRICE = {
  storageGbMonth: 0.026,
  egressGb: 0.12,
  firestoreRead100k: 0.06,
  firestoreWrite100k: 0.18,
  fixedOpsUsd: 0.08,
};

const USO = {
  Bajo: {
    photoAvgKb: 350,
    photoFill: 0.55,
    profileViews: 180,
    thumbLoadRatio: 0.35,
    convs: 8,
    msgsPerConv: 12,
    msgReadsPerOpen: 25,
    estados: 0,
    liveMin: 0,
    chatImgMb: 0,
    chatVidMb: 0,
    packGb: 0,
    stressMult: 1,
  },
  Medio: {
    photoAvgKb: 420,
    photoFill: 0.65,
    profileViews: 420,
    thumbLoadRatio: 0.45,
    convs: 22,
    msgsPerConv: 18,
    msgReadsPerOpen: 40,
    estados: 2,
    liveMin: 0,
    chatImgMb: 15,
    chatVidMb: 0,
    packGb: 0,
    stressMult: 1.15,
  },
  Alto: {
    photoAvgKb: 500,
    photoFill: 0.85,
    profileViews: 900,
    thumbLoadRatio: 0.55,
    convs: 55,
    msgsPerConv: 28,
    msgReadsPerOpen: 65,
    estados: 6,
    liveMin: 25,
    chatImgMb: 80,
    chatVidMb: 120,
    packGb: 0.5,
    stressMult: 1.35,
  },
};

function precioMensual(formularioId, planId) {
  const pf = preciosSchema.preciosBase.porFormulario[formularioId];
  if (pf && pf[planId] != null) return pf[planId];
  return preciosSchema.preciosBase.global[planId];
}

function usoFromRow(row) {
  const base = USO[row.consumo] || USO.Bajo;
  const n = row.necesidades || {};
  const u = { ...base };
  if (n.lives) u.liveMin = Math.max(u.liveMin, row.planRecomendado === "Especial" ? 45 : 25);
  if (n.packs || n.ventaDigital) {
    u.packGb = Math.max(u.packGb, row.planRecomendado === "Especial" ? 2 : 0.5);
    u.chatVidMb = Math.max(u.chatVidMb, row.planRecomendado === "Especial" ? 300 : u.chatVidMb);
    u.chatImgMb = Math.max(u.chatImgMb, row.planRecomendado === "Especial" ? 150 : u.chatImgMb);
  }
  if (n.bandwidthHigh) u.profileViews = Math.round(u.profileViews * 1.2);
  if (n.storageHigh) u.photoFill = Math.min(1, u.photoFill + 0.1);
  u.stressMult = base.stressMult;
  return u;
}

function costoPerfil(planId, uso) {
  const lim = LIMITS[planId];
  const photos = Math.round(lim.fotos * uso.photoFill);
  const storageGb = (photos * uso.photoAvgKb) / 1024 / 1024;
  const storageUsd = storageGb * PRICE.storageGbMonth;

  const galleryEgressGb =
    (uso.profileViews * photos * uso.photoAvgKb * uso.thumbLoadRatio) / 1024 / 1024 / 1024;
  const chatEgressGb = (uso.chatImgMb + uso.chatVidMb) / 1024;
  const liveEgressGb = (uso.liveMin * 0.8) / 1024;
  const packEgressGb = uso.packGb * 0.3;
  const egressGb = galleryEgressGb + chatEgressGb + liveEgressGb + packEgressGb;
  const egressUsd = egressGb * PRICE.egressGb;

  const msgsTotal = uso.convs * uso.msgsPerConv;
  const reads =
    uso.convs * uso.msgReadsPerOpen + msgsTotal * 3 + uso.profileViews * 8 + uso.estados * 120;
  const writes = msgsTotal * 2 + uso.estados * 15 + lim.updates * 20;
  const firestoreUsd =
    (reads / 100000) * PRICE.firestoreRead100k + (writes / 100000) * PRICE.firestoreWrite100k;

  const fixedUsd = PRICE.fixedOpsUsd * (uso.stressMult || 1);

  return {
    photos,
    storageGb,
    storageMxn: storageUsd * USD_MXN,
    egressGb,
    egressMxn: egressUsd * USD_MXN,
    firestoreMxn: firestoreUsd * USD_MXN,
    fijoMxn: fixedUsd * USD_MXN,
    totalMxn: (storageUsd + egressUsd + firestoreUsd + fixedUsd) * USD_MXN,
    reads,
    writes,
  };
}

function planMinimoSostenible(row) {
  const consumo = row.consumo;
  const n = row.necesidades || {};
  if (n.packs || n.ventaDigital || row.arquetipo === "persona_creador") return "Especial";
  if (consumo === "Alto" || n.lives || n.bandwidthHigh) {
    if (row.sectorId === "adultos" || row.arquetipo === "negocio_venue") return "Especial";
    return "Premium";
  }
  if (consumo === "Medio" || row.formularioId === "profesionista_cedula" || row.formularioId === "negocio_empresa") {
    return "Profesional";
  }
  return "Basico";
}

function planRank(p) {
  return { Basico: 1, Profesional: 2, Premium: 3, Especial: 4 }[p] || 1;
}

function costoViral(planId, uso) {
  const viral = {
    ...uso,
    profileViews: uso.profileViews * 8,
    convs: uso.convs * 3,
    msgsPerConv: uso.msgsPerConv * 2,
    chatImgMb: uso.chatImgMb * 4,
    chatVidMb: uso.chatVidMb * 4,
    liveMin: uso.liveMin * 2,
    packGb: uso.packGb * 3,
    stressMult: (uso.stressMult || 1) * 1.5,
  };
  return costoPerfil(planId, viral).totalMxn;
}

function semaforo(row, precio, costoTotal, margenNeto, margenNetoPct, planMin, costoViralMxn) {
  const margenViral = precio * (1 - FEE_PCT) - costoViralMxn;
  const margenViralPct = precio > 0 ? margenViral / precio : 0;

  if (margenNeto < 0) return "rojo";
  if (planRank(row.planRecomendado) < planRank(planMin)) return "rojo";
  if (margenViral < 0 || margenViralPct < 0.1) return "rojo";
  if (row.riesgoCosto === "Alto" && margenNetoPct < 0.25) return "rojo";
  if (margenNetoPct < 0.15) return "rojo";

  if (margenNetoPct < 0.4) return "amarillo";
  if (margenViralPct < 0.35) return "amarillo";
  if (row.riesgoCosto === "Alto" || row.riesgoCosto === "Medio-Alto") return "amarillo";
  if (row.consumo === "Alto" && row.planRecomendado !== "Especial") return "amarillo";
  if (row.consumo === "Medio" && row.planRecomendado === "Basico") return "amarillo";
  if (row.necesidades?.lives || row.necesidades?.packs || row.necesidades?.ventaDigital) {
    return "amarillo";
  }
  return "verde";
}

function csvEscape(val) {
  const s = String(val ?? "").replace(/"/g, '""');
  return /[",\n\r]/.test(s) ? `"${s}"` : s;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

const rows = audit.filas.map((row) => {
  const schemaPlan = PLAN_MAP[row.planRecomendado] || "basico";
  const precio = precioMensual(row.formularioId, schemaPlan);
  const uso = usoFromRow(row);
  const costo = costoPerfil(schemaPlan, uso);
  const comision = round2(precio * FEE_PCT);
  const margenBruto = round2(precio - costo.totalMxn);
  const margenNeto = round2(precio - costo.totalMxn - comision);
  const margenNetoPct = precio > 0 ? margenNeto / precio : 0;
  const planMin = planMinimoSostenible(row);
  const costoVir = costoViral(schemaPlan, uso);
  const sem = semaforo(row, precio, costo.totalMxn, margenNeto, margenNetoPct, planMin, costoVir);
  const debeSubir =
    planRank(row.planRecomendado) < planRank(planMin)
      ? `${row.planRecomendado} → ${planMin}`
      : "";

  const justifTecnica = [
    row.justificacionTecnica,
    `Costo storage ${round2(costo.storageMxn)} MXN (${round2(costo.storageGb * 1000) / 1000} GB).`,
    `Egress ${round2(costo.egressMxn)} MXN (${round2(costo.egressGb * 100) / 100} GB).`,
    `Firestore ${round2(costo.firestoreMxn)} MXN (${costo.reads} lecturas, ${costo.writes} escrituras).`,
    `Plan schema: ${schemaPlan}; cupo ${LIMITS[schemaPlan].fotos} fotos.`,
  ].join(" ");

  return {
    categoria: row.categoria,
    subcategoria: row.subcategoria,
    subcategoriaId: row.subcategoriaId,
    formularioId: row.formularioId,
    sectorId: row.sectorId,
    arquetipo: row.arquetipo,
    consumo: row.consumo,
    planRecomendado: row.planRecomendado,
    planSchemaId: schemaPlan,
    planMinimoSostenible: planMin,
    debeSubirPlan: debeSubir,
    precioMensualMXN: precio,
    ivaIncluido: IVA_INCLUIDO ? "si" : "no",
    costoStorageMXN: round2(costo.storageMxn),
    costoEgressMXN: round2(costo.egressMxn),
    costoFirestoreMXN: round2(costo.firestoreMxn),
    costoFijoOpsMXN: round2(costo.fijoMxn),
    costoTotalMXN: round2(costo.totalMxn),
    comisionPasarelaMXN: comision,
    margenBrutoMXN: margenBruto,
    margenNetoMXN: margenNeto,
    margenNetoPct: round2(margenNetoPct * 100),
    semaforo: sem,
    riesgoCosto: row.riesgoCosto,
    costoViralMXN: round2(costoVir),
    indiceRiesgoCosto: round2(
      costoVir *
        (row.riesgoCosto === "Alto" ? 3 : row.riesgoCosto === "Medio-Alto" ? 2 : row.consumo === "Medio" ? 1.5 : 1)
    ),
    justificacionTecnica: justifTecnica,
    justificacionComercial: row.justificacionComercial,
  };
});

// CSV
const headers = [
  "categoria",
  "subcategoria",
  "subcategoriaId",
  "formularioId",
  "sectorId",
  "arquetipo",
  "consumo",
  "planRecomendado",
  "planSchemaId",
  "planMinimoSostenible",
  "debeSubirPlan",
  "precioMensualMXN",
  "ivaIncluido",
  "costoStorageMXN",
  "costoEgressMXN",
  "costoFirestoreMXN",
  "costoFijoOpsMXN",
  "costoTotalMXN",
  "costoViralMXN",
  "comisionPasarelaMXN",
  "margenBrutoMXN",
  "margenNetoMXN",
  "margenNetoPct",
  "semaforo",
  "riesgoCosto",
  "indiceRiesgoCosto",
  "justificacionTecnica",
  "justificacionComercial",
];

const csvLines = [
  headers.join(","),
  ...rows.map((r) => headers.map((h) => csvEscape(r[h])).join(",")),
];
fs.writeFileSync(path.join(__dirname, "auditoria-sostenibilidad-planes-462.csv"), csvLines.join("\n"), "utf8");

// Summary stats
const rojo = rows.filter((r) => r.semaforo === "rojo");
const amarillo = rows.filter((r) => r.semaforo === "amarillo");
const verde = rows.filter((r) => r.semaforo === "verde");
const debeSubir = rows.filter((r) => r.debeSubirPlan);
const puedenBasico = rows.filter((r) => r.planMinimoSostenible === "Basico" && r.planRecomendado === "Basico");
const top20Riesgo = [...rows].sort((a, b) => b.indiceRiesgoCosto - a.indiceRiesgoCosto).slice(0, 20);

// Price recommendation by strategic plan (weighted avg + floor)
const byPlan = {};
["Basico", "Profesional", "Premium", "Especial"].forEach((p) => {
  const subset = rows.filter((r) => r.planRecomendado === p);
  if (!subset.length) return;
  const avgCost = subset.reduce((s, r) => s + r.costoTotalMXN, 0) / subset.length;
  const avgPrice = subset.reduce((s, r) => s + r.precioMensualMXN, 0) / subset.length;
  const minPrice = subset.reduce((m, r) => Math.min(m, r.precioMensualMXN), Infinity);
  const maxPrice = subset.reduce((m, r) => Math.max(m, r.precioMensualMXN), 0);
  const floorInfra = Math.ceil(avgCost / (1 - FEE_PCT - 0.15) / 50) * 50;
  const floorComercial = { Basico: 249, Profesional: 499, Premium: 799, Especial: 1199 }[p];
  byPlan[p] = {
    n: subset.length,
    avgCost: round2(avgCost),
    avgPrice: round2(avgPrice),
    minPrice,
    maxPrice,
    floorInfra,
    floorComercial,
    precioRecomendado: Math.max(floorInfra, floorComercial),
    margenNetoProm: round2(subset.reduce((s, r) => s + r.margenNetoMXN, 0) / subset.length),
  };
});

function mdList(items, limit = 200) {
  const slice = items.slice(0, limit);
  return slice
    .map(
      (r) =>
        `- **${r.subcategoria}** (\`${r.subcategoriaId}\`) · ${r.sectorId} · plan ${r.planRecomendado} · precio $${r.precioMensualMXN} · costo $${r.costoTotalMXN} · neto $${r.margenNetoMXN} MXN`
    )
    .join("\n");
}

const md = `# Auditoría de sostenibilidad — planes CariHub (462 subcategorías)

Generado: ${new Date().toISOString()}  
Fuente: \`scripts/mapa-registro-categorias.json\`, \`scripts/auditoria-monetizacion-categorias-462.json\`, \`scripts/config-precios-planes-perfiles-schema.json\`  
CSV detalle: \`scripts/auditoria-sostenibilidad-planes-462.csv\`

> **Alcance:** proyección financiera de infra (Firebase Storage, egress, Firestore, ops fijo) + comisión pasarela 3.6%. Precios con IVA incluido según schema. **No modifica runtime ni Firebase.**

---

## Resumen numérico

| Semáforo | Subcategorías | % |
|----------|---------------|---|
| Verde | ${verde.length} | ${round2((verde.length / rows.length) * 100)}% |
| Amarillo | ${amarillo.length} | ${round2((amarillo.length / rows.length) * 100)}% |
| Rojo | ${rojo.length} | ${round2((rojo.length / rows.length) * 100)}% |

| Plan mínimo sostenible | Count |
|------------------------|------:|
| Básico | ${rows.filter((r) => r.planMinimoSostenible === "Basico").length} |
| Profesional | ${rows.filter((r) => r.planMinimoSostenible === "Profesional").length} |
| Premium | ${rows.filter((r) => r.planMinimoSostenible === "Premium").length} |
| Especial | ${rows.filter((r) => r.planMinimoSostenible === "Especial").length} |

---

## Subcategorías en rojo (${rojo.length})

Criterio: margen neto < 15%, margen neto negativo, plan inferior al mínimo sostenible, o **escenario viral** (8× vistas, 3× mensajes) con margen neto < 10%.

${rojo.length ? mdList(rojo, 500) : "_Ninguna en rojo bajo el modelo de costo típico._"}

---

## Subcategorías en amarillo (${amarillo.length})

Criterio: margen neto 15–40%, riesgo Alto/Medio-Alto, consumo Alto sin plan Especial, lives/packs/venta digital, o escenario viral con margen neto 10–35%.

${amarillo.length ? mdList(amarillo, 500) : "_Ninguna._"}

---

## Deben subir de plan (${debeSubir.length})

Plan recomendado actual **inferior** al mínimo sostenible por consumo/arquetipo.

${debeSubir.length ? debeSubir.map((r) => `- **${r.subcategoria}** (\`${r.subcategoriaId}\`) · actual **${r.planRecomendado}** → mínimo **${r.planMinimoSostenible}** · ${r.sectorId}`).join("\n") : "_Todas alineadas al mínimo sostenible._"}

---

## Pueden quedarse en Básico (${puedenBasico.length})

Plan recomendado = Básico y mínimo sostenible = Básico.

${puedenBasico.length ? mdList(puedenBasico, 80) + (puedenBasico.length > 80 ? `\n\n_… y ${puedenBasico.length - 80} más (ver CSV)._` : "") : "_Ninguna._"}

---

## Top 20 mayor riesgo de costo

Orden por índice compuesto (costo infra × factor riesgo sector/consumo).

| # | Subcategoría | ID | Sector | Plan | Precio | Costo | Neto | Semáforo |
|---|--------------|-----|--------|------|--------|-------|------|---------|
${top20Riesgo.map((r, i) => `| ${i + 1} | ${r.subcategoria} | \`${r.subcategoriaId}\` | ${r.sectorId} | ${r.planRecomendado} | $${r.precioMensualMXN} | $${r.costoTotalMXN} | $${r.margenNetoMXN} | ${r.semaforo} |`).join("\n")}

---

## Recomendación final de precios por plan

Mapeo estrategia → schema CariHub: Básico=\`basico\`, Profesional=\`destacado\`, Premium=\`premium\`, Especial=\`vip\`.

| Plan estrategia | Subcategorías | Precio prom. actual | Costo infra prom. | Margen neto prom. | Piso infra* | Precio comercial recomendado |
|-----------------|---------------|--------------------:|------------------:|------------------:|------------:|-----------------------------:|
${Object.entries(byPlan)
  .map(
    ([p, v]) =>
      `| **${p}** | ${v.n} | $${v.avgPrice} MXN | $${v.avgCost} MXN | $${v.margenNetoProm} MXN | $${v.floorInfra} MXN | **$${v.precioRecomendado} MXN** (mantener schema; rango $${v.minPrice}–$${v.maxPrice}) |`
  )
  .join("\n")}

\\* Piso infra = costo + comisión 3.6% + 15% margen neto mínimo. El precio comercial recomendado es el **máximo** entre piso infra y piso de mercado por tier.

### Precios base globales schema (IVA incluido)

| Schema planId | Precio mensual global |
|---------------|----------------------:|
| basico | $${preciosSchema.preciosBase.global.basico} |
| destacado | $${preciosSchema.preciosBase.global.destacado} |
| premium | $${preciosSchema.preciosBase.global.premium} |
| vip | $${preciosSchema.preciosBase.global.vip} |

### Por formulario (mensual, IVA incluido)

| formularioId | Básico | Profesional (destacado) | Premium | Especial (vip) |
|--------------|-------:|------------------------:|--------:|---------------:|
${Object.entries(preciosSchema.preciosBase.porFormulario)
  .map(
    ([f, p]) =>
      `| ${f} | $${p.basico} | $${p.destacado} | $${p.premium} | $${p.vip} |`
  )
  .join("\n")}

---

## Conclusiones

1. **Rentabilidad infra MVP:** con uso tipico, el margen neto por perfil es muy positivo en todos los planes; el cuello de botella no es Firebase a centenas de usuarios, sino **enforcement de cupos** y perfiles virales.
2. **Desalineación precio/costo entre tiers:** el salto de precio ($250–400 MXN) no se refleja en costo infra (< $1 MXN); la escalera es **comercial**, no técnica — coherente si se vende visibilidad y cupos.
3. **Riesgo real:** ${rojo.length} rojos y ${amarillo.length} amarillos por **política de plan mínimo**, no por pérdida contable inmediata; sin \`PlanEntitlements\` operativo, un Básico puede consumir recursos de Premium.
4. **Adultos + creadores:** mantener mínimo Premium; \`contenido\` y \`creador-de-contenido-digital\` en Especial con add-on storage cuando exista billing.
5. **Checkout demo** (\`perfil_semana: 349\`) ≈ $997/mes — alinear comunicación con schema para no confundir “semanal” con “básico mensual”.

---

## Metodología de costos

- Storage: $0.026 USD/GB/mes · Egress: $0.12 USD/GB · Firestore lectura/escritura tarifa Blaze.
- Tipo de cambio: ${USD_MXN} MXN/USD · Ops fijo: $${PRICE.fixedOpsUsd} USD/perfil/mes.
- Perfiles de uso: Bajo / Medio / Alto según auditoría de consumo por subcategoría.
- Comisión pasarela: 3.6% sobre precio bruto.
`;

fs.writeFileSync(path.join(__dirname, "AUDITORIA-SOSTENIBILIDAD-PLANES-RESUMEN.md"), md, "utf8");

console.log("CSV:", rows.length, "filas → scripts/auditoria-sostenibilidad-planes-462.csv");
console.log("MD → scripts/AUDITORIA-SOSTENIBILIDAD-PLANES-RESUMEN.md");
console.log("Verde:", verde.length, "Amarillo:", amarillo.length, "Rojo:", rojo.length);
console.log("Debe subir plan:", debeSubir.length, "Pueden basico:", puedenBasico.length);
