# Acta formal MINOR — ValidationEngine 1.1.0 (Messenger)

| Campo | Valor |
|-------|-------|
| **Semver objetivo** | **1.1.0** (MINOR) |
| **Base** | ValidationEngine **1.0.0** CONGELADO |
| **Integración** | Messenger **1.0.0** CONGELADO |
| **Fecha** | 2026-06-09 |
| **Estado** | **APLICADA_DOCUMENTAL** |
| **Aplicación archivos** | **Sí** — 2026-06-09 (solo documentación) |

Canónico: [`ACTA-MINOR-VALIDATIONENGINE-1.1.0-MESSENGER.json`](./ACTA-MINOR-VALIDATIONENGINE-1.1.0-MESSENGER.json)

Auditoría propuesta: [`AUDITORIA-PROPUESTA-VE-MINOR-1.1.0.json`](./AUDITORIA-PROPUESTA-VE-MINOR-1.1.0.json)

---

## Autorización

Acta formal **MINOR** autorizada por product owner. Define el diff documental VE 1.0.0 → 1.1.0 para integración Messenger.

**No autoriza:** aplicar cambios en baseline congelado · runtime · Firestore · producción · modificar actas/specs Messenger congelados directamente.

---

## Compatibilidad

### ValidationEngine 1.0.0

| Aspecto | Cambio |
|---------|--------|
| Pipeline 14 pasos | **Sin cambio** |
| ValidationContext | **Sin cambio** |
| OB-VE2 fanOutPlan | **Preservado** — transformación explícita |
| Acciones no mensajería | **Sin cambio** |
| Tipo semver | **MINOR** válido |

### Messenger 1.0.0

| Aspecto | Estado |
|---------|--------|
| SPEC Messenger | **No se modifica** |
| 23 acciones catálogo | Cubiertas por 24 entradas registry |
| OB-MSG-8 gates | Formalizados en VE al aplicar |

---

## REQ-01 — fanOutPlan canónico

Transformación plantilla fanout → `fanOutPlan[]` (OB-VE2):

1. `historial.emitir: true` → ítem `{ destino: historial, dominio, tipoEvento }`
2. `notificacion.emitir: true` → ítems por cada `notificacion.items[]`
3. `logsSeguridad` / `iaRecomendaciones` / `logsAdmin` → side-channels según patrón `enviar_revision`

**Ejemplo `mensaje_enviar`:**

- `historial_mensajes.mensaje_enviado`
- `mensajes.mensaje_nuevo` → receptor dinámico

---

## REQ-02 — Routing `conversacion_iniciar`

| Entrada cliente | `metadata.modoInicio` | Acción registry |
|-----------------|----------------------|-----------------|
| `conversacion_iniciar` | `directa` | `conversacion_iniciar_directa` |
| `conversacion_iniciar` | `solicitud` | `conversacion_iniciar_solicitud` |

**Eliminar** `conversacion_iniciar` del registry. Normalizar antes del paso 12 (fanOutPlan).

---

## REQ-03 — Gate `messengerHabilitadoAmbito`

| Campo | Valor |
|-------|-------|
| Paso | 6 `validateStates` |
| Denegar si | `messengerHabilitadoAmbito === false` |
| Error | `MESSENGER_DESHABILITADO_AMBITO` |
| Excepciones | acciones admin habilitar/deshabilitar ámbito |

---

## REQ-04 — `spamScore >= 60`

| Campo | Valor |
|-------|-------|
| Path | `usuarios.mensajeria.spamScore` |
| Regla | **Denegar si >= 60** |
| Error | `SPAM_SCORE_UMBRAL` |
| Acciones | `mensaje_enviar`, `conversacion_iniciar_*`, `automatizacion_enviar` |

`validateAction` **no muta** spamScore.

---

## REQ-05 — Gate `telefonoVerificado` + errores

### telefonoVerificado

| Campo | Valor |
|-------|-------|
| Path | `usuarios.seguridad.telefonoVerificado === true` |
| Acciones | envío e inicio conversación |
| Error | `TELEFONO_NO_VERIFICADO` |

### Errores nuevos en SPEC VE

`TELEFONO_NO_VERIFICADO` · `MESSENGER_DESHABILITADO_AMBITO` · `SPAM_SCORE_UMBRAL`

Destino: `SPEC-VALIDATIONENGINE.json` → `errores` + `guiaErrores.gatesVsEstados`

**Solo Messenger runtime:** `BLOQUEO_ACTIVO`, `SOLICITUD_PENDIENTE`, etc.

---

## REQ-06 — Registry 24 acciones

Registry total: **39 → 60**. Mensajería: **24 claves**.

Lista completa en acta JSON → `requisitosAuditoriaIncorporados.REQ-06.accionesRegistryMensajeria`.

SPEC: `mensajeria_futura` → `mensajeria`.

---

## REQ-07 — Validador

Al aplicar, actualizar `validar-spec-validationengine.mjs`:

- VE09 → 60 acciones
- VE20–VE25 checks mensajería, errores, fixtures ≥ 24

---

## REQ-08 — Procedimiento MINOR

| Campo | Valor |
|-------|-------|
| Tipo | MINOR |
| Registry | 1.0.0 → 1.1.0 |
| SPEC | 1.0.0 → 1.1.0 |
| Historial | Entrada `MINOR_MESSENGER_INTEGRACION` al aplicar |

Archivos afectados al aplicar: SPEC VE, registry, fixtures, validador.

**No modificar:** actas congelamiento VE/Messenger, SPEC Messenger.

---

## Fixtures obligatorios V19–V24

| ID | Caso |
|----|------|
| V19 | `mensaje_enviar` OK + fanOut |
| V20 | `TELEFONO_NO_VERIFICADO` |
| V21 | `SPAM_SCORE_UMBRAL` (score ≥ 60) |
| V22 | `conversacion_iniciar_directa` OK |
| V23 | `conversacion_iniciar_solicitud` OK |
| V24 | `MESSENGER_DESHABILITADO_AMBITO` |

V01–V18 preservados. Total: **24 fixtures**.

---

## Orden gates mensajería (paso 6)

1. `messengerHabilitadoAmbito`
2. `estadoMensajeria` / `estadoSeguridad`
3. `telefonoVerificado`
4. `spamScore >= 60`

---

## Riesgos

**Eliminados al aplicar:** R-VE-01 · desalineación fanOutPlan.

**Remanentes:** archivos sin aplicar · índices Messenger · migración perfiles.

---

## Siguiente paso

**Autorización aplicación** — ejecutar diff en archivos baseline según esta acta. Validador debe PASS con checks VE01–VE25.

---

*Acta MINOR diseño — no modifica archivos congelados hasta aplicación explícita.*
