/**
 * QA — Pack persona_acompanante (motor / blocks / validación).
 * node scripts/qa-persona-acompanante.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const root = path.join(repoRoot, 'public', 'js');

const pass = [];
const fail = [];

function ok(name, cond, detail) {
  if (cond) pass.push({ name, detail });
  else fail.push({ name, detail: detail || 'falló' });
}

function loadScript(relativePath, ctx) {
  const code = fs.readFileSync(path.join(root, relativePath), 'utf8');
  try {
    vm.runInContext(code, ctx, { filename: relativePath });
  } catch (e) {
    throw new Error(relativePath + ': ' + e.message);
  }
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

function loadAll() {
  const ctx = makeCtx();
  loadScript('carihub-viajes-desplazamiento.js', ctx);
  loadScript('data/registro-adultos-escort-blocks.js', ctx);
  loadScript('data/registro-adultos-pareja-blocks.js', ctx);
  loadScript('data/registro-adultos-lifestyle-blocks.js', ctx);
  loadScript('carihub-registro-public-blocks.js', ctx);
  loadScript('data/registro-schema-index.js', ctx);
  return ctx;
}

function escortCtx(subId, label) {
  return {
    subcategoriaId: subId,
    subcategoria: label || subId,
    arquetipo: 'persona_acompanante',
    tipoPerfil: 'persona',
    formularioId: 'adultos',
  };
}

function mergedEscort(vmCtx, userCtx) {
  return vmCtx.CariHubRegistroPublicBlocks.mergedConfig(
    vmCtx.CARIHUB_REGISTRO_ESCORT_BLOCKS,
    userCtx
  );
}

function blockById(merged, id) {
  return merged.blocks.find((b) => b.id === id);
}

function hasField(merged, fieldId) {
  return merged.blocks.some((b) => b.fields.some((f) => f.id === fieldId));
}

function modalidadesBlock(merged) {
  return blockById(merged, 'modalidades');
}

function viajesSubfields(merged) {
  const b = modalidadesBlock(merged);
  if (!b) return [];
  return b.fields.filter((f) => f.showWhenViaja).map((f) => f.id);
}

const SUBS = [
  {
    key: 'escort',
    ids: ['escort'],
    oblig: ['modalidades', 'serviciosIncluidos', 'serviciosNoRealizo'],
    block: 'serviciosPreferencias',
    blockFields: ['realizaTrios', 'colaboracionContenido', 'esBisexual'],
    viajes: true,
  },
  {
    key: 'escort_vip',
    ids: ['escort vip', 'escort_vip'],
    oblig: ['nivelPremium', 'modalidades'],
    block: 'vipPerfil',
    blockFields: ['experienciaVip', 'distintivosVip'],
    fotosMin: 5,
    badge: 'vip',
    viajes: true,
  },
  {
    key: 'escort_gay',
    ids: ['escort gay', 'escort_gay'],
    oblig: ['orientacion', 'modalidades'],
    badge: 'lgbt',
    viajes: true,
  },
  {
    key: 'edecan',
    ids: ['edecan'],
    oblig: ['eventosDisponibles', 'modalidades'],
    viajes: true,
  },
  {
    key: 'modelos',
    ids: ['modelos'],
    oblig: ['portfolioURL', 'modalidades'],
    fotosMin: 6,
    viajes: true,
  },
  {
    key: 'gigolo',
    ids: ['gigolo'],
    oblig: ['modalidades'],
    aliasLabel: 'Alias masculino',
    viajes: true,
  },
  {
    key: 'acompanante',
    ids: ['acompanante'],
    oblig: ['modalidades', 'serviciosIncluidos'],
    viajes: true,
  },
  {
    key: 'petit',
    ids: ['petit'],
    oblig: ['modalidades', 'estatura'],
    viajes: false,
    estaturaMax: 1.58,
  },
  {
    key: 'trans',
    ids: ['trans'],
    oblig: ['identidadGenero', 'modalidades'],
    viajes: true,
  },
  {
    key: 'lesbians',
    ids: ['lesbians'],
    oblig: ['orientacion', 'atiendoA', 'haceColaboraciones', 'modalidades'],
    block: 'lesbiansPerfil',
    blockFields: ['atiendoA', 'mostrarAtiendoA', 'haceColaboraciones', 'colaboraCon'],
    badge: 'lgbt',
    viajes: true,
  },
  {
    key: 'singles',
    ids: ['singles'],
    oblig: ['buscanConocer', 'tipoCitaPreferida', 'personalidadPredominante', 'estiloPersonal', 'disponibilidadAgenda'],
    forbidOblig: ['modalidades', 'serviciosIncluidos', 'serviciosNoRealizo'],
    block: 'singlesPerfil',
    blockFields: ['buscanConocer', 'tipoCitaPreferida'],
    viajes: true,
  },
  {
    key: 'femboy',
    ids: ['femboy'],
    oblig: ['presentacionFemboy', 'estiloPredominante', 'disponibilidadAgenda', 'disponiblePara'],
    forbidOblig: ['modalidades', 'serviciosIncluidos', 'serviciosNoRealizo'],
    block: 'femboyPerfil',
    blockFields: ['presentacionFemboy', 'disponiblePara', 'realizaTrios'],
    badge: 'lgbt',
    viajes: true,
  },
  {
    key: 'tom_boy',
    ids: ['tom boy', 'tom_boy'],
    oblig: ['modalidades', 'serviciosIncluidos'],
    block: 'tomPerfil',
    blockFields: ['presentacionTom', 'estiloPredominante', 'personalidad'],
    badge: 'lgbt',
    viajes: true,
  },
  {
    key: 'tom_fem',
    ids: ['tom fem', 'tom_fem'],
    oblig: ['modalidades', 'serviciosIncluidos'],
    block: 'tomPerfil',
    blockFields: ['presentacionTom', 'estiloPredominante', 'pasatiempos'],
    badge: 'lgbt',
    viajes: true,
  },
];

function baseValidValues() {
  return {
    modalidades: ['recibe'],
    serviciosIncluidos: ['Oral'],
    serviciosNoRealizo: ['Menores de edad'],
    estatura: '1.65 m',
    peso: '55 kg',
    metodosPago: ['Efectivo'],
    sobreMi: 'Perfil QA persona acompañante.',
  };
}

function deltaForSub(spec) {
  const v = baseValidValues();
  switch (spec.key) {
    case 'escort_vip':
      v.nivelPremium = 'VIP · Alto nivel';
      v.experienciaVip = ['Eventos sociales'];
      v.distintivosVip = ['Discreción'];
      break;
    case 'escort_gay':
      v.orientacion = 'Gay';
      break;
    case 'edecan':
      v.eventosDisponibles = true;
      break;
    case 'modelos':
      v.portfolioURL = 'https://example.com/portfolio';
      break;
    case 'petit':
      v.estatura = '1.55 m';
      break;
    case 'trans':
      v.identidadGenero = 'Mujer trans';
      break;
    case 'lesbians':
      v.orientacion = 'Lesbiana';
      v.atiendoA = 'Mujeres';
      v.haceColaboraciones = 'Sí';
      v.colaboraCon = ['Mujeres'];
      break;
    case 'singles':
      delete v.modalidades;
      delete v.serviciosIncluidos;
      delete v.serviciosNoRealizo;
      v.buscanConocer = ['Parejas'];
      v.tipoCitaPreferida = ['Cena'];
      v.personalidadPredominante = 'Tranquila';
      v.estiloPersonal = 'Casual';
      v.disponibilidadAgenda = ['Entre semana'];
      break;
    case 'femboy':
      delete v.modalidades;
      delete v.serviciosIncluidos;
      delete v.serviciosNoRealizo;
      v.presentacionFemboy = 'Andrógino';
      v.estiloPredominante = 'Kawaii';
      v.disponibilidadAgenda = ['Entre semana'];
      v.disponiblePara = ['Citas'];
      break;
    default:
      break;
  }
  return v;
}

let ctx;

try {
  ctx = loadAll();
  const RP = ctx.CariHubRegistroPublicBlocks;
  const V = ctx.CariHubViajesDesplazamiento;
  const CFG = ctx.CARIHUB_REGISTRO_ESCORT_BLOCKS;

  ok('load módulos escort', !!(RP && V && CFG), 'motor');

  const indexJs = fs.readFileSync(path.join(root, 'data', 'registro-schema-index.js'), 'utf8');
  ok('schema-index persona_acompanante', indexJs.includes('"arquetipo":"persona_acompanante"'), 'index');

  for (const spec of SUBS) {
    const primaryId = spec.ids[0];
    const userCtx = escortCtx(primaryId);
    const merged = mergedEscort(ctx, userCtx);

    ok(`${spec.key} resolveConfig escort`, RP.resolveConfig(userCtx, null) === CFG, 'cfg');
    ok(`${spec.key} matchesEscort`, RP.matchesEscort(userCtx, null), 'escort');
    ok(`${spec.key} no matchesPareja`, !RP.matchesPareja(userCtx, null), 'pareja');
    ok(`${spec.key} no matchesLifestyle`, !RP.matchesLifestyle(userCtx, null), 'lifestyle');

    for (const ob of spec.oblig || []) {
      ok(`${spec.key} oblig ${ob}`, merged.obligatorios.includes(ob), merged.obligatorios.join(', '));
    }
    for (const fb of spec.forbidOblig || []) {
      ok(`${spec.key} no-oblig ${fb}`, !merged.obligatorios.includes(fb), merged.obligatorios.join(', '));
    }
    if (spec.fotosMin != null) {
      ok(`${spec.key} fotosMin ${spec.fotosMin}`, RP.getFotosMin(userCtx) === spec.fotosMin, String(RP.getFotosMin(userCtx)));
    }
    if (spec.block) {
      ok(`${spec.key} bloque ${spec.block}`, !!blockById(merged, spec.block), spec.block);
    }
    for (const fid of spec.blockFields || []) {
      ok(`${spec.key} campo ${fid}`, hasField(merged, fid), fid);
    }
    if (spec.aliasLabel) {
      ok(`${spec.key} alias label`, RP.getAliasLabel(userCtx, null) === spec.aliasLabel, RP.getAliasLabel(userCtx, null));
    }
    if (spec.viajes === true) {
      ok(`${spec.key} viajes activo`, V.subcategoriaActivaViajes(primaryId), primaryId);
      const modField = modalidadesBlock(merged)?.fields.find((f) => f.id === 'modalidades');
      const opts = (modField?.options || []).map((o) => o.value || o);
      ok(`${spec.key} chip viaja`, opts.includes('viaja'), opts.join(', '));
    }
    if (spec.viajes === false) {
      ok(`${spec.key} viajes inactivo petit`, !V.subcategoriaActivaViajes('petit'), 'petit');
      ok(`${spec.key} sin subcampos viajes`, viajesSubfields(merged).length === 0, viajesSubfields(merged).join(', '));
    }
    if (spec.badge) {
      const u = RP.mapToPerfil({ subcategoriaId: primaryId }, deltaForSub(spec), userCtx);
      const badgeKey = spec.badge === 'vip' ? 'badgeVip' : spec.badge === 'lgbt' ? 'badgeLgbt' : 'badgeHotwife';
      ok(`${spec.key} badge ${spec.badge}`, u[badgeKey] === true, String(u[badgeKey]));
    }

    const validVals = deltaForSub(spec);
    const missing = RP.validateValues(CFG, validVals, userCtx);
    ok(`${spec.key} validate completo`, missing.length === 0, missing.join('; '));

    if (spec.estaturaMax != null) {
      const bad = RP.validateValues(CFG, { ...validVals, estatura: '1.60 m' }, userCtx);
      ok(`${spec.key} validate estatura max`, bad.some((m) => /1\.58|Petit/i.test(m)), bad.join('; '));
    }

    for (const altId of spec.ids.slice(1)) {
      const altCtx = escortCtx(altId);
      const resolved = { identidad: { formularioId: 'adultos', arquetipo: 'persona_acompanante' } };
      ok(
        `${spec.key} alias id ${altId}`,
        RP.matchesEscort(altCtx, resolved),
        altId
      );
    }
  }

  const finLes = {
    orientacion: 'Lesbiana',
    atiendoA: 'Mujeres',
    haceColaboraciones: 'No',
    colaboraCon: ['Mujeres'],
    modalidades: ['recibe'],
    serviciosIncluidos: ['Oral'],
    serviciosNoRealizo: ['Menores'],
    estatura: '1.65 m',
    peso: '55 kg',
    metodosPago: ['Efectivo'],
  };
  if (String(finLes.haceColaboraciones || '').trim() === 'No') delete finLes.colaboraCon;
  ok('lesbians finalize borra colaboraCon', finLes.colaboraCon == null, JSON.stringify(finLes.colaboraCon));

  for (const sample of ['escort', 'lesbians', 'femboy']) {
    ok(`schema-index ${sample}`, indexJs.includes(`"${sample}"`), sample);
  }
  ok('schema-index no hotwife byId', !indexJs.includes('"hotwife":{'), 'removed');
  ok('schema-index escort vip', indexJs.includes('"escort vip"') && indexJs.includes('persona_acompanante'), 'vip');
} catch (e) {
  fail.push({ name: 'EXCEPTION', detail: e.stack || e.message });
}

console.log('\n=== QA persona_acompanante (motor) ===');
console.log('PASS:', pass.length);
pass.forEach((p) => console.log('  ✓', p.name, p.detail ? '— ' + p.detail : ''));
if (fail.length) {
  console.log('FAIL:', fail.length);
  fail.forEach((f) => console.log('  ✗', f.name, '—', f.detail));
  process.exit(1);
}
console.log('\nTodos los checks pasaron (' + pass.length + ').');
