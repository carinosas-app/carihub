/**
 * Fondo rosa + destellos Cariñosas (misma familia visual que Home).
 * Uso: CariHubPinkSheen.mountPage(document.body);
 */
(function (global) {
  var SPARKS = [
    ["carihub-spark--flash", "6%", "4%", "0s", "3.4s", "5px"],
    ["carihub-spark--glow", "18%", "9%", "1.1s", "5.6s", "6px"],
    ["carihub-spark--chrome", "32%", "3%", "2.2s", "4.8s", "5px"],
    ["carihub-spark--star", "48%", "7%", ".5s", "4.4s", "8px"],
    ["carihub-spark--flash", "64%", "5%", "2.6s", "3.7s", "4px"],
    ["carihub-spark--glow", "82%", "8%", "1.8s", "5.9s", "7px"],
    ["carihub-spark--chrome", "92%", "14%", "3.4s", "4.5s", "5px"],
    ["carihub-spark--flash", "10%", "22%", "3.1s", "3.3s", "5px"],
    ["carihub-spark--star", "26%", "18%", "1.4s", "5.2s", "7px"],
    ["carihub-spark--glow", "42%", "24%", "2.9s", "6.1s", "6px"],
    ["carihub-spark--chrome", "58%", "20%", ".7s", "4.7s", "5px"],
    ["carihub-spark--flash", "74%", "26%", "4.2s", "3.5s", "4px"],
    ["carihub-spark--glow", "88%", "32%", "2.1s", "5.4s", "6px"],
    ["carihub-spark--star", "14%", "38%", "3.7s", "4.9s", "9px"],
    ["carihub-spark--flash", "36%", "42%", "1.6s", "3.8s", "5px"],
    ["carihub-spark--chrome", "52%", "48%", "2.5s", "4.6s", "5px"],
    ["carihub-spark--glow", "68%", "44%", "4.5s", "5.7s", "7px"],
    ["carihub-spark--flash", "84%", "50%", ".9s", "3.2s", "4px"],
    ["carihub-spark--star", "8%", "58%", "2.8s", "5s", "8px"],
    ["carihub-spark--glow", "24%", "62%", "3.9s", "6.2s", "6px"],
    ["carihub-spark--chrome", "44%", "56%", "1.2s", "4.4s", "5px"],
    ["carihub-spark--flash", "60%", "64%", "4.8s", "3.6s", "5px"],
    ["carihub-spark--glow", "76%", "68%", "2.4s", "5.5s", "6px"],
    ["carihub-spark--star", "90%", "72%", "3.3s", "4.6s", "7px"],
    ["carihub-spark--flash", "16%", "78%", "5.1s", "3.4s", "4px"],
    ["carihub-spark--chrome", "38%", "82%", "1.9s", "4.9s", "5px"],
    ["carihub-spark--glow", "54%", "88%", "4.1s", "5.8s", "7px"],
    ["carihub-spark--flash", "70%", "84%", "2.7s", "3.7s", "5px"],
    ["carihub-spark--star", "86%", "92%", "3.8s", "5.1s", "9px"],
    ["carihub-spark--glow", "50%", "96%", "1.5s", "6s", "6px"]
  ];

  function htmlDestellosRosaCarihub() {
    return SPARKS.map(function (s) {
      return (
        '<span class="carihub-spark ' + s[0] + '" style="--x:' + s[1] + ";--y:" + s[2] +
        ";--d:" + s[3] + ";--dur:" + s[4] + ";--sz:" + s[5] + '"></span>'
      );
    }).join("");
  }

  function crearCapaBrilloRosa() {
    var capa = document.createElement("div");
    capa.className = "carihub-pink-sheen__fondo";
    capa.setAttribute("aria-hidden", "true");
    capa.innerHTML =
      '<div class="carihub-pink-sheen__brillo"></div>' +
      '<div class="carihub-pink-sheen__destellos">' + htmlDestellosRosaCarihub() + "</div>";
    return capa;
  }

  function mountPage(target) {
    target = target || document.body;
    if (!target || target.dataset.carihubPageSheen === "1") return;

    var layer = document.createElement("div");
    layer.className = "carihub-page-sheen";
    layer.setAttribute("aria-hidden", "true");
    layer.appendChild(crearCapaBrilloRosa());

    if (target === document.body) {
      document.body.classList.add("carihub-page-sheen-active");
      target.insertBefore(layer, target.firstChild);
    } else {
      target.classList.add("carihub-pink-sheen");
      target.insertBefore(layer, target.firstChild);
    }
    target.dataset.carihubPageSheen = "1";
  }

  global.CariHubPinkSheen = {
    mountPage: mountPage,
    htmlDestellosRosaCarihub: htmlDestellosRosaCarihub,
    crearCapaBrilloRosa: crearCapaBrilloRosa
  };
})(typeof window !== "undefined" ? window : globalThis);
