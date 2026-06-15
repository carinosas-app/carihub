# Análisis — Capa IA y Seguridad de Mensajería

| Campo | Valor |
|-------|-------|
| **Versión** | 0.1.0 |
| **Fecha** | 2026-06-09 |
| **Estado** | **Análisis documentado** |
| **Prerequisito** | SPEC Messenger v1.0.0 |
| **Runtime** | **NO autorizado** |

Canónico: [`ANALISIS-MESSENGER-IA-SEGURIDAD.json`](./ANALISIS-MESSENGER-IA-SEGURIDAD.json)

Alcance general Messenger: [`SPEC-MESSENGER-ALCANCE.md`](./SPEC-MESSENGER-ALCANCE.md)

---

## 1. Objetivo de la capa

Combinar **reglas determinísticas**, **heurísticas**, **listas** y **señales IA** en un pipeline de análisis en tiempo de envío/recepción — **sin sustituir** moderación humana ni los gates de las capas congeladas (Cuentas, Seguridad MVP, ValidationEngine, Dashboards).

```
Usuario envía mensaje
        │
        ▼
┌───────────────────────┐
│  ValidationEngine     │  auth · rate limits · estadoMensajeria · bloqueos
└───────────┬───────────┘
            ▼
┌───────────────────────┐
│  Reglas determinísticas│  palabras prohibidas · URLs · patrones
└───────────┬───────────┘
            ▼
┌───────────────────────┐
│  Heurística spam      │  duplicados · burst · spamScore
└───────────┬───────────┘
            ▼
┌───────────────────────┐
│  Señales IA           │  ia_seguridad_messenger · ia_moderacion_messenger
└───────────┬───────────┘
            ▼
┌───────────────────────┐
│  Decisión sistema     │  permitir | retrasar | cola | rechazar | elevar admin
└───────────┬───────────┘
            ▼
     EventBus fanOutPlan → notificaciones · historial · logs · ia_recomendaciones
```

**Principio:** las reglas del sistema tienen **prioridad** sobre la IA. La IA **nunca** ejecuta bloqueo permanente sin pasar por cola admin.

---

## 2. Matriz de detecciones

| Detección | ID | Técnicas principales | Acción sistema | Señal IA |
|-----------|-----|----------------------|----------------|----------|
| **Spam** | DET-MSG-01 | Hash texto, similitud, burst, `spamScore` | ↑ score; restringir ≥60; suspender ≥80 | `ia_seguridad_messenger` |
| **Mensajes masivos** | DET-MSG-02 | Destinos únicos/hora, hash multi-receptor | Bloquear nuevas conversaciones; cola admin | Campaña detectada |
| **Fraude** | DET-MSG-03 | Patrones pago, keywords, enlaces acortados | Marcar conversación; `estadoSeguridad` observación | Seguridad + Moderación |
| **Enlaces peligrosos** | DET-MSG-04 | Lista negra dominios, parse URL, TLD | Rechazar mensaje; log seguridad | Clasificación URL |
| **Phishing** | DET-MSG-05 | Homógrafos, suplantación CariHub | Rechazar; alerta admin crítica | `ia_seguridad_messenger` |
| **Acoso** | DET-MSG-06 | Reportes acumulados, frecuencia par | Cola moderación; sugerir bloqueo UI | `ia_moderacion_messenger` |
| **Extorsión** | DET-MSG-07 | Patrones amenaza + pago | Retener mensaje; preservar evidencia | Prioridad crítica |
| **Contenido prohibido** | DET-MSG-08 | Políticas CariHub + keywords | Rechazar; suspender envío emisor | Clasificación moderación |

**Categorías adultos:** acoso y reportes son **obligatorios desde día 1** del diseño Messenger.

---

## 3. Integración con estados congelados

### `estadoMensajeria` (Cuentas 1.0.0)

| Valor | Efecto Messenger |
|-------|------------------|
| `habilitada` | Envío y recepción si demás gates OK |
| `restringida` | Solo respuesta en conversaciones existentes |
| `suspendida` | Sin envío |
| `solo_lectura` | Recibir y leer; no enviar |

**Modificación:** solo vía `validateAction` (acciones admin o reglas automáticas documentadas) — **no** escritura directa desde IA.

### `estadoSeguridad` (Seguridad MVP 1.0.0)

| Valor | Efecto Messenger |
|-------|------------------|
| `normal` | Según `estadoMensajeria` |
| `observacion` | Límites −50% |
| `restringido` / `suspendido` / `bloqueado` | Mensajería degradada o nula |

### `spamScore` y `nivelConfianza`

- **Campo:** `usuarios.mensajeria.spamScore` (0–100)
- **Incrementos:** mensajes idénticos, URLs masivas, reportes, rate limit, señal IA alta
- **Umbrales congelados:** restringir 60 · suspender 80
- **`nivelConfianza`:** límites dinámicos conversaciones nuevas y mensajes/hora

Ref.: `config-seguridad-mvp-schema.json` → `mensajeriaFutura`

---

## 4. Reportes y bloqueos

### Reportes (`reportes_mensajeria/{id}`)

- Tipos: reportar usuario · conversación · mensaje
- Efecto: ↑ `reportesCount`, `riesgoScore`, `spamScore` según validez
- Umbral revisión admin: **3** reportes
- Acción VE: `reportar_conversacion` (a formalizar en SPEC)

### Bloqueos (`usuarios/{id}/bloqueos/{id}`)

- Efecto: sin mensajes bidireccionales
- Iniciado por: usuario · admin · regla temporal sistema
- Acción VE congelada: `bloqueo_usuario` → historial + `logsSeguridad`

---

## 5. Rate limits

Ref. congelada: `rateLimits.mensaje_futuro`

| Dimensión | Ventana | Máx |
|-----------|---------|-----|
| `usuario` | 1 h | 60 |
| `usuario_nuevo` | 24 h | 20 (si `nivelConfianza` < 40) |
| `conversacion` | 1 min | 10 |

ValidationEngine: paso rate limits en pipeline — acciones `mensajeria_futura`.

---

## 6. EventBus e integración Dashboards

**Productor:** `ValidationEngine.validateAction` — acciones Messenger.

**Contrato:** `fanOutPlan[]` — ValidationEngine v1.0.0 congelado.

| Destino | Ejemplos |
|---------|----------|
| Notificaciones usuario | `mensajes.mensaje_nuevo`, `mensajes.solicitud_conversacion` |
| Notificaciones admin | `mensajeria.reporte_recibido`, `mensajeria.alerta_seguridad` |
| Historial | `historial_mensajes`, `historial_actividad_cuenta` |
| Logs seguridad | spam, phishing, bloqueo, rate limit |
| `ia_recomendaciones` | Señales IA — estado `sugerida` |

**Eventos nuevos propuestos:** `mensajeria.spam_detectado`, `mensajeria.phishing_detectado`, `mensajeria.acoso_detectado`, `mensajeria.extorsion_detectada`, `mensajeria.contenido_prohibido`, `mensajeria.envio_masivo_sospechoso`, `mensajeria.fraude_sospechoso`, `mensajeria.umbral_spamScore`.

**Nota:** Registry VE tiene placeholders — SPEC Messenger documentará `fanOutPlan` completo; cambio en registry VE solo vía acta MINOR futura si necesario (capa congelada intacta por ahora).

---

## 7. Asistentes IA Messenger

### `ia_seguridad_messenger`

| Aspecto | Detalle |
|---------|---------|
| **Objetivo** | Spam, fraude, enlaces, phishing, envíos masivos |
| **Entrada** | Texto, metadata emisor, URLs, historial agregado reciente |
| **Salida** | Señal riesgo → `ia_recomendaciones` o `senales_mensajeria` |
| **Prohibido** | Enviar mensajes, bloquear permanente, leer conversaciones ajenas |

### `ia_moderacion_messenger`

| Aspecto | Detalle |
|---------|---------|
| **Objetivo** | Acoso, extorsión, contenido prohibido, priorización cola |
| **Relación** | Extiende `ia_moderador` admin — dominio mensajería |
| **Salida** | Recomendación — estados `sugerida` → `aceptada_humano` \| `rechazada_humano` |
| **Prohibido** | Aprobar auto, eliminar cuenta, contactar usuario como admin |

### `ia_traduccion_messenger` (fase 4)

- Entrada: `mensajeOriginal`, idiomas
- Persistencia: `mensajeOriginal` + `mensajeTraducido` en documento mensaje
- Control usuario: activar/desactivar por conversación

### `ia_asistente_conversacional` (opcional)

| Tipo cuenta | Uso |
|-------------|-----|
| Adultos | FAQs perfil — no suplantar persona |
| Empresa | Horarios, servicios |
| Profesionista | Orientación cotizaciones |

**Regla crítica:** genera **borrador sugerido** en UI → usuario confirma → usuario envía vía `validateAction`. Identidad clara si el mensaje fue asistido.

---

## 8. Reglas vinculantes IA

| ID | Regla |
|----|-------|
| R-MSG-IA-01 | La IA no envía mensajes sin autorización explícita del usuario |
| R-MSG-IA-02 | La IA no accede a conversaciones fuera de permisos definidos |
| R-MSG-IA-03 | Toda acción automática y toda señal IA queda auditada |
| R-MSG-IA-04 | La IA genera alertas/recomendaciones — no sanciones finales |
| R-MSG-IA-05 | Bloqueo y sanción: reglas sistema + moderación admin |
| R-MSG-IA-06 | Alineado Dashboards: salida ejecutable vía `ia_recomendaciones` + confirmación |
| R-MSG-IA-07 | Alineado ValidationEngine: persistencia solo tras `validateAction` |
| R-MSG-IA-08 | PrivacyGuard: sin exposición de mensajes de terceros a asistentes usuario |

---

## 9. Matriz de decisión (resumen)

| Señal | Sistema | Admin | Usuario |
|-------|---------|-------|---------|
| Spam leve | ↑ `spamScore` | Solo si umbral | — |
| Spam alto | `estadoMensajeria` restringida | Notif cola | Banner límites |
| Phishing | Rechazar mensaje | Alerta crítica | Advertencia |
| Acoso | Permitir + reporte fácil | Prioridad cola | Sugerir bloqueo |
| Extorsión | Retener + preservar | Inmediato | Recursos ayuda |
| Contenido prohibido | Rechazar + suspender envío | Revisión obligatoria | Políticas |

---

## 10. Riesgos del análisis

| ID | Nivel | Mitigación |
|----|-------|------------|
| A-MSG-01 | Alto | IA con acceso amplio — scopes por conversación (R-MSG-IA-02) |
| A-MSG-02 | Alto | Auto-moderación falsos positivos — cola admin + apelación |
| A-MSG-03 | Medio | `spamScore` mal calibrado — decrementos + `nivelConfianza` |
| A-MSG-04 | Medio | Asistente suplanta usuario — borrador only (R-MSG-IA-01) |
| A-MSG-05 | Medio | Registry VE placeholders — SPEC Messenger + acta VE MINOR si aplica |

---

## 11. Colecciones nuevas propuestas (diseño)

- `senales_mensajeria/{id}` — señales pipeline e IA
- `reportes_mensajeria/{id}`
- `config_mensajeria/listas_negras`
- `config_mensajeria/politicas`

---

## 12. Siguiente paso

Incorporar este análisis en **SPEC Messenger v1.0.0** + fixtures golden (casos spam, phishing, acoso, bloqueo, `spamScore` umbral, solicitud conversación adultos).

---

*Análisis de diseño — no modifica capas congeladas ni autoriza runtime.*
