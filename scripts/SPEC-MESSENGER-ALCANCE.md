# Propuesta de alcance — CariHub Messenger

| Campo | Valor |
|-------|-------|
| **Versión alcance** | 0.1.0 |
| **Fecha** | 2026-06-09 |
| **Estado** | **Análisis de alcance** |
| **Runtime** | **NO autorizado** |
| **Capas congeladas** | **Solo lectura — no modificar** |

Canónico: [`SPEC-MESSENGER-ALCANCE.json`](./SPEC-MESSENGER-ALCANCE.json)

Análisis IA y Seguridad: [`ANALISIS-MESSENGER-IA-SEGURIDAD.md`](./ANALISIS-MESSENGER-IA-SEGURIDAD.md)

---

## 1. Visión arquitectónica

**CariHub** = plataforma principal (`index`, `resultados`, `perfil`, `registro`, `admin`).

**CariHub Messenger** = mensajería interna como **aplicación/módulo separado**, no embebida en Home ni Resultados.

```
CariHub (plataforma)              CariHub Messenger (app separada)
─────────────────────             ─────────────────────────────────
index.html                        /messenger
resultados.html                   /messenger/chat
perfil.html          ──💬──►      /messenger/configuracion
registro.html                     /messenger/reportes
admin.html                        messenger.html (legacy alias)
```

**Punto de entrada:** botón **«Mensaje interno»** en perfil → abre Messenger; **no** WhatsApp ni teléfono privado.

Messenger es **módulo central** al mismo nivel que Usuarios, Perfiles, Banners, Administración y Pagos.

---

## 2. Requisitos de acceso

| Requisito | Regla |
|-----------|-------|
| Visitante sin cuenta | **No** puede enviar mensajes |
| Cuenta registrada + sesión | **Sí** |
| Email verificado | **Obligatorio** |
| Teléfono verificado | **Obligatorio** antes de enviar |
| `estadoMensajeria` | `habilitada` (u otras según gates) — ref. Cuentas 1.0.0 |
| `estadoSeguridad` | Gates Seguridad MVP 1.0.0 |
| `nivelConfianza` | ≥ 40 para envío normal — ref. Seguridad MVP |

---

## 3. Modelo de datos (diseño)

### Conversación

```
conversaciones/{conversacionId}
├── participante1Id, participante2Id
├── perfilContextoId          # perfil desde el que se inició
├── fechaCreacion
├── ultimoMensaje, fechaUltimoMensaje
├── estado                    # activa | solicitud_* | bloqueada | reportada | archivada | cerrada_admin
├── solicitudPendiente        # boolean — categorías adultos
├── bloqueada, reportada
└── mensajes/{mensajeId}      # subcolección
```

**Meta por usuario:** `usuarios/{id}/conversaciones_meta/{convId}` — bandeja, no leer todas las conversaciones globales.

### Mensaje

| Campo | Descripción |
|-------|-------------|
| `emisorId`, `receptorId` | `usuarioId` |
| `texto` | Contenido |
| `mensajeOriginal`, `mensajeTraducido` | Fase traducción |
| `idiomaOrigen`, `idiomaDestino` | Fase traducción |
| `estadoEntrega` | enviado · entregado · visto |
| `tipo` | texto · imagen · audio · archivo · ubicación · sistema |
| `senalRiesgoId` | Ref. pipeline IA-Seguridad |

### Bloqueos y reportes

- **Bloqueos:** `usuarios/{id}/bloqueos/{usuarioBloqueadoId}` — ref. Cuentas congeladas
- **Reportes:** `reportes_mensajeria/{id}` — usuario, conversación, mensaje, motivo, estado

---

## 4. Funcionalidades por fase

| Fase | Contenido |
|------|-----------|
| **1 — MVP diseño** | Texto, reportes, bloqueos, solicitud conversación, rate limits, notificaciones internas, admin reportes |
| **2** | Imágenes, palabras prohibidas |
| **3** | Audios |
| **4** | Traducción automática + `ia_traduccion_messenger` |
| **Futuro** | Archivos, ubicación, videollamadas, push, email, WhatsApp, multioperador empresa |

**Fase 1 no activa todo en runtime** — deja la **base diseñada** para escalar sin rehacer arquitectura con miles de conversaciones.

---

## 5. Solicitud de conversación (anti-spam)

Especialmente **categorías adultos**:

> Carlos quiere enviarte un mensaje.  
> [Aceptar] [Rechazar]

Evita spam masivo a perfiles de alto contacto. Estados: `solicitud_enviada` → `solicitud_aceptada` | `solicitud_rechazada`.

---

## 6. Límites anti-spam

| Perfil | Límite |
|--------|--------|
| Usuario nuevo (`nivelConfianza` < 40) | 5 conversaciones nuevas/día · 20 mensajes/hora |
| Usuario verificado | 60 mensajes/hora · burst 10/min |
| Ref. congelada | `config-seguridad-mvp-schema.json` → `rateLimits.mensaje_futuro` |

---

## 7. Configuración de usuario

- Permitir / bloquear mensajes
- Silenciar / archivar / eliminar conversación (local)
- Fijar, buscar, filtrar conversaciones
- Idioma preferido (traducción futura)
- Presencia: en línea · ausente · desconectado · última conexión

---

## 8. Permisos por tipo de cuenta

| Tipo | Capacidades |
|------|-------------|
| **Adultos** | Recibir, bloquear, limitar quién escribe, solicitud conversación |
| **Independiente / Profesionista** | Recibir, bloquear, cotizaciones |
| **Empresa** | Recibir, multioperador (futuro) |
| **Admin** | Reportes, suspender mensajería, cerrar conversación, bitácora |

---

## 9. Capa IA y Seguridad de Mensajería

Análisis detallado: [`ANALISIS-MESSENGER-IA-SEGURIDAD.md`](./ANALISIS-MESSENGER-IA-SEGURIDAD.md)

### Detecciones

- Spam · mensajes masivos · fraude
- Enlaces peligrosos · phishing
- Acoso · extorsión
- Contenido prohibido (políticas CariHub)

### Integración

`estadoMensajeria` · `estadoSeguridad` · reportes · bloqueos · rate limits · `spamScore` · EventBus · notificaciones admin

### Asistentes futuros

| ID | Rol |
|----|-----|
| `ia_seguridad_messenger` | Spam, fraude, enlaces, phishing |
| `ia_moderacion_messenger` | Acoso, extorsión, contenido prohibido, cola admin |
| `ia_traduccion_messenger` | Traducción (fase 4) |
| `ia_asistente_conversacional` | Opcional — FAQs; **nunca envía sin autorización** |

### Reglas IA

1. La IA **no envía** mensajes en nombre del usuario sin autorización explícita.
2. La IA **no accede** a conversaciones privadas fuera de permisos definidos.
3. Toda acción automática queda **auditada**.
4. La IA genera **alertas, recomendaciones o señales de riesgo**.
5. **Bloqueo y sanción final:** reglas del sistema + moderación administrativa.

---

## 10. Integración con capas congeladas (solo lectura)

| Capa | Uso Messenger |
|------|---------------|
| **ValidationEngine 1.0.0** | `validateAction` — `mensaje_enviar`, `conversacion_iniciar`, `bloqueo_usuario`, `reportar_conversacion`; fanOutPlan EventBus |
| **Seguridad MVP 1.0.0** | Turnstile, rate limits, `spamScore`, `estadoSeguridad`, `nivelConfianza` |
| **Cuentas 1.0.0** | `estadoMensajeria`, bloqueos, `conversaciones_meta` |
| **Dashboards 1.0.0** | Notificaciones dominio `mensajes`, historial, `ia_recomendaciones`, módulo admin |
| **FieldEngine 1.0.1** | Sin dependencia directa Messenger |

**Nota:** Registry VE tiene placeholders `mensajeria_futura` — SPEC Messenger formalizará `fanOutPlan` sin modificar VE congelado hasta acta de versión si aplica.

---

## 11. Administración

- Ver reportes · suspender mensajería · cerrar conversación
- Revisar conversaciones denunciadas · bitácora acciones
- Cola moderación IA · alertas seguridad

**Notificaciones admin propuestas:** `mensajeria.reporte_recibido`, `mensajeria.spam_umbral`, `mensajeria.acoso_detectado`, `mensajeria.phishing_detectado`.

---

## 12. Fuera de alcance

- Runtime, Firestore rules, deploy, producción
- Modificación de capas congeladas
- Stories / transmisiones en vivo — [`OBSERVACION-ARQUITECTONICA-INTERACCIONES.json`](./OBSERVACION-ARQUITECTONICA-INTERACCIONES.json) Fase 7
- Implementación LLM

---

## 13. Siguiente entregable

**SPEC Messenger v1.0.0** formal (`SPEC-MESSENGER.md` + `.json`) incorporando este alcance, análisis IA-Seguridad, fixtures golden y auditoría de diseño.

---

*Documento de alcance — no autoriza implementación.*
