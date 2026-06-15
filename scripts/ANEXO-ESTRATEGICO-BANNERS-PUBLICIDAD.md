# ANEXO-ESTRATEGICO-BANNERS-PUBLICIDAD v1.0.0

**Fecha:** 2026-06-10 · **Estado:** ANEXO DE DISEÑO DOCUMENTAL
**Modo:** Solo análisis y documentación. No runtime · no carpetas · no mover archivos · no Firestore · no deploy · no commit · **no crea actas** · **no modifica el plan ni capas existentes**.

> Complementa a `PLAN-MAESTRO-BANNERS-PUBLICIDAD v1.0.0` con la **visión futura** de monetización (no solo assets actuales). No lo modifica.

**Base conocida:** 17 slots reales, precios con video ×2 (semanal 0.35 / quincenal 0.65 / mensual 1, redondeo 50, IVA incl.), métricas hoy **estimadas** (apariciones, sin tracking real), aprobación manual vía `solicitudes_anuncios`.

---

## 1. Inventario publicitario futuro

### 1.1 Landings SEO
Cada landing SEO (geo y/o categoría) **hereda los slots base y los multiplica por contexto, sin HTML nuevo** (pintado por RenderEngine). Superficies: landing país / estado / ciudad / categoría / subcategoría / geo+categoría. Slots heredables típicos: `resultados_izquierda/centro/derecha/inferior` y `home_categorias` adaptado.

### 1.2 Inventario por contexto
- **Geo:** `slotId × paisKey`, `slotId × estadoKey`, `slotId × ciudadKey` (geo-primero: el slot de ciudad es producto independiente del de país).
- **Categoría:** `slotId × sectorId`, `slotId × subcategoriaId` (patrocinio contextual, solo en esa categoría).

### 1.3 Modelo de slot geo-contextual
- **Clave:** `{slotId}__{geoKey}__{categoriaKey}`
- `geoKey`: `global | pais:MX | estado:MX-JAL | ciudad:MX-JAL-GDL`
- `categoriaKey`: `global | sector:salud | sub:fisioterapia`
- Capacidad por clave hereda `capacidadMaxima` del slot base (ajustable por Admin).
- **Beneficio:** multiplica el inventario monetizable **sin crear páginas ni componentes nuevos**.

---

## 2. Campañas futuras

| Campaña | Targeting | Modelo de precio | Inventario |
|---|---|---|---|
| Geográfica | país/estado/ciudad | suma de slots por geoKey | slots geo-contextuales |
| Nacional | todas las ciudades de un país | paquete con descuento por volumen | slot × todas las geoKey del país |
| Internacional (futuro) | multi-país | moneda/IVA por país | namespacing por país |
| Por categoría | sectorId | premium contextual | slot × categoriaKey |
| Por subcategoría | subcategoriaId | ultra-contextual | slot × sub |
| Por perfil relacionado | perfiles afines (geo/categoría) | CPM/peso contextual | respeta privacidad; sin competir con el dueño |
| Por negocio relacionado | negocios afines | paquete B2B | landings/perfiles de negocio |
| Contextual | keyword/categoría de la búsqueda | premium por relevancia | resultados/landing |
| Premium | hero + destacado multi-pantalla | tarifa alta, exclusividad parcial | hero/destacados |
| Exclusiva | slot exclusivo (cap=1) sin rotación | máximo; bloquea inventario | ej. hero exclusivo de ciudad |

---

## 3. Métricas futuras

**Lista:** impresiones · clics · CTR · conversiones · contactos · WhatsApp · Telegram · Instagram · visitas de perfil · favoritos · leads.

| Origen | Métricas |
|---|---|
| **Real** (server-side) | impresiones, clics validados, CTR, contactos, leads atribuidos |
| **Estimada** (proyección) | apariciones (`INVENTARIO_DIARIO_BASE`) |

**Política:** etiquetar **siempre** el origen; nunca presentar estimada como real.

**Colecciones propuestas:**
- `eventos_banner/{id}` → `{ tipo: impresion|click|contacto_wa|contacto_tg|contacto_ig|lead, slotKey, contratoId, ts, sesionHash, geoKey, antifraude }`
- `estadisticas_banner/{slotKey}_{periodo}` → `{ impresiones, clics, ctr, contactos, leads }`

**Atribución:** click en CTA WhatsApp/Telegram/Instagram = evento **contacto** (deep-link con tag de campaña); contacto + acción posterior = **lead** atribuido al `contratoId`; ventana por sesión + tiempo configurable. **Privacidad:** sin PII del visitante; hashes de sesión; respeta PrivacyGuard de RenderEngine.

---

## 4. Expansión más allá de los 17 slots

Los 17 slots son **superficies base**; el inventario futuro se multiplica por `geoKey × categoriaKey`, **no por más HTML**.

- **Capacidad máxima teórica:** `Σ(slot) [ capacidadMaxima(slot) × #geoKeys × #categoriaKeys ]`.
- **Ejemplo ilustrativo:** 4 slots de resultados × 100 ciudades × 50 categorías × cap≈2-3 → decenas de miles de unidades vendibles teóricas.
- **Advertencia:** capacidad **teórica ≠ demanda real**. Vender bajo demanda para evitar inventario fantasma y saturación.
- **Crecer sin saturar:** límite de slots visibles por pantalla · densidad publicitaria máxima por vista · relevancia contextual sobre cantidad.

---

## 5. Integración futura

| Capa | Rol en publicidad |
|---|---|
| Messenger | CTA de banner abre contacto/Messenger; eventos contacto/lead alimentan métricas (no cobra en chat) |
| Dashboards | Anunciante ve métricas reales por campaña/geo/categoría; Admin ve ocupación/ingresos/anomalías |
| Agentes IA | iaComercial recomienda precio/ocupación/relleno; iaModeración pre-filtra creativos — solo lectura/recomendación |
| SEO | Banners **nunca** indexables ni inyectan contenido; landings SEO contienen slots sin afectar el canónico |
| RenderEngine | Pinta slots geo-contextuales desde snapshot; lazy/optimización; PrivacyGuard |
| ThemeEngine | Estiliza el contenedor del slot por tema; no altera el creativo |
| Pagos | Precios contextuales/paquetes; cobro y congelado |
| Contratos | `contratos_banners` por slotKey geo-contextual; precio/promoción congelados; campaña = N contratos |

---

## 6. Escalabilidad y riesgos

- **Nacional:** alta vía `geoKey`; requiere catálogo geo completo + índices + relleno por demanda; descuentos por paquete.
- **Internacional:** requiere namespacing por país (moneda, IVA, idioma, cumplimiento) → fase futura.

| ID | Tipo | Nivel | Riesgo | Mitigación |
|---|---|---|---|---|
| AE-R01 | sobreventa | alto | Vender más que capacidad por slotKey | InventoryManager con bloqueo por capacidad + override con aprobación superior |
| AE-R02 | saturación visual | alto | Demasiados banners degradan UX/conversión | densidad máxima por vista + límite de slots activos |
| AE-R03 | SEO | medio | Banners afectan contenido/indexación | creativos no indexables, fuera del canónico, sin CLS |
| AE-R04 | rendimiento | alto | Hero/video dañan CWV (LCP/CLS) | lazy load, peso máximo, dimensiones reservadas, snapshot |
| AE-R05 | fraude | alto | Click/impression fraud infla métricas y cobros CPC/CPM | anti-bot, dedup por sesión, server-side, detección IA |
| AE-R06 | métricas falsas | **crítico** | Presentar estimadas como reales = riesgo legal/reputacional | tracking real + etiqueta de origen + auditoría |
| AE-R07 | inventario fantasma | medio | Capacidad teórica enorme sin demanda | vender bajo demanda; no exponer slots sin interés |
| AE-R08 | competencia perfil | medio | Anuncio compite con el dueño del perfil donde aparece | reglas de no-competencia/relevancia |

---

## 7. Oportunidades de monetización futura

- Patrocinio de categoría/ciudad (exclusividad por periodo).
- Hero exclusivo por ciudad (subasta / tarifa premium).
- Paquete geográfico nacional (descuento por volumen).
- **Banner lead-gen** con CTA directo a WhatsApp/Telegram/Instagram (cobro por contacto/lead futuro).
- Destacado contextual en resultados (relevancia por keyword/categoría).
- Retargeting interno (re-impactar visitantes, respetando privacidad).
- Bundle perfil+banner (cross-sell con membresías).
- Modelos CPC/CPM/CPL futuros (cuando haya tracking real confiable).

### Nuevos productos publicitarios → fase
| Producto | Fase |
|---|---|
| destacado_contextual, bundle_perfil_banner | MVP+ |
| patrocinio_categoria, hero_exclusivo_ciudad, paquete_geo_nacional, lead_gen_cta_messaging | nacional |
| retargeting_interno, cpc_cpm_cpl, porNegocioRelacionado, internacional | internacional |

---

## 8. Inventario recomendado por fase

### MVP
- **Slots:** 17 actuales por ciudad principal.
- **Campañas:** simple, geográfica (ciudad).
- **Métricas:** impresiones reales, clics, CTR, contactos.
- **Precio:** tarifa plana por periodo (actual).
- **Objetivo:** probar tracking real + gate de publicación + conciliación.

### Escala nacional
- **Slots:** 17 × geoKey(ciudades) + slots en landings SEO + categoría/subcategoría.
- **Campañas:** geográfica, nacional, por categoría, contextual, premium, exclusiva, lead-gen.
- **Métricas:** + conversiones, + leads atribuidos, + contactos por canal (WA/TG/IG).
- **Precio:** contextual + paquetes + descuentos por volumen (editable Admin).
- **Objetivo:** multiplicar inventario por geo/categoría bajo demanda.

### Escala internacional
- **Slots:** namespacing por país (moneda/IVA/idioma) + retargeting interno.
- **Campañas:** internacional, por negocio relacionado, CPC/CPM/CPL.
- **Métricas:** modelos de cobro por rendimiento con antifraude maduro.
- **Precio:** por país; cumplimiento fiscal local.
- **Objetivo:** operar multi-país con métricas y antifraude robustos.

---

## 9. Matrices

### Geo × categoría → capacidad teórica
`unidades = capacidadMaxima(slot) × #geoKeys × #categoriaKeys`

| Caso | Unidades |
|---|---|
| resultados_centro (cap2) × 1 ciudad × 1 categoría | 2 |
| resultados_centro (cap2) × 100 ciudades × 50 categorías | 10,000 |
| hero (cap1) × 100 ciudades × global | 100 |

### Campaña futura → targeting → métrica clave
| Campaña | Targeting | Métrica clave |
|---|---|---|
| Geográfica | geoKey | impresiones/CTR por ciudad |
| Por categoría | categoriaKey | CTR contextual |
| Lead-gen | geo+categoría | contactos/leads |
| Premium/exclusiva | hero/multi-pantalla | impresiones/alcance |
| Por perfil/negocio relacionado | afinidad | contactos/leads |

### Producto futuro → fase
- **MVP:** simple, geográfica_ciudad, destacado_contextual, bundle_perfil_banner.
- **Nacional:** patrocinio_categoria, hero_exclusivo_ciudad, paquete_geo_nacional, lead_gen_cta_messaging, premium, exclusiva.
- **Internacional:** retargeting_interno, cpc_cpm_cpl, porNegocioRelacionado, internacional.

---

## 10. Recomendaciones estratégicas

1. **No vender CPC/CPM** hasta tener tracking real + antifraude (hoy métricas estimadas).
2. **Multiplicar inventario por contexto** (geo × categoría), no por más HTML.
3. Priorizar **relevancia contextual sobre densidad** para proteger UX/SEO/CWV.
4. **Vender bajo demanda** para evitar inventario fantasma.
5. **Etiquetar siempre** métrica real vs estimada (riesgo legal/reputacional crítico — AE-R06).
6. Introducir **lead-gen** (CTA WhatsApp/Telegram/Instagram) como puente al modelo por rendimiento.

---

## 11. Dependencias

- **Congeladas:** Shared/Core 1.0.0 · RenderEngine 1.0.0 · ValidationEngine 1.1.0 · FieldEngine 1.0.1 · Dashboards 1.0.0.
- **Planes:** PLAN-MAESTRO-BANNERS-PUBLICIDAD 1.0.0 · PLAN-MAESTRO-PAGOS-CONTRATOS 1.0.0 · PLAN-MAESTRO-ADMIN 1.0.0.
- **Precondiciones clave:** catálogo geo completo + índices · AdImpressionTracker real · RenderEngine pintando slots geo-contextuales · antifraude.

> No modifica `PLAN-MAESTRO-BANNERS-PUBLICIDAD.*` ni ningún archivo existente. No crea actas. Sin cambios en producción/Firestore/deploy/commit.
