import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const perfilPath = path.join(root, "public", "perfil.html");
const resultadosPath = path.join(root, "public", "resultados.html");

let html = fs.readFileSync(perfilPath, "utf8");

if (!html.includes("banners-publicidad.css")) {
  html = html.replace(
    "<title>Perfil - CariHub</title>",
    '<title>Perfil - CariHub</title>\n<link rel="stylesheet" href="css/banners-publicidad.css">'
  );
}

const res = fs.readFileSync(resultadosPath, "utf8");
const resStart = res.indexOf('<div id="bannersSuperioresCariHub"');
const resEnd = res.indexOf('<div class="resumen-busqueda">', resStart);
if (resStart === -1 || resEnd === -1) {
  throw new Error("banner block not found in resultados.html");
}

let banners = res.slice(resStart, resEnd).trimEnd();
const slots = ["perfil_izquierda", "perfil_centro", "perfil_derecha"];
let side = 0;
banners = banners.replace(/href="registro-banner\.html"/g, () => {
  const slot = slots[side++];
  return `href="registro-banner.html?slot=${slot}"`;
});

const bottom = `
  <div class="banner-bottom-wrap">
    <a class="banner-slot banner-slot--bottom" href="registro-banner.html?slot=perfil_inferior" aria-label="Anuncio inferior en perfil">
      <div class="banner-slot__stage" data-res-ad-stage="3">
        <div class="banner-slot__dots" aria-hidden="true">
          <span class="banner-slot__dot is-on" data-res-ad-dot="0"></span>
          <span class="banner-slot__dot" data-res-ad-dot="1"></span>
          <span class="banner-slot__dot" data-res-ad-dot="2"></span>
        </div>
        <div class="banner-slot__slide is-active" data-res-ad-slide="0" data-res-ad-type="image" aria-hidden="false">
          <div class="side-ad side-ad--img side-ad--img-wide">
            <img class="side-ad__img" src="img/home/banners/ad-banner-pink-01.png" alt="Anúnciate aquí — impulsa tu negocio">
          </div>
        </div>
        <div class="banner-slot__slide" data-res-ad-slide="1" data-res-ad-type="image" aria-hidden="true">
          <div class="side-ad side-ad--img side-ad--img-wide">
            <img class="side-ad__img" src="img/home/banners/ad-banner-black-01.png" alt="Anúnciate en Cariñosas">
          </div>
        </div>
        <div class="banner-slot__slide" data-res-ad-slide="2" data-res-ad-type="image" aria-hidden="true">
          <div class="side-ad side-ad--img side-ad--img-wide">
            <img class="side-ad__img" src="img/home/banners/ad-banner-pink-02.png" alt="Más visibilidad, más clientes">
          </div>
        </div>
      </div>
    </a>
  </div>`;

const bannerStart = html.indexOf('<div id="bannersSuperioresCariHub"');
const contenidoStart = html.indexOf('<div id="contenido">', bannerStart);
if (bannerStart === -1 || contenidoStart === -1) {
  throw new Error("Could not locate banner or contenido block in perfil.html");
}

html =
  html.slice(0, bannerStart) +
  banners +
  "\n\n" +
  bottom +
  "\n\n  " +
  html.slice(contenidoStart);

const modalStart = html.indexOf('<div class="modal-anuncio"');
const scriptStart = html.indexOf("\n<script>", modalStart);
if (modalStart !== -1 && scriptStart !== -1) {
  html = html.slice(0, modalStart) + html.slice(scriptStart);
}

html = html.replace('let ciudadActualPerfil = "Ciudad seleccionada";\n\n', "");
html = html.replace(
  /function abrirInfoAnuncio[\s\S]*?function cerrarInfoAnuncio\(\)\{[\s\S]*?\}\n\n/,
  ""
);
html = html.replace(
  /\n    ciudadActualPerfil = u\.ciudad \|\| "Ciudad seleccionada";\n/,
  "\n"
);

const rotation = `
function goResAdSlide(stage, nextIdx){
  if(!stage) return 0;
  const slides = stage.querySelectorAll(".banner-slot__slide");
  const dots = stage.querySelectorAll(".banner-slot__dot");
  if(!slides.length) return 0;
  const idx = ((nextIdx % slides.length) + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    const on = i === idx;
    slide.classList.toggle("is-active", on);
    slide.setAttribute("aria-hidden", on ? "false" : "true");
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle("is-on", i === idx);
  });
  return idx;
}

function getResAdSlideDuration(slide, slot){
  const custom = parseInt(slide.getAttribute("data-res-ad-duration"), 10);
  if(custom > 0) return custom;
  const type = slide.getAttribute("data-res-ad-type");
  if(type === "video") return 9000;
  if(type === "image") return 5000;
  return slot === 1 ? 7000 : 5500;
}

function startResAdRotation(){
  const ROT_DELAY = [600, 400, 1800, 900];
  document.querySelectorAll("[data-res-ad-stage]").forEach((stage, slot) => {
    const slides = stage.querySelectorAll(".banner-slot__slide");
    if(slides.length < 2) return;
    const state = { idx: 0, timer: null };
    function scheduleNext(){
      clearTimeout(state.timer);
      const slide = slides[state.idx];
      const dur = getResAdSlideDuration(slide, slot);
      state.timer = setTimeout(() => {
        state.idx = goResAdSlide(stage, state.idx + 1);
        scheduleNext();
      }, dur);
    }
    const wait = ROT_DELAY[slot] || 0;
    setTimeout(scheduleNext, wait);
  });
}

startResAdRotation();
`;

if (!html.includes("function startResAdRotation")) {
  html = html.replace("cargarPerfil();", `${rotation}cargarPerfil();`);
}

fs.writeFileSync(perfilPath, html);
console.log("perfil.html updated", fs.statSync(perfilPath).size, "bytes");
