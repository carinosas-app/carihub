# ALINEACION-SPEC-PANEL-DASHBOARD-CON-RUTAS-CANON v1.0.0

**Fecha:** 2026-06-11 · **Veredicto global:** **FAIL ratificación** · **Alineación parcial:** **PASS condicional (78%)**

Modo: solo análisis — **0 archivos existentes modificados**.

---

## 1. Archivos revisados

| Archivo | Existe | Estado |
|---|---|---|
| MATRIZ-RUTAS-NAV-CANONICA.json/.md | Sí | Canon v1.0.0 |
| SPEC-PANEL-DASHBOARD-MINIMO.json/.md | Sí | v1.0.0 operativo |
| ACTA-CONGELAMIENTO-PANEL-DASHBOARD.json/.md | Sí | CONGELADO — **prematuro** |
| AUDITORIA-SPEC-PANEL-DASHBOARD-MINIMO.json/.md | Sí | **Huérfana** |
| SPEC-DASHBOARDS + ACTA-DASH | Sí | Shell congelado |
| PLAN-MAESTRO-DASHBOARDS / ADMIN | Sí | Rutas legacy conflictivas |
| SPEC-REGISTRO-CUENTA, SPEC-PAGOS, SPEC-SEO | Sí | Coherentes con canon |
| fixtures-panel-dashboard-minimo-golden.json | Sí | Parcialmente vigente |

**Archivos nuevos:** este JSON + este MD.

---

## 2. Validación decisiones canónicas

| Decisión | SPEC actual | Resultado |
|---|---|---|
| `/cuenta/banners` canon | rutaBase anunciante | **PASS** |
| `/cuenta/anunciante` → 301 | No documentado en SPEC | **GAP** (alias en MATRIZ) |
| `/registro/banner` funnel | Ausente en SPEC | **FAIL** |
| `/registro/editar/{perfilId}` canon | CTAs DP-02/03 | **PASS** |
| Dashboard solo CTA edición | reglasCongeladas | **PASS** |
| `/cuenta/perfil/editar` no principal | No en SPEC | **PASS** (solo en PLAN externo) |
| `/admin/*` canon | matrizNavegacion usa `/admin/expedientes/*` | **FAIL** |
| `admin.html` bridge | No en SPEC/ACTA | **GAP** |
| `index.html` modales bridge | No en SPEC | **GAP** |
| `/resultados` noindex | vía SPEC-SEO indirecto | **PASS** |
| `/perfil/{id}/{slug}` público | CTA RenderEngine | **PASS** |

---

## 3. Inconsistencias (15)

### Críticas (2)

| ID | Archivo | Problema | Acción |
|---|---|---|---|
| **INC-001** | SPEC-PANEL `matrizNavegacion.admin` | URLs `/admin/expedientes/*` vs canon `/admin/revision`, `/admin/perfiles`, etc. | Corregir SPEC (auth) |
| **INC-002** | AUDITORIA-SPEC-PANEL | Audita borrador minimal (8 matrices, panel 1 pág.) no SPEC operativo | Regenerar v2.0.0 |

### Altas (5)

| ID | Problema |
|---|---|
| INC-003 | ACTA CONGELADO antes de alineación MATRIZ → requiere v1.1 |
| INC-004 | Centros transversales sin rutas `/cuenta/centro/*`, `/cuenta/config/*` |
| INC-005 | Falta `/registro/banner` en módulo anunciante |
| INC-006 | SPEC no referencia MATRIZ-RUTAS-NAV-CANONICA |
| INC-007 | Auditoría verifica 8 matrices; SPEC tiene 11 |

### Media / Baja

INC-008 naming MINIMO vs Operativo · INC-009 PLAN-DASH rutas legacy · INC-010 aliases301 ausentes · INC-011 ADM-02 sin rutasCanon · INC-012 fixtures sin banners · INC-013 ACTA sin MATRIZ · INC-014 MD centros sin rutas · INC-015 AUDITORIA-MAESTRA desactualizada

Detalle completo: [`ALINEACION-SPEC-PANEL-DASHBOARD-CON-RUTAS-CANON.json`](ALINEACION-SPEC-PANEL-DASHBOARD-CON-RUTAS-CANON.json)

---

## 4. Conflictos resueltos vs pendientes

**Resueltos en corpus (SPEC ya OK):** C-R01 banners · C-R02 registro/editar CTAs

**Resueltos en MATRIZ pero NO en SPEC:** C-R03 admin expedientes · C-R04 admin.html · C-R05 index modales · C-R06 registro/banner

**Pendientes globales:** C-P01 negocio · C-P02 operador · C-P03 messenger Post-MVP

---

## 5. Decisión nombre SPEC

| Opción | Recomendación |
|---|---|
| Mantener `SPEC-PANEL-DASHBOARD-MINIMO` | Corto plazo — sin rename |
| **`SPEC-DASHBOARDS-OPERATIVOS`** | **Recomendado P0 conceptual** |

**Estrategia:** Fase 1 — añadir `nombreCanon: SPEC-DASHBOARDS-OPERATIVOS` en metadata SPEC v1.0.1. Fase 2 — rename físico en v1.1 post-ratificación.

**Relación shell:** `SPEC-DASHBOARDS` (shell congelado) → `SPEC-DASHBOARDS-OPERATIVOS` (capa operacional).

---

## 6. ACTA panel — recomendación

| Pregunta | Respuesta |
|---|---|
| ¿Conservar v1.0.0? | Como borrador provisional — **no fuente oficial** |
| ¿Requiere v1.1? | **Sí** — post-correcciones SPEC + auditoría v2 |
| ¿Congelamiento? | **Parcial diseño** — runtime NO |
| ¿Ratificar ahora? | **No** — cumplir 6 condiciones en JSON |

---

## 7. Auditoría SPEC-PANEL

- **Huérfana:** audita versión minimal anterior
- **Regenerar:** AUDITORIA v2.0.0 (≥25 verificaciones + cross-check MATRIZ)
- **Fixtures:** PDM-01..10 (+ anunciante, admin cola, `/registro/banner`)

---

## 8. Impacto métrico

| Dimensión | Antes | Post-correcciones (est.) |
|---|---|---|
| SPEC ↔ MATRIZ alineación | **78%** | **96%** |
| Navegación canon | 92% | 96% |
| Documentación global | 89% | 91% |
| Arquitectura CAP-10 | 90% | 92% |
| Construcción P0 | 88% | 89% |
| MVP-OPERAR doc | 85% | 87% |
| Riesgo implementación | medio-alto | medio-bajo |

---

## 9. Cambios requeridos (autorización posterior — NO ejecutados)

| Archivo | Prioridad | Motivo |
|---|---|---|
| SPEC-PANEL-DASHBOARD-MINIMO.json | **P0** | INC-001 admin nav + MATRIZ ref |
| AUDITORIA-SPEC-PANEL (regenerar) | **P0** | Huérfana |
| ACTA-PANEL v1.1 | **P0** | Ratificación post-fix |
| fixtures golden | P1 | Casos banners |
| SPEC-PANEL .md | P1 | Sync JSON |

---

## 10. Reporte final

| Item | Valor |
|---|---|
| **PASS/FAIL** | **FAIL** ratificación · **PASS condicional** alineación parcial |
| Archivos revisados | 15 obligatorios + 2 relacionados |
| Archivos nuevos | 2 (este entregable) |
| Existentes no modificados | Todos |
| Inconsistencias | **15** (2 críticas, 5 altas) |
| Conflictos resueltos por MATRIZ en SPEC | 2/6 aplicados en SPEC |
| Conflictos pendientes | 9 |
| Nombre recomendado | **SPEC-DASHBOARDS-OPERATIVOS** (alias metadata primero) |
| ACTA | **v1.1** tras correcciones — no ratificar v1.0.0 como oficial |
| Auditorías/fixtures | **Regenerar v2.0.0** |
| Alineación antes/después | **78% → 96%** (estimado post-patch) |
| **Siguiente acción** | Autorizar patch SPEC v1.0.1 rutas/nav (INC-001,004-006,010-011) |

---

*Entregable de reconciliación — no modifica SPEC, ACTA, auditorías ni fixtures existentes.*
