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

Inyección: `sessionStorage` (`carihub_rp_public_preview`) → fallback `page.evaluate`.

Exit code 1 si hay bloqueadores o subs FAIL.

## Fases pendientes

- **C-full** — extender render-map a 443 subs
- **D** — Reporte priorizado
