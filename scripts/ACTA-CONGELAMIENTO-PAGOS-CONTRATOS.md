# Acta formal de congelamiento — Pagos-Contratos CariHub

| Campo | Valor |
|---|---|
| **Versión acta** | 1.0.0 |
| **Versión Pagos-Contratos** | `pagos-contratos-2026-06-11` @ **1.0.0** |
| **Fecha congelamiento** | 2026-06-11 |
| **Estado** | **CONGELADO** |
| **Veredicto final** | **PASS** (24/24 validación acta; 21/21 auditoría SPEC) |
| **¿Procede congelamiento?** | **SÍ** (diseño documental) |
| **Modo** | Solo documentación — **sin runtime/Firestore/deploy/commit; no modifica documentos existentes** |

Canónico: [`ACTA-CONGELAMIENTO-PAGOS-CONTRATOS.json`](./ACTA-CONGELAMIENTO-PAGOS-CONTRATOS.json)

Baseline: [`SPEC-PAGOS-CONTRATOS.md`](./SPEC-PAGOS-CONTRATOS.md) · [`fixtures-pagos-contratos-golden.json`](./fixtures-pagos-contratos-golden.json) · [`AUDITORIA-SPEC-PAGOS-CONTRATOS.md`](./AUDITORIA-SPEC-PAGOS-CONTRATOS.md)

**Principio rector:** *El pago confirma; el contrato congela; el motor activa.*

---

## Autorización

- **Estado:** APROBADA por product owner / usuario CariHub (2026-06-11).
- **Alcance:** baseline de **diseño** Pagos-Contratos v1.0.0 — referencia **obligatoria** para pricing, contratos, pagos, comprobantes, renovaciones, activación de servicio y conciliación admin.
- **Runtime:** NO autorizado en este congelamiento.

---

## ¿Capa Pagos-Contratos oficialmente congelada?

**Respuesta global: PARCIALMENTE**

| Ámbito | ¿Congelado? | Detalle |
|---|---|---|
| Diseño/arquitectura documental v1.0.0 | **SÍ** | SPEC + fixtures + políticas = fuente oficial de verdad |
| Runtime / pasarela / producción | **NO** | BLK-02, PaymentLedger prod, conciliación runtime requieren autorización explícita |

**Justificación:** auditoría PASS 88% sin bloqueantes; SPEC y fixtures completos; 21/21 verificaciones consistencia; dependencias compatibles; pero runtime no autorizado, pasarela TBD, validador script pendiente, cobro manual prod (PC-R01).

---

## Veredicto y métricas

| Métrica | Valor |
|---|---|
| Completitud | ~88% |
| Madurez diseño | ~86% |
| Readiness construcción | ~78% |
| Readiness MVP-COBRAR (capa Pagos) | ~72% |
| Readiness producción | ~28% |
| GAP-SPEC-PAY | **cerrado** |

---

## Documentos fuente validados

| Documento | Resultado |
|---|---|
| PLAN-MAESTRO-PAGOS-CONTRATOS v1.0.0 | PASS |
| SPEC-PAGOS-CONTRATOS v1.0.0 | PASS |
| AUDITORIA-SPEC-PAGOS-CONTRATOS v1.0.0 | PASS (21/21) |
| fixtures-pagos-contratos-golden.json (PAY-01..PAY-10) | PASS |
| ACTA-CONGELAMIENTO-REGISTRO-CUENTA v1.0.0 | PASS |
| Shared/Core 1.0.0 | PASS (consumo) |
| FieldEngine 1.0.1 | PASS (consumo) |
| ValidationEngine 1.1.0 | PASS (consumo) |
| RenderEngine 1.0.0 | PASS (consumo) |
| Seguridad MVP 1.0.0 | PASS |
| ACTA-DASHBOARDS 1.0.0 | PASS (DM-04/05/06) |
| ACTA-CUENTAS 1.0.0 | PASS |
| ACTA-SEO-LANDINGS 1.0.0 | PASS (/cuenta/pagos noindex) |
| PLAN-MAESTRO-ECONOMIA-SOCIAL v1.0.0 | PASS (MXN congelado; propinas Post-MVP) |
| ANEXO-CRIPTOMONEDAS-PAGOS-CONTRATOS v1.0.0 | PASS (cripto fuera MVP) |
| ACTA-P0 Runtime Foundation | PASS (GAP-SPEC-PAY cerrado) |
| AUDITORIA-MAESTRA / MATRIZ-MVP / ROADMAP | PASS (coherencia) |

**Bloqueantes documentales:** 0

---

## Alcance congelado

### Módulos
PricingResolver, ContractFactory, PaymentLedger (diseño), ComprobanteValidator, activación servicio, RenewalScheduler.

### Productos
- **Perfiles:** membresía, renovación
- **Banners:** banner, campaña, espacio, paquete
- **Separación obligatoria PC-R05:** productos perfil NUNCA usan precios_banners

### Pricing y contratos
- Moneda **MXN**, IVA incluido, redondeo 50
- Planes: básico, destacado, premium, VIP
- **politicaPrecioCongelado:** precioContratado + versionPrecio + promocionAplicada fijos en vigencia

### Métodos pago MVP
Transferencia, SPEI, comprobante manual (confirmación admin).

### Activación
`pago_confirmado + contrato_activo + revision_ok` → publicado/activo vía ValidationEngine + RenderEngine.

### Fronteras
- **Registro:** estados pre-pago; NO cobra
- **Dashboard:** DM-04 vigencia, DM-05 pagos, DM-06 renovación — solo lectura
- **Admin:** conciliación, confirmar/rechazar, reembolsos doble confirmación
- **RenderEngine:** activo/vencido → publicar/ocultar

### Rutas
`/cuenta/pagos/*`, `/cuenta/contratos/*`, `/cuenta/facturacion/*` — **noindex,nofollow**

---

## Alcance NO congelado

- Runtime, Firestore colecciones pagos/contratos, deploy
- Pasarela Stripe/Mercado Pago (BLK-02)
- PaymentLedger producción
- `validar-spec-pagos-contratos.mjs` (PAY-AM-02)
- CFDI automático (Post-MVP)
- Cripto wallet (ANEXO fase P3)
- ADR-PASARELA-PAGO (recomendado pre-BLK-02)

---

## Dependencias congeladas

| Dependencia | Versión | Rol | Contradicciones |
|---|---|---|---|
| Shared/Core | 1.0.0 | clients, hub | ninguna |
| FieldEngine | 1.0.1 | campos fiscales; NO pricing | ninguna |
| ValidationEngine | 1.1.0 | gates pago/renovación/comprobante | ninguna |
| RenderEngine | 1.0.0 | publicar/ocultar por estado contrato | ninguna |
| Seguridad MVP | 1.0.0 | rate limits, doble confirmación | ninguna |
| Dashboards | 1.0.0 | DM-04/05/06 lectura | ninguna |
| ACTA-CUENTAS | 1.0.0 | usuarioId hub | ninguna |
| Registro-Cuenta | 1.0.0 | renovación delegada; NO cobra | ninguna |
| SEO-Landings | 1.0.0 | /cuenta/pagos noindex | ninguna |
| Economía Social | plan 1.0.0 | propinas Post-MVP; MXN congelado | ninguna |
| Anexo Criptomonedas | 1.0.0 | cripto fuera MVP | ninguna |

---

## Contratos congelados (9)

Pago, ContratoPerfil, ContratoBanner, Renovacion, ComprobantePago, PrecioResuelto, PromocionAplicada, AceptacionDigital, SnapshotPrecioCongelado

---

## Matrices congeladas (14)

`productoPrecioVigencia`, `resolucionPrecio`, `pagoServicioActivacion`, `contratoProducto`, `estadoPagoAcciones`, `transicionPago`, `transicionContrato`, `rolPermisos`, `metodoPago`, `promocionAplicacion`, `fronteraModulos`, `errorMensaje`, `comprobanteValidacion`, `fiscalClasificacion`

---

## Readiness de construcción (capa Pagos)

| Dimensión | Antes SPEC | Después acta |
|---|---|---|
| Documental | ~45% | ~88% |
| Arquitectura diseño | ~45% | ~86% |
| Contratos | ~40% | ~90% |
| Validación (fixtures) | ~35% | ~85% |
| Seguridad integración | ~50% | ~82% |
| Activación servicio | ~55% | ~88% |
| Dashboard frontera | ~53% | ~78% |
| Integración motores | ~65% | ~86% |

**Agregados:** construcción ~78% · MVP-COBRAR ~72% · producción ~28%

---

## Impacto ACTA-P0 (recálculo documental)

| Métrica | Antes | Post SPEC/Audit | Después acta |
|---|---|---|---|
| CAP-12 Pagos-Contratos | 45% (PLAN+schemas) | 88% (SPEC+AUDIT) | **88% (CONGELADO_DISENO)** |
| GAP-SPEC-PAY | abierto | cerrado doc | **cerrado** |
| % global P0 construcción | 72% | 82% | **~84%** |
| MVP-COBRAR readiness | 45% | 70% | **72%** |

**Bloqueadores restantes:** BLK-01 migración, GAP-PANEL-DASH, BLK-02 pasarela, BLK-05 rules, autorización runtime explícita.

*Nota: ACTA-P0 no modificada; recálculo declarado en esta acta.*

---

## Reevaluación Arquitectónica Global

Recálculo desde AUDITORIA-MAESTRA v1.0.0 (2026-06-11) incorporando ACTA-RC + SPEC/AUDIT/ACTA-PAY, sin re-auditar corpus completo.

### Readiness recalculados

| Dimensión | Baseline AM | Post ACTA-PAY |
|---|---|---|
| Readiness documental global | 76% | **~83%** |
| Readiness arquitectónico global | 45% (10/22) | **~55%** (12/22) |
| Readiness construcción P0 | 72% → 82% | **~84%** |
| Readiness MVP (MVP-OPERAR doc) | ~68% | **~74%** |
| Readiness producción | ~25% doc / ~8% runtime | **~28%** |

| Indicador | Valor |
|---|---|
| **Porcentaje actual real del proyecto** (doc ponderado) | **~83%** |
| **Porcentaje faltante documental** | **~17%** |
| **Porcentaje faltante runtime/implementación** | **~72%** |

### Capas completamente cerradas (diseño — 9)

Shared/Core, FieldEngine, ValidationEngine, RenderEngine, Catálogo, Messenger (fuera P0), SEO-Landings, **Registro-Cuenta**, **Pagos-Contratos**

### Capas parcialmente cerradas (7)

Cuentas, Seguridad MVP, Dashboards (shell; GAP-PANEL-DASH), Migración (diseño auditado), Admin, App Pública, Banners

### Capas abiertas (5)

Economía Social, Interacciones, ThemeEngine, Agentes-IA, i18n

### Bloqueadores restantes

BLK-01 (migración), BLK-02 (pasarela), BLK-04 (resultados client-side), BLK-05 (Firestore rules), BLK-06 (robots/sitemap), BLK-08 (SC extracción), BLK-10 (Turnstile), autorización runtime explícita

### Gaps restantes

GAP-PANEL-DASH, GAP-07 Admin SPEC, GAP-06 Economía Social SPEC, GAP-03/04/05 Interacciones/Theme/IA, GAP-08 i18n, GAP-09 Runtime SC, GAP-10 validadores, ADR-PASARELA-PAGO, plan adopción SC, AUDITORIA-MAESTRA v1.1

---

## Preguntas explícitas

### 1. ¿Tenemos suficiente arquitectura aprobada para comenzar construcción P0?

**PARCIALMENTE (~84%).**

Motores congelados (SC/FE/VE/RE) + SEO/SEC diseño + RC/PAY diseño permiten iniciar **construcción acotada P0** (engines, bridge migración, gates seguridad). **No** autoriza MVP-OPERAR completo ni runtime Pagos/Registro sin autorización explícita y cierre BLK-01/BLK-05.

### 2. ¿Qué porcentaje real falta antes de construir?

| Tipo | % faltante |
|---|---|
| Documentación P0 restante | **~16%** |
| Runtime total del proyecto | **~72%** |
| MVP-OPERAR doc completo | **~26%** |

Incluye: panel mínimo, plan adopción SC, ADR pasarela, validadores, alineación Firestore rules.

### 3. ¿Cuáles son los 20 pendientes documentales más importantes?

1. SPEC-PANEL-DASHBOARD-MINIMO (GAP-PANEL-DASH)
2. Plan adopción física Shared/Core (BLK-08)
3. ADR-PASARELA-PAGO (Stripe vs Mercado Pago)
4. `validar-spec-pagos-contratos.mjs`
5. `validar-spec-registro-cuenta.mjs`
6. Documento alineación Firestore rules (BLK-05)
7. SPEC-APP-PUBLICA desacople monolito (BLK-04)
8. ACTA-MIGRACION fase ejecución runtime (plan operativo)
9. `validar-spec-seo-landings.mjs`
10. `validar-spec-shared-core.mjs`
11. SPEC-ADMIN formal (GAP-07)
12. Re-audit P0 cross-actas (ACTA-P0 v1.1 refresh)
13. AUDITORIA-MAESTRA v1.1 (incorporar RC+PAY actas)
14. SPEC-BANNERS-PUBLICIDAD
15. REPORTE-CONGELAMIENTOS-CONSOLIDADO v1.1
16. SPEC-ECONOMIA-SOCIAL (GAP-06 — Post-MVP)
17. Plan i18n dedicado (GAP-08)
18. SPEC-THEMEENGINE (GAP-04)
19. SPEC-AGENTES-IA (GAP-05)
20. SPEC-INTERACCIONES (GAP-03)

### 4. ¿Qué capas deben cerrarse antes de autorizar runtime?

**Prerequisitos documentales mínimos:**
- GAP-PANEL-DASH (frontera DM-03..10 operativa)
- Plan adopción física SC
- ADR pasarela (si BLK-02 en scope)
- Alineación Firestore rules (BLK-05)

**Prerequisitos de ejecución:**
- Autorización runtime explícita del product owner
- BLK-01 migración bridge perfilId
- BLK-05 rules deploy
- BLK-10 Turnstile (beta pública)

**Runtime parcial sin nueva SPEC:** SC (con plan adopción), FE, VE, RE, SEC gates, SEO robots estático

### 5. ¿Qué capas ya no requieren más documentación?

**Diseño congelado completo (acta v1.0.0):** Shared/Core, FieldEngine, ValidationEngine, RenderEngine, Catálogo, Messenger, SEO-Landings, Registro-Cuenta, **Pagos-Contratos**

**Solo validadores CI pendientes (no nueva SPEC):** 10 SPECs con fixtures golden

**Fuera alcance MVP (plan suficiente):** Economía Social, Interacciones, Agentes-IA, i18n, ThemeEngine

---

## Riesgos

### Aceptados (con mitigación congelada)
- Cobro manual MVP (PC-R01) → PaymentLedger diseño + conciliación admin
- Pasarela fuera MVP → webhook documentado; ADR pre-BLK-02
- CFDI automático ausente → facturación manual Post-MVP
- Cripto regulación → ANEXO fase P3

### Abiertos
- Pasarela BLK-02 (PAY-RO01)
- Validador script (PAY-AM-02)
- PaymentLedger prod (PAY-RO03)
- Migración perfilId prerequisito (PAY-SPEC-01 / BLK-01)
- Firestore rules pagos/contratos (BLK-05)

---

## Gobernanza de cambios

| Tipo | Ejemplos |
|---|---|
| **Sin ADR** | Fixtures PAY-11+, validador script, clarificaciones PATCH, PAY-E* |
| **Requiere ADR** | Pasarela primaria, cripto MVP, cambio politicaPrecioCongelado, multi-moneda |
| **Requiere SPEC** | Wallet/cripto flujo pagos, CFDI automático, propinas en contrato |
| **Requiere Acta** | SPEC-PAGOS-CONTRATOS 1.1+ / 2.0+, cambio PC-R05 separación |

---

## Recomendación siguiente capa

1. **SPEC-PANEL-DASHBOARD-MINIMO** — GAP-PANEL-DASH
2. **Runtime migración bridge perfilId** — BLK-01 (RD-01)
3. **Plan adopción física Shared/Core** — BLK-08
4. **validar-spec-pagos-contratos.mjs** — PAY-AM-02
5. **ADR-PASARELA-PAGO** — pre-BLK-02

---

## Implementación

| Campo | Valor |
|---|---|
| runtimeAutorizado | **false** |
| firestoreAutorizado | **false** |
| deployAutorizado | **false** |

v1.0.0 congelada como **diseño documental**. Implementación runtime requiere autorización explícita posterior.

---

## Referencias

- [`ACTA-CONGELAMIENTO-PAGOS-CONTRATOS.json`](./ACTA-CONGELAMIENTO-PAGOS-CONTRATOS.json)
- [`SPEC-PAGOS-CONTRATOS.json`](./SPEC-PAGOS-CONTRATOS.json)
- [`AUDITORIA-SPEC-PAGOS-CONTRATOS.json`](./AUDITORIA-SPEC-PAGOS-CONTRATOS.json)
- [`fixtures-pagos-contratos-golden.json`](./fixtures-pagos-contratos-golden.json)
- [`PLAN-MAESTRO-PAGOS-CONTRATOS.json`](./PLAN-MAESTRO-PAGOS-CONTRATOS.json)
- [`ACTA-CONGELAMIENTO-REGISTRO-CUENTA.json`](./ACTA-CONGELAMIENTO-REGISTRO-CUENTA.json)
- [`ACTA-CONGELAMIENTO-P0-RUNTIME-FOUNDATION.json`](./ACTA-CONGELAMIENTO-P0-RUNTIME-FOUNDATION.json)
- [`AUDITORIA-MAESTRA-CARIHUB.json`](./AUDITORIA-MAESTRA-CARIHUB.json)
