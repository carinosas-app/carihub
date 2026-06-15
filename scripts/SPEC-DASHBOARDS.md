# Especificación técnica — Dashboards CariHub

| Campo | Valor |
|-------|-------|
| **Versión spec** | 1.0.0 |
| **Fecha** | 2026-06-09 |
| **Estado** | **Congelado** |
| **Acta** | [`ACTA-CONGELAMIENTO-DASHBOARDS.md`](./ACTA-CONGELAMIENTO-DASHBOARDS.md) |
| **Implementación** | **NO autorizada** |

Contrato máquina: [`SPEC-DASHBOARDS.json`](./SPEC-DASHBOARDS.json)  
Auditoría base: [`AUDITORIA-DASHBOARDS.md`](./AUDITORIA-DASHBOARDS.md) · [`AUDITORIA-DASHBOARDS-IA.md`](./AUDITORIA-DASHBOARDS-IA.md)

---

## 1. Propósito

Definir la arquitectura de **cuatro dashboards**, módulos transversales (**notificaciones unificadas**, **centro de actividad**, **asistentes IA**), seguridad y compatibilidad con las capas congeladas.

| Hace | No hace |
|------|---------|
| Especifica módulos, rutas, datos y gates | Implementar HTML/JS runtime |
| Define eventos notificación e historial | Modificar Firestore producción |
| Contrata asistentes IA por contexto | Ejecutar LLM ni Cloud Functions |
| Documenta dependencias y migración objetivo | Deploy ni commit |

### Dependencias congeladas

| Capa | Versión |
|------|---------|
| Catálogo | `catalogo-2026-06-10` @ 1.0.0 |
| Cuentas | `cuentas-2026-06-10` @ 1.0.0 |
| Seguridad MVP | `seguridad-2026-06-10` @ 1.0.0 |
| FieldEngine | `fieldengine-2026-06-10` @ 1.0.1 |

### Pendientes (no bloquean congelamiento diseño)

ValidationEngine · RenderEngine (no autorizado) · Messenger · Pagos live

---

## 2. Arquitectura — híbrido

```
┌─────────────────────────────────────────┐
│  ADMIN (/admin) — aislado               │
│  RBAC · catálogo · revisión · IA admin  │
│  notificaciones admin · historial global  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  SHELL USUARIO (/cuenta) — modular      │
│  Router: tipoCuenta + rolesCuenta[]     │
│  ┌────────┬────────┬────────┬────────┐ │
│  │ Cuenta │ Perfil │Banners │Actividad│ │
│  │Visitante│Público │Anunciante│Notif. │ │
│  └────────┴────────┴────────┴────────┘ │
│  Campana notificaciones global          │
└─────────────────────────────────────────┘
```

| Componente | Archivo actual | Objetivo |
|------------|----------------|----------|
| Admin | `public/admin.html` | Modular 8+ módulos diseño |
| Shell usuario | `public/index.html` (parcial) + `dashboard-rentero.html` (mock) | `/cuenta` unificado |

**Router:**

- `rolesCuenta[]` ∋ `admin` → `/admin` (futuro RBAC)
- `tipoCuentaPrincipal=visitante` → módulos cuenta, favoritos, upgrade
- `tienePerfilPublico` → módulo perfil
- `rolesCuenta[]` ∋ `anunciante` → módulo banners

---

## 3. Dashboard Admin

**Estado producción:** ~40% (`admin.html`)

| Módulo spec | Producción |
|-------------|------------|
| Resumen, usuarios, revisión perfiles | Parcial |
| Solicitudes publicidad, denuncias | Parcial |
| Catálogo, schemas, RBAC | **Falta** |
| IA Arquitecto, Moderador, Comercial, Seguridad | **Falta** |
| Notificaciones admin, historial global | **Falta** |

**Lee:** `usuarios`, `denuncias`, `solicitudes_anuncios`, `soporte_mensajes`, `logsAdmin`, `logsSeguridad`, `pagos`, `anuncios`

**Escribe:** `usuarios`, `denuncias`, `solicitudes_anuncios`, `soporte_mensajes`, `logsAdmin`

**Futuro:** `perfiles`, `catalogo_subcategorias`, `contratos_*`, `admins`, `logs_acceso_privado`, `alertas_seguridad`

---

## 4. Dashboard Perfil Público

**Estado:** embebido en `index.html`; `perfil.html` = solo lectura pública

| Módulo | Estado |
|--------|--------|
| Wizard FieldEngine, verificación, snapshot | Falta |
| Edición campos, fotos, renovación | Parcial |
| Estadísticas, mensajes, notificaciones | Falta |

**Datos objetivo:** `perfiles/{perfilId}` + punteros en `usuarios`

**Motores:** FieldEngine (wizard), ValidationEngine (valores), RenderEngine (snapshot)

---

## 5. Dashboard Publicidad / Banners

**Estado:** funnel `registro-banner*.html`; sin panel anunciante

| Módulo | Estado |
|--------|--------|
| Funnel 2 pasos, precios Firestore | Producción |
| Panel campañas, renovación, stats | Falta |
| `contratos_banners`, pagos integrados | Falta |

**Datos:** `solicitudes_anuncios`, `configuracion_publicidad`, futuro `contratos_banners`, `anuncios`

---

## 6. Dashboard Usuario / Visitante

**Estado:** modales en `index.html` (~15%)

| Módulo | Estado |
|--------|--------|
| Login, panel mínimo, favoritos UI | Parcial |
| `DashboardVisitante` diseño | Falta |
| Upgrade visitante, categorías sugeridas | Falta |

**Diseño:** `config-registro-visitante-schema.json` → `DashboardVisitante`

---

## 7. Seguridad dashboards

| Dashboard | Login | Roles | Gates clave |
|-----------|-------|-------|-------------|
| Admin | Sí | admin RBAC fase 2 | `isAdmin`, logs, reauth acciones críticas |
| Perfil | Sí | owner | FieldEngine + `emailVerificado` + `estadoSeguridad` |
| Banners | Sí | anunciante owner | `solicitud_banner`, non-anonymous |
| Visitante | Sí | visitante | `estadoMensajeria`, favoritos cuenta real |

**Logs:** `logsAdmin`, `logsSeguridad`, `logs_acceso_privado` (INE), `alertas_seguridad`

---

## 8. Mensajería (conexión dashboards)

**Estado:** no implementada. Admin: `soporte_mensajes` solo.

**Modelo futuro:** `conversaciones/{id}/mensajes` + `usuarios/{id}/conversaciones_meta`

| Escenario | Dashboard |
|-----------|-----------|
| Visitante → perfil | Shell mensajes |
| Perfil + banners misma cuenta | UI unificada, metadata dual contexto |
| Admin suspende | `estadoMensajeria=suspendida` → banner en todos los shells |

---

## 9. Visibilidad por tipo de cuenta

| Módulo | Visitante | Perfil | Anunciante | Perfil+Banners | Admin |
|--------|:---------:|:------:|:----------:|:--------------:|:-----:|
| Cuenta / preferencias | ✓ | ✓ | ✓ | ✓ | — |
| Perfil wizard | — | ✓ | — | ✓ | — |
| Banners | — | — | ✓ | ✓ | — |
| Favoritos / mensajes | ✓ | ✓ | ✓ | ✓ | — |
| Notificaciones / actividad | ✓ | ✓ | ✓ | ✓ | ✓ global |
| Upgrade visitante | ✓ | — | — | — | — |
| Panel admin | — | — | — | — | ✓ |

---

## 10. Dependencias motores

| Dashboard | Catálogo | Cuentas | Seguridad | FieldEngine | ValidationEngine |
|-----------|:--------:|:-------:|:---------:|:-----------:|:----------------:|
| Admin | Alta | Alta | Alta | Media | Baja |
| Perfil | Alta | Alta | Alta | **Alta** | **Alta** |
| Banners | Baja | Media | Alta | Baja | Alta |
| Visitante | Media | Alta | Alta | **Alta** | Alta |

---

## 11. Asistentes IA

**Patrón:** `IAOrchestrator` + 7 especialistas (no asistente único global).

| ID | Dashboard | Confirmación humana |
|----|-----------|---------------------|
| `ia_asistente_cuenta` | Visitante | Siempre |
| `ia_asistente_perfil` | Perfil | Siempre + FieldEngine dry-run |
| `ia_asistente_publicidad` | Banners | Siempre |
| `ia_arquitecto` | Admin | Solo lectura |
| `ia_moderador` | Admin | Siempre |
| `ia_comercial` | Admin | Siempre |
| `ia_seguridad` | Admin | Siempre |

**Salida ejecutable:** solo `ia_recomendaciones/{id}` — nunca auto-acción.

Detalle: [`AUDITORIA-DASHBOARDS-IA.md`](./AUDITORIA-DASHBOARDS-IA.md)

---

## 12. Integración por cuenta (resumen)

| Tipo | Conexiones clave |
|------|------------------|
| **Perfil público** | `perfilId`, `subcategoriaId`, estados, contrato, mensajes, stats, notificaciones |
| **Visitante** | `usuarioId`, upgrade sin nuevo Auth, favoritos, categorías sugeridas |
| **Anunciante** | `anuncianteId`, solicitudes, contratos banner, pagos |
| **Admin** | roles, permisos, colas, logs, catálogo |

---

## 13. Asistentes IA — política global

Ver reglas R1–R10 en [`AUDITORIA-DASHBOARDS-IA.md`](./AUDITORIA-DASHBOARDS-IA.md).

---

## 14. Sistema unificado de notificaciones

**Colección:** `usuarios/{usuarioId}/notificaciones/{notificacionId}`

**UI:** campana global en shell usuario + centro notificaciones filtrable + preferencias por dominio.

### Dominios

| Dominio | Eventos principales | Origen | Prioridad |
|---------|---------------------|--------|-----------|
| **mensajes** | `mensaje_nuevo`, `conversacion_archivada` | `conversaciones` | Alta |
| **favoritos** | `perfil_favorito_nuevo` | `favoritos` → dueño perfil | Baja |
| **renovaciones** | `renovacion_proxima_7d`, `vencida`, `completada` | `contratos_*` | Alta |
| **contratos** | `activado`, `pausado`, `vencido`, `renovado` | `contratos_perfiles`, `contratos_banners` | Media |
| **pagos** | `pendiente`, `completado`, `fallido`, `reembolso` | `pagos` | Alta |
| **verificaciones** | `recibida`, `aprobada`, `rechazada`, `vencida` | `perfiles.verificacion` | Alta |
| **denuncias** | `resuelta_reportante`, `sobre_tu_perfil` | `denuncias` | Media |
| **banners** | `solicitud_*`, `requiere_correccion`, `activo`, `vencido` | `solicitudes_anuncios` | Alta |
| **seguridad** | `email_verificar`, `estado_seguridad_cambio`, `cuenta_restringida` | `usuarios.seguridad` | Crítica |
| **recomendaciones_ia** | `ia_sugerencia_nueva`, `informe_listo_admin` | `ia_recomendaciones` | Baja |

### Modelo notificación

```typescript
{
  notificacionId: string;
  usuarioId: string;
  dominio: NotificacionDominio;
  tipoEvento: string;
  titulo: string;
  cuerpo: string;
  entidadTipo?: string;
  entidadId?: string;
  accionUrl?: string;
  leida: boolean;
  prioridad: "baja" | "media" | "alta" | "critica";
  canal: "in_app" | "email_futuro" | "push_futuro";
  createdAt: Timestamp;
  expiraAt?: Timestamp;
  metadata?: Record<string, unknown>;
}
```

**Deduplicación:** `hash(usuarioId + dominio + tipoEvento + entidadId + ventana24h)`

**Productor:** Cloud Function / EventBus post-commit — **diseño; no implementado**

**Privacidad:** denuncias — no exponer identidad denunciante al reportado; favoritos — opt-in dueño perfil.

---

## 15. Centro de actividad e historial

**Propósito:** línea de tiempo auditable del usuario — distinta de notificaciones (alertas accionables). Un evento puede generar **ambos**.

**UI:** módulo **Actividad** en shell usuario; **Historial global** en admin.

### Dominios de historial

| Dominio | Colección | Eventos ejemplo | Lectura |
|---------|-----------|-----------------|---------|
| **historial_perfil** | `perfiles/{id}/historial_estados` | borrador, enviado_revision, aprobado, rechazado | owner + admin |
| **historial_banners** | `solicitudes_anuncios/.../historial` | creada, estado_cambiado, activado | anunciante + admin |
| **historial_pagos** | `pagos` + `historial_actividad` | intento, completado, fallido | owner + admin comercial |
| **historial_renovaciones** | `contratos_*/renovaciones` | recordatorio, completada | owner + admin |
| **historial_verificaciones** | `perfiles/.../historial_verificacion` | enviados, aprobada, rechazada | owner + admin |
| **historial_seguridad** | `usuarios/.../historial_seguridad` | login, cambio_password, estado_seguridad | owner resumido + admin |
| **historial_mensajes** | `conversaciones_meta` | iniciada, mensaje_enviado, bloqueo | participantes |
| **historial_acciones_ia** | `ia_recomendaciones`, `ia_arquitecto_informes` | sugerencia, aceptada, rechazada | owner + admin |
| **historial_actividad_cuenta** | `usuarios/.../historial_actividad` | cuenta_creada, upgrade, favorito, denuncia | owner + admin |

### Modelo evento actividad

```typescript
{
  eventoId: string;
  usuarioId: string;
  dominio: HistorialDominio;
  tipo: string;
  titulo: string;
  descripcion?: string;
  entidadTipo?: string;
  entidadId?: string;
  actorId?: string;
  actorTipo: "usuario" | "admin" | "sistema" | "ia_recomendacion";
  createdAt: Timestamp;
  metadata?: Record<string, unknown>;
}
```

**Privacidad:** `historial_verificacion` — solo estados, **sin URLs INE** en timeline usuario. `historial_seguridad` usuario — sin `ipHash` completo.

---

## Dependencias ocultas detectadas

| ID | Dependencia | Bloquea |
|----|-------------|---------|
| DO1 | Notif. favoritos → `perfiles/{perfilId}` separado | dominio favoritos |
| DO2 | Historial perfil → `perfiles/historial_estados` | centro actividad perfil |
| DO3 | Notif. mensajes → Messenger spec | dominio mensajes |
| DO4 | Pagos/renovaciones → `contratos_*` no producción | contratos, pagos |
| DO5 | IA perfil ejecutable → ValidationEngine | acciones IA perfil |
| DO6 | Productor eventos → Cloud Functions | runtime notificaciones |
| DO7 | `denuncias create=false` rules | notif. denuncias usuario |
| DO8 | Modales acoplados `index.html` | shell `/cuenta` |
| DO9 | RenderEngine snapshot → qué cambio dispara revisión | notif. post-publicación |
| DO10 | `estadisticas_visitas` desconectada | stats en actividad |

---

## Módulos faltantes (runtime)

- DashboardShell `/cuenta`
- ValidationEngine · Messenger · contratos runtime
- Productor EventBus notificaciones/historial
- RBAC admin · Admin catálogo UI
- Wizard FieldEngine · Panel anunciante
- Migración `usuarios` monolito → hub + `perfiles`

---

## Riesgos de arquitectura

| ID | Nivel | Riesgo |
|----|-------|--------|
| A1 | Alto | Monolito `usuarios/{uid}` |
| A2 | Alto | Dos sistemas notificaciones paralelos (home vs spec) |
| A3 | Medio | Eventos duplicados sin EventBus canónico |
| A4 | Medio | PII en historial verificaciones |
| A5 | Medio | Spam notificaciones IA |

## Riesgos de seguridad

| ID | Nivel | Riesgo |
|----|-------|--------|
| S1 | Crítico | Admin email único |
| S2 | Alto | Filtración identidad en notif. denuncias |
| S3 | Alto | Historial seguridad expone hashes |
| S4 | Medio | Push futuro sin consentimiento |

---

## Compatibilidad capas congeladas

### Catálogo 1.0.0 — **Compatible**

- Módulo perfil usa `subcategoriaId`, `formularioId`, `arquetipo` del mapa congelado.
- Notificaciones categoría sugerida referencian catálogo temporal.
- Admin catálogo UI es diseño futuro; no contradice catálogo congelado.

### Cuentas 1.0.0 — **Compatible con reserva migración**

- Spec asume `usuarios` hub + `perfiles/{perfilId}` + subcolecciones `notificaciones`, `historial_actividad`, `favoritos`.
- Producción legacy monolito documentada; migración en acta separada.

### Seguridad MVP 1.0.0 — **Compatible**

- Notificaciones dominio `seguridad` alineadas a `estadoSeguridad`, `emailVerificado`.
- Mensajes respetan `estadoMensajeria`.
- Gates Turnstile/rate limits vía ValidationEngine — no en dashboard directo.

### FieldEngine 1.0.1 — **Compatible**

- Wizard perfil y `ia_asistente_perfil` usan `resolveRegistrationSchema` dry-run.
- Gates `guardar_borrador` / `enviar_revision` explicados en UI y notificaciones.
- Dashboards no persisten schema resuelto.

---

## Recomendaciones

1. **Congelar** esta SPEC v1.0.0 tras aprobación explícita.
2. **Generar** `ACTA-CONGELAMIENTO-DASHBOARDS` inmediatamente después.
3. Definir **EventBus** canónico en ValidationEngine spec (evento → notificación + historial).
4. Migración `usuarios`→`perfiles` antes de notificaciones favoritos.
5. **MVP notificaciones:** seguridad, verificaciones, banners, renovaciones.
6. **MVP historial:** actividad_cuenta, historial_perfil, historial_banners.
7. PrivacyGuard en denuncias, verificaciones, seguridad.
8. Campana notificación única en shell usuario.

---

## Criterios de aceptación (spec)

- [x] Cuatro dashboards con módulos
- [x] Arquitectura híbrida
- [x] 7 asistentes IA + política
- [x] Notificaciones 10 dominios
- [x] Historial 9 dominios
- [x] Compatibilidad 4 capas
- [x] Dependencias ocultas documentadas
- [x] Aprobación congelamiento product owner
- [x] Acta generada

---

## Veredicto congelamiento

| Pregunta | Respuesta |
|----------|-----------|
| **Estado** | **CONGELADO** v1.0.0 |
| **Acta** | [`ACTA-CONGELAMIENTO-DASHBOARDS.json`](./ACTA-CONGELAMIENTO-DASHBOARDS.json) |
| **¿Autoriza runtime?** | **No** — `implementacionAutorizada: false` |

---

## Fuera de alcance

Runtime dashboards · Firestore rules · Deploy · LLM · Pagos live · Migración legacy sin acta.

---

*Especificación de diseño v1.0.0 — no autoriza implementación.*
