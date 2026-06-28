/**
 * QA — Pack persona_acompanante render tarjeta + ficha toggles (sin browser).
 * H2: cobertura 15/15 subs persona_acompanante (tarjeta + ficha donde aplique).
 * H6: DEMO/ficha pública edecan, modelos, dotados, femboy, singles.
 *
 * Matriz subs: escort, escort gay, escort vip, edecan, modelos, gigolo, acompanante,
 * petit, trans, femboy, singles, lesbians, tom boy, tom fem, dotados.
 *
 * node scripts/qa-persona-acompanante-render.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const root = path.join(repoRoot, 'public', 'js');

/** 15 subs oficiales del pack escort (persona_acompanante). */
const PERSONA_ACOMPANANTE_15 = [
  'escort', 'escort_gay', 'escort_vip', 'edecan', 'modelos', 'gigolo', 'acompanante',
  'petit', 'trans', 'femboy', 'singles', 'lesbians', 'tom_boy', 'tom_fem', 'dotados',
];

const pass = [];
const fail = [];
const cardCoverage = new Set();

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

function okCard(subKey, name, cond, detail) {
  if (cond) cardCoverage.add(subKey);
  ok(name, cond, detail);
}

function loadScript(relativePath, ctx) {
  const code = fs.readFileSync(path.join(root, relativePath), 'utf8');
  vm.runInContext(code, ctx, { filename: relativePath });
}

function makeCtx() {
  const ctx = {
    console,
    URL,
    document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] },
  };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  return ctx;
}

function extractDemoBlock(html, marker) {
  const re = new RegExp(`/\\* ${marker}[\\s\\S]*?DEMO\\.\\w+=\\{([\\s\\S]*?)\\n\\};`);
  const m = html.match(re);
  return m ? m[0] : '';
}

function extractDemoObject(html, demoKey) {
  const re = new RegExp(`DEMO\\.${demoKey}=\\{([\\s\\S]*?)\\n\\};`);
  const m = html.match(re);
  return m ? m[0] : '';
}

function normSubFichaId(subId) {
  return String(subId || '').trim().toLowerCase().replace(/_/g, ' ');
}

function fichaShowsModalidadRow(u) {
  if (normSubFichaId(u.subcategoriaId) === 'singles') return false;
  const modalidad = u.modalidadFicha || ((u.modalidades || []).map((m) => {
    if (m === 'recibe') return 'Recibe';
    if (m === 'hotel') return 'Hotel';
    if (m === 'domicilio') return 'Domicilio';
    if (m === 'viaja') return 'Viaja';
    return m;
  }).join(' · ') || '');
  return !!modalidad;
}

function mostrarPublico(u, visibilityKey, contentVal) {
  if (contentVal == null || String(contentVal).trim() === '') return false;
  if (Array.isArray(contentVal) && !contentVal.length) return false;
  const vis = String(u[visibilityKey] || 'Sí').trim().toLowerCase();
  return vis === 'sí' || vis === 'si' || vis === 'yes' || vis === 'true';
}

function fichaLesbiansRows(u) {
  const rows = [];
  if (mostrarPublico(u, 'mostrarAtiendoA', u.atiendoA)) rows.push('atiendoA');
  if (mostrarPublico(u, 'mostrarColaboraciones', u.haceColaboraciones)) rows.push('colaboraciones');
  if (mostrarPublico(u, 'mostrarColaboraciones', u.haceColaboraciones) && Array.isArray(u.colaboraCon) && u.colaboraCon.length) {
    rows.push('colaboraCon');
  }
  return rows;
}

/** Mirror adultoFichaHTML + dotadosAtencionPublica toggles (perfil-publico.html). */
function fichaDotadosRows(u) {
  const rows = [];
  if (mostrarPublico(u, 'mostrarLongitudPublico', u.longitudCm)) rows.push('longitud');
  if (mostrarPublico(u, 'mostrarLongitudPublico', u.categoriaTamaño)) rows.push('categoriaTamano');
  if (mostrarPublico(u, 'mostrarAtencionHombresPublico', u.atencionHombres)) rows.push('atencionHombres');
  if (mostrarPublico(u, 'mostrarAtencionMujeresPublico', u.atencionMujeres)) rows.push('atencionMujeres');
  if (mostrarPublico(u, 'mostrarAtencionParejasPublico', u.atencionParejas)) rows.push('atencionParejas');
  if (mostrarPublico(u, 'mostrarAtencionTransPublico', u.atencionTrans)) rows.push('atencionTrans');
  return rows;
}

function fichaEdecanRows(u) {
  const rows = [];
  if (u.experienciaProfesional) rows.push('experienciaProfesional');
  if (Array.isArray(u.tiposEvento) && u.tiposEvento.length) rows.push('tiposEvento');
  if (Array.isArray(u.serviciosIncluidos) && u.serviciosIncluidos.length) rows.push('serviciosProfesionales');
  if (Array.isArray(u.noRealiza) && u.noRealiza.length) rows.push('restriccionesProfesionales');
  if (u.eventosDisponibles) rows.push('eventos');
  return rows;
}

function fichaModelosRows(u) {
  const rows = [];
  if (u.experienciaProfesional) rows.push('experienciaProfesional');
  if (Array.isArray(u.tiposModelaje) && u.tiposModelaje.length) rows.push('tiposModelaje');
  if (Array.isArray(u.serviciosIncluidos) && u.serviciosIncluidos.length) rows.push('serviciosProfesionales');
  if (Array.isArray(u.noRealiza) && u.noRealiza.length) rows.push('restriccionesProfesionales');
  if (u.portfolioURL) rows.push('portfolio');
  return rows;
}

function fichaTransRows(u) {
  return u.identidadGenero ? ['identidadGenero'] : [];
}

function fichaFemboyRows(u) {
  const rows = [];
  if (u.presentacionFemboy) rows.push('presentacion');
  if (u.estiloPredominante) rows.push('estilo');
  if (Array.isArray(u.disponibilidadAgenda) && u.disponibilidadAgenda.length) rows.push('disponibilidad');
  if (Array.isArray(u.disponiblePara) && u.disponiblePara.length) rows.push('disponiblePara');
  return rows;
}

function fichaSinglesRows(u) {
  const rows = [];
  if (Array.isArray(u.buscanConocer) && u.buscanConocer.length) rows.push('buscanConocer');
  if (u.personalidadPredominante) rows.push('personalidad');
  if (u.estiloPersonal) rows.push('estiloPersonal');
  if (Array.isArray(u.disponibilidadAgenda) && u.disponibilidadAgenda.length) rows.push('disponibilidad');
  return rows;
}

function cardHasViajaChip(html) {
  return html.includes('Viaja: Sí') || html.includes('>Viaja<') || /modchip mc-teal[^>]*>[\s\S]*Viaja/.test(html);
}

let ctx;

try {
  ctx = makeCtx();
  loadScript('carihub-viajes-desplazamiento.js', ctx);
  loadScript('carihub-public-render-lite.js', ctx);
  const PR = ctx.CariHubPublicRenderLite;
  const V = ctx.CariHubViajesDesplazamiento;
  ok('load render lite', !!PR && !!PR.cardHTMLAdultos, 'render');

  const perfilHtml = fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
  ok('DEMO escortGay presente', extractDemoBlock(perfilHtml, 'Escort Gay').includes('subcategoriaId:"escort_gay"'), 'demo gay');
  ok('DEMO escortVip presente', extractDemoBlock(perfilHtml, 'Escort VIP').includes('badgeVip:true'), 'demo vip');
  ok('DEMO trans presente', extractDemoBlock(perfilHtml, 'Trans — schema: trans').includes('identidadGenero') || perfilHtml.includes('DEMO.trans='), 'demo trans');

  // --- H6: DEMO ficha pública gaps ---
  const demoEdecan = extractDemoObject(perfilHtml, 'edecan');
  ok('H6 DEMO edecan presente', demoEdecan.includes('subcategoriaId:"edecan"'), 'edecan');
  ok('H6 DEMO edecan eventosDisponibles', /eventosDisponibles\s*:\s*true/.test(demoEdecan), demoEdecan.slice(0, 120));
  ok('H6 DEMO edecan tiposEvento v3', demoEdecan.includes('tiposEvento:') && demoEdecan.includes('Coctel corporativo'), 'tiposEvento');
  ok('H6 DEMO edecan experienciaProfesional v3', demoEdecan.includes('experienciaProfesional:'), 'experienciaProfesional');
  ok('H6 DEMO edecan edecanPerfil nested', demoEdecan.includes('edecanPerfil:'), 'nested');

  const demoModelos = extractDemoObject(perfilHtml, 'modelos');
  ok('H6 DEMO modelos presente', demoModelos.includes('subcategoriaId:"modelos"'), 'modelos');
  ok('H6 DEMO modelos portfolioURL', demoModelos.includes('portfolioURL:') && demoModelos.includes('https://'), demoModelos.match(/portfolioURL:"[^"]+"/)?.[0]);
  ok('H6 DEMO modelos tiposModelaje v3', demoModelos.includes('tiposModelaje:') && demoModelos.includes('Editorial'), 'tiposModelaje');
  ok('H6 DEMO modelos modelosPerfil nested', demoModelos.includes('modelosPerfil:'), 'nested');

  const demoDotados = extractDemoObject(perfilHtml, 'dotados');
  ok('H6 DEMO dotados presente', demoDotados.includes('subcategoriaId:"dotados"'), 'dotados');
  ok('H6 DEMO dotados longitudCm', demoDotados.includes('longitudCm:"19"'), 'longitud');
  ok('H6 DEMO dotados toggles', demoDotados.includes('mostrarLongitudPublico:"Sí"') && demoDotados.includes('mostrarAtencionMujeresPublico:"Sí"'), 'toggles');

  const demoFemboy = extractDemoObject(perfilHtml, 'femboy');
  ok('H6 DEMO femboy presente', demoFemboy.includes('subcategoriaId:"femboy"'), 'femboy');
  ok('H6 DEMO femboy delta campos', demoFemboy.includes('presentacionFemboy:') && demoFemboy.includes('estiloPredominante:') && demoFemboy.includes('disponiblePara:'), 'delta');

  const demoSingles = extractDemoObject(perfilHtml, 'singles');
  ok('H6 DEMO singles presente', demoSingles.includes('subcategoriaId:"singles"'), 'singles');
  ok('H6 DEMO singles buscanConocer', demoSingles.includes('buscanConocer:'), 'buscan');
  ok('H6 DEMO singles sin modalidades escort', !demoSingles.includes('modalidades:') && !demoSingles.includes('modalidadFicha:'), 'sin modalidades');
  const demoGigolo = extractDemoObject(perfilHtml, 'gigolo');
  ok('H7 DEMO gigolo presente', demoGigolo.includes('subcategoriaId:"gigolo"'), 'gigolo');
  ok('H7 DEMO gigolo persona', demoGigolo.includes('categoria:"Gigolo"') && demoGigolo.includes('modalidades:'), 'gigolo persona');

  const demoLesbians = extractDemoObject(perfilHtml, 'lesbians');
  ok('H7 DEMO lesbians presente', demoLesbians.includes('subcategoriaId:"lesbians"'), 'lesbians');
  ok('H7 DEMO lesbians toggles', demoLesbians.includes('mostrarAtiendoA:"Sí"') && demoLesbians.includes('mostrarColaboraciones:"Sí"'), 'toggles');

  const demoTomBoy = extractDemoObject(perfilHtml, 'tomBoy');
  ok('H7 DEMO tomBoy presente', demoTomBoy.includes('subcategoriaId:"tom_boy"'), 'tomBoy');
  ok('H7 DEMO tomBoy presentacion', demoTomBoy.includes('presentacionTom:') && demoTomBoy.includes('estiloPredominante:'), 'tomBoy fields');

  const demoTomFem = extractDemoObject(perfilHtml, 'tomFem');
  ok('H7 DEMO tomFem presente', demoTomFem.includes('subcategoriaId:"tom_fem"'), 'tomFem');
  ok('H7 DEMO tomFem presentacion', demoTomFem.includes('presentacionTom:') && demoTomFem.includes('estiloPredominante:'), 'tomFem fields');

  const demoEscort = extractDemoObject(perfilHtml, 'escort');
  ok('H8 DEMO escort presente', demoEscort.includes('subcategoriaId:"escort"'), 'escort');
  ok('H8 DEMO escort modalidades', demoEscort.includes('modalidades:') && demoEscort.includes('modalidadFicha:'), 'modalidades');

  const demoAcompanante = extractDemoObject(perfilHtml, 'acompanante');
  ok('H8 DEMO acompanante presente', demoAcompanante.includes('subcategoriaId:"acompanante"'), 'acompanante');
  ok('H8 DEMO acompanante social', demoAcompanante.includes('categoria:"Acompañante"') || demoAcompanante.includes('Compañía social'), 'social');

  const demoPetit = extractDemoObject(perfilHtml, 'petit');
  ok('H8 DEMO petit presente', demoPetit.includes('subcategoriaId:"petit"'), 'petit');
  ok('H8 DEMO petit estatura', demoPetit.includes('estatura:"1.55 m"') || demoPetit.includes('Petite'), 'estatura');

  const resultadosDemoJs = fs.readFileSync(path.join(root, 'resultados-demo.js'), 'utf8');
  ok('H8 routing demo escort -> escort', /escort:\s*'escort'/.test(resultadosDemoJs), 'escort');
  ok('H8 routing demo acompanante -> acompanante', /acompanante:\s*'acompanante'/.test(resultadosDemoJs), 'acompanante');
  ok('H8 routing demo petit -> petit', /petit:\s*'petit'/.test(resultadosDemoJs), 'petit');
  ok('H7 routing demo gigolo -> gigolo', /gigolo:\s*'gigolo'/.test(resultadosDemoJs), 'gigolo');
  ok('H7 routing demo femboy -> femboy', /femboy:\s*'femboy'/.test(resultadosDemoJs), 'femboy');
  ok('H7 routing demo singles -> singles', /singles:\s*'singles'/.test(resultadosDemoJs), 'singles');
  ok('H7 routing demo lesbians -> lesbians', /lesbians:\s*'lesbians'/.test(resultadosDemoJs), 'lesbians');

  const cardBase = {
    tagline: 'Perfil QA render',
    edad: 27,
    precio: '2000',
    ciudad: 'Monterrey',
    modalidades: ['recibe'],
  };

  // --- 15 subs: tarjeta smoke (1+ assert cada una) ---
  okCard('escort', 'escort tarjeta render', PR.cardHTMLAdultos({ ...cardBase, subcategoriaId: 'escort' }, {}).includes('Perfil QA render'), 'html');

  const vipCard = PR.cardHTMLAdultos({ ...cardBase, subcategoriaId: 'escort_vip', badgeVip: true }, {});
  okCard('escort_vip', 'escort_vip badge tarjeta', vipCard.includes('res-badge--vip') || vipCard.includes('VIP'), vipCard.slice(0, 120));

  const gayCard = PR.cardHTMLAdultos({ ...cardBase, subcategoriaId: 'escort_gay', badgeLgbt: true }, {});
  okCard('escort_gay', 'escort_gay badge tarjeta', gayCard.includes('res-badge--lgbt') || gayCard.includes('LGBT'), gayCard.slice(0, 120));

  okCard('edecan', 'edecan tarjeta smoke', PR.cardHTMLAdultos({
    ...cardBase, subcategoriaId: 'edecan', eventosDisponibles: true,
  }, {}).includes('Perfil QA render'), 'html');

  okCard('modelos', 'modelos tarjeta smoke', PR.cardHTMLAdultos({
    ...cardBase, subcategoriaId: 'modelos', portfolioURL: 'https://example.com/portfolio',
  }, {}).includes('Perfil QA render'), 'html');

  const gigoloViaja = PR.cardHTMLAdultos({
    ...cardBase,
    subcategoriaId: 'gigolo',
    modalidades: ['recibe', 'viaja'],
    viajesDesplazamiento: { viaja: true, alcanceDesplazamiento: 'toda_ciudad' },
  }, {});
  okCard('gigolo', 'gigolo tarjeta smoke', gigoloViaja.includes('Perfil QA render'), 'html');
  ok('gigolo tarjeta viaja', cardHasViajaChip(gigoloViaja), gigoloViaja.slice(0, 120));

  okCard('acompanante', 'acompanante tarjeta smoke', PR.cardHTMLAdultos({
    ...cardBase, subcategoriaId: 'acompanante',
  }, {}).includes('Perfil QA render'), 'html');

  const petitCard = PR.cardHTMLAdultos({
    ...cardBase,
    subcategoriaId: 'petit',
    modalidades: ['recibe'],
    estatura: '1.55 m',
  }, {});
  okCard('petit', 'petit tarjeta smoke', petitCard.includes('Perfil QA render'), 'html');
  ok('petit sin chip Viaja', !cardHasViajaChip(petitCard), petitCard.slice(0, 120));
  ok('petit subcategoriaActivaViajes false', V.subcategoriaActivaViajes('petit') === false, 'excluido');

  okCard('trans', 'trans tarjeta smoke', PR.cardHTMLAdultos({
    ...cardBase, subcategoriaId: 'trans', identidadGenero: 'Mujer trans', badgeLgbt: true,
  }, {}).includes('Perfil QA render'), 'html');

  okCard('femboy', 'femboy tarjeta smoke', PR.cardHTMLAdultos({
    ...cardBase, subcategoriaId: 'femboy', presentacionFemboy: 'Femboy', badgeLgbt: true,
  }, {}).includes('Perfil QA render'), 'html');

  okCard('singles', 'singles tarjeta smoke', PR.cardHTMLAdultos({
    ...cardBase,
    subcategoriaId: 'singles',
    buscanConocer: ['Parejas', 'Hombres solteros'],
    disponibilidadAgenda: ['Fines de semana'],
  }, {}).includes('Perfil QA render'), 'html');

  const lesCard = PR.cardHTMLAdultos({
    ...cardBase,
    subcategoriaId: 'lesbians',
    atiendoA: 'Mujeres',
    haceColaboraciones: 'Sí',
    mostrarAtiendoA: 'Sí',
    mostrarColaboraciones: 'Sí',
  }, {});
  okCard('lesbians', 'lesbians tarjeta atiende a', lesCard.includes('Atiende a: Mujeres'), lesCard);
  ok('lesbians tarjeta colaboraciones', lesCard.includes('Colaboraciones: Sí'), lesCard);

  const lesHidden = PR.cardHTMLAdultos({
    ...cardBase,
    subcategoriaId: 'lesbians',
    atiendoA: 'Mujeres',
    mostrarAtiendoA: 'No',
  }, {});
  ok('lesbians toggle oculta atiendoA tarjeta', !lesHidden.includes('Atiende a:'), lesHidden);

  const tomBoyCard = PR.cardHTMLAdultos({
    ...cardBase,
    subcategoriaId: 'tom_boy',
    badgeLgbt: true,
    presentacionTom: 'Andrógina',
  }, {});
  okCard('tom_boy', 'tom_boy tarjeta render', tomBoyCard.includes('Perfil QA render'), tomBoyCard.slice(0, 80));

  const tomFemCard = PR.cardHTMLAdultos({
    ...cardBase,
    subcategoriaId: 'tom_fem',
    badgeLgbt: true,
    presentacionTom: 'Femme tomboy',
  }, {});
  okCard('tom_fem', 'tom_fem tarjeta paridad tom_boy', tomFemCard.includes('Perfil QA render'), tomFemCard.slice(0, 80));
  ok('tom_fem paridad presentacionTom', tomFemCard.includes('Perfil QA render') && tomBoyCard.includes('Perfil QA render'), 'ambos OK');

  const dotadosCard = PR.cardHTMLAdultos({
    subcategoriaId: 'dotados',
    longitudCm: '20',
    mostrarLongitudPublico: 'Sí',
    categoriaTamaño: 'Dotado',
    tagline: 'Perfil discreto',
    edad: 28,
    precio: '2500',
    modalidades: ['recibe'],
  }, {});
  okCard('dotados', 'dotados tarjeta sin crash', dotadosCard.includes('Perfil discreto'), dotadosCard.slice(0, 80));
  ok('dotados tarjeta NO expone longitud cm', !dotadosCard.includes('20 cm') && !/Longitud/i.test(dotadosCard), dotadosCard.slice(0, 100));

  const viajesCard = PR.cardHTMLAdultos({
    ...cardBase,
    subcategoriaId: 'escort',
    modalidades: ['recibe', 'viaja'],
    viajesDesplazamiento: { viaja: true, alcanceDesplazamiento: 'toda_ciudad' },
  }, {});
  ok('escort tarjeta viaja', cardHasViajaChip(viajesCard), viajesCard);

  // --- Ficha / toggles ---
  ok('ficha lesbians rows visibles', fichaLesbiansRows({
    subcategoriaId: 'lesbians',
    atiendoA: 'Mujeres',
    haceColaboraciones: 'Sí',
    colaboraCon: ['Mujeres'],
    mostrarAtiendoA: 'Sí',
    mostrarColaboraciones: 'Sí',
  }).join(',') === 'atiendoA,colaboraciones,colaboraCon', 'rows');

  ok('ficha lesbians toggle colaboraciones', !fichaLesbiansRows({
    subcategoriaId: 'lesbians',
    atiendoA: 'Mujeres',
    haceColaboraciones: 'Sí',
    colaboraCon: ['Mujeres'],
    mostrarAtiendoA: 'Sí',
    mostrarColaboraciones: 'No',
  }).includes('colaboraciones'), 'off');

  ok('ficha edecan eventos visibles', fichaEdecanRows({ eventosDisponibles: true }).join(',') === 'eventos', 'eventos');
  ok('ficha edecan v3 campos', fichaEdecanRows({
    experienciaProfesional: '5+ años',
    tiposEvento: ['Coctel corporativo'],
    serviciosIncluidos: ['Acompañamiento en evento'],
    noRealiza: ['Menores de edad'],
    eventosDisponibles: true,
  }).join(',') === 'experienciaProfesional,tiposEvento,serviciosProfesionales,restriccionesProfesionales,eventos', 'edecan v3');
  ok('ficha edecan sin eventos', fichaEdecanRows({ eventosDisponibles: false }).length === 0, 'vacío');

  ok('ficha modelos portfolio visible', fichaModelosRows({ portfolioURL: 'https://example.com/p' }).join(',') === 'portfolio', 'portfolio');
  ok('ficha modelos v3 campos', fichaModelosRows({
    experienciaProfesional: '3+ años',
    tiposModelaje: ['Editorial'],
    serviciosIncluidos: ['Sesión fotográfica'],
    noRealiza: ['Menores'],
    portfolioURL: 'https://example.com/p',
  }).join(',') === 'experienciaProfesional,tiposModelaje,serviciosProfesionales,restriccionesProfesionales,portfolio', 'modelos v3');

  ok('ficha trans identidadGenero', fichaTransRows({ identidadGenero: 'Mujer trans' }).join(',') === 'identidadGenero', 'identidad');

  ok('ficha dotados toggles longitud visibles', fichaDotadosRows({
    longitudCm: '18',
    categoriaTamaño: 'Por encima del promedio',
    mostrarLongitudPublico: 'Sí',
    atencionHombres: 'Sí',
    mostrarAtencionHombresPublico: 'Sí',
  }).join(',') === 'longitud,categoriaTamano,atencionHombres', fichaDotadosRows({
    longitudCm: '18',
    categoriaTamaño: 'Por encima del promedio',
    mostrarLongitudPublico: 'Sí',
    atencionHombres: 'Sí',
    mostrarAtencionHombresPublico: 'Sí',
  }).join(','));

  ok('ficha dotados toggle longitud oculta', !fichaDotadosRows({
    longitudCm: '18',
    mostrarLongitudPublico: 'No',
    atencionHombres: 'Sí',
    mostrarAtencionHombresPublico: 'Sí',
  }).includes('longitud'), 'off');

  ok('ficha dotados toggle atencion oculta', !fichaDotadosRows({
    atencionMujeres: 'Sí',
    mostrarAtencionMujeresPublico: 'No',
  }).includes('atencionMujeres'), 'off');

  ok('H6 ficha femboy delta visible', fichaFemboyRows({
    presentacionFemboy: 'Andrógino femenino',
    estiloPredominante: 'Kawaii',
    disponibilidadAgenda: ['Fines de semana'],
    disponiblePara: ['Citas', 'Eventos'],
  }).join(',') === 'presentacion,estilo,disponibilidad,disponiblePara', 'femboy rows');

  ok('H6 ficha singles lifestyle', fichaSinglesRows({
    buscanConocer: ['Parejas', 'Hombres solteros'],
    personalidadPredominante: 'Extrovertida',
    estiloPersonal: 'Elegante casual',
    disponibilidadAgenda: ['Fines de semana'],
  }).join(',') === 'buscanConocer,personalidad,estiloPersonal,disponibilidad', 'singles rows');

  ok('H6 singles ficha sin modalidad escort', !fichaShowsModalidadRow({
    subcategoriaId: 'singles',
    modalidades: ['recibe', 'hotel'],
    modalidadFicha: 'Recibe · Hotel',
  }), 'omit modalidad');

  ok('H6 escort ficha conserva modalidad', fichaShowsModalidadRow({
    subcategoriaId: 'escort',
    modalidades: ['recibe'],
    modalidadFicha: 'Recibe',
  }), 'modalidad escort');

  // --- Regresión routing (no escort pack, pero en mismo script) ---
  const chCard = PR.cardHTML({
    subcategoriaId: 'cuckold_hotwife',
    aliasPareja: 'Pareja CH',
    dinamica: 'hotwife',
    badgeHotwife: true,
    tagline: 'Pareja',
    edad: 30,
    precio: '2000',
  }, { componenteResultados: 'ResultCardPareja' });
  ok('routing C/H pareja usa tarjeta C/H', chCard.includes('res-card--cuckold-hotwife'), chCard.slice(0, 100));
  ok('routing C/H badge hotwife dinamica', chCard.includes('res-badge--hotwife') || chCard.includes('Hotwife'), chCard.slice(0, 120));

  const swCard = PR.cardHTMLParejaSwinger({
    subcategoriaId: 'swinger',
    aliasPareja: 'Pareja Sw',
    objetivosPerfil: ['Conocer parejas'],
    mostrarObjetivosPerfil: 'Sí',
    tagline: 'Swinger',
    edad: 35,
    precio: 'Consultar',
  }, {});
  ok('swinger tarjeta sin mezcla escort', swCard.includes('res-card--pareja') && !swCard.includes('res-card--adult'), swCard.slice(0, 100));

  ok('H2 cobertura tarjeta 15/15 subs', cardCoverage.size === 15, [...cardCoverage].sort().join(', '));
  ok('H2 lista subs alineada pack', PERSONA_ACOMPANANTE_15.every((s) => cardCoverage.has(s)), PERSONA_ACOMPANANTE_15.filter((s) => !cardCoverage.has(s)).join(', '));
} catch (e) {
  fail.push({ name: 'EXCEPTION', detail: e.stack || e.message });
}

console.log('\n=== QA persona_acompanante (render) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
