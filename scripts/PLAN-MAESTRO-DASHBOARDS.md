# Plan Maestro — Dashboards CariHub

| Campo | Valor |
|-------|-------|
| **Versión** | 1.0.0 |
| **Fecha** | 2026-06-10 |
| **Estado** | Plan de diseño documental |
| **Modo** | Solo análisis — **sin runtime/cambios; no modifica capas existentes** |

Canónico: [`PLAN-MAESTRO-DASHBOARDS.json`](./PLAN-MAESTRO-DASHBOARDS.json)
Base: [`SPEC-DASHBOARDS.json`](./SPEC-DASHBOARDS.json) (CONGELADO 1.0.0) · [`PLAN-MAESTRO-REGISTRO-CUENTA.md`](./PLAN-MAESTRO-REGISTRO-CUENTA.md) · [`ACTA-CONGELAMIENTO-SHARED-CORE.md`](./ACTA-CONGELAMIENTO-SHARED-CORE.md) · [`ACTA-CONGELAMIENTO-RENDERENGINE.md`](./ACTA-CONGELAMIENTO-RENDERENGINE.md)

---

## ⚠️ Reconciliación con la capa congelada

`SPEC-DASHBOARDS 1.0.0` (**CONGELADO**) define **4 dashboards** bajo un **shell modular por `tipoCuentaPrincipal` + `rolesCuenta[]`**: `dashboard_admin`, `dashboard_perfil`, `dashboard_banners`, `dashboard_cuenta` (visitante). **Este plan NO lo modifica.**

Mapeo de los **5 dashboards** solicitados sobre el baseline:

| Solicitado | Mapeo |
|------------|-------|
| **Dashboard Perfil** | = `dashboard_perfil` congelado (persona: adulto/independiente/profesionista) |
| **Dashboard Negocio** | **Variante** de `dashboard_perfil` (`tipoPerfil=negocio`) — mismo shell, no es dashboard nuevo |
| **Dashboard Anunciante** | = `dashboard_banners` congelado |
| **Dashboard Empresa** | **Extensión futura** (multi-perfil/sucursal) → requiere **Dashboards MINOR 1.1.0** |
| **Dashboard Operador** | **Nuevo** (staff/sub-admin con permisos delegados) → requiere **RBAC + MINOR** |

> Perfil, Negocio y Anunciante caben en el baseline 1.0.0. **Empresa y Operador son extensiones propuestas**; de adoptarse exigen una versión MINOR de Dashboards (no se aplica aquí).

---

## Frontera definitiva

| Capa | Responsabilidad |
|------|-----------------|
| **Cuenta** | Identidad/onboarding/credenciales/verificación; crea el perfil |
| **Dashboards** | Gestión diaria de lo ya creado: estado, edición (CTA→wizard), métricas, renovaciones, notificaciones, historial |
| **Admin** | Moderación global, aprobaciones, RBAC, catálogo/schemas (aislado en `/admin`) |
| **Futuros** | Empresa (multi-perfil), Operador (staff delegado) |

---

## Inventario actual

- `public/admin.html` → `dashboard_admin` parcial (~40%, RBAC email único).
- `public/dashboard-rentero.html` → UI base del shell usuario (prototipo, 12 temas, sin Firebase).
- `public/index.html` modales (`modalPanel`/`modalEditar`/`modalMiPerfil`) → `dashboard_perfil`+`dashboard_cuenta` embebidos.
- **Ausentes:** shell `/cuenta` modular · `perfiles/{perfilId}` · `contratos_*` · subcolecciones notificaciones/historial · RBAC `admins/{uid}`.

**Mezclado en Home:** `modalPanel`, `modalEditar`, estadísticas básicas, estado/`actualizacionPendiente`.
**Debe moverse a Dashboards:** panel de cuenta, estado (lectura+CTA), métricas, renovaciones, notificaciones, historial, punto de entrada a edición.

---

## Mapa funcional de los 5 dashboards

### Dashboard Perfil — `dashboard_perfil` (baseline 1.0.0)
- **Objetivos:** gestionar perfil propio, verificación, vigencia, desempeño.
- **Límites:** no auto-aprueba, no modera, no cobra.
- **Pantallas:** Resumen · Editar · Fotos · Verificación · Estadísticas · Mensajes · Renovación · Actividad.
- **Rutas:** `/cuenta`, `/cuenta/perfil`, `/cuenta/perfil/editar`, `/cuenta/perfil/estadisticas`.
- **Editar:** campos públicos (vía wizard). **Solo lectura:** `estadoRevision`, verificación, estadísticas. **Requiere aprobación admin:** publicación/re-revisión.
- **IA:** `ia_asistente_perfil` (confirmación humana; FieldEngine dry-run).

### Dashboard Negocio — variante de `dashboard_perfil`
- `tipoPerfil=negocio`: componentes negocio, horarios/NAP, documentos. Posible multi-sucursal → Empresa. **Mismo shell.**

### Dashboard Anunciante — `dashboard_banners` (baseline 1.0.0)
- **Responsabilidades:** funnel, solicitudes, campañas, creativos, renovaciones, pagos banner, estadísticas, historial.
- **Rutas:** `/cuenta/anunciante`, `/solicitud`, `/campanas`, `/estadisticas`.
- **Requiere aprobación admin:** activación/correcciones. **IA:** `ia_asistente_publicidad`.

### Dashboard Empresa — extensión futura (MINOR 1.1.0)
- Multi-perfil/sucursal, roles internos, facturación consolidada, métricas agregadas.
- **Depende de:** multi-perfil (UUID) post-bridge, ADR-URL-CANONICA multi-perfil, roles internos.

### Dashboard Operador — nuevo (RBAC + MINOR)
- Staff con permisos **delegados granulares** (revisión, soporte, denuncias por scope); todo auditado.
- **Rutas:** `/operador/*`. **Prohibido:** cambiar RBAC, configurar catálogo/schemas, ver fuera de scope.
- **Frontera:** Operador = Admin con scope reducido; depende de RBAC custom claims + `admins/{uid}`.

---

## Matrices Dashboard → …

### → Funciones
| Dashboard | Funciones |
|-----------|-----------|
| Perfil | editar(wizard), verificación, renovación, estadísticas, mensajes, historial |
| Negocio | editar_negocio, horarios, verificación, estadísticas |
| Anunciante | solicitud, creativos, pago, renovación, estadísticas_anuncio |
| Empresa | multi_perfil, sucursales, facturación, métricas_agregadas |
| Operador | revisar_cola, soporte, moderar_denuncias(scope) |

### → Permisos
| Dashboard | Permisos |
|-----------|----------|
| Perfil/Negocio | owner: editar campos propios; lectura estados; revisión admin para publicar |
| Anunciante | owner: editar solicitud/creativo; activación por admin |
| Empresa | owner empresa: editar sus perfiles; alta sucursal por admin |
| Operador | claims acotados; editar solo items asignados; auditado |

### → Widgets
| Dashboard | Widgets |
|-----------|---------|
| Perfil | estado_publicacion, completitud, vistas, mensajes, vencimiento, verificación |
| Negocio | ficha_negocio, horarios, vistas, verificación |
| Anunciante | campanas_activas, impresiones, clics, vencimiento, estado_solicitud |
| Empresa | resumen_multisucursal, métricas_agregadas, facturación |
| Operador | mi_cola, pendientes, SLA, mis_acciones |

### → Métricas
| Dashboard | Métricas |
|-----------|----------|
| Perfil | vistas, favoritos, conversaciones, días_vencimiento |
| Negocio | vistas, contactos, verificación |
| Anunciante | impresiones, CTR, días_activos, conversión_funnel |
| Empresa | agregados por sucursal, ingresos |
| Operador | items_resueltos, tiempo_respuesta, SLA |

### → Módulos externos
| Dashboard | Externos |
|-----------|----------|
| Perfil | Cuenta(wizard), RenderEngine(snapshot), Messenger, Pagos, Interacciones, FieldEngine, VE |
| Negocio | Cuenta, RenderEngine, Pagos, FieldEngine |
| Anunciante | Banners, Pagos, Admin(aprobación), RenderEngine(slot) |
| Empresa | Cuenta(multi-perfil), Pagos(consolidado), Admin |
| Operador | Admin, VE, Messenger(soporte), Seguridad |

---

## Módulos internos y rutas

- **Internos:** AuthShell, DashboardRouter (por tipoCuenta+roles), NotificacionesUnificadas, CentroActividad, IAOrchestrator, SecurityGates.
- **Rutas:** `/cuenta` (shell modular usuario) · `/operador` (RBAC scope) · `/admin` (aislado). **Todas privadas/noindex** (RenderEngine no renderiza dashboards).
- **Permisos:** `tipoCuentaPrincipal` + `rolesCuenta[]` + (futuro) `admins/{uid}` claims. IA solo recomienda, nunca auto-ejecuta.

---

## Qué pertenece / qué NO pertenece a Dashboard

**Pertenece:** gestión diaria propia · estado/métricas/notificaciones/historial · punto de entrada a edición · renovaciones (CTA).

**No pertenece (→ destino):** onboarding/credenciales (**Cuenta**) · moderación/RBAC (**Admin**) · render público (**RenderEngine**) · reglas de validación (**VE**) · resolución de schema (**FieldEngine**) · cobro real (**Pagos**) · inventario/precios banners (**Banners**) · favoritos/visitas crudos (**Interacciones**) · edición de temas (**ThemeEngine**) · prompts/LLM (**Agentes IA**) · contrato base (**Shared/Core**).

---

## Riesgos

| ID | Nivel | Riesgo | Mitigación |
|----|-------|--------|------------|
| DB-R01 | Alto | Taxonomía de 5 diverge del baseline (4) | Perfil/Negocio/Anunciante caben; Empresa/Operador → Dashboards MINOR |
| DB-R02 | Alto | Shell `/cuenta` depende de routing + migración (DO8/A1) | Refactor routing + migración previa |
| DB-R03 | Alto | Operador sin RBAC real (admin email único, S1) | RBAC custom claims antes de Operador |
| DB-R04 | Medio | Notificaciones/historial sin EventBus ni subcolecciones (DO2/DO6) | Diseñar productor de eventos; MVP acotado |
| DB-R05 | Medio | PII en historial (verificaciones/seguridad) (A4/S3) | PrivacyGuard; solo estados |
| DB-R06 | Medio | Solapamiento Cuenta↔Dashboards (edición) | Edición en wizard de Cuenta; Dashboard = entrada |
| DB-R07 | Bajo | Spam de recomendaciones IA (A5) | Límites + preferencias |

---

## Dependencias

- **Congeladas:** Dashboards 1.0.0 · Shared/Core 1.0.0 · RenderEngine 1.0.0 · FieldEngine 1.0.1 · VE 1.1.0 · Catálogo/Cuentas/Seguridad · Messenger 1.0.0.
- **Precondiciones:** migración usuarios→perfiles · RBAC admin (Operador) · productor de eventos (Cloud Functions) · Registro/Cuenta extraído.
- **Extensiones propuestas:** Dashboards MINOR 1.1.0 (Empresa + Operador).

---

## Estructura ideal futura (lógica)

```
/cuenta  (shell modular por tipoCuenta+roles)
  ├── perfil      (baseline)
  ├── negocio     (variante perfil)
  ├── anunciante  (baseline banners)
  └── empresa     (futuro, MINOR)
/operador  (Admin con scope — RBAC, futuro MINOR)
/admin     (aislado)
Transversales: NotificacionesUnificadas · CentroActividad · IAOrchestrator
Consume: Shared/Core · clientes VE/FieldEngine/RenderEngine · resúmenes Messenger/Pagos/Banners/Interacciones
```

---

## Orden recomendado de implementación

| Paso | Acción | Prioridad | Depende |
|------|--------|-----------|---------|
| 1 | Shell `/cuenta` modular básico (perfil) | **P0** | Registro/Cuenta + Core |
| 2 | Dashboard perfil: estado, edición(CTA), estadísticas | **P0** | — |
| 3 | Dashboard anunciante (panel post-solicitud) | P1 | Banners |
| 4 | Notificaciones MVP (seguridad/verificaciones/renovaciones/banners) + EventBus | P1 | Cloud Functions |
| 5 | Centro de actividad MVP | P1 | — |
| 6 | RBAC admin + Operador (scope) | P2 | RBAC · **Dashboards MINOR** |
| 7 | Dashboard empresa (multi-perfil) | P2 | multi-perfil · **Dashboards MINOR** |

---

## ¿Procede crear PLAN-MAESTRO-DASHBOARDS.md/json?

**Sí — ya entregados ambos.** Organiza el ecosistema y fija las fronteras Cuenta/Dashboards/Admin/futuros **sin tocar la capa congelada**, e identifica explícitamente qué requeriría un **Dashboards MINOR** (Empresa, Operador).

**Siguientes pasos sugeridos:** si se adoptan Empresa/Operador → `PROPUESTA-ACTA-MINOR-DASHBOARDS-1.1.0`; además `PLAN-MAESTRO-ADMIN` (RBAC) y el anexo operacional de migración.

---

*Plan documental — no modifica la capa Dashboards 1.0.0 ni otras capas congeladas (Shared/Core, RenderEngine, VE, FieldEngine, Messenger, Cuentas/Catálogo/Seguridad). No inicia runtime ni SPEC.*
