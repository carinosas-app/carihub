# Definición final de planes CariHub

Fecha: 2026-06-23  
Estado: **propuesta de producto lista para implementar**  
Base: auditoría monetización (462 subs), auditoría sostenibilidad, `config-precios-planes-perfiles-schema.json`, modelo galería/estados/lives/mensajes.

**Mapeo nombre comercial → schema Firestore**

| Comercial | planId schema |
|-----------|---------------|
| Trial | `trial_profesional` (30 días, entitlements = Profesional) |
| Básico | `basico` |
| Profesional | `destacado` |
| Premium | `premium` |
| Especial | `vip` |

**Veredicto estructura:** mantener **4 planes de pago + 1 trial**. No fusionar ni eliminar tiers; el margen es comercial, no por GB de Firebase.

---

## Tabla maestra de beneficios (todos los planes)

| Beneficio | Trial 30d | Básico | Profesional | Premium | Especial |
|-----------|------------:|-------:|------------:|--------:|---------:|
| **Precio mensual (referencia global)** | $0 | $299 | $599 | $999 | $1,499 |
| Fotos galería (total perfil) | 6 | 3 | 6 | 10 | 15 |
| Videos galería | 1 | 0 | 1 | 3 | 8 |
| Estados activos simultáneos | 2 | 0 | 2 | 5 | 10 |
| Publicaciones estado / mes | 8 | 0 | 12 | 30 | 60 |
| Duración cada estado | 24 h | — | 24 h | 24 h | 48 h |
| Lives simultáneos | 0 | 0 | 0 | 1 | 2 |
| Minutos live / mes | 0 | 0 | 0 | 300 | 900 |
| Imágenes chat / mes | 50 | 0 | 50 | 200 | 1 000 |
| Videos chat / mes | 0 | 0 | 0 | 20 | 100 |
| Almacenamiento total perfil | 150 MB | 50 MB | 150 MB | 500 MB | 2 GB |
| Tamaño máx. foto perfil | 8 MB | 5 MB | 8 MB | 8 MB | 10 MB |
| Tamaño máx. video perfil | 25 MB | — | 25 MB | 50 MB | 100 MB |
| Actualizaciones perfil / mes | 4 | 2 | 4 | 8 | 20 |
| Prioridad resultados (1–4) | 2 | 1 | 2 | 3 | 4 |
| Badge | Destacado | — | Destacado | Premium | VIP |
| Destacado home | No | No | No | Sí | Sí |
| Mensajes texto | Sí | Sí | Sí | Sí | Sí |
| Soporte prioritario | No | No | No | No | Sí |
| Packs / venta digital | No | No | No | No | Sí* |

\*Solo categorías `persona_creador` o subcategorías marcadas creador; hasta 2 GB packs dentro del techo storage.

**Trial:** 30 días, entitlements idénticos a **Profesional**, precio $0. No renovable; una vez por cuenta/correo. Post-trial: checkout al plan mínimo de la categoría (nunca auto-Básico).

---

## Precios finales por formulario (mensual, IVA incluido)

Usar tabla existente del schema — **validada por auditoría de sostenibilidad**:

| formularioId | Básico | Profesional | Premium | Especial |
|--------------|-------:|------------:|--------:|---------:|
| **Global** (fallback) | $299 | $599 | $999 | $1,499 |
| persona_independiente | $249 | $499 | $799 | $1,199 |
| profesionista_cedula | $399 | $699 | $1,099 | $1,599 |
| negocio_empresa | $599 | $999 | $1,499 | $2,499 |
| adultos | $499 | $899 | $1,299 | $1,999 |

Periodos: semanal ×0.35 · quincenal ×0.65 · mensual ×1 (redondeo $50 MXN).

---

## Justificación por plan

### Trial — Profesional 30 días ($0)

**Por qué:** el anunciante debe sentir galería amplia, estados en perfil, badge y chat con imagen antes de pagar. Básico en trial genera churn.

**Infra:** ~$1.5–3 MXN/perfil/mes uso normal; absorbible en presupuesto operativo de lanzamiento.

**Comercial:** *“Tu primer mes Profesional va por nuestra cuenta.”*

---

### Básico

**Por qué existe:** 244 subcategorías de bajo consumo (bienestar, salud, hogar, mascotas) con margen neto ~96% a $249. Opción **post-trial** para quien no necesita estados ni media en chat.

**Qué vende:** presencia en directorio + contacto + mensajes texto. Sin estados ni lives en perfil.

**Salto a Profesional (+$250 en persona_independiente):** estados visibles en perfil, 6 fotos, video, chat con imagen — el salto se justifica en **conversión**, no en costo Firebase.

---

### Profesional

**Por qué:** plan recomendado para 157 subs (consumo medio): profesionales, educación, bienes raíces, restaurantes estándar, transporte.

**Qué vende:** vitrina completa + promoción temporal (estados) + badge + prioridad media. Sin lives (costo y moderación en tier superior).

**Salto a Premium (+$300):** lives en perfil, home destacado, video en chat, galería 10 fotos — diferencia clara para negocios que compiten por visibilidad.

---

### Premium

**Por qué:** 42 subs de alto engagement (eventos servicios, adultos legacy si no Especial, restaurante-bar antes de upgrade). Margen neto ~$1 284/mes promedio auditoría.

**Qué vende:** máxima visibilidad estándar + live promocional + video chat. Puerta de entrada sector eventos (18 subs Profesional + 17 Premium).

**Salto a Especial (+$400–700):** venues, creadores, adultos intensivos, packs — LTV y riesgo infra justifican tier máximo.

---

### Especial

**Por qué:** 19 subs auditoría + **34 adultos** (plan mínimo pago sector) + creadores tech + venues. Cupos altos y packs acotados.

**Qué vende:** todo lo anterior + soporte prioritario + packs (donde aplica) + lives extendidos. Es el plan de **sostenibilidad** en categorías de alto consumo/viral.

---

## ¿El salto de precio es correcto?

**Sí.** Auditoría: costo infra casi plano entre tiers (< $3 MXN/mes); la escalera es **comercial** (visibilidad, cupos, herramientas). Escalones ~1.5×–2× entre planes son estándar en SaaS de directorios.

| Salto (persona_independiente) | Incremento | Veredicto |
|-------------------------------|------------|-----------|
| Básico → Profesional | +$250 (2×) | Correcto — activa estados + galería doble |
| Profesional → Premium | +$300 (1.6×) | Correcto — lives + home + video chat |
| Premium → Especial | +$400 (1.5×) | Correcto — creadores/adultos/venues |

**No subir precios globales** salvo override por ciudad/categoría vía admin. **No bajar** Especial adultos ($1 999) — alineado con competencia del nicho.

---

## ¿Eliminar o fusionar planes?

| Opción | Veredicto |
|--------|-----------|
| Eliminar Básico | **No** — 53% del catálogo (244/462) |
| Fusionar Profesional + Premium | **No** — pierdes escalera en eventos y upsell post-trial |
| Fusionar Premium + Especial | **No** — adultos/creadores requieren techo distinto |
| Renombrar schema `destacado` → comercial “Profesional” | **Sí** — solo UI/copy; planId interno intacto |

---

## Plan mínimo de pago por categoría (obligatorio)

El usuario **no puede contratar** por debajo de este piso (trial exceptuado). Post-trial el checkout preselecciona el recomendado.

| Regla | Subcategorías aprox. | Plan mínimo |
|-------|-------------------:|-------------|
| `sectorId = adultos` | 34 | **Especial** |
| `arquetipo = persona_creador` | incl. contenido adultos | **Especial** |
| `subcategoriaId` creador-de-contenido-digital, produccion-audiovisual, editor-de-video, community-manager, etc. | 8 tech | **Especial** |
| `subcategoriaId = restaurante-bar` | 1 | **Especial** |
| Venues adultos (hotel/motel, antro, club, tabledance, cine xxx, cabinas…) | 10 | **Especial** |
| `sectorId = eventos` | 37 | **Profesional** |
| Eventos Premium (DJ, agencias, rentas, catering, organización…) | 17 | **Premium** |
| Venues eventos (salón, jardín) | 2 | **Especial** |
| `consumo = Medio` (resto) | 157 | **Profesional** |
| `consumo = Bajo` | 244 | **Básico** permitido |

**Distribución natural post-trial (462 subs):**

| Plan mínimo pago | Count |
|------------------|------:|
| Básico | 244 |
| Profesional | 157 |
| Premium | 17 |
| Especial | 44 |

*(Premium count baja vs auditoría original porque 24 adultos suben de Premium a Especial mínimo.)*

---

## Posicionamiento y beneficios comerciales (resumen)

| Plan | Posicionamiento | Beneficios comerciales clave |
|------|-----------------|------------------------------|
| Trial | Adquisición | Mismo que Profesional, 30 días |
| Básico | Presencia económica | Directorio, contacto, 3 fotos |
| Profesional | Conversión estándar | Estados en perfil, badge, 6 fotos, video, chat img |
| Premium | Competitivo | Home, lives, 10 fotos, video chat |
| Especial | Máximo / nicho exigente | VIP badge, packs, lives extendidos, soporte |

---

## Implementación

1. Actualizar `config-precios-planes-perfiles-schema.json` → sección `limites` completa alineada a tabla maestra.  
2. Checkout: plan mínimo por subcategoría + trial → Profesional.  
3. Dashboard uso: desglose galería / estados / lives / chat / GB.  
4. Copy comercial unificado: **Profesional** (no “Destacado”) en UI; `planId=destacado` interno.
