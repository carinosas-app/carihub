# Acta — Directory Mode Hide B0 + B1 (dashboard)

| Campo | Valor |
|-------|-------|
| **Versión acta** | 1.0.0 |
| **Marca** | Cariñosas |
| **Fase** | Directory Mode Phase B — slice **B0 + B1** |
| **Fecha** | 2026-07-16 |
| **Estado** | **AUTORIZADO e implementado (UI only)** |
| **Repo** | CariHub (`main` working tree) |
| **SSOT producto** | `docs/gpt-knowledge/PRODUCTO-FASE-1-MARKETPLACE.md` |

---

## Objeto

Activar **Directory Mode** por defecto en el **dashboard rentero**: ocultar superficies de Future Architecture (mensajes internos, estados/red de socios, lives, anuncios canal mensajes, privacidad mensajes) **sin borrar** código, Firestore rules ni Functions.

**B0:** flag + rollback + esta acta.  
**B1:** hide dashboard (nav, rail lives, módulos, widgets Inicio relacionados).

**Fuera de este slice (B2+):** home `?abrir=mensajes`, botón `msg` en perfil público, toggles registro/banner.

---

## Flag

| Pieza | Valor |
|-------|-------|
| Script | `public/js/directory-mode.js` |
| Default | **Directory Mode ON** (social oculto) |
| Rollback / QA | `?futureSocial=1` o `?directoryMode=0` **solo** en localhost / `127.0.0.1` / `*.localhost` / LAN privada / `?preview=1&hub=1` |
| Producción | Query override **ignorado** (Directory Mode permanece ON) |
| Nota QA local | Preferir URL limpia `/dashboard-rentero?futureSocial=1` (evitar `*.html?…` si el static server hace 301 y pierde el query) |
| Integración | `DashAccountCapabilities.canOpenModule` niega módulos sociales; `applyUI` + `[data-fase1-hide="social"]` |

---

## Módulos bloqueados (B1)

`mensajes` · `estados` · `lives` · `transmitir-live` · `anuncios-mensajes` · `anunciar-mensajes` · `privacidad-mensajes` · `feed-red` · `publicaciones`

## Conservado (Fase 1)

Inicio (preview) · Buscar · Favoritos · Avisos · Solicitudes · Anunciar (canal perfil) · Info pública · Medios contacto · Banners · Estadísticas (métrica inbox ocultable) · Configuración · Soporte · rail perfiles/banners · slots banner `*_estados`/`*_libe` (inventario, no tocados).

---

## Rollback

1. **Solo QA local/dev:** abrir dashboard con `?futureSocial=1` (o `?directoryMode=0`) en localhost / emulador / preview hub.  
2. En **hosting de producción**, esos query params **no** reactivan Future Architecture.  
3. O revertir commits de este slice.  
4. **No** requiere cambios Firebase.

---

## Prohibido en este slice

- Deploy Firebase / changes a rules o Functions  
- Borrar scripts messenger / lives  
- Ocultar inventario de banners `*_estados` / `*_libe`  
- Cambios a registro core, resultados, perfil público `msg` (B2)

---

*Acta B0+B1 — autorización product owner 2026-07-16*
