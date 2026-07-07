const STORAGE_KEY = 'carihub_rp_public_preview';

/** Strip non-JSON-safe values from hydrated profile. */
export function sanitizePerfilForBrowser(perfil) {
  try {
    return JSON.parse(
      JSON.stringify(perfil, (_k, v) => {
        if (v instanceof Date) return v.toISOString();
        if (v && typeof v === 'object' && typeof v.toDate === 'function') {
          try {
            return v.toDate().toISOString();
          } catch {
            return null;
          }
        }
        return v;
      })
    );
  } catch {
    return { ...perfil };
  }
}

function enrichPerfilForRender(perfil, mapEntry) {
  const p = perfil;
  const vista = mapEntry?.vista;

  if (vista === 'medico') {
    p.stats = p.stats || [
      ['12+', 'Años'],
      ['100+', 'Consultas'],
      ['98%', 'Satisfechos'],
      ['24h', 'Respuesta'],
    ];
    p.serviciosProfesionales = p.serviciosProfesionales || p.serviciosIncluidos || ['Consulta general'];
    p.serviciosIncluidos = p.serviciosIncluidos || p.serviciosProfesionales;
    p.noIncluidos = p.noIncluidos || [];
    p.consultorios = p.consultorios || [];
    p.reviews = p.reviews || [];
    p.faq = p.faq || [];
    p.metodosPago = p.metodosPago || ['Efectivo'];
    p.segurosAceptados = p.segurosAceptados || [];
    p.cobertura = p.cobertura || ['Monterrey'];
    p.fotos = p.fotos ?? 1;
    p.contactos = p.contactos || ['wa'];
    p.feats = p.feats || ['Cédula verificada'];
    p.rating = p.rating || '4.9';
    p.opiniones = p.opiniones ?? 0;
    p.verificado = p.verificado !== false;
    p.cedulaVerificada = p.cedulaVerificada !== false;
    p.titulo = p.titulo || p.especialidad || 'Medicina general';
    p.profesion = p.profesion || 'Médico General';
  }

  if (vista === 'dominatrix') {
    p.serviciosIncluidos = p.serviciosIncluidos || ['Femdom'];
    p.noRealiza = p.noRealiza || p.serviciosNoRealizo || ['Menores'];
    p.metodosPago = p.metodosPago || ['Efectivo'];
    p.modalidades = p.modalidades || ['recibe'];
    p.galeria = p.galeria || [];
    p.fotos = p.fotos ?? 1;
    p.contactos = p.contactos || ['wa'];
    p.verificada = p.verificada !== false;
    p.especialidadBdsm = p.especialidadBdsm || p.estiloDominacion || 'Femdom';
  }

  if (vista === 'unicorn') {
    p.buscoConocer = p.buscoConocer || ['Parejas'];
    p.objetivosPerfil = p.objetivosPerfil || ['Conocer parejas'];
    p.finalidadEncuentro = p.finalidadEncuentro || ['Socializar'];
    p.serviciosLifestyle = p.serviciosLifestyle || ['Citas'];
    p.metodosPago = p.metodosPago || ['Efectivo'];
    p.modalidades = p.modalidades || ['hotel'];
    p.fotos = p.fotos ?? 1;
    p.contactos = p.contactos || ['wa'];
    p.verificada = p.verificada !== false;
    p.buscan = p.buscan || p.buscoConocer;
  }

  return p;
}

/** Campos que renderMedicoProfesional exige pero aplicarPerfilDesdeRegistro no copia a DEMO. */
function mergeSaludFlatFields(perfil) {
  const sp = perfil.saludPerfil || {};
  if (sp.nombreProfesional && !perfil.nombreProfesional) perfil.nombreProfesional = sp.nombreProfesional;
  if (sp.especialidad && !perfil.especialidad) perfil.especialidad = sp.especialidad;
  if (sp.precioConsulta && !perfil.precioConsulta) perfil.precioConsulta = sp.precioConsulta;
  if (sp.cedulaProfesional && !perfil.cedulaProfesional) perfil.cedulaProfesional = sp.cedulaProfesional;
  if (sp.horarioAtencion && !perfil.horarioAtencion) perfil.horarioAtencion = sp.horarioAtencion;
  if (sp.subespecialidad && !perfil.subespecialidad) perfil.subespecialidad = sp.subespecialidad;
  if (sp.profesion && !perfil.profesion) perfil.profesion = sp.profesion;
  return perfil;
}

function mergeDominatrixFlatFields(perfil) {
  const dp = perfil.dominatrixPerfil || {};
  if (dp.estiloDominacion && !perfil.estiloDominacion) perfil.estiloDominacion = dp.estiloDominacion;
  if (dp.modalidadSesion && !perfil.modalidadSesion) perfil.modalidadSesion = dp.modalidadSesion;
  if (dp.limitesSesion && !perfil.limitesSesion) perfil.limitesSesion = dp.limitesSesion;
  if (Array.isArray(dp.listaFetiches) && !perfil.listaFetiches?.length) perfil.listaFetiches = dp.listaFetiches.slice();
  if (dp.equipamiento && !perfil.equipamiento) perfil.equipamiento = dp.equipamiento;
  return perfil;
}

function mergeUnicornFlatFields(perfil) {
  const up = perfil.unicornPerfil || {};
  if (up.tipoUnicornio && !perfil.tipoUnicornio) perfil.tipoUnicornio = up.tipoUnicornio;
  if (up.estadoPerfil && !perfil.estadoPerfil) perfil.estadoPerfil = up.estadoPerfil;
  if (Array.isArray(up.objetivosPerfil) && !perfil.objetivosPerfil?.length) {
    perfil.objetivosPerfil = up.objetivosPerfil.slice();
  }
  return perfil;
}

export function buildPreviewPayload(mapEntry, hydrated, query = {}, options = {}) {
  const strict = options.strict === true;
  let perfil = sanitizePerfilForBrowser(hydrated);
  if (!strict) {
    perfil = enrichPerfilForRender(perfil, mapEntry);
    perfil = mergeSaludFlatFields(perfil);
    perfil = mergeDominatrixFlatFields(perfil);
    perfil = mergeUnicornFlatFields(perfil);

    if (perfil.saludPerfil?.nombreProfesional) {
      perfil.nombre = perfil.saludPerfil.nombreProfesional;
      perfil.nombreProfesional = perfil.saludPerfil.nombreProfesional;
    }
    if (perfil.dominatrixPerfil?.estiloDominacion) {
      perfil.estiloDominacion = perfil.dominatrixPerfil.estiloDominacion;
    }
    if (perfil.unicornPerfil?.tipoUnicornio) {
      perfil.tipoUnicornio = perfil.unicornPerfil.tipoUnicornio;
    }
  }

  perfil.__previewRegistro = true;
  perfil.__id = perfil.__id || 'qa-preview-c';
  perfil.__hydratedFromBloques = strict
    ? hydrated.__hydratedFromBloques === true
    : true;

  return {
    vista: mapEntry.vista,
    tema: mapEntry.tema,
    perfil,
    query: {
      categoria: query.categoria || mapEntry.categoria,
      pais: query.pais || 'México',
      estado: query.estado || 'Nuevo León',
      ciudad: query.ciudad || 'Monterrey',
    },
  };
}

/**
 * @param {import('playwright').Page} page
 */
export async function injectViaSessionStorage(page, payload) {
  await page.addInitScript(
    ({ key, data }) => {
      sessionStorage.setItem(key, JSON.stringify(data));
    },
    { key: STORAGE_KEY, data: payload }
  );
}

export function buildPreviewUrl(baseUrl, mapEntry, payload) {
  const params = new URLSearchParams({
    from: 'registro',
    previewSource: 'registro',
    vista: payload.vista || mapEntry.vista,
    categoria: payload.query?.categoria || mapEntry.categoria || '',
  });
  if (payload.query?.pais) params.set('pais', payload.query.pais);
  if (payload.query?.estado) params.set('estado', payload.query.estado);
  if (payload.query?.ciudad) params.set('ciudad', payload.query.ciudad);
  return `${baseUrl}/perfil-publico.html?${params.toString()}`;
}

export async function waitForPaint(page, mapEntry, timeoutMs = 60000) {
  const needles = mapEntry.smokeNeedles || [];
  const dataVista = mapEntry.dataVista ?? mapEntry.vista;
  const dataPerfilTipo = mapEntry.dataPerfilTipo || null;

  await page.waitForFunction(
    ({ dataVista, dataPerfilTipo, needles }) => {
      const body = document.body;
      if (!body) return false;
      if (dataPerfilTipo) {
        if (body.getAttribute('data-perfil-tipo') !== dataPerfilTipo) return false;
      } else if (body.getAttribute('data-vista') !== dataVista) {
        return false;
      }
      const cards = document.querySelectorAll('.pcard, .gal').length;
      if (cards === 0) return false;
      if (needles.length) {
        const text = document.body.innerText || '';
        return needles.some((n) => text.toLowerCase().includes(String(n).toLowerCase()));
      }
      return true;
    },
    { dataVista, dataPerfilTipo, needles },
    { timeout: timeoutMs }
  );
}

export async function applyProfileToPage(page, payload) {
  await page.evaluate(
    ({ vista, perfil }) => {
      if (typeof aplicarPerfilDesdeRegistro === 'function') {
        aplicarPerfilDesdeRegistro(vista, perfil);
      }
      if (typeof DEMO !== 'undefined' && DEMO[vista]) {
        const d = DEMO[vista];
        if (vista === 'medico') {
          if (perfil.nombreProfesional) d.nombreProfesional = perfil.nombreProfesional;
          if (perfil.nombre) d.nombre = perfil.nombreProfesional || perfil.nombre;
          if (perfil.especialidad) d.especialidad = perfil.especialidad;
          if (perfil.precioConsulta) {
            d.precioConsulta = perfil.precioConsulta;
            d.precio = perfil.precioConsulta;
          }
          if (perfil.tagline) d.tagline = perfil.tagline;
          if (perfil.colaboracionContenido) d.colaboracionContenido = perfil.colaboracionContenido;
          if (perfil.sobreMi) d.sobreMi = perfil.sobreMi;
          if (perfil.horarioDetalle) d.horarioDetalle = perfil.horarioDetalle;
          if (perfil.horarioAtencion) d.horarioAtencion = perfil.horarioAtencion;
          if (!Array.isArray(d.stats)) {
            d.stats = perfil.stats || [['12+', 'Años'], ['100+', 'Consultas'], ['98%', 'OK'], ['24h', 'Resp']];
          }
          if (!Array.isArray(d.reviews)) d.reviews = perfil.reviews || [];
          if (!Array.isArray(d.faq)) d.faq = perfil.faq || ['¿Pregunta QA?'];
          if (!Array.isArray(d.cobertura)) {
            d.cobertura = perfil.cobertura || [perfil.ciudad || 'Monterrey'];
          }
          if (!Array.isArray(d.serviciosProfesionales)) {
            d.serviciosProfesionales = perfil.serviciosProfesionales || ['Consulta general'];
          }
          if (!Array.isArray(d.serviciosIncluidos) || !d.serviciosIncluidos.length) {
            d.serviciosIncluidos = d.serviciosProfesionales;
          }
          if (!Array.isArray(d.metodosPago) || !d.metodosPago.length) {
            d.metodosPago = perfil.metodosPago || ['Efectivo'];
          }
          if (!Array.isArray(d.feats) || !d.feats.length) d.feats = perfil.feats || ['Cédula verificada'];
          if (!Array.isArray(d.noIncluidos)) d.noIncluidos = perfil.noIncluidos || [];
          if (!Array.isArray(d.consultorios)) d.consultorios = perfil.consultorios || [];
          if (!Array.isArray(d.segurosAceptados)) d.segurosAceptados = perfil.segurosAceptados || [];
          if (d.rating == null) d.rating = perfil.rating || '4.9';
          if (d.opiniones == null) d.opiniones = perfil.opiniones ?? 0;
          if (!d.fotos) d.fotos = perfil.fotos || 1;
          if (!d.profesion) d.profesion = perfil.profesion || 'Médico General';
          if (!d.titulo) d.titulo = perfil.titulo || perfil.especialidad || 'Medicina general';
          d.verificado = true;
          d.cedulaVerificada = true;
        }
        if (vista === 'dominatrix') {
          if (perfil.estiloDominacion) d.estiloDominacion = perfil.estiloDominacion;
          if (perfil.modalidadSesion) d.modalidadSesion = perfil.modalidadSesion;
          if (perfil.limitesSesion) d.limitesSesion = perfil.limitesSesion;
          if (Array.isArray(perfil.listaFetiches) && perfil.listaFetiches.length) {
            d.listaFetiches = perfil.listaFetiches.slice();
          }
          if (perfil.sobreMi) d.sobreMi = perfil.sobreMi;
          if (perfil.horarioDetalle) d.horarioDetalle = perfil.horarioDetalle;
          if (!Array.isArray(d.serviciosIncluidos) || !d.serviciosIncluidos.length) {
            d.serviciosIncluidos = perfil.serviciosIncluidos || ['Femdom'];
          }
          if (!Array.isArray(d.noRealiza) || !d.noRealiza.length) {
            d.noRealiza = perfil.noRealiza || ['Menores'];
          }
          if (!Array.isArray(d.metodosPago) || !d.metodosPago.length) {
            d.metodosPago = perfil.metodosPago || ['Efectivo'];
          }
          if (!d.fotos) d.fotos = perfil.fotos || 1;
        }
        if (vista === 'unicorn') {
          if (Array.isArray(perfil.objetivosPerfil) && perfil.objetivosPerfil.length) {
            d.objetivosPerfil = perfil.objetivosPerfil.slice();
          }
          if (perfil.tipoUnicornio) d.tipoUnicornio = perfil.tipoUnicornio;
          if (Array.isArray(perfil.buscoConocer) && perfil.buscoConocer.length) {
            d.buscoConocer = perfil.buscoConocer.slice();
            d.buscan = perfil.buscoConocer.slice();
          }
          if (perfil.estadoPerfil) d.estadoPerfil = perfil.estadoPerfil;
          if (perfil.sobreMi) d.sobreMi = perfil.sobreMi;
          if (perfil.horarioDetalle) d.horarioDetalle = perfil.horarioDetalle;
          if (Array.isArray(perfil.finalidadEncuentro) && perfil.finalidadEncuentro.length) {
            d.finalidadEncuentro = perfil.finalidadEncuentro.slice();
          }
          if (Array.isArray(perfil.serviciosLifestyle) && perfil.serviciosLifestyle.length) {
            d.serviciosLifestyle = perfil.serviciosLifestyle.slice();
          }
          if (!Array.isArray(d.metodosPago) || !d.metodosPago.length) {
            d.metodosPago = perfil.metodosPago || ['Efectivo'];
          }
          if (!d.fotos) d.fotos = perfil.fotos || 1;
        }
      }
      if (typeof setVista === 'function') setVista(vista);
    },
    { vista: payload.vista, perfil: payload.perfil }
  );
}

export async function paintProfileEvaluate(page, payload) {
  await applyProfileToPage(page, payload);
}

export async function navigateAndPaint(session, page, payload, mapEntry, options = {}) {
  const strict = options.strict === true;
  const fullUrl = buildPreviewUrl(session.baseUrl, mapEntry, payload);
  await injectViaSessionStorage(page, payload);

  const pageErrors = [];
  const onPageError = (err) => {
    pageErrors.push({
      message: String(err?.message || err),
      stack: err?.stack || null,
    });
  };
  page.on('pageerror', onPageError);

  await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(strict ? 4000 : 2500);

  if (strict) {
    let paintOk = false;
    let paintError = null;
    try {
      await waitForPaint(page, mapEntry, 45000);
      paintOk = true;
    } catch (e) {
      paintError = e?.message || String(e);
    }

    page.off('pageerror', onPageError);
    const stored = await page.evaluate((key) => sessionStorage.getItem(key), STORAGE_KEY);

    return {
      injectionMode: 'sessionStorage-strict',
      url: fullUrl,
      strict: true,
      paintOk,
      paintError,
      sessionStoragePresent: !!stored,
      pageErrors: [...pageErrors],
      consoleErrors: [...(page.__consoleErrors || [])],
    };
  }

  let injectionMode = 'sessionStorage';
  const stored = await page.evaluate((key) => sessionStorage.getItem(key), STORAGE_KEY);
  if (!stored) injectionMode = 'evaluate';

  await applyProfileToPage(page, payload);

  try {
    await waitForPaint(page, mapEntry, 30000);
  } catch {
    injectionMode = 'evaluate';
    await applyProfileToPage(page, payload);
    await waitForPaint(page, mapEntry, 45000);
  }

  const vistaOk = await page.evaluate(
    ({ dataVista, dataPerfilTipo }) => {
      if (dataPerfilTipo) return document.body.getAttribute('data-perfil-tipo') === dataPerfilTipo;
      return document.body.getAttribute('data-vista') === dataVista;
    },
    {
      dataVista: mapEntry.dataVista ?? mapEntry.vista,
      dataPerfilTipo: mapEntry.dataPerfilTipo || null,
    }
  );
  const hasNeedle = await page.evaluate(
    (needles) => {
      const t = document.body.innerText || '';
      return needles.some((n) => t.toLowerCase().includes(String(n).toLowerCase()));
    },
    mapEntry.smokeNeedles || []
  );

  if (!vistaOk || !hasNeedle) {
    injectionMode = 'evaluate';
    await applyProfileToPage(page, payload);
    await waitForPaint(page, mapEntry, 45000);
  }

  page.off('pageerror', onPageError);

  return {
    injectionMode,
    url: fullUrl,
    pageErrors: [...pageErrors],
    consoleErrors: [...(page.__consoleErrors || [])],
  };
}

export { STORAGE_KEY };
