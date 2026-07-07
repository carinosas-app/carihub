/** @typedef {'bloqueador'|'importante'|'mejora'} Severity */

/**
 * @param {object} fc FieldContract
 * @param {'presence'|'absence'|'location'|'duplicate'} check
 */
export function classifyRenderSeverity(fc, check) {
  if (check === 'absence' && fc?.privacy?.mustNeverAppearInPublic) {
    return 'bloqueador';
  }
  if (check === 'presence' && fc?.obligatorio) {
    return 'bloqueador';
  }
  if (check === 'location') {
    return 'importante';
  }
  if (check === 'duplicate') {
    return 'importante';
  }
  if (check === 'presence') {
    return 'importante';
  }
  return 'mejora';
}

export function isBlocker(severity) {
  return severity === 'bloqueador';
}

export function aggregateRenderStatus(results) {
  let pass = 0;
  let fail = 0;
  let warn = 0;
  let skip = 0;
  let blockers = 0;

  for (const r of results) {
    if (r.status === 'pass') pass++;
    else if (r.status === 'fail') {
      fail++;
      if (r.severity === 'bloqueador') blockers++;
    } else if (r.status === 'warn') warn++;
    else if (r.status === 'skip') skip++;
  }

  const subStatus = blockers > 0 ? 'fail' : 'pass';
  return { pass, fail, warn, skip, blockers, subStatus };
}
