# Reevaluación: indexación de perfiles individuales adultos

**Revisión de `ADR-INDEXACION-ADULTOS v1.0.0`** · **Fecha:** 2026-06-10 · **Estado:** ANÁLISIS (no modifica decisiones)
**Modo:** Solo análisis y documentación. No runtime · no carpetas · no mover · no Firestore · no deploy · no commit. **NO modifica el ADR ni ningún documento existente.**

> Documento de análisis (no ADR, no SPEC). No cambia la decisión vigente; entrega un veredicto sobre mantener o evolucionar el ADR. La decisión final queda al product owner.

> **Decisión reevaluada:** `ADR-INDEXACION-ADULTOS v1.0.0` → `decision.mvp.noindex` incluye "perfiles adultos individuales (todos en MVP)".

---

## 1. Contexto

La regla *"noindex de todos los perfiles individuales adultos en MVP"* es la más restrictiva del ADR y la que más limita el descubrimiento orgánico long-tail. Se reevalúa su **costo de oportunidad** (tráfico/leads perdidos) frente a su **protección de riesgo** (legal/privacidad/reputación/scraping). No se reconsideran URL canónica ni estrategia de render (se consumen).

---

## 2. Ventajas vs desventajas de NO indexar perfiles

| Ventajas | Desventajas |
|---|---|
| Minimiza riesgo legal por jurisdicción | Pérdida del tráfico long-tail (alias + ciudad + servicio) |
| Protege privacidad/identidad (PII, cara, ubicación) | Menor descubrimiento directo de la oferta real |
| Protege reputación del dominio en SERP | Dependencia total de landings geo/categoría |
| Menos superficie de scraping y clonación | Menos páginas indexables → menor footprint/autoridad temprana |
| Evita thin content y duplicados | Anunciantes/perfiles perciben menos valor SEO directo |
| Reduce riesgo de penalización SafeSearch | Competidores que sí indexan capturan la demanda de marca |

---

## 3. Impacto por dimensión

- **SEO:** se pierde el grueso del long-tail; se compensa parcialmente con landings (menor volumen, mayor calidad).
- **Comercial:** se debilita el pitch "apareces en Google" para perfiles; el valor se traslada a posición interna + hubs.
- **Financiero:** menor conversión a leads/contratos atribuible a SEO de perfil; mitigable canalizando desde landings.
- **Tráfico orgánico:** crecimiento más lento pero más seguro.
- **Adquisición usuarios/anunciantes:** entrada por landing, no por perfil; el pitch a anunciantes se reorienta a "tráfico cualificado a hubs".
- **Banners:** menos páginas de perfil indexadas = menos inventario de impresión orgánica en perfil.
- **Pagos/Contratos:** la indexación puede volverse **beneficio de plan** (verificado/premium) en fase futura.
- **Crecimiento nacional:** sostenible vía hubs; lento en marca/alias. **Internacional:** noindex reduce exposición legal (ventaja), reactivable por mercado.
- **SafeSearch / reputación / autoridad:** protegidas; autoridad crece más lento pero más limpia.
- **Indexación futura:** mantener noindex ahora preserva la opción de abrir luego; abrir y cerrar después es peor (volatilidad del índice).
- **Motores IA:** GPTBot (ChatGPT), Google-Extended (Gemini), PerplexityBot, ClaudeBot/anthropic-ai bloqueados → menos citas de perfiles individuales y protección de PII. Perplexity, por ser agresivo citando, es donde más beneficia el bloqueo. Cumplimiento depende del motor → defensa en profundidad.
- **Descubrimiento orgánico:** se concentra en hubs; el perfil individual queda para navegación interna y marca.

---

## 4. Análisis por tipo de perfil

| Tipo | Lectura |
|---|---|
| Verificado | Menor riesgo (edad/identidad validada); mejor candidato a indexación futura controlada |
| No verificado | **Máximo riesgo → noindex SIEMPRE**, en cualquier fase |
| Independiente | Mayor sensibilidad (persona física) → noindex MVP; futuro solo verificado+no explícito |
| Negocio | Menor sensibilidad PII (entidad) → candidato más temprano (LocalBusiness) si no explícito |
| Anunciante | No es URL pública de perfil (alias→301); indexa vía landing/banner |
| Explícito | **noindex SIEMPRE** (legal/reputacional/SafeSearch) |
| No explícito | Candidato a indexación futura si además verificado |
| Premium futuro | Indexación como beneficio de plan (verificado + no explícito) |
| Destacado futuro | Mayor prioridad de crawl/posición si verificado + no explícito |

---

## 5. Comparación de opciones

| Opción | Beneficio | Desventaja | SEO | Riesgo | Veredicto |
|---|---|---|---|---|---|
| A. No indexar ninguno | protección máxima | cero tráfico de perfil | bajo | mínimo | = MVP actual del ADR |
| B. Solo verificados no explícitos | tráfico con riesgo acotado | requiere verificación + moderación | medio-alto | medio | **Mejor evolución futura** |
| C. Solo premium/verificados | monetiza indexación | tráfico limitado; "privilegio de pago" | medio | medio-bajo | Complementaria a B |
| D. Todos los públicos | tráfico máximo | riesgo máximo | alto (frágil) | muy alto | RECHAZADA |
| E. Híbrida por riesgo | modula por explicitud | clasificación compleja | alto | controlado | Válida, más compleja que F |
| F. Híbrida por verificación | criterio objetivo y auditable | depende de cobertura de verificación | alto | controlado | **RECOMENDADA** |

---

## 6. Riesgos

Legales (jurisdicción), privacidad (PII en SERP/snippets/OG/IA, irreversible por caché), reputacionales (marca asociada a explícito), scraping (blanco fácil), clonación/suplantación, contenido duplicado, thin content, SafeSearch (degrada el dominio entero), para SEO-LANDINGS (contamina índice sin ThinContentGuard) y para RenderEngine (exige meta robots/X-Robots-Tag/data-nosnippet por perfil + PrivacyGuard estricto).

---

## 7. Matrices

### Opción → beneficio → riesgo
A protección/mínimo/nulo · B tráfico acotado/medio/medio-alto · C monetización/medio-bajo/bajo-medio · D tráfico máximo/muy alto/alto frágil · E modulación/controlado/alto · F criterio auditable/controlado/alto.

### Tipo de perfil → indexación por fase

| Tipo | MVP | Nacional | Internacional |
|---|---|---|---|
| Verificado no explícito | noindex | **index (recomendado)** | index si legal |
| No verificado | noindex | noindex | noindex |
| Independiente verif. no explícito | noindex | index condicional | index si legal |
| Negocio no explícito | noindex | index (más temprano) | index si legal |
| Anunciante | n/a (alias→301) | vía landing/banner | vía landing |
| Explícito | noindex | noindex | noindex |
| Premium verif. no explícito | noindex | index (beneficio de plan) | index si legal |
| Destacado verif. no explícito | noindex | index prioridad | index si legal |

---

## 8. Síntesis de impacto

- **SEO:** mantener noindex retrasa el long-tail pero protege autoridad; abrir por verificación recupera tráfico con riesgo acotado.
- **Negocio:** la indexación se convierte en palanca de valor (plan verificado/premium).
- **Crecimiento:** nacional sostenible vía hubs; los perfiles aceleran cuando hay masa de verificados.
- **Internacionalización:** noindex protege en mercados de marco incierto; abrir por mercado tras revisión legal.

---

## 9. Recomendaciones por fase

- **MVP:** **MANTENER el ADR v1.0.0 sin cambios** (noindex de todos los perfiles individuales adultos). El riesgo supera el beneficio temprano; el crecimiento se captura con landings geo/categoría.
- **Fase nacional:** **evolucionar a opción F** (híbrida por verificación): indexar perfiles **verificados y no explícitos**, con ThinContentGuard, moderación OG y `max-image-preview` controlado. Negocios no explícitos pueden entrar antes.
- **Fase internacional:** activar por mercado solo tras revisión legal por jurisdicción; control hreflang/país; noindex donde el marco sea incierto.
- **Largo plazo:** F + C combinadas (indexación como beneficio de planes premium/destacados, siempre verificado + no explícito). **Explícito y no verificado permanecen noindex SIEMPRE.**

---

## 10. Gatillos de evolución (para activar v1.1.0)

1. Masa crítica de perfiles verificados no explícitos (umbral a definir con datos).
2. Autoridad de dominio consolidada por landings (sin penalizaciones).
3. RenderEngine runtime con meta robots/X-Robots-Tag/data-nosnippet + PrivacyGuard operativos.
4. SeoModerationQueue activa para previews OG.
5. Revisión legal por jurisdicción aprobada.
6. ThinContentGuard con umbral calibrado.

---

## 11. Riesgos abiertos y dependencias

- **Abiertos:** umbral numérico de verificación/contenido; cobertura real de verificación (si es baja, F rinde poco); cumplimiento variable de robots por IA; marco legal por país sin mapear.
- **Consume:** ADR-INDEXACION-ADULTOS 1.0.0, ADR-URL-CANONICA 1.0.0, ADR-RENDER-STRATEGY 1.0.0, SPEC-RENDERENGINE 1.0.0.
- **Alinea:** SEO-LANDINGS, BANNERS, PAGOS-CONTRATOS, AGENTES-IA.

---

## 12. Veredicto

- **¿Mantener el ADR sin cambios?** **SÍ para MVP** — la decisión v1.0.0 es correcta y debe mantenerse sin cambios en la fase actual.
- **¿Debe evolucionar?** **SÍ a futuro** — se recomienda evolucionar a **política híbrida por verificación (opción F)** en fase nacional madura, mediante un futuro **`ADR-INDEXACION-ADULTOS v1.1.0`** (no creado aquí; este análisis es su insumo).
- **Cómo:** nuevo ADR v1.1.0 cuando se cumplan los gatillos; no se modifica el v1.0.0 actual.
- **Lo que no cambia nunca:** explícito = noindex siempre; no verificado = noindex siempre; PII nunca en snippets/OG/IA.

> No modifica el ADR v1.0.0 (se reevalúa pero no se altera), ni SEO-LANDINGS, observación SEO, ADRs, actas, planes o capas congeladas. Sin cambios en producción/Firestore/deploy/commit.
