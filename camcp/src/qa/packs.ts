export type PackLayer = 'motor' | 'persist' | 'render' | 'cierre';

export interface QaPackDefinition {
  id: string;
  label: string;
  domain: string;
  layers: Partial<Record<PackLayer, string>>;
  cierreScript: string | null;
}

/** Known domain packs — maps to existing qa-* scripts (no rewrites). */
export const QA_PACKS: QaPackDefinition[] = [
  {
    id: 'persona_acompanante',
    label: 'Persona acompañante',
    domain: 'adultos',
    layers: {
      motor: 'scripts/qa-persona-acompanante.mjs',
      persist: 'scripts/qa-persona-acompanante-persist.mjs',
      render: 'scripts/qa-persona-acompanante-render.mjs',
      cierre: 'scripts/qa-persona-acompanante-cierre.mjs',
    },
    cierreScript: 'scripts/qa-persona-acompanante-cierre.mjs',
  },
  {
    id: 'dominatrix',
    label: 'Dominatrix',
    domain: 'adultos',
    layers: {
      motor: 'scripts/qa-dominatrix.mjs',
      persist: 'scripts/qa-dominatrix-persist.mjs',
      render: 'scripts/qa-dominatrix-render.mjs',
      cierre: 'scripts/qa-dominatrix-cierre.mjs',
    },
    cierreScript: 'scripts/qa-dominatrix-cierre.mjs',
  },
  {
    id: 'unicorn',
    label: 'Unicorn',
    domain: 'adultos',
    layers: {
      motor: 'scripts/qa-unicorn.mjs',
      persist: 'scripts/qa-unicorn-persist.mjs',
      render: 'scripts/qa-unicorn-render.mjs',
      cierre: 'scripts/qa-unicorn-cierre.mjs',
    },
    cierreScript: 'scripts/qa-unicorn-cierre.mjs',
  },
  {
    id: 'neg_bienestar',
    label: 'Negocio bienestar',
    domain: 'negocio',
    layers: {
      motor: 'scripts/qa-neg-bienestar.mjs',
      persist: 'scripts/qa-neg-bienestar-persist.mjs',
      render: 'scripts/qa-neg-bienestar-render.mjs',
      cierre: 'scripts/qa-neg-bienestar-cierre.mjs',
    },
    cierreScript: 'scripts/qa-neg-bienestar-cierre.mjs',
  },
  {
    id: 'gastronomia_blocks',
    label: 'Gastronomía blocks',
    domain: 'sectores',
    layers: {
      motor: 'scripts/qa-gastronomia-blocks-v1.mjs',
    },
    cierreScript: null,
  },
];

export function resolvePack(packId: string): QaPackDefinition | null {
  return QA_PACKS.find((p) => p.id === packId) ?? null;
}

export function resolvePackScripts(
  pack: QaPackDefinition,
  layer?: PackLayer
): string[] {
  if (layer) {
    const script = pack.layers[layer];
    if (!script) throw new Error(`Pack ${pack.id} has no layer ${layer}`);
    return [script];
  }
  if (pack.cierreScript) return [pack.cierreScript];
  const ordered: PackLayer[] = ['motor', 'persist', 'render'];
  return ordered.map((l) => pack.layers[l]).filter((s): s is string => Boolean(s));
}
