# Observación arquitectónica — Modularización General de Aplicaciones CariHub

| Campo | Valor |
|-------|-------|
| **Versión** | **1.0.0** |
| **Fecha** | 2026-06-09 |
| **Estado** | Plano modular — **sin SPEC, sin runtime** |
| **Runtime / carpetas / Firestore** | **NO** |

Canónico: [`OBSERVACION-ARQUITECTONICA-MODULARIZACION-APLICACIONES.json`](./OBSERVACION-ARQUITECTONICA-MODULARIZACION-APLICACIONES.json)

---

## Propósito

Definir el **plano futuro** de separación modular del ecosistema CariHub **antes** de crear nuevas aplicaciones. La app pública principal debe permanecer enfocada en descubrimiento y visualización; el resto se diseña como apps o subapps separadas con carga diferida.

---

## Núcleo público principal (app liviana)

| Aspecto | Valor |
|---------|-------|
| **Alcance** | Home · Resultados · Perfil público |
| **Rutas** | `/` · `/resultados` · `/perfil/:perfilId` |
| **Visibilidad** | Público |
| **Auth** | Opcional (sesión ligera) |
| **Admin** | No |
| **Datos sensibles** | No |
| **Pesado en Home** | No |
| **Estado** | **Parcial** (`index.html` mezcla modales legacy) |
| **Prioridad** | **P0** — delimitar núcleo |

**Dependencias:** Catálogo · Render futuro · SEO · migración perfiles (diseño).

---

## Módulos separados

| Módulo | Ruta sugerida | Público/Privado | Auth | Admin | Sensible | No en Home | Estado | Prioridad |
|--------|---------------|-----------------|------|-------|----------|------------|--------|-----------|
| **Registro / Wizard** | `/registro` | Semi-público | Sí / Turnstile | No | **Sí** | **Sí** | Congelado diseño | P1 (#2) |
| **Dashboards** | `/cuenta` | Privado | Sí | No | **Sí** | **Sí** | **Congelado** | P1 (#3) |
| **Messenger** | `/messenger` | Privado | Sí | No* | **Sí** | **Sí** | **Congelado** | P2 (#5) |
| **Admin** | `/admin` | Privado | Sí | **Sí** | **Sí** | **Sí** | Parcial | P1 (#4) |
| **Pagos / Contratos** | `/cuenta/contratos` | Privado | Sí | No* | **Sí** | **Sí** | Pendiente | P2 (#6) |
| **Banners / Publicidad** | `/anuncios` | Privado | Anunciante | No* | No | **Sí** | Parcial | P2 (#7) |
| **Interacciones** | `/interacciones` | Mixto | Publicar sí | No* | **Sí** | **Sí** | Observación | P3 (#8) |
| **Render / Landings** | `/p/:slug` | Público | No | No | No | Isla lazy | Pendiente | P1 (#2) |
| **ThemeEngine** | `/cuenta/apariencia` | Privado | Sí | No* | No | **Sí** | Observación | P4 (#10) |
| **SEO / Landings** | `/s/:slug` | Público | No | No | No | No | Observación | P2 (#3) |
| **Agentes / IA** | *(transversal)* | Privado | Sí | Parcial | **Sí** | **Sí** | Futuro | P5 (#11) |

\* Rutas admin separadas bajo `/admin/...`

---

## Mapa modular general

```
┌─────────────────────────────────────────────────────────────┐
│  APP PÚBLICA (bundle liviano)                               │
│  /  /resultados  /perfil/:id                                │
│  + islas lazy: Render · SEO landings                        │
└───────────────────────────┬─────────────────────────────────┘
                            │
     ┌──────────────────────┼──────────────────────┐
     ▼                      ▼                      ▼
┌─────────────┐    ┌─────────────┐        ┌─────────────┐
│ APP CUENTA  │    │ APP MESSENGER│        │ APP ADMIN   │
│ /cuenta     │    │ /messenger   │        │ /admin      │
│ · Dashboards│    │              │        │             │
│ · Wizard    │    └─────────────┘        └─────────────┘
│ · Pagos     │
│ · Banners   │    ┌─────────────┐
│ · Theme     │    │ APP SOCIAL  │ (futuro)
└─────────────┘    │ Interacciones│
                   └─────────────┘

Capas transversales (diseño, no apps):
  Catálogo · Cuentas · Seguridad · ValidationEngine · FieldEngine
```

### Apps futuras sugeridas

| App | Módulos | Bundle |
|-----|---------|--------|
| **CariHub Público** | Home, Resultados, Perfil | Liviano |
| **CariHub Cuenta** | Dashboards, Wizard, Pagos, Banners, Theme | Medio |
| **CariHub Messenger** | Messenger | Medio + realtime |
| **CariHub Admin** | Admin, moderación | Pesado interno |
| **CariHub Social** | Interacciones, stories, live | Pesado futuro |

---

## Orden recomendado de separación futura

| Fase | Nombre | Módulos | Prioridad |
|------|--------|---------|-----------|
| **1** | Delimitar núcleo público | Home, Resultados, Perfil | **P0** |
| **2** | Render + SEO público | Render landings, SEO | **P1** |
| **3** | Cuenta y registro | Wizard, Dashboards shell | **P1** |
| **4** | Admin separado | Admin | **P1** |
| **5** | Messenger | Messenger | **P2** |
| **6** | Comercial | Pagos, Banners | **P2** |
| **7** | Social | Interacciones | **P3** |
| **8** | Personalización | ThemeEngine | **P4** |
| **9** | IA transversal | Agentes sistema | **P5** |

**Precondiciones globales pre-runtime:** acta migración perfiles ejecutada · autorización runtime por capa · sin mezclar bundles en `index.html`.

---

## Principios

1. La app pública **no** importa wizard, messenger, admin ni pagos en el bundle inicial.
2. Firebase Auth compartido; subapps **lazy** tras login.
3. **ValidationEngine** como gate transversal — no duplicar por app.
4. **Dashboards** = hub cuenta; no sustituye Messenger ni Admin.
5. **Admin** siempre app separada (congelado Dashboards 1.0.0).
6. Datos sensibles solo en apps privadas con VE + Seguridad MVP.
7. **No crear carpetas ni mover archivos** hasta acta/SPEC por app.

---

## Producción vs plano

| | Hoy | Objetivo |
|--|-----|----------|
| **Frontend** | `index.html` monolito + modales | App pública + subapps lazy |
| **Datos** | `usuarios/{uid}` monolito | Hub + perfiles (acta diseño) |
| **Runtime** | **NO autorizado** | Por fases con PO |

---

*Observación arquitectónica — no modifica capas congeladas ni ValidationEngine.*
