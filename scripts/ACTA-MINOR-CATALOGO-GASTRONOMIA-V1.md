# Acta MINOR catálogo — MP-RESTAURANTES-GASTRONOMIA-BEBIDAS-V1

**Estado:** Aprobada Fase 0 · Apply Fase 1 autorizado  
**Fecha:** 2026-06-27  
**Semver catálogo:** `1.2.0`  
**Schema version:** `2026-06-27-gastronomia`  
**sectorId (legacy):** `restaurantes`  
**Nombre público:** Restaurantes, Gastronomía y Bebidas  
**Nested key perfil:** `gastronomiaPerfil`

## Resumen

Migración **32 subcategorías legacy → 24 canon**, con **7 exclusiones** hacia otros sectores y aliases de búsqueda/registro. Separa gastronomía real de vida nocturna/adultos y de catering/banquetes de Eventos.

## Decisiones cerradas (Fase 0)

| Tema | Decisión |
|------|----------|
| Nested key | `gastronomiaPerfil` (no `restaurantesPerfil`) |
| Food truck | `food-trucks-gastronomia` = operación recurrente; eventos privados = campo especialidad |
| restaurante-bar | → `bares` (gastronómico); antros → Adultos |
| Acta | Esta MINOR autoriza sync Home/catálogo vía apply |

## Exclusiones (fuera del sector)

### → Adultos

| Legacy | Destino |
|--------|---------|
| antros-y-bares | adultos-entretenimiento |
| vida-nocturna | adultos-entretenimiento |

### → Eventos

| Legacy | Canon Eventos |
|--------|----------------|
| banquetes | banquetes-catering-eventos |
| catering | banquetes-catering-eventos |
| catering-independiente | banquetes-catering-eventos |
| preparacion-de-banquetes | banquetes-catering-eventos |
| mesero-para-eventos | organizadores-produccion-eventos |

## Tabla legacy → canon (25 entradas)

| Legacy | Canon |
|--------|-------|
| chef-privado | chef-cocinero-domicilio |
| repostero | pastelerias-reposteria |
| panadero-independiente | panaderias |
| parrillero | carnes-asadas-parrilla |
| cocinero-a-domicilio | chef-cocinero-domicilio |
| bartender | bartender-servicio |
| elaboracion-de-postres | pastelerias-reposteria |
| comida-saludable | cocina-economica |
| restaurante | restaurantes-tradicional |
| restaurante-bar | bares |
| cafeteria | cafeterias |
| pasteleria | pastelerias-reposteria |
| panaderia | panaderias |
| taqueria | taquerias |
| pizzeria | pizzerias |
| hamburgueseria | hamburgueserias |
| food-truck | food-trucks-gastronomia |
| cocina-economica | cocina-economica |
| marisqueria | marisquerias |
| buffet | buffet-comedor |
| heladeria | neverias-heladerias |
| dark-kitchen | dark-kitchen |
| distribuidora-de-alimentos | distribuidoras-alimentos-bebidas |
| distribuidora-de-bebidas | distribuidoras-alimentos-bebidas |
| comida-a-domicilio | comida-a-domicilio |

## 24 canon aprobados

1. restaurantes-tradicional  
2. marisquerias  
3. cocina-economica  
4. taquerias  
5. hamburgueserias  
6. pizzerias  
7. polleryas-alitas  
8. sushi-cocina-asiatica  
9. carnes-asadas-parrilla  
10. cafeterias  
11. panaderias  
12. pastelerias-reposteria  
13. neverias-heladerias  
14. juguerias  
15. food-trucks-gastronomia  
16. comida-a-domicilio  
17. dark-kitchen  
18. bares  
19. cervecerias  
20. cantinas-vinotecas  
21. buffet-comedor  
22. chef-cocinero-domicilio  
23. bartender-servicio  
24. distribuidoras-alimentos-bebidas  

## Tabla canon → pack

| Canon | Pack |
|-------|------|
| restaurantes-tradicional, marisquerias, cocina-economica, carnes-asadas-parrilla | LOCAL_DINE |
| taquerias, hamburgueserias, pizzerias, polleryas-alitas, sushi-cocina-asiatica | FAST_CASUAL |
| panaderias, pastelerias-reposteria, neverias-heladerias | BAKERY_DESSERT |
| cafeterias, juguerias | CAFE |
| food-trucks-gastronomia | MOBILE |
| comida-a-domicilio, dark-kitchen | DELIVERY |
| bares, cervecerias, cantinas-vinotecas | BAR_BEBIDAS |
| buffet-comedor | BUFFET |
| chef-cocinero-domicilio, bartender-servicio | PRO_SERVICE |
| distribuidoras-alimentos-bebidas | B2B_DIST |

## Archivos tocados por apply Fase 1

- `scripts/gastronomia-packs-v1.mjs` (fuente de verdad)
- `scripts/mapa-registro-categorias.json`
- `scripts/config-registro-*-schema.json`
- `scripts/MATRIZ-FORMULARIO-UI-REGISTRO.json`
- `scripts/busqueda-enriquecimiento.json`
- `scripts/catalogo-expandido-datos.json`
- `public/js/sectores-carihub.js` (nombre + 24 subs)
- `scripts/arquetipos-catalogo.mjs`
- `scripts/gastronomia-legacy-subcategoria-aliases.json`

## No tocado (congelado)

Adultos/Bienestar/Eventos **runtime**, preview/ficha/render, Firestore Rules, Auth, Storage, Hosting, pagos, Geo F1.

## Validación

```bash
node scripts/apply-gastronomia-deltas-v1.mjs
node scripts/qa-gastronomia-deltas-v1-schema.mjs
```
