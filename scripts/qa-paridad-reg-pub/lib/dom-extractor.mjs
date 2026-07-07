/** Browser-side extractor (passed to page.evaluate). */
export function domExtractorSource() {
  return function extractDom(opts) {
    const scopeSelector = opts?.scopeSelector || '.playout';
    const forbiddenSelectors = opts?.forbiddenSelectors || [];
    function isVisible(el) {
      if (!el || el.nodeType !== 1) return false;
      if (el.closest('[hidden], template, [aria-hidden="true"]')) return false;
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      if (parseFloat(style.opacity || '1') === 0) return false;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 && rect.height <= 0) return false;
      return true;
    }

    const scope = document.querySelector(scopeSelector) || document.body;
    const forbidden = new Set();
    for (const sel of forbiddenSelectors || []) {
      scope.querySelectorAll(sel).forEach((el) => {
        forbidden.add(el);
        el.querySelectorAll('*').forEach((c) => forbidden.add(c));
      });
    }

    const nodes = [];
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null);
    let n;
    while ((n = walker.nextNode())) {
      const parent = n.parentElement;
      if (!parent || !isVisible(parent)) continue;
      if (forbidden.has(parent)) continue;
      const tag = parent.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') continue;
      const text = String(n.textContent || '').replace(/\s+/g, ' ').trim();
      if (!text || text.length < 2) continue;
      nodes.push({
        text,
        tag,
        selectorHint: parent.className ? '.' + String(parent.className).split(/\s+/)[0] : tag.toLowerCase(),
      });
    }

    const fullText = nodes.map((x) => x.text).join('\n');
    const dataVista = document.body.getAttribute('data-vista') || '';
    const dataPerfilTipo = document.body.getAttribute('data-perfil-tipo') || '';
    const dataTema = document.body.getAttribute('data-tema') || '';
    const pcardCount = scope.querySelectorAll('.pcard, .gal').length;

    return {
      fullText,
      nodes,
      dataVista,
      dataPerfilTipo,
      dataTema,
      pcardCount,
      title: document.title,
    };
  };
}

/**
 * Find visible text matches in extracted DOM.
 * @returns {{ count: number, inSections: Record<string, number> }}
 */
export function findTextMatches(dom, needles, sectionTexts = {}) {
  const haystack = String(dom.fullText || '').toLowerCase();
  const result = { count: 0, inSections: {}, matches: [] };

  for (const needle of needles) {
    const n = String(needle || '').trim();
    if (!n || n.length < 2) continue;
    const re = new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const nodeHits = (dom.nodes || []).filter((x) => re.test(x.text));
    if (nodeHits.length) {
      result.count += nodeHits.length;
      result.matches.push({ needle: n, hits: nodeHits.length, samples: nodeHits.slice(0, 3) });
    }
    if (re.test(haystack)) {
      result.count = Math.max(result.count, 1);
    }
  }

  for (const [sec, text] of Object.entries(sectionTexts)) {
    const secHay = String(text || '').toLowerCase();
    for (const needle of needles) {
      const n = String(needle || '').trim();
      if (!n) continue;
      if (secHay.includes(n.toLowerCase())) {
        result.inSections[sec] = (result.inSections[sec] || 0) + 1;
      }
    }
  }

  return result;
}

export async function extractSectionTexts(page, sections, forbiddenSelectors) {
  return page.evaluate(
    ({ sections, forbiddenSelectors }) => {
      function isVisible(el) {
        if (!el || el.nodeType !== 1) return false;
        if (el.closest('[hidden], template, [aria-hidden="true"]')) return false;
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        const rect = el.getBoundingClientRect();
        if (rect.width <= 0 && rect.height <= 0) return false;
        return true;
      }

      const out = {};
      for (const [key, sec] of Object.entries(sections || {})) {
        const parts = [];
        for (const sel of sec.selectors || []) {
          document.querySelectorAll(sel).forEach((el) => {
            if (!isVisible(el)) return;
            if (forbiddenSelectors?.some((f) => el.matches(f) || el.closest(f))) return;
            parts.push(el.innerText || '');
          });
        }
        out[key] = parts.join('\n');
      }
      return out;
    },
    { sections, forbiddenSelectors }
  );
}
