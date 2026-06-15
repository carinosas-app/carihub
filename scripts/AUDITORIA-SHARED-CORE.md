# Auditoría final pre-congelamiento — Shared/Core CariHub

| Campo | Valor |
|-------|-------|
| **Objeto** | Shared/Core |
| **Versión** | 1.0.0 |
| **Fecha** | 2026-06-10 |
| **Estado** | Auditoría completada — **congelamiento NO aprobado** |
| **Resuelve (evalúa)** | RE-AU-01 |
| **Modo** | Solo auditoría — **sin runtime/carpetas/mover/Firestore/deploy/commit** |

Canónico: [`AUDITORIA-SHARED-CORE.json`](./AUDITORIA-SHARED-CORE.json)
Base: [`PLAN-MAESTRO-SHARED-CORE.md`](./PLAN-MAESTRO-SHARED-CORE.md) · [`SPEC-RENDERENGINE.md`](./SPEC-RENDERENGINE.md) · [`ADR-RENDER-STRATEGY.md`](./ADR-RENDER-STRATEGY.md) · [`ADR-URL-CANONICA-PERFILES.md`](./ADR-URL-CANONICA-PERFILES.md)

---

## Veredicto global

> **NO congelable aún.** El `PLAN-MAESTRO-SHARED-CORE` es **inventario/recomendación**, no una **SPEC formal**. Requiere `SPEC-SHARED-CORE` + **6 ajustes obligatorios** antes de cualquier acta.

**Criterio de "congelable"** (patrón FieldEngine 1.0.1 / ValidationEngine): SPEC formal (API/tipos/contratos sin ambigüedad) + fixtures golden + auditoría sin bloqueantes + aprobación del product owner.

---

## Matriz de definición por elemento

| Elemento | Definición | Nota |
|----------|-----------|------|
| firebaseConfig único | **Suficiente** | Duplicado evidenciado (×6); falta firmar API de init |
| Catálogo compartido | **Insuficiente** | 34 (prod) vs 462 (diseño) sin resolver → **bloqueante** |
| Geo país/estado/ciudad | Parcial | Falta política de segmentación/lazy |
| Tokens visuales | **Insuficiente** | `--rosa` divergente y `home-modals.css` roto → **bloqueante** |
| Helpers compartidos | Suficiente | Falta firmar API |
| Validaciones comunes | Parcial | Frontera con VE debe ser explícita |
| Constantes globales | Parcial | Separar config Core de constantes de dominio |
| Assets compartidos | Parcial | Branding sí; creativos no |
| Scripts comunes | Suficiente | `modal-carihub` → formalizar Core-UI |
| Estilos base | Parcial | `base.css`/reset sí; `banners-publicidad.css` no |
| Componentes reutilizables | Suficiente (contrato existente) | ComponentRegistry ya en `config-registro-componentes-ui-schema.json` |
| Cliente VE | **Insuficiente** | Solo conceptual; falta contrato |
| Cliente FieldEngine | **Insuficiente** | Solo conceptual; falta contrato |
| Cliente RenderEngine | **Insuficiente** | RE en diseño; exponer ComponentRegistry/resolveUrl como contrato |

---

## Fortalezas

- Inventario completo con **evidencia real** de duplicados (firebaseConfig×6, textoSeguro×5, `--rosa`×4).
- **Regla de admisión** clara (2+ apps y estable) → mitiga god-module.
- Dirección de dependencias definida (**Core no depende de apps**; grafo acíclico).
- Consumidores por sub-capa mapeados; orden de extracción y prioridad definidos.
- Alineación con contratos existentes (`config-renderizado-dinamico`, ComponentRegistry).

## Debilidades

- Es **PLAN**, no **SPEC** (sin API/tipos/contratos).
- Catálogo 34 vs 462 sin decisión vinculante.
- Sin contrato de tokens; `--rosa` roto.
- Carga/segmentación de geo no definida.
- Clientes VE/FE/RenderEngine solo conceptuales.
- Sin fixtures golden ni validador; sin política de superficie pública/semver formalizada.

---

## Riesgos

| ID | Nivel | Riesgo | Mitigación |
|----|-------|--------|------------|
| SC-AU-R01 | Alto | Congelar sin SPEC → ambigüedad y re-trabajo | SPEC-SHARED-CORE antes del acta |
| SC-AU-R02 | Alto | Catálogo ambiguo propaga inconsistencia | Decidir versión + capa compatibilidad |
| SC-AU-R03 | Medio | God-module sin superficie pública vinculante | Sub-capas con exports explícitos |
| SC-AU-R04 | Medio | Dependencias circulares App↔Core | Grafo acíclico; prohibido Core→app |
| SC-AU-R05 | Medio | Regresión visual al unificar tokens | Contrato tokens + mapeo previo |
| SC-AU-R06 | Medio | Geo pesado en bundle Core | Segmentación/lazy por país |
| SC-AU-R07 | Bajo | Duplicar reglas VE/FE en Core | Core solo clientes/contratos |

---

## Dependencias

- **Congeladas:** VE 1.1.0 · FieldEngine 1.0.1 · Catálogo/Cuentas/Seguridad/Dashboards/Messenger.
- **En diseño:** RenderEngine 1.0.0 (SPEC) · App Pública (plan) · SEO/ThemeEngine (observaciones).
- **Decisiones previas que impactan Core:** `ADR-RENDER-STRATEGY` (modoRender) · `ADR-URL-CANONICA-PERFILES` (`resolveUrl`/canónico → helpers de URL en Core).

### Compatibilidad por módulo

| Módulo | Estado |
|--------|--------|
| App Pública | PASS (consumidor puro) |
| Registro | PASS (requiere contrato cliente FE) |
| Dashboards | PASS |
| Messenger | PASS (cliente VE) |
| Admin | OBSERVACIÓN (RBAC en Core; etiquetas de dominio fuera) |
| Banners | PASS (creativos/precios fuera) |
| ThemeEngine | OBSERVACIÓN (depende de SC-AO-03 tokens) |
| SEO | PASS |
| Agentes IA | PASS (prompts/LLM fuera) |

---

## Ajustes obligatorios (bloqueantes para congelar)

| ID | Tema | Detalle |
|----|------|---------|
| **SC-AO-01** | SPEC-SHARED-CORE formal | API pública, tipos, contratos de clientes VE/FE/RenderEngine, exports y semver |
| **SC-AO-02** | Versión de catálogo | Decidir 34 vs 462 + capa de compatibilidad |
| **SC-AO-03** | Contrato de tokens | `tokens.css` base, resolver `--rosa`, corregir `home-modals.css` (definición) |
| **SC-AO-04** | Carga de geo | Segmentación/lazy por país |
| **SC-AO-05** | Frontera clientes vs motores | Qué expone Core de VE/FE/RE sin reimplementar |
| **SC-AO-06** | Superficie pública + anti god-module | Exports por sub-capa + grafo acíclico verificable |

## Ajustes recomendados

- `SC-AR-01` fixtures-shared-core-golden · `SC-AR-02` validador `validar-spec-shared-core.mjs` · `SC-AR-03` decisión perfilId opaco (Seguridad, URL-R02) · `SC-AR-04` inventario branding Core · `SC-AR-05` `SPEC-SHARED-CORE-ALCANCE.md`.

---

## Respuestas directas

| Pregunta | Respuesta |
|----------|-----------|
| ¿El PLAN-MAESTRO basta para congelar? | **No** — es inventario/recomendación, falta SPEC formal |
| ¿Primero debe redactarse SPEC-SHARED-CORE? | **Sí** — precondición (SC-AO-01) |
| ¿Puede congelarse sin cambios? | **No** — 6 ajustes obligatorios |
| ¿Procede generar ACTA-CONGELAMIENTO ahora? | **No** — no se genera; congelamiento no aprobado |

---

## Ruta hacia el congelamiento

1. Redactar **`SPEC-SHARED-CORE.md/json`** (SC-AO-01) con API/tipos/contratos + semver.
2. Cerrar SC-AO-02 (catálogo), SC-AO-03 (tokens), SC-AO-04 (geo), SC-AO-05 (frontera), SC-AO-06 (exports/acíclico).
3. (Recomendado) fixtures golden + validador.
4. Auditoría de la SPEC sin hallazgos bloqueantes.
5. Aprobación del product owner → **`ACTA-CONGELAMIENTO-SHARED-CORE`**.
6. Con Core congelado → cerrar **RE-AU-01** → **`ACTA-CONGELAMIENTO-RENDERENGINE`**.

---

## Impacto en RenderEngine

**`RE-AU-01` permanece ABIERTO** — Core aún no es congelable.
`RE-AU-02` (estrategia render) y `RE-AU-03` (URL canónica) ya están resueltos por sus ADRs; **RE-AU-01 es el único restante** y este audit confirma que exige **SPEC-SHARED-CORE primero**.

---

*Auditoría documental — no modifica código, Firestore, producción ni capas congeladas. No aprueba congelamiento. No inicia runtime.*
