import fs from 'node:fs';
import path from 'node:path';

export interface MapaMaestro {
  mapaActual?: Record<string, string>;
  estadoActualResumen?: Record<string, string>;
}

export function loadMapaMaestro(repoRoot: string): MapaMaestro | null {
  const file = path.join(repoRoot, 'scripts', 'MAPA-MAESTRO-CARIHUB.json');
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as MapaMaestro;
  } catch {
    return null;
  }
}

export function listGptKnowledgeDocs(repoRoot: string): Array<{ file: string; domain: string }> {
  const dir = path.join(repoRoot, 'docs', 'gpt-knowledge');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .sort()
    .map((f) => ({
      file: path.join('docs/gpt-knowledge', f).replace(/\\/g, '/'),
      domain: f.replace(/\.md$/, '').replace(/-/g, ' '),
    }));
}
