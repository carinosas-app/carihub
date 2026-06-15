# Reporte Seguridad MVP — CariHub

**Fecha:** 2026-06-09 · **Estado:** Diseño completo · **Runtime:** no implementado

Schema de diseño: [`config-seguridad-mvp-schema.json`](./config-seguridad-mvp-schema.json)

---

## Resumen ejecutivo

Tercera capa de arquitectura: **Seguridad MVP** — medidas mínimas anti-bots, anti-spam, reputación y auditoría obligatorias antes del lanzamiento público.

| Recomendación | Detalle |
|---------------|---------|
| **Anti-bot** | **Cloudflare Turnstile** (primario) |
| **Verificación email** | Firebase Auth (obligatorio MVP) |
| **Verificación teléfono** | Post-MVP |
| **¿Congelar antes de FieldEngine?** | **Sí** |

---

## 1. Protección anti-bots

### Cloudflare Turnstile

| Aspecto | Evaluación |
|---------|------------|
| **Ventajas** | Gratis, verificaciones ilimitadas (plan Free); sin perfilado cross-site; modos managed/invisible; WCAG 2.2 AAA; no requiere proxy Cloudflare |
| **Desventajas** | Máx. 20 widgets/cuenta Free; validación server-side obligatoria; Enterprise caro si escala widgets |
| **Costo MVP** | **$0/mes** |
| **Integración CariHub** | Widget en formulario → token → Cloud Function `verifyTurnstile` → acción permitida |

### Google reCAPTCHA v3

| Aspecto | Evaluación |
|---------|------------|
| **Ventajas** | Invisible; score continuo; ecosistema maduro |
| **Desventajas** | Free ~10.000 assessments/mes (2026); $8/mes 10K–100K; privacidad Google; umbrales opacos |
| **Costo MVP** | $0 si bajo volumen; **riesgo de costo al crecer** |
| **Integración** | `grecaptcha.execute` → siteverify → umbral ≥0.5 |

### Decisión recomendada

**Turnstile primario.** CariHub = 1 dominio, <10 formularios → cabe en plan Free. reCAPTCHA v3 solo como **fallback documentado** si Turnstile falla en cliente.

---

## 2. Formularios protegidos

| Formulario | Prioridad | Turnstile | Rate limit | Notas |
|------------|-----------|-----------|------------|-------|
| Login | Crítica | Sí | IP, email, dispositivo | Tras 5 fallos → bloqueo 15 min |
| Registro Auth | Crítica | Sí | IP, email | Antes de crear `usuarios/{id}` |
| Registro perfil | Crítica | Sí | usuario, IP | Wizard FieldEngine |
| Recuperación contraseña | Crítica | Sí | IP, email | 3/email/hora |
| Denuncias | Alta | Sí | IP, usuario | 10/usuario/día |
| Categorías sugeridas | Alta | Sí | usuario, IP | 3/usuario/día |
| Registro anunciante | Crítica | Sí | usuario, email | `solicitudes_anuncios` |
| Contacto público | Media | Sí | IP, email | 5/IP/hora |
| Publicaciones (auth) | Alta | No* | usuario, perfil | Gates reputación + estados |

\*Usuario autenticado; protección por `estadoSeguridad` y límites de edición.

---

## 3. Sistema anti-spam

### Dimensiones

IP · usuario · email · teléfono · dispositivo (hash en cookie/localStorage + servidor)

### Límites recomendados (MVP)

| Acción | IP | Usuario | Email | Teléfono | Dispositivo |
|--------|-----|---------|-------|----------|-------------|
| Registro cuenta | 5/h | — | 3/día | — | 3/día |
| Login fallido | 20/15m | 5/15m | 5/15m | — | 10/15m |
| Recuperación pwd | 10/h | — | 3/h | — | — |
| Denuncia | 15/día | 10/día | — | — | — |
| Categoría sugerida | 10/día | 3/día | — | — | — |
| Mensajes (futuro) | — | 60/h | — | — | burst 10/min |
| Edición perfil | — | 30/h | — | — | — |

Almacenamiento diseño: `rate_limits/{bucketId}` con TTL (implementación futura en Cloud Functions).

---

## 4. Riesgo y reputación (identidadUsuario)

Extensión de `usuarios.seguridad` (compatible con cuentas congeladas v1.0.0):

| Campo | Rango | Uso |
|-------|-------|-----|
| `riesgoScore` | 0–100 | Riesgo fraude/abuso; cola admin prioritaria |
| `reputacionCuenta` | 0–100 | Confianza agregada; visibilidad suave |
| `nivelConfianza` | 0–100 | Límites dinámicos Messenger |
| `duplicadoPotencial` | boolean | Misma IP/device/email similar |
| `flags` | string[] | EMAIL_NO_VERIFICADO, BOT_SOSPECHOSO, etc. |
| `estadoSeguridad` | enum | normal → bloqueado |

### Ejemplo cálculo `nivelConfianza`

```
nivelConfianza = min(100, reputacionCuenta + bonusVerificacion - riesgoScore)
bonusVerificacion: email +10, teléfono +15, INE +20, cédula +25
```

**Ejemplo:** Cuenta nueva, email verificado, sin incidentes → reputacion 55, riesgo 10, bonus 10 → **nivelConfianza 55**.

**Ejemplo:** 2 denuncias válidas → riesgo +40, reputacion -30 → nivelConfianza bajo → Messenger restringido.

---

## 5. Protección Messenger (futuro — solo diseño)

| Mecanismo | Regla |
|-----------|-------|
| `estadoMensajeria` | habilitada / restringida / suspendida / solo_lectura |
| `spamScore` | ≥60 restringir; ≥80 suspender |
| Bloqueos | `usuarios/{id}/bloqueos/{id}` |
| Reportes | 3+ reportes → revisión + riesgoScore |
| Límites | Cuenta nueva: 20 msg/24h; estándar: 60/h; burst: 10/min |

---

## 6. Logs y auditoría

| Colección | Propósito | Retención |
|-----------|-----------|-----------|
| `logsAdmin` | Acciones admin (aprobar, rechazar, precios) | 365 días |
| `logsSeguridad` | Login, rate limit, Turnstile, cambios estado | 180 días |
| `logs_acceso_privado` | Admin vio INE/teléfono | 730 días |
| `alertas_seguridad` | Umbrales críticos automáticos | Hasta resolución |

**PII:** prohibido en claro — solo `ipHash`, `deviceIdHash`, `uaHash`.

---

## 7. Impacto en módulos

| Módulo | Impacto |
|--------|---------|
| **Cuentas** | Extiende `usuarios.seguridad`; `estadoSeguridad` orthogonal a `estadoCuenta` |
| **Catálogo** | Sin cambio estructural; límites en categorías sugeridas |
| **FieldEngine** | Gates: `emailVerificado`, `estadoSeguridad` permite borrador |
| **ValidationEngine** | Verify Turnstile server-side; enforce rate limits |
| **Messenger** | `estadoMensajeria` + `spamScore` + `nivelConfianza` |
| **Revisión/Moderación** | Prioridad por `riesgoScore` y flags |
| **Admin** | Módulo Seguridad: logs, alertas, cambio estado |
| **IA Arquitecto** | Lectura métricas; sin write; alertas diseño |

---

## 8. Verificación de correo

| Aspecto | Diseño |
|---------|--------|
| Proveedor | Firebase Auth `emailVerified` |
| Campos | `emailVerificado`, `fechaVerificacionEmail` |
| Reenvío | Máx. 3/h, 5/día; cooldown 60s; Turnstile en reenvío |
| Expiración enlace | 24 h |
| Sin verificar — permitido | Login, ver públicos, favoritos, borrador |
| Sin verificar — bloqueado | Enviar revisión, publicar, contratar, banner, categoría sugerida |
| Gracia | 7 días post-registro → luego `restringido` hasta verificar |

---

## 9. Verificación de teléfono (post-MVP)

| Aspecto | Diseño |
|---------|--------|
| Proveedor | Firebase Phone Auth o Twilio Verify |
| OTP | 6 dígitos; 10 min; 5 intentos; bloqueo 30 min |
| MVP | **No obligatorio** lanzamiento |
| Fase 2 | Obligatorio adultos VIP / montos altos |
| Bonus | `nivelConfianza` +15 |

---

## 10. Estados de seguridad

| Estado | Publicaciones | Mensajería | Contratos | Banners |
|--------|---------------|------------|-----------|---------|
| **normal** | Según flujo revisión | Normal | Sí | Sí |
| **observacion** | Revisión prioritaria | Límites 50% | Sí | Manual |
| **restringido** | Solo borrador | Restringida | No nuevos | No |
| **suspendido** | Despublicar | Suspendida | Pausados | Pausados |
| **bloqueado** | Ninguna | Ninguna | Cancelar | Retirar |

Transiciones: solo admin/moderador.

---

## 11. Riesgos detectados

| ID | Severidad | Riesgo |
|----|-----------|--------|
| R1 | Crítica | Admin email único en rules |
| R2 | Crítica | Sin CAPTCHA hoy |
| R3 | Alta | Email no verificado opera demasiado |
| R4 | Alta | Sin rate limits |
| R5 | Alta | PII en logs incompleto |
| R6 | Media | Messenger sin contrato previo |
| R7 | Media | Costo reCAPTCHA al escalar |
| R8 | Media | Cuentas duplicadas spam |
| R9 | Baja | Rules no cubren colecciones nuevas |

---

## 12. MVP obligatorio vs post-MVP

### Obligatorio antes de lanzamiento público

1. Turnstile en formularios críticos
2. Rate limits login/registro/recuperación
3. Email verificado antes de acciones comerciales/publicación
4. `estadoSeguridad` + `riesgoScore` + flags
5. `logsSeguridad` + `logs_acceso_privado`
6. `alertas_seguridad` umbrales críticos
7. Contrato ValidationEngine (verify server-side)

### Puede posponerse

- Teléfono OTP
- Messenger spamScore runtime
- 2FA admin / RBAC completo
- Device fingerprint avanzado
- ML fraude
- reCAPTCHA fallback automático

---

## 13. ¿Congelar Seguridad MVP antes de FieldEngine?

**Sí, se recomienda congelar.**

FieldEngine debe documentar `securityGates` en su spec:

- ¿Puede el usuario abrir el wizard? → `estadoCuenta`, `estadoSeguridad`, `emailVerificado`
- ¿Qué acciones del formulario están habilitadas? → gates por paso
- ValidationEngine hereda verify Turnstile + rate limits

Sin Seguridad MVP congelada, el spec FieldEngine quedaría incompleto y habría riesgo de re-diseño.

---

## Artefactos generados

- [`config-seguridad-mvp-schema.json`](./config-seguridad-mvp-schema.json)
- [`ACTA-CONGELAMIENTO-SEGURIDAD.json`](./ACTA-CONGELAMIENTO-SEGURIDAD.json)
- [`ACTA-CONGELAMIENTO-SEGURIDAD.md`](./ACTA-CONGELAMIENTO-SEGURIDAD.md)

---

## 14. Checklist de cobertura (10 ítems solicitados)

| # | Tema | Documentado en |
|---|------|----------------|
| 1 | **Cloudflare Turnstile** | §1, `config-seguridad-mvp-schema.json` → `antiBots` |
| 2 | **Firebase App Check** | `config-seguridad-mvp-schema.json` → `firebaseNativo.appCheck` |
| 3 | **Verificación de correo** | §8, Firebase Auth obligatorio MVP |
| 4 | **riesgoScore** | §4, `riesgoReputacion.riesgoScore` |
| 5 | **logsSeguridad** | §6, `logsAuditoria.logsSeguridad` |
| 6 | **Estados de seguridad** | §10, `estadosSeguridad` |
| 7 | **Anti-spam** | §3, límites por dimensión |
| 8 | **Anti-abuso** | §3, `limitesPorAccion` + rate limits |
| 9 | **Protección Messenger** | §5, diseño futuro |
| 10 | **Acta de congelamiento** | [`ACTA-CONGELAMIENTO-SEGURIDAD`](./ACTA-CONGELAMIENTO-SEGURIDAD.md) — **CONGELADO** |

---

*Solo diseño. Sin Firestore, producción, deploy ni commit.*
