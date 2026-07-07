/** Canon slug — alineado con blocks sectoriales. */
export function slugSubId(id) {
  return String(id || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/_/g, '-')
    .replace(/\s+/g, '-');
}

export function slugLoose(id) {
  return slugSubId(id).replace(/-/g, ' ');
}
