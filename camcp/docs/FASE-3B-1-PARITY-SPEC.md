# CAMCP Fase 3B.1 — `parity.*` Specification

**Estado:** SPEC **APROBADO** — implementación **BLOQUEADA** hasta autorización explícita de rama  
**Baseline código:** `main` @ `b365c11` (22 tools, 0 write-capable)  
**Baseline documental:** `4c2594c` + Roadmap Maestro aprobado  
**Fecha:** 2026-07-07  
**Aprobación SPEC:** 2026-07-07 — 3 tools parity (visual pospuesta)  
**Orden oficial:** 3B.1 parity → 3B.2 data → 3B.3 arch → 3E CI  

---

## Regla permanente aplicable

> Toda nueva tool debe justificar claramente el valor que aporta y reutilizar la arquitectura existente. No se implementarán herramientas que dupliquen QA, contratos, renderizadores o lógica ya existente.

---

## 1. Objetivo de 3B.1

### 1.1 Qué problema resuelve

CariHub mantiene un pipeline crítico **Registro → Persistencia → Normalización → Resultados → Perfil público** repartido en múltiples scripts QA (`qa-paridad-reg-pub-*`, `qa-fondos-static`) invocados manualmente. Fase 2 expone adapters `qa.run_paridad_*`, pero:

- No existe namespace semántico de **auditoría de paridad** en la capa Intelligence.
- Los reportes QA son JSON/markdown heterogéneos; no todos producen **CAMCP REPORT** unificado.
- `intel.impact` no puede sugerir un pack de paridad coherente sin namespace dedicado.
- Agentes/desarrolladores deben conocer nombres internos `qa.run_*` en lugar de un contrato de auditoría de paridad.

**Fase 3B.1** introduce `parity.*`: capa MCP de **orquestación + parsing + CAMCP REPORT** sobre QA existente, sin reejecutar lógica de negocio.

### 1.2 Qué riesgos reduce en CariHub

| Riesgo | Cómo 3B.1 lo reduce |
|--------|---------------------|
| Campos registrados que no aparecen en perfil público | `parity.vm` + `parity.render_strict` |
| Gaps blocks ↔ schema (443 subs) | `parity.static` |
| Preview ruta A vs B enmascara fallos producción | `parity.render_strict` (--strict) |
| Anti-contaminación entre arquetipos | `parity.vm` (stages privacy/contamination) |
| Regresión visual CSS/HTML en páginas clave | `parity.visual` (opcional, ver §4) |
| Merge sin evidencia de paridad | CAMCP REPORT + `intel.parse_report` |

### 1.3 Por qué prioridad P0

1. **Mayor ROI inmediato** — reutiliza 100% scripts QA Fase B/C ya probados en smokes.
2. **Protege el pipeline más frágil** del monolito (registro/render).
3. **Desbloquea 3B.2 data.*** — parser parity maduro alimenta findings-mapper compartido.
4. **Prerrequisito lógico de 3E CI** — smoke:parity será gate de paridad pre-merge.
5. **Patrón adapter validado** — idéntico a `intel.run_module` → `qa.tools.ts`.

---

## 2. Alcance exacto

### 2.1 Incluido (exclusivo 3B.1)

| Componente | Descripción |
|--------------|-------------|
| Namespace `parity.*` | 3–4 tools MCP |
| `camcp/src/parity/` | Adapters + parsers QA → CamcpReport |
| `camcp/config/parity.config.json` | Mapa tool → script QA + rutas JSON esperadas |
| `camcp/scripts/smoke-parity.mjs` | Smoke dedicado |
| Documentación | Este SPEC + `FASE-3B-1-PARITY-CIERRE.md` (post-implementación) |

### 2.2 Excluido (explícito)

| Excluido | Fase |
|----------|------|
| `data.*` | 3B.2 |
| `arch.*` | 3B.3 |
| `perf.*` | 3C |
| `seo.*`, `ads.*` | 3D |
| CI GitHub Actions | 3E |
| Modificaciones `public/` | Prohibido |
| Firestore / Firebase | Prohibido |
| Nuevo harness Playwright | Prohibido |
| Reimplementar mapToPerfil / render-lite | Prohibido |

### 2.3 Relación con `qa.run_paridad_*` existentes

**`qa.*` permanece intacto.** `parity.*` no reemplaza ni depreca tools Fase 2.

| Capa | Rol |
|------|-----|
| `qa.run_paridad_*` | Adapter bajo nivel → spawn script → manifest |
| `parity.*` | Adapter semántico → delega a `qa.tools.ts` → **parsea JSON QA** → **CAMCP REPORT** |

Duplicación de spawn: **no** — `parity.*` llama funciones exportadas de `qa.tools.ts` (mismo patrón que `intel.run_module`).

---

## 3. Arquitectura propuesta

### 3.1 Diagrama

```
Cliente MCP / agente
        │
        ▼
┌───────────────────────────────────────┐
│  parity.* tools (definitions.ts)      │
│  capability: report-only              │
└───────────────┬───────────────────────┘
                │
                ▼
┌───────────────────────────────────────┐
│  camcp/src/parity/                    │
│  runner.ts      → delega qa.tools       │
│  parsers/       → gaps, pipeline,     │
│                   render, fondos      │
│  aggregator.ts  → CamcpReport         │
└───────────────┬───────────────────────┘
                │
    ┌───────────┼───────────┐
    ▼           ▼           ▼
qa.tools.ts  Reports Engine  Intelligence Core
(runQaScript) (writer,       (impact hints,
              schema)        list_domains)
                │
                ▼
scripts/qa-paridad-reg-pub-*.mjs  (sin modificar)
scripts/qa-fondos-static.mjs      (sin modificar)
                │
                ▼
agent-tools/camcp-reports/parity.*/{runId}/
  report.md · findings.json · summary.json
  + symlinks/copias refs a artefactos QA en qa.run_*/{runId}/
```

### 3.2 Integración Intelligence Core (3A)

| Componente 3A | Uso en 3B.1 |
|---------------|-------------|
| `intelligence.config.json` | Extender `impactQaHints` con módulos parity |
| `intel.impact` | Sugerir `parity.vm` / `parity.render_strict` según dominios `APP_REGISTRO`, `APP_PUBLICA` |
| `intel.list_domains` | Exponer anclas registro/resultados/perfil |
| `intel.parse_report` | Extender parser para namespace `parity.*` |
| `intel.graph` | Sin cambios estructurales; nodos QA paridad ya presentes |

**Opcional 3B.1:** `intel.run_module` alias documentado hacia parity (no implementar alias en 3B.1 para evitar scope creep).

### 3.3 Reports Engine

| Artefacto | Rol |
|-----------|-----|
| `reports/schema.ts` | `CamcpReport`, `ReportFinding`, severidades |
| `reports/writer.ts` | `writeCamcpReport()`, formato CAMCP REPORT markdown |
| `reports/parser.ts` | Extender `parseLastReport` para `parity.*` |
| `reports/aggregator.ts` | Nuevo `aggregateParityReport()` — mapea JSON QA → findings |

**Salida dual:** QA script escribe en `camcp-reports/qa.run_*/` (Fase 2); parity escribe **capa semántica** en `camcp-reports/parity.*/` con referencias a evidencia QA.

### 3.4 Reutilización `qa.*`

```typescript
// Patrón obligatorio (pseudocódigo)
import { qaRunParidadStatic, qaRunParidadVm, ... } from '../tools/qa.tools.js';

export function parityStatic(repoRoot, config, opts) {
  const qaResult = qaRunParidadStatic(repoRoot, config, opts);
  const findings = parseParidadStaticOutputs(qaResult);
  const report = aggregateParityReport({ module: 'parity.static', findings, qaResult });
  const paths = writeCamcpReport(repoRoot, config, 'parity.static', report);
  return { ok: report.status === 'PASS', report, reportPaths: paths, qaResult };
}
```

### 3.5 Flujo de datos (pipeline CariHub auditado)

```
                    parity.static
                         │
                         ▼
              schema-index (443 subs) + gaps blocks
                         │
                    parity.vm
                         │
         mock → finalize → mapToPerfil → buildUsuarioDoc
              → slim → normalizarPerfilFirestore → PrivacyGuard
                         │
                 parity.render_strict
                         │
         sessionStorage → perfil-publico.html → DOM asserts
         (--strict = sin parches agente)
                         │
                  parity.visual (opc.)
                         │
         qa-fondos-static → CSS/HTML chains páginas clave
```

**Nota:** CAMCP no ejecuta el pipeline en TypeScript; lo ejecuta el script QA en VM/browser. CAMCP solo orquesta y parsea.

### 3.6 Límites de seguridad

| Límite | Garantía |
|--------|----------|
| Escritura | Solo `agent-tools/camcp-reports/` via Path Guard |
| Subprocess | Allowlist fija en `parity.config.json` → mismos scripts que `qa.*` |
| Firestore | Sin acceso — QA VM usa mocks, render usa sessionStorage local |
| Runtime prod | Sin deploy; Playwright solo localhost (script QA existente) |
| Tools | 0 write-capable; todas `report-only` |

### 3.7 Confirmaciones anti-duplicación

| Pregunta | Respuesta |
|----------|-----------|
| ¿Duplica QA existente? | **No** — delega spawn a `qa.tools.ts` |
| ¿Duplica renderizadores? | **No** — no importa `carihub-public-render-lite.js` |
| ¿Duplica contratos? | **No** — lee outputs de `parity-checker`, `gap-analyzer`, etc. |
| ¿Toca runtime CariHub? | **No** — solo `camcp/` + reportes gitignored |

---

## 4. Tools propuestas

### 4.1 Resumen (alcance aprobado)

| Tool | ¿Necesaria? | Veredicto |
|------|-------------|-----------|
| `parity.static` | Sí | **APROBADA — implementar** |
| `parity.vm` | Sí | **APROBADA — implementar** |
| `parity.render_strict` | Sí | **APROBADA — implementar** |
| `parity.visual` | — | **POSPUESTA** — mejora futura (ver §4.6) |

**Total tools post-3B.1 (aprobado):** 22 + 3 = **25**, **0 write-capable**.

---

### 4.2 `parity.static`

| Campo | Valor |
|-------|-------|
| **Propósito** | Auditoría estática catálogo 443 subs, FieldContracts, gaps blocks ↔ schema-index |
| **Capability** | `report-only` |
| **Entradas** | `sector?: string`, `sub?: string` |
| **Salidas** | `CamcpReport`, `reportPaths[]`, `qaResult` (manifest + refs) |
| **Script QA** | `scripts/qa-paridad-reg-pub-static.mjs` via `qaRunParidadStatic()` |
| **JSON parseados** | `gaps.json`, `field-inventory.json`, `catalog.json` |
| **Reporte** | `agent-tools/camcp-reports/parity.static/{runId}/report.md` |

**Valor vs `qa.run_paridad_static`:** parser de gaps → findings con severidad; CAMCP REPORT; integrable en `intel.parse_report`.

---

### 4.3 `parity.vm`

| Campo | Valor |
|-------|-------|
| **Propósito** | Paridad campo-a-campo mock → map → slim → hydrate + privacy + contamination |
| **Capability** | `report-only` |
| **Entradas** | `sector?: string`, `sub?: string`, `maxSubs?: number`, `failFast?: boolean` |
| **Salidas** | `CamcpReport` con findings por stage/sub |
| **Script QA** | `scripts/qa-paridad-reg-pub-vm.mjs` via `qaRunParidadVm()` |
| **JSON parseados** | `pipeline-summary.json`, `failures.json`, `pipeline-detail.json` |
| **Reporte** | `agent-tools/camcp-reports/parity.vm/{runId}/report.md` |

**Cubre:** Registro → Persistencia (simulada) → Normalización → contratos nested.

---

### 4.4 `parity.render_strict`

| Campo | Valor |
|-------|-------|
| **Propósito** | Paridad DOM perfil público en ruta producción (--strict) |
| **Capability** | `report-only` |
| **Entradas** | `sub?: string`, `compareWith?: string` |
| **Salidas** | `CamcpReport`, refs screenshots, `strict-vs-normal.json` |
| **Script QA** | `scripts/qa-paridad-reg-pub-render.mjs --strict` via `qaRunParidadRenderStrict()` |
| **JSON parseados** | `render-summary.json`, `failures-render.json`, `strict-vs-normal.json` |
| **Reporte** | `agent-tools/camcp-reports/parity.render_strict/{runId}/report.md` |

**Cubre:** Perfil público render, mismos campos visibles, privacidad DOM.

**Limitación conocida:** render-map cubre subset smoke (C-full 443 pendiente) — reportar `coveragePercent` en summary.

---

### 4.5 `parity.visual` (evaluación de necesidad)

| Campo | Valor |
|-------|-------|
| **Propósito propuesto** | Consistencia visual CSS/HTML páginas clave + cadena adult-pro/sector-pro |
| **Capability** | `report-only` |
| **Entradas** | ninguna (o `pages?: string[]` futuro) |
| **Script QA** | `scripts/qa-fondos-static.mjs` via `qaRunFondosStatic()` |
| **Extra read-only** | Opcional: grep `data-sector` refs en `carihub-resultados-sector.js` vs `carihub-perfil-sector-visual.js` (sin ejecutar render) |

#### ¿Es necesaria como tool separada?

| Argumento a favor | Argumento en contra |
|-------------------|---------------------|
| Namespace parity unifica auditoría visual bajo paridad | `qa.run_fondos_static` ya existe |
| CAMCP REPORT con severidades fondos | Mismo script = riesgo percebido de duplicación |
| Encaja en pack pre-merge "visual + render" | Temas resultados↔perfil mejor cubiertos por render_strict + vm |

**Veredicto SPEC (revisado 2026-07-07):**

- **`parity.visual` POSPUESTA** — no implementar en 3B.1.
- **Motivo:** el objetivo principal de 3B.1 es la cadena crítica Registro → Persistencia → Normalización → Resultados → Perfil Público; `static`, `vm` y `render_strict` cubren ese valor sin complejidad adicional.
- **Reactivar cuando:** temas sectoriales más maduros; overrides visuales estabilizados; valor claro para reporte visual independiente (vs `qa.run_fondos_static` existente).

---

## 5. Validaciones específicas CariHub

### 5.1 Cadena auditada

```
Registro (blocks + wizard)
    ↓ mapToPerfil / buildUsuarioDoc
Persistencia Firestore (slim — simulada en VM)
    ↓ normalizarPerfilFirestore
Resultados (card contract + sector theme)
    ↓
Perfil Público (render-lite + strict path)
```

### 5.2 Matriz tool → validación

| Validación | parity.static | parity.vm | parity.render_strict | parity.visual |
|------------|:-------------:|:---------:|:--------------------:|:-------------:|
| Mismo perfil mock | — | ✓ mock por sub | ✓ hydrated B→C | — |
| Mismos campos registro→persist→hydrate | ✓ gaps estáticos | ✓ field parity | ✓ DOM needles | — |
| Mismo tema visual sector/adult | — | parcial | parcial | ✓ CSS chains |
| Banners/slots en páginas clave | — | — | parcial DOM | ✓ páginas banner |
| Contratos por subcategoría | ✓ FieldContract | ✓ per-sub stages | ✓ render-map | — |
| Privacidad (no leak campos privados) | — | ✓ PrivacyGuard | ✓ render-privacy-checker | — |
| Anti-contaminación arquetipos | — | ✓ contamination stage | — | — |

### 5.3 Lo que 3B.1 NO valida (delegado a 3B.2+)

- Firestore live / reglas reales
- Comparación Resultados card HTML vs perfil ficha pixel-perfect en producción
- Slots `home_estados`/`home_libe` vs rules (→ 3D ads o extensión parity)
- 443 subs render C-full (pendiente QA upstream)

---

## 6. Seguridad obligatoria

### 6.1 Criterios permanentes

| Criterio | Evaluación 3B.1 |
|----------|-----------------|
| ¿Reduce tiempo de desarrollo? | **Sí** — un comando parity vs 3 scripts manuales + lectura JSON |
| ¿Reduce riesgo de romper CariHub? | **Sí** — paridad pre-merge en pipeline crítico |
| ¿Mejora arquitectura? | **Sí** — capa semántica sin duplicar QA |
| ¿Detecta errores antes del merge? | **Sí** — propósito central |
| ¿Escala miles archivos / millones perfiles? | **Parcial** — escala en 443+ subs y scope `--sub`; no datos live |
| ¿Mantiene/mejora ciberseguridad? | **Sí** — 0 write-capable; mismos guards |

### 6.2 Checklist seguridad

| Check | 3B.1 |
|-------|------|
| 0 write-capable tools | ✓ Obligatorio — 3–4 tools `report-only` |
| Sin acceso Firestore producción | ✓ QA VM mock; render localhost |
| Sin ejecución arbitraria | ✓ Allowlist `parity.config.json` |
| Sin comandos destructivos | ✓ Command Guard sin cambios |
| Sin secretos/tokens | ✓ |
| Path Guard intacto | ✓ Sin modificar `path-guard.ts` |
| Command Guard intacto | ✓ Sin modificar `command-guard.ts` |
| Policy Engine intacto | ✓ Sin modificar `permissions.ts` |
| Separación CAMCP ↔ CariHub | ✓ Solo `camcp/` |

---

## 7. Diseño de reportes

### 7.1 Formato CAMCP REPORT

```markdown
# CAMCP REPORT

| Campo | Valor |
|-------|-------|
| Módulo | parity.vm |
| Estado | FAIL |
| Severidad máxima | IMPORTANTE |
| Run ID | 2026-07-07T14-30-00 |
| Git commit | abc1234 |
| Duración | 12450 ms |

## Resumen

Pipeline VM: 1/1 sub FAIL (dominatrix) — contamination stage.

## Hallazgos

### IMPORTANTE — PARITY-VM-001
- **Mensaje:** sub dominatrix: field `swingerPerfil` present after map (contamination)
- **Evidencia:** agent-tools/camcp-reports/qa.run_paridad_vm/.../failures.json
- **Recomendación:** Review mapToPerfil branch for dominatrix

## QA delegado

- Tool: qa.run_paridad_vm
- Exit code: 1
- Artefactos: pipeline-summary.json, failures.json
```

### 7.2 Severidades

| Severidad | Origen típico |
|-----------|---------------|
| `BLOQUEADOR` | Privacy leak, contamination cross-arquetipo |
| `IMPORTANTE` | Field parity FAIL, render strict FAIL |
| `WARNING` | Gap blocks estático no bloqueante, fondos legacy gradient |
| `INFO` | Cobertura parcial, subs skipped |
| `PASS` | Sin hallazgos |

Mapeo desde JSON QA via `scripts/qa-paridad-reg-pub/lib/severity.mjs` (reutilizar constantes donde existan).

### 7.3 Evidencia

| Tipo | Ubicación |
|------|-----------|
| CAMCP REPORT | `camcp-reports/parity.*/{runId}/report.md` |
| Findings machine | `findings.json` |
| Summary | `summary.json` |
| QA raw | `camcp-reports/qa.run_*/{runId}/` (referenciado, no duplicado) |
| Screenshots | Referencia path en render_strict |

### 7.4 Integración `intel.parse_report`

Extender `reports/parser.ts`:

- Detectar último run `parity.*` además de `qa.*` / `intel.*`
- Devolver `ParsedReportSummary` con findings deserializados de `findings.json`
- Smoke: `intel.parse_report` tras `parity.vm` en `smoke-parity.mjs`

---

## 8. Smokes necesarios

### 8.1 Nuevo script: `smoke-parity.mjs`

| # | Check | Valida |
|---|-------|--------|
| 1 | `policy-write-capable` | 0 write-capable (22+N tools) |
| 2 | `policy-capabilities` | parity.* = report-only |
| 3 | `registry-server` | Auto registry intacto |
| 4 | `parity-namespace` | 3–4 tools registradas |
| 5 | `parity.static-delegation` | Llama qaRunParidadStatic, no script path libre |
| 6 | `parity.static-report` | report.md + findings.json existen |
| 7 | `parity.vm(abogados)` | exit delegado, CAMCP REPORT |
| 8 | `parity.render_strict(abogados)` | --strict pasado, strict-vs-normal ref |
| 9 | `parity.visual` (si implementada) | delega fondos, report formato |
| 10 | `intel.parse_report` | parsea último parity.* |
| 11 | `reports-engine-format` | Cabecera `# CAMCP REPORT` |
| 12 | `path-guard-reports` | Solo camcp-reports |

**Target:** 11–12 checks PASS.

### 8.2 Compatibilidad smokes existentes

| Smoke | Impacto 3B.1 |
|-------|--------------|
| `npm run smoke` | Actualizar conteo tools (25–26); policy check dinámico |
| `npm run smoke:extended` | Sin cambios estructurales guards |
| `npm run smoke:qa` | Sin cambios — qa.* intacto |
| `npm run smoke:intel` | Sin cambios — intel.* intacto |
| `npm run smoke:parity` | **Nuevo** en `package.json` |

**Regla:** smokes existentes deben seguir PASS sin modificar scripts QA.

---

## 9. Plan de implementación

### 9.1 Rama propuesta (cuando se autorice)

`feat/camcp-fase-3b1-parity`

### 9.2 Etapas

| Etapa | Entregable | PR |
|-------|------------|-----|
| **3B.1.0** | `parity.config.json`, docs, smoke skeleton, `tools/index.ts` wire vacío | Doc/config PR o inicio rama |
| **3B.1.1** | `parity.static` + parser gaps + smoke checks 5–6 | Commit atómico |
| **3B.1.2** | `parity.vm` + parser pipeline + smoke check 7 | Commit atómico |
| **3B.1.3** | `parity.render_strict` + parser render + smoke check 8 | Commit atómico |
| ~~**3B.1.4**~~ | ~~`parity.visual`~~ | **POSPUESTO** — mejora futura |
| **3B.1.4** | Cierre: README, BASELINE update, `FASE-3B-1-CIERRE.md`, smokes full, PR | PR separado |

### 9.3 Archivos nuevos (implementación futura)

```
camcp/
  config/parity.config.json
  src/parity/
    runner.ts
    parsers/
      static.ts
      vm.ts
      render.ts
      visual.ts          # opcional
    aggregator.ts
  src/tools/
    parity.tools.ts
    parity.definitions.ts
  scripts/smoke-parity.mjs
  docs/FASE-3B-1-PARITY-SPEC.md    # este documento
  docs/FASE-3B-1-CIERRE.md         # post-implementación
```

### 9.4 Archivos modificados (mínimo)

```
camcp/src/tools/index.ts           # PARITY_TOOL_DEFINITIONS
camcp/src/reports/parser.ts        # parse parity findings
camcp/src/reports/aggregator.ts    # aggregateParityReport()
camcp/config/intelligence.config.json  # impactQaHints parity
camcp/package.json                 # smoke:parity
camcp/README.md                    # tools count
```

**Sin modificar:** `server.ts`, guards, `public/`, scripts QA.

---

## 10. Riesgos

| Nivel | Riesgo | Mitigación |
|-------|--------|------------|
| **Bloqueador absoluto** | Reimplementar pipeline mapToPerfil en TypeScript | Prohibido en SPEC; delegar qa VM |
| **Bloqueador absoluto** | Tool write-capable accidental | Registry + smoke policy |
| **Bloqueador absoluto** | Spawn script fuera de allowlist | `parity.config.json` fijo |
| **Importante** | Perceived duplication qa vs parity | Documentar roles; parity = CAMCP REPORT layer |
| **Importante** | Playwright lento/flaky en CI | 3E nightly; smoke local subset `--sub abogados` |
| **Importante** | render-map partial coverage | Reportar `coveragePercent`; no inflar PASS |
| **Importante** | `fondos_static ok=false` heredado | No bloqueante 3B.1; ticket QA independiente |
| **Importante** | Parser drift si JSON QA cambia | Contract test en smoke; version field en parity.config |
| **Mejora futura** | parity.visual sector cross-check | 3B.1.4 opcional o 3B.2 |
| **Mejora futura** | C-full 443 subs render | Upstream QA; parity reporta gap |
| **Mejora futura** | `parity.run_pack` orquestador | intel.run_audit_pack Fase 4 |

---

## 11. Criterios de aceptación (cierre 3B.1)

- [ ] 25–26 tools, **0 write-capable**
- [ ] `parity.static`, `parity.vm`, `parity.render_strict` operativos
- [ ] CAMCP REPORT en cada run parity.*
- [ ] `intel.parse_report` soporta parity.*
- [ ] smoke + extended + qa + intel + **smoke:parity** PASS
- [ ] Solo `camcp/` modificado
- [ ] Sin cambios scripts QA / public / Firestore

---

## 12. Decisiones (registro de aprobación)

| # | Decisión | Estado |
|---|----------|--------|
| 1 | Aprobar SPEC 3B.1 como dirección técnica | **APROBADO** 2026-07-07 |
| 2 | Implementar `parity.static`, `parity.vm`, `parity.render_strict` | **APROBADO** |
| 3 | Posponer `parity.visual` | **APROBADO** |
| 4 | Rama `feat/camcp-fase-3b1-parity` desde `main` | **PENDIENTE** — autorización explícita |
| 5 | Iniciar código | **BLOQUEADO** — hasta confirmar rama |
| 6 | PR / merge / deploy | **PROHIBIDO** hasta entrega pre-PR |

### Pre-PR obligatorio (cuando se implemente)

- [ ] Archivos creados/modificados listados
- [ ] Diff revisable
- [ ] `npm run build`
- [ ] `npm run smoke` (14+ checks, tools=25)
- [ ] `npm run smoke:extended` (27/27)
- [ ] `npm run smoke:qa` (9/9)
- [ ] `npm run smoke:intel` (12/12)
- [ ] `npm run smoke:parity` (nuevo)
- [ ] Criterios permanentes §6 revalidados
- [ ] Solo `camcp/` · 0 write-capable

---

## 13. Referencias

- [CAMCP-ROADMAP-MAESTRO.md](./CAMCP-ROADMAP-MAESTRO.md)
- [FASE-3B-SPEC.md](./FASE-3B-SPEC.md)
- [BASELINE-CAMCP.md](./BASELINE-CAMCP.md)
- [FASE-3A-INTELLIGENCE-CORE.md](./FASE-3A-INTELLIGENCE-CORE.md)
- `scripts/qa-paridad-reg-pub/README.md`
- `camcp/src/tools/qa.definitions.ts`

---

**Estado:** SPEC **APROBADO** — implementación **bloqueada** hasta autorización explícita de rama `feat/camcp-fase-3b1-parity`
