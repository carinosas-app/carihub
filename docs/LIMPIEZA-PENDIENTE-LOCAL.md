# Limpieza pendiente — artefactos locales (revisión final)

**Generado:** 2026-07-07  
**Estado:** solo diagnóstico — **ningún archivo eliminado** hasta autorización explícita.

Este documento lista candidatos a eliminación o archivo. Las evidencias QA (screenshots, reportes) se conservan hasta confirmar que no se necesitan para auditorías o regresiones.

---

## 1. Scripts temporales (`scripts/_tmp-*.mjs`)

| Ruta | Propósito | ¿Cumplió? | Recomendación |
|------|-----------|-----------|---------------|
| `scripts/_tmp-pr110-e2e-smoke.mjs` | Smoke E2E PR #110 (home geo) | Sí — PR mergeado | Eliminar tras autorización |
| `scripts/_tmp-pr110-final-validate.mjs` | Gate sector cards HTTP/file | Sí | Eliminar tras autorización |
| `scripts/_tmp-p112-predeploy-smoke.mjs` | Smoke pre-deploy PR #112 | Sí — PR mergeado | Eliminar tras autorización |

---

## 2. Scripts temporales (`agent-tools/_tmp-*.mjs`)

| Ruta | Propósito | ¿Cumplió? | Recomendación |
|------|-----------|-----------|---------------|
| `agent-tools/_tmp-audit-registro-perfil.mjs` | Auditoría manual blocks↔persist↔render | Superseded por QA-REG-PUB | Eliminar tras autorización |
| `agent-tools/_tmp-predeploy-visual.mjs` | Smoke visual pre-deploy PR #112 | Sí | Eliminar tras autorización |
| `agent-tools/_tmp-postdeploy-prod.mjs` | Verificación post-deploy producción | Sí | Eliminar tras autorización |
| `agent-tools/_tmp-prod-repro.mjs` | Repro geo CTAs en prod | One-shot debug | Eliminar tras autorización |

---

## 3. Duplicados promovidos a `scripts/`

| Ruta local | Notas |
|------------|-------|
| `agent-tools/qa-fondos-static.mjs` | **Promovido** a `scripts/qa-fondos-static.mjs` — copia local puede eliminarse tras autorización |
| `agent-tools/qa-fondos-visual.mjs` | QA browser complementario — evaluar promoción o eliminación |

---

## 4. Logs

| Ruta | Recomendación |
|------|---------------|
| `agent-tools/pr110-final-validate.log` | Eliminar tras autorización (148 B, truncado) |

---

## 5. Reportes QA regenerables (`agent-tools/qa-paridad-reports/`)

Regenerables con `node scripts/qa-paridad-reg-pub-*.mjs`. **Conservar hasta confirmar** que no se necesitan para auditoría.

| Carpeta | Contenido | Tamaño aprox. | Prioridad conservación |
|---------|-----------|---------------|------------------------|
| `fase-c-smoke/` | Evidencia Fase C 3/3 PASS (JSON + PNG) | ~2.5 MB | **Alta** — última evidencia merge PR #113 |
| `2026-07-07T03-47-10/` | Fase A catálogo 443 subs | ~22 MB | Media — regenerable |
| `2026-07-07T03-48-10/` | Duplicado Fase A (+1 min) | ~22 MB | **Baja** — candidato eliminación |
| `test-salud/` | Fase A filtro salud | ~1.7 MB | Baja |
| `smoke-salud/`, `smoke-dominatrix/`, `smoke-unicorns/` | Fase B smoke pre-commit | ~80 KB c/u | Media |
| `post-commit-salud/`, `post-commit-dom/`, `post-commit-uni/` | Duplicados post-commit Fase B | ~80 KB c/u | Baja |
| `2026-07-07T05-20-10/` | Fase B medicos-generales | ~20 KB | Baja |

---

## 6. Screenshots QA visual (~47 PNG, ~35 MB)

**Conservar hasta confirmar** — evidencia regresiones visuales.

| Carpeta | PR / contexto | Candidato eliminación |
|---------|---------------|------------------------|
| `agent-tools/p1-qa-shots/` (21 PNG) | QA fondos sectoriales P1 | Tras cierre WIP visual |
| `agent-tools/pr110-smoke/` (5 PNG) | PR #110 | Tras autorización; conservar si auditoría geo |
| `agent-tools/predeploy-shots/` (10 PNG) | PR #112 pre-deploy | Tras autorización |
| `agent-tools/postdeploy-prod-shots/` (6 PNG) | Post-deploy prod | Tras autorización |
| `agent-tools/local-sector-cards-fixed.png` | Debug sector cards | Baja prioridad |
| `agent-tools/prod-sector-cards-loaded.png` | Debug prod | Baja prioridad |
| `agent-tools/prod-sector-cards-now.png` | Debug prod | Baja prioridad |
| `agent-tools/pr110-smoke/error.png` | Debug fallo | **Alta** candidato eliminación |

---

## 7. Resumen de acciones (pendiente autorización)

| Acción | Ítems | Riesgo |
|--------|-------|--------|
| **Eliminar scripts `_tmp-*`** | 7 archivos .mjs | Nulo |
| **Eliminar duplicados Fase A** | `2026-07-07T03-48-10/` | Nulo |
| **Eliminar PNG debug** | `error.png`, sueltos prod/local | Nulo |
| **Eliminar todos PNG/reportes** | ~45 MB | Bajo — regenerable salvo evidencia histórica |
| **Conservar** | `fase-c-smoke/` completo | — |

---

## 8. `.gitignore` actualizado

Los paths anteriores quedan fuera de Git vía `.gitignore` (ver sección QA local). No afecta archivos ya versionados.
