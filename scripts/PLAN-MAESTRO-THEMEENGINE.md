# PLAN-MAESTRO-THEMEENGINE v1.0.0

**Fecha:** 2026-06-10 · **Estado:** PLAN DE DISEÑO DOCUMENTAL
**Modo:** Solo análisis y documentación. No runtime · no carpetas · no mover archivos · no Firestore · no deploy · no commit · no modifica capas/observaciones existentes.

> Consolida `OBSERVACION-ARQUITECTONICA-THEMEENGINE v1.3.0` en un plan maestro formal (la **referencia y no la modifica**).

> **Principio rector:** ThemeEngine es **presentación controlada**: solo componentes autorizados + tokens de tema; **nunca HTML/CSS/JS libre**. El usuario personaliza dentro de whitelist; Admin aprueba superficies públicas; RenderEngine pinta; FieldEngine aporta datos; la IA solo sugiere (confirma humano). **Borrador ≠ publicado**; toda publicación pública audita y puede requerir revisión.

---

## 1. Inventario actual

| Elemento | Estado | Evidencia |
|---|---|---|
| Temas | Prototipo | 12 clases `body.tema-*` inline en `dashboard-rentero.html` (L35-46): rojo, morado, negro, dorado, azul, verde, arcoiris, trans, femboy, hotel, spa, sexshop — no integrado |
| Tokens | Canónicos | SPEC-SHARED-CORE define `--ch-*` (resolvió `--rosa` divergente) |
| Visión | Observación v1.3.0 | 10 superficies, editor Canva, tokens, plantillas, IA diseño, A11Y, seguridad, rollback, roles, backlog (`autorizadoDiseno:false`) |

**Gaps:** sin ThemeRegistry, sin editor, sin tokens aplicados fuera del prototipo, sin versionado/rollback, sin moderación visual.

---

## 2. Frontera

- **Es ThemeEngine:** tokens de tema, layout dentro de slots autorizados, componentes whitelisted, plantillas, skins por superficie, preview/borrador/publicación visual, historial/rollback.
- **No es ThemeEngine:** datos de negocio (FieldEngine), render final (RenderEngine), cobro/planes (Pagos), moderación de contenido (Admin), mensajería (Messenger).

---

## 3. Módulos internos

ThemeRegistry · TokenResolver (`--ch-*` + overrides limitados) · ComponentWhitelist · TemplateStore (oficial/categoría/personal/corporativa) · VisualEditor (lienzo Canva, drag entre slots) · PreviewRenderer (M/T/E, borrador vs publicado) · DraftStore · VersionHistory/Rollback · A11yGuard · VisualModerationQueue · ThemeIAAdvisor.

---

## 4. Superficies editables (14)

| Superficie | Edita | No edita / aprobación | SEO | Perf | A11Y |
|---|---|---|---|---|---|
| Perfil público | portada, galerías, orden, tokens, widgets | chrome/datos verificación; revisión (adultos exige) | alto | alto | alto |
| Dashboard Perfil | widgets, orden, tokens | privado, publica directo | n/a | — | medio |
| Dashboard Negocio | widgets, tema corporativo, promos | sin aprobación (salvo promo externa) | — | — | — |
| Dashboard Anunciante | layout, widgets | creativos a moderación comercial | — | — | — |
| Dashboard Empresa (futuro) | multi-perfil corporativo | titular/admin | — | — | — |
| Dashboard Operador (futuro) | layout personal (scope) | privado scoped | — | — | — |
| Banners | imágenes, video, textos, botones, layout plantilla | tamaño/slot fijo; **siempre revisión** | — | alto | medio |
| Tarjetas resultados | plantilla, componentes whitelist | card global; parcial (afecta listado) | alto | alto (móvil) | alto |
| Home futura | widgets/promos | **solo admin**; usuario no edita | alto | alto | alto |
| Landings SEO | bloques de plantilla, tokens | contenido canónico/metadatos; catalogo_admin | **crítico** | alto | alto |
| Messenger (futuro) | tema claro/oscuro, densidad, fondo propio | skin del interlocutor; privacidad | n/a | — | alto |
| Interacciones (futuro) | marco story (tokens), overlays oficiales | player live; contenido media revisado | — | — | medio |
| Stories (futuro) | marco/overlay oficial | estructura player | — | — | medio |
| Lives (futuro) | marco/branding oficial | player; moderación live | — | alto | — |

Por superficie también se documenta: publica directo, borrador, clonar, compartir, plantilla, IA, bloqueado, obligatorio, privacidad y seguridad (ver JSON).

---

## 5. Roles (9)

| Rol | Edición visual | Publicación | Clonar | Compartir | Rollback | Límites IA |
|---|---|---|---|---|---|---|
| Visitante | ninguna | no | no | no | no | n/a |
| Perfil independiente | perfil público + dashboard | con revisión (público) | propio/oficial | parcial (futuro) | propio | sugiere, confirma |
| Negocio | + tema corporativo | con revisión | sí | parcial (corporativo) | propio | sugiere |
| Anunciante | + dashboard/creativos | banner requiere admin | sí | parcial | propio | sugiere |
| Empresa (futuro) | multi-perfil corporativo | titular/admin | sí | corporativo | corporativo+perfil | sugiere |
| Operador (futuro) | layout personal (scope) | no | no | no | no | limitado |
| Admin | todas (moderación)+home+defaults | aprueba públicas | sí | intra-admin | forzado | revisa |
| Superadmin | + tokens globales + bloqueo | global | sí | intra-admin | global | revisa |
| Agente IA interno | ninguna (solo sugiere) | **nunca** | no | no | no | sin código; sin aplicar sin confirmación; auditoría |

---

## 6. Ciclos de vida

- **Tema:** crear/elegir → tokens dentro de límites → A11yGuard → borrador → preview → (público: revisión admin) → publicado (versión) → rollback/restaurar default.
- **Plantilla:** oficial (admin, versionada) | categoría (default por subcategoría) | personal (fork a borrador) | corporativa (intra-cuenta) → aplicar/duplicar/restaurar → marketplace (futuro).
- **Borrador visual:** autoguardado → comparar con publicado → solicitar revisión → publicar | descartar | expira (futuro).
- **Publicación visual:** borrador → validación (VE futura) + A11yGuard + sanitización → (pública: VisualModerationQueue) → publicado (snapshot `themeSnapshotId`) → auditoría.

---

## 7. Matrices

### Componente → permitido/prohibido
- **Permitidos:** seccion, columna, grid, spacer, divider, hero_portada, galería, bloque_texto (tipado), lista_servicios, tabla_tarifas, horarios, mapa, badges, cta_contacto, widgets dashboard, banner_slot, result_card_shell.
- **Prohibidos:** editor HTML, CSS libre, scripts, iframes externos, importar HTML crudo, event handlers en atributos, `position:fixed` sobre chrome, z-index arbitrario, `@font-face` arbitrario, URL externa sin validar.

### Tema → tokens → RenderEngine
Tokens `--ch-primary/secondary/accent/background/surface/text/textMuted/border/success/warning/error`, `--ch-font-*`, `--ch-spacing*`, `--ch-radius*`, `--ch-shadow*`. Flujo: ThemeEngine produce `themeSnapshot` (tokens+layout) → RenderEngine pinta sin HTML por categoría → PrivacyGuard. **Única vía de estilo = tokens.**

### Plantilla → superficie → aprobación
oficial→cualquiera = admin · personal→perfil público = revisión · personal→dashboard = directo (privado) · creativo→banner = siempre revisión comercial · plantilla→home = solo admin · plantilla→landing SEO = catalogo_admin.

### IA diseño → acción → aprobación humana
sugerir paleta/orden/plantilla = usuario confirma · generar texto CTA = confirma + moderación si sensible · detectar contraste A11Y = automático (obligatorio, no aplica) · optimizar banner = confirma. **Prohibido:** generar HTML/CSS/JS, aplicar sin confirmación, insertar media sin escaneo, leer chats.

(Las matrices superficie→elementos y rol→permisos están detalladas en las secciones 4 y 5 y en el JSON.)

---

## 8. Políticas

- **Seguridad visual:** sin JS de usuario (crítico) · sin HTML libre sin sanitización · sin CSS peligroso (fixed/z-index/import externo) · solo componentes autorizados · solo tokens · URLs de Storage validado · texto sanitizado · elementos bloqueados por admin inmutables · no superponer chrome · rate-limit (Seguridad MVP).
- **Accesibilidad:** WCAG 2.2 · contraste validado · alt text obligatorio · orden de lectura lógico · foco teclado · no solo color · tamaños táctiles móvil · reduced motion · body ≥16px móvil · respetar zoom.
- **Performance:** Mobile First · Core Web Vitals (LCP/CLS/INP) · lazy loading · peso máximo de media · dimensiones reservadas (anti-CLS) · límite de animaciones.
- **Moderación visual:** superficies públicas → VisualModerationQueue · adultos/sensible → plantillas restringidas + revisión · media escaneada · historial/auditoría obligatorio · rollback admin forzado.

---

## 9. Integraciones

Shared/Core (tokens `--ch-*`) · RenderEngine (consume `themeSnapshot`; PrivacyGuard) · ValidationEngine (valida acciones de tema, futuro) · FieldEngine (datos ≠ tema; `themeSnapshotId`) · App Pública (consume vía RenderEngine) · Registro/Cuenta (estado/plan/edad condiciona) · Dashboards (shell absorbe skins) · Admin (plantillas/defaults/bloqueo/moderación/rollback) · Messenger (tema sistema + preferencias) · Pagos (plan habilita capacidades) · Contratos (vigencia condiciona premium) · Banners (creativos en slots) · Interacciones (stories/live heredan tokens) · SEO (no altera canónico; creativos no indexables) · Agentes IA (ThemeIAAdvisor sugiere, confirma humano) · Seguridad MVP (rate-limit/Turnstile/sanitización) · A11Y (SPEC transversal futura).

---

## 10. Riesgos

| ID | Nivel | Riesgo | Mitigación |
|---|---|---|---|
| TE-R01 | crítico | CSS/HTML/JS libre = XSS y rotura de shell | sin código libre; solo componentes+tokens; sanitización |
| TE-R02 | alto | Personalización antes de RenderEngine = doble HTML | esperar contrato snapshot de RenderEngine |
| TE-R03 | alto | Tema daña CWV (media pesada, CLS) | lazy, peso máximo, dimensiones reservadas |
| TE-R04 | alto | Contraste/A11Y insuficiente | A11yGuard obligatorio + paletas certificadas + TE-IA-04 |
| TE-R05 | alto | Tema público inapropiado (adultos) | plantillas restringidas + VisualModerationQueue |
| TE-R06 | medio | Acoplar tema con datos FieldEngine | separación presentación vs datos |
| TE-R07 | medio | URLs externas en fondos (SSRF/tracking) | solo Storage validado/biblioteca |
| TE-R08 | medio | IA aplica cambios sin confirmación / genera código | IA solo sugiere; deny HTML/CSS/JS; auditoría |
| TE-R09 | medio | Costo almacenamiento/moderación de media | límites por plan/superficie + optimización |
| TE-R10 | bajo | Inconsistencia tema por categoría | defaults por subcategoría desde catálogo congelado |

---

## 11. Dependencias

- **Congeladas:** Shared/Core 1.0.0 · RenderEngine 1.0.0 · ValidationEngine 1.1.0 · FieldEngine 1.0.1 · Dashboards 1.0.0 · Messenger 1.0.0 · Seguridad MVP 1.0.0 · Catálogo 1.0.0.
- **Planes:** APP-PUBLICA · REGISTRO-CUENTA · DASHBOARDS · ADMIN · PAGOS-CONTRATOS · BANNERS · INTERACCIONES · AGENTES-IA.
- **Observación base:** ThemeEngine v1.3.0.
- **Precondiciones:** contrato snapshot RenderEngine · migración usuarios→perfiles · Dashboards shell estable · ComponentWhitelist + ThemeRegistry · acciones de tema en ValidationEngine.

---

## 12. Estructura ideal futura (lógica; sin crear carpetas)

Capa ThemeEngine: ThemeRegistry + TokenResolver + ComponentWhitelist + TemplateStore + VisualEditor + PreviewRenderer + DraftStore + VersionHistory + A11yGuard + VisualModerationQueue + ThemeIAAdvisor. Separación: ThemeEngine (presentación) ⟂ FieldEngine (datos) ⟂ RenderEngine (pintado) ⟂ Admin (moderación) ⟂ Pagos (capacidades por plan).

---

## 13. Rutas sugeridas

- **Usuario:** `/cuenta/tema`, `/cuenta/perfil/editor`, `/cuenta/banners/:id/editor`, `/cuenta/tema/historial`.
- **Admin:** `/admin/themeengine/plantillas`, `/admin/themeengine/defaults`, `/admin/themeengine/moderacion`, `/admin/themeengine/tokens-globales`.

---

## 14. Orden recomendado de implementación

1. **P0** — ThemeRegistry + TokenResolver (`--ch-*`) + ComponentWhitelist (deny código libre) → cierra TE-R01/R06.
2. **P1** — Temas a nivel tokens en perfil/dashboard (sin editor) vía RenderEngine snapshot → cierra TE-R02.
3. **P1** — DraftStore + PreviewRenderer + VersionHistory/Rollback + A11yGuard → cierra TE-R03/R04.
4. **P1** — TemplateStore (oficiales/categoría/personal) + defaults por subcategoría → cierra TE-R10.
5. **P2** — VisualEditor tipo Canva (slots autorizados) + VisualModerationQueue + límites por plan → cierra TE-R05/R09.
6. **P2** — ThemeIAAdvisor (sugerencias, confirma humano, auditoría) → cierra TE-R08.
7. **P3** — Temas messenger/interacciones/stories/lives + backlog (marketplace/corporativo/multiidioma/A-B testing).

---

## 15. Procedencia

**Sí procede** `PLAN-MAESTRO-THEMEENGINE.md/json` — entregados. La observación v1.3.0 ya tiene visión profunda pero no es un plan maestro accionable; este plan formaliza superficies, roles, matrices, ciclos de vida y orden de implementación, manteniendo todas las restricciones de seguridad/A11Y, sin iniciar SPEC ni runtime.

**Siguientes pasos sugeridos:** `SPEC-THEMEENGINE` (post RenderEngine runtime) · `SPEC-A11Y` transversal · `ADR-TOKENS-TEMA` (mapa `--ch-*` ↔ superficies).

> No modifica la observación v1.3.0 ni capas/planes existentes (solo los referencia). Sin cambios en producción/Firestore/deploy/commit.
