# PLAN-MAESTRO-ADMIN v1.0.0

**Fecha:** 2026-06-10 · **Estado:** PLAN DE DISEÑO DOCUMENTAL
**Modo:** Solo análisis y documentación. No runtime · no carpetas · no mover archivos · no Firestore · no deploy · no commit · no modifica capas existentes.

> **Principio rector:** Admin **DECIDE**; los motores **EJECUTAN**; la IA solo **LEE y RECOMIENDA**. Admin es una superficie privada aislada (`/admin`) con RBAC por **rol + ámbito**, auditoría obligatoria y doble confirmación en acciones críticas. **No** hace onboarding (eso es Cuenta), **no** es la gestión diaria del usuario (eso es Dashboards).

Construido sobre `config-admin-arquitectura-completa-schema.json` (8 módulos + RBAC fase1/fase2), al que **referencia y extiende sin modificar**.

---

## 1. Inventario actual relacionado con Admin

| Elemento | Estado actual | Evidencia |
|---|---|---|
| Archivo | `public/admin.html` monolítico | — |
| RBAC | **Email único** `ADMIN_EMAIL = carinosas.anuncios@gmail.com` + `firestore.rules isAdmin()` | admin.html:31, 978 |
| Tope | `LIMITE_USUARIOS = 150` (no escalable) | admin.html:32, 1018 |
| Colecciones operadas | `usuarios` (update/delete directos), `denuncias`, `solicitudes_anuncios`, `soporte_mensajes`, `logsAdmin` | admin.html varios |
| Auditoría | `logsAdmin` con `adminEmail`; **sin** trail granular (antes/después) ni log de acceso a privados | — |
| Schema de diseño | `config-admin-arquitectura-completa-schema.json` → 8 módulos | catalogo, schemas, comercial, render, búsqueda, revisión, seguridad, IA |

**Gaps:** RBAC granular · ámbitos geo/categoría · roles soporte/operador · doble confirmación · auditoría completa · 2FA · rules para colecciones de diseño.

---

## 2. Frontera definitiva

- **Admin** → moderación global, aprobaciones, RBAC, catálogo/schemas, precios, seguridad/auditoría, control transversal.
- **Dashboards** → gestión diaria de lo propio (no modera ni aprueba). **Operador = Admin con scope reducido**.
- **Cuenta** → onboarding/credenciales/verificación (produce solicitudes que Admin revisa).
- **Messenger** → P2P de usuarios; Admin controla políticas/suspensión; lee contenido **solo** por soporte/denuncia con auditoría.
- **Banners** → inventario/creativos; Admin aprueba/activa/pausa.
- **Pagos** → cobro; Admin confirma/vincula contrato, **no** procesa tarjeta.

---

## 3. Objetivos · Responsabilidades · Límites

- **Objetivos:** calidad/seguridad de catálogo, perfiles, banners y pagos; moderación y resolución de denuncias/soporte; control de RBAC y auditoría; supervisión de automatizaciones e IA.
- **Responsabilidades:** aprobar/rechazar/suspender/restaurar; gestionar catálogo/schemas/precios; auditar accesos a datos privados; definir políticas y flags.
- **Límites:** IA nunca auto-ejecuta; acciones críticas con doble confirmación + auditoría; Operador acotado por ámbito; no procesa pagos ni renderiza público.

---

## 4. Pantallas y rutas sugeridas

`/admin` (aislado, privado, noindex) · `/operador` (scope acotado).

`resumen · revision · usuarios · perfiles · catalogo · schemas · comercial · banners · pagos · denuncias · soporte · seguridad · auditoria · busqueda · ia · config`

---

## 5. Roles Admin

| Rol | Descripción | Ámbito default |
|---|---|---|
| **super_admin** | Control total; único que gestiona RBAC y rules | global |
| **admin** | Operación amplia salvo RBAC/rules críticos y borrados masivos | global/asignado |
| **moderador** | Revisión perfiles/negocios/anunciantes/categorías/denuncias | asignado |
| **soporte** | Atención `soporte_mensajes`; guía a usuarios; sin moderación de catálogo | asignado |
| **auditor** | Solo lectura total + logs + export; sin escritura | global lectura |
| **operador** | Permisos delegados granulares por ámbito (modera/soporta acotado) | estricto asignado |
| **comercial_admin** | Precios/promociones/contratos/renovaciones *(schema existente)* | global |
| **catalogo_admin** | Catálogo/búsqueda/asignación render *(schema existente)* | global |
| **ia_bot** | IA Arquitecto/Moderador/Comercial/Seguridad — solo lectura/recomendación | — (sin write) |

### Ámbitos (scopes)
`admins/{uid}.scopes[] = { tipo, valores[] }`. Tipos: `global, pais, estado, ciudad, sector, categoria, subcategoria, usuario, perfil`. **Sin scope coincidente → denegado + log.** `super_admin = global` implícito.

---

## 6. Matrices

### 6.1 Rol → permisos (resumen)

| Rol | Permisos clave |
|---|---|
| super_admin | todo · rbac · rules · borrado · rollback · config |
| admin | revisión · usuarios (no borrado masivo) · perfiles · comercial (sin rollback) · banners · pago_confirmar · denuncias · soporte |
| moderador | revisión perfiles/categorías · denuncias · suspender (ámbito) · ver privados con auditoría |
| soporte | soporte_mensajes · lectura usuario (ámbito) · crear ticket · escalar |
| auditor | lectura total · logs · export · IA (lectura) |
| operador | subconjunto moderador/soporte por scope estricto · editar ítems asignados |
| comercial_admin | precios · promociones · contratos · renovaciones · pago_confirmar |
| catalogo_admin | catálogo · búsqueda · asignar render · schemas (lectura) |
| ia_bot | lectura · generar informe (recomendación) |

### 6.2 Ámbito → alcance
global = todo · país/estado/ciudad = subconjunto geo · sector/categoría/subcategoría = ítems del sector · usuario = un usuario y sus perfiles/contratos · perfil = un perfil específico.

### 6.3 Admin → módulos controlados

| Módulo | Roles con control |
|---|---|
| Usuarios/Cuentas | super_admin, admin, moderador (lect.), soporte (lect. ámbito), auditor |
| Perfiles | super_admin, admin, moderador, operador (scope) |
| Catálogo/Schemas | super_admin, catalogo_admin |
| Comercial/Pagos/Contratos | super_admin, comercial_admin, admin (confirmar) |
| Banners | super_admin, admin, comercial_admin, moderador (revisión) |
| Denuncias/Soporte | super_admin, admin, moderador, soporte, operador (scope) |
| Messenger (control) | super_admin, admin, moderador (políticas/suspensión), soporte (con auditoría) |
| Automatizaciones/IA | super_admin, admin (supervisa), ia_bot (lectura) |
| SEO | super_admin, catalogo_admin (meta/landings) |
| ThemeEngine | super_admin, admin (plantillas autorizadas) |
| Seguridad/RBAC/Auditoría | super_admin, auditor (lectura) |

### 6.4 Acciones → revisión / aprobación / suspensión

- **Revisión:** perfil/negocio/anunciante/banner enviados · documentos INE/selfie · categoría sugerida.
- **Aprobación:** aprobar perfil/negocio · activar banner · aprobar categoría · confirmar pago · publicar.
- **Rechazo:** rechazar (motivo obligatorio) · corrección solicitada.
- **Suspensión:** suspender perfil/cuenta · pausar banner · suspender mensajería.
- **Restauración:** restaurar perfil/cuenta/banner · habilitar mensajería.

### 6.5 Acciones → doble confirmación / auditoría obligatoria / aprobación superior

| Control | Acciones |
|---|---|
| **Doble confirmación** | suspender/eliminar usuario · eliminar perfil · fusionar categoría · rollback catálogo/precios · cambios masivos · deploy rules · migración render masiva |
| **Auditoría obligatoria** | acceso INE/selfie/privados · cambio de rol/RBAC · cambio de precio · aprobación/rechazo/suspensión · lectura de conversación por soporte/denuncia · export de datos |
| **Aprobación superior** | cambio de RBAC (solo super_admin) · rollback de precios · eliminación de datos · migración masiva · cambio de rules · override de scope de operador |

---

## 7. Módulos internos

AdminRouter (RBAC+scope) · ColaRevisionUnificada (máquina de estados) · RBACEngine (`admins/{uid}` + custom claims + scopes[]) · AuditTrail (`logsAdmin` append-only) · PrivacyAccessGuard (acceso a privados con log) · DoubleConfirmGuard · IAOrchestrator-admin (solo recomendación) · NotificacionesAdmin · ConfigSistema (feature flags, mantenimiento).

---

## 8. Estados, colas y flujos

- **Perfil:** borrador → enviado_revision → aprobado/rechazado → actualizacion_pendiente → publicado → suspendido/vencido → restaurado.
- **Cuenta:** activa/suspendida/restringida/bloqueada/eliminada.
- **Banner:** solicitud → en_revision → aprobado → activo → pausado/rechazado/vencido.
- **Categoría:** borrador/en_revision/aprobada/activa/fusionada/alias/rechazada/suspendida.
- **Colas:** perfiles · categorías sugeridas · banners · correcciones · post-pago · denuncias · soporte.
- **Flujos:** aprobación (revisar→aprobar→snapshot/publicar→notificar→log) · rechazo (motivo obligatorio) · suspensión (doble confirmación→suspender→alerta) · restauración (aprobación superior si aplica).

---

## 9. Relaciones con otros módulos

Dashboards (Operador = Admin con scope) · Registro/Cuenta (produce solicitudes) · Messenger (políticas/suspensión; lectura auditada) · Banners (aprueba/activa) · Pagos (confirma/vincula) · Interacciones (modera abusos) · ThemeEngine (autoriza plantillas) · SEO (políticas indexación) · Agentes IA (supervisa; IA sin write) · Seguridad MVP (gates/reputación) · ValidationEngine (valida transiciones).

---

## 10. Riesgos

| ID | Nivel | Riesgo | Mitigación |
|---|---|---|---|
| ADM-R01 | crítico | RBAC por email único (SPOF) | RBAC fase2: `admins/{uid}` + custom claims + scopes[] |
| ADM-R02 | alto | Acceso a INE/selfie sin trail | PrivacyAccessGuard + `logs_acceso_privado` |
| ADM-R03 | alto | Acciones destructivas sin doble confirmación | DoubleConfirmGuard + aprobación superior |
| ADM-R04 | alto | Operador sin límites = sobre-permisos | scopes[] estrictos + denegación por defecto |
| ADM-R05 | medio | `LIMITE_USUARIOS=150` y queries no escalables | paginación server-side + índices |
| ADM-R06 | medio | Doble modelo usuarios vs perfiles | unificar estadoRevision + migración |
| ADM-R07 | medio | IA con write accidental | rules deny-all-write a ia_bot |
| ADM-R08 | medio | rules no cubren colecciones de diseño | rules por colección antes de runtime |
| ADM-R09 | bajo | Soporte leyendo mensajería (privacidad) | solo con ticket/denuncia + auditoría |

---

## 11. Dependencias

- **Congeladas:** Dashboards 1.0.0 · Shared/Core 1.0.0 · RenderEngine 1.0.0 · ValidationEngine 1.1.0 · FieldEngine 1.0.1 · Messenger 1.0.0 · Cuentas/Catálogo/Seguridad.
- **Schema base de diseño:** `config-admin-arquitectura-completa-schema.json` (no congelado; extendible).
- **Precondiciones:** RBAC custom claims + `admins/{uid}` · migración usuarios→perfiles · rules para colecciones de diseño · bus de eventos/notificaciones.

---

## 12. Estructura ideal futura (lógica; sin crear carpetas)

`/admin` aislado → router por rol+scope → 8+ módulos del schema de arquitectura.
`/operador` → Admin con scope reducido.
Transversales: RBACEngine · AuditTrail · PrivacyAccessGuard · DoubleConfirmGuard · NotificacionesAdmin · IAOrchestrator-admin.
Consume de: Shared/Core · clientes VE/FieldEngine/RenderEngine · Seguridad MVP.

---

## 13. Orden recomendado de implementación

1. **P0** — RBAC fase2 (`admins/{uid}` + custom claims + scopes[]) y rules base → cierra ADM-R01.
2. **P0** — Revisión/Moderación unificada + AuditTrail + PrivacyAccessGuard (crítico de lanzamiento).
3. **P1** — Roles soporte/moderador/operador con scopes; DoubleConfirmGuard.
4. **P1** — Usuarios/Perfiles con paginación server-side (quitar `LIMITE_USUARIOS`) → cierra ADM-R05.
5. **P1/P2** — Catálogo/Schemas/Comercial (depende de catálogo congelado + motores).
6. **P2** — Control Messenger/SEO/ThemeEngine/Banners/Pagos + Configuración del Sistema.
7. **P2** — IA Arquitecto/Moderador/Comercial/Seguridad (solo recomendación).

---

## 14. Procedencia

**Sí procede** `PLAN-MAESTRO-ADMIN.md/json` — entregados. Admin es la superficie de control más sensible y requiere plan propio que formalice RBAC granular, ámbitos, auditoría y fronteras sobre el schema de arquitectura existente.

**Siguientes pasos sugeridos:** `PLAN-MAESTRO-PAGOS-CONTRATOS` · `PLAN-MAESTRO-BANNERS` · `PROPUESTA-ACTA-MINOR-DASHBOARDS` (Operador/Empresa) · anexo operacional de migración.

> No modifica capas congeladas ni `config-admin-arquitectura-completa-schema.json` (solo lo referencia/extiende). Sin cambios en producción/Firestore/deploy/commit.
