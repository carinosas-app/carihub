## Summary

Segunda entrega de `feat/registro-femboy-pack` **después de PR #88** (`ae5f126`). Este PR añade los packs de registro y render público para pareja/lifestyle (A1–A4), bloques transversales (viajes/desplazamiento, dotados), sincronización de schema A1–A4 y el gate QA `persona_acompanante`.

**Base:** `main`  
**Compare:** `feat/registro-femboy-pack`  
**HEAD:** `00cb4e261073b1097146154c9295eee6430531fa`  
**Alcance:** 21 commits · 45 archivos · +8 494 / −272 líneas

> **Sin deploy incluido.** Solo cambios de registro, schema, render público y scripts QA. No hay pipeline de despliegue ni cambios de infraestructura en este PR.

---

## Contexto post-PR #88

PR #88 ya incorporó en `main` el tramo inicial de esta rama (Singles, VIP, escort, femboy, deltas base). **Este PR no repite ese trabajo.** Cubre exclusivamente los commits posteriores al merge-base `ae5f126`:

| Área | Contenido |
|------|-----------|
| **A1 — Pareja base** | Shell `pareja_grupo` |
| **A2 — Swinger** | Blocks, validación, persistencia/preview, render público |
| **A3 — Unicorn** | Alineación `persona_lifestyle`, blocks, persist/preview/render, QA cierre |
| **A4 — Cuckold/Hotwife** | Blocks pareja `cuckold_hotwife`, persist/preview/render, QA cierre |
| **Transversal** | Viajes/desplazamiento (acompañantes), delta dotados, delta lesbians, Tom Boy/Tom Fem |
| **Schema** | Sync deltas A1–A4 en `config-registro-adultos-schema.json` + reporte |
| **QA** | Pack `persona_acompanante` (401 checks + regresiones) |

---

## Resumen técnico por fases

### Fase 0 — Packs escort / transversales (pre-A1)
- Tom Boy / Tom Fem heredando Escort
- Bloque **viajes y desplazamiento** para perfiles acompañante
- Delta completo **lesbians**
- QA cierre **dotados**

### A1 — Pareja base (`pareja_grupo`)
- Shell base de formulario, índices y wiring mínimo para packs pareja

### A2 — Pareja swinger
- **A2.1** Datos y validación (blocks + field engine)
- **A2.2** Persistencia y preview wizard
- **A2.3** Render público (`perfil-publico.html`, `carihub-public-render-lite.js`)

### A3 — Unicorn (`persona_lifestyle`)
- Alineación arquetipo unicorns como `persona_lifestyle`
- Blocks/validación → persist/preview → render público
- QA cierre dedicado (`qa-unicorn-cierre.mjs`)

### A4 — Cuckold/Hotwife (`pareja_grupo` / `cuckold_hotwife`)
- Blocks/validación → persist/preview → render público
- QA cierre dedicado (`qa-cuckold-hotwife-cierre.mjs`)
- Reglas Cursor: `.cursor/rules/registro-pareja-cuckold-hotwife.mdc`

### Schema sync (PASO 2)
- `meta.fieldRegistry`: +60 campos y toggles de visibilidad A1–A4
- `node scripts/validar-schemas-registro.mjs` → **0 errores**

### QA pack `persona_acompanante` (PASO 3)
- 4 scripts: `qa-persona-acompanante.{mjs,persist.mjs,render.mjs,cierre.mjs}`
- Gate maestro con regresiones de todos los packs anteriores

### Integración con `main`
- Merge commit `00cb4e2` integra `origin/main` (PR #87 hotwife + PR #88) sin conflictos

---

## Archivos principales tocados

| Dominio | Archivos | Notas |
|---------|----------|-------|
| Runtime registro | `carihub-registro-public-blocks.js`, wizard/submit/preview, `carihub-viajes-desplazamiento.js` | +1 054 líneas netas en blocks |
| Data blocks | `registro-adultos-{escort,lifestyle,pareja}-blocks.js`, schema/ui index | Definición por subcategoría |
| Render público | `perfil-publico.html`, `carihub-public-render-lite.js`, preview HTML | Diff HTML grande en perfil público |
| Schema/config | `config-registro-adultos-schema.json`, mapa, matriz UI, validator, report | Fuente de verdad |
| QA | 18 scripts `scripts/qa-*.mjs` | Gates automatizados |
| Rules | 3 `.cursor/rules/registro-*.mdc` | Specs congeladas por pack |

---

## QA ejecutado (pre-PR)

Los comandos siguientes se ejecutaron **localmente sobre HEAD** `00cb4e261073b1097146154c9295eee6430531fa` (post-merge con `main`, pre-push del drift del validator):

```bash
node scripts/validar-schemas-registro.mjs
node scripts/qa-persona-acompanante-cierre.mjs
```

**Resultados:**

| Gate | Resultado |
|------|-----------|
| `validar-schemas-registro.mjs` | **PASS** — `totalErrores: 0`, 1 advertencia conocida |
| `qa-persona-acompanante-cierre.mjs` | **PASS** — 12/12 checks, 401 pack checks |
| Regresiones incluidas en cierre | viajes, dotados, unicorn, pareja-grupo, cuckold-hotwife, schema |

**Advertencia schema (no bloqueante):**
`[COMPONENTE_UI_NO_REGISTRADO] ProfileLayoutAdultos` ausente en `meta.componentesUI` para `persona_lifestyle`.

---

## Riesgos conocidos

1. **Scope amplio (~8.5k LOC)** — Review por fases recomendado (A2 → A3 → A4 → schema → QA).
2. **`perfil-publico.html`** — Diff grande; validar secciones condicionales por subcategoría en smoke manual.
3. **Anti-contaminación hotwife** — `persona_lifestyle` hotwife ≠ `pareja_grupo` cuckold_hotwife; los QA cubren esto pero conviene verificar render de tarjetas vs perfil.
4. **Solapamiento conceptual con PR #87** — Hotwife en resultados ya en `main`; confirmar que no hay regresión con blocks A4.
5. **Nombre de rama legacy** — `feat/registro-femboy-pack` incluye más que femboy; el título del PR aclara el alcance real.

---

## Checklist de revisión

- [ ] Wizard registro: `pareja_grupo` swinger — borrador, preview, campos obligatorios
- [ ] Wizard registro: unicorn (`persona_lifestyle`) — persist + preview
- [ ] Wizard registro: `cuckold_hotwife` — persist + preview; sin mezclar con hotwife lifestyle
- [ ] Perfil público: secciones nuevas visibles/ocultas según toggles de visibilidad
- [ ] Viajes/desplazamiento en perfil acompañante escort
- [ ] Delta dotados y lesbians sin regresión en subcategorías existentes
- [ ] Tarjetas resultados (`resultados.css`) — badges/labels coherentes post-#87
- [ ] Schema: `node scripts/validar-schemas-registro.mjs` → 0 errores
- [ ] QA gate: `node scripts/qa-persona-acompanante-cierre.mjs` → PASS

---

## Fuera de alcance / excluido de este PR

- **`public/js/dashboard-rentero-nav.js`** — cambios locales de indentación en mocks de mensajes; **no commiteados** (guardados en `git stash`, sin `stash pop`).
- **Archivos untracked** — preview maestro interactivo, docs planes/monetización, ticket QA ad-hoc, `agent-tools/`; **no incluidos** en la rama remota.
- **Deploy** — este PR no incluye despliegue ni cambios de infraestructura.

---

## Test plan (reproducible)

```bash
# Gate maestro (incluye regresiones)
node scripts/qa-persona-acompanante-cierre.mjs

# Schema
node scripts/validar-schemas-registro.mjs

# Gates individuales (opcional, ya cubiertos por cierre)
node scripts/qa-viajes-desplazamiento.mjs
node scripts/qa-dotados.mjs
node scripts/qa-pareja-grupo-base.mjs
node scripts/qa-pareja-swinger.mjs
node scripts/qa-unicorn-cierre.mjs
node scripts/qa-cuckold-hotwife-cierre.mjs
```

Smoke manual: ver comentarios en `scripts/qa-persona-acompanante-cierre.mjs` y `scripts/qa-cuckold-hotwife-cierre.mjs`.
