import { montar } from "./montar.js";
import { textos } from "./textos.js";
import { iniciarCena } from "./cena.js";
import { iniciarPalco } from "./palco.js";
const movimento = matchMedia("(prefers-reduced-motion: reduce)");
const reduzido = movimento.matches;
montar(movimento);
let alfinete;
if (!reduzido && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  alfinete = gsap.timeline({ scrollTrigger: { trigger: ".encontre-acoes", start: "top 90%", once: true } })
    .fromTo(".encontre-alfinete", { y: -48, rotation: -12 }, { y: 0, rotation: 0, duration: .5, ease: "power2.in" })
    .to(".encontre-alfinete", { y: -6, duration: .16, ease: "power2.out" })
    .to(".encontre-alfinete", { y: 0, duration: .2, ease: "power2.in" });
  movimento.addEventListener("change", () => {
    if (movimento.matches) {
      alfinete.scrollTrigger?.kill();
      alfinete.progress(1).kill();
    }
  });
}
const irPara = iniciarPalco(movimento);
const cartoes = document.getElementById("vender-cartoes");
function medirCartoes() {
  [...cartoes.children].forEach((cartao, i) => {
    const alto = Math.min(84 + i * 24, innerHeight - cartao.getBoundingClientRect().height - 16);
    cartao.style.setProperty("--cartao-topo", `${alto}px`);
  });
}
medirCartoes();
addEventListener("resize", medirCartoes, { passive: true });
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href="#origem"], a[href="#inicio"]');
  if (!a || e.ctrlKey || e.metaKey || e.shiftKey) return;
  if (irPara(a.getAttribute("href"))) {
    e.preventDefault();
    history.pushState(null, "", a.getAttribute("href"));
  }
});
const botao = document.getElementById("botao-menu");
const menu = document.getElementById("menu");
const conteudo = [
  document.getElementById("conteudo"),
  document.getElementById("contato"),
  document.getElementById("anuncio"),
];
function abrirMenu(abrir) {
  menu.hidden = !abrir;
  botao.setAttribute("aria-expanded", String(abrir));
  botao.firstChild.textContent = abrir ? textos.fechar : textos.menu;
  document.documentElement.classList.toggle("menu-aberto", abrir);
  conteudo.forEach((parte) => {
    parte.inert = abrir;
  });
  if (abrir) menu.querySelector("a")?.focus();
}
botao.addEventListener("click", () => abrirMenu(menu.hidden));
menu.addEventListener("click", (e) => {
  if (e.target.closest("a")) abrirMenu(false);
});
addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !menu.hidden) {
    abrirMenu(false);
    botao.focus();
  }
});
let cena = null;
if (window.gsap && window.ScrollTrigger && window.MorphSVGPlugin) {
  try {
    cena = iniciarCena({ reduzido });
  } catch (erro) {
    console.error(erro);
    document.getElementById("camada-gota").hidden = true;
  }
} else {
  document.getElementById("camada-gota").hidden = true;
}
const pausar = document.getElementById("pausar");
pausar.addEventListener("click", () => {
  const sim = pausar.getAttribute("aria-pressed") !== "true";
  pausar.setAttribute("aria-pressed", String(sim));
  pausar.firstChild.textContent = sim ? textos.retomar : textos.pausar;
  document.documentElement.classList.toggle("pausado", sim);
  cena?.pausar(sim);
  alfinete?.paused(sim);
});
