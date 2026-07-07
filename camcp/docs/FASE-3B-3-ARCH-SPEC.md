# CAMCP Fase 3B.3 — `arch.*` Specification

**Estado:** SPEC **APROBADO CON OBSERVACIONES** — implementación **NO AUTORIZADA** hasta autorización explícita de rama/código  
**Aprobación SPEC:** 2026-07-07 — dirección técnica 3B.3 `arch.*` + Regla 3 SSOT  
**Baseline código:** `main` @ `dd00847` (29 tools, 0 write-capable)  
**Implementación 3B.2:** `a5fb451` (PR #119) — **contrato inmutable**  
**Fases congeladas:** 3B.1 `parity.*` @ `d383e4e` · 3B.2 `data.*` @ `a5fb451`  
**Fecha:** 2026-07-07  
**Orden oficial:** 3B.1 parity ✓ → 3B.2 data ✓ → **3B.3 arch** → 3E CI  

---

## Reglas permanentes aplicables

### Regla general (heredada)

> Toda nueva tool debe justificar claramente el valor que aporta y reutilizar la arquitectura existente. No se implementarán herramientas que dupliquen QA, contratos, renderizadores o lógica ya existente.

**Congelamiento 3B.1 y 3B.2:** `parity.*` y `data.*` no se modifican en 3B.3 salvo bug demostrado y autorización explícita.

### Regla 1 — Análisis estático, no validación de negocio

1. **Ninguna tool `arch.*` podrá implementar lógica de validación de contratos de datos, paridad o render.**
2. **Toda verificación de contrato de pipeline/perfil** permanece en `data.*` / `parity.*` / scripts QA.
3. **`arch.*` limita su rol a:**
   - lectura estática del repo (filesystem interno, grep allowlisted),
   - lectura de artefactos documentales (ACTA, MAPA-MAESTRO, gpt-knowledge, `.cursor/rules`),
   - composición de grafo/impacto vía Intelligence Core existente,
   - diff git read-only para detectar toques a módulos congelados.
4. **Si una validación arquitectónica nueva requiere ejecución de negocio**, el flujo obligatorio es:
   ```
   (1) Incorporar validación al ecosistema QA CariHub (script/gate)
   (2) Exponer vía qa.* / intel.run_module si aplica
   (3) arch.* solo referencia/orquesta si aporta CAMCP REPORT semántico
   ```

**Criterio bloqueante:** cualquier PR 3B.3 que reimplemente mapToPerfil, field-engine, render-lite, normalizadores o ejecute Playwright/VM desde `arch/` → **BLOQUEADO**.

### Regla 2 — Reutilización explícita

1. **Toda tool debe declarar `reuses[]`** en `arch.config.json`, `description` y acta de cierre.
2. **Prohibido** duplicar builders/parsers ya presentes en `intelligence/`, `reports/`, `data/`, `parity/`.
3. **Extender** módulos existentes antes de crear pipelines paralelos.

### Regla 3 — No crear conocimiento paralelo

> **No crear conocimiento paralelo.**

1. **Toda tool `arch.*` debe declarar explícitamente su Single Source of Truth (SSOT)** en:
   - este SPEC (tabla §3.1),
   - `arch.config.json` (`ssot`, `reuses[]`),
   - `arch.definitions.ts` (`description`),
   - acta de cierre `FASE-3B-3-CIERRE.md`.
2. **CAMCP no es fuente de verdad** — solo lee, cruza y reporta sobre artefactos canónicos del repo (ACTA, MAPA, config, código, `intel.graph`).
3. **Si una tool necesita reconstruir, replicar o mantener una copia local de información que ya existe en un SSOT**, la implementación queda **BLOQUEADA** salvo autorización explícita por escrito.
4. **Prohibido:** registries frozen duplicados sin leer ACTA; mapas de dominio propios sin MAPA/config; grafos de dependencias paralelos a `intel.graph`; catálogos de duplicados persistidos fuera de reportes CAMCP.

**Criterio bloqueante:** cualquier PR 3B.3 que introduzca un datastore, cache o registry en `camcp/` que sustituya (en lugar de referenciar) un SSOT documentado → **BLOQUEADO**.

### Restricciones permanentes (sin relajación)

| Restricción | 3B.3 |
|-------------|------|
| Solo `camcp/` | Obligatorio |
| **0 write-capable** tools | Obligatorio |
| Sin `public/` | Prohibido modificar |
| Sin Firestore / Firebase producción | Prohibido conectar |
| Sin runtime CariHub | Prohibido modificar |
| Sin deploy | Prohibido |
| Sin duplicar QA, parity, data | Prohibido |

---

## 1. Objetivo real de `arch.*`

### 1.1 Qué problema resuelve

CariHub es un **monolito multipágina** con **7+ capas congeladas por acta**, **443+ subcategorías**, documentación distribuida (`MAPA-MAESTRO`, `gpt-knowledge`, MPS, ACTA) y reglas operativas en `.cursor/rules`. Tras 3B.1 (`parity.*`) y 3B.2 (`data.*`), el ecosistema CAMCP audita **contratos de datos y paridad cross-surface**, pero **no audita de forma dedicada**:

| Gap | Evidencia / síntoma |
|-----|---------------------|
| PRs que tocan módulos congelados sin autorización | 15 ACTA-CONGELAMIENTO*.json + reglas `.cursor/rules`; hoy solo revisión manual |
| Drift documentación ↔ repo (MAPA, dominios, anclas) | `intel.graph` verifica existencia de anclas, no alineación MAPA ↔ config ↔ docs |
| Deuda por copy-paste en blocks/render/normalizers | Sin inventario estático de símbolos duplicados en capas críticas |
| Impacto estructural antes de refactors grandes | `intel.impact` sugiere QA por dominio, no grafo de imports entre archivos ancla |
| Namespace semántico para agentes | Desarrolladores deben combinar `git.diff` + `filesystem.search` + lectura ACTA manual |

**Fase 3B.3** introduce `arch.*`: capa MCP de **auditoría estructural y gobernanza** — **orquestación + análisis estático read-only + CAMCP REPORT** — sin ejecutar pipeline registro/render ni duplicar `parity.*` / `data.*`.

### 1.2 Valor frente a herramientas existentes

| Capa existente | Qué ya cubre | Qué **no** cubre (rol de `arch.*`) |
|----------------|--------------|-------------------------------------|
| `filesystem.*` | Lectura/búsqueda genérica | Semántica ACTA/congelamiento, findings CAMCP |
| `git.*` / `git.scope_check` | Diff y allowlist **manual** del caller | Registro curado de módulos congelados + severidad + CAMCP REPORT |
| `intel.list_domains` | Dominios desde MAPA + config | Cruce MAPA ↔ anclas ↔ gpt-knowledge ↔ archivos huérfanos |
| `intel.graph` | Dominio→ancla→QA (cap 40 scripts) | Imports JS entre anclas; violaciones frozen; duplicación código |
| `intel.impact` | Hints QA post-diff por dominio | No detecta toques a paths congelados ni deuda copy-paste |
| `parity.*` | Paridad registro↔render | No audita arquitectura repo ni actas |
| `data.*` | Contratos pipeline persist/hydrate/schema | No audita gobernanza modular ni duplicación fuente |
| `qa.*` | Ejecuta scripts QA | No sustituye auditoría estática de gobernanza |

**Principio:** `arch.*` **complementa** Intelligence Core; **no reemplaza** `intel.graph` ni `git.scope_check`.

### 1.3 Qué problemas evita en CariHub

| Problema | Tool (prioridad) | Mecanismo |
|----------|------------------|-----------|
| Merge accidental en FieldEngine/RenderEngine/dashboard congelado | `arch.frozen_violations` **P1** | Diff git vs `archivosBaseline` ACTA + fases CAMCP congeladas |
| Deuda copy-paste en finalize*/mapToPerfil/normalizers | `arch.scan_duplicates` **P2** | Patrones allowlisted + rg/filesystem interno |
| Refactor sin conocer fronteras APP_* | `arch.domain_boundaries` **P3** | MAPA + `domainAnchors` + gpt-knowledge vs filesystem |
| Cambio en ancla rompe imports downstream | `arch.dependencies` **P4 (condicional)** | Vista/filtro sobre `intel.graph` — sin segundo grafo |
| Agente sin contrato MCP de gobernanza | Namespace `arch.*` | CAMCP REPORT unificado + `intel.parse_report` |

### 1.4 Por qué prioridad P0 (post-3B.2, pre-3E CI)

1. **Completa la Audit Layer 3B** antes del primer pipeline CI oficial (orden canónico: 3B.3 → 3E).
2. **`arch.frozen_violations` es prerrequisito de gate CI** — el repo tiene congelamiento explícito por acta.
3. **Scripts QA no cubren gobernanza modular** — no existe `qa-*frozen*` ni `qa-*arch*`.
4. **Patrón maduro** — mismo runner/parsers/reports que `parity/` y `data/`.
5. **Protege inversiones 3B.1/3B.2** — evita PRs que rompan módulos congelados mientras se usan parity/data en CI.

---

## 2. Alcance exacto

### 2.1 Incluido (exclusivo 3B.3)

| Componente | Descripción |
|------------|-------------|
| Namespace `arch.*` | **3 tools obligatorias + 1 condicional** (§3) |
| `camcp/src/arch/` | runner, analyzers estáticos, parsers → CamcpReport |
| `camcp/config/arch.config.json` | `ssot`, `reuses[]`, frozen patterns, duplicate patterns |
| Extensión mínima `intelligence/graph/builder.ts` | Solo P4 `arch.dependencies`; extensión in-place en `intel.graph` — **sin módulo grafo paralelo** |
| `aggregateArchReport()` | Extensión Reports Engine |
| `camcp/scripts/smoke-arch.mjs` | Smoke dedicado |
| Documentación | Este SPEC + `FASE-3B-3-CIERRE.md` (post-implementación) |

### 2.2 Excluido (explícito)

| Excluido | Fase / motivo |
|----------|---------------|
| `perf.*` | 3C |
| `seo.*`, `ads.*` | 3D |
| CI GitHub Actions | 3E |
| `intel.run_audit_pack` | Opcional post-3B.3 o 3E — fuera de scope mínimo |
| Modificaciones `parity.*`, `data.*` | Congelados |
| Modificaciones `public/`, Firestore, Firebase | Prohibido |
| Nuevo harness Playwright / VM | Prohibido |
| Reimplementar validación pipeline | Prohibido (Regla 1) |
| `CAMCP-ROADMAP-MAESTRO.md` en commits | Roadmap local no aprobado |

### 2.3 Relación con capas existentes

| Capa | Rol | Relación con `arch.*` |
|------|-----|------------------------|
| `intel.graph` | Grafo dominio→ancla→QA (SSOT de grafos) | `arch.dependencies` **solo consume/extiende** `intel.graph`; **prohibido** segundo grafo |
| `git.scope_check` | Allowlist genérica | `arch.frozen_violations` usa diff git internamente + registry semántico |
| `filesystem.search` | rg genérico | `arch.scan_duplicates` usa search interno con patrones curados |
| `data.*` / `parity.*` | Contratos datos/paridad | Sin solapamiento funcional |

---

## 3. Tools propuestas — mínimo estrictamente necesario

**Total post-3B.3:** 29 + **3 obligatorias** = **32 tools** (baseline mínimo aprobable)  
**Total con dependencias:** 29 + **4** = **33 tools** (solo si `arch.dependencies` demuestra valor adicional sobre `intel.graph`)

### 3.1 Inventario propuesto — orden de prioridad de implementación

| Prioridad | Tool | Capability | Veredicto | SSOT (Single Source of Truth) | Delega / reutiliza |
|-----------|------|------------|-----------|-------------------------------|-------------------|
| **P1** | `arch.frozen_violations` | report-only | **OBLIGATORIA** | `scripts/ACTA-CONGELAMIENTO-*.json` + `.cursor/rules/*.mdc` | `git.diff`, `contracts/loader`, `reports/*` |
| **P2** | `arch.scan_duplicates` | report-only | **OBLIGATORIA** | Código fuente del repo (paths ancla) | `filesystem.search`, patrones `arch.config.json` |
| **P3** | `arch.domain_boundaries` | read-only | **OBLIGATORIA** | `MAPA-MAESTRO-CARIHUB.json` + `intelligence.config.json` + `docs/gpt-knowledge/` | `contracts/loader`, `intel.graph` stats |
| **P4** | `arch.dependencies` | read-only | **CONDICIONAL** | **`intel.graph`** (único grafo canónico) | `intelligence/graph/builder`, `graph/store` — **sin grafo paralelo** |

**Orden de implementación obligatorio:** P1 → P2 → P3 → P4 (P4 solo tras demostrar valor incremental).

**Decisión de scope mínimo:** implementación **bloqueada** si incluye menos de P1–P3. **P4** se implementa **solo si** el smoke demuestra aportar valor **adicional** no obtenible invocando `intel.graph` + `intel.impact` con los parámetros existentes.

### 3.2 Especificación por tool

#### `arch.frozen_violations` (report-only) — **P1**

**Input:** `{ base?: string, head?: string, includeCamcpFrozen?: boolean }`  
**Default:** diff `origin/main...HEAD`

**Flujo:**
```
arch.frozen_violations
  → frozen-registry.ts (lee ACTA archivosBaseline + reglas .cursor/rules + camcp frozen phases)
  → git diff --name-only (Command Guard allowlist)
  → cruza paths tocados vs registry
  → aggregateArchReport → agent-tools/camcp-reports/arch.frozen_violations/{runId}/
```

**Fuentes frozen registry (read-only):**
- `scripts/ACTA-CONGELAMIENTO-*.json` → campo `archivosBaseline` / paths documentados
- `.cursor/rules/*.mdc` → paths mencionados en reglas de congelamiento (dashboard, disciplina operativa)
- `camcp/docs/FASE-3B-*-CIERRE.md` + baseline → fases CAMCP congeladas (`parity.*`, `data.*`)
- `arch.config.json` → `frozenPaths[]` curados manualmente (extension point)

**Findings ejemplo:** `ARCH-FROZEN-001` — modificación en `public/js/carihub-registro-public-blocks.js` sin autorización (FieldEngine/Registro congelado).

**reuses:** `git.tools` (diff), `contracts/loader`, `reports/*`, Policy/Path/Command Guard  
**SSOT:** `scripts/ACTA-CONGELAMIENTO-*.json` (campo `archivosBaseline`) + `.cursor/rules/*.mdc` — `arch.config.json` solo referencia/curación, no sustituye ACTA.

---

#### `arch.scan_duplicates` (report-only) — **P2**

**Input:** `{ scope?: string[], minSimilarity?: number }`  
**Default scope:** paths ancla APP_REGISTRO + APP_PUBLICA (configurable)

**Flujo:**
```
arch.scan_duplicates
  → patrones allowlisted en arch.config.json (finalize*, mapToPerfil*, normalizar*, slim*)
  → filesystem.search / rg interno (sin shell arbitrario)
  → agrupa coincidencias por hash/normalized-body
  → findings con severidad (warn si nombre similar, fail si body idéntico > umbral)
```

**Distinción vs parity render duplicate:** parity audita **DOM/campos render**; arch audita **código fuente duplicado**.

**reuses:** `filesystem.search`, `reports/*`, patrones documentados en MPS/registro  
**SSOT:** archivos fuente del repo en scope — CAMCP no persiste catálogo de duplicados fuera del reporte de la ejecución.

**Mitigación falsos positivos:** severidad graduada; finding incluye paths y snippet hash; revisión humana esperada.

---

#### `arch.domain_boundaries` (read-only) — **P3**

**Input:** `{ domain?: string }` — opcional filtrar un APP_*

**Flujo:**
```
arch.domain_boundaries
  → loadMapaMaestro + domainAnchors + listGptKnowledgeDocs
  → verifica: ancla existe, doc huérfano, dominio MAPA sin anclas, ancla sin dominio
  → aggregateArchReport (read-only JSON + opcional report.md)
```

**No duplica `intel.list_domains`:** produce **findings de frontera** (gaps/huérfanos/drift), no solo listado.

**reuses:** `intelligence/contracts/loader`, `intelligence.config.json`, `filesystem` exists, `intel.graph` stats opcionales  
**SSOT:** `scripts/MAPA-MAESTRO-CARIHUB.json` + `camcp/config/intelligence.config.json` (`domainAnchors`) + `docs/gpt-knowledge/` — sin mapa paralelo en CAMCP.

---

#### `arch.dependencies` (read-only) — **P4 CONDICIONAL**

**Input:** `{ domain?: string, depth?: number, includeImports?: boolean }`

**Flujo:**
```
arch.dependencies
  → invoca getGraph() / buildGraph() existente (intel.graph — SSOT)
  → opcional: extensión in-place en builder con includeImports (misma estructura IntelligenceGraph)
  → arch.dependencies aplica filtro/vista (dominio, profundidad) sobre el grafo canónico
  → retorna subgrafo + stats — sin serializar ni cachear un grafo alternativo
```

**Regla anti-grafo-paralelo (obligatoria):**

- **`arch.dependencies` NO puede construir un segundo grafo de dependencias.**
- **SSOT del grafo:** `intel.graph` vía `intelligence/graph/builder.ts` + `graph/store.ts`.
- **Permitido:** extender `buildGraph()` con aristas `imports` en el **mismo** `IntelligenceGraph` (flag opt-in), consumido tanto por `intel.graph` como por `arch.dependencies`.
- **Prohibido:** módulo `dependency-graph.ts` con builder/cache/proyección propia; JSON de grafo en `camcp/`; duplicar nodos/edges ya presentes en `.cache/graph`.
- **Si la extensión `includeImports` no aporta valor demostrable** vs `intel.graph` + `intel.impact` → **no implementar P4**; posponer a 3C fusionada con `perf.monolith_index`.

**Distinción vs `intel.graph`:** `intel.graph` expone el grafo completo; `arch.dependencies` es **vista MCP semántica** (filtros, findings import-level, CAMCP REPORT) sobre el **mismo** SSOT.

**Condición de inclusión:** smoke documenta caso de uso donde `intel.graph` solo no satisface refactor import-level. Sin evidencia → **excluir P4 del PR 3B.3**.

**reuses:** `intelligence/graph/builder`, `graph/store`, cache config — **exclusivamente**  
**SSOT:** `intel.graph` / `IntelligenceGraph` — una sola instancia canónica por commit.

---

### 3.3 Tools explícitamente descartadas

| Tool propuesta en borrador 3B | Motivo descarte |
|-------------------------------|-----------------|
| `intel.run_audit_pack` | Orquestación cross-namespace — scope 3E/post-3B.3; no arch.* puro |
| `intel.mps_sync_check` | Fase 5 / roadmap; solapa parcialmente `domain_boundaries` |
| Duplicar `git.scope_check` como `arch.scope_check` | Redundante — frozen_violations es semántico |
| Wrapper de `parity.*` / `data.*` bajo arch | Viola separación de namespaces |

---

### 3.4 Evaluación — 6 criterios obligatorios por tool

Escala: **Alto** / **Medio** / **Bajo** / **N/A**

#### `arch.frozen_violations`

| Criterio | Evaluación | Justificación |
|----------|------------|---------------|
| 1. Reduce tiempo de desarrollo | **Alto** | Un comando vs revisar 15 ACTA + rules manualmente en cada PR |
| 2. Reduce riesgo de romper CariHub | **Alto** | Bloquea merges silenciosos en capas congeladas (FieldEngine, Render, Dashboard) |
| 3. Mejora arquitectura | **Alto** | Refuerza gobernanza documentada; alinea operación con actas |
| 4. Detecta errores antes del merge | **Alto** | Core del gate CI propuesto (3E) |
| 5. Escala (archivos/categorías/perfiles) | **Medio** | O(archivos en diff); registry estático acotado; no depende de 443 subs |
| 6. Ciberseguridad | **Alto** | Read-only git diff; 0 write; no expone secretos; refuerza disciplina de cambio |

**Veredicto P1:** **INCLUIR** — tool más crítica de 3B.3.

---

#### `arch.scan_duplicates` — **P2**

| Criterio | Evaluación | Justificación |
|----------|------------|---------------|
| 1. Reduce tiempo de desarrollo | **Medio** | Evita búsquedas rg manuales repetidas en blocks/render |
| 2. Reduce riesgo de romper CariHub | **Medio** | Deuda copy-paste correlaciona con bugs de paridad |
| 3. Mejora arquitectura | **Alto** | Visibilidad deuda antes de modularizar monolito |
| 4. Detecta errores antes del merge | **Medio** | Preventivo; no bloqueante salvo duplicación crítica configurada |
| 5. Escala | **Medio-Bajo** | Scope acotado a anclas; full-repo scan prohibido por performance |
| 6. Ciberseguridad | **Alto** | Report-only; patrones allowlisted; sin exec arbitrario |

**Veredicto P2:** **INCLUIR** — valor único; falsos positivos mitigables por severidad.

---

#### `arch.domain_boundaries` — **P3**

| Criterio | Evaluación | Justificación |
|----------|------------|---------------|
| 1. Reduce tiempo de desarrollo | **Medio-Alto** | Automatiza cruce MAPA/docs/anclas |
| 2. Reduce riesgo de romper CariHub | **Medio-Alto** | Detecta anclas rotas/huérfanas antes de runtime |
| 3. Mejora arquitectura | **Alto** | Visibilidad fronteras APP_* vs monolito real |
| 4. Detecta errores antes del merge | **Medio** | Drift documental; complementa code review |
| 5. Escala | **Medio** | O(anclas + docs); ~12 dominios; lineal en archivos ancla |
| 6. Ciberseguridad | **Alto** | Read-only; solo paths públicos del repo |

**Veredicto P3:** **INCLUIR** — complemento necesario a `intel.graph` sin duplicarlo.

---

#### `arch.dependencies` — **P4 (condicional)**

| Criterio | Evaluación | Justificación |
|----------|------------|---------------|
| 1. Reduce tiempo de desarrollo | **Medio** | Útil en refactors; **menor prioridad que P1–P3** |
| 2. Reduce riesgo de romper CariHub | **Medio** | Import roto detectable también con build manual |
| 3. Mejora arquitectura | **Medio-Alto** | Solo si aporta vista import-level sobre `intel.graph` existente |
| 4. Detecta errores antes del merge | **Medio** | Complementa `intel.impact`; no sustituye QA |
| 5. Escala | **Medio-Bajo** | Parse imports en miles de JS — requiere cache SSOT + scope por dominio |
| 6. Ciberseguridad | **Alto** | Read-only estático; sin segundo grafo |

**Veredicto P4:** **CONDICIONAL** — incluir **solo si** demuestra valor adicional sobre `intel.graph`; si no, posponer a 3C sin bloquear 3B.3.

---

## 4. Reutilización — qué QA, contratos y documentación existente usa

| Artefacto CariHub | Uso en `arch.*` |
|-------------------|-----------------|
| `scripts/ACTA-CONGELAMIENTO-*.json` (15 actas) | Registry frozen — `archivosBaseline`, `estado: CONGELADO` |
| `scripts/MAPA-MAESTRO-CARIHUB.json` | `domain_boundaries` — `mapaActual`, dominios APP_* |
| `docs/gpt-knowledge/*.md` | `domain_boundaries` — docs por dominio |
| `camcp/config/intelligence.config.json` | `domainAnchors`, modules (referencia cruzada) |
| `.cursor/rules/*.mdc` | Paths congelados operativos (dashboard, disciplina) |
| `scripts/MPS-*`, `SPEC-*` | Referencia en findings; lectura opcional paths |
| **No hay scripts `qa-*arch*`** | Análisis estático en CAMCP — Regla 1 OK (no es validación pipeline) |

### Anti-duplicación (matriz)

| Prohibido | Permitido |
|-----------|-----------|
| Reimplementar paridad / pipeline | Referenciar `parity.*` / `data.*` en hints de impacto |
| Duplicar `git.scope_check` | `frozen_violations` con registry semántico curado (lee SSOT ACTA) |
| **Segundo grafo de dependencias** | Vista/filtro `arch.dependencies` sobre **`intel.graph` SSOT** |
| **Registry frozen paralelo** | Lectura runtime de ACTA + rules; `arch.config` solo curación |
| **Mapa dominios paralelo** | Cruce MAPA + config + gpt-knowledge en lectura |
| Duplicar builder graph completo | Extender `buildGraph` in-place con flag `includeImports` |
| Parser CAMCP REPORT paralelo | Extender `aggregateArchReport` en `reports/aggregator.ts` |
| rg/shell arbitrario | `filesystem.search` + Command Guard |
| Modificar ACTA/MAPA desde CAMCP | Solo lectura (Regla 3) |

---

## 5. Arquitectura propuesta

### 5.1 Diagrama

```
Cliente MCP / agente
        │
        ▼
┌───────────────────────────────────────┐
│  arch.* tools (definitions.ts)        │
│  capability: read-only / report-only  │
└───────────────┬───────────────────────┘
                │
                ▼
┌───────────────────────────────────────┐
│  camcp/src/arch/                      │
│  runner.ts        → orchestration     │
│  frozen-registry.ts   (P1 — lee SSOT) │
│  duplicate-scanner.ts (P2)            │
│  boundary-checker.ts  (P3)            │
│  dependency-view.ts     (P4 opcional) │
│    └─ vista sobre intel.graph SSOT    │
│  parsers/         → CamcpReport       │
└───────────────┬───────────────────────┘
                │
    ┌───────────┼───────────┐
    ▼           ▼           ▼
intelligence/  git.tools   filesystem/
(loader,graph) (diff)      (search)
                │
                ▼
        Reports Engine
                │
                ▼
agent-tools/camcp-reports/arch.*/{runId}/
  report.md · findings.json · summary.json
```

### 5.2 Integración Intelligence Core (3A)

| Componente 3A | Uso en 3B.3 |
|---------------|-------------|
| `contracts/loader.ts` | MAPA + gpt-knowledge |
| `graph/builder.ts` | **SSOT grafo** — extensión in-place solo para P4 (`includeImports`) |
| `graph/store.ts` | Cache **único** compartido por `intel.graph` y `arch.dependencies` |
| `impact/analyzer.ts` | Extender hints: sugerir `arch.frozen_violations` si diff toca APP_REGISTRO |
| `intel.parse_report` | Extender parser namespace `arch.*` |

### 5.3 Modelo de seguridad (invariantes)

| Invariante | Cómo se mantiene |
|------------|------------------|
| **0 write-capable** | Registry smoke + capability `read-only` / `report-only` únicamente |
| **report-only writes** | Solo `writeCamcpReport` → `agent-tools/camcp-reports/` |
| **Separación CAMCP/CariHub** | Sin modificar `public/`, scripts QA, ACTA, runtime |
| **Policy Engine** | Sin cambios estructurales; mode `report-only` global |
| **Path Guard** | Analyzers usan APIs internas con realpath; denyWritePaths intacto |
| **Command Guard** | Git solo subcomandos allowlist; sin deploy/firebase/shell destructivo |

---

## 6. Config propuesta (`arch.config.json`)

```json
{
  "version": "0.1.0",
  "tools": {
    "arch.frozen_violations": {
      "priority": "P1",
      "ssot": ["scripts/ACTA-CONGELAMIENTO-*.json", ".cursor/rules/*.mdc"],
      "reuses": ["git.diff", "contracts/loader", "reports/aggregator"],
      "actaGlob": "scripts/ACTA-CONGELAMIENTO-*.json",
      "rulesGlob": ".cursor/rules/*.mdc",
      "camcpFrozenPhases": ["3B.1", "3B.2"]
    },
    "arch.scan_duplicates": {
      "priority": "P2",
      "ssot": ["repo source files in scope"],
      "reuses": ["filesystem.search"],
      "patterns": ["finalize*", "mapToPerfil*", "normalizar*", "slimProfile*"],
      "defaultScope": ["public/js/carihub-registro-public-blocks.js", "public/js/registro-perfil-submit.js"]
    },
    "arch.domain_boundaries": {
      "priority": "P3",
      "ssot": ["scripts/MAPA-MAESTRO-CARIHUB.json", "camcp/config/intelligence.config.json", "docs/gpt-knowledge/"],
      "reuses": ["intelligence/contracts/loader", "intelligence.config.json", "intel.graph"]
    },
    "arch.dependencies": {
      "priority": "P4",
      "optional": true,
      "ssot": ["intel.graph"],
      "reuses": ["intelligence/graph/builder", "intelligence/graph/store"],
      "noParallelGraph": true
    }
  }
}
```

---

## 7. Riesgos

| Nivel | Riesgo | Mitigación |
|-------|--------|------------|
| **Bloqueador** | Tool write-capable accidental | smoke-arch policy check |
| **Bloqueador** | Modificar `parity.*` / `data.*` congelados | Scope PR; solo `camcp/src/arch/` + extensions acotadas |
| **Bloqueador** | Segundo grafo de dependencias en `arch/` | Regla 3 + `noParallelGraph: true`; smoke verifica SSOT `intel.graph` |
| **Bloqueador** | Conocimiento paralelo (registry frozen/mapas propios) | Regla 3 + smoke SSOT |
| **Importante** | Falsos positivos `scan_duplicates` | Severidad graduada; scope acotado |
| **Importante** | ACTA JSON heterogéneo (paths en distintos campos) | Parser defensivo; frozen-registry con fallback `archivosBaseline` |
| **Importante** | Solapamiento percibido con `intel.graph` | Roles documentados §1.2; dependencies condicional |
| **Importante** | Performance parse imports | Scope por dominio; cache; profundidad limitada |
| **Mejora futura** | `intel.run_audit_pack` orquestando arch+data+parity | Post-3E |

---

## 8. Validación propuesta (post-implementación)

### 8.1 Smoke `smoke-arch.mjs` (objetivo ≥14 checks)

- 0 write-capable; 32–33 tools total  
- Namespace `arch.*` registrado (3–4 tools)  
- `arch.frozen_violations` (P1) → diff simulado / clean tree → CAMCP REPORT  
- `arch.scan_duplicates` (P2) → delegación rg/filesystem  
- `arch.domain_boundaries` (P3) → findings estructura dominios  
- Regla 1: sin imports mapToPerfil/field-engine/playwright en `src/arch/`  
- Regla 2: cada tool declara `reuses[]`  
- Regla 3: cada tool declara `ssot`; sin grafo/registry paralelo; smoke verifica `noParallelGraph` en P4  
- `intel.parse_report` reconoce reportes `arch.*`  
- Registry auto intacto; policy/guards sin regresión  

### 8.2 Smokes existentes (regresión)

```bash
cd camcp && npm run build
npm run smoke          # 14
npm run smoke:extended # 27
npm run smoke:qa       # 9
npm run smoke:intel    # 12
npm run smoke:parity   # 14
npm run smoke:data     # 18
npm run smoke:arch     # nuevo
```

---

## 9. Plan de implementación (bloqueado hasta aprobación SPEC)

| Paso | Entregable |
|------|------------|
| 1 | Autorización explícita de **implementación** 3B.3 (SPEC ya aprobado con observaciones) |
| 2 | Rama `feat/camcp-fase-3b3-arch` desde `main` @ `dd00847`+ |
| 3 | `arch.config.json` + `src/arch/` + tools |
| 4 | `aggregateArchReport` + parser |
| 5 | Extensión opcional P4: `includeImports` in-place en `buildGraph` — **solo si** smoke demuestra valor vs `intel.graph` |
| 6 | `smoke-arch.mjs` |
| 7 | Validación pre-commit → PR → pre-merge smokes |
| 8 | Merge solo con autorización explícita |
| 9 | Docs cierre + baseline update (PR documental separado) |

**Estimación:** 1 PR atómico, complejidad **media** (patrón clonable de 3B.2).

---

## 10. Métricas objetivo post-3B.3

| Métrica | Mínimo | Recomendado |
|---------|--------|-------------|
| Tools totales | **32** (+3) | **33** (+4) |
| Write-capable | **0** | **0** |
| Namespaces | + `arch` | + `arch` |
| Archivos estimados | ~12 nuevos + ~6 modificados | ~15 nuevos + ~8 modificados |
| Solo `camcp/` | Sí | Sí |

---

## 11. Evaluación global — 6 criterios (namespace `arch.*`)

| Criterio | Evaluación global |
|----------|---------------------|
| 1. Reduce tiempo de desarrollo | **Alto** — especialmente P1 frozen + P2 scan |
| 2. Reduce riesgo de romper CariHub | **Alto** — gobernanza congelada pre-merge |
| 3. Mejora arquitectura | **Alto** — visibilidad fronteras y deuda |
| 4. Detecta errores antes del merge | **Alto** — prerrequisito 3E CI |
| 5. Escala | **Medio** — scope acotado; cache en dependencies |
| 6. Ciberseguridad | **Alto** — mantiene 0 write-capable e invariantes |

---

## 12. Aprobación requerida

Este documento es **SPEC únicamente**. Implementación **bloqueada** hasta:

| Ítem | Estado |
|------|--------|
| SPEC 3B.3 `arch.*` (dirección técnica) | **APROBADO CON OBSERVACIONES** — 2026-07-07 |
| Regla 1 — Análisis estático, no validación negocio | **Aprobada** |
| Regla 2 — Reutilización explícita | **Aprobada** |
| Regla 3 — No crear conocimiento paralelo (SSOT) | **Aprobada** |
| Prioridad P1→P2→P3→P4 | **Aprobada** |
| Tools obligatorias P1–P3 | **Aprobada** |
| Tool condicional P4 `arch.dependencies` | **Aprobada condicional** — solo valor adicional sobre `intel.graph` |
| Rama / código / PR / merge | **NO AUTORIZADO** |
| Deploy | **NO AUTORIZADO** |

---

## Referencias

- [BASELINE-CAMCP.md](./BASELINE-CAMCP.md) — main @ `dd00847`
- [FASE-3B-2-CIERRE.md](./FASE-3B-2-CIERRE.md) — 3B.2 cerrada @ `a5fb451`
- [FASE-3B-2-DATA-SPEC.md](./FASE-3B-2-DATA-SPEC.md) — patrón adapter/parsers
- [FASE-3B-1-PARITY-SPEC.md](./FASE-3B-1-PARITY-SPEC.md) — patrón namespace
- [FASE-3B-SPEC.md](./FASE-3B-SPEC.md) — dirección 3B original
- `scripts/MAPA-MAESTRO-CARIHUB.json`
- `scripts/ACTA-CONGELAMIENTO-*.json`
