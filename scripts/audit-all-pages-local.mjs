const base = process.env.AUDIT_BASE || 'http://localhost:8782';
const pages = [
  'index.html',
  'resultados.html',
  'perfil.html?id=demo',
  'admin.html',
  'registro-banner.html?slot=perfil_centro',
];

const results = [];
for (const page of pages) {
  const url = `${base}/${page}`;
  const res = await fetch(url);
  const text = await res.text();
  const refs = [...text.matchAll(/(?:src|href)=["']((?!https?:|\/\/|#|data:)[^"']+)["']/g)].map((m) => m[1]);
  const missing = [];
  for (const ref of [...new Set(refs)]) {
    if (ref.includes('${')) continue;
    const assetUrl = ref.startsWith('/') ? `${base}${ref}` : `${base}/${ref.replace(/^\.\//, '')}`;
    const head = await fetch(assetUrl, { method: 'HEAD' }).catch(() => null);
    if (!head || !head.ok) missing.push(ref);
  }
  const pid = text.match(/projectId:\s*["']([^"']+)["']/)?.[1] ?? null;
  results.push({ page, http: res.status, projectId: pid, missingAssets: missing });
}
console.log(JSON.stringify(results, null, 2));
