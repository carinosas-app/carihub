export function normLabel(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export function normId(s: string): string {
  return s.toLowerCase().replace(/\s+/g, '-').trim();
}

export function pairKey(
  a: { sectorId: string; subcategoriaId: string },
  b: { sectorId: string; subcategoriaId: string }
): string {
  const left = `${a.sectorId}/${a.subcategoriaId}`;
  const right = `${b.sectorId}/${b.subcategoriaId}`;
  return left <= right ? `${left}|${right}` : `${right}|${left}`;
}

export function tokenSet(label: string): Set<string> {
  const tokens = normLabel(label)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1);
  return new Set(tokens);
}

export function jaccardSimilarity(a: string, b: string): number {
  const sa = tokenSet(a);
  const sb = tokenSet(b);
  if (!sa.size && !sb.size) return 1;
  if (!sa.size || !sb.size) return 0;
  let inter = 0;
  for (const t of sa) {
    if (sb.has(t)) inter += 1;
  }
  const union = sa.size + sb.size - inter;
  return union === 0 ? 0 : inter / union;
}

export function entryInScope(
  entry: { sectorId: string; subcategoriaId: string; subcategoria?: string },
  scope: { sectorIds: string[]; subcategoriaIds: string[]; focusGroups: string[] },
  focusGroups: Record<string, { sectorIds: string[]; keywords: string[] }>
): boolean {
  if (scope.subcategoriaIds.length && !scope.subcategoriaIds.includes(entry.subcategoriaId)) {
    return false;
  }
  if (scope.sectorIds.length && !scope.sectorIds.includes(entry.sectorId)) {
    return false;
  }
  if (scope.focusGroups.length) {
    const label = entry.subcategoria ?? entry.subcategoriaId;
    const nl = normLabel(label);
    let matched = false;
    for (const groupId of scope.focusGroups) {
      const group = focusGroups[groupId];
      if (!group) continue;
      if (group.sectorIds.length && !group.sectorIds.includes(entry.sectorId)) continue;
      if (group.keywords.some((kw) => nl.includes(normLabel(kw)))) {
        matched = true;
        break;
      }
    }
    if (!matched) return false;
  }
  return true;
}
