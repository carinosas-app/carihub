# Acta formal de congelamiento — CariHub Messenger

| Campo | Valor |
|-------|-------|
| **Versión acta** | 1.0.0 |
| **Messenger** | **1.0.0** (SPEC formal) |
| **Fecha elaboración** | 2026-06-09 |
| **Fecha congelamiento** | 2026-06-09 |
| **Estado acta** | **CONGELADO** |
| **Aprobado por** | Product owner / usuario CariHub |
| **Auditoría final** | [`AUDITORIA-FINAL-SPEC-MESSENGER.md`](./AUDITORIA-FINAL-SPEC-MESSENGER.md) — OB-MSG-1–8 cerrados |
| **Validación diseño** | 21/21 PASS |
| **Runtime** | **NO autorizado** |

Canónico: [`ACTA-CONGELAMIENTO-MESSENGER.json`](./ACTA-CONGELAMIENTO-MESSENGER.json)

---

## Objeto

**Séptima capa de diseño congelada:** CariHub Messenger v1.0.0 — mensajería interna, IA-Seguridad, automatizaciones y control admin granular (11 ámbitos).

## Artefactos baseline

- [`SPEC-MESSENGER.md`](./SPEC-MESSENGER.md) / [`.json`](./SPEC-MESSENGER.json)
- [`fixtures-messenger-golden.json`](./fixtures-messenger-golden.json) — 30 casos M01–M30
- [`AUDITORIA-SPEC-MESSENGER.json`](./AUDITORIA-SPEC-MESSENGER.json)
- [`AUDITORIA-FINAL-SPEC-MESSENGER.json`](./AUDITORIA-FINAL-SPEC-MESSENGER.json)
- [`registry-messenger-fanout-propuesta.json`](./registry-messenger-fanout-propuesta.json) — v1.0.1
- [`ANEXO-MESSENGER-INTEGRACION-DASHBOARDS.json`](./ANEXO-MESSENGER-INTEGRACION-DASHBOARDS.json)
- [`PROPUESTA-ACTA-MINOR-VALIDATIONENGINE-MESSENGER.json`](./PROPUESTA-ACTA-MINOR-VALIDATIONENGINE-MESSENGER.json)
- [`validar-spec-messenger.mjs`](./validar-spec-messenger.mjs)

## Ajustes obligatorios cerrados

| ID | Resumen |
|----|---------|
| OB-MSG-1 | Estados normalizados; aceptar→`activa` |
| OB-MSG-2 | `conversaciones_meta` canónica |
| OB-MSG-3 | Inicio directa \| solicitud + fanOut |
| OB-MSG-4 | Registry fanOut 24 entradas |
| OB-MSG-5 | `admin_automatizaciones_suspendir` en catálogo VE |
| OB-MSG-6 | Algoritmo `conversacionId` sha256 |
| OB-MSG-7 | Anexo integración Dashboards |
| OB-MSG-8 | `telefonoVerificado`, `spamScore`, VE-MINOR |

## Dependencias congeladas

Catálogo 1.0.0 · Cuentas 1.0.0 · Seguridad MVP 1.0.0 · FieldEngine 1.0.1 · Dashboards 1.0.0 · ValidationEngine 1.0.0

**ValidationEngine no modificado** — cambios requeridos en propuesta acta MINOR VE 1.1.0.

## Implementación

Congelamiento = **solo diseño**. Runtime, Firestore, producción y deploy **no autorizados** sin acta posterior.

---

*Acta CONGELADA — aprobación product owner 2026-06-09*
