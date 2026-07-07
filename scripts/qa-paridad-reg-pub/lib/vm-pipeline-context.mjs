import { makeCtx, loadRegistroBlocksStack, loadScript, REPO } from './vm-context.mjs';

const PIPELINE_SCRIPTS = [
  'carihub-public-privacy-guard.js',
  'resultados-registrados.js',
  'registro-perfil-submit.js',
];

/** @returns {{ ctx: Record<string, unknown>, loadedScripts: string[] }} */
export function makePipelineCtx() {
  const ctx = makeCtx();
  const loadedScripts = loadRegistroBlocksStack(ctx);

  ctx.CariHubPrivateFieldsLite = {
    sanitizePrivateForStorage: (p) => ({ ...(p || {}) }),
  };

  for (const rel of PIPELINE_SCRIPTS) {
    loadScript(ctx, rel);
    loadedScripts.push(rel);
  }

  const PB = ctx.CariHubRegistroPublicBlocks;
  const Submit = ctx.CariHubRegistroPerfilSubmit;
  const Reg = ctx.CariHubResultadosRegistrados;
  const Guard = ctx.CariHubPublicPrivacyGuard;

  if (!PB?.mapToPerfil || !Submit?.buildUsuarioDoc || !Reg?.normalizar || !Guard?.sanitizePerfilPublico) {
    throw new Error('Pipeline VM incompleta: faltan exports críticos');
  }

  return { ctx, loadedScripts };
}

export { REPO };
