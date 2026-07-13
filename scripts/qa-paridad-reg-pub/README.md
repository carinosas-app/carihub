# QA Agent — Paridad Registro ↔ Perfil Público

## Fase A (implementada)

Análisis estático: catálogo 443 subcategorías, `FieldContract`, gaps blocks ↔ schema-index.

```bash
# Catálogo completo
node scripts/qa-paridad-reg-pub-static.mjs

# Filtros
node scripts/qa-paridad-reg-pub-static.mjs --sector salud
node scripts/qa-paridad-reg-pub-static.mjs --sub medicos-generales

# Salida custom
node scripts/qa-paridad-reg-pub-static.mjs --out agent-tools/qa-paridad-reports/manual-run
```

**Salida:** `agent-tools/qa-paridad-reports/<runId>/`
- `catalog.json` — catálogo completo
- `field-inventory.json` — todos los FieldContract
- `gaps.json` — gaps blocks vs schema
- `summary.md` — resumen humano

Reportes en `.gitignore`.

## Decisiones (v1.0)

| # | Decisión |
|---|----------|
| 4 | Playwright: `page.evaluate` (sin tocar prod) |
| 5 | CI: A+B; Fase C nightly/manual |
| 8 | Reportes en `agent-tools/qa-paridad-reports/` gitignored |

## Fase B (implementada)

Pipeline VM: mock → mapToPerfil → buildUsuarioDoc → slim → hydrate → PrivacyGuard.

```bash
# Smoke (subs individuales)
node scripts/qa-paridad-reg-pub-vm.mjs --sub medicos-generales
node scripts/qa-paridad-reg-pub-vm.mjs --sub dominatrix
node scripts/qa-paridad-reg-pub-vm.mjs --sub unicorns

# Filtros
node scripts/qa-paridad-reg-pub-vm.mjs --sector salud
node scripts/qa-paridad-reg-pub-vm.mjs --max-subs 30

# Salida custom
node scripts/qa-paridad-reg-pub-vm.mjs --out agent-tools/qa-paridad-reports/manual-b
```

**Salida adicional Fase B:**
- `pipeline-summary.json` — resumen + stages por sub
- `failures.json` — fallos detallados
- `pipeline-detail.json` — detalle completo por sub
- `summary-phase-b.md` — resumen humano

Exit code 1 si hay subs FAIL o bloqueadores privacy/contaminación.

## Fase C (implementada — smoke v1)

Render browser: hydrated Fase B → sessionStorage → `perfil-publico.html` → asserts DOM + screenshots.

```bash
# Smoke obligatorio (3 subs)
node scripts/qa-paridad-reg-pub-render.mjs

# Una sub
node scripts/qa-paridad-reg-pub-render.mjs --sub medicos-generales

# Salida custom
node scripts/qa-paridad-reg-pub-render.mjs --out agent-tools/qa-paridad-reports/manual-c
```

**Prerequisito:** Playwright instalado; el script levanta servidor estático local en `127.0.0.1:5199` si `QA_BASE` no está definido.

**Salida Fase C:**
- `render-summary.json`
- `failures-render.json`
- `render-detail.json`
- `summary-phase-c.md`
- `screenshots/{sub}/full-desktop.png`, `hero.png`, `section-derstack.png`

Inyección: `sessionStorage` (`carihub_rp_public_preview`) → fallback `page.evaluate` + parche `applyProfileToPage`.

Exit code 1 si hay bloqueadores o subs FAIL.

### Fase C — modo `--strict` (medición producción)

Mide el runtime real **sin** enriquecimiento de payload ni parche post-render del agente.

```bash
# Smoke strict (3 subs) — salida fija en fase-c-strict/
node scripts/qa-paridad-reg-pub-render.mjs --strict

# PP-02 matrix (35 subs frozen)
node scripts/qa-paridad-reg-pub-render.mjs --matrix
node scripts/qa-paridad-reg-pub-render.mjs --matrix --strict

# Integridad matriz (gates pre-render)
node scripts/qa-paridad-reg-pub-render.mjs --integrity-only
node scripts/qa-paridad-reg-pub/pp02-matrix-integrity.test.mjs

# Pre-commit pack (no commit)
node scripts/qa-paridad-reg-pub/pp02-precommit.mjs --render-strict
```

**Strict:** solo `sessionStorage` → `leerPreviewRegistro` → `aplicarPerfilDesdeRegistro` → `setVista` → render.  
**Salida extra:** `strict-vs-normal.json` (vs baseline normal por defecto).

**PP-02 SSOT:** `scripts/qa-paridad-reg-pub/lib/render-matrix.json` (35 cases) + `render-map.json` (DOM contracts).

## PP-02 — launch matrix gates (pre-commit)

| Gate | Resultado esperado |
|------|-------------------|
| Matrix integrity | 35 cases, shells 8/8, sectors 15/15 |
| `parity.static` | 443/443 PASS |
| `parity.vm` | 426 PASS / **17 FAIL** (PP-01 clusters, no privacy blockers) |
| `parity.render --matrix --strict` | **35/35 PASS** (0 blockers, 0 privacy DOM) |
| Sync `render-map` ↔ matrix | determinista (2× mismo SHA256) |

```bash
node scripts/qa-paridad-reg-pub/sync-render-map-from-matrix.mjs
node scripts/qa-paridad-reg-pub/pp02-matrix-integrity.test.mjs
node scripts/qa-paridad-reg-pub/pp02-precommit.mjs --render-strict
```

### `parity.vm` 18 → 17 (PP-01 freeze vs PP-02)

| Sub que dejó de fallar | Campo | Causa |
|------------------------|-------|-------|
| `refaccionarias` | `lineasRefacciones` | **Cobertura mock/QA corregida** en `SUB_OVERRIDES` (`lineasRefacciones: ['OEM','Premium']`). PP-01 clasificaba esto como *QA_CONTRACT_GAP* (pack D automotriz): el pipeline no recibía valor mock para probar map→persist→hydrate. Con el override, las 3 etapas pasan; no se excluyó el campo ni se ocultó un defecto de runtime. |

Los **17 FAIL** restantes siguen mapeados a clusters PP-01 documentados:

| Cluster PP-01 | Subs (17 total) |
|---------------|-----------------|
| Venue private (`telefonoContacto`, `licenciaOperacion`, `documentos`) | `antro restaurant bar`, `antro restaurant bar lgbt`, `cabinas glory holes`, `cine xxx`, `club sw`, `hotel motel`, `masajes`, `spa` |
| `CANONICAL_ALIAS` (edecan/modelos) | `edecan`, `modelos` |
| Retail private | `sex shop` |
| Automotriz pack D QA gap | `instaladores-de-audio-car-multimedia`, `tecnicos-en-a-c-automotriz`, `tecnicos-en-baterias` |
| Gastronomía alcohol private | `bares`, `cantinas-vinotecas`, `cervecerias` (`permisoVentaAlcohol` / cadena private) |

## Fases pendientes

- **C-full** — extender render-map a 443 subs (rechazado para launch; usar proxy manifest PP-02)
- **D** — Reporte priorizado
