# Conocimiento GPT — CariHub

Documentación maestra para GPT personalizado.

**Generada:** 2026-07-04 · **Última actualización:** 2026-07-14 (freeze Producto Fase 1 marketplace)

**Regla:** solo documenta lo existente. Entradas marcadas «pendiente de confirmar» requieren verificación humana.

**Producto Fase 1 (SSOT):** [PRODUCTO-FASE-1-MARKETPLACE.md](./PRODUCTO-FASE-1-MARKETPLACE.md) — Cariñosas = marketplace de perfiles; mensajería / lives / estados = Future Architecture. Acta: `scripts/ACTA-CONGELAMIENTO-PRODUCTO-FASE-1.md`.

---

## Índice de documentos

| # | Archivo | Dominio |
|---|---------|---------|
| 0 | [PRODUCTO-FASE-1-MARKETPLACE.md](./PRODUCTO-FASE-1-MARKETPLACE.md) | **SSOT producto Fase 1** (marketplace vs Future Architecture) |
| 1 | [ARQUITECTURA-GENERAL-CARIHUB.md](./ARQUITECTURA-GENERAL-CARIHUB.md) | Visión global, stack, reglas operativas |
| 2 | [FIRESTORE-Y-DATOS.md](./FIRESTORE-Y-DATOS.md) | Colecciones, rules, flujos persistencia |
| 3 | [HOME.md](./HOME.md) | Página entrada, sectores, slots |
| 4 | [REGISTRO.md](./REGISTRO.md) | Wizard, blocks, submit, contratos |
| 5 | [RESULTADOS.md](./RESULTADOS.md) | Búsqueda, temas sector, tarjetas |
| 6 | [PERFIL-PUBLICO.md](./PERFIL-PUBLICO.md) | Ficha pública, vistas, tema |
| 7 | [GEOLOCALIZACION.md](./GEOLOCALIZACION.md) | Geo Picker V5, catálogos |
| 8 | [SEO-PROGRAMATICO.md](./SEO-PROGRAMATICO.md) | Plan SEO (diseño, sin runtime) |
| 9 | [SISTEMA-VISUAL.md](./SISTEMA-VISUAL.md) | Tokens, fondos, sparkles, LGBT |
| 10 | [BANNERS-SLOTS-MONETIZACION.md](./BANNERS-SLOTS-MONETIZACION.md) | Slots, funnel, admin, pagos |
| 11 | [LIVES-Y-ESTADOS.md](./LIVES-Y-ESTADOS.md) | Publicaciones, lives, feed |
| 12 | [ADMIN-Y-DASHBOARDS.md](./ADMIN-Y-DASHBOARDS.md) | Dashboard rentero, admin, mensajes |
| 13 | [FIELD-ENGINE-Y-RENDER-LITE.md](./FIELD-ENGINE-Y-RENDER-LITE.md) | Schema, render, pipeline |
| 14 | [CATEGORIAS-Y-SUBCATEGORIAS.md](./CATEGORIAS-Y-SUBCATEGORIAS.md) | Taxonomía, sectores, blocks |
| 15 | [TICKETS-ROADMAP-BACKLOG.md](./TICKETS-ROADMAP-BACKLOG.md) | Backlog 158 ítems, prioridades |

---

## Fuentes canónicas adicionales

- `scripts/MAPA-MAESTRO-CARIHUB.json`
- `scripts/github-issues-master-v2.json` (v2.1.0)
- `.cursor/rules/*.mdc`
- `docs/SISTEMA-VISUAL-CARIHUB.md`
- `scripts/PLAN-MAESTRO-SEO-LANDINGS.json`

---

## Hallazgos transversales importantes

1. **Monolito multipage** — sin bundler; Firebase compat 9.6.1 CDN.
2. **Gap modelo datos** — runtime `usuarios/{uid}` vs diseño futuro `perfiles/{perfilId}`.
3. **Slots huérfanos** — `home_estados`/`home_libe` en UI, no en `firestore.rules` ni `slots-catalog.js`.
4. **SEO sin runtime** — no robots, sitemap, canonical, JSON-LD.
5. **ECO-030 launch blocker** — webhook Stripe / activación automática pendiente.
6. **Dashboard mensajes / lives / estados** — **Future Architecture** respecto a entrega Fase 1 (freeze 2026-07-14); diseño/código pueden existir; no son alcance de launch del marketplace.
7. **Pipeline registro** — anti-contaminación entre arquetipos es contrato crítico.
8. **LGBT vs adult-pro** — temas visuales separados; no mezclar.
9. **QA-REG-PUB integrado** — agente paridad Registro↔Perfil (Fases A+B+C) en `scripts/qa-paridad-reg-pub-*` (PR #113, merge `b09030d`); reportes en `agent-tools/qa-paridad-reports/` (gitignored).
10. **PR #109 abierta** — `feat/platform-resultados-sector-visual` (alcance amplio plataforma); distinto del slice resultados ya mergeado en PR #111.

---

## PRs recientes en `main` (referencia jul 2026)

| PR | Tema | Estado |
|----|------|--------|
| #110 | Home: flujo guiado geo País→Estado→Ciudad | Mergeado |
| #111 | Resultados: pantalla moderna sectorial (slice) | Mergeado |
| #112 | Registro↔perfil público paridad P0 | Mergeado |
| #113 | QA agent paridad registro↔perfil (A+B+C) | Mergeado |
| #109 | Platform: resultados multi-sector + assets visuales | **Abierta** |

---

## Uso recomendado en GPT

1. Subir los 15 archivos + este README como conocimiento.
2. Instrucción sistema sugerida: «Ante dudas, citar pendiente de confirmar; no inventar; respetar globalDoNotTouch y shell dashboard congelada».
3. Actualizar tras cada sprint o merge de PRs estructurales.

---

## No incluido (fuera de alcance)

- Código fuente línea a línea
- Credenciales Firebase
- Datos producción Firestore
- Artefactos QA locales (`agent-tools/` — gitignored)
- Scripts temporales `scripts/_tmp-*.mjs` (gitignored)
