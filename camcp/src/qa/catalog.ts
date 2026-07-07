import fs from 'node:fs';
import path from 'node:path';

export type QaScriptKind =
  | 'paridad.static'
  | 'paridad.vm'
  | 'paridad.render'
  | 'fondos.static'
  | 'pack.motor'
  | 'pack.persist'
  | 'pack.render'
  | 'pack.cierre'
  | 'gate'
  | 'browser'
  | 'static'
  | 'vm';

export interface QaCatalogEntry {
  id: string;
  script: string;
  scriptPath: string;
  kinds: QaScriptKind[];
  runnable: boolean;
  supportsOut: boolean;
  cli: string[];
  description: string;
}

const LIBRARY_EXCLUDE = new Set(['qa-preview-iframe-route-b-lib.mjs']);

function classifyScript(filename: string): QaScriptKind[] {
  const kinds: QaScriptKind[] = [];
  if (filename === 'qa-paridad-reg-pub-static.mjs') kinds.push('paridad.static');
  if (filename === 'qa-paridad-reg-pub-vm.mjs') kinds.push('paridad.vm');
  if (filename === 'qa-paridad-reg-pub-render.mjs') kinds.push('paridad.render');
  if (filename === 'qa-fondos-static.mjs') kinds.push('fondos.static');
  if (filename.endsWith('-cierre.mjs')) kinds.push('pack.cierre', 'gate');
  else if (filename.endsWith('-persist.mjs')) kinds.push('pack.persist');
  else if (filename.endsWith('-render.mjs') && !filename.includes('paridad')) kinds.push('pack.render');
  else if (filename.includes('-browser') || filename.includes('visual-smoke')) kinds.push('browser');
  else if (filename.includes('-schema') || filename.endsWith('-packs-v1.mjs')) kinds.push('static');
  else kinds.push('vm');
  return kinds;
}

function supportsOutFlag(filename: string): boolean {
  return (
    filename.startsWith('qa-paridad-reg-pub-') &&
    (filename.endsWith('-static.mjs') ||
      filename.endsWith('-vm.mjs') ||
      filename.endsWith('-render.mjs'))
  );
}

function describeScript(filename: string, kinds: QaScriptKind[]): string {
  if (kinds.includes('paridad.static')) return 'Paridad Fase A — catálogo estático y gaps';
  if (kinds.includes('paridad.vm')) return 'Paridad Fase B — pipeline VM registro→perfil';
  if (kinds.includes('paridad.render')) return 'Paridad Fase C — render Playwright perfil público';
  if (kinds.includes('fondos.static')) return 'Fondos — validación CSS/HTML sin browser';
  if (kinds.includes('pack.cierre')) return `Pack cierre — ${filename.replace(/^qa-|-cierre\.mjs$/g, '')}`;
  if (kinds.includes('gate')) return `Gate orchestrator — ${filename}`;
  if (kinds.includes('browser')) return `Browser smoke — ${filename}`;
  if (kinds.includes('static')) return `Static analysis — ${filename}`;
  return `VM QA — ${filename}`;
}

function scriptId(filename: string): string {
  return filename.replace(/^qa-/, '').replace(/\.mjs$/, '').replace(/-/g, '_');
}

export function scanQaCatalog(repoRoot: string): QaCatalogEntry[] {
  const scriptsDir = path.join(repoRoot, 'scripts');
  const files = fs
    .readdirSync(scriptsDir)
    .filter((f) => f.startsWith('qa-') && f.endsWith('.mjs') && !LIBRARY_EXCLUDE.has(f))
    .sort();

  return files.map((filename) => {
    const kinds = classifyScript(filename);
    const rel = path.join('scripts', filename);
    return {
      id: scriptId(filename),
      script: filename,
      scriptPath: rel.replace(/\\/g, '/'),
      kinds,
      runnable: true,
      supportsOut: supportsOutFlag(filename),
      cli: ['node', rel.replace(/\\/g, '/')],
      description: describeScript(filename, kinds),
    };
  });
}

export function listParidadEntries(catalog: QaCatalogEntry[]) {
  return catalog.filter((e) => e.kinds.some((k) => k.startsWith('paridad.')));
}

export function listPackEntries(catalog: QaCatalogEntry[]) {
  return catalog.filter((e) =>
    e.kinds.some((k) => k === 'pack.cierre' || k === 'pack.motor' || k === 'pack.persist' || k === 'pack.render')
  );
}
