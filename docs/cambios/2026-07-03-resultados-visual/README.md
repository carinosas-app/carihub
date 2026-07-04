# Cambios visuales — Resultados (2026-07-03)

Documentación de los cambios aplicados en la pantalla de **resultados de búsqueda** durante la sesión del 3 de julio de 2026.

## Resumen

| Bloque | Qué se hizo |
|--------|-------------|
| **Tema LGBT** | Fondo arcoíris fuerte (rojo, naranja, amarillo, verde, azul, morado) con mezcla suave |
| **Destellos LGBT** | Capas animadas de sparkles y brillo sobre el fondo (`body::before` / `::after`) |
| **Banners LGBT** | 3 imágenes PNG temáticas (bandera, nightlife, corazón arcoíris) |
| **Banners negocio adultos** | 6 imágenes fotográficas por subcategoría (sex shop, spa, masajes, antro, antro LGBT, hotel) |
| **Colabora en redes** | Fila dorada destacada en tarjeta, debajo de ubicación, con valor («Sí» / «A convenir») |

## Cómo ver la vista previa

1. Levantar servidor local:

```bash
npx http-server public -p 8765 -c-1
```

2. Abrir en el navegador (siempre con `?vista=con-resultados` para datos demo):

| Qué revisar | URL |
|-------------|-----|
| Atajo vista previa | http://localhost:8765/preview/resultados-vista-previa.html |
| LGBT — escort gay | http://localhost:8765/resultados.html?vista=con-resultados&categoria=escort%20gay&pais=México |
| LGBT — lesbians | http://localhost:8765/resultados.html?vista=con-resultados&categoria=lesbians&pais=México |
| Negocio — hotel | http://localhost:8765/resultados.html?vista=con-resultados&categoria=hotel%20motel&pais=México |
| Colabora en redes (cualquier sector con demo) | http://localhost:8765/resultados.html?vista=con-resultados&categoria=spa&pais=México |

Recargar con **Ctrl+F5** si no se ven los estilos nuevos.

## Archivos modificados

Ver [ARCHIVOS.md](./ARCHIVOS.md).

## Detalle técnico

Ver [DETALLE-TECNICO.md](./DETALLE-TECNICO.md).

## Assets nuevos

Ver [ASSETS.md](./ASSETS.md).

## Pendientes (no bloqueadores)

- **Mejora futura:** fotos demo de tarjetas Hotel/Motel y algunos perfiles LGBT siguen usando placeholders del pool escort; los **datos** y **badges** son correctos, solo la miniatura demo no es representativa.
- **Mejora futura:** banners para negocios adultos no incluidos en alcance (club SW, cabinas, cine XXX) — solo las 6 subcategorías «neutras» acordadas.

## Versiones de caché (resultados.html)

| Recurso | Versión |
|---------|---------|
| `css/resultados.css` | `v=20260703res25` |
| `js/carihub-resultados-sector.js` | `v=20260703sec7` |
| `js/carihub-public-render-lite.js` | `v=20260703rl3` |
| `js/banner-resultados-principales.js` | `v=20260703ban3` |
| `js/resultados-demo.js` | `v=20260703demo4` |
