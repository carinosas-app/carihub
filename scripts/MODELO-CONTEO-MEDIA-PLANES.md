# Modelo de conteo de media por plan — dónde aplica cada cupo

Fecha: 2026-06-23  
Estado: diseño producto + entitlements (sin runtime)  
Relacionado: `config-plan-entitlements-schema.json`, ENT-001, ENT-003, ENT-011

---

## Respuesta corta

Los cupos **no son “solo pantalla de perfil”** ni **solo dashboard**. Hay **3 familias** de límites:

1. **Galería fija del perfil público** (foto principal + fotos de presentación + video de perfil)  
2. **Red de trabajo social** (estados y lives que publicas en el dashboard y se **reflejan** en el perfil mientras están activos)  
3. **Mensajes privados** (adjuntos en conversaciones — canal aparte, no mezclado con anuncios de mensajes)

**Regla de oro:** un archivo físico en Storage = **un solo cargo de almacenamiento**, aunque se vea en perfil **y** en un estado **y** en miniatura de live. Lo que se cuenta aparte es **cuántos estados/lives/adjuntos chat** puedes tener, no duplicar el peso del mismo JPG.

---

## Mapa visual del producto Cariñosas

```
┌─────────────────────────────────────────────────────────────────┐
│  PERFIL PÚBLICO (cariñosas.com/perfil/…)                        │
│  ┌──────────────┐  ┌─────────────────────────────────────────┐  │
│  │ Foto         │  │ Recuadro ESTADO activo (desde dashboard) │  │
│  │ principal    │  │ → apunta al media del estado, no copia   │  │
│  ├──────────────┤  ├─────────────────────────────────────────┤  │
│  │ 3 fotos      │  │ Recuadro LIVE en curso (desde dashboard)   │  │
│  │ galería      │  │ → stream / thumb, no segunda copia fija    │  │
│  ├──────────────┤  └─────────────────────────────────────────┘  │
│  │ Contactos    │                                               │
│  └──────────────┘                                               │
│  Cupo: fotosMax + videosMax (perfil_foto_*)                   │
└─────────────────────────────────────────────────────────────────┘
         ▲                              ▲
         │ referencia                   │ referencia
         │                              │
┌────────┴──────────────────────────────┴──────────────────────────┐
│  DASHBOARD — red de trabajo social (canal perfil)               │
│  · Crear / editar galería fija → sube a perfil_publico/*        │
│  · Publicar ESTADO → estado_media/* (+ contador estados)        │
│  · Transmitir LIVE → live/* (+ minutos lives)                   │
│  · Anuncios canal perfil (≠ anuncios canal mensajes)            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  MENSAJES (dashboard, scoped por perfil/banner)                 │
│  · Adjuntos imagen/video en chat → chat_adjunto/*               │
│  · Cupo: adjuntosChatMesMax (aparte de fotos de galería)        │
│  · Anuncios-estados del canal MENSAJES → NO salen en perfil     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Qué significa cada cupo del plan

### A) Galería fija del perfil (`fotosMax`, `videosMax`)

| Qué es | Dónde se ve | Contexto upload |
|--------|-------------|-----------------|
| Foto principal | Arriba en perfil, resultados, tarjetas | `perfil_foto_principal` |
| Fotos galería (ej. 3 debajo) | Perfil público | `perfil_galeria` |
| Video de presentación | Perfil (si el tema lo muestra) | `perfil_video` |

**Importante:** el layout “1 + 3” es **diseño de pantalla**, no el plan entero.  
Ejemplo **Básico (3 fotos totales):** 1 principal + 2 en galería, **o** 1 principal + 3 miniaturas con una vacía — el límite es **3 archivos de galería fija**, no “3 + principal infinito”.

Ejemplo **Destacado trial (6 fotos):** hasta 6 archivos en galería fija + 1 video de perfil si el plan lo permite.

Esto es lo que vive “para siempre” en la vitrina hasta que el anunciante la cambie.

---

### B) Estados (`estados.*`)

| Qué es | Dónde se ve | Cupo |
|--------|-------------|------|
| Publicación temporal tipo “historia” / promo | Dashboard + **recuadro en perfil** mientras activo | `activosMax`, `publicacionesMesMax` |
| Media del estado | Subida nueva **o** reutilizar foto de galería | `estado_media` |

- **Básico:** estados deshabilitados → no hay recuadro de estado en perfil.  
- **Destacado trial:** hasta 2 estados activos a la vez, X publicaciones al mes.  
- **Premium/VIP:** más estados activos y más publicaciones.

**¿Cobra doble si la misma imagen está en galería y en un estado?**  
**No en storage.** Se guarda un `mediaId` / URL una vez; el estado guarda `mediaRef: "media_abc123"`.  
Cuenta: 1 archivo en `bytesStorageUsados` + 1 estado en `estadosActivos`.

---

### C) Lives (`lives.*`)

| Qué es | Dónde se ve | Cupo |
|--------|-------------|------|
| Transmisión en vivo | Dashboard + **embed en perfil mientras transmite** | `minutosDiaMax`, `minutosMesMax`, `activosMax` |
| Grabación / thumb post-live | Opcional, temporal | `live_grabacion` + retención horas |

El live **no es una foto más de galería**. Es streaming + (opcional) archivo temporal.  
**Destacado trial:** lives deshabilitados en schema propuesto → en trial Destacado **no transmiten live** hasta Premium/VIP (salvo override categoría eventos/adultos).

---

### D) Mensajes — adjuntos chat (`adjuntosChat*`)

| Qué es | Dónde | Cupo |
|--------|-------|------|
| Imagen/video que envías en una conversación | Solo hilo mensajes (no perfil público) | `adjuntosChatMesMax` |

**Totalmente aparte** de las 6 fotos de galería.  
Ejemplo Destacado: 50 adjuntos imagen/mes en chat; la galería sigue siendo 6 fotos fijas.

Los **anuncios del canal mensajes** (strip horizontal en módulo Mensajes) son otro producto — TICKET-048 — no consumen cupo de galería perfil.

---

## Tabla resumen — plan Destacado (30 días trial)

| Recurso | ¿Dónde lo usa? | Límite trial Destacado |
|---------|----------------|------------------------|
| Fotos galería fija | Perfil público + resultados | **6** |
| Video perfil | Perfil | **1** |
| Estados activos | Dashboard → recuadro perfil | **2** a la vez |
| Publicaciones estado / mes | Dashboard | **8** |
| Lives | Dashboard → perfil en vivo | **0** (plan Destacado base) |
| Adjuntos imagen chat | Mensajes privados | **50/mes** |
| Adjuntos video chat | Mensajes | No (Premium+) |
| Badge / prioridad | Resultados, home | Sí (destacado) |

---

## Qué se suma al “espacio usado” (GB perfil)

```
bytesStorageUsados =
  SUM(archivos únicos en perfil_publico/*)
+ SUM(archivos únicos en estados/* que NO sean solo referencia)
+ SUM(archivos únicos en lives/grabaciones/*)
+ SUM(archivos únicos en packs/* si aplica)
+ SUM(archivos únicos en chat/*)   ← opcional: sub-contador chatStorageBytes
```

**Referencias** (estado apunta a `mediaId` ya contado en galería): **+0 bytes** adicionales.

**Egress (ancho de banda):** cada **visualización** consume bandwidth aunque sea el mismo archivo. Eso no es “cobro doble de storage”; es tráfico. Por eso importan cleanup de estados vencidos (ENT-040) y perfiles vencidos (ENT-043).

---

## Registro de media (implementación futura ENT-003)

Cada upload crea un documento:

```js
perfiles/{perfilId}/media_registry/{mediaId}: {
  storagePath,
  bytes,
  contentType,
  contextoOrigen: "perfil_galeria" | "estado_media" | "chat_adjunto" | ...,
  referencias: [{ tipo: "galeria", slot: 2 }, { tipo: "estado", estadoId: "..." }],
  createdAt
}
```

- Subir foto a galería → +1 en `fotosUsadas`, +bytes.  
- Crear estado **reutilizando** galería → +1 en `estadosActivos`, **sin** +1 en `fotosUsadas`.  
- Subir foto **nueva** solo para estado → +bytes; `fotosUsadas` solo si también entra a galería fija.

---

## Corrección respecto a mensajes anteriores

Cuando decíamos “30 días Destacado: 6 fotos, estados, badge”, significa:

| Sí incluye (trial Destacado) | No incluye (hasta Premium/VIP) |
|------------------------------|--------------------------------|
| Galería perfil hasta 6 fotos + 1 video | Lives en perfil |
| Estados visibles en perfil (2 activos) | Adjuntos video en chat |
| Badge y prioridad en resultados | Packs / venta digital |
| Adjuntos **imagen** en mensajes (50/mes) | Anuncios canal mensajes (= producto aparte) |

Todo eso son **cupos distintos** en distintas superficies, no “6 fotos para todo”.

---

## Impacto en dashboard de uso (ENT-020)

El anunciante debe ver **desglosado**:

```
Galería perfil     4 / 6 fotos
Video perfil       0 / 1
Estados activos    1 / 2
Live este mes      — (requiere Premium)
Chat adjuntos mes  12 / 50
Espacio total      42 MB / 150 MB
```

Así entiende que mandar 12 imágenes por mensaje **no le quita** cupo de las 6 fotos del perfil (salvo el techo global de GB).

---

## Preguntas frecuentes

**¿La misma imagen en perfil y en estado cobra dos veces?**  
No en almacenamiento. Sí puede generar más **vistas** (egress) si mucha gente la ve en ambos sitios.

**¿Los mensajes gastan las 6 fotos del trial?**  
No. Tienen cupo propio (`adjuntosChatMesMax`).

**¿El recuadro de live en perfil es otra foto?**  
No. Es el player del live; cuenta minutos de transmisión, no `fotosMax`.

**¿Básico de pago después del trial qué pierde?**  
Galería 3 fotos, sin estados, sin lives, sin adjuntos chat — la vitrina se simplifica; no es lo mismo que el trial Destacado.
