# Perfil público — CariHub

**Última revisión documental:** 2026-07-07

---

## Propósito

Vista pública del anunciante: ficha, galería, contacto, mapa, banners de perfil, vistas alternativas (según categoría). Es el destino desde resultados y links directos.

**Entry point:** `public/perfil-publico.html` (~8500 líneas — monolito)

---

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `perfil-publico.html` | HTML monolítico + inline logic |
| `perfil-publico-init.js` | Carga Firestore, routing `?id=` |
| `carihub-public-render-lite.js` | Render campos públicos |
| `carihub-field-engine-lite.js` | Motor campos |
| `banner-perfil.js` | Slots banner en perfil |
| `carihub-perfil-sector-visual.js` | Tema sector/LGBT (Fase A 2026-07) |
| `perfil-sector-visual.css` | Estilos tema sector perfil |
| `carihub-resultados-sector.js` | Reutilizado para resolver sector |
| `carihub-sector-sparkles.js` | Destellos |
| `carihub-page-sector-sparkles.css` | CSS sparkles |
| `carihub-adult-pro-background.css` | Fondo pro |
| `carihub-pink-sheen.css` | Base rosa |

---

## Flujo funcional

```
? id= & categoria= & vista=
    → init lee usuarios/{id} (o demo)
    → setVista() según categoría/arquetipo
    → public-render-lite pinta bloques públicos
    → carihub-perfil-sector-visual.sincronizar() en setVista
    → body[data-sector] / data-subtema lgbt
    → banner-perfil hidrata slots
    → CTAs contacto / favoritos / denuncia
```

**Pintura temprana:** `?categoria=` en URL puede aplicar tema antes de carga async.

---

## Dependencias

- Firestore `usuarios/{id}` + rules `isPublicProfile()`
- Mismo contrato nested `*Perfil` que registro
- `registro-schema-index.js` para vistas y sector
- Firebase Storage URLs fotos
- `estadisticas_visitas` (si tracking activo)

---

## Reglas críticas

1. Solo perfiles **aprobados, activos, no vencidos** visibles (rules)
2. **No exponer** campos privados en render-lite
3. Coherencia preview registro ↔ perfil público obligatoria
4. LGBT y adultos: reglas visuales separadas (no mezclar adult-pro con lgbt)
5. Módulo grande — cambios quirúrgicos; evitar refactors amplios sin plan

---

## Estado actual

- Fase A visual: tema sector/LGBT portado desde resultados (scripts nuevos jul 2026)
- Monolito HTML histórico — lógica repartida inline + JS externos
- Integración fondos pro adulto y sectoriales

---

## Pendientes

- Modularizar `perfil-publico.html` (mejora futura — no autorizado en reglas actuales)
- QA visual perfil por sector post Fase A
- SEO canonical por perfil (diseño sin runtime)

---

## Riesgos

| Nivel | Riesgo |
|-------|--------|
| **Bloqueador potencial** | Fuga datos privados si render-lite desincronizado |
| **Importante** | Archivo 8500 líneas — regresiones difíciles de detectar |
| **Importante** | Múltiples `setVista` — tema visual puede desincronizarse |

---

## Validaciones necesarias

- Perfil real post-submit vs preview registro
- Por sector: tema, banners, campos visibles
- Gate `isPublicProfile` con perfil vencido/pendiente
- Paridad registro→render: `scripts/qa-paridad-reg-pub-render.mjs` (Fase C smoke Playwright; PR #113)
- Scripts MP visual: `scripts/qa-*.mjs` por subcategoría

---

## Pendiente de confirmar

- Lista completa de vistas (`vista=`) por categoría
- Si iframe embed desde dashboard usa misma shell o preview separado
