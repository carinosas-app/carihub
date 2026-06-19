/**
 * Enlaces de contacto del perfil público (demo + Firestore contactoPublico).
 */
(function (global) {
  'use strict';

  var CANON = ['wa', 'tg', 'ig', 'fb', 'of', 'x', 'msg', 'tel', 'gmail'];

  var LABELS = {
    wa: 'WhatsApp',
    tg: 'Telegram',
    ig: 'Instagram',
    fb: 'Facebook',
    of: 'OnlyFans',
    x: 'X / Twitter',
    msg: 'Mensaje interno',
    tel: 'Llamada',
    gmail: 'Gmail'
  };

  function limpiarTel(v) {
    return String(v || '').replace(/\D/g, '');
  }

  function esDemo(u) {
    return !!(u && (u.__demo === true || /^demo-/i.test(String(u.__id || ''))));
  }

  function cp(u) {
    return (u && (u.contactoPublico || u.contactosPublicos)) || {};
  }

  function rawValor(u, key) {
    var c = cp(u);
    if (key === 'wa') return c.whatsapp || u.whatsapp || u.telefono || '';
    if (key === 'tel') return u.telefono || u.telefonoContacto || c.whatsapp || '';
    if (key === 'tg') return c.telegram || u.telegram || '';
    if (key === 'ig') return c.instagram || u.instagram || '';
    if (key === 'fb') return c.facebook || u.facebook || '';
    if (key === 'of') return c.onlyFans || c.onlyfans || u.onlyfans || '';
    if (key === 'x') return c.twitter || c.x || u.twitter || u.x || '';
    if (key === 'gmail') return c.correo || u.email || u.correo || '';
    return '';
  }

  function activo(u, key) {
    if (esDemo(u)) return true;
    var c = cp(u);
    if (key === 'wa') {
      if (c.whatsappActivo === false) return false;
      return !!limpiarTel(rawValor(u, key));
    }
    if (key === 'tel') return !!limpiarTel(rawValor(u, key));
    if (key === 'tg') return c.telegramActivo === true && !!rawValor(u, key);
    if (key === 'ig') return c.instagramActivo === true && !!rawValor(u, key);
    if (key === 'of') return (c.onlyFansActivo === true || c.onlyfansActivo === true) && !!rawValor(u, key);
    if (key === 'x') return c.twitterActivo === true && !!rawValor(u, key);
    if (key === 'gmail') return c.correoActivo === true && !!rawValor(u, key);
    if (key === 'msg') return c.mensajeInternoActivo === true;
    if (key === 'fb') return !!rawValor(u, key);
    return !!rawValor(u, key);
  }

  function msgTexto(u) {
    var c = cp(u);
    var custom = String(c.mensajeContactoPublicidad || u.mensajeContactoPublicidad || '').trim();
    if (custom) return encodeURIComponent(custom);
    var n = (u && u.nombre) ? u.nombre : 'tu perfil';
    return encodeURIComponent('Hola ' + n + ', vi tu perfil en Cariñosas y me gustaría contactarte.');
  }

  function perfilId(u) {
    return String((u && (u.__id || u.uid)) || '').trim();
  }

  function indexBase() {
    var path = global.location.pathname || '';
    return path.indexOf('/preview/') >= 0 ? '../index.html' : 'index.html';
  }

  function demoHref(key, u) {
    var id = perfilId(u) || 'demo';
    var msg = msgTexto(u);
    if (key === 'wa') return 'https://wa.me/5218123456789?text=' + msg;
    if (key === 'tel') return 'tel:+5218123456789';
    if (key === 'tg') return 'https://t.me/CariHubDemo';
    if (key === 'ig') return 'https://instagram.com/carinosas_app';
    if (key === 'fb') return 'https://facebook.com/';
    if (key === 'of') return 'https://onlyfans.com/';
    if (key === 'x') return 'https://x.com/carinosas_app';
    if (key === 'gmail') return 'mailto:contacto@carinosas.app?subject=' + encodeURIComponent('Contacto desde Cariñosas');
    if (key === 'msg') return indexBase() + '?abrir=mensajes&perfil=' + encodeURIComponent(id);
    return '';
  }

  function buildHref(key, u) {
    if (esDemo(u)) return demoHref(key, u);
    if (!activo(u, key)) return '';
    var val = String(rawValor(u, key) || '').trim();
    var msg = msgTexto(u);

    if (key === 'wa') {
      var tel = limpiarTel(val);
      return tel ? 'https://wa.me/' + tel + '?text=' + msg : '';
    }
    if (key === 'tel') {
      var t = limpiarTel(val);
      return t ? 'tel:+' + t : '';
    }
    if (key === 'gmail') {
      return val.indexOf('@') >= 0
        ? 'mailto:' + encodeURIComponent(val) + '?subject=' + encodeURIComponent('Contacto desde Cariñosas')
        : '';
    }
    if (key === 'ig') {
      var ig = val.replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/\/$/, '');
      return ig ? 'https://instagram.com/' + encodeURIComponent(ig) : '';
    }
    if (key === 'tg') {
      if (/^https?:\/\//i.test(val)) return val;
      var tg = val.replace(/^@/, '');
      return tg ? 'https://t.me/' + encodeURIComponent(tg) : '';
    }
    if (key === 'fb') {
      if (/^https?:\/\//i.test(val)) return val;
      return val ? 'https://facebook.com/' + encodeURIComponent(val.replace(/^@/, '')) : '';
    }
    if (key === 'of') {
      if (/^https?:\/\//i.test(val)) return val;
      return val ? 'https://onlyfans.com/' + encodeURIComponent(val.replace(/^@/, '')) : '';
    }
    if (key === 'x') {
      if (/^https?:\/\//i.test(val)) return val;
      var xu = val.replace(/^@/, '');
      return xu ? 'https://x.com/' + encodeURIComponent(xu) : '';
    }
    if (key === 'msg') {
      var id = perfilId(u);
      return id ? indexBase() + '?abrir=mensajes&perfil=' + encodeURIComponent(id) : '';
    }
    return '';
  }

  function lista(u) {
    u = u || {};
    var keys = Array.isArray(u.contactos) && u.contactos.length ? u.contactos.slice() : CANON.slice();
    return keys.filter(function (k) {
      return !!buildHref(k, u);
    });
  }

  function contactLinks(u) {
    return lista(u).map(function (k) {
      return { key: k, href: buildHref(k, u), label: LABELS[k] || k };
    }).filter(function (x) {
      return x.href && x.label;
    });
  }

  global.CariHubPerfilContactos = {
    CANON: CANON,
    LABELS: LABELS,
    lista: lista,
    contactLinks: contactLinks,
    buildHref: buildHref,
    esDemo: esDemo
  };
})(typeof window !== 'undefined' ? window : globalThis);
