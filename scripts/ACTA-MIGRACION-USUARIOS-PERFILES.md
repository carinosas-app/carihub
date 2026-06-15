# Acta formal de diseño de migración — usuarios → hub + perfiles

| Campo | Valor |
|-------|-------|
| **Versión** | **1.0.0** |
| **Fecha** | 2026-06-09 |
| **Estado** | **APROBADA_DISENO** |
| **Clasificación** | Acta de migración — **solo diseño** |
| **Runtime / Firestore / producción** | **NO autorizado** |

Canónico: [`ACTA-MIGRACION-USUARIOS-PERFILES.json`](./ACTA-MIGRACION-USUARIOS-PERFILES.json)

Workshop previo: [`WORKSHOP-MIGRACION-USUARIOS-PERFILES-ANALISIS.json`](./WORKSHOP-MIGRACION-USUARIOS-PERFILES-ANALISIS.json)

---

## Autorización

Acta formal de **diseño de migración** autorizada por product owner. Formaliza modelo objetivo, bridge transitorio y dependencias arquitectónicas identificadas en el workshop.

**No autoriza:** ejecución migración · scripts ETL · cambios Firestore · producción · deploy · modificación de las 7 capas congeladas.

---

## Objetivos

1. Formalizar destino post-migración: hub `usuarios/{usuarioId}` + `perfiles/{perfilId}`.
2. Documentar bridge **BRIDGE-MIG-01**: `perfilId = usuarioId` para legacy.
3. Enumerar colecciones, FK e impacto por capa.
4. Definir criterios de éxito diseño y precondiciones pre-runtime.
5. Cerrar riesgos de diseño (R-PROD-01, R-MIG-01, AM-VE2).
6. Marcar operación pendiente como **TBD_PRE_RUNTIME**.

---

## Alcance

### En alcance

- Modelo post-migración y fases transitorias de diseño
- Bridge y salida del bridge
- Colecciones afectadas
- Impacto por capa (lectura)
- Criterios de éxito y vacíos

### Fuera de alcance

- Scripts migración · ventana mantenimiento · rollback ejecutado
- Modificación `firestore.rules` · inventario volumétrico · mapeo campo a campo exhaustivo · fechas cutover

---

## Modelo actual (producción LEGACY)

| Aspecto | Estado |
|---------|--------|
| **Colección** | `usuarios/{uid}` monolito |
| **Auth** | `uid` = document id |
| **Público** | `aprobado && activo && !vencido` (`firestore.rules`) |
| **`perfiles/`** | No en rules — denegado catch-all |
| **Favoritos** | `usuarios/{id}/favoritos/{perfilId}` activo |
| **Banners** | `solicitudes_anuncios` · `uidAnunciante` |
| **Messenger** | No implementado |

**Gap:** monolito vs diseño hub + perfiles congelado en Cuentas 1.0.0.

---

## Modelo objetivo (congelado — sin modificar acta Cuentas)

| Entidad | Ruta | Rol |
|---------|------|-----|
| **Hub** | `usuarios/{usuarioId}` | Identidad, estados, punteros, subcolecciones |
| **Perfil** | `perfiles/{perfilId}` | Registro, publicación, borradores, historial |

Fuente: [`ACTA-CONGELAMIENTO-CUENTAS.json`](./ACTA-CONGELAMIENTO-CUENTAS.json) · [`config-cuentas-usuario-schema.json`](./config-cuentas-usuario-schema.json).

**Equivalencia visibilidad pública:** legacy `aprobado/activo/vencido` → objetivo `estadoRevision` + `tienePerfilPublico` + hub — detalle **TBD_PRE_RUNTIME** (VAC-06).

---

## Bridge transitorio — BRIDGE-MIG-01

**Regla:** `perfilId = usuarioId` para cuentas migradas desde monolito (fase 1).

Cierra recomendación **AM-VE2** sin modificar ValidationEngine 1.0.0.

| Implicación | Efecto |
|-------------|--------|
| Favoritos | Refs coherentes con `perfiles/{uid}` |
| URLs | `perfilId=uid` sin cambio |
| Storage VE | `perfiles/{perfilId}/...` |
| Messenger | `perfilContextoId` resuelve |
| FieldEngine | Wizard en `perfiles/{perfilId}` |

**Salida bridge:** multi-perfil · UUID · `perfilIds[]` · 301 SEO — fecha **TBD_PRE_RUNTIME**.

### Fases transitorias (diseño)

| Fase | Nombre | Ejecución |
|------|--------|-----------|
| 1 | Extracción → `perfiles/{uid}` | TBD_PRE_RUNTIME |
| 2 | Punteros hub | TBD_PRE_RUNTIME |
| 3 | Lectura dual | TBD_PRE_RUNTIME |
| 4 | Deprecar campos monolito | TBD_PRE_RUNTIME |
| 5 | Multi-perfil UUID | TBD_PRE_RUNTIME |

---

## Colecciones afectadas

| Colección | Acción | Prioridad |
|-----------|--------|-----------|
| `usuarios` | Refactor hub | Crítica |
| `perfiles` | Crear | Crítica |
| `favoritos` | Validar refs | Alta |
| `notificaciones`, `bloqueos`, `conversaciones_meta` | Crear | Alta |
| `contratos_*` | Crear | Alta/Media |
| `solicitudes_anuncios`, `pagos`, `denuncias` | Normalizar FK | Media |

Todas las acciones de ejecución: **TBD_PRE_RUNTIME**.

---

## Impacto por capa

| Capa | Migración diseño |
|------|------------------|
| **Contratos** | Crear colecciones al runtime contratos |
| **Banners** | `uidAnunciante` → `usuarioId` |
| **Favoritos** | Requiere `perfiles` + bridge |
| **Notificaciones** | Subcolección hub; cutover UI |
| **Messenger** | Bloqueado sin perfiles — SPEC 1.0.0 |
| **Dashboards** | Shell hub modular |
| **ValidationEngine** | AM-VE2 satisfecho por referencia |
| **Interacciones** | Perfiles publicadores — no bloquea SPEC |
| **RenderEngine** | Lectura `perfiles` + snapshot |
| **ThemeEngine** | DEP-TE-02 diseño satisfecho |
| **SEO** | Bridge URLs; 301 post-bridge |

---

## Dependencias

**Congeladas requeridas:** Cuentas · Catálogo · FieldEngine · Seguridad.

**Impactadas sin modificar:** Dashboards · ValidationEngine · Messenger.

**Paralelos (no bloquean acta):** VE MINOR 1.1.0 · Dashboards 1.1.0 · SPEC RenderEngine.

**Bloquea runtime de:** Messenger, VE, Dashboards unificado, FieldEngine prod., RenderEngine, contratos, ThemeEngine, SEO perfiles.

---

## Criterios de éxito

### Diseño (esta acta)

- Acta v1.0.0 aprobada
- Bridge formalizado
- Colecciones y FK documentadas
- Vacíos TBD explícitos

### Pre-runtime (ejecución no autorizada)

- `perfiles` poblados · hub sin duplicados críticos · favoritos válidos · Storage · rules · inventario — **TBD_PRE_RUNTIME**

### Post-runtime

- URLs estables · VE owner PASS · Messenger contexto · notificaciones hub — **TBD_PRE_RUNTIME**

---

## Riesgos eliminados (diseño)

| ID | Estado |
|----|--------|
| R-PROD-01 | Mitigado diseño |
| R-MIG-01 | Cerrado diseño |
| R-MSG-01 | Mitigado diseño |
| RI-VE-owner / AM-VE2 | Mitigado diseño |
| DO1 | Mitigado diseño |
| DEP-TE-02 | Satisfecho diseño |
| R-SEO-urls | Mitigado diseño |

---

## Riesgos remanentes

Ejecución ETL · lectura dual · Storage · rules · UI legacy · notificaciones duales · multi-perfil · VE MINOR · índices Messenger · **producción sigue monolito**.

---

## Vacíos — TBD_PRE_RUNTIME

| ID | Tema |
|----|------|
| VAC-01 | Inventario producción |
| VAC-02 | Mapeo campo a campo |
| VAC-03 | Storage paths |
| VAC-04 | Cutover / rollback |
| VAC-05 | Lectura dual código |
| VAC-06 | isPublicProfile |
| VAC-07 | Visitantes sin perfil |
| VAC-08 | soporte_mensajes vs Messenger |

---

## Artefactos

| Artefacto | Ruta |
|-----------|------|
| Acta JSON | [`ACTA-MIGRACION-USUARIOS-PERFILES.json`](./ACTA-MIGRACION-USUARIOS-PERFILES.json) |
| Auditoría | [`AUDITORIA-ACTA-MIGRACION-USUARIOS-PERFILES.json`](./AUDITORIA-ACTA-MIGRACION-USUARIOS-PERFILES.json) |
| Workshop | [`WORKSHOP-MIGRACION-USUARIOS-PERFILES-ANALISIS.json`](./WORKSHOP-MIGRACION-USUARIOS-PERFILES-ANALISIS.json) |

---

*Acta de diseño de migración — no autoriza ejecución ni cambios en producción.*
