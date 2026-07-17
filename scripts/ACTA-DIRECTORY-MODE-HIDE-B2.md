# Acta — Directory Mode Hide B2 (Home / Perfil público / Registro)

| Campo | Valor |
|-------|-------|
| **Versión acta** | 1.1.0 (cierre pre-commit) |
| **Marca** | Cariñosas |
| **Fase** | Directory Mode Phase B — slice **B2** |
| **Fecha** | 2026-07-17 |
| **Estado** | **APPROVED WITH CONDITIONS** (implementado; pendiente PR/integración) |
| **Repo** | CariHub |
| **Rama de trabajo** | `feat/directory-mode-hide-b2` |
| **Base** | `main` @ `dbe73d70494f370821afab242fa4f846b124d0f9` (post-merge B0+B1) |
| **SSOT producto** | `docs/gpt-knowledge/PRODUCTO-FASE-1-MARKETPLACE.md` |
| **Motor** | `public/js/directory-mode.js` (único; sin segundo flag) |

---

## Objetivo

Eliminar la **exposición pública** de Future Architecture fuera del dashboard (Home, Perfil público, Registro perfil, Registro banner), **sin borrar** código social ni alterar inventario comercial (`*_estados` / `*_libe`), Results, pagos, monetización, Firebase o Firestore schema.

---

## Superficies cubiertas

| Superficie | Acciones B2 |
|------------|-------------|
| **Home** | Hide CTA/modal mensajes; bloqueo `?abrir=mensajes`; gate `abrirInbox` / compose |
| **Perfil público** | Excluir contacto `msg`; hide nav Mensajes; hide Estados/Lives/feed/grat stubs |
| **Registro perfil** | Hide `#ctMensajesInternos`; persist `mensajeInternoActivo` / `mensajesInternosActivo` = **false** |
| **Registro banner** | Hide switch «Mensaje interno»; persist `contactoPublico.mensajeInternoActivo` = **false** |

Contactos públicos Fase 1 (WhatsApp, teléfono, Telegram, correo, redes) **no** se alteran (salvo exclusión de `msg` bajo Directory Mode).

---

## Archivos modificados (implementación)

- `public/js/directory-mode.js`
- `public/index.html`
- `public/js/home-ui.js`
- `public/js/home-mensajes.js`
- `public/perfil-publico.html`
- `public/js/perfil-contactos.js`
- `public/js/perfil-enlaces.js`
- `public/registro-perfil.html`
- `public/js/registro-perfil-wizard.js`
- `public/js/registro-perfil-preview.js`
- `public/registro-banner.html`

Documentación / gobernanza de este cierre:

- `scripts/ACTA-DIRECTORY-MODE-HIDE-B2.md` (este archivo)
- `docs/gpt-knowledge/PRODUCTO-FASE-1-MARKETPLACE.md` (B0+B1 integrado; B2 pendiente PR; siguiente = Launch Readiness)
- `docs/gpt-knowledge/TICKETS-ROADMAP-BACKLOG.md` (nota **REG-SYNTAX-P0**)

QA helpers (opcionales en el commit/PR; no son runtime):

- `scripts/smoke-directory-mode-b2.mjs`
- `scripts/smoke-directory-mode-b2-browser.mjs`
- `scripts/smoke-directory-mode-b2-contacts.mjs`

---

## Flag y rollback

| Pieza | Valor |
|-------|-------|
| Default | **Directory Mode ON** |
| Helper B2 | `CarihubDirectoryMode.allowInternalMessaging()` (= `!isDirectoryMode()`) |
| Rollback QA | `?futureSocial=1` o `?directoryMode=0` **solo** hosts permitidos (localhost / `127.0.0.1` / LAN / `file:` / `preview=1&hub=1`) |
| Producción | Override **ignorado** |
| Nota QA | Preferir URLs limpias (`/perfil-publico?…`, no `*.html?…` — `serve` 301 puede dropear query) |

---

## Persistencia

- **Nuevos** registros de perfil/banner bajo Directory Mode: mensaje interno **forzado a false** (no basta ocultar UI).
- **No** se migran ni reescriben perfiles/banners existentes.
- **No** hay migraciones destructivas ni cambio de schema Firestore.
- **No** hay cambios Firebase (rules, indexes, Functions, Hosting deploy).

---

## Código social preservado

Scripts messenger / lives / estados / home-mensajes **siguen en el árbol**. Solo se ocultan/gaten entradas. Dashboard B0+B1 permanece vigente. Slots banner `*_estados` / `*_libe` intactos (smoke B2 `noBannerSlotsTouched`).

---

## QA (cierre pre-commit 2026-07-17)

| Prueba | Resultado |
|--------|-----------|
| `node --check` JS B2 tocados (7) | **OK** |
| `scripts/smoke-directory-mode-b2.mjs` | `failCount 0` |
| `scripts/smoke-directory-mode-b0b1.mjs` | `failCount 0` |
| Browser ON / OFF / back-ON (Home, Perfil, Registro, Banner) | **OK** (Home CTA hide; perfil nav/feed; registro/banner toggle hide; rollback restaura) |
| Spot-check contactos DEMO `vista=escort` (fixture sellado `__demo`) | **OK** `failCount 0` — ver abajo |

### Spot-check contactos (evidencia)

Fixture: `/perfil-publico?vista=escort` + sello QA `__demo=true` / `__id=demo-escort` (el objeto DEMO es `const` de script y **no** fija `__demo` en HTML — gap preexistente del fixture; el smoke no cambia lógica de contactos).

| Modo | msg | Nav Mensajes | wa | tel | tg/gmail | feed | JS B2 nuevo |
|------|-----|--------------|----|-----|----------|------|-------------|
| ON | ausente | ausente | visible `wa.me` | visible `tel:` | visibles | hidden | ninguno |
| OFF (`futureSocial=1`) | reaparece | reaparece | OK | OK | OK | visible | — |
| back-ON | ausente otra vez | ausente | — | — | — | hidden | — |

ON: 8 contactos visibles (wa/tg/ig/fb/of/x/tel/gmail); **sin** `msg`. Sin hueco de lista vacía.

### Confirmaciones de alcance

- Home sin entrada a inbox en ON (CTA/modal gated; `?abrir=mensajes` no abre).
- Perfil sin `msg`, Mensajes, Estados/Lives/feed en ON.
- Registro perfil / banner: UI hide + persist false (smokes estáticos `wizardForcesFalse` / `bannerForcesFalse`).
- Rollback QA restaura Future Architecture.
- Sin cambios Firebase / Firestore / Results / pagos / monetización.

---

## Aislamiento SyntaxError preexistente (P0 ≠ B2)

| Campo | Evidencia |
|-------|-----------|
| **Error exacto** | `SyntaxError: Unexpected token 'function'` |
| **Archivo / línea** | `public/js/carihub-private-fields-lite.js` **línea ~806** (`function bindPasswordAccessFields`) — CDP `line:805` 0-based / Node `--check` reporta `:806` |
| **Carga** | Se dispara al abrir `/registro-perfil` (script listado en el HTML) |
| **Main limpio** | Reproducido con HTML de `origin/main` (sin `directory-mode.js` en la página) |
| **Sin Directory Mode** | `hasDirectoryModeScript: false`, `hasCarihubDirectoryMode: false` — **mismo** SyntaxError |
| **B2 causa** | **No**. B2 **no modifica** `carihub-private-fields-lite.js` |
| **Clasificación** | **P0 Launch Readiness independiente** — ticket documental `REG-SYNTAX-P0` en `TICKETS-ROADMAP-BACKLOG.md` |
| **Acción en B2** | **No corregir** en el commit/PR B2; no mezclar fix de Registro con Directory Mode |

---

## Riesgos conocidos

| Nivel | Ítem |
|-------|------|
| **Condición / P0 aparte** | SyntaxError preexistente en Registro (`carihub-private-fields-lite.js` ~806) |
| **Importante (fixture)** | `DEMO.*` en `perfil-publico.html` no marca `__demo:true` → `contactLinks` vacío hasta sello; no es regresión B2 |
| **Mejora futura** | Exponer `window.DEMO` o fijar `__demo`/`__id` en fixtures estáticos |
| **OK** | Un solo motor; inventarios banner intactos; contactos públicos preservados bajo DM |

---

## Rollback

1. QA local: `?futureSocial=1` / `?directoryMode=0` en host permitido.  
2. Revertir commits del PR B2.  
3. **No** requiere Firebase.

---

## Prohibido en este slice

- Fix del SyntaxError de Registro (`carihub-private-fields-lite.js`)  
- Deploy / Firebase / rules / Functions  
- Borrar código social  
- Results, pagos, monetización, SEO programático  

---

## Estado de cierre

**APPROVED WITH CONDITIONS** — listo para **commit atómico** (implementación + acta + SSOT + nota REG-SYNTAX-P0 ± smokes) + PR cuando se autorice.

*Acta B2 v1.1.0 — cierre pre-commit 2026-07-17*
