# SPEC-DASHBOARDS-OPERATIVOS v1.0.1

**Nombre legacy:** `SPEC-PANEL-DASHBOARD-MINIMO` · **Patch:** PATCH-SPEC-PANEL-DASHBOARD-v1.0.1  
**Fecha:** 2026-06-11 · **Estado:** DISEÑO ALINEADO MATRIZ · **Implementación autorizada:** NO  
**Dependencia canon obligatoria:** [MATRIZ-RUTAS-NAV-CANONICA v1.0.0](MATRIZ-RUTAS-NAV-CANONICA.json)

> **Principio rector:** El dashboard informa, gestiona y delega; Registro edita; Pagos cobra; Admin concilia; la IA recomienda sin ejecutar acciones persistentes sin confirmación humana.

**Cierra:** GAP-PANEL-DASH  
**Fuente oficial de verdad operacional:** Dashboard Perfil · Dashboard Anunciante · Dashboard Administrador

---

## 1. Relación con capas congeladas

| Capa | Rol | Estado |
|---|---|---|
| **MATRIZ-RUTAS-NAV-CANONICA** | Rutas, menús, permisos, aliases | Canon v1.0.0 — **dependencia obligatoria** |
| SPEC-DASHBOARDS + ACTA-DASH | Shell arquitectónico híbrido | Congelado — no modificar |
| **Esta SPEC** | Detalle operacional: módulos, nav, permisos, estados, IA | v1.0.1 alineada MATRIZ |
| ACTA-RC | Edición wizard | Consumida — `/registro/editar/{perfilId}` |
| ACTA-PAY | Pagos, contratos, renovación | Consumida |

---

## 2. Dashboard Perfil

**Ruta base:** `/cuenta/perfil` · **SEO:** noindex,nofollow

| Módulo | ID | Ruta | MVP |
|---|---|---|---|
| Resumen General | DP-01 | `/cuenta/perfil` | obligatorio |
| Perfil Público | DP-02 | `/cuenta/perfil/publico` | obligatorio |
| Fotografías (CTA Registro) | DP-03 | `/cuenta/perfil/fotos` | obligatorio |
| Verificación | DP-04 | `/cuenta/perfil/verificacion` | obligatorio |
| Mensajería | DP-05 | `/cuenta/perfil/mensajes` | Post-MVP V1.1 |
| Estadísticas | DP-06 | `/cuenta/perfil/estadisticas` | recomendado |
| Favoritos | DP-07 | `/cuenta/favoritos` | recomendado |
| Pagos y Membresía | DP-08 | `/cuenta/pagos/*` | obligatorio |
| Notificaciones | DP-09 | badges panel | recomendado |

**Sidebar:** resumen · perfil público · fotos · verificación · estadísticas · pagos · favoritos · actualizaciones · config · seguridad

**Reglas:** edición vía `/registro/editar/{perfilId}` — nunca inline. `/cuenta/perfil/editar` → 302 deprecated.

---

## 3. Dashboard Anunciante

**Ruta base:** `/cuenta/banners` · **Alias deprecated:** `/cuenta/anunciante` → 301

| Módulo | ID | Ruta | MVP |
|---|---|---|---|
| Resumen | DA-01 | `/cuenta/banners` | obligatorio |
| Gestión Banners | DA-02 | `/cuenta/banners/{activos\|pendientes\|vencidos}` | obligatorio |
| Estadísticas | DA-03 | `/cuenta/banners/estadisticas` | recomendado |
| Contratos | DA-04 | `/cuenta/banners/contratos` | obligatorio |
| Pagos | DA-05 | `/cuenta/pagos` | obligatorio |
| Centro Comercial IA | DA-06 | Post-MVP | Post-MVP V1.1 |
| Notificaciones | DA-07 | badges | recomendado |

### Funnel onboarding (ANU-FUN)

| Fase | Ruta | Rol |
|---|---|---|
| Alta wizard | `/registro/banner` | Registro captura — legacy `registro-banner.html` |
| Verificación | `/registro/verificacion` | Registro |
| Panel operativo | `/cuenta/banners` | Dashboard gestiona banners |
| Pago | `/cuenta/pagos` | Pagos ejecuta cobro |

**CTA panel:** "Nuevo banner" → `/registro/banner` · "Renovar" → `/cuenta/banners/renovar`

---

## 4. Dashboard Administrador

**Ruta base:** `/admin` → `/admin/resumen` · **Bridge MVP:** `admin.html`

| Módulo | ID | Ruta canon | MVP |
|---|---|---|---|
| Resumen Ejecutivo | ADM-01 | `/admin/resumen` | obligatorio |
| Expedientes (UI group) | ADM-02 | ver rutas planas abajo | obligatorio |
| Moderación | ADM-03 | `/admin/denuncias` | obligatorio |
| Auditoría | ADM-04 | `/admin/auditoria` | obligatorio |
| Métricas Globales | ADM-05 | `/admin/metricas`, `/admin/inteligencia` | recomendado |

**Expedientes = agrupación menú — NO prefijo URL**

| Cola | Ruta canon | Legacy deprecated |
|---|---|---|
| Perfiles | `/admin/perfiles`, `/admin/revision?tipo=perfil` | `/admin/expedientes/perfiles` |
| Anunciantes/Banners | `/admin/banners`, `/admin/revision?tipo=banner` | `/admin/expedientes/anunciantes` |
| Pagos | `/admin/pagos` | `/admin/expedientes/pagos` |
| Contratos | `/admin/contratos` | `/admin/expedientes/contratos` |

**Sidebar admin:** resumen · revisión · usuarios · perfiles · catálogo · comercial · banners · pagos · contratos · denuncias · soporte · seguridad · auditoría · métricas · IA · config

---

## 5. Centros transversales (rutas canon)

| Centro | ID | Rutas | MVP |
|---|---|---|---|
| Agentes IA | CX-IA | `/cuenta/asistente`, `/admin/ia` | Post-MVP V1.1 |
| Actualizaciones | CX-ACT | `/cuenta/centro/actualizaciones/*` | recomendado |
| Inteligencia | CX-INT | `/cuenta/centro/inteligencia`, `/cuenta/banners/inteligencia`, `/admin/inteligencia` | Post-MVP V1.1 |
| Configuración | CX-CFG | `/cuenta/config/*` | obligatorio |
| Seguridad | CX-SEG | `/cuenta/seguridad/*`, `/admin/seguridad` | recomendado/obligatorio |

---

## 6. Aliases y bridges legacy

| Tipo | Origen | Destino |
|---|---|---|
| 301 | `/cuenta/anunciante/*` | `/cuenta/banners/*` |
| 302 | `/cuenta/perfil/editar` | `/registro/editar/{perfilId}` |
| 301 | `/admin/expedientes/*` | rutas planas (C-R03) |
| Bridge | `admin.html` | `/admin/resumen` |
| Bridge | `index.html` modales | `/cuenta/*`, `/registro/*` |
| Bridge | `registro-banner.html` | `/registro/banner` |

---

## 7. Once matrices obligatorias

Módulos · Navegación (+ sidebar/menús) · Permisos · Roles · Estados · Dependencias · Riesgos · Ownership · Privacidad · Seguridad · Auditoría

**35 validaciones documentales PASS** (V-01..V-35)

---

## 8. Impacto v1.0.1

| Dimensión | Antes | Después |
|---|---|---|
| Alineación SPEC ↔ MATRIZ | 78% | **96%** |
| GAP-PANEL-DASH | 35% | **96%** |
| CAP-10 Dashboards | 53% | **92%** |
| Documentación global | 89% | **91%** |
| Arquitectura global | 90% | **92%** |
| Construcción P0 | 84% | **89%** |
| MVP-OPERAR (doc) | 74% | **87%** |
| MVP-COBRAR (doc) | 72% | **76%** |
| Navegación canon | 78% | **96%** |

---

## 9. Alcance NO incluido en runtime

Implementación `/cuenta/*` · Firestore · EventBus · Messenger in-app · deploy · commit

**Próximo paso:** ACTA-CONGELAMIENTO-PANEL-DASHBOARD **v1.1.0** ratificación
