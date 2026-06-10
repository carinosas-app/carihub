import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const perfilPath = path.join(root, "public", "perfil.html");

const head = execSync("git show HEAD:public/perfil.html", {
  cwd: root,
  encoding: "utf8"
});

const perfil = fs.readFileSync(perfilPath, "utf8");
const tailStart = head.indexOf("function botonesFinales");
const tailEnd = head.indexOf("cargarPerfil();") + "cargarPerfil();".length;
let tail = head.slice(tailStart, tailEnd);
tail = tail.replace(
  /\n    ciudadActualPerfil = u\.ciudad \|\| "Ciudad seleccionada";\n/,
  "\n"
);

const rotation = `function goResAdSlide(stage, nextIdx){
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

const helpers = head.slice(
  head.indexOf("function obtenerParametro"),
  head.indexOf("function abrirInfoAnuncio")
);

const scriptStart = perfil.indexOf("<script>");
const scriptEnd = perfil.indexOf("</script>", scriptStart) + 9;

const newScript = `<script>
const firebaseConfig = {
  apiKey: "AIzaSyCp68DynjT63T9wHorCLxwBGkSEo_mYPUI",
  authDomain: "carihub-app.firebaseapp.com",
  projectId: "carihub-app",
  storageBucket: "carihub-app.firebasestorage.app",
  messagingSenderId: "236894758884",
  appId: "1:236894758884:web:5713e39a26c71f025a49f1"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

${helpers}
${rotation}
${tail}
`;

const out = perfil.slice(0, scriptStart) + newScript + perfil.slice(scriptEnd);
fs.writeFileSync(perfilPath, out);
console.log("restored script", out.length, "bytes");
