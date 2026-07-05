// Snippet — Colabora en redes (fila dorada en tarjeta)
// Origen: public/js/carihub-public-render-lite.js
// Fecha: 2026-07-03

function colaboracionContenidoRowHTML(u) {
  var det = colaboracionContenidoDetalle(u);
  if (!det) return '';
  var valorCls = 'res-card__colab-valor';
  if (det.valor === 'Sí') valorCls += ' res-card__colab-valor--si';
  else if (det.valor === 'A convenir') valorCls += ' res-card__colab-valor--acuerdo';
  return (
    '<div class="res-card__row res-card__row--colab">' +
      '<div class="res-card__colab" role="status">' +
        svgIco('share', 'res-card__colab-ic') +
        '<span class="res-card__colab-copy">' +
          '<span class="res-card__colab-label">' + safeTxt(det.label) + '</span>' +
          '<span class="res-card__colab-sep">·</span>' +
          '<span class="' + valorCls + '">' + safeTxt(det.valor) + '</span>' +
        '</span>' +
      '</div>' +
    '</div>'
  );
}

// En cardShell: después de contextRow (ubicación), antes de trustRow (badges)
// contextRow + colabRow + trustRow
