# CAMCP Fase 3B.2 — `data.*` Specification

**Estado:** SPEC **APROBADO** (dirección técnica) — implementación **autorizada** vía rama separada y flujo disciplinado  
**Aprobación SPEC:** 2026-07-07 — dirección técnica 3B.2 `data.*`  
**Baseline código:** `main` @ `d383e4e` (25 tools, 0 write-capable)  
**Fase previa congelada:** 3B.1 `parity.*` @ `d383e4e` (PR #118) — **contrato inmutable**  
**Fecha:** 2026-07-07  
**Orden oficial:** 3B.1 parity ✓ → **3B.2 data** → 3B.3 arch → 3E CI  

---

## Reglas permanentes aplicables

### Regla general (heredada)

> Toda nueva tool debe justificar claramente el valor que aporta y reutilizar la arquitectura existente. No se implementarán herramientas que dupliquen QA, contratos, renderizadores o lógica ya existente.

**Congelamiento 3B.1:** `parity.static`, `parity.vm`, `parity.render_strict` no se modifican en 3B.2 salvo bug demostrado y autorización explícita.

### Regla 1 — Delegación obligatoria

1. **Ninguna tool `data.*` podrá implementar lógica propia de validación del pipeline.**
2. **Toda validación deberá reutilizar exclusivamente QA existente o adapters oficiales** (`qa.tools.ts`, `runQaScript`, scripts `scripts/qa-*.mjs` / `validar-schemas-registro.mjs`).
3. **Si una validación nueva es necesaria**, el flujo obligatorio es:
   ```
   (1) Incorporar validación al ecosistema QA CariHub (script/pack/gate)
   (2) Exponer adapter oficial en qa.tools.ts si aplica
   (3) Recién entonces exponer vía data.*
   ```
4. **Prohibido en `camcp/src/data/`:** VM contexts, mapToPerfil, slim/hydrate, field-engine, render-lite, normalizadores, PrivacyGuard reimplementados.

**Criterio bloqueante:** cualquier PR 3B.2 que añada lógica de validación de pipeline en TypeScript dentro de `data.*` (fuera de parsers de artefactos QA) → **BLOQUEADO**.

### Regla 2 — Reutilización explícita

1. **Toda nueva tool deberá indicar explícitamente qué componente existente reutiliza** (`qa.*`, `intel.*`, `reports.*`, adapters o contratos documentados).
2. La justificación de reutilización es **obligatoria** en:
   - este SPEC (tabla §3),
   - `data.config.json` (`qaTool`, `script`, `reuses`),
   - `data.definitions.ts` (campo `description`),
   - acta de cierre `FASE-3B-2-CIERRE.md`.
3. **Si una tool no reutiliza ningún componente existente**, la implementación queda **bloqueada** hasta justificar la excepción por escrito y obtener autorización explícita.

### Restricciones permanentes (sin relajación)

| Restricción | 3B.2 |
|-------------|------|
| Solo `camcp/` | Obligatorio |
| **0 write-capable** tools | Obligatorio |
| Sin `public/` | Prohibido modificar |
| Sin Firestore / Firebase producción | Prohibido conectar |
| Sin runtime CariHub | Prohibido modificar |
| Sin duplicar QA, mapToPerfil, field-engine, render-lite | Prohibido |

---

## 1. Objetivo

### 1.1 Qué problema resuelve

CariHub persiste perfiles a través de un pipeline de datos crítico:

```
Wizard (localStorage)
  → finalize* (blocks)
  → mapToPerfil (carihub-registro-public-blocks.js)
  → buildUsuarioDoc + slimProfileForFirestore (registro-perfil-submit.js)
  → [Firestore usuarios/{uid}]  ← runtime producción (fuera de CAMCP)
  → normalizarPerfilFirestore (resultados-registrados.js)
  → render-lite / perfil-publico-init
```

Fase 3B.1 (`parity.*`) cubre **paridad cross-surface** (registro ↔ schema ↔ VM ↔ render DOM).  
**No cubre** de forma semántica dedicada:

| Gap | Evidencia QA existente no expuesta como namespace `data.*` |
|-----|-------------------------------------------------------------|
| Salud del pipeline mock→map→slim→hydrate por etapas | `pipeline-summary.json` (VM paridad) |
| Persistencia P0: `bloquesPublicos`, nested sectoriales, PrivacyGuard | `scripts/qa-p0-reg-persist-privacy.mjs` |
| Read-path post-submit: hydrate Firestore simulado → card/vista | `scripts/qa-mp-submit-hydrate.mjs` |
| Alineación mapa ↔ schema-index ↔ blocks ↔ precios | `scripts/validar-schemas-registro.mjs` |

Hoy esos scripts se ejecutan manualmente o vía `qa.run_paridad_vm` / `qa.run_pack` sin **CAMCP REPORT** orientado a **contratos de datos**.  
Agentes deben interpretar JSON heterogéneo en lugar de un namespace de auditoría de pipeline de datos.

**Fase 3B.2** introduce `data.*`: capa MCP de **orquestación + parsing semántico de datos + CAMCP REPORT** sobre QA existente, **sin reimplementar** mapToPerfil, submit, hydrate ni field-engine.

### 1.2 Qué riesgos reduce en CariHub

| Riesgo | Cómo 3B.2 lo reduce |
|--------|---------------------|
| Campos que se pierden en slim/hydrate | `data.pipeline_status`, `data.hydrate_audit` |
| Nested sectoriales mal persistidos | `data.persist_audit` |
| Drift mapa ↔ schema-index ↔ blocks (443+ subs) | `data.schema_alignment` |
| PrivacyGuard / anti-contaminación en persist | `data.persist_audit` + stages VM en pipeline |
| Merge sin evidencia de contrato de datos | CAMCP REPORT + `intel.parse_report` |
| Debug manual del pipeline registro→público | Un comando MCP por etapa de datos |

### 1.3 Por qué prioridad P0 (post-3B.1)

1. **Complemento natural de parity.*** — parity audita *equivalencia*; data audita *contrato y salud del pipeline*.
2. **Scripts QA ya existen** — 4 motores probados; 3 sin adapter MCP dedicado.
3. **Protege el monolito de datos** — capa más frágil tras paridad visual/render.
4. **Desbloquea 3B.3 arch.*** — findings-mapper compartido entre data y arch.
5. **Prerrequisito de packs pre-merge** — `intel.impact` puede sugerir `data.*` por dominio APP_REGISTRO.

---

## 2. Alcance exacto

### 2.1 Incluido (exclusivo 3B.2)

| Componente | Descripción |
|------------|-------------|
| Namespace `data.*` | **4 tools** MCP (report-only) |
| `camcp/src/data/` | runner, parsers, json-read (patrón `parity/`) |
| `camcp/config/data.config.json` | Mapa tool → qa adapter → script → artefactos JSON |
| Extensión mínima `qa.tools.ts` | Adapters delgados para 3 scripts sin wrapper MCP (§5.2) |
| `aggregateDataReport()` | Extensión Reports Engine |
| `camcp/scripts/smoke-data.mjs` | Smoke dedicado |
| Documentación | Este SPEC + `FASE-3B-2-CIERRE.md` (post-implementación) |

### 2.2 Excluido (explícito)

| Excluido | Fase / motivo |
|----------|----------------|
| Modificar `parity.*` | 3B.1 congelada |
| `arch.*` | 3B.3 |
| `perf.*` | 3C |
| `seo.*`, `ads.*` | 3D |
| CI GitHub Actions | 3E |
| Modificaciones `public/` | Prohibido |
| Conexión Firestore producción | Prohibido |
| Firebase deploy / rules / indexes | Prohibido |
| Reimplementar mapToPerfil, submit, hydrate, field-engine, render-lite | Prohibido |
| Modificar scripts QA CariHub (salvo ticket aparte autorizado) | Prohibido en 3B.2 |
| Nuevo harness Playwright | Prohibido |

### 2.3 Relación con capas existentes

| Capa | Rol | Cambio en 3B.2 |
|------|-----|----------------|
| `qa.run_paridad_*` | Spawn script paridad | **Intacto** |
| `parity.*` | Paridad cross-surface + CAMCP REPORT | **Intacto (congelado)** |
| `qa.run_pack` | Packs dominio | **Intacto**; persist P0 no está en pack registry hoy |
| `data.*` | Contrato pipeline datos + CAMCP REPORT | **Nuevo** |
| `intel.*` | Dominios, impact, parse | Extensión hints opcional en config |

### 2.4 Diferenciación `parity.vm` vs `data.pipeline_status`

Ambos delegan al **mismo script** `qa-paridad-reg-pub-vm.mjs`. **No duplican spawn.**

| Dimensión | `parity.vm` (congelado) | `data.pipeline_status` (propuesto) |
|-----------|-------------------------|-------------------------------------|
| Pregunta que responde | ¿Registro y perfil público son equivalentes? | ¿El pipeline de datos por etapas está sano? |
| Parser | `parity/parsers/vm.ts` | `data/parsers/pipeline.ts` |
| Artefactos foco | failures.json, field parity | `pipeline-summary.json`, stage pass rates |
| Findings IDs | `PARITY-VM-*` | `DATA-PIPE-*` |
| Severidad | Paridad / anti-contaminación | Contrato slim/hydrate / etapas caídas |

**Regla anti-duplicación:** un solo subprocess por invocación; parsers distintos sobre los mismos JSON QA.

---

## 3. Tools propuestas (+4 → total **29**)

Todas **report-only**. **0 write-capable** adicionales.

**Tabla de reutilización obligatoria (Regla 2):**

| Tool | Reutiliza (obligatorio) | Rol de `data.*` |
|------|-------------------------|-----------------|
| `data.pipeline_status` | `qaRunParidadVm` → `qa/report-runner.ts` → `scripts/qa-paridad-reg-pub-vm.mjs` → `reports/aggregator.ts` | Parser semántico pipeline + CAMCP REPORT |
| `data.persist_audit` | `qaRunP0PersistPrivacy` *(nuevo adapter)* → `runQaScript` → `scripts/qa-p0-reg-persist-privacy.mjs` → Reports Engine | Parser pass/fail + CAMCP REPORT |
| `data.hydrate_audit` | `qaRunSubmitHydrate` *(nuevo adapter)* → `runQaScript` → `scripts/qa-mp-submit-hydrate.mjs` → Reports Engine | Parser pass/fail + CAMCP REPORT |
| `data.schema_alignment` | `qaRunValidarSchemas` *(nuevo adapter)* → `runQaScript` → `scripts/validar-schemas-registro.mjs` → Reports Engine | Parser JSON schema report + CAMCP REPORT |

Ninguna tool de la tabla anterior implementa validación de pipeline — **solo delega, parsea y reporta**.

### 3.1 `data.pipeline_status`

| Campo | Valor |
|-------|--------|
| **Capability** | report-only |
| **Delega a** | `qaRunParidadVm()` en `qa.tools.ts` |
| **Script QA** | `scripts/qa-paridad-reg-pub-vm.mjs` |
| **Inputs** | `sector?`, `sub?`, `maxSubs?`, `failFast?` |
| **Artefactos** | `pipeline-summary.json`, `failures.json` |
| **Reutiliza** | `qaRunParidadVm`, `runQaScript`, `aggregateDataReport`, contrato `pipeline-summary.json` QA |
| **No reimplementa** | mapToPerfil, slim, hydrate, field-engine |

**Findings esperados (ejemplos):**

- `DATA-PIPE-001` — etapa map fallida para sub X  
- `DATA-PIPE-002` — slim elimina campos requeridos en contrato  
- `DATA-PIPE-003` — hydrate no reconstruye nested sectorial  

**Propósito:** Reporte CAMCP de salud por etapa: mock → map → slim → hydrate; tasas pass/fail; subs con pipeline roto.

### 3.2 `data.persist_audit`

| Campo | Valor |
|-------|--------|
| **Capability** | report-only |
| **Delega a** | `qaRunP0PersistPrivacy()` *(nuevo adapter delgado en qa.tools.ts)* |
| **Script QA** | `scripts/qa-p0-reg-persist-privacy.mjs` |
| **Inputs** | ninguno (scope fijo P0) |
| **Artefactos** | stdout estructurado; pass/fail arrays en salida del script |
| **Reutiliza** | `runQaScript`, VM/blocks del script QA P0, `aggregateDataReport` |
| **No reimplementa** | bloquesPublicos, PrivacyGuard, nested sectoriales |
| **Propósito** | Auditoría P0 persistencia: bloquesPublicos, nested sectoriales, PrivacyGuard, blocks cargados |

**Findings esperados:**

- `DATA-PERSIST-001` — bloquesPublicos incompletos  
- `DATA-PERSIST-002` — nested sectorial no serializado  
- `DATA-PERSIST-003` — PrivacyGuard no filtra campo privado  

### 3.3 `data.hydrate_audit`

| Campo | Valor |
|-------|--------|
| **Capability** | report-only |
| **Delega a** | `qaRunSubmitHydrate()` *(nuevo adapter delgado)* |
| **Script QA** | `scripts/qa-mp-submit-hydrate.mjs` |
| **Inputs** | ninguno (perfiles mock internos al script) |
| **Artefactos** | pass/fail del script |
| **Reutiliza** | `runQaScript`, VM/submit/hydrate del script QA, `aggregateDataReport` |
| **No reimplementa** | buildUsuarioDoc, normalizarPerfilFirestore, render-lite |
| **Propósito** | Read-path simulado: doc Firestore-like → normalizarPerfilFirestore → cardHTML / vista |

**Findings esperados:**

- `DATA-HYDRATE-001` — campo persistido ausente en hydrate  
- `DATA-HYDRATE-002` — cardHTML no refleja nested perfil  
- `DATA-HYDRATE-003` — preview ruta A vs B divergencia documentada  

### 3.4 `data.schema_alignment`

| Campo | Valor |
|-------|--------|
| **Capability** | report-only |
| **Delega a** | `qaRunValidarSchemas()` *(nuevo adapter delgado)* |
| **Script QA** | `scripts/validar-schemas-registro.mjs` |
| **Inputs** | ninguno (validación global) |
| **Artefactos** | `scripts/validacion-schemas-report.json` *(generado por script QA)* |
| **Reutiliza** | `runQaScript`, validación cruzada del script QA, `aggregateDataReport`, contratos `mapa-registro-categorias.json` / schema-index |
| **No reimplementa** | validación de schemas, mapa, blocks, precios |
| **Propósito** | Gaps mapa-registro-categorias ↔ schema-index ↔ blocks ↔ precios; delta 443 vs mapa |

**Findings esperados:**

- `DATA-SCHEMA-001` — sub en mapa sin schema-index  
- `DATA-SCHEMA-002` — componente resultados sin layout perfil  
- `DATA-SCHEMA-003` — drift count mapa vs index (explicitar delta)  

---

## 4. Arquitectura propuesta

### 4.1 Diagrama

```
Cliente MCP / agente
        │
        ▼
┌───────────────────────────────────────┐
│  data.* tools (data.definitions.ts)   │
│  capability: report-only              │
└───────────────┬───────────────────────┘
                │
                ▼
┌───────────────────────────────────────┐
│  camcp/src/data/                      │
│  runner.ts      → delega qa.tools.ts  │
│  parsers/       → pipeline, persist,  │
│                   hydrate, schema     │
│  json-read.ts   → lee artefactos QA   │
└───────────────┬───────────────────────┘
                │
    ┌───────────┼───────────┐
    ▼           ▼           ▼
qa.tools.ts  Reports Engine  Intelligence Core
(runQaScript) aggregateDataReport  (impact hints)
              parser.ts
                │
                ▼
scripts/qa-*.mjs  (sin modificar en 3B.2)
                │
                ▼
agent-tools/camcp-reports/data.*/{runId}/
  report.md · findings · manifest
```

### 4.2 Flujo obligatorio (contrato de implementación)

```
data.*
  ↓
qa.tools.ts (qaRunParidadVm | qaRunP0PersistPrivacy | qaRunSubmitHydrate | qaRunValidarSchemas)
  ↓
runQaScript → scripts QA existentes
  ↓
parsers/data/* → ReportFinding[]
  ↓
aggregateDataReport() → writeCamcpReport()
  ↓
CAMCP REPORT
```

**Prohibido:** segundo runner paralelo, reimplementación TypeScript de mapToPerfil, parser duplicado de parity sin diferenciación semántica, **lógica propia de validación en `data.*`** (Regla 1).

### 4.3 Reutilización de módulos CAMCP existentes

| Módulo | Uso 3B.2 |
|--------|----------|
| `qa/report-runner.ts` | Spawn, manifest, Path Guard writes |
| `qa/tools.ts` | Adapters spawn (extensión mínima §5.2) |
| `reports/aggregator.ts` | `aggregateDataReport()` |
| `reports/parser.ts` | Detección reportes `data.*` |
| `parity/json-read.ts` | Patrón referencia; extraer helper compartido solo si reduce duplicación real |
| `intelligence.config.json` | `impactQaHints` APP_REGISTRO |
| `policy/*` | Sin cambios estructurales |

### 4.4 Archivos nuevos propuestos (implementación futura — no crear hasta autorización)

```
camcp/
  config/data.config.json
  src/data/
    runner.ts
    json-read.ts
    parsers/
      pipeline.ts
      persist.ts
      hydrate.ts
      schema.ts
  src/tools/
    data.tools.ts
    data.definitions.ts
  scripts/smoke-data.mjs
  docs/FASE-3B-2-CIERRE.md
```

Modificaciones acotadas: `tools/index.ts`, `reports/aggregator.ts`, `reports/parser.ts`, `qa/tools.ts`, `qa.definitions.ts` (3 adapters), `package.json`, `README.md`, `BASELINE-CAMCP.md`.

---

## 5. Reutilización de QA existente

### 5.1 Scripts delegados (sin reescritura)

| Script | Tool data.* | Ya en CAMCP |
|--------|-------------|-------------|
| `scripts/qa-paridad-reg-pub-vm.mjs` | `data.pipeline_status` | Sí — `qa.run_paridad_vm` |
| `scripts/qa-p0-reg-persist-privacy.mjs` | `data.persist_audit` | **No** — requiere adapter |
| `scripts/qa-mp-submit-hydrate.mjs` | `data.hydrate_audit` | **No** — requiere adapter |
| `scripts/validar-schemas-registro.mjs` | `data.schema_alignment` | **No** — requiere adapter |

### 5.2 Extensión mínima capa `qa.*` (permitida en 3B.2)

Agregar **solo adapters delgados** en `qa.tools.ts` + definitions (mismo patrón Fase 2):

| Función propuesta | Script |
|-------------------|--------|
| `qaRunP0PersistPrivacy()` | `scripts/qa-p0-reg-persist-privacy.mjs` |
| `qaRunSubmitHydrate()` | `scripts/qa-mp-submit-hydrate.mjs` |
| `qaRunValidarSchemas()` | `scripts/validar-schemas-registro.mjs` |

**No** ampliar lógica de negocio en TypeScript. **No** duplicar VM context de los scripts `.mjs`.

Opcional (no bloqueante): registrar tools `qa.run_p0_persist`, `qa.run_submit_hydrate`, `qa.run_validar_schemas` para invocación directa bajo nivel. `data.*` delega a las funciones exportadas aunque existan tools qa públicas.

### 5.3 Artefactos y parsers

| Tool | JSON / salida leída | Parser |
|------|---------------------|--------|
| `data.pipeline_status` | `pipeline-summary.json`, `failures.json` | `parsers/pipeline.ts` |
| `data.persist_audit` | stdout + estructura pass/fail del script | `parsers/persist.ts` |
| `data.hydrate_audit` | pass/fail arrays | `parsers/hydrate.ts` |
| `data.schema_alignment` | `validacion-schemas-report.json` | `parsers/schema.ts` |

Reutilizar constantes de severidad de `scripts/qa-paridad-reg-pub/lib/severity.mjs` **por lectura/documentación**, no import runtime cruzado salvo que ya exista patrón en parity.

---

## 6. Impacto en Firestore y datos

### 6.1 Qué toca

| Ámbito | Interacción 3B.2 |
|--------|------------------|
| **Firestore producción** | **Ninguna** — CAMCP no conecta a Firebase |
| **Datos reales usuarios** | **Ninguna** — scripts usan VM + mocks locales |
| **Contratos de persistencia** | **Auditoría** vía VM de `registro-perfil-submit.js`, PrivacyGuard, slim |
| **Schema / mapa / blocks** | **Lectura estática** + validación cruzada |
| **Hydrate read-path** | **Simulación** en Node VM, no lectura Firestore remota |

### 6.2 Side-effects de scripts QA (importante)

| Script | Side-effect conocido | Mitigación SPEC |
|--------|---------------------|-----------------|
| `validar-schemas-registro.mjs` | Escribe `scripts/validacion-schemas-report.json` | Documentar en report; preferir `passOutDir` si script lo soporta en ticket futuro; parser lee artefacto post-run |
| Paridad VM | Escribe en `agent-tools/camcp-reports/` vía `--out` | Ya cubierto por Path Guard |
| P0 persist / submit-hydrate | Solo stdout/consola | Captura en manifest CAMCP |

**3B.2 no modifica reglas Firestore, índices, Authentication ni Storage.**

### 6.3 Pipeline de datos auditado (referencia)

CAMCP **documenta y audita** este flujo; **no lo ejecuta en producción**:

```
blocks → mapToPerfil → buildUsuarioDoc → slimProfileForFirestore
  → [Firestore] → normalizarPerfilFirestore → render-lite
```

Hallazgos `data.*` referencian **contratos** y **etapas**, no UID reales.

---

## 7. Seguridad

### 7.1 Controles obligatorios (sin relajación)

| Control | 3B.2 |
|---------|------|
| **0 write-capable tools** | Obligatorio — total 29, write-capable 0 |
| **data.* report-only** | Las 4 tools |
| **Policy Engine** | Sin relajación de `mode: report-only` |
| **Path Guard** | Escritura CAMCP solo `agent-tools/camcp-reports/` |
| **Command Guard** | Sin cambios; git push/deploy/firebase bloqueados |
| **Ejecución arbitraria** | Allowlist fija de 4 scripts en `data.config.json` |
| **Secretos** | No leer `.env`, tokens, service accounts |
| **Firestore remoto** | Prohibido |
| **Auth / autorización CariHub** | Sin cambios |
| **Rutas públicas nuevas** | Ninguna — CAMCP es MCP local |
| **Scope repo** | Solo `camcp/` en implementación |

### 7.2 Subprocess QA

Reutiliza `runQaScript()` (Fase 2):

- `shell: false`
- `cwd: repoRoot`
- Script path resuelto y verificado con `fs.existsSync`
- Args validados por Zod en tool definitions

### 7.3 Criterio bloqueante de seguridad

Cualquier tool `data.*` que:

- escriba fuera de `agent-tools/camcp-reports/` desde código CAMCP, o  
- acepte path/script arbitrario del usuario, o  
- conecte a Firestore/Firebase producción  

→ **BLOQUEADO HASTA REVISIÓN DE SEGURIDAD**.

---

## 8. Criterios permanentes (respuesta explícita)

| # | Criterio | Evaluación esperada 3B.2 |
|---|----------|--------------------------|
| **1** | ¿Reduce tiempo de desarrollo? | **Sí** — un comando MCP por etapa del pipeline de datos vs parseo manual de 4 scripts heterogéneos |
| **2** | ¿Reduce riesgo de romper CariHub? | **Sí** — read-only/report-only; detecta regresiones persist/hydrate/schema antes de merge |
| **3** | ¿Mejora calidad de arquitectura? | **Sí** — separación clara parity (equivalencia) vs data (contrato pipeline); reutiliza Reports Engine |
| **4** | ¿Detecta errores antes del merge? | **Sí** — CAMCP REPORT con IDs DATA-*; integrable en smoke-data y futuro CI 3E |
| **5** | ¿Escala con miles de archivos, países, ciudades, millones de perfiles? | **Parcial positivo** — schema_alignment global; pipeline/hydrate acotables con `--sub`/`--sector`; no escanea millones de docs Firestore (por diseño) |
| **6** | ¿Mantiene o mejora ciberseguridad? | **Mantiene** — 0 write-capable; sin acceso prod; guards intactos |

---

## 9. Riesgos

| Nivel | Riesgo | Mitigación |
|-------|--------|------------|
| **Bloqueador** | Lógica propia de validación en `data.*` (Regla 1) | Solo parsers de artefactos QA; validación nueva → ecosistema QA primero |
| **Bloqueador** | Tool sin componente reutilizado declarado (Regla 2) | Tabla §3 + config + definitions; bloqueo hasta excepción autorizada |
| **Bloqueador** | Reimplementar mapToPerfil/submit/hydrate en TypeScript | SPEC prohíbe; delegación obligatoria |
| **Bloqueador** | Tool write-capable accidental | Registry + smoke-data policy check |
| **Bloqueador** | Modificar `parity.*` congelado | Scope check PR; solo `camcp/src/data/` + extensions acotadas |
| **Bloqueador** | Conexión Firestore producción | Prohibido en SPEC y code review |
| **Importante** | Solapamiento percibido `parity.vm` vs `data.pipeline_status` | Parsers y findings IDs distintos; documentación §2.4 |
| **Importante** | `validar-schemas` escribe en `scripts/` | Documentar side-effect; ticket futuro `--out` si se requiere aislamiento total |
| **Importante** | Schema count drift (443 vs mapa) | `data.schema_alignment` explicita delta en summary |
| **Importante** | Preview ruta A vs B enmascara hydrate gaps | Finding DATA-HYDRATE-003 |
| **Importante** | Scripts VM lentos en validación global | Bajo demanda; no watchers; timeout heredado report-runner |
| **Mejora futura** | Unificar `json-read.ts` parity/data | Solo si reduce duplicación medible |
| **Mejora futura** | `intel.run_audit_pack` orquestando data+parity | Post-3B.3 o 3E |

---

## 10. Validación propuesta (post-implementación)

### 10.1 Smoke `smoke-data.mjs` (objetivo ≥12 checks)

- 0 write-capable; 29 tools total  
- Namespace `data.*` registrado (4 tools report-only)  
- Delegación a scripts correctos  
- `data.pipeline_status` → qa paridad vm → CAMCP REPORT  
- `data.persist_audit`, `data.hydrate_audit`, `data.schema_alignment` → report PASS/FAIL  
- `intel.parse_report` reconoce reportes `data.*`  
- Registry auto intacto; policy/guards sin diff  
- Smoke verifica Regla 1: ningún import mapToPerfil/field-engine/render-lite en `src/data/`  
- Smoke verifica Regla 2: cada tool `data.*` declara `reuses` en config  

### 10.2 Smokes existentes (regresión)

Todos deben seguir en verde sin modificar contrato `parity.*`:

```bash
cd camcp && npm run build
npm run smoke          # 14
npm run smoke:extended # 27
npm run smoke:qa       # 9
npm run smoke:intel    # 12
npm run smoke:parity   # 14
npm run smoke:data     # nuevo
```

---

## 11. Plan de implementación (1 PR, flujo disciplinado)

| Paso | Entregable |
|------|------------|
| 1 | Rama `feat/camcp-fase-3b2-data` desde `main` @ `d383e4e`+ |
| 2 | Adapters delgados en `qa.tools.ts` (3 scripts) — **sin lógica de validación** |
| 3 | Capa `src/data/` + config + tools — **solo runner + parsers + report** |
| 4 | `aggregateDataReport` + parser |
| 5 | `smoke-data.mjs` + verificación Reglas 1 y 2 en smoke |
| 6 | Docs cierre + baseline update |
| 7 | Validación pre-commit → commit atómico → PR → validación pre-merge |
| 8 | Merge solo con autorización explícita |

**Estimación:** 1 PR atómico, complejidad **media** (patrón clonable de 3B.1).

---

## 12. Métricas objetivo post-3B.2

| Métrica | Valor |
|---------|-------|
| Tools totales | **29** (+4) |
| Write-capable | **0** |
| Namespaces | filesystem, git, qa, intel, parity, **data** |
| Archivos estimados | ~15 nuevos + ~8 modificados (solo `camcp/`) |
| Baseline merge objetivo | `main` @ TBD post-PR |

---

## 13. Aprobación

| Ítem | Estado |
|------|--------|
| SPEC 3B.2 `data.*` (dirección técnica) | **APROBADO** — 2026-07-07 |
| Regla 1 — Delegación obligatoria | **APROBADA** |
| Regla 2 — Reutilización explícita | **APROBADA** |
| Implementación | **Autorizada** — rama separada, flujo disciplinado 3B.1 |
| Modificar `parity.*` | **Prohibido** |

**Checklist SPEC (cerrado):**

- [x] 4 tools propuestas aceptadas  
- [x] Diferenciación parity vs data aceptada  
- [x] Adapters qa mínimos (3) aceptados  
- [x] Side-effect `validacion-schemas-report.json` aceptado o ticket `--out` planificado  
- [x] Orden 3B.2 → 3B.3 → 3E confirmado  
- [x] Reglas permanentes delegación + reutilización incorporadas  

**Próximo paso autorizado:** crear rama `feat/camcp-fase-3b2-data` e implementar según §11 — **sin commit/PR hasta validación pre-commit**.

---

## Referencias

| Documento | Contenido |
|-----------|-----------|
| [FASE-3B-1-PARITY-SPEC.md](./FASE-3B-1-PARITY-SPEC.md) | Patrón arquitectónico referencia (congelado) |
| [FASE-3B-1-CIERRE.md](./FASE-3B-1-CIERRE.md) | Cierre 3B.1 @ `d383e4e` |
| [FASE-3B-SPEC.md](./FASE-3B-SPEC.md) | Dirección técnica 3B completa |
| [BASELINE-CAMCP.md](./BASELINE-CAMCP.md) | Baseline oficial |
| `scripts/qa-p0-reg-persist-privacy.mjs` | Motor persist P0 |
| `scripts/qa-mp-submit-hydrate.mjs` | Motor hydrate |
| `scripts/validar-schemas-registro.mjs` | Motor schema alignment |
