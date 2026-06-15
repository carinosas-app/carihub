# Observación arquitectónica — Interacciones y Comunicación (futuro)

| Campo | Valor |
|-------|-------|
| **Estado** | **Observación completa para esta etapa** (capa NO diseñada) |
| **Ampliación** | **Congelada** — no ampliar hasta nueva autorización |
| **SPEC Interacciones** | **NO iniciar** |
| **Versión observación** | 1.2.1 |
| **Fecha** | 2026-06-09 |
| **Runtime** | **NO autorizado** |

Canónico: [`OBSERVACION-ARQUITECTONICA-INTERACCIONES.json`](./OBSERVACION-ARQUITECTONICA-INTERACCIONES.json)

Arquitectura objetivo futura. **No modifica** Catálogo, Cuentas, Seguridad, FieldEngine ni Dashboards congelados.

---

## Estados Temporales (Stories)

### Elegibilidad

| Regla | Valor |
|-------|-------|
| Publicar | Solo cuenta registrada y autenticada |
| Visitantes sin cuenta | No pueden publicar |
| Cumplimiento | Cuentas 1.0.0 · Seguridad MVP 1.0.0 · `estadoSeguridad` · `rolesCuenta[]` · permisos |

### Disponibilidad

Módulos habilitados (≥1): Perfil público · Negocio · Profesionista · Banners

### Límites

| Regla | Valor |
|-------|-------|
| Máximo activos / 24 h | **2** |
| Expiración | **24 h** automática |
| Historial expirados | **No** |
| Eliminación anticipada | **Sí** — propietario |

### Contenido

Texto · Foto · Video corto

### Audio

Foto/video con audio permitido · inicio **muted** · activación **manual** · **sin** autoplay con audio

### Interacción pública

Comentarios · respuestas · reacciones. Controles del propietario (activar/desactivar, audiencias, ocultar/eliminar/fijar, bloqueos). Comentarios y reacciones **expiran con el estado**.

### Interacción privada (Messenger)

CTAs: enviar mensaje · contactar · disponibilidad · solicitar información. Conversaciones **no expiran** con el estado. Metadata: `estadoId`, `perfilId`, `bannerId`, fecha origen.

### Visitantes sin cuenta

**Pueden:** ver estados, comentarios y reacciones públicos. **No pueden:** comentar, reaccionar, mensajear, encuestas ni publicar.

### Visualizaciones y estadísticas

Propietario: vistas, quién vio, fecha/hora aproximada, comentarios, reacciones, mensajes desde estado. Usuario puede mostrar u ocultar identidad (anónimo cuenta en stats).

### Moderación

Reportar estado/comentario · bloquear · moderación admin · takedown contenido ilegal.

---

## Transmisiones en Vivo (independiente de Stories)

### Cuota y notificaciones

| Regla | Valor |
|-------|-------|
| Relación con Stories | **Independiente** |
| Cuota diaria | **30 minutos** por cuenta / 24 h (sin cambio) |
| Distribución | Libre — ej. 1×30 min, 2×15 min, 3×10 min |
| Notificación al iniciar | A **quienes siguen** a la cuenta |
| Canal | Sistema unificado **Dashboards 1.0.0** |

### Controles del dueño (perfil / anunciante)

| Control | Opciones |
|---------|----------|
| Comentarios | Activar / desactivar |
| Reacciones | Activar / desactivar |
| Mensajes privados | Activar / desactivar |
| **Quién puede ver** | Público · usuarios registrados · seguidores |
| **Quién puede comentar** | Usuarios registrados · seguidores · nadie |
| **Quién puede mensajear** | Usuarios registrados · seguidores · nadie |

### Interacción y persistencia

| Tipo | Al terminar transmisión |
|------|-------------------------|
| Comentarios y reacciones | Pertenecen al evento; **pueden expirar** |
| Conversaciones Messenger | **No expiran** |

**Metadata Messenger:** `liveId`, `perfilId`, `bannerId` (si aplica), fecha origen.

### Moderación y seguridad

- **Admin:** moderar, suspender u ocultar en vivo por abuso.
- **Aplican:** Seguridad MVP 1.0.0 · `estadoSeguridad` · rate limits · reportes · bloqueos.

**Superficies:** perfil público · dashboards · resultados · promocionales (TBD).

---

## Seguidores y notificaciones (Stories)

| Evento | Notificación |
|--------|--------------|
| Publicar estado | A **quienes siguen** al publicador |
| Iniciar transmisión en vivo | A **quienes siguen** al publicador (ver sección En Vivo) |

Requiere grafo de seguimiento (futuro). No notificar estados ya expirados.

---

## Arquitectura objetivo por niveles (tentativo)

### Nivel 1

Estados 24h · comentarios · reacciones · mensajes desde estados · audio muted · estadísticas · reportes · bloqueos · moderación · encuestas · Q&A · compartir · menciones · etiquetas · ubicación · destacados · quién vio · patrocinados · transmisiones 30 min/día · **notificaciones a seguidores**.

### Nivel 2

Grupos · canales · videollamadas · llamadas de voz · IA social avanzada · traducción automática · resúmenes IA.

---

## Visión futura documentada (índice)

Stories · Comentarios · Reacciones · Seguidores · Messenger · Transmisiones en Vivo · Notificaciones a seguidores · Controles de privacidad · Moderación · IA social futura

---

## Dependencias de la capa Interacciones (futuro)

| Tipo | Capas |
|------|-------|
| **Posteriores obligatorias** | ValidationEngine → Messenger |
| **Relacionadas** | Dashboards 1.0.0 · Seguridad MVP 1.0.0 · RenderEngine · Notificaciones · EventBus |

---

## Cierre de etapa

Observación **v1.2.1** considerada **completa** para esta etapa por product owner.

- No ampliar la observación por ahora.
- No iniciar SPEC Interacciones.
- **Siguiente paso roadmap:** SPEC **ValidationEngine** v1.0.0.

---

*Observación v1.2.1 cerrada — solo documentación; sin runtime, Firestore, producción, deploy ni commit.*
