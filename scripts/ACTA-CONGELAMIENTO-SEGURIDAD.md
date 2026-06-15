# Acta formal de congelamiento — Seguridad MVP

| Campo | Valor |
|-------|-------|
| **Estado** | **CONGELADO** |
| **Versión** | `seguridad-2026-06-10` · semver **1.0.0** |
| **Fecha congelamiento** | 2026-06-09 |
| **Aprobación** | Product owner — 2026-06-09 |

Artefacto canónico: [`ACTA-CONGELAMIENTO-SEGURIDAD.json`](./ACTA-CONGELAMIENTO-SEGURIDAD.json)

---

## Decisiones aprobadas

1. **Cloudflare Turnstile** — anti-bots principal (formularios web)
2. **Firebase Authentication** — proveedor de identidad
3. **Verificación email** — obligatoria (Firebase Auth nativa)
4. **riesgoScore, reputacionCuenta, nivelConfianza, estadoSeguridad** — integrados a `identidadUsuario`
5. **Logs** — `logsSeguridad`, `logsAdmin`, `logs_acceso_privado`, `alertas_seguridad`
6. **Rate limits** — IP, usuario, email, teléfono, dispositivo (formularios críticos)
7. **Messenger** — `estadoMensajeria`, reputación, spamScore, bloqueos, límites (diseño)
8. **Firebase App Check** — capa complementaria SDK (MVP recomendado)
9. **Post-MVP** — OTP teléfono, 2FA, RBAC avanzado, device fingerprint, ML fraude

---

## Tres capas congeladas

| Capa | Versión | Acta |
|------|---------|------|
| Catálogo | 1.0.0 | [`ACTA-CONGELAMIENTO-CATALOGO`](./ACTA-CONGELAMIENTO-CATALOGO.md) |
| Cuentas | 1.0.0 | [`ACTA-CONGELAMIENTO-CUENTAS`](./ACTA-CONGELAMIENTO-CUENTAS.md) |
| Seguridad MVP | 1.0.0 | Este documento |

---

## Historial

| Semver | Fecha | Evento |
|--------|-------|--------|
| 1.0.0 | 2026-06-09 | **CONGELAMIENTO_INICIAL** — aprobado |

---

*Acta de diseño. Sin implementación runtime ni cambios Firestore.*
