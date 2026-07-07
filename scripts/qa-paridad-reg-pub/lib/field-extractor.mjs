const PRIVATE_ID_PATTERNS = [
  /\bcedula\b/i,
  /\brfc\b/i,
  /\bprivado\b/i,
  /\bnombreReal\b/i,
  /\bfechaNacimiento\b/i,
  /\brazonSocial\b/i,
  /\bcomprobante\b/i,
  /\bnotasInternas\b/i,
  /\bnotasRevision\b/i,
  /\bineFrente\b/i,
  /\bineReverso\b/i,
  /\bselfie\b/i,
];

function matchesPrivateId(fieldId) {
  const id = String(fieldId || '');
  return PRIVATE_ID_PATTERNS.some((re) => re.test(id));
}
const TOGGLE_PUBLIC_RE = /^mostrar.+Publico$/i;

const ROOT_STRIP_DEFAULT = [
  'datosPrivados', 'verificacion', 'camposPrivados', 'camposPublicos',
  'schemaResuelto', 'email', 'telefono',
];

const NESTED_STRIP_DEFAULT = [
  'nombreReal', 'fechaNacimiento', 'domicilioPrivado', 'correoPrivado', 'telefonoPrivado',
  'rfc', 'razonSocial', 'cedulaNumero', 'cedulaProfesion', 'cedulaProfesional', 'cedulaComprobante',
  'ineFrente', 'ineReverso', 'selfieVerificacion', 'notasInternas', 'notasRevisionAdmin',
];

export function classifyFieldPrivacy(fieldId, privacyGuard) {
  const rootStrip = privacyGuard?.ROOT_STRIP || ROOT_STRIP_DEFAULT;
  const nestedStrip = privacyGuard?.NESTED_STRIP || NESTED_STRIP_DEFAULT;
  const id = String(fieldId || '');
  if (rootStrip.includes(id)) {
    return { isPrivateField: true, mustNeverAppearInPublic: true, privacyLayer: 'root' };
  }
  if (nestedStrip.includes(id) || matchesPrivateId(id)) {
    return { isPrivateField: true, mustNeverAppearInPublic: true, privacyLayer: 'nested_or_pattern' };
  }
  if (TOGGLE_PUBLIC_RE.test(id)) {
    return { isPrivateField: false, mustNeverAppearInPublic: false, privacyLayer: 'toggle', isTogglePublic: true };
  }
  return { isPrivateField: false, mustNeverAppearInPublic: false, privacyLayer: 'public' };
}

/**
 * @returns {import('./types.mjs').FieldContract[]}
 */
export function extractFieldContracts(subMeta, mergedCfg, nestedProfileKey) {
  const contracts = [];
  const blocks = mergedCfg?.blocks || [];
  for (const block of blocks) {
    for (const field of block.fields || []) {
      if (!field?.id) continue;
      const privacy = classifyFieldPrivacy(field.id, null);
      const toggleControls = findToggleForField(field.id, block.fields || []);
      contracts.push({
        subcategoriaId: subMeta.subcategoriaId,
        subcategoria: subMeta.subcategoria,
        sectorId: subMeta.sectorId,
        categoriaPrincipal: subMeta.categoriaPrincipal,
        arquetipo: subMeta.arquetipo,
        packId: mergedCfg.deltaPack ? `${subMeta.sectorId}-${mergedCfg.deltaPack}` : (mergedCfg.id || ''),
        configId: mergedCfg.id || '',
        blockId: block.id || '',
        blockTitle: block.title || '',
        blockFieldId: field.id,
        registroLabel: field.label || field.id,
        fieldType: field.type || 'unknown',
        visibility: {
          isPublic: !privacy.isPrivateField,
          toggleFieldId: toggleControls?.toggleId || null,
          showWhen: field.showWhen || null,
          onlySubcategorias: field.onlySubcategorias || null,
          excludeSubcategorias: field.excludeSubcategorias || null,
        },
        paths: {
          bloquesKey: field.id,
          mapToPerfilKeys: inferMapPaths(field.id, nestedProfileKey),
          firestorePaths: [],
          hydratePaths: [],
          privacyStripped: privacy.mustNeverAppearInPublic,
        },
        render: {
          expectedInPerfilPublico: !privacy.isPrivateField && !privacy.isTogglePublic,
          expectedSection: block.id || block.title || null,
          renderFn: null,
        },
        privacy: {
          isPrivateField: privacy.isPrivateField,
          mustNeverAppearInPublic: privacy.mustNeverAppearInPublic,
          privacyLayer: privacy.privacyLayer,
          isTogglePublic: !!privacy.isTogglePublic,
        },
        obligatorio: (mergedCfg.obligatorios || []).includes(field.id),
        hint: field.hint || field.placeholder || null,
      });
    }
  }
  return contracts;
}

function findToggleForField(fieldId, fields) {
  const candidates = fields.filter((f) => TOGGLE_PUBLIC_RE.test(f.id || ''));
  for (const t of candidates) {
    const base = String(t.id).replace(/^mostrar/i, '').replace(/Publico$/, '');
    if (fieldId.toLowerCase().includes(base.toLowerCase()) || base.toLowerCase().includes(fieldId.toLowerCase())) {
      return { toggleId: t.id };
    }
  }
  return null;
}

function inferMapPaths(fieldId, nestedKey) {
  const paths = [fieldId];
  if (nestedKey) paths.push(`${nestedKey}.${fieldId}`);
  return paths;
}
