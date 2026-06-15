# Auditoría final — propuesta VE MINOR 1.1.0 (Messenger)

| Campo | Valor |
|-------|-------|
| **Fecha** | 2026-06-09 |
| **Propuesta** | [`PROPUESTA-ACTA-MINOR-VALIDATIONENGINE-MESSENGER.json`](./PROPUESTA-ACTA-MINOR-VALIDATIONENGINE-MESSENGER.json) |
| **VE base** | 1.0.0 CONGELADO |
| **Messenger base** | 1.0.0 CONGELADO |
| **Estado propuesta** | PROPUESTA_NO_APLICADA |
| **Veredicto** | **Suficiente con cambios requeridos** |
| **¿Procede acta MINOR?** | **Sí** |

Canónico: [`AUDITORIA-PROPUESTA-VE-MINOR-1.1.0.json`](./AUDITORIA-PROPUESTA-VE-MINOR-1.1.0.json)

---

## Veredicto final

| Pregunta | Respuesta |
|----------|-----------|
| ¿Información suficiente para acta formal MINOR? | **Sí**, con **8 cambios requeridos** |
| ¿Procede redactar `ACTA-MINOR-VALIDATIONENGINE-1.1.0`? | **Sí** |
| ¿Aplicar 1.1.0 ahora? | **No** |
| ¿Modifica capas congeladas sin acta? | **No** (esta auditoría no aplica cambios) |

La propuesta y [`registry-messenger-fanout-propuesta.json`](./registry-messenger-fanout-propuesta.json) v1.0.1 cubren las **23 acciones** del catálogo Messenger (+ variante `conversacion_iniciar` → directa/solicitud = **24 entradas**). Falta precisión formal para cumplir **OB-VE2** (`fanOutPlan[]`), gates completos **OB-MSG-8** y procedimiento MINOR del acta VE 1.0.0.

---

## Análisis VE-MINOR-01 … 07

| ID | Título | Suficiencia | Compat. VE 1.0.0 | Compat. Messenger 1.0.0 |
|----|--------|-------------|------------------|-------------------------|
| **VE-MINOR-01** | Actualizar fanOut 3 acciones placeholder | Parcial | MINOR OK | OK |
| **VE-MINOR-02** | +23 acciones registry | Alta | MINOR OK | OK |
| **VE-MINOR-03** | `mensajeria_futura` → `mensajeria` | Parcial | MINOR OK | OK |
| **VE-MINOR-04** | Fixtures V20+ | Insuficiente si opcional | MINOR OK | OK |
| **VE-MINOR-05** | `telefonoVerificado` validateStates | Parcial | MINOR OK | OK |
| **VE-MINOR-06** | `spamScore` canónico | Parcial | MINOR OK | OK |
| **VE-MINOR-07** | Errores canónicos | Parcial | MINOR OK | OK |

---

### VE-MINOR-01 — fanOutPlan placeholders

**Estado registry 1.0.0:** `mensaje_enviar`, `conversacion_iniciar`, `bloqueo_usuario` con `emitir: false` o parcial.

**Fuente:** fanout propuesta v1.0.1.

**Hallazgos:**
- `conversacion_iniciar` no existe en fanout — se reemplaza por `conversacion_iniciar_directa` y `conversacion_iniciar_solicitud`.
- Entradas fanout usan plantilla `historial`/`notificacion`; **OB-VE2** exige `fanOutPlan[]` — la acta debe definir la transformación.
- `bloqueo_usuario` ya tiene fan-out parcial en 1.0.0 — fusionar, no duplicar.

---

### VE-MINOR-02 — 23 acciones + variantes

| Métrica | Valor |
|---------|-------|
| Acciones SPEC Messenger | 23 |
| Entradas fanout propuesta | 24 |
| Registry VE 1.0.0 (mensajería) | 3 |
| Registry VE 1.1.0 esperado (mensajería) | 24 |
| Registry total 1.0.0 | 39 |
| Registry total 1.1.0 esperado | **~60** |

**Excluido:** `ia_asistente_sugerir_respuesta` (sin fanOut persistencia — documentado en fanout).

---

### VE-MINOR-03 — SPEC mensajeria

- Renombrar grupo `mensajeria_futura` → `mensajeria` — alineado con `procedimientoVersionado.MINOR`.
- **Pipeline 14 pasos sin cambio** — correcto.
- Acta debe incluir lista canónica de claves `ValidationAction` incluyendo variantes `conversacion_iniciar_*`.

---

### VE-MINOR-04 — Fixtures

| Actual | Propuesta | Recomendación auditoría |
|--------|-----------|-------------------------|
| V01–V18 | V20+ opcional | **V19–V24 obligatorios en acta** (mín. V19–V21) |

**V18** (`ESTADO_MENSAJERIA_DENEGADO`) permanece válido.

**Fixtures sugeridos:** fanOut `mensaje_enviar` · `TELEFONO_NO_VERIFICADO` · `SPAM_SCORE_UMBRAL` · `conversacion_iniciar_directa` · `conversacion_iniciar_solicitud` · `MESSENGER_DESHABILITADO_AMBITO`.

---

### VE-MINOR-05 — telefonoVerificado

| Campo | Valor |
|-------|-------|
| Path | `usuarios.seguridad.telefonoVerificado === true` |
| Acciones | `mensaje_enviar`, `conversacion_iniciar_*` |
| Error | `TELEFONO_NO_VERIFICADO` |
| Pipeline | Paso 6 `validateStates` |

**Gap:** SPEC Messenger también exige `messengerHabilitadoAmbito` y regla `estadoMensajeria` restringida — no están en la propuesta como ítems explícitos.

---

### VE-MINOR-06 — spamScore

| Campo | Valor |
|-------|-------|
| Path canónico | `usuarios.mensajeria.spamScore` |
| Umbral | **≥ 60 deniega** |
| Error | `SPAM_SCORE_UMBRAL` |

**Corrección requerida:** la propuesta dice «si spamScore < 60» — ambiguo; debe ser **denegar si ≥ 60** (alineado SPEC Messenger `restringido_por_spamScore`).

---

### VE-MINOR-07 — Errores canónicos

**Nuevos en VE:** `TELEFONO_NO_VERIFICADO`, `MESSENGER_DESHABILITADO_AMBITO`, `SPAM_SCORE_UMBRAL`.

**Reutilizados:** `ESTADO_MENSAJERIA_DENEGADO`, `EMAIL_NO_VERIFICADO`, etc.

**Solo Messenger runtime:** `BLOQUEO_ACTIVO`, `SOLICITUD_PENDIENTE` — fuera alcance MINOR.

**Gap:** destino archivo ambiguo — acta debe especificar `SPEC-VALIDATIONENGINE.json` (`errores` + `guiaErrores.gatesVsEstados`).

---

## Verificación transversal

### fanOutPlan

- **Antes:** placeholders sin emisión real.
- **Después:** dominio `historial_mensajes`; notificaciones `mensajes` / `mensajeria`.
- Condicionales: spam, señal riesgo, abuso, investigación.

### Fixtures existentes

Sin modificación obligatoria de V01–V18; extensión recomendada V19–V24.

### Acta migración

[`ACTA-MIGRACION-USUARIOS-PERFILES`](./ACTA-MIGRACION-USUARIOS-PERFILES.json) v1.0.0 satisface AM-VE2 a nivel diseño — no bloquea acta MINOR; sí bloquea runtime conjunto.

---

## Cambios requeridos (acta formal)

| ID | Prioridad | Descripción |
|----|-----------|-------------|
| REQ-01 | Alta | Transformación plantilla → `fanOutPlan[]` (OB-VE2) |
| REQ-02 | Alta | Eliminar `conversacion_iniciar`; routing `modoInicio` |
| REQ-03 | Alta | Gate `messengerHabilitadoAmbito` en validateStates |
| REQ-04 | Alta | Umbral spamScore: denegar si ≥ 60 |
| REQ-05 | Alta | Errores en SPEC VE + guiaErrores (no solo cross-ref) |
| REQ-06 | Media | Anexo lista 24 claves registry |
| REQ-07 | Media | Actualizar `validar-spec-validationengine.mjs` (~60 acciones) |
| REQ-08 | Media | Procedimiento MINOR: historialVersiones, registry 1.1.0 |

---

## Cambios recomendados

1. Fixtures V19–V24 **obligatorios** (no opcional).
2. Regla `estadoMensajeria` restringida (SPEC Messenger).
3. Matriz acción → pasos pipeline aplicables.
4. Fusionar fanout propuesta en registry principal.
5. Actualizar reporte consolidado al aprobar acta.
6. Fixture V19 con fanOut `mensaje_enviar` completo.

---

## Riesgos

**Eliminados al aprobar acta:** R-VE-01 (registry incompleto) · R6 (hooks sin Messenger).

**Remanentes:** desalineación fanOutPlan · validador VE09 · routing legacy · sin fixtures gates · R-MSG-02 índices · migración perfiles no ejecutada.

---

## Siguiente paso

Redactar **`ACTA-MINOR-VALIDATIONENGINE-1.1.0-MESSENGER`** incorporando REQ-01..08. No aplicar cambios en archivos congelados hasta aprobación PO explícita.

---

*Auditoría documental — no autoriza aplicación 1.1.0 ni runtime.*
