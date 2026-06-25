# ANEXO — Contenido orgánico vs espacios de renta (Estados · LIBE)

**Fecha:** 2026-06-20  
**Estado:** ANEXO DE DISEÑO DOCUMENTAL — regla de producto aprobada  
**Modo:** Solo documentación. No runtime · no altera actas congeladas · **no modifica** `PLANES-CARIHUB-DEFINICION-FINAL.md`

> Este anexo documenta **dónde y cómo** aparecen estados y lives en la app pública.  
> Los **beneficios de planes de perfil** (trial, Básico, Profesional, Premium, VIP) siguen definidos únicamente en `PLANES-CARIHUB-DEFINICION-FINAL.md` y `config-plan-entitlements-schema.json`.  
> La distinción orgánico/renta **no es un beneficio de plan**; es una regla de **superficie y monetización**.

**Relacionado:** `PLAN-MAESTRO-BANNERS-PUBLICIDAD.json`, `ANEXO-ESTRATEGICO-BANNERS-PUBLICIDAD.md`, `MODELO-CONTEO-MEDIA-PLANES.md`, `config-anuncios-mensajes-schema.json`, `.cursor/rules/dashboard-mensajes-vision.mdc`

---

## 1. Regla de oro (aprobada)

| Tipo | Origen | Costo para el publicador | Dónde puede verse |
|------|--------|--------------------------|-------------------|
| **Contenido orgánico** | Publicado desde el **Dashboard del rentero** (su perfil / canales propios del plan) | **Gratis** — cupos según plan de perfil | **Su perfil** («Actividad reciente») y canales scoped del plan (p. ej. strip mensajes) |
| **Espacios de renta** | Contrato de slot pagado (`registro-banner.html`, checkout banner) | **Pago** — slot + ventana de tiempo | **Home**, **Categorías**, **Resultados** y demás pantallas principales con inventario publicitario |

**Fuera de la vitrina orgánica del rentero, cualquier aparición en pantallas principales es renta. Sin excepciones.**

---

## 2. Contenido orgánico (gratis)

### 2.1 Qué puede publicar el rentero desde su Dashboard

| Publicación | Superficie principal | Notas |
|-------------|---------------------|-------|
| **Estado** | Perfil → columna «Actividad reciente» | Refleja lo publicado en Dashboard; no sale en Home/Resultados sin rentar |
| **Live** | Perfil → «Actividad reciente» mientras transmite | Visible en la ficha del dueño; donaciones posibles desde vista de perfil (diseño futuro) |
| **Estado canal mensajes** | Strip horizontal arriba del módulo Mensajes | Canal **mensajes** ≠ canal **perfil** (`config-anuncios-mensajes-schema.json`) |

### 2.2 Qué NO es orgánico

- Ocupar `home_estados`, `home_libe`, slots de categorías o resultados.
- Aparecer en la franja LIBE/Estados de **Resultados** sin contrato de renta vigente.
- Confundir trial de perfil con renta de visibilidad en el sitio.

### 2.3 Cupos orgánicos

Los límites (cuántos estados activos, minutos de live en perfil, estados/día en mensajes) se resuelven vía **plan de perfil** y `config-plan-entitlements-schema.json`.  
**Este anexo no redefine esos cupos** — solo aclara que usarlos en la vitrina propia **no implica pago de slot**.

---

## 3. Espacios de renta (pago)

### 3.1 Quién puede rentar

- **Cualquier usuario con cuenta** (hub o publicador).
- No sustituye el plan de perfil; es producto **independiente**, mismo ecosistema que banners (`PLAN-MAESTRO-BANNERS-PUBLICIDAD.json`).

### 3.2 Inventario por pantalla

| Pantalla | Slots rentables | Sin slots Estados/LIBE |
|----------|-----------------|------------------------|
| **Home** | Columna izquierda: **Estados** + **LIBE** (`home_estados`, `home_libe`) | — |
| **Geo picker** (elegir país/estado/ciudad) | Solo banner superior | **Sin** Estados ni LIBE laterales |
| **Categorías** (tarjeta «Explora…» desplegada) | Izq: Estados · Centro: banner · Der: LIBE | — |
| **Resultados** | Arriba: 3 banners · Abajo: LIBE + Estados | Segmentación geo/categoría según paquete |
| **Perfil público** | Arriba: 3 banners | **Sin** LIBE/Estados de renta pública en la ficha |

Implementación UI de referencia: `ch-slot-dock.js`, `banner-home-laterales.js`, `banner-resultados-laterales.js`, `registro-banner.html`.

### 3.3 Segmentación de renta (resultados y landings)

El comprador puede contratar visibilidad por combinación de:

- categoría (sector / subcategoría)
- categoría + país
- categoría + país + estado
- categoría + país + estado + ciudad (según paquete)

Claves geo-contextuales: ver `ANEXO-ESTRATEGICO-BANNERS-PUBLICIDAD.md` §1.3.

### 3.4 Programación y duración

| Aspecto | Diseño |
|---------|--------|
| **Activación inmediata** | Paga/transfiere → slot activo en ventana contratada |
| **Programación** | Ej.: mañana 15:00, 15 min o 1 h — horario **reservado** para el rentador |
| **Modelo de precio** | **Por definir** (candidato: cobro por minuto + variante geo/categoría) |
| **Retención media** | Live rentado: sin grabación permanente; thumb/recorte efímero (TTL por definir) |
| **Estados rentados** | Visibles en slot contratado durante vigencia del contrato |

### 3.5 Donaciones en lives rentados

- Espectadores en un **live de slot rentado** pueden enviar donaciones/regalos al streamer.
- Espectadores que ven un **live orgánico en el perfil** del rentero también pueden donar (mismo motor de liquidación objetivo).
- **Por implementar:** split plataforma, impuestos/retenciones, neto al streamer (`PLAN-MAESTRO-ECONOMIA-SOCIAL.md`, `ANEXO-AUTOPROPINAS-CUENTAS-RELACIONADAS.md`).

---

## 4. Mapa visual resumido

```
ORGÁNICO (gratis, plan perfil)          RENTA (pago, contrato slot)
─────────────────────────────          ────────────────────────────
Dashboard → Perfil                      Home: Estados | LIBE
  └ Actividad reciente                    Categorías: Est | Banner | LIBE
Dashboard → Mensajes (strip)              Resultados: 3 banners + LIBE + Est
  └ canal mensajes (cupos plan)           Perfil: solo 3 banners arriba
```

**Cruce prohibido:** un live o estado orgánico **no** aparece en `home_libe` / `resultados_libe` / etc. sin contrato de renta activo para ese `slotId` + geo + horario.

---

## 5. Copy y comunicación

| Contexto | Decir | No decir |
|----------|-------|----------|
| Trial / registro perfil | Galería, mensajes, vitrina en tu perfil | «Lives gratis en Home» |
| Renta | «Renta un espacio para tu estado o live» | Incluir renta como beneficio del plan |
| Dashboard rentero | «Publica en tu perfil» vs «Renta visibilidad en el sitio» | Mezclar ambos en un solo CTA |

---

## 6. Gates de implementación (referencia)

### 6.1 Orgánico

- `planId` + cupos en `perfiles/{id}/usage/current`
- Perfil en estado `publicado` (aprobado) para contenido visible
- Canales separados: perfil vs mensajes (`dashboard-mensajes-vision`)

### 6.2 Renta

- Contrato banner/slot: `slotId`, geo, categoría, `fechaInicio`, `fechaVencimiento`, horario programado
- Inventario y rotación: admin + `seed-configuracion-publicidad.json`
- Sin contrato vigente → slot muestra placeholder «Anúnciate aquí» (`ch-slot-dock.js`)

---

## 7. Qué documentos tocar / no tocar

| Documento | Acción |
|-----------|--------|
| `PLANES-CARIHUB-DEFINICION-FINAL.md` | **No alterar** con reglas de renta/orgánico |
| `config-plan-entitlements-schema.json` | Solo cupos de vitrina orgánica; no slots de renta |
| **Este anexo** | Fuente de verdad para orgánico vs renta |
| `PLAN-MAESTRO-BANNERS-PUBLICIDAD.json` | Detalle operativo de slots, precios, contratos |

---

## 8. Pendientes de producto (fuera de alcance de este anexo)

1. Precio renta LIBE/Estados — ¿por minuto, paquete fijo o ambos?
2. Cupos orgánicos exactos por plan (estados en perfil, live en perfil, estados/día en mensajes).
3. Motor de donaciones — comisión, impuestos, payout al streamer.
4. TTL de media efímera (chat, thumb live, estado vencido).

---

*Anexo creado para mantener la documentación ordenada: planes = suscripción de perfil; este archivo = reglas de publicación y renta de superficies.*
