# Veredicto arquitectónico final — CariHub

| Campo | Valor |
|-------|-------|
| **Versión** | 1.0.0 |
| **Fecha** | 2026-06-09 |
| **Modo** | Solo análisis y documentación |

Acompaña a: [`AUDITORIA-ARQUITECTONICA-GLOBAL-CARIHUB.md`](./AUDITORIA-ARQUITECTONICA-GLOBAL-CARIHUB.md) · [`MAPA-MAESTRO-CARIHUB.md`](./MAPA-MAESTRO-CARIHUB.md) · [`MATRIZ-MODULARIZACION-CARIHUB.md`](./MATRIZ-MODULARIZACION-CARIHUB.md)

---

## PARTE 8 — Recomendación final

### Qué debe quedarse definitivamente

**En Home** — Hero, buscador geo, grids categoría/sector, trust pills, slots publicitarios (solo render), menú legal + puerta 18+, CTA→Resultados.

**En Resultados** — Filtro geo, lista de tarjetas (ResultCard), paginación, banner lateral. *La consulta debe migrar a server-side.*

**En Perfil** — Cabecera de perfil, galería, contacto WhatsApp, banner inline. *Es la página canónica para SEO.*

### Módulos mezclados actualmente

`index.html` concentra **6 módulos**: Home + Registro + Dashboard + Pagos + Banners + Interacciones (favoritos). Además: tokens visuales dispersos (`dashboard-rentero`, `home-vcards`, `--rosa` roto), `firebaseConfig` duplicado x5, y catálogo de producción desalineado del diseño.

### Qué separar primero (orden ideal de construcción)

| # | Módulo | Por qué primero |
|---|--------|-----------------|
| 1 | **SHARED/Core** (config, catálogo, geo, tokens) | Habilita todo lo demás; elimina x5 firebaseConfig |
| 2 | **Resultados server-side** | Riesgo de escalabilidad crítico hoy |
| 3 | **Registro/Wizard** fuera de Home | Saca datos sensibles (INE) del bundle público |
| 4 | **Dashboard shell** | Tras migración perfiles |
| 5 | **Admin** + RBAC fase 2 | Seguridad y cap 150 |

### Qué puede esperar

Messenger (P2), Pagos/Banners consolidados (P2), SEO masivo (P2), Interacciones (P3), ThemeEngine (P4), Agentes IA (P5).

### Orden ideal de migración

1. Datos `usuarios/{uid}` → `usuarios` hub + `perfiles/{perfilId}`
2. Config → core único
3. Código inline → módulos
4. Modales → `modal-carihub`
5. Catálogo → 462 subcategorías

### Riesgos de NO separar módulos

- **Escalabilidad bloqueada** — no se puede desplegar Home sin wizard/pagos/admin.
- **Seguridad** — INE/verificación viajan en el bundle público.
- **Rendimiento** — Firebase completo + 7 fuentes + ~135 imágenes en primera visita.
- **Mantenibilidad** — `firebaseConfig` x5 y ~1.330 líneas inline sin tests.
- **Costo/operación** — `resultados.html` descarga todo el universo de perfiles por búsqueda.

### Beneficios de la modularización

Carga inicial liviana, despliegues independientes, datos sensibles aislados, SEO indexable, base lista para Messenger/Dashboards/IA y crecimiento geográfico.

### Mejoras

- **Recomendadas:** core único, Resultados server-side, extraer registro/cuenta/pagos, OG+canonical, corregir `--rosa`.
- **Opcionales:** unificar marca Cariñosas/CariHub, reducir fuentes, social proof en Home.
- **Futuras:** RenderEngine, ThemeEngine, Interacciones, Agentes IA, landings SEO masivas.

### Arquitectura recomendada por horizonte

| Horizonte | Arquitectura objetivo |
|-----------|------------------------|
| **1 año** | App pública liviana (Home/Resultados/Perfil) + SHARED/Core + Registro y Dashboard separados + Resultados server-side + Admin con RBAC fase 2 + SEO head. Migración perfiles ejecutada. |
| **3 años** | Messenger en runtime + Pagos/Contratos + Banners con inventory dinámico + SEO landings masivas + RenderEngine consolidado. Multi-país. |
| **5 años** | Interacciones (stories/lives/seguidores) + ThemeEngine (editor visual) + Agentes IA transversales (moderación, soporte, traducción, SEO). Internacional multi-idioma. |

---

## PARTE 9 — Veredicto

| Pregunta | Respuesta |
|----------|-----------|
| ¿La arquitectura actual es sostenible? | **Parcialmente.** Funciona como MVP, pero el monolito `index.html` y la consulta client-side de Resultados no son sostenibles para crecer. |
| ¿Preparada para escalar? | **Baja.** Cap explícito (150 usuarios admin), query no paginada, sin core. |
| ¿Preparada para Messenger? | **Solo en diseño.** SPEC 1.0.0 + VE 1.1.0 listos; **0 runtime**, colecciones no existen en rules, depende de migración perfiles. |
| ¿Preparada para Dashboards? | **Diseño congelado, sin shell.** Panel embebido en Home; falta router y migración. |
| ¿Preparada para SEO masivo? | **No aún.** Sin canonical/OG/schema/sitemap ni landings; marca dual. Base de catálogo (462) sí ayuda. |
| ¿Preparada para IA? | **No.** Hooks de diseño (orquestador, `ia_*`) presentes; LLM no autorizado, sin core. |
| ¿Preparada para ThemeEngine? | **No.** Tokens dispersos; requiere RenderEngine (sin SPEC) primero. |
| ¿Crecimiento nacional? | **Riesgo medio-alto** por consulta Resultados y cap admin. |
| ¿Crecimiento internacional? | **No preparada.** Sin i18n, sin SEO multi-región, sin particionado de datos. |

### Calificaciones (0–10)

| Dimensión | Nota | Comentario |
|-----------|------|------------|
| **Arquitectura actual** | **4.5** | MVP funcional, monolítico y mezclado |
| **Arquitectura objetivo** | **9.0** | Plano modular sólido y bien documentado |
| **Riesgo técnico** | **6.5/10 de riesgo** | Alto en Home/Resultados/RBAC |
| **Escalabilidad** | **3.5** | Query client-side + cap 150 |
| **Seguridad** | **5.5** | Rules razonables; RBAC email único e INE en bundle público bajan la nota |
| **Rendimiento** | **4.0** | Firebase+fuentes+imágenes+inline pesado |
| **Mantenibilidad** | **4.0** | Inline masivo, config x5, duplicados |

**Síntesis:** la **capa de diseño es excelente** (7 capas congeladas, SPECs auditados, fixtures y validadores). La **capa de implementación va muy por detrás** del diseño: sigue siendo un monolito MVP. El mayor valor inmediato es **cerrar esa brecha** empezando por SHARED/Core, Resultados server-side y la extracción de Registro/Cuenta fuera de Home.

---

## PLAN-MAESTRO por aplicación — ¿procede crearlos?

Se recomienda crear los planes maestros **en este orden**, alineado con la prioridad:

| Plan | ¿Procede ahora? | Justificación |
|------|-----------------|---------------|
| **PLAN-MAESTRO-APP-PUBLICA** | **Sí (P0)** | Núcleo + Resultados server-side + Perfil; mayor impacto inmediato |
| **PLAN-MAESTRO-REGISTRO** | **Sí (P1)** | Diseño FieldEngine/VE maduro; sacar INE de Home |
| **PLAN-MAESTRO-DASHBOARD** | **Sí (P1)** | SPEC congelado; requiere migración perfiles |
| **PLAN-MAESTRO-ADMIN** | Sí (P1) | Real pero con deuda (RBAC, cap 150) |
| **PLAN-MAESTRO-MESSENGER** | Después (P2) | Diseño listo; esperar core + migración |
| **PLAN-MAESTRO-PAGOS** | Después (P2) | Esperar contratos + pasarela autorizada |
| **PLAN-MAESTRO-BANNERS** | Después (P2) | Consolidar funnel (banner2/paso3) |
| **PLAN-MAESTRO-SEO** | Paralelo (P2) | Alto retorno; depende de Perfil/Render |
| **PLAN-MAESTRO-INTERACCIONES** | Futuro (P3) | Tras Messenger runtime |
| **PLAN-MAESTRO-THEMEENGINE** | Futuro (P4) | Tras RenderEngine SPEC |
| **PLAN-MAESTRO-AGENTES** | Futuro (P5) | Tras core estable + autorización LLM |

> Nota: además de los planes listados por el usuario, esta auditoría recomienda un **PLAN-MAESTRO-SHARED-CORE (P0)** y un **SPEC-RENDERENGINE (P1)** como precondiciones transversales, ya que habilitan al resto y hoy no existen como entregables formales.

---

*Veredicto documental — no modifica código, Firestore, producción ni capas congeladas. No inicia SPEC ni runtime.*
