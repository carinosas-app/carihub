(function () {
  'use strict';

  function wrap(body) {
    return (
      '<svg class="home-cat-picker__icon-svg" viewBox="0 0 48 48" ' +
      'xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      body + '</svg>'
    );
  }

  function g(id, stops) {
    var s = stops.map(function (x) {
      return '<stop offset="' + x[0] + '" stop-color="' + x[1] + '"/>';
    }).join('');
    return '<linearGradient id="' + id + '" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">' + s + '</linearGradient>';
  }

  function rg(id, stops) {
    var s = stops.map(function (x) {
      return '<stop offset="' + x[0] + '" stop-color="' + x[1] + '"/>';
    }).join('');
    return '<radialGradient id="' + id + '" cx="50%" cy="35%" r="65%">' + s + '</radialGradient>';
  }

  function shine() {
    return '<ellipse cx="20" cy="14" rx="8" ry="5" fill="#fff" opacity=".28"/>';
  }

  var I = {
    escort: wrap(
      '<defs>' + g('e1', [['0%', '#ffb8dc'], ['100%', '#e91e8c']]) + g('e2', [['0%', '#9c3d72'], ['100%', '#d81b7a']]) + '</defs>' +
      '<ellipse cx="24" cy="10" rx="7.5" ry="5.5" fill="url(#e2)"/>' +
      '<circle cx="24" cy="11.5" r="5.2" fill="#ffd8ec"/>' +
      '<path d="M17.5 18.5c1.8-1.2 4.2-1.8 6.5-1.8s4.7.6 6.5 1.8l1.2 1.2-1.8 21.5c-.3 1.8-2.8 2.4-5.9 2.4s-5.6-.6-5.9-2.4L16.3 19.7z" fill="url(#e1)"/>' +
      '<path d="M21 18.5l3-3.5 3 3.5" fill="#ffc4e3" opacity=".75"/>' +
      '<circle cx="22" cy="11" r=".9" fill="#7a2048"/><circle cx="26" cy="11" r=".9" fill="#7a2048"/>' +
      shine()
    ),

    escortVip: wrap(
      '<defs>' + g('ev1', [['0%', '#ffe566'], ['50%', '#ffb300'], ['100%', '#e68a00']]) + rg('ev2', [['0%', '#fff8dc'], ['100%', '#ffd54f']]) + '</defs>' +
      '<path d="M8 30l4.5-14 3.5 7 4-11 4 11 3.5-7L40 30H8z" fill="url(#ev1)" stroke="#c8860a" stroke-width=".8"/>' +
      '<circle cx="12.5" cy="28" r="2" fill="#e040fb"/><circle cx="24" cy="26" r="2.4" fill="#ff4081"/><circle cx="35.5" cy="28" r="2" fill="#7c4dff"/>' +
      '<rect x="7" y="30" width="34" height="5" rx="2" fill="url(#ev2)"/>' +
      '<path d="M14 14l2 3M24 10l0 4M34 14l-2 3" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".7"/>' +
      shine()
    ),

    escortGay: wrap(
      '<defs><clipPath id="egc"><rect x="10" y="12" width="28" height="22" rx="3"/></clipPath></defs>' +
      '<rect x="10" y="12" width="28" height="22" rx="3" fill="#fff" opacity=".25"/>' +
      '<g clip-path="url(#egc)">' +
      '<rect x="10" y="12" width="28" height="3.7" fill="#e40303"/>' +
      '<rect x="10" y="15.7" width="28" height="3.7" fill="#ff8c00"/>' +
      '<rect x="10" y="19.4" width="28" height="3.7" fill="#ffed00"/>' +
      '<rect x="10" y="23.1" width="28" height="3.7" fill="#008026"/>' +
      '<rect x="10" y="26.8" width="28" height="3.7" fill="#24408e"/>' +
      '<rect x="10" y="30.5" width="28" height="3.5" fill="#732982"/>' +
      '</g>' +
      '<path d="M10 12c0-2 2.5-4 6-4h16c3.5 0 6 2 6 4" fill="none" stroke="#fff" stroke-width="1" opacity=".5"/>' +
      '<circle cx="24" cy="35" r="4.5" fill="#ce93d8" stroke="#9c27b0" stroke-width=".8"/>' +
      '<path d="M21.5 35c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5" fill="none" stroke="#fff" stroke-width="1"/>' +
      shine()
    ),

    edecan: wrap(
      '<defs>' + g('ed1', [['0%', '#f8bbd0'], ['100%', '#ec407a']]) + g('ed2', [['0%', '#ffd54f'], ['100%', '#ff8f00']]) + '</defs>' +
      '<ellipse cx="24" cy="10.5" rx="7" ry="5" fill="#b565a7"/>' +
      '<circle cx="24" cy="12" r="5" fill="#ffe0f0"/>' +
      '<path d="M18 18.5c2-1.3 4-1.8 6-1.8s4 .5 6 1.8l1 22.5H17z" fill="url(#ed1)"/>' +
      '<path d="M21 18l3-2.5 3 2.5" fill="#ffc1d9" opacity=".8"/>' +
      '<path d="M32 8l2.5 1.5-1 2.8 2.8-.5.8 2.7 2-2.1 2.1 2-2.7-.8.5 2.8-2.8-1L32 16l-1.5-2.5 2.8-1-2.8-.5.5-2.8z" fill="url(#ed2)"/>' +
      '<circle cx="32" cy="11.5" r="1.2" fill="#fff" opacity=".55"/>' +
      shine()
    ),

    stripper: wrap(
      '<defs>' + rg('st1', [['0%', '#fff9c4'], ['100%', '#ff6f00']]) + g('st2', [['0%', '#ff80ab'], ['100%', '#c2185b']]) + '</defs>' +
      '<ellipse cx="24" cy="38" rx="14" ry="3" fill="#000" opacity=".12"/>' +
      '<path d="M14 38h20l-2-8H16z" fill="#5d4037"/>' +
      '<rect x="23" y="10" width="2" height="20" rx="1" fill="url(#st2)"/>' +
      '<circle cx="24" cy="9" r="3" fill="#ffd54f"/>' +
      '<path d="M10 14l6 4-2 2 8 3-3-6 4-1-5-5z" fill="url(#st1)" opacity=".9"/>' +
      '<path d="M38 14l-6 4 2 2-8 3 3-6-4-1 5-5z" fill="url(#st1)" opacity=".9"/>' +
      '<path d="M20 30c1.5-3 2.5-5 4-5s2.5 2 4 5" fill="none" stroke="#ff4081" stroke-width="1.5" opacity=".6"/>' +
      shine()
    ),

    modelos: wrap(
      '<defs>' + g('mo1', [['0%', '#eceff1'], ['100%', '#90a4ae']]) + g('mo2', [['0%', '#f48fb1'], ['100%', '#e91e63']]) + '</defs>' +
      '<rect x="8" y="16" width="32" height="22" rx="4" fill="url(#mo1)"/>' +
      '<circle cx="24" cy="27" r="8" fill="#263238" stroke="url(#mo2)" stroke-width="2.5"/>' +
      '<circle cx="24" cy="27" r="4.5" fill="#37474f"/>' +
      '<circle cx="24" cy="27" r="2" fill="#78909c"/>' +
      '<path d="M16 16l4-6h8l4 6" fill="#cfd8dc"/>' +
      '<rect x="20" y="10" width="8" height="3" rx="1" fill="#b0bec5"/>' +
      '<circle cx="36" cy="20" r="2" fill="#ff4081"/>' +
      shine()
    ),

    gigolo: wrap(
      '<defs>' + g('gi1', [['0%', '#b39ddb'], ['100%', '#5e35b1']]) + g('gi2', [['0%', '#ffe082'], ['100%', '#ffb300']]) + '</defs>' +
      '<circle cx="24" cy="11.5" r="5.5" fill="#ffccbc"/>' +
      '<path d="M17.5 17.5c2.5-1 4.5-1 6.5-1s4 .5 6.5 1l2.5 1.5-2 20.5H17l-2-20.5z" fill="url(#gi1)"/>' +
      '<path d="M17 20h14v3H17z" fill="url(#gi2)"/>' +
      '<path d="M19 23.5h10v12H19z" fill="#4527a0" opacity=".35"/>' +
      '<path d="M15 18l3-1.5M33 18l-3-1.5" stroke="#7e57c2" stroke-width="1.5" stroke-linecap="round"/>' +
      shine()
    ),

    acompanante: wrap(
      '<defs>' + g('ac1', [['0%', '#ff8a9b'], ['100%', '#e91e63']]) + '</defs>' +
      '<path d="M24 40c-8-6.5-14-12.5-14-19a9 9 0 0 1 18 0c0 6.5-6 13-14 19z" fill="url(#ac1)" opacity=".92"/>' +
      '<circle cx="17.5" cy="19" r="3.5" fill="#ffe0b2"/>' +
      '<circle cx="30.5" cy="19" r="3.5" fill="#ffe0b2"/>' +
      '<path d="M14.5 24c1.5 2 4 3 5.5 3M33.5 24c-1.5 2-4 3-5.5 3" stroke="#ad1457" stroke-width="1.2" stroke-linecap="round"/>' +
      '<path d="M17.5 15.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zM30.5 15.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="#8d3a58"/>' +
      '<ellipse cx="24" cy="33" rx="5" ry="3" fill="#fff" opacity=".2"/>' +
      shine()
    ),

    petit: wrap(
      '<defs>' + g('pe1', [['0%', '#f8bbd9'], ['100%', '#f06292']]) + g('pe2', [['0%', '#ce93d8'], ['100%', '#ab47bc']]) + '</defs>' +
      '<rect x="11" y="20" width="26" height="18" rx="3" fill="url(#pe1)"/>' +
      '<rect x="9" y="16" width="30" height="6" rx="2" fill="url(#pe2)"/>' +
      '<path d="M24 16v-5M18 11h12" stroke="#e1bee7" stroke-width="2.5" stroke-linecap="round"/>' +
      '<circle cx="18" cy="11" r="3" fill="#f48fb1"/><circle cx="30" cy="11" r="3" fill="#f48fb1"/>' +
      '<path d="M20 25h8M20 29h8M20 33h5" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".5"/>' +
      shine()
    ),

    contenido: wrap(
      '<defs>' + g('co1', [['0%', '#ef9a9a'], ['100%', '#c62828']]) + g('co2', [['0%', '#b0bec5'], ['100%', '#546e7a']]) + '</defs>' +
      '<rect x="7" y="14" width="28" height="20" rx="3" fill="url(#co2)"/>' +
      '<circle cx="21" cy="24" r="6" fill="#263238" stroke="#78909c" stroke-width="1.5"/>' +
      '<rect x="28" y="18" width="5" height="4" rx="1" fill="#455a64"/>' +
      '<circle cx="33" cy="16" r="3" fill="url(#co1)"/><circle cx="33" cy="16" r="1.2" fill="#fff" opacity=".8"/>' +
      '<path d="M14 36l4-3 3 2 4-4 3 3" stroke="#ec407a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
      shine()
    ),

    tabledance: wrap(
      '<defs>' + rg('ta1', [['0%', '#fff9c4'], ['100%', '#ff8f00']]) + g('ta2', [['0%', '#e1bee7'], ['100%', '#7b1fa2']]) + '</defs>' +
      '<ellipse cx="24" cy="40" rx="12" ry="2.5" fill="#000" opacity=".1"/>' +
      '<path d="M16 40h16l-1.5-6H17.5z" fill="#4e342e"/>' +
      '<path d="M12 10l5 3-1.5 2 6 2-2.5-5 3-1-4.5-4.5z" fill="url(#ta1)" opacity=".85"/>' +
      '<path d="M36 10l-5 3 1.5 2-6 2 2.5-5-3-1 4.5-4.5z" fill="url(#ta1)" opacity=".85"/>' +
      '<path d="M19 22l5-14 5 14-2.5-1.5-2.5 1-2.5-1.5z" fill="url(#ta2)"/>' +
      '<ellipse cx="24" cy="22" rx="5" ry="1.5" fill="#fff" opacity=".35"/>' +
      '<line x1="24" y1="8" x2="24" y2="34" stroke="#ffd54f" stroke-width="1" opacity=".4"/>' +
      shine()
    ),

    sexShop: wrap(
      '<defs>' + g('ss1', [['0%', '#ff9ec7'], ['100%', '#e91e8c']]) + g('ss2', [['0%', '#f3e5f5'], ['100%', '#ce93d8']]) + '</defs>' +
      '<path d="M14 18l-2 22h24l-2-22c0-4-3.5-7-10-7s-10 3-10 7z" fill="url(#ss1)"/>' +
      '<path d="M16 18c0-3 3.5-5 8-5s8 2 8 5" fill="url(#ss2)"/>' +
      '<path d="M24 28c-3 0-5.5 2-5.5 4.5S21 37 24 37s5.5-2 5.5-4.5S27 28 24 28z" fill="#fff" opacity=".9"/>' +
      '<path d="M24 31.5c-1.2 0-2.2.9-2.2 2s1 2 2.2 2 2.2-.9 2.2-2-1-2-2.2-2z" fill="#e91e63"/>' +
      shine()
    ),

    spa: wrap(
      '<defs>' + rg('sp1', [['0%', '#e8f5e9'], ['100%', '#66bb6a']]) + g('sp2', [['0%', '#f8bbd0'], ['100%', '#ec407a']]) + '</defs>' +
      '<ellipse cx="24" cy="36" rx="14" ry="5" fill="#81c784" opacity=".35"/>' +
      '<path d="M12 32c2-4 5-6 12-6s10 2 12 6" fill="none" stroke="#a5d6a7" stroke-width="2" opacity=".6"/>' +
      '<circle cx="16" cy="28" r="4" fill="url(#sp2)"/><circle cx="24" cy="24" r="5" fill="url(#sp2)"/><circle cx="32" cy="28" r="4" fill="url(#sp2)"/>' +
      '<circle cx="16" cy="28" r="1.5" fill="#fff" opacity=".5"/><circle cx="24" cy="24" r="2" fill="#fff" opacity=".5"/><circle cx="32" cy="28" r="1.5" fill="#fff" opacity=".5"/>' +
      '<path d="M14 18c1-3 4-5 10-5s9 2 10 5" stroke="url(#sp1)" stroke-width="2" fill="none" opacity=".7"/>' +
      shine()
    ),

    masajes: wrap(
      '<defs>' + g('ma1', [['0%', '#ffccbc'], ['100%', '#ff8a65']]) + '</defs>' +
      '<ellipse cx="24" cy="30" rx="12" ry="8" fill="#ffe0b2"/>' +
      '<path d="M14 22c3-2 7-3 10-3s7 1 10 3" fill="url(#ma1)"/>' +
      '<path d="M12 26c4-1 8-1.5 12-1.5s8 .5 12 1.5" fill="url(#ma1)" opacity=".85"/>' +
      '<circle cx="18" cy="20" r="3.5" fill="#ffab91"/><circle cx="30" cy="20" r="3.5" fill="#ffab91"/>' +
      '<path d="M20 24c2 1 4 1.5 4 1.5s2-.5 4-1.5" stroke="#e64a19" stroke-width="1" opacity=".4"/>' +
      '<path d="M10 16c2 2 4 2.5 6 2M38 16c-2 2-4 2.5-6 2" stroke="#f48fb1" stroke-width="1.5" stroke-linecap="round"/>' +
      shine()
    ),

    clubSw: wrap(
      '<defs>' + g('cw1', [['0%', '#fff176'], ['100%', '#f9a825']]) + g('cw2', [['0%', '#81c784'], ['100%', '#388e3c']]) + '</defs>' +
      '<ellipse cx="24" cy="26" rx="10" ry="14" fill="url(#cw1)" transform="rotate(-30 24 26)"/>' +
      '<path d="M18 14c2-2 5-3 8-3 2 2 2 5 0 8-2 2-5 3-8 3-2-2-2-5 0-8z" fill="url(#cw2)" opacity=".9"/>' +
      '<path d="M20 18l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.8-3 1.8.5-3.5-2.5-2.5 3.5-.5z" fill="#ff4081" transform="translate(8,6) scale(.7)"/>' +
      '<circle cx="30" cy="14" r="3" fill="#ce93d8" opacity=".8"/><circle cx="16" cy="34" r="2.5" fill="#f48fb1" opacity=".8"/>' +
      shine()
    ),

    antro: wrap(
      '<defs>' + g('an1', [['0%', '#f8bbd0'], ['100%', '#ad1457']]) + rg('an2', [['0%', '#fffde7'], ['100%', '#ffd54f']]) + '</defs>' +
      '<path d="M18 38V22c0-3 2.5-6 6-6s6 3 6 6v16" fill="url(#an1)"/>' +
      '<ellipse cx="24" cy="22" rx="5" ry="2" fill="#fff" opacity=".3"/>' +
      '<circle cx="24" cy="14" r="5" fill="url(#an2)"/>' +
      '<path d="M22 10h4v2c0 1.5-1 2.5-2 2.5s-2-1-2-2.5z" fill="#ffecb3"/>' +
      '<path d="M10 12l4 2M38 12l-4 2" stroke="#ff4081" stroke-width="1.5" stroke-linecap="round"/>' +
      '<circle cx="12" cy="18" r="2" fill="#7c4dff" opacity=".7"/><circle cx="36" cy="18" r="2" fill="#00bcd4" opacity=".7"/>' +
      shine()
    ),

    antroLgbt: wrap(
      '<defs><clipPath id="alc"><circle cx="24" cy="24" r="14"/></clipPath></defs>' +
      '<circle cx="24" cy="24" r="14" fill="#1a1a2e"/>' +
      '<g clip-path="url(#alc)">' +
      '<rect x="10" y="10" width="28" height="4.5" fill="#e40303"/>' +
      '<rect x="10" y="14.5" width="28" height="4.5" fill="#ff8c00"/>' +
      '<rect x="10" y="19" width="28" height="4.5" fill="#ffed00"/>' +
      '<rect x="10" y="23.5" width="28" height="4.5" fill="#008026"/>' +
      '<rect x="10" y="28" width="28" height="4.5" fill="#24408e"/>' +
      '<rect x="10" y="32.5" width="28" height="5.5" fill="#732982"/>' +
      '</g>' +
      '<circle cx="24" cy="24" r="14" fill="none" stroke="#fff" stroke-width="1.2" opacity=".35"/>' +
      '<path d="M16 34l3-6M32 34l-3-6" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity=".5"/>' +
      shine()
    ),

    hotel: wrap(
      '<defs>' + g('ho1', [['0%', '#e1bee7'], ['100%', '#8e24aa']]) + g('ho2', [['0%', '#ffab91'], ['100%', '#e64a19']]) + '</defs>' +
      '<rect x="10" y="14" width="28" height="26" rx="2" fill="url(#ho1)"/>' +
      '<rect x="14" y="18" width="5" height="5" rx=".5" fill="#fff" opacity=".55"/>' +
      '<rect x="22" y="18" width="5" height="5" rx=".5" fill="#fff" opacity=".55"/>' +
      '<rect x="30" y="18" width="5" height="5" rx=".5" fill="#fff" opacity=".55"/>' +
      '<rect x="14" y="26" width="5" height="5" rx=".5" fill="#fff" opacity=".55"/>' +
      '<rect x="22" y="26" width="5" height="5" rx=".5" fill="#fff" opacity=".55"/>' +
      '<rect x="30" y="26" width="5" height="5" rx=".5" fill="#fff" opacity=".55"/>' +
      '<path d="M10 14h28l-4-6H14z" fill="url(#ho2)"/>' +
      '<rect x="20" y="34" width="8" height="6" rx="1" fill="#6a1b9a"/>' +
      shine()
    ),

    cabinas: wrap(
      '<defs>' + g('ca1', [['0%', '#bcaaa4'], ['100%', '#5d4037']]) + g('ca2', [['0%', '#ffe082'], ['100%', '#ffa000']]) + '</defs>' +
      '<rect x="12" y="10" width="24" height="32" rx="2" fill="url(#ca1)"/>' +
      '<rect x="16" y="14" width="16" height="24" rx="1" fill="#3e2723"/>' +
      '<circle cx="30" cy="26" r="1.5" fill="url(#ca2)"/>' +
      '<path d="M12 10h24" stroke="#8d6e63" stroke-width="1"/>' +
      '<rect x="20" y="6" width="8" height="5" rx="1" fill="#a1887f"/>' +
      shine()
    ),

    trans: wrap(
      '<defs>' + g('tr1', [['0%', '#81d4fa'], ['100%', '#0288d1']]) + g('tr2', [['0%', '#f48fb1'], ['100%', '#e91e63']]) + '</defs>' +
      '<circle cx="30" cy="14" r="6" fill="none" stroke="url(#tr1)" stroke-width="2.5"/>' +
      '<path d="M33 11l5-5M33 11h-4M33 11v-4" stroke="url(#tr1)" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M14 34V18M14 18h5M14 18v-5" stroke="url(#tr2)" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M14 34h5M14 34v-5" stroke="url(#tr2)" stroke-width="2.2" stroke-linecap="round"/>' +
      '<circle cx="20" cy="30" r="5" fill="none" stroke="url(#tr2)" stroke-width="2.5"/>' +
      shine()
    ),

    femboy: wrap(
      '<defs>' + g('fe1', [['0%', '#f8bbd0'], ['100%', '#f06292']]) + g('fe2', [['0%', '#e1bee7'], ['100%', '#ba68c8']]) + '</defs>' +
      '<circle cx="24" cy="12" r="5" fill="#ffe0f0"/>' +
      '<ellipse cx="24" cy="9.5" rx="6" ry="4" fill="#ce93d8"/>' +
      '<path d="M18 18c2-1 4-1.5 6-1.5s4 .5 6 1.5l1.5 20H16.5z" fill="url(#fe1)"/>' +
      '<circle cx="18" cy="22" r="3" fill="url(#fe2)"/><circle cx="30" cy="22" r="3" fill="url(#fe2)"/>' +
      '<circle cx="24" cy="8" r="2" fill="#fff59d"/>' +
      shine()
    ),

    swinger: wrap(
      '<defs>' + g('sw1', [['0%', '#ff8a80'], ['100%', '#e53935']]) + g('sw2', [['0%', '#80cbc4'], ['100%', '#00897b']]) + '</defs>' +
      '<circle cx="17" cy="18" r="5" fill="#ffe0b2"/><circle cx="31" cy="18" r="5" fill="#ffe0b2"/>' +
      '<path d="M12 30c2-4 5-6 9-6M36 30c-2-4-5-6-9-6" stroke="#ad1457" stroke-width="1.5" fill="none"/>' +
      '<path d="M22 28c2-2 4-2 4-2s2 0 4 2" fill="url(#sw1)" opacity=".8"/>' +
      '<path d="M18 32l6-8 6 8" fill="none" stroke="url(#sw2)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M24 20v4M22 22h4" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>' +
      shine()
    ),

    unicorns: wrap(
      '<defs>' + g('un1', [['0%', '#e1bee7'], ['100%', '#9c27b0']]) + g('un2', [['0%', '#fff9c4'], ['100%', '#ffd54f']]) + '</defs>' +
      '<path d="M10 34c4-8 8-12 14-12s10 4 14 12" fill="url(#un1)"/>' +
      '<ellipse cx="24" cy="22" rx="8" ry="7" fill="#f3e5f5"/>' +
      '<path d="M18 16l-4-8 6 4 2-6 2 6 6-4-4 8" fill="url(#un2)"/>' +
      '<circle cx="21" cy="22" r="1.2" fill="#6a1b9a"/><circle cx="27" cy="22" r="1.2" fill="#6a1b9a"/>' +
      '<path d="M22 26c1 .8 2 .8 3 0" stroke="#ce93d8" stroke-width="1" fill="none"/>' +
      '<circle cx="30" cy="14" r="2" fill="#fff" opacity=".6"/>' +
      shine()
    ),

    cuckold: wrap(
      '<defs>' + rg('cu1', [['0%', '#ffeb3b'], ['100%', '#ff5722']]) + '</defs>' +
      '<path d="M24 8c-2 4-6 8-6 13a6 6 0 0 0 12 0c0-5-4-9-6-13z" fill="url(#cu1)"/>' +
      '<path d="M24 8c1 2 2 3.5 2 5" stroke="#fff" stroke-width="1" opacity=".5" fill="none"/>' +
      '<circle cx="17" cy="30" r="4" fill="#ffe0b2"/><circle cx="31" cy="30" r="4" fill="#ffe0b2"/>' +
      '<path d="M15 35c1.5-2 3.5-3 6-3M33 35c-1.5-2-3.5-3-6-3" stroke="#bf360c" stroke-width="1.2" fill="none"/>' +
      '<circle cx="24" cy="20" r="2" fill="#fff" opacity=".4"/>' +
      shine()
    ),

    singles: wrap(
      '<defs>' + g('si1', [['0%', '#ffcc80'], ['100%', '#fb8c00']]) + rg('si2', [['0%', '#fff'], ['100%', '#ffd54f']]) + '</defs>' +
      '<circle cx="24" cy="14" r="6" fill="#ffe0b2"/>' +
      '<path d="M14 38c0-8 4.5-12 10-12s10 4 10 12" fill="url(#si1)"/>' +
      '<path d="M32 10l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.8-3 1.8.5-3.5-2.5-2.5 3.5-.5z" fill="url(#si2)"/>' +
      '<circle cx="14" cy="20" r="2" fill="#f48fb1" opacity=".7"/><circle cx="34" cy="24" r="1.5" fill="#ce93d8" opacity=".7"/>' +
      shine()
    ),

    hotwife: wrap(
      '<defs>' + rg('hw1', [['0%', '#ff8a65'], ['100%', '#d84315']]) + g('hw2', [['0%', '#f8bbd0'], ['100%', '#e91e63']]) + '</defs>' +
      '<circle cx="24" cy="24" r="11" fill="none" stroke="url(#hw2)" stroke-width="2.5"/>' +
      '<path d="M24 12c-1.5 3.5-5 7-5 11a5 5 0 0 0 10 0c0-4-3.5-7.5-5-11z" fill="url(#hw1)"/>' +
      '<circle cx="24" cy="14" r="5" fill="#ffe0b2"/>' +
      '<path d="M19 36c1.5-2 3-3 5-3s3.5 1 5 3" stroke="#ad1457" stroke-width="1.2" fill="none"/>' +
      shine()
    ),

    lesbians: wrap(
      '<defs>' + g('le1', [['0%', '#f48fb1'], ['100%', '#c2185b']]) + '</defs>' +
      '<path d="M24 40c-7-5.5-12-10.5-12-16.5a6 6 0 0 1 12 0c0 6-5 11-12 16.5z" fill="url(#le1)" opacity=".9"/>' +
      '<circle cx="17" cy="16" r="4.5" fill="#ffe0b2"/><circle cx="31" cy="16" r="4.5" fill="#ffe0b2"/>' +
      '<path d="M14 22c2 2 4.5 3 7 3M34 22c-2 2-4.5 3-7 3" stroke="#880e4f" stroke-width="1.2" fill="none"/>' +
      '<circle cx="17" cy="13" r="2" fill="#8d3a58"/><circle cx="31" cy="13" r="2" fill="#8d3a58"/>' +
      shine()
    ),

    tomBoy: wrap(
      '<defs>' + g('tb1', [['0%', '#90caf9'], ['100%', '#1565c0']]) + g('tb2', [['0%', '#ffcc80'], ['100%', '#ef6c00']]) + '</defs>' +
      '<ellipse cx="24" cy="12" rx="7" ry="4" fill="url(#tb2)"/>' +
      '<circle cx="24" cy="14" r="5.5" fill="#ffccbc"/>' +
      '<path d="M16 20c2.5-.8 5-1 8-1s5.5.2 8 1l2 18H14z" fill="url(#tb1)"/>' +
      '<path d="M14 20h20l-2-4H16z" fill="#0d47a1" opacity=".5"/>' +
      '<rect x="17" y="8" width="14" height="4" rx="2" fill="url(#tb2)"/>' +
      shine()
    ),

    tomFem: wrap(
      '<defs>' + g('tf1', [['0%', '#f8bbd0'], ['100%', '#ec407a']]) + g('tf2', [['0%', '#ce93d8'], ['100%', '#8e24aa']]) + '</defs>' +
      '<rect x="20" y="8" width="8" height="22" rx="2" fill="url(#tf2)"/>' +
      '<rect x="18" y="28" width="12" height="5" rx="1.5" fill="#6a1b9a"/>' +
      '<ellipse cx="24" cy="8" rx="5" ry="3" fill="url(#tf1)"/>' +
      '<path d="M22 14h4M22 18h4M22 22h3" stroke="#fff" stroke-width="1" opacity=".45"/>' +
      '<circle cx="30" cy="12" r="2.5" fill="#ff4081"/><circle cx="30" cy="12" r="1" fill="#fff" opacity=".5"/>' +
      shine()
    ),

    dotados: wrap(
      '<defs>' + g('do1', [['0%', '#ffab91'], ['100%', '#d84315']]) + rg('do2', [['0%', '#fff9c4'], ['100%', '#ffb300']]) + '</defs>' +
      '<circle cx="24" cy="24" r="12" fill="url(#do2)"/>' +
      '<path d="M24 12v14M18 20h12M20 16h8M20 28h8" stroke="url(#do1)" stroke-width="2.5" stroke-linecap="round"/>' +
      '<circle cx="24" cy="24" r="4" fill="#fff" opacity=".35"/>' +
      '<path d="M30 10l2 2-2 2M18 10l-2 2 2 2" stroke="#ff8f00" stroke-width="1.5" stroke-linecap="round"/>' +
      shine()
    ),

    fetiche: wrap(
      '<defs>' + g('fi1', [['0%', '#424242'], ['100%', '#212121']]) + g('fi2', [['0%', '#e040fb'], ['100%', '#7b1fa2']]) + '</defs>' +
      '<path d="M14 20c0-6 4.5-10 10-10s10 4 10 10c0 4-2 8-6 12l-4 4-4-4c-4-4-6-8-6-12z" fill="url(#fi1)"/>' +
      '<ellipse cx="20" cy="20" rx="3" ry="4" fill="#1a1a1a"/><ellipse cx="28" cy="20" rx="3" ry="4" fill="#1a1a1a"/>' +
      '<path d="M18 26c2 1 4 1 6 0" stroke="url(#fi2)" stroke-width="1.5" fill="none"/>' +
      '<circle cx="32" cy="14" r="2" fill="#e040fb"/>' +
      shine()
    ),

    sado: wrap(
      '<defs>' + g('sa1', [['0%', '#bdbdbd'], ['100%', '#616161']]) + g('sa2', [['0%', '#ef5350'], ['100%', '#b71c1c']]) + '</defs>' +
      '<ellipse cx="16" cy="20" rx="5" ry="7" fill="none" stroke="url(#sa1)" stroke-width="2.5"/>' +
      '<ellipse cx="32" cy="28" rx="5" ry="7" fill="none" stroke="url(#sa1)" stroke-width="2.5"/>' +
      '<path d="M20 18c4 4 8 8 8 12" stroke="url(#sa2)" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<circle cx="24" cy="14" r="2" fill="#e53935"/>' +
      shine()
    ),

    dominatrix: wrap(
      '<defs>' + g('dm1', [['0%', '#212121'], ['100%', '#000']]) + g('dm2', [['0%', '#ffd54f'], ['100%', '#ff8f00']]) + '</defs>' +
      '<path d="M10 30l5-15 4 8 5-12 5 12 4-8 5 15H10z" fill="url(#dm2)"/>' +
      '<circle cx="24" cy="14" r="5" fill="#ffccbc"/>' +
      '<path d="M18 20c2-.5 4-.8 6-.8s4 .3 6 .8l1 14H17z" fill="url(#dm1)"/>' +
      '<path d="M32 22c2 6 4 10 4 14" stroke="#e91e63" stroke-width="2" stroke-linecap="round" fill="none"/>' +
      '<path d="M34 34l2 4-3 1 1 3-4-2-4 2 1-3-3-1 2-4z" fill="#e91e63" transform="translate(0,-2) scale(.55)"/>' +
      shine()
    ),

    cineXxx: wrap(
      '<defs>' + g('cx1', [['0%', '#5c6bc0'], ['100%', '#283593']]) + g('cx2', [['0%', '#ff8a80'], ['100%', '#d32f2f']]) + '</defs>' +
      '<rect x="8" y="12" width="32" height="24" rx="3" fill="url(#cx1)"/>' +
      '<rect x="12" y="16" width="24" height="16" rx="1" fill="#1a237e"/>' +
      '<circle cx="24" cy="24" r="5" fill="url(#cx2)"/><text x="24" y="27" text-anchor="middle" fill="#fff" font-size="8" font-weight="bold">18+</text>' +
      '<rect x="6" y="14" width="3" height="20" rx="1" fill="#3949ab"/><rect x="39" y="14" width="3" height="20" rx="1" fill="#3949ab"/>' +
      '<circle cx="10" cy="10" r="2" fill="#ff4081"/><circle cx="38" cy="10" r="2" fill="#ff4081"/>' +
      shine()
    )
  };

  var MAP = {
    escort: I.escort,
    'escort gay': I.escortGay,
    'escort vip': I.escortVip,
    edecan: I.edecan,
    stripper: I.stripper,
    modelos: I.modelos,
    gigolo: I.gigolo,
    acompanante: I.acompanante,
    petit: I.petit,
    contenido: I.contenido,
    tabledance: I.tabledance,
    'sex shop': I.sexShop,
    spa: I.spa,
    masajes: I.masajes,
    'club sw': I.clubSw,
    'antro restaurant bar': I.antro,
    'antro restaurant bar lgbt': I.antroLgbt,
    'hotel motel': I.hotel,
    'cabinas glory holes': I.cabinas,
    trans: I.trans,
    femboy: I.femboy,
    swinger: I.swinger,
    unicorns: I.unicorns,
    'cuckold hotwife': I.cuckold,
    singles: I.singles,
    lesbians: I.lesbians,
    'tom boy': I.tomBoy,
    'tom fem': I.tomFem,
    dotados: I.dotados,
    fetiche: I.fetiche,
    sado: I.sado,
    dominatrix: I.dominatrix,
    'cine xxx': I.cineXxx
  };

  function iconFor(id) {
    var key = String(id || '').toLowerCase().trim();
    return MAP[key] || I.edecan;
  }

  function iconHtml(id) {
    return iconFor(id);
  }

  window.CariHubCategoriaIconos = {
    iconFor: iconFor,
    iconHtml: iconHtml
  };
})();
