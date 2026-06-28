/**
 * MP-QA-IFRAME — helper VM para Ruta B (aplicarPerfilDesdeRegistro) sin browser.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';

export function makePreviewVmCtx() {
  const ctx = {
    console,
    document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] },
  };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  return ctx;
}

export function readPerfilPublicoHtml(repoRoot) {
  return fs.readFileSync(path.join(repoRoot, 'public', 'perfil-publico.html'), 'utf8');
}

export function extractFunctionBlock(html, fnName, nextFnName) {
  const start = html.indexOf(`function ${fnName}`);
  const end = html.indexOf(`function ${nextFnName}`, start + 1);
  if (start < 0 || end < 0 || end <= start) return '';
  return html.slice(start, end);
}

export function extractProfesionalPromoHydrateHelpers(html) {
  return [
    extractFunctionBlock(html, 'normSubFicha', 'isLesbiansSubFicha'),
    extractFunctionBlock(html, 'isEdecanSubFicha', 'isModelosSubFicha'),
    extractFunctionBlock(html, 'isModelosSubFicha', 'isProfesionalPromoSubFicha'),
    extractFunctionBlock(html, 'isProfesionalPromoSubFicha', 'hydrateProfesionalPromoFicha'),
    extractFunctionBlock(html, 'hydrateProfesionalPromoFicha', 'resolveCategoriaVisibleFicha'),
    extractFunctionBlock(html, 'resolveCategoriaVisibleFicha', 'adultoFichaHTML'),
  ].join('\n');
}

export function extractAplicarPerfilDesdeRegistroBlock(html) {
  return [
    extractProfesionalPromoHydrateHelpers(html),
    extractFunctionBlock(html, 'mergeParejaGrupoRegistroFields', 'parejaPieBottomHTML'),
    extractFunctionBlock(html, 'demoAssetDesdeResultados', 'aplicarPerfilDesdeRegistro'),
    extractFunctionBlock(html, 'aplicarPerfilDesdeRegistro', 'aplicarPerfilResultadosEnDemo'),
  ].join('\n');
}

export function loadAplicarPerfilDesdeRegistro(perfilHtml, demoSeed = {}) {
  const slice = extractAplicarPerfilDesdeRegistroBlock(perfilHtml);
  const ctx = makePreviewVmCtx();
  ctx.DEMO = { ...demoSeed };
  ctx.window = ctx;
  vm.runInContext(slice, ctx);
  return ctx;
}

export function runPreviewRouteB(perfilHtml, vista, perfilU, demoSeed = {}) {
  const seed = { ...demoSeed };
  if (!seed[vista]) seed[vista] = { nombre: 'Demo base', alias: 'Demo base' };
  const previewCtx = loadAplicarPerfilDesdeRegistro(perfilHtml, seed);
  previewCtx.aplicarPerfilDesdeRegistro(vista, perfilU);
  return previewCtx.DEMO[vista];
}
