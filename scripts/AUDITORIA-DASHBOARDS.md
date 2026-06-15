# Auditoría integral de dashboards CariHub

| Campo | Valor |
|-------|-------|
| **Fecha** | 2026-06-09 |
| **Alcance** | Inventario, seguridad, arquitectura — **sin implementación** |
| **Base congelada** | Catálogo 1.0.0 · Cuentas 1.0.0 · Seguridad MVP 1.0.0 · FieldEngine 1.0.1 |
| **Actualización IA** | 2026-06-09 — capa asistentes integrada |

Canónico: [`AUDITORIA-DASHBOARDS.json`](./AUDITORIA-DASHBOARDS.json)  
Addendum IA: [`AUDITORIA-DASHBOARDS-IA.md`](./AUDITORIA-DASHBOARDS-IA.md)

---

## Resumen ejecutivo

| Dashboard | Existe | Completitud | Archivo principal |
|-----------|--------|-------------|-------------------|
| **Admin** | Sí | ~40% | `public/admin.html` |
| **Perfil público** | Parcial (embebido) | ~25% | `public/index.html` + `perfil.html` (solo lectura) |
| **Publicidad / Banners** | Parcial (funnel, sin panel) | ~35% | `registro-banner*.html` |
| **Usuario / Visitante** | Parcial (modales home) | ~15% | `public/index.html` |

**Ningún dashboard está completo según diseño congelado.** Existe además `public/dashboard-rentero.html` como **mock UI** (0% Firebase) que anticipa el panel unificado anunciante/perfil.

**Arquitectura recomendada: híbrido**
- **Admin separado** (superficie de ataque, RBAC, datos privados)
- **Shell modular usuario** (visitante + perfil + banners según `tipoCuentaPrincipal` y `rolesCuenta[]`)

**Brecha crítica:** producción usa `usuarios/{uid}` monolito; diseño congelado exige `usuarios` hub + `perfiles/{perfilId}`.

---

## 1. Inventario de dashboards existentes

### 1.1 Dashboard Admin

| Aspecto | Detalle |
|---------|---------|
| **Estado** | Existe — parcial |
| **Archivos** | [`public/admin.html`](../public/admin.html) |
| **Diseño objetivo** | [`config-admin-arquitectura-completa-schema.json`](./config-admin-arquitectura-completa-schema.json) — 8 módulos + complementarios |

**Módulos actuales (14 secciones sidebar):**

| Módulo | Estado |
|--------|--------|
| Resumen / métricas | Funcional (conteos) |
| Usuarios / Activos / Pendientes / Vencidos | Funcional — CRUD `usuarios` |
| Denuncias | Lectura + update estado |
| Mensajes soporte | `soporte_mensajes` — no P2P usuario |
| Vistas / Gráficas | Stub / placeholder |
| Pagos | Lectura colección vacía |
| Historial | `logsAdmin` básico |
| Seguridad | `logsSeguridad` lectura |
| Solicitudes publicidad | Funcional — workflow estados |
| Anuncios | Lectura colección sin gestión |

**Módulos faltantes (diseño):** catálogo/subcategorías, schemas/formularios, render/componentes, búsqueda, categorías sugeridas, contratos perfiles/banners, precios promociones perfiles, imágenes banners, IA arquitecto, RBAC, `logs_acceso_privado`, `alertas_seguridad`.

**Lee:** `usuarios`, `denuncias`, `solicitudes_anuncios`, `soporte_mensajes`, `logsAdmin`, `logsSeguridad`, `pagos`, `anuncios`, `analytics_eventos`

**Escribe:** `usuarios`, `denuncias`, `solicitudes_anuncios`, `soporte_mensajes`, `logsAdmin`

**Colecciones futuras:** `perfiles`, `catalogo_subcategorias`, `contratos_perfiles`, `contratos_banners`, `solicitudes_categorias`, `admins`, `logs_acceso_privado`, `alertas_seguridad`, `cola_revision`

**Riesgos si se mantiene así:** admin único por email; INE/selfie sin log de acceso privado; sin módulo catálogo (cambios requieren código); pagos/analytics desconectados; denuncias no creables desde usuarios.

---

### 1.2 Dashboard Perfil Público

| Aspecto | Detalle |
|---------|---------|
| **Estado** | Parcial — **no es dashboard dedicado** |
| **Archivos** | `index.html` → `modalPanel`, `modalEditar`, `modalRegistro`; `perfil.html` = vista pública `?id=` |
| **Diseño** | Wizard FieldEngine + snapshot RenderEngine |

**Módulos actuales:** resumen estado, edición campos públicos limitados, registro legacy, renovación placeholder.

**Faltantes:** wizard FieldEngine, fotos completas, verificación INE/selfie UI, `estadoPublicacion` unificado, estadísticas, denuncias/favoritos recibidos, notificaciones, mensajería, contrato/plan real, snapshot.

**Lee/escribe:** solo `usuarios/{uid}` — mezcla cuenta + perfil.

**Colecciones futuras:** `perfiles/{perfilId}`, `contratos_perfiles`, `notificaciones`, `estadisticas_perfil`

**Riesgos:** sin gates `estadoSeguridad`/`emailVerificado`; upgrade visitante bloqueado explícitamente en UI; `uid === perfilId` impide modelo Cuentas 1.0.0.

---

### 1.3 Dashboard Publicidad / Banners

| Aspecto | Detalle |
|---------|---------|
| **Estado** | Funnel existe; **dashboard anunciante no** |
| **Archivos** | `registro-banner.html`, `registro-banner2.html`, `registro-banner-paso3.html` (stub), `precios-publicidad.js`, `banner-inventario-rotacion.js`, lista en `index.html` panel |
| **Mock** | [`dashboard-rentero.html`](../public/dashboard-rentero.html) — UI completa, datos fake |

**Módulos actuales:** funnel 2 pasos, precios Firestore, upload Storage, create `solicitudes_anuncios`, revisión admin.

**Faltantes:** panel gestión campañas, edición post-pago con revisión, renovación, `contratos_banners`, pagos integrados, estadísticas impresiones/clics, activación slot real.

**Lee:** `configuracion_publicidad/precios_banners`, `solicitudes_anuncios` (owner)

**Escribe:** `solicitudes_anuncios`, Storage

**Riesgos:** `signInAnonymously` en paso 1 vs rules `isNonAnonymous` en create; paso 3 sin Firebase; colección `anuncios` sin UI anunciante.

---

### 1.4 Dashboard Usuario / Visitante

| Aspecto | Detalle |
|---------|---------|
| **Estado** | Parcial — modales en home |
| **Archivos** | `index.html`, `home-bridge.js`, `home-ui.js` |
| **Diseño** | `config-registro-visitante-schema.json` → `DashboardVisitante` |

**Módulos actuales:** login/registro email, panel mínimo, favoritos UI, mensajes **copy demo**, lista solicitudes publicidad.

**Faltantes:** `DashboardVisitante` completo, registro visitante FieldEngine, `WizardCrearPerfilDesdeVisitante`, contrato visitante, denuncias, categorías sugeridas, preferencias, bloqueos, notificaciones, seguridad cuenta, `estadoMensajeria`.

**Riesgos:** favoritos usa `signInAnonymously()` — **roto** vs rules; no distingue `tipoCuenta=visitante`; mensajes prometen funcionalidad inexistente.

---

## 2. Dashboards faltantes

| ID | Descripción | Prioridad diseño |
|----|-------------|------------------|
| D1 | **DashboardShell modular usuario** (visitante + perfil + banners) | Alta |
| D2 | **Módulo mensajes P2P** (no soporte admin) | Alta (post-Messenger spec) |
| D3 | **Panel anunciante post-solicitud** (gestión campañas) | Alta |
| D4 | **Admin catálogo/schemas** (8 módulos diseño) | Alta |
| D5 | **Dashboard seguridad cuenta** (usuario) | Media |
| D6 | **Módulo categorías sugeridas** (usuario + admin) | Media |

---

## 3–4. Seguridad actual vs requerida

### Dashboard Admin

| Tema | Actual | Requerido (Seguridad MVP + diseño) |
|------|--------|-------------------------------------|
| Login | Email/password | + Turnstile, eventual 2FA |
| Roles | Email único hardcoded | RBAC: super_admin, moderador, comercial, auditor |
| INE/selfies | Visible en detalle perfil | + `logs_acceso_privado` cada vista |
| Aprobar/rechazar | Con confirm | + `logsAdmin` campos completos, diffHash |
| Catálogo/precios | No en UI | Solo admin con permiso + auditoría |
| `estadoSeguridad` | No en UI | Moderación desde módulo seguridad |
| Reauth | No | Delete usuario, cambio precios, export |

### Dashboard Perfil Público

| Tema | Actual | Requerido |
|------|--------|-----------|
| Login | Sí | Sí |
| Edición | Rules `usuarioUpdateDuenoValido` | + FieldEngine gates, ValidationEngine |
| Enviar revisión | Implícito al editar | `emailVerificado` + `estadoSeguridad ∉ {restringido,suspendido,bloqueado}` |
| Fotos | Cliente type/size | + Storage rules, moderación |
| Mensajería | N/A | Según `estadoMensajeria` |

### Dashboard Banners

| Tema | Actual | Requerido |
|------|--------|-----------|
| Owner | `uidAnunciante` | + `anuncianteId`, email verificado |
| Post-pago edit | Admin update manual | Bloqueo owner + cola revisión admin |
| Contrato | No existe | `contratos_banners` |
| `estadoSeguridad` | No | Bloquea nuevos banners si restringido+ |

### Dashboard Visitante

| Tema | Actual | Requerido |
|------|--------|-----------|
| Favoritos | Anonymous roto | Cuenta real `visitante` |
| Denuncias | `create: false` | Create validado |
| Upgrade | Bloqueado en UI | `WizardCrearPerfilDesdeVisitante` + contrato vigente |
| Mensajes | Demo | `estadoMensajeria` + bloqueos |

---

## 5. Qué dashboard absorbe qué módulo

```
┌─────────────────────────────────────────────────────────────┐
│  ADMIN (aislado)                                            │
│  catálogo · revisión · seguridad · contratos · pagos admin   │
│  denuncias · categorías sugeridas · banners admin           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  DASHBOARD SHELL USUARIO (modular por roles)                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │ Cuenta  │ │ Perfil  │ │ Banners │ │Mensajes │ ...      │
│  │visitante│ │ público │ │anunciante│ │favoritos│          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
└─────────────────────────────────────────────────────────────┘
```

| Módulo | Absorbe |
|--------|---------|
| Admin | Todo lo operativo global |
| Shell cuenta | Visitante base, preferencias, seguridad, upgrade |
| Shell perfil | Wizard, verificación, renovación, stats |
| Shell banners | Solicitudes, contratos, creativos, renovación |
| Shell mensajes | P2P unificado (perfil + anunciante contextos) |

---

## 6. Arquitectura recomendada final

**Opción elegida: Híbrido (3)**

| Componente | Decisión |
|------------|----------|
| Admin | Página/app **separada** — nunca mismo bundle que usuarios |
| Usuario | **Un shell modular** — tabs/módulos según `tipoCuentaPrincipal` + `rolesCuenta[]` |
| Base UI | Evolucionar `dashboard-rentero.html` → shell real con Firebase |
| Router | `if (roles.includes('admin'))` → redirect `/admin`; else `/cuenta` |

**Evaluación por campos congelados:**

| Campo | Uso en shell |
|-------|--------------|
| `tipoCuentaPrincipal` | Módulo perfil visible si ≠ visitante |
| `rolesCuenta[]` | Módulo banners si `anunciante` |
| `perfilPrincipalId` | Default perfil en módulo perfil |
| `perfilIds[]` | Selector multi-perfil futuro |
| `anuncianteId` | Query solicitudes/anuncios |
| `contratoActivoId` | Gates renovación / upgrade |
| `estadoCuenta` | Banner global si suspendida |
| `estadoVerificacion` | Wizard verificación |
| `estadoMensajeria` | Módulo mensajes |
| `estadoSeguridad` | Gates FieldEngine en todos los módulos |

---

## 7. Integración por perfil/cuenta

### Perfil público — debe conectar

`usuarioId`, `perfilId`, `perfilPrincipalId`, `categoriaId`, `subcategoriaId`, `formularioId`, `arquetipo`, `tipoPerfil`, `estadoCuenta`, `estadoVerificacion`, `estadoPublicacion`, `estadoSeguridad`, `contratoActivoId`, `planActual`, `fechaVencimiento` + mensajes, favoritos recibidos, denuncias recibidas, estadísticas, notificaciones.

**Motores:** FieldEngine (wizard), ValidationEngine, RenderEngine (snapshot), Contratos, Messenger, Seguridad.

### Visitante — debe conectar

`usuarioId`, `tipoCuentaPrincipal`, `rolesCuenta[]`, `estadoCuenta`, `estadoMensajeria`, `estadoSeguridad` + favoritos, mensajes, bloqueos, denuncias realizadas, categorías sugeridas, notificaciones, preferencias, **upgrade sin nueva cuenta Auth**.

**Motores:** FieldEngine F08/F11, Contratos visitante, Messenger, Seguridad.

### Anunciante / banners

`usuarioId`, `anuncianteId` + `solicitudes_anuncios`, `contratos_banners`, `anuncios`, pagos, renovaciones, stats, notificaciones, revisión admin.

### Admin

`usuarioId`, `rolesCuenta[]`, permisos + logs, cola revisión, usuarios, perfiles, banners, contratos, pagos, denuncias, catálogo, seguridad.

---

## 8. Arquitectura mensajería ↔ dashboards

**Estado actual:** no implementada. Admin tiene solo `soporte_mensajes` (admin↔usuario). Home muestra texto demo engañoso.

**Modelo futuro (Seguridad MVP + Cuentas 1.0.0):**

```
conversaciones/{conversacionId}
  ├── emisorId, receptorId
  ├── perfilContextoId? 
  ├── anuncioContextoId?
  └── mensajes/{mensajeId}

usuarios/{id}/conversaciones_meta/{convId}
usuarios/{id}/bloqueos/{usuarioBloqueadoId}
usuarios.mensajeria.{estadoMensajeria, spamScore, reportesCount}
```

| Escenario | Comportamiento |
|-----------|----------------|
| Visitante → perfil público | Requiere cuenta + `estadoMensajeria=habilitada` + email verificado + sin bloqueo |
| Visitante → anunciante | `anuncioContextoId` en metadata |
| Perfil responde | Conversación existente; respeta `estadoMensajeria` receptor |
| Cuenta con perfil + banners | UI unifica en módulo Mensajes; contexto en metadata |
| Admin suspende | `estadoMensajeria=suspendida` → sin envío; banner en UI |

**Dashboards que muestran mensajes:** Shell usuario (principal), Admin (moderación/denuncias relacionadas, no bandeja P2P).

---

## 9–10. Riesgos

### Arquitectura

| ID | Nivel | Riesgo |
|----|-------|--------|
| A1 | Alto | Monolito `usuarios/{uid}` |
| A2 | Alto | Dashboards embebidos en `index.html` |
| A3 | Medio | Mock `dashboard-rentero` desconectado |
| A4 | Medio | Duplicación `index-legacy.html` |
| A5 | Medio | Sin router por roles |

### Seguridad

| ID | Nivel | Riesgo |
|----|-------|--------|
| S1 | Crítico | Admin = un email, sin RBAC |
| S2 | Alto | Favoritos anonymous vs rules |
| S3 | Alto | Denuncias create deshabilitado |
| S4 | Alto | Sin Turnstile / rate limits |
| S5 | Medio | INE sin `logs_acceso_privado` |
| S6 | Medio | Banner paso 1 anonymous |

---

## 11. Recomendaciones

1. **Congelar SPEC-DASHBOARDS** antes de implementar dashboards en runtime.
2. Mantener **admin separado**; refactor modular según `config-admin-arquitectura-completa-schema.json`.
3. **Unificar** visitante + perfil + banners en shell modular (base `dashboard-rentero.html`).
4. **Migrar** a `usuarios` hub + `perfiles/{perfilId}` antes del wizard FieldEngine.
5. Corregir favoritos: cuenta real, no anonymous.
6. Habilitar denuncias con ValidationEngine.
7. Marcar mensajes como "próximamente" hasta Messenger spec.
8. Implementar `logs_acceso_privado` antes de ampliar admin.

---

## 12. Orden de implementación futura

1. SPEC-DASHBOARDS + acta congelamiento  
2. ValidationEngine spec  
3. Auth shell + lectura `rolesCuenta[]`  
4. Migración modelo usuarios → perfiles  
5. Dashboard visitante (FieldEngine F08/F11)  
6. Dashboard perfil wizard (FieldEngine)  
7. Dashboard banners (contratos + pagos)  
8. Admin módulos catálogo/revisión  
9. Messenger + módulo mensajes  
10. RBAC admin fase 2  

---

## 13. Qué NO implementar todavía

- Runtime dashboards nuevos  
- Cambios `firestore.rules` en producción  
- Deploy  
- Messenger P2P  
- Pagos live (Stripe/MercadoPago)  
- RBAC multi-admin  
- Migración legacy sin acta dedicada  

---

## 14. ¿Generar SPEC y acta de congelamiento?

| Artefacto | Recomendación |
|-----------|---------------|
| `SPEC-DASHBOARDS.md` | **Sí** — incluir sección `asistentesIA` obligatoria |
| `SPEC-DASHBOARDS.json` | **Sí** — contrato máquina módulos, rutas, gates, colecciones |
| `ACTA-CONGELAMIENTO-DASHBOARDS.md` | **Sí** — después de cerrar SPEC |
| `ACTA-CONGELAMIENTO-DASHBOARDS.json` | **Sí** — paralelo a otras capas congeladas |

**Secuencia sugerida:** aprobar esta auditoría (incl. capa IA) → redactar SPEC-DASHBOARDS con `asistentesIA` → validar vs capas congeladas → congelar acta → ValidationEngine → runtime.

---

## 15. Capa asistentes IA (addendum)

**Decisión:** **Orquestador ligero + asistentes especializados** — no un asistente único global.

| Dashboard | Asistente | ID |
|-----------|-----------|-----|
| Usuario / Visitante | Asistente de cuenta | `ia_asistente_cuenta` |
| Perfil público | Asistente de perfil | `ia_asistente_perfil` |
| Publicidad / Banners | Asistente de publicidad | `ia_asistente_publicidad` |
| Admin | IA Arquitecto | `ia_arquitecto` |
| Admin | IA Moderador | `ia_moderador` |
| Admin | IA Comercial | `ia_comercial` |
| Admin | IA Seguridad | `ia_seguridad` |

**Reglas globales:** sin auto-aprobación; sin write sin confirmación; sin INE para usuarios; salida ejecutable solo vía `ia_recomendaciones`; IA Arquitecto solo lectura.

**¿Incluir en SPEC-DASHBOARDS antes de congelar?** **Sí — obligatorio.**

Detalle: [`AUDITORIA-DASHBOARDS-IA.md`](./AUDITORIA-DASHBOARDS-IA.md)

---

*Auditoría de diseño — no autoriza implementación, deploy, ni cambios en Firestore.*
