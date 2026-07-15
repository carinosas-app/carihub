# Arquitectura general — CariHub

**Última revisión documental:** 2026-07-14  
**Fuente:** código en repo + `scripts/MAPA-MAESTRO-CARIHUB.json` + reglas `.cursor/rules/`  
**Producto Fase 1:** [PRODUCTO-FASE-1-MARKETPLACE.md](./PRODUCTO-FASE-1-MARKETPLACE.md)

---

## Propósito

CariHub (marca Cariñosas) es una plataforma multipágina (monolito frontend estático). En **Fase 1** opera como **marketplace de perfiles**: directorio, registro, resultados, perfil público, dashboard de anunciantes, banners y contacto vía métodos públicos. Mensajería interna, estados y lives existen como **Future Architecture** (no alcance de entrega Fase 1). Corre sobre **Firebase** (Hosting, Firestore, Auth, Storage, Functions) con proyecto **`carihub-app`**.

---

## Archivos principales

| Área | Ruta |
|------|------|
| Hosting root | `public/` |
| Config Firebase | `firebase.json`, `.firebaserc`, `firestore.rules`, `firestore.indexes.json`, `storage.rules` |
| Functions | `functions/index.js`, `functions/payments/` |
| Init Firebase cliente | `public/js/carihub-core.js` |
| Mapa arquitectónico | `scripts/MAPA-MAESTRO-CARIHUB.json` |
| Auditoría global | `scripts/AUDITORIA-ARQUITECTONICA-GLOBAL-CARIHUB.json` (referenciado en mapa) |
| Reglas operativas IA | `.cursor/rules/*.mdc` (8 archivos) |
| Scripts/specs | `scripts/` (actas, SPEC, QA, tickets JSON) |
| Documentación cambios | `docs/cambios/`, `docs/SISTEMA-VISUAL-CARIHUB.md` |

**Páginas HTML de producción (entry points verificados):**

- `public/index.html` — Home
- `public/registro-perfil.html` — Registro de perfil
- `public/resultados.html` — Resultados
- `public/perfil-publico.html` — Perfil público
- `public/dashboard-rentero.html` — Dashboard anunciante
- `public/registro-banner.html` — Funnel publicidad/banners

**No desplegados en hosting** (ignorados en `firebase.json`): `public/preview/**`, `index-legacy.html`, backups.

---

## Flujo funcional (alto nivel)

```
Home (búsqueda + sectores)
    → Resultados (?categoria, geo)
        → Perfil público (?id, vista, categoria)
Registro perfil (wizard) → Firestore usuarios + Storage
Dashboard rentero → gestión perfiles, banners, mensajes, solicitudes
Registro banner → solicitudes_anuncios → configuracion_publicidad
```

No hay SSR ni bundler de frontend en producción: HTML + JS plano cargado por `<script>`.

---

## Dependencias

- **Firebase JS compat 9.6.1** (app, auth, firestore, storage) vía CDN en páginas principales
- **Catálogos geo estáticos:** `public/paises.js`, `estados.js`, `ciudades.js`
- **Índice de registro:** `registro-schema-index.js` → alimenta field-engine, resultados, registro
- **Functions** para pagos, vencimiento de perfiles, activación de productos

---

## Reglas críticas (operativas)

De `.cursor/rules/`:

1. **Disciplina operativa** — verificar con herramientas antes de afirmar “funciona”; diffs pequeños; no romper contratos.
2. **Arquitectura producción** — cambios estructurales requieren plan por fases y autorización.
3. **Firebase MCP** — producción solo lectura; deploy solo con autorización explícita.
4. **Dashboard mensajes** — shell 3 columnas **congelada**; mensajes **nunca mezclados** entre perfil/banner; rail izquierdo = activos.
5. **Evidencia objetiva** — preferir MCP/Git/QA sobre análisis estático solo.

**Congelado (no rediseñar sin autorización):**

- Layout 3 columnas `dashboard-rentero.html`
- Pipeline registro: blocks → field-engine → submit → preview → render-lite (anti-contaminación entre arquetipos)

---

## Estado actual

| Módulo | Estado (mapa) |
|--------|-----------------|
| APP_PUBLICA | PARCIAL_MEZCLADA — Home/Resultados/Perfil operativos en monolito |
| APP_REGISTRO | MEZCLADA_EN_HOME — wizard en `registro-perfil.html` |
| APP_DASHBOARD | PARCIAL_MEZCLADA — UI pro con MOCK en preview |
| APP_MESSENGER | CONGELADA_DISENO_SIN_RUNTIME completo |
| APP_BANNERS | PARCIAL_REAL — slots + solicitudes |
| APP_SEO | OBSERVACION — diseño sin runtime |
| SHARED_CORE | PARCIAL_DISPERSO — field-engine, render-lite, schema-index |

**Gap principal documentado:** producción usa `usuarios/{uid}` monolítico; diseño futuro contempla hub `usuarios` + `perfiles/{perfilId}`.

**Trabajo visual en `main` (jul 2026):** fondos pro adulto (`carihub-adult-pro-background.css`), temas sectoriales en resultados/perfil, home geo guiado (PR #110), slice resultados sectorial (PR #111). PR #109 (`feat/platform-resultados-sector-visual`) sigue **abierta** con alcance más amplio.

**QA interno:** agente paridad registro↔perfil público (`scripts/qa-paridad-reg-pub-static.mjs`, `qa-paridad-reg-pub-vm.mjs`, `qa-paridad-reg-pub-render.mjs`) — merge PR #113; no requiere deploy Firebase.

---

## Pendientes

- Migración modelo multi-perfil / hub (`TICKET-001`, `TICKET-003`)
- Queries server-side en resultados (`BLK-04` en specs)
- SEO runtime (robots, sitemap, canonical)
- Unificación visual Home con tokens Perfil/Resultados (`docs/SISTEMA-VISUAL-CARIHUB.md`)
- Messenger runtime completo (diseño congelado, implementación parcial)

---

## Riesgos

| Nivel | Riesgo |
|-------|--------|
| **Importante** | Monolito HTML grande (`perfil-publico.html` ~8500 líneas) — difícil mantener |
| **Importante** | Filtrado client-side en resultados — escala y seguridad de datos |
| **Importante** | Divergencia modelo datos diseño vs runtime |
| **Mejora futura** | Sin build step — sin tree-shaking ni typecheck global |

---

## Validaciones necesarias

- `npm run` scripts de QA en `scripts/` según dominio tocado
- Gates de contrato: `scripts/qa-*.mjs` por dominio; paridad global `scripts/qa-paridad-reg-pub-*.mjs`
- Fondos CSS: `node scripts/qa-fondos-static.mjs` (sin browser)
- Firebase rules: sintaxis + emulador antes de deploy
- Playwright/browser QA para flujos visuales (cuando Chrome/Playwright disponible en entorno)

---

## Pendiente de confirmar

- Páginas admin de producción exactas (existen referencias en mapa; no todas verificadas en este scan)
- Alcance final de PR #109 vs trabajo ya mergeado (#111) y deploy producción post-cambios visuales
- Si `registro-perfil2.html` sigue en uso activo
