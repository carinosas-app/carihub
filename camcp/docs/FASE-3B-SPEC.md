# CAMCP Fase 3B — SPEC técnico (borrador para aprobación)

**Estado:** SPEC — **NO IMPLEMENTAR** hasta autorización explícita  
**Baseline previo:** `main` @ `b365c11` (Fase 3A cerrada, PR #116)  
**Fecha:** 2026-07-07  

---

## 1. Objetivo

Extender CAMCP con tres namespaces de **auditoría arquitectónica y de contratos**, exclusivamente **read-only** y **report-only**, que **reutilicen** scripts QA, Intelligence Core y Reports Engine existentes — **sin reimplementar** `mapToPerfil`, field-engine, render-lite, ni tocar runtime.

### Alcance 3B (exclusivo)

| Eje | Namespace | Propósito |
|-----|-----------|-----------|
| A | `arch.*` | Duplicación, dependencias, fronteras de dominio, módulos congelados |
| B | `data.*` | Consistencia Registro → Firestore → Perfil público; contratos por subcategoría |
| C | `parity.*` | Paridad Resultados ↔ Perfil; sistema visual; banners/slots |

### Fuera de alcance 3B

- `perf.*` → Fase 3C
- `seo.*`, `ads.*` → Fase 3D
- CI GitHub Actions → Fase 3E
- Cualquier modificación a `public/`, Firestore, Firebase, deploy

---

## 2. Arquitectura propuesta

```
main @ b365c11 (22 tools)
        │
        ▼
┌───────────────────────────────────────────────────────────┐
│  Fase 3B — Audit Layer (adapters + analyzers read-only)   │
├───────────────────────────────────────────────────────────┤
│  arch/          data/           parity/                   │
│  duplicate      pipeline        static/vm/render          │
│  dependencies   persist         visual/fondos             │
│  boundaries     schema          sector-theme              │
│  frozen         hydrate         banners-slots             │
└────────┬──────────────┬──────────────┬────────────────────┘
         │              │              │
         ▼              ▼              ▼
┌────────────────────────────────────────────────────────────┐
│  Reutilización obligatoria (NO duplicar)                   │
│  • Intelligence Core (domains, graph, impact, cache)       │
│  • Reports Engine (schema, parser, writer, aggregator)     │
│  • qa.* / intel.run_module → scripts/qa-*.mjs              │
│  • contracts/loader → MAPA-MAESTRO + gpt-knowledge         │
│  • qa/catalog.ts + qa-paridad-reg-pub/lib/*                │
└────────────────────────────────────────────────────────────┘
         │
         ▼
  agent-tools/camcp-reports/{arch|data|parity}.* / {runId}/
    report.md · findings.json · summary.json
```

### Principio rector

> **CAMCP audita y reporta; CariHub ejecuta.**  
> Toda verificación de contratos delega a scripts QA existentes o lectura estática del repo. Ningún tool 3B ejecuta lógica de negocio de registro/render.

---

## 3. Lista de tools propuesta (+12 → total ~34)

### 3A Namespace `arch.*` (4 tools)

| Tool | Capability | Descripción |
|------|------------|-------------|
| `arch.scan_duplicates` | report-only | Detecta símbolos/funciones duplicadas (mapToPerfil helpers, normalizers, finalize*) vía grep + inventario estático |
| `arch.dependencies` | read-only | Grafo de dependencias entre archivos ancla por dominio APP_* (extiende `intel.graph`) |
| `arch.domain_boundaries` | read-only | Cruza MAPA-MAESTRO + gpt-knowledge + anclas config vs archivos reales |
| `arch.frozen_violations` | report-only | Diff git vs lista de módulos congelados (.cursor/rules, ACTA-*, MPS) |

### 3B Namespace `data.*` (4 tools)

| Tool | Capability | Descripción |
|------|------------|-------------|
| `data.pipeline_status` | report-only | Delega `qa-paridad-reg-pub-vm.mjs` (opcional `--sub`); parsea `pipeline-summary.json` |
| `data.persist_audit` | report-only | Delega `qa-p0-reg-persist-privacy.mjs` |
| `data.hydrate_audit` | report-only | Delega `qa-mp-submit-hydrate.mjs` |
| `data.schema_alignment` | report-only | Delega `validar-schemas-registro.mjs`; reporta gaps mapa ↔ schema-index ↔ blocks |

**Hallazgos esperados (sin reimplementar):**
- Campos registrados que no llegan a perfil público
- Campos mostrados sin origen en mapToPerfil/slim/hydrate
- Anti-contaminación entre arquetipos (via paridad VM contamination stage)
- Contratos nested por subcategoría (via sector nested contract QA)

### 3C Namespace `parity.*` (4 tools)

| Tool | Capability | Descripción |
|------|------------|-------------|
| `parity.static` | report-only | Delega `qa-paridad-reg-pub-static.mjs` → gaps.json, catalog.json |
| `parity.vm` | report-only | Delega `qa-paridad-reg-pub-vm.mjs` → field-level parity |
| `parity.render_strict` | report-only | Delega `qa-paridad-reg-pub-render.mjs --strict` |
| `parity.visual` | report-only | Delega `qa-fondos-static.mjs` + agregador sector-theme (lectura SISTEMA-VISUAL + CSS refs) |

**Cobertura parity visual:**
- Resultados ↔ Perfil: temas `body[data-sector]`, adult-pro, sector-pro
- Banners/slots: lectura `slots-catalog.js`, reglas documentadas vs `firestore.rules` (solo reporte, no modifica rules)
- Normalización: cruza outputs VM strict-vs-normal cuando existan

### Extensión `intel.*` (opcional en 3B, no bloqueante)

| Tool | Capability | Descripción |
|------|------------|-------------|
| `intel.run_audit_pack` | report-only | Orquesta pack 3B por dominio (`registro`, `publica`, `visual`) vía módulos registrados |

**Total objetivo post-3B:** 22 + 12 = **34 tools**, **0 write-capable**.

---

## 4. Flujo de datos

### 4.1 Flujo `arch.*`

```
Usuario / agente MCP
  → arch.scan_duplicates | arch.frozen_violations
  → lectura repo (filesystem.* interno) + MAPA-MAESTRO + rules ACTA
  → analyzer TypeScript (solo lectura)
  → writeCamcpReport → agent-tools/camcp-reports/arch.*/{runId}/
```

### 4.2 Flujo `data.*`

```
Usuario / agente MCP
  → data.pipeline_status --sub medicos-generales
  → adapter → runQaScript('scripts/qa-paridad-reg-pub-vm.mjs', ['--sub', ...])
  → QA escribe JSON en camcp-reports/qa.run_paridad_vm/{runId}/
  → reports/parser.ts lee pipeline-summary, failures, contamination
  → aggregateDataReport → report.md CAMCP REPORT
```

**Pipeline CariHub auditado (referencia, no ejecutado en CAMCP):**

```
Wizard (localStorage)
  → finalize* (blocks)
  → mapToPerfil (carihub-registro-public-blocks.js)
  → buildUsuarioDoc + slimProfileForFirestore (registro-perfil-submit.js)
  → Firestore usuarios/{uid}
  → normalizarPerfilFirestore (resultados-registrados.js)
  → render-lite / perfil-publico-init (perfil-publico.html)
```

### 4.3 Flujo `parity.*`

```
Usuario / agente MCP
  → parity.render_strict --sub abogados
  → adapter → qa-paridad-reg-pub-render.mjs --strict
  → Playwright (subprocess QA existente) → screenshots + DOM report
  → parser agrega strict-vs-normal si existe
  → CamcpReport
```

---

## 5. Dependencias

### Internas CAMCP (reutilizar)

| Módulo | Uso 3B |
|--------|--------|
| `intelligence/domains.ts` | Dominios APP_* para arch/data routing |
| `intelligence/graph/builder.ts` | Base para `arch.dependencies` |
| `intelligence/contracts/loader.ts` | MAPA-MAESTRO, gpt-knowledge |
| `intelligence/impact/analyzer.ts` | Sugerir audits post-diff |
| `qa/report-runner.ts` | Spawn scripts QA |
| `qa/catalog.ts` | Inventario scripts |
| `reports/*` | Formato unificado |
| `policy/*` | Sin cambios estructurales |

### Externas CariHub (solo lectura / delegación)

| Artefacto | Rol |
|-----------|-----|
| `scripts/qa-paridad-reg-pub-*` | Motor parity/data |
| `scripts/qa-p0-reg-persist-privacy.mjs` | Persist + privacy |
| `scripts/qa-mp-submit-hydrate.mjs` | Hydrate read-path |
| `scripts/validar-schemas-registro.mjs` | Schema alignment |
| `scripts/qa-fondos-static.mjs` | Visual CSS/HTML |
| `scripts/MAPA-MAESTRO-CARIHUB.json` | Arquitectura |
| `docs/gpt-knowledge/*.md` | Contratos dominio |
| `.cursor/rules/*.mdc` | Módulos congelados |
| `public/js/carihub-registro-public-blocks.js` | mapToPerfil (lectura grep, no exec) |
| `public/js/data/registro-schema-index.js` | 443 subs (lectura) |

### Nuevos archivos propuestos (implementación futura)

```
camcp/
  config/audit.config.json          # allowlists, frozen paths, duplicate patterns
  src/
    arch/
      duplicate-scanner.ts
      dependency-graph.ts
      boundary-checker.ts
      frozen-registry.ts
    data/
      pipeline-adapter.ts
      schema-adapter.ts
      findings-mapper.ts            # mapea JSON QA → ReportFinding
    parity/
      paridad-adapter.ts
      visual-aggregator.ts
    tools/
      arch.tools.ts · arch.definitions.ts
      data.tools.ts · data.definitions.ts
      parity.tools.ts · parity.definitions.ts
  scripts/
    smoke-arch.mjs
    smoke-data.mjs
    smoke-parity.mjs
  docs/
    FASE-3B-*.md
```

---

## 6. Estrategia de reutilización (anti-duplicación)

| Prohibido | Permitido |
|-----------|-----------|
| Reimplementar mapToPerfil en TypeScript | Delegar a `qa-paridad-reg-pub-vm.mjs` |
| Nuevo harness Playwright en camcp/ | Delegar a `qa-paridad-reg-pub-render.mjs` |
| Parser paralelo de reportes QA | Extender `reports/parser.ts` |
| Normalizadores propios | Leer outputs de `parity-checker.mjs`, `contamination-checker.mjs` |
| Modificar scripts QA desde CAMCP | Registrar adapters en `intelligence.config.json` modules[] |
| Duplicar catálogo 443 subs | Consumir `catalog.json` de paridad static |

### Registro de módulos (extensión `intelligence.config.json`)

```json
{
  "modules": [
    "... existentes 3A ...",
    { "id": "data_pipeline", "qaTool": "qa.run_paridad_vm", "auditType": "data" },
    { "id": "data_persist", "qaTool": "qa.run_pack", "packId": "p0-reg-persist-privacy" },
    { "id": "parity_static", "qaTool": "qa.run_paridad_static" },
    { "id": "parity_visual", "qaTool": "qa.run_fondos_static" }
  ]
}
```

---

## 7. Riesgos

| Nivel | Riesgo | Mitigación |
|-------|--------|------------|
| **Bloqueador** | Reimplementar pipeline registro en CAMCP | SPEC prohíbe; code review gate |
| **Bloqueador** | Tool write-capable accidental | Registry + smoke policy check |
| **Bloqueador** | Tocar módulos congelados en implementación | `arch.frozen_violations` + scope check en PR |
| **Importante** | Preview ruta A vs B enmascara gaps | `data.hydrate_audit` + documentar en findings |
| **Importante** | Paridad C no cubre 443 subs (render-map parcial) | Reportar cobertura % en parity.render_strict |
| **Importante** | Schema count drift (443 vs 461 mapa) | `data.schema_alignment` explicita delta |
| **Importante** | QA scripts lentos (Playwright) | Ejecución bajo demanda; timeout config; no watchers |
| **Importante** | `arch.scan_duplicates` falso positivo en nombres similares | Severidad + revisión humana en report |
| **Mejora futura** | Graph builder cap 40 nodos QA | Subir cap o paginar en 3B.1 |

---

## 8. Impacto esperado

| Criterio | Impacto 3B |
|----------|------------|
| Reduce tiempo de desarrollo | **Alto** — un comando MCP → audit pack completo |
| Reduce riesgo CariHub | **Alto** — detecta duplicación, frozen violations, parity gaps pre-merge |
| Calidad arquitectónica | **Alto** — visibilidad fronteras APP_* y contratos |
| Errores antes del merge | **Alto** — data.* + parity.* integrados en flujo PR |
| Escala | **Medio** — depende de cache y scope por `--sub`/`--sector` |
| Ciberseguridad | **Neutro/positivo** — mantiene 0 write-capable |

---

## 9. Validación de ciberseguridad

| Check | 3B |
|-------|-----|
| 0 write-capable tools | Obligatorio — smoke en cada namespace |
| No expone secretos/tokens | Solo lectura repo + reportes locales |
| No ejecución arbitraria | Allowlist fija en `audit.config.json` + `runQaScript` existente |
| No comandos destructivos | Command Guard sin cambios |
| No modifica Firestore/Firebase rules | Solo reporta inconsistencias documentadas |
| Escritura limitada | `agent-tools/camcp-reports/` via Path Guard |
| Separación CAMCP ↔ runtime | Sin modificar `public/` |
| Subprocess sandbox | Reutiliza guardrails Fase 2 (`qa.report-runner`) |

**Criterio bloqueante:** cualquier tool que escriba fuera de `camcp-reports/` → **BLOQUEADO HASTA REVISIÓN DE SEGURIDAD**.

---

## 10. Performance esperada

| Principio | 3B |
|-----------|-----|
| Bajo demanda | Cada tool invocado explícitamente |
| Sin watchers/daemon | MCP stdio unchanged |
| Incremental | `--sub`, `--sector`, `--packId` acotan scope |
| Cache | Reutilizar `.cache/graph/`; cache opcional para arch.scan (TTL) |
| Timeouts | Heredar de report-runner; parity.render con límite Playwright |
| Memoria | Parsers streaming de JSON QA; no cargar 443 subs en RAM si no necesario |

**CAMCP no afecta runtime CariHub** — subprocess QA solo en dev/CI local del operador.

---

## 11. Plan de implementación por etapas

### Etapa 3B.0 — Preparación (1 PR)
- `audit.config.json`
- `docs/FASE-3B-*.md`
- Smokes skeleton (skip si no wired)
- Extender `tools/index.ts` pattern (sin tools aún)

### Etapa 3B.1 — `parity.*` (1 PR)
- Adapters sobre paridad static/vm/render + fondos
- `parity.*` definitions (4 tools)
- `smoke-parity.mjs`
- **Razón:** mayor valor inmediato; reutiliza 100% QA existente

### Etapa 3B.2 — `data.*` (1 PR)
- Adapters persist/hydrate/schema
- `findings-mapper.ts` para JSON QA → CamcpReport
- `smoke-data.mjs`

### Etapa 3B.3 — `arch.*` (1 PR)
- duplicate-scanner, frozen-registry, boundary-checker
- `smoke-arch.mjs`
- Extender `intel.run_audit_pack` (opcional)

### Etapa 3B.4 — Integración intel (1 PR opcional)
- `intel.impact` hints para arch/data/parity
- Documentación cierre 3B
- Smoke agregado `smoke:audit` (arch+data+parity)

**Cada etapa:** commit atómico, PR separado, 4 smokes baseline + smoke etapa, sin deploy.

---

## 12. Criterios de aceptación 3B (para cierre futuro)

- [ ] 34 tools totales, 0 write-capable
- [ ] smoke + extended + qa + intel + smoke-arch + smoke-data + smoke-parity PASS
- [ ] Solo `camcp/` modificado
- [ ] Ningún script QA duplicado en camcp/
- [ ] Reports formato CAMCP REPORT unificado
- [ ] Documentación cierre + baseline actualizado

---

## 13. Aprobación requerida

Este documento es **SPEC únicamente**. Implementación bloqueada hasta:

1. Aprobación explícita del SPEC 3B
2. Autorización de rama (propuesta: `feat/camcp-fase-3b-audit-layer`)
3. Orden de etapas (3B.1 parity primero recomendado)

---

## Referencias

- [BASELINE-CAMCP.md](./BASELINE-CAMCP.md)
- [FASE-3A-CIERRE.md](./FASE-3A-CIERRE.md)
- `scripts/qa-paridad-reg-pub/README.md`
- `scripts/MPS-REGISTRO-MODULO-CONTRATOS.md`
- `docs/gpt-knowledge/FIELD-ENGINE-Y-RENDER-LITE.md`
