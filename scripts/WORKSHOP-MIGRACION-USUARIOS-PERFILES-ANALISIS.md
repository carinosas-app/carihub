# Workshop documental — ACTA-MIGRACION-USUARIOS-PERFILES v1.0.0

| Campo | Valor |
|-------|-------|
| **Estado** | Acta redactada — [`ACTA-MIGRACION-USUARIOS-PERFILES v1.0.0`](./ACTA-MIGRACION-USUARIOS-PERFILES.json) |
| **Fecha** | 2026-06-09 |
| **Runtime / Firestore / producción** | **NO** |

Canónico: [`WORKSHOP-MIGRACION-USUARIOS-PERFILES-ANALISIS.json`](./WORKSHOP-MIGRACION-USUARIOS-PERFILES-ANALISIS.json)

---

## Veredicto

| Pregunta | Respuesta |
|----------|-----------|
| ¿Información suficiente para redactar acta formal? | **Sí — con anexos TBD pre-runtime** |
| ¿Procede redactar acta? | **Sí** (diseño; no autoriza ejecución) |
| ¿Acta final creada? | **No** (por instrucción explícita) |

**Confianza:** alta en diseño (Cuentas 1.0.0 congelado) · baja en detalle operacional producción (inventario volumétrico pendiente).

---

## Estado actual — `usuarios/{uid}`

| Aspecto | Producción hoy |
|---------|----------------|
| **Modelo** | Monolito cuenta + perfil + verificación + comercial |
| **Auth** | `uid` = document id |
| **Visibilidad pública** | `aprobado`, `activo`, `!vencido` en rules |
| **`perfiles/`** | No existe en rules (denegado catch-all) |
| **Favoritos** | Subcolección `usuarios/{id}/favoritos/{perfilId}` — activa |
| **Banners** | `solicitudes_anuncios` con `uidAnunciante` |
| **Contratos diseño** | `contratos_perfiles` — no en producción |
| **Messenger** | No implementado |
| **Notificaciones spec** | Modales legacy; sin subcolección hub |

---

## Modelo objetivo (congelado)

| Entidad | Ruta | Rol |
|---------|------|-----|
| **Hub** | `usuarios/{usuarioId}` | Identidad, estados, punteros, subcolecciones |
| **Perfil** | `perfiles/{perfilId}` | Datos públicos, borradores, historial, snapshot |

Fuentes: [`ACTA-CONGELAMIENTO-CUENTAS.json`](./ACTA-CONGELAMIENTO-CUENTAS.json), [`config-cuentas-usuario-schema.json`](./config-cuentas-usuario-schema.json).

---

## Bridge transitorio `perfilId = usuarioId`

| Uso | Efecto |
|-----|--------|
| Migración fase 1 | `perfiles/{uid}` extraído del monolito |
| Favoritos | Refs existentes coherentes |
| URLs | Compatibilidad `perfilId=uid` |
| Storage VE | Paths `perfiles/{perfilId}/...` operativos |
| Salida bridge | Multi-perfil → UUID + `perfilIds[]` + 301 |

**Estrategia transitoria propuesta:** extracción → punteros hub → lectura dual (TBD) → deprecar campos duplicados en hub → multi-perfil.

---

## Alcance migración

**En alcance acta diseño:** modelo post-migración, bridge, mapeo FK, impacto capas, criterios éxito, riesgos.

**Fuera de alcance:** scripts ETL, ventana mantenimiento, cambios rules, inventario volumétrico.

### Colecciones afectadas (resumen)

| Colección | Acción | Prioridad |
|-----------|--------|-----------|
| `usuarios` | Refactor hub | Crítica |
| `perfiles` | Crear | Crítica |
| `favoritos` | Validar refs | Alta |
| `notificaciones` (sub) | Crear | Alta pre-Dashboards |
| `bloqueos`, `conversaciones_meta` | Crear | Alta pre-Messenger |
| `contratos_*` | Crear | Alta pre-contratos |
| `solicitudes_anuncios` | Normalizar FK | Media |
| `pagos`, `denuncias` | Vincular FK | Media |

---

## Impacto por capa

| Capa | Impacto migración |
|------|-------------------|
| **Contratos** | Crear colecciones diseño; visitante upgrade |
| **Banners** | `uidAnunciante` → `usuarioId` |
| **Favoritos** | Requiere `perfiles` existentes |
| **Notificaciones** | Nueva subcolección; cutover UI |
| **Messenger** | `perfilContextoId`, `conversaciones_meta` — bloqueado sin perfiles |
| **Dashboards** | Shell asume hub modular |
| **ValidationEngine** | Storage/owner — acta migración referencia AM-VE2 |
| **Interacciones** | Perfiles publicadores — no bloquea SPEC documental |
| **RenderEngine** | Lectura `perfiles` + snapshot |
| **ThemeEngine** | Temas por `perfilId` |
| **SEO** | URLs canónicas; 301 post-bridge |

---

## Criterios de éxito

**Diseño:** acta aprobada · mapeo documentado · bridge formalizado · FK satisfechas.

**Pre-runtime:** `perfiles` poblados · hub sin duplicados críticos · favoritos válidos · `isPublicProfile` equivalente · Storage paths OK.

**Post-runtime:** URLs estables · VE owner PASS · Messenger contexto perfil · notificaciones hub.

---

## Riesgos que elimina

R-PROD-01 · R-MIG-01 · R-MSG-01 · owner checks VE · favoritos DO1 · ThemeEngine perfiles · SEO URLs (con bridge).

---

## Riesgos que permanecen

Ejecución ETL · lectura dual · Storage · reescritura rules · UI legacy · notificaciones duales · multi-perfil · VE MINOR pendiente · índices Messenger.

---

## Vacíos detectados (8)

| ID | Vacío | Bloquea acta diseño | Bloquea runtime |
|----|-------|---------------------|-----------------|
| VAC-01 | Inventario volumétrico producción | No | Sí (operacional) |
| VAC-02 | Mapeo campo a campo exhaustivo | No | Sí |
| VAC-03 | Storage paths actuales | No | Sí |
| VAC-04 | Estrategia cutover / rollback | No | Sí |
| VAC-05 | Lectura dual código | No | Sí |
| VAC-06 | Equivalencia `isPublicProfile` | No | Parcial |
| VAC-07 | Visitantes/anunciantes sin perfil | No | Parcial |
| VAC-08 | `soporte_mensajes` vs Messenger | No | Sí |

---

## Dependencias

**Congeladas requeridas:** Cuentas · Catálogo · FieldEngine · Seguridad.

**Paralelas (no bloquean acta):** VE MINOR 1.1.0 · Dashboards 1.1.0.

**Bloquea runtime de:** Messenger, VE, Dashboards unificado, FieldEngine wizard, RenderEngine, contratos, ThemeEngine, SEO perfiles.

---

## Siguiente paso recomendado

**Redactar** `ACTA-MIGRACION-USUARIOS-PERFILES v1.0.0` como acta de **diseño de migración** con:

- Alcance y bridge
- Colecciones y FK
- Criterios éxito
- Vacíos TBD en anexo operacional
- Referencias a actas congeladas (sin modificarlas)

**No incluir:** scripts, rules, fechas producción.

---

*Workshop documental — no autoriza migración ni runtime.*
