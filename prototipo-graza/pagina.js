import { montar } from "./montar.js";
import { textos } from "./textos.js";
import { iniciarCena } from "./cena.js";
import { iniciarPalco } from "./palco.js";

const movimento = matchMedia("(prefers-reduced-motion: reduce)");
const reduzido = movimento.matches;
montar(movimento);
// O palco do topo precisa da altura final antes de a cena da gota medir a página.
const irPara = iniciarPalco(movimento);

// Cartões de "Duas formas de vender" se empilham no computador (cada um um pouco mais abaixo).
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
  if (irPara(a.getAttribute("href"))) { e.preventDefault(); history.pushState(null, "", a.getAttribute("href")); }
});

// Menu em tela cheia.
const botao = document.getElementById("botao-menu");
const menu = document.getElementById("menu");
const conteudo = [document.getElementById("conteudo"), document.getElementById("contato"), document.getElementById("anuncio")];
function abrirMenu(abrir) {
  menu.hidden = !abrir;
  botao.setAttribute("aria-expanded", String(abrir));
  botao.firstChild.textContent = abrir ? textos.fechar : textos.menu;
  document.documentElement.classList.toggle("menu-aberto", abrir);
  conteudo.forEach((parte) => { parte.inert = abrir; });
  if (abrir) menu.querySelector("a")?.focus();
}
botao.addEventListener("click", () => abrirMenu(menu.hidden));
menu.addEventListener("click", (e) => { if (e.target.closest("a")) abrirMenu(false); });
addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { abrirMenu(false); botao.focus(); } });

// Você sabia?: um fato por vez.
const fatos = textos.sabia.fatos;
const fato = document.getElementById("fato");
const contagem = document.getElementById("fato-contagem");
let atual = 0;
function mostrar(passo) {
  atual = (atual + passo + fatos.length) % fatos.length;
  const trocar = () => { fato.textContent = fatos[atual]; contagem.textContent = `${atual + 1}/${fatos.length}`; fato.classList.remove("trocando"); };
  if (reduzido) return trocar();
  fato.classList.add("trocando");
  setTimeout(trocar, 220);
}
document.getElementById("fato-anterior").addEventListener("click", () => mostrar(-1));
document.getElementById("fato-proximo").addEventListener("click", () => mostrar(1));

// Cena da gota (GSAP local). Sem a biblioteca, a página continua legível e parada.
let cena = null;
if (window.gsap && window.ScrollTrigger && window.MorphSVGPlugin) {
  try { cena = iniciarCena({ reduzido }); } catch (erro) { console.error(erro); document.getElementById("camada-gota").hidden = true; }
} else {
  document.getElementById("camada-gota").hidden = true;
}

// Pausar animações: faixa, balanço dos desenhos e a conta na torneira.
const pausar = document.getElementById("pausar");
pausar.addEventListener("click", () => {
  const sim = pausar.getAttribute("aria-pressed") !== "true";
  pausar.setAttribute("aria-pressed", String(sim));
  pausar.firstChild.textContent = sim ? textos.retomar : textos.pausar;
  document.documentElement.classList.toggle("pausado", sim);
  cena?.pausar(sim);
});
