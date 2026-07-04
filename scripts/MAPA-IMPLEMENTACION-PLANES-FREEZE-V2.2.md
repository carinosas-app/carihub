# Mapa implementación — planes definitivos × freeze v2.2

Estado: **aprobado** (Trial Profesional 30d · Básico opción B · 4 planes pago)  
Base producto: `scripts/PLANES-CARIHUB-DEFINICION-FINAL.md`  
Freeze: `scripts/github-issues-master-v2.2.json` (LAUNCH-6D, 23 tickets)

**Regla:** no crear tickets ENT-* ni módulos nuevos. Absorber en tickets freeze existentes ampliando criterios de aceptación.

---

## 1. Tickets freeze v2.2 a MODIFICAR

| Ticket | Qué agregar |
|--------|-------------|
| **ECO-000** | Acta: 5 niveles (trial, basico, destacado, premium, vip), `contratos_perfiles` con `planContratado`, `entitlementsSnapshot`, `origenPlan` (trial\|pago\|referido), flujo trial→activo→vencido. Ref `PLANES-CARIHUB-DEFINICION-FINAL.md`. |
| **ECO-015** | **Núcleo planes:** PricingResolver + **EntitlementsResolver** + PromoResolver (trial 30d Profesional, referidos/días gratis, negocio 2×1). Cupos: fotos, videos, estados, lives, chat, storage. Plan mínimo por subcategoriaId/sectorId. Schema seed `config-plan-entitlements` en Firestore. Callable `resolveEntitlements`, `uploadGate`. |
| **ECO-010** | `ordenes_pago`: planId, planMinimoRequerido, entitlementsSnapshot, promocionId, origenPlan. Índices por perfilId+planId. |
| **ECO-020** | Checkout perfil: selector plan (4 tiers), bloqueo bajo plan mínimo categoría, trial $0 sin pasarela, upgrade/downgrade explícito post-trial. Consume solo ECO-015. |
| **ECO-030** | Activación: planId, vigencia, trial_profesional→activo, init `usage/current`, aplicar entitlements; promo referido días extra. |
| **ECO-031** | Paridad ECO-030. |
| **ECO-040** | `trial_expirado`, grace 7d, vencimiento entitlements, purge estados vencidos, orphans storage (cleanup), retención media perfil vencido N días. |
| **ECO-055** | Renovación + **upgrade/downgrade** (nueva orden, nuevo planId, prorrateo opcional v2). Avisos 7d/1d fin trial (fusiona ECO-050). |
| **ECO-080** | Panel económico + **widget uso plan** (galería/estados/lives/chat/GB) + banner trial + CTA upgrade recomendado. |
| **ADM-000** | Al aprobar registro: `publicado` con promo `primer_mes_gratis` → plan efectivo **Profesional** 30d (`autorizado_gratis` / flujo perfiles_personales_primer_mes_gratis). |
| **ADM-020** | Admin: precios + **cupos por plan** + overrides categoría + excepciones perfil + promos (trial, referidos, 2×1 negocio). Sin romper contratos activos. |
| **EST-010** | Schema estado: validar contra `estados.activosMax` del plan. |
| **EST-020** | UI crear estado: preUploadValidate + bloqueo si plan sin estados (Básico). |
| **EST-030** | Checkout estado pagado (si aplica) vía ECO-020. |
| **LIVE-010** | UI live: gate `lives.habilitado` Premium/Especial. |
| **LIVE-020** | Publicar live: minutos/mes del plan. |
| **LIVE-030** | Checkout live vía ECO-020 (si producto separado). |
| **TICKET-003** | `perfilesVinculados[]`: planIdActivo, trialHasta, origenPlan por perfil. |
| **MSG-011** | Storage chat + **cupo adjuntosChatMesMax** vía EntitlementsResolver (post-launch messenger, acoplado a ECO-015). |
| **config-estados-revision-publicacion** (ref ADM-000) | Trial = entitlements **Profesional**, no genérico. |

**Scripts congelados a alinear (sin ticket nuevo):**

- `config-precios-planes-perfiles-schema.json` — limites completos Básico opción B  
- `config-promociones-perfiles-schema.json` — trial Profesional explícito  
- `config-plan-entitlements-schema.json` — seed Firestore  
- `PLANES-CARIHUB-DEFINICION-FINAL.md` — fuente de verdad cupos/precios  

---

## 2. Tickets ENT / externos NO necesarios (absorbidos)

| Origen | Absorbido en |
|--------|--------------|
| ENT-001 Schema | ECO-015 |
| ENT-002 Resolver | ECO-015 |
| ENT-003 usage/current | ECO-030 + ECO-010 schema |
| ENT-010 preUpload cliente | EST-020, LIVE-020, ECO-015 helper JS, registro-perfil |
| ENT-011 uploadGate | ECO-015 Functions |
| ENT-012 Storage v2 | MSG-011 + criterios ECO-015 (perfil paths) |
| ENT-013 inventario uploads | Criterios aceptación ECO-015 + EST/LIVE tickets |
| ENT-020 Dashboard uso | **ECO-080** |
| ENT-030 Admin cupos | **ADM-020** |
| ENT-031 Overrides categoría | **ADM-020** |
| ENT-032 Excepciones perfil | **ADM-020** |
| ENT-040 Cleanup estados | **ECO-040** |
| ENT-041 Cleanup lives | **ECO-040** + LIVE-030 |
| ENT-042 Huérfanos storage | **ECO-040** |
| ENT-043 Media perfil vencido | **ECO-040** |
| ENT-050 Matriz categoría | **ECO-015** + **ECO-020** |
| ENT-051 Gate checkout mínimo | **ECO-020** |
| ENT-052 Packs | Post-launch (fuera LAUNCH-6D); no bloquea MVP planes |
| ENT-053 QA alto riesgo | Checklist en ECO-080 criterios aceptación |
| ENT-054 Trial onboarding | **ECO-015** + **ADM-000** + **ECO-040** + **ECO-030** |
| ECO-050 | Ya fusionado en **ECO-055** |
| Ticket separado PlanEntitlements | No — vive en **ECO-015** |

---

## 3. Dónde vive cada funcionalidad

| Funcionalidad | Ticket principal | Secundarios |
|---------------|------------------|-------------|
| **Trial 30 días Profesional** | ADM-000 (aprobar→publicado promo) | ECO-015 PromoResolver, ECO-030 activación, ECO-040 expiración, ECO-080 banner, config-promociones-perfiles |
| **Planes y precios** | ECO-015 PricingResolver | ECO-020 checkout, ADM-020 admin, config-precios-planes-perfiles-schema |
| **Entitlements (fotos, video, estados, lives, chat, storage)** | **ECO-015** EntitlementsResolver | EST-010/020, LIVE-010/020, MSG-011, ECO-030 init usage |
| **Referidos y días gratis** | ECO-015 PromoResolver | ADM-020 CRUD promos, ECO-030 extensión vigencia, config-promociones-perfiles (tipo `referido_dias_gratis` al implementar) |
| **Dashboard de uso** | **ECO-080** | ECO-015 getUsageSnapshot, TICKET-013 contexto perfil |
| **Enforcement límites** | **ECO-015** uploadGate + resolveEntitlements | MSG-011 storage chat, EST-020, LIVE-020, storage.rules (MSG-011) |
| **Upgrade / downgrade** | **ECO-055** + **ECO-020** | ECO-030 nueva activación, ECO-015 recalc entitlements, ECO-080 CTA |
| **Admin planes y beneficios** | **ADM-020** | ADM-000 flujos promo, config-plan-entitlements Firestore |

---

## 4. Dependencias (grafo)

```
TICKET-001 ─┬─ TICKET-003
            │
ECO-000 ────┼─ ECO-015 ◄── PLANES-CARIHUB-DEFINICION-FINAL (schema scripts)
            │      │
            │      ├── ECO-010
            │      │      ├── ADM-000 (trial al aprobar)
            │      │      └── ECO-020 (checkout + plan mínimo)
            │      │             └── ECO-030 ── ECO-031
            │      │                    └── ECO-040 ── ECO-055
            │      │                           └── ECO-080 (uso + pagos)
            │      │
            │      ├── EST-010 ── EST-020 ── EST-030
            │      └── LIVE-010 ── LIVE-020 ── LIVE-030
            │
            └── ADM-020 (precios + cupos + promos)

MSG-011 (post-launch) ── depende ECO-015 + TICKET-001
BAN-010 ── independiente de planes perfil (paralelo)
```

**Bloqueadores LAUNCH-6D para planes:** ECO-015 ampliado es el **nuevo crítico** entre ECO-000 y ECO-020.

---

## 5. Orden recomendado de implementación

| Fase | Tickets | Entregable |
|------|---------|------------|
| **0 — Schemas** | Scripts only | limites Básico B, promos trial Profesional, seed entitlements JSON |
| **1 — Foundation** | TICKET-001, TICKET-003 | Firebase + multi-perfil con planId por perfil |
| **2 — Acta económico** | ECO-000 | SPEC alineado planes 5 niveles |
| **3 — Motor planes** | **ECO-015** | Pricing + Entitlements + Promos + uploadGate + Firestore seed |
| **4 — Pagos base** | ECO-010, BAN-010 (paralelo) | ordenes_pago + slots |
| **5 — Admin + trial** | ADM-000 | Aprobar → trial Profesional 30d |
| **6 — Checkout** | ECO-020 | Pago + plan mínimo + upgrade path |
| **7 — Webhooks** | ECO-030, ECO-031 | Activación contrato + usage |
| **8 — Producto** | EST-*, LIVE-*, TICKET-012/013 | Estados/lives/rail con gates |
| **9 — Ciclo vida** | ECO-040, ECO-055, ECO-080 | Vencimiento, renovación, dashboard uso |
| **10 — Admin comercial** | ADM-020 | Precios, cupos, promos, overrides |
| **11 — Messenger cupos** | MSG-011 (post-launch) | Chat imgs con límite plan |

---

## 6. Qué puede empezar YA (sin deploy)

| Inmediato | Acción |
|-----------|--------|
| ✅ | Actualizar schemas scripts (`config-precios`, `config-promociones`, `config-plan-entitlements`) con Básico opción B + trial Profesional |
| ✅ | Ampliar cuerpo tickets ECO-015, ECO-080, ADM-020, ECO-040 en JSON freeze (criterios aceptación) |
| ✅ | Implementar `functions/payments/pricing-resolver.js` + `entitlements-resolver.js` (tests unitarios fixtures golden) |
| ✅ | Seed Firestore `config_plan_entitlements/global` en emulador |
| ✅ | TICKET-001 / TICKET-003 si aún parciales |
| ⏸️ | ECO-020 checkout UI — tras ECO-015 callable estable |
| ⏸️ | MSG-011 — post-launch messenger slice (Básico ya define 10 chat imgs cuando messenger exista) |
| ⏸️ | ENT-052 packs — post-launch |

---

## 7. Fuera de LAUNCH-6D (no bloquea congelamiento planes)

- MSG-* messenger completo (adjuntos enforcement acoplado ECO-015 cuando entre)
- VIP-*, ECO-070 suscripciones comunidad
- Packs venta digital (Especial creadores)
- AUD-* audit log unificado
