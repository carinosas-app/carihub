# CariHub Messenger — Especificación técnica v1.0.0

| Campo | Valor |
|-------|-------|
| **Versión** | 1.0.0 |
| **Fecha** | 2026-06-09 |
| **Estado** | **CONGELADO** (2026-06-09) |
| **Runtime** | **NO autorizado** |
| **Acta** | Pendiente revisión PO |

Canónico: [`SPEC-MESSENGER.json`](./SPEC-MESSENGER.json)

Origen: [`SPEC-MESSENGER-ALCANCE`](./SPEC-MESSENGER-ALCANCE.md) · [`ANALISIS-MESSENGER-IA-SEGURIDAD`](./ANALISIS-MESSENGER-IA-SEGURIDAD.md)

---

## 1. Propósito

**CariHub Messenger** es la mensajería interna de la plataforma: aplicación/módulo **independiente** de Home, Resultados y Perfil. Conecta usuarios registrados y verificados mediante conversaciones, con seguridad, moderación, automatizaciones tipo WhatsApp Business y control administrativo granular.

Toda acción persistente pasa por **ValidationEngine 1.0.0** (`validateAction`).

---

## 2. Arquitectura

```
perfil.html ──「Mensaje interno」──► /messenger
                                      │
                    validateAction ◄──┤ mensaje_enviar, conversacion_iniciar, …
                                      │
                    conversaciones/ + mensajes/ (diseño Firestore)
                                      │
                    EventBus fanOutPlan ──► notificaciones · historial · logs · admin
```

| Principio | Regla |
|-----------|-------|
| App separada | No cargar chat en index/resultados/perfil |
| Sin visitante | Visitante no envía mensajes |
| Verificación | Email + teléfono obligatorios para enviar |
| Privacidad | No mostrar teléfono/email privado |
| Capas congeladas | Solo lectura — cambios VE vía acta MINOR documentada |

---

## 3. Rutas

| Ruta | Vista |
|------|-------|
| `/messenger` | Bandeja conversaciones |
| `/messenger/chat/:id` | Chat |
| `/messenger/configuracion` | Config + automatizaciones |
| `/messenger/reportes` | Mis reportes |
| `/messenger/solicitudes` | Solicitudes pendientes |
| `/admin/mensajeria` | Cola reportes y controles |
| `/admin/mensajeria/conversacion/:id` | Revisión denunciada |
| `/admin/mensajeria/controles` | Control granular global |

---

## 4. Modelo de datos

### Colecciones

| Colección | Ruta |
|-----------|------|
| Conversaciones | `conversaciones/{conversacionId}` |
| Mensajes | `conversaciones/{id}/mensajes/{mensajeId}` |
| Meta usuario | `usuarios/{id}/conversaciones_meta/{convId}` |
| Bloqueos | `usuarios/{id}/bloqueos/{id}` |
| Reportes | `reportes_mensajeria/{id}` |
| Automatizaciones | `usuarios/{id}/messenger_automatizaciones/{reglaId}` |
| Controles admin | `config_messenger/controles_admin` |

### Participantes

Máximo **2** en chat directo (grupos = futuro). Cada participante tiene config **local**: archivada, silenciada, fijada, oculta, no leídos.

### Mensaje — campos clave

`emisorId`, `receptorId`, `texto`, `estadoEntrega` (enviado·entregado·visto), `tipo`, `origenMensaje` (humano·automatizacion·asistente_ia), `marcadoAutomatizado`, `reglaAutomatizacionId`, `mensajeOriginal`/`mensajeTraducido` (fase 4).

---

## 5. Estados

### Conversación (estado global)

`activa` · `solicitud_enviada` · `solicitud_rechazada` · `bloqueada` · `reportada` · `en_investigacion` · `cerrada_admin`

**Aceptar solicitud** → `activa` (no existe `solicitud_aceptada` persistente).  
**Archivar/silenciar/fijar** → solo `conversaciones_meta` (OB-MSG-2).

### conversacionId (OB-MSG-6)

`sha256_base64url(menorId|mayorId|perfilContextoId|v1)` — un chat por trío usuario-par-perfil.

### Mensaje

**Entrega:** enviado → entregado → visto  
**Vida:** activo · eliminado_para_todos · eliminado_local · retenido_investigacion

---

## 6. Solicitud de conversación

**Obligatoria** en perfiles adultos (y configurables en otros).

1. `conversacion_iniciar` → `solicitud_enviada` + notificación al receptor  
2. Receptor **acepta** → `activa` — emisor puede escribir  
3. Receptor **rechaza** → `solicitud_rechazada`  
4. Mensaje con solicitud pendiente → `SOLICITUD_PENDIENTE` (403)

---

## 7. Acciones de usuario

| Acción | Alcance | Efecto |
|--------|---------|--------|
| Archivar | Local | Oculta bandeja |
| Silenciar | Local | Sin notificaciones |
| Fijar | Local | Máx. 5 |
| Ocultar / eliminar local | Local | Solo bandeja propia |

---

## 8. Eliminación, cierre e investigación

### Eliminar para todos

| Regla | Valor |
|-------|-------|
| Ventana | **15 minutos** desde envío |
| Quién | Solo emisor |
| Bloqueos | Reporte pendiente o `en_investigacion` → denegado |

**Impacto reportes:** el reporte conserva `mensajeId`; UI muestra `[mensaje eliminado]`; admin retiene copia si investigación.

**Adjuntos:** delete lógico; si investigación → `retenido_investigacion` sin purge físico.

### Conversación en investigación

- No eliminar para todos  
- Admin lectura completa  
- Envío puede restringirse al emisor  
- Cierre: admin → `activa` o `cerrada_admin`

---

## 9. Permisos

### Por `tipoCuentaPrincipal`

| Tipo | Enviar | Recibir | Notas |
|------|--------|---------|-------|
| visitante | No | No | |
| adulto | Sí | Sí | Solicitud conversación |
| independiente / profesionista | Sí | Sí | Cotizaciones |
| empresa | Sí | Sí | Multioperador |
| admin | — | — | Moderación |

### Perfiles públicos

Botón «Mensaje interno» si: perfil público, owner recibe mensajes, Messenger habilitado en ámbito, usuario autenticado.

---

## 10. Bloqueos y reportes

- **Bloqueo:** sin mensajes bidireccionales — `bloqueo_usuario`  
- **Reportes:** usuario · conversación · mensaje → cola admin; umbral revisión **3**

---

## 11. Anti-spam y rate limits

Ref. **Seguridad MVP 1.0.0** congelada:

| Métrica | Detalle |
|---------|---------|
| `spamScore` | 0–100; restringir ≥60; suspender ≥80 |
| Usuario nuevo | 5 conv/día · 20 msg/h (`nivelConfianza` < 40) |
| Estándar | 60 msg/h · burst 10/min |

Pipeline detección: [`ANALISIS-MESSENGER-IA-SEGURIDAD.md`](./ANALISIS-MESSENGER-IA-SEGURIDAD.md) — 8 detecciones.

---

## 12. Integraciones

### ValidationEngine 1.0.0

20 acciones Messenger catalogadas en SPEC JSON. `fanOutPlan` propuesto en [`registry-messenger-fanout-propuesta.json`](./registry-messenger-fanout-propuesta.json).

**Cambio VE requerido:** [`PROPUESTA-ACTA-MINOR-VALIDATIONENGINE-MESSENGER.json`](./PROPUESTA-ACTA-MINOR-VALIDATIONENGINE-MESSENGER.json) — **no aplicado** (VE congelado).

### Dashboards 1.0.0

Dominio notificaciones `mensajes`; historial `historial_mensajes`; módulo admin Mensajería.

### Interacciones v1.2.1 (futuro)

Conversaciones desde estados **no expiran** con el estado; metadata `estadoId`, `perfilId`, `bannerId`.

---

## 13. IA y Seguridad Messenger

| Asistente | Función |
|-----------|---------|
| `ia_seguridad_messenger` | Spam, fraude, enlaces, phishing |
| `ia_moderacion_messenger` | Acoso, extorsión, contenido prohibido |
| `ia_traduccion_messenger` | Fase 4 |
| `ia_asistente_conversacional` | Opcional — borrador only |

Reglas: no enviar sin autorización · no acceso ajeno · auditoría · señales no sanciones.

---

## 14. Automatizaciones de mensajería

Diseño incluido — no runtime.

| Tipo | Ejemplo |
|------|---------|
| Bienvenida | Primera conversación nueva |
| Fuera de horario | Mensaje recibido fuera horario |
| FAQ / respuestas rápidas | Keywords o IA intención |
| Ausencia / disponibilidad | Por estado presencia |
| Plantillas | Por tipo perfil / negocio |
| Programación / recordatorios | Fase 3 — con límites anti-spam |

**Reglas:** activación solo dueño · mensaje marcado `automatizacion` · `reglaAutomatizacionId` en historial · admin puede suspender · **prohibido** envío masivo spam.

**IA asistente:** sugerir respuesta, mejorar redacción, resumir, etiquetar — **borrador o señal**; envío solo con confirmación usuario.

---

## 15. Control administrativo

Habilitar/deshabilitar Messenger por **ámbito**:

Global · tipo cuenta · categoría · subcategoría · país · estado · ciudad · perfil · usuario · empresa · anunciante

**Modos:** habilitado · deshabilitado · suspensión temporal/permanente · solo lectura · solo recepción · solo envío · restricciones por `estadoSeguridad` / `estadoMensajeria` / reportes / `spamScore` / `nivelConfianza`

**Precedencia:** más específico gana (usuario > perfil > subcategoría > … > global).

Toda acción admin: historial + evento canónico + `logsAdmin` + adminId + motivo + fecha.

---

## 16. Multiusuario empresa

`usuarios/{empresaId}/messenger_operadores/{id}` — operador responde con `operadorId` en auditoría; `emisorId` = empresa.

---

## 17. Adjuntos por fases

| Fase | Tipos |
|------|-------|
| 1 | Texto |
| 2 | Imagen |
| 3 | Audio |
| 4 | Archivo, ubicación |

---

## 18. Riesgos

| ID | Nivel | Resumen |
|----|-------|---------|
| R-MSG-01 | Alto | Gap producción usuarios vs perfiles |
| R-MSG-02 | Alto | Registry VE placeholders |
| R-MSG-03 | Alto | Eliminar vs evidencia reportes |
| R-MSG-04 | Medio | Automatizaciones como spam |
| R-MSG-05 | Medio | Precedencia controles admin |
| R-MSG-06 | Medio | IA suplanta usuario |

---

## 19. Fuera de alcance

Runtime · Firestore rules · deploy · modificar capas congeladas · Stories/live (Fase 7) · videollamadas · grupos N · LLM runtime.

---

## 20. Entregables

| Artefacto | Archivo |
|-----------|---------|
| SPEC JSON | `SPEC-MESSENGER.json` |
| Anexo Dashboards | `ANEXO-MESSENGER-INTEGRACION-DASHBOARDS.json` |
| Fixtures | `fixtures-messenger-golden.json` (30 casos M01–M30) |
| Auditoría | `AUDITORIA-SPEC-MESSENGER.json` |
| Validador | `validar-spec-messenger.mjs` |
| Acta pendiente | `ACTA-CONGELAMIENTO-MESSENGER.json` |
| Propuesta VE MINOR | `PROPUESTA-ACTA-MINOR-VALIDATIONENGINE-MESSENGER.json` |

---

*Capa congelada — acta [`ACTA-CONGELAMIENTO-MESSENGER.json`](./ACTA-CONGELAMIENTO-MESSENGER.json). Runtime no autorizado.*
