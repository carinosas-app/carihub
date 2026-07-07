# Registro de perfil — CariHub

**Última revisión documental:** 2026-07-07

---

## Propósito

Wizard multipaso para crear/editar perfiles publicadores: selección categoría/subcategoría, campos dinámicos por arquetipo, preview, validación privada, submit a Firestore/Storage.

**Entry point:** `public/registro-perfil.html`

---

## Archivos principales

| Capa | Archivos |
|------|----------|
| Shell | `registro-perfil.html`, `registro-perfil.css`, `registro-perfil-cat-search.css` |
| Wizard | `registro-perfil-wizard.js`, `registro-perfil-cat-search.js` |
| Submit | `registro-perfil-submit.js` |
| Blocks (por sector) | `public/js/data/registro-*-blocks.js`, `registro-*-sub-deltas.js` |
| Índice | `registro-schema-index.js` (~443 subcategorías) |
| Field engine | `carihub-field-engine-lite.js`, `carihub-private-fields-lite.js` |
| Preview | `carihub-registro-public-blocks.js`, preview iframe |
| Geo | `carihub-geo-picker.js` (flujo registro: sin subtítulo «Explora perfiles…») |
| Multi-perfil | `carihub-multi-perfil.js` |
| Adultos | `registro-adultos-escort-blocks.js`, `espectaculo`, `lifestyle`, `pareja`, etc. |

**Variantes:** `registro-perfil2.html` — **pendiente de confirmar** si activa en producción.

---

## Flujo funcional

```
1. Selección categoría/subcategoría (schema-index)
2. Carga blocks del arquetipo (registro-*-blocks.js)
3. field-engine-lite renderiza campos públicos/privados
4. Wizard persiste estado en localStorage
5. Preview iframe (contrato nested *Perfil)
6. Submit → mapToPerfil → usuarios/{uid} + Storage
7. Redirect dashboard o confirmación
```

**Anti-contaminación:** cada arquetipo tiene namespace nested (`escortPerfil`, `doctorPerfil`, etc.); blocks y submit no deben mezclar campos entre arquetipos.

---

## Dependencias

- `registro-schema-index.js` — fuente de verdad taxonomía + arquetipo
- `catalogos-carihub.js`
- Firebase Auth, Firestore, Storage
- `carihub-public-render-lite.js` — coherencia preview vs público
- QA packs: `scripts/qa-*.mjs` por dominio; paridad global `scripts/qa-paridad-reg-pub-*.mjs` (PR #112 P0 persist/privacy, PR #113 agente A+B+C)

---

## Reglas críticas

1. **Contrato blocks → mapToPerfil → preview → render** — cualquier cambio de schema exige QA del pipeline completo
2. **Congelado:** módulos que pasaron auditoría+PR no tocar sin bug demostrado
3. Geo picker en registro: modal país solo «Selecciona tu país» (fix 2026-07-03)
4. Validación datos privados por perfil/categoría (dashboard vision)
5. Sub-deltas (`*-sub-deltas.js`) extienden blocks base sin duplicar pipeline

---

## Estado actual

- Consolidación global en progreso: múltiples sectores nuevos con blocks (automotriz, bienes raíces, comercio, educación, hogar, industria, mascotas, profesionales, salud, tecnología, transporte, gastronomía, bienestar)
- Adultos: packs escort, espectáculo, lifestyle, pareja con blocks dedicados
- Visual: `carihub-adult-pro-background.css` + pink-sheen en registro
- Scripts QA en `scripts/` (submit/hydrate, paridad registro↔perfil, packs por sector)

---

## Pendientes

- Completar cobertura QA todos los sectores nuevos
- Entitlements / gates de pago en registro
- Alinear `registro-perfil2.html` o deprecar
- Consolidación registro global (auditoría `audit-consolidacion-registro-global.mjs`)

---

## Riesgos

| Nivel | Riesgo |
|-------|--------|
| **Bloqueador** | Romper mapToPerfil → datos corruptos en Firestore |
| **Importante** | 443 subcats — drift entre schema-index y blocks |
| **Importante** | Preview iframe ≠ persist → regresión UX |
| **Importante** | localStorage wizard — pérdida estado en refresh parcial |

---

## Validaciones necesarias

- `audit-e2e-submit-hydrate-validation.mjs`
- `audit-*-contract-pipeline.mjs` por arquetipo tocado
- `audit-consolidacion-registro-global.mjs`
- Prueba manual: categoría → preview → submit → perfil público

---

## Pendiente de confirmar

- Lista exacta de arquetipos con blocks 100% completos vs stub
- Estado de femboy pack y otros packs en PRs abiertos
