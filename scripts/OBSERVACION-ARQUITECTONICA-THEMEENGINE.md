# Observación arquitectónica — Personalización Visual (ThemeEngine)

| Campo | Valor |
|-------|-------|
| **Estado** | **Ampliada — editor visual Canva** (capa NO diseñada) |
| **Ampliación** | **Abierta** — v1.2.0 capacidades funcionales editor |
| **SPEC ThemeEngine** | **NO iniciar** |
| **Versión observación** | 1.3.0 |
| **Fecha** | 2026-06-09 |
| **Runtime / Firestore / APIs** | **NO** |

Canónico: [`OBSERVACION-ARQUITECTONICA-THEMEENGINE.json`](./OBSERVACION-ARQUITECTONICA-THEMEENGINE.json)

No modifica las siete capas congeladas ni el roadmap consolidado vigente.

---

## Visión del editor visual

Editor **tipo Canva** acotado: lienzo por superficie, componentes del sistema, tokens de tema, plantillas versionadas — **sin** HTML/JS/CSS libre del usuario.

---

## 1. Superficies editables (10)

| Nivel | Superficies |
|-------|-------------|
| **Total** | Dashboard perfil |
| **Parcial** | Perfil público, anunciante, negocio, banners, tarjetas, mensajería, interacciones |
| **Restringida** | Dashboard admin, home futura |

Detalle bloques: v1.1.0 en JSON `superficiesEditablesFuturas`.

---

## 2. Herramientas de edición tipo Canva

| Categoría | Herramientas |
|-----------|--------------|
| **Lienzo y capas** | Zoom, rejilla, guías, panel capas, z-index controlado, agrupar, bloquear, ocultar |
| **Transformación** | Mover, redimensionar, rotación limitada, duplicar, copiar estilo, deshacer/rehacer |
| **Texto** | Cajas tipadas, estilos heading/body/caption — sin HTML rico arbitrario |
| **Medios** | Imagen/video con recorte, filtros preaprobados, límites peso/duración |
| **Formas** | Vectores sistema, iconos, separadores, bordes/sombras por tokens |
| **Responsive** | Breakpoints móvil/tablet/escritorio, ocultar por breakpoint |
| **Publicación** | Borrador, comparar, revisión, publicar, programar |

**Prohibido:** editor HTML/CSS, scripts, iframes externos, import Canva crudo.

---

## 3. Componentes disponibles (catálogo tentativo)

- **Estructura:** sección, columna, grid, spacer, divider, tabs acotados
- **Contenido perfil:** hero, avatar, galerías, servicios, tarifas, horarios, mapa, verificaciones, CTAs…
- **Dashboard:** widgets métrica/gráfica/lista, tarjetas, paneles, atajos
- **Anuncio:** banner slot, CTA, overlay, video banner
- **Resultados:** result card shell, chips, verificado
- **Home:** hero, sectores, carrusel promo, búsqueda
- **Mensajería / Interacciones:** burbujas, marco story, player live, reacciones

Props vinculadas a **FieldEngine** — el usuario no crea campos nuevos desde el editor.

---

## 4. Personalización visual

**Tokens:** colores semánticos, tipografías aprobadas, espaciado, bordes, sombras, fondos (sólido/gradiente/biblioteca).

| Rol | Alcance |
|-----|---------|
| **Usuario** | Perfil + dashboard perfil |
| **Anunciante** | + creativos banner, skin dashboard anunciante |
| **Negocio** | + tema corporativo multi-perfil |
| **Admin** | Tokens globales, defaults catálogo, home |

---

## 5. Plantillas

| Tipo | Descripción |
|------|-------------|
| **Oficial sistema** | Admin; versionadas; rollback |
| **Oficial categoría** | Default por `subcategoriaId` |
| **Personal usuario** | Borradores; límites por plan |
| **Corporativa negocio** | Compartida intra-cuenta |
| **Marketplace** | Futuro — fuera MVP |

Acciones: aplicar · previsualizar · guardar como · restaurar default · duplicar.

---

## 6. IA de diseño (asistida, no autónoma)

| ID | Capacidad | Roles |
|----|-----------|-------|
| TE-IA-01 | Paleta desde foto portada | usuario, anunciante, negocio |
| TE-IA-02 | Orden secciones por categoría | usuario, negocio |
| TE-IA-03 | Textos CTA/banner | anunciante |
| TE-IA-04 | **Detectar contraste A11Y** | todos — **obligatorio** |
| TE-IA-05 | Sugerir plantilla oficial | usuario |
| TE-IA-06 | Safe zones banner/home | anunciante, admin |
| TE-IA-07 | Resumen para revisión admin | admin |

**Prohibido IA:** generar HTML/CSS/JS, publicar sin confirmación, leer chats Messenger.

---

## 7. Vista previa responsive

Breakpoints: móvil (360–430px) · tablet (768–1024px) · escritorio (1280px+).

Modos: preview en vivo · borrador vs publicado · simulador dispositivo · rotación · claro/oscuro.

Prioridad móvil: mensajería, stories/live, tarjetas resultados.

---

## 8. Seguridad y restricciones (editor)

Además de TE-SEC-01–10:

- Nodos solo de catálogo componentes registrado
- URLs media solo Storage/biblioteca validada
- Texto sanitizado; sin event handlers
- Límites archivo/dimensiones por plan
- Rate limit `guardar_borrador_tema`
- Elementos bloqueados por admin intocables
- Categorías adultas: plantillas restringidas + revisión
- Sin superponer chrome global (nav, modales)

---

## 9. Historial, versiones y rollback

- Autoguardado borrador · versión al publicar · diff visual · restaurar anterior
- Rollback admin forzado · tema predeterminado sistema · auditoría quién/cuándo/qué
- Retención por plan (por definir en SPEC)

| Superficie | Historial | Rollback |
|------------|-----------|----------|
| Perfil público | Completo | Usuario + admin |
| Dashboard perfil | Completo | Usuario |
| Banners | Completo | Admin |
| Home | Completo | Solo admin |
| Mensajería | Preferencias | Usuario |

*Sin diseño de persistencia en esta observación.*

---

## 10. Accesibilidad (A11Y) en el editor

- Validar contraste al elegir colores (TE-IA-04)
- Alt text obligatorio en imágenes informativas
- Orden de lectura lógico al reordenar
- Foco teclado en editor y preview
- Tamaños táctiles mínimos en CTAs móvil
- Paletas precertificadas o validadas
- Respetar `prefers-reduced-motion`
- Simulación daltonismo opcional en preview

---

## Permisos por rol

| Rol | Puede editar | No puede |
|-----|--------------|----------|
| **Usuario** | Perfil público, dashboard perfil, tarjeta (whitelist), prefs messenger, marco story propio | Home, admin, UI ajena |
| **Anunciante** | + dashboard anunciante, creativos banner (con moderación) | Slots fijos, publicar sin admin |
| **Negocio** | + dashboard negocio, tema corporativo, promos visuales | — |
| **Administrador** | Todas (moderación), home, plantillas oficiales, rollback global | Super_admin para tokens globales |

---

## Matriz manipulación de elementos

| Elemento | Arrastrar | Duplicar | Agrupar | Bloquear | Ocultar | Versionar | IA |
|----------|-----------|----------|---------|----------|---------|-----------|-----|
| Sección layout | Parcial | Sí | Sí | Sí | Sí | Sí | Sí |
| Widget datos FE | Sí | No | Sí | Sí | Sí | Sí | Parcial |
| Texto / imagen | Sí | Sí | Sí | Parcial | Sí | Sí | Sí |
| Banner slot | No | Parcial | No | Sí | No | Sí | Sí |
| Chrome sistema | No | No | No | No | No | No | No |

Plantillas oficiales: todos los componentes editables. Personalizadas: según superficie (v1.1.0). Clonar/compartir: ver JSON `capacidadesManipulacionElementos`.

---

## Compatibilidad y restricciones vigentes

RenderEngine · Dashboards · Interacciones · Messenger · Seguridad MVP · FieldEngine · ValidationEngine · Catálogo — solo referencia.

**No interrumpir:** Interacciones Fase 7 · actas pre-runtime.

---

## Backlog evolución futura (no obligatorio)

Líneas de **análisis posterior** — no son requisitos MVP ni compromisos de producto.

| ID | Línea | Resumen |
|----|-------|---------|
| **TE-BL-01** | Marketplace de plantillas | Publicar/compartir plantillas entre usuarios con moderación |
| **TE-BL-02** | Temas corporativos compartidos | Tema marca en múltiples perfiles de una cuenta |
| **TE-BL-03** | Temas por categoría | Defaults/restricciones por `subcategoriaId` del catálogo |
| **TE-BL-04** | Multiidioma visual | Variantes UI por idioma sin duplicar perfil entero |
| **TE-BL-05** | IA generativa de diseño | Más allá de sugerencias TE-IA — generación de composiciones |
| **TE-BL-06** | Modo borrador y experimentación | Sandbox, ramas visuales, comparación sin publicar |
| **TE-BL-07** | A/B testing futuro | Variantes visuales en paralelo con métricas |

**Evaluación:** workshop pre-SPEC o revisión post-MVP visual. Salidas posibles: incluir en SPEC, posponer, descartar u observación ampliada.

Detalle y preguntas de análisis: JSON `backlogEvolucionFutura`.

---

*Observación v1.3.0 — visión funcional + backlog evolución para eventual SPEC ThemeEngine.*
