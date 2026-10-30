import { config } from "../js/config.js";
import { indiceDaAba } from "../js/produtos.js";
import { progressoDoCapitulo, faixa, escalaDoArco } from "./capitulo.js";
import { textos } from "./textos.js";
import { montarConta } from "./conta.js";

const $ = (id) => document.getElementById(id);
const reduzido = matchMedia("(prefers-reduced-motion: reduce)");
const ponteiroFino = matchMedia("(pointer: fine)");
const pagina = $("pagina");
const palco = $("palco");
const wrapper = $("capitulos");
const hero = $("inicio");
const origem = $("origem");
const arco = $("arco");

function elemento(tag, classe, texto) {
  const no = document.createElement(tag);
  if (classe) no.className = classe;
  if (texto !== undefined) no.textContent = texto;
  return no;
}

function link(texto, href, classe = "") {
  const no = elemento("a", classe, texto);
  no.href = href;
  if (classe.includes("botao")) {
    no.dataset.rotulo = texto;
    no.setAttribute("aria-label", texto);
  }
  return no;
}

function whatsapp(mensagem) {
  return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

const linkDegustacao = whatsapp(config.textos.whatsapp.degustacao);
const degustacao = () => link(config.textos.hero.degustacao, linkDegustacao, "botao");

function imagem(dados, classe = "", primeira = false) {
  const no = elemento("img", classe);
  no.src = `../${dados.foto}`;
  no.width = dados.largura;
  no.height = dados.altura;
  no.alt = dados.alt;
  if (dados.foto === config.textos.origem.foto) {
    no.srcset = `../${dados.foto} 720w, img/origem-1440.webp 1440w`;
    no.sizes = classe === "foto-origem"
      ? "(max-width: 919px) 88vw, 46vw"
      : "(max-width: 919px) min(88vw, 430px), min(440px, 36vw)";
  }
  if (!primeira) no.loading = "lazy";
  no.decoding = "async";
  return no;
}

function fotoEstatica(dados, primeira = false) {
  const moldura = elemento("div", "arco foto-estatica");
  moldura.append(imagem(dados, "", primeira));
  return moldura;
}

document.title = `${config.marca} · ${textos.aviso}`;
$("aviso").textContent = textos.aviso;
const marca = link("", "#inicio", "marca");
const logo = imagem({ ...config.logo, largura: 140, altura: 168 }, "", true);
logo.alt = "";
marca.append(logo, elemento("span", "", config.marca));
$("cabecalho").append(marca);

const tituloHero = elemento("h1", "", config.textos.hero.titulo);
tituloHero.id = "titulo-hero";
tituloHero.tabIndex = -1;
const conteudoHero = elemento("div", "conteudo");
const botoesHero = elemento("div", "botoes");
botoesHero.append(degustacao(), link(textos.verFormas, "#vender", "botao secundario"));
conteudoHero.append(tituloHero, elemento("p", "", textos.apoio), botoesHero);
hero.append(fotoEstatica(config.apresentacao.hero, true), conteudoHero);

const conteudoOrigem = elemento("div", "conteudo");
const tituloOrigem = elemento("h2", "", config.textos.origem.titulo);
tituloOrigem.id = "titulo-origem";
tituloOrigem.tabIndex = -1;
conteudoOrigem.append(tituloOrigem, elemento("p", "", config.textos.origem.texto));
origem.append(fotoEstatica(config.textos.origem), conteudoOrigem);
arco.append(imagem(config.apresentacao.hero, "foto-hero", true), imagem(config.textos.origem, "foto-origem"));
// O arco viajante duplica as fotos estáticas, mas é só decorativo para leitores de tela.
for (const foto of arco.children) foto.alt = "";

const vender = $("vender");
const tituloVender = elemento("h2", "", textos.vender.titulo);
tituloVender.id = "titulo-vender";
tituloVender.tabIndex = -1;
const abas = elemento("div", "abas");
abas.setAttribute("role", "tablist");
abas.setAttribute("aria-labelledby", tituloVender.id);
const fotosVenda = [
  config.textos.diferenca.cartoes.find((cartao) => cartao.foto.endsWith("/aroma-720.webp")),
  { ...config.produtos.find((produto) => produto.id === "sem-acucar"), largura: 800, altura: 800 },
];
const paineis = [];
const botoesAbas = [];
let abaAtual = 0;

function selecionarAba(indice, focar = false) {
  abaAtual = indice;
  botoesAbas.forEach((botao, i) => {
    const ativo = i === indice;
    botao.setAttribute("aria-selected", String(ativo));
    botao.tabIndex = ativo ? 0 : -1;
    paineis[i].hidden = !ativo;
    paineis[i].classList.toggle("entrou", ativo && !reduzido.matches);
  });
  if (focar) botoesAbas[indice].focus();
}

textos.vender.abas.forEach((dados, i) => {
  const botao = elemento("button", "", dados.titulo);
  botao.type = "button";
  botao.id = `aba-${i}`;
  botao.setAttribute("role", "tab");
  botao.setAttribute("aria-controls", `painel-${i}`);
  const painel = elemento("div", "aba-painel");
  painel.id = `painel-${i}`;
  painel.setAttribute("role", "tabpanel");
  painel.setAttribute("aria-labelledby", botao.id);
  painel.tabIndex = 0;
  const conteudo = elemento("div", "aba-texto");
  const lista = elemento("ul");
  dados.lista.forEach((texto) => lista.append(elemento("li", "", texto)));
  conteudo.append(elemento("h3", "", dados.frase), lista);
  const moldura = elemento("div", "arco");
  moldura.append(imagem(fotosVenda[i]));
  painel.append(conteudo, moldura, montarConta(i === 1, reduzido));
  botao.addEventListener("click", () => selecionarAba(i));
  botao.addEventListener("keydown", (evento) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(evento.key)) return;
    evento.preventDefault();
    selecionarAba(indiceDaAba(abaAtual, evento.key, botoesAbas.length), true);
  });
  abas.append(botao);
  botoesAbas.push(botao);
  paineis.push(painel);
});
const botoesVenda = elemento("div", "botoes");
const botaoConta = elemento("button", "botao secundario", config.textos.hero.conta);
botaoConta.type = "button";
botaoConta.setAttribute("aria-label", config.textos.hero.conta);
botaoConta.dataset.rotulo = config.textos.hero.conta;
botaoConta.addEventListener("click", () => {
  const conta = paineis[abaAtual].querySelector(".conta");
  conta.scrollIntoView({ behavior: reduzido.matches ? "instant" : "smooth", block: "start" });
  conta.querySelector("input").focus({ preventScroll: true });
});
botoesVenda.append(botaoConta, degustacao());
vender.append(tituloVender, abas, ...paineis, botoesVenda);
selecionarAba(0);

const contato = $("contato");
const tituloContato = elemento("h2", "", config.textos.contato.titulo);
tituloContato.id = "titulo-contato";
tituloContato.tabIndex = -1;
const linksContato = elemento("div", "contato-links");
linksContato.append(
  link(config.textos.contato.whatsapp, whatsapp(config.textos.whatsapp.geral)),
  link(config.instagram.usuario, config.instagram.url),
  link(textos.voltar, "../index.html"),
);
contato.append(tituloContato, linksContato, elemento("p", "", config.dadosLegais.razaoSocial));

const camadaMenu = $("menu-camada");
const botaoMenu = $("menu-botao");
const painelMenu = $("menu-painel");
const nav = elemento("nav", "menu-links");
nav.setAttribute("aria-label", textos.navegacao);
textos.links.forEach((item, i) => {
  const no = link(item.texto, item.href);
  no.style.setProperty("--ordem", i);
  nav.append(no);
});
const conviteMenu = link(config.textos.hero.degustacao, linkDegustacao, "menu-degustacao");
conviteMenu.style.setProperty("--ordem", textos.links.length);
painelMenu.append(nav, conviteMenu);
botaoMenu.textContent = textos.menu;
let menuAberto = false;
let rolagemSalva = 0;

function destacar(no) {
  for (const item of nav.children) item.classList.toggle("em-foco", item === no);
  nav.classList.toggle("destacando", Boolean(no));
}
for (const item of nav.children) {
  item.addEventListener("pointerenter", () => destacar(item));
  item.addEventListener("pointerleave", () => destacar(null));
  item.addEventListener("pointerdown", () => destacar(item), { passive: true });
  item.addEventListener("pointerup", () => destacar(null), { passive: true });
  item.addEventListener("pointercancel", () => destacar(null), { passive: true });
  item.addEventListener("focus", () => destacar(item));
  item.addEventListener("blur", () => destacar(null));
}

function mudarMenu(abrir, devolverFoco = true) {
  menuAberto = abrir;
  botaoMenu.textContent = abrir ? textos.fechar : textos.menu;
  botaoMenu.setAttribute("aria-expanded", String(abrir));
  painelMenu.inert = !abrir;
  painelMenu.setAttribute("aria-hidden", String(!abrir));
  pagina.inert = abrir;
  camadaMenu.classList.toggle("menu-aberto", abrir);
  if (abrir) {
    camadaMenu.setAttribute("role", "dialog");
    camadaMenu.setAttribute("aria-modal", "true");
    camadaMenu.setAttribute("aria-label", textos.navegacao);
    rolagemSalva = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${rolagemSalva}px`;
    document.body.style.width = "100%";
    nav.firstElementChild.focus();
  } else {
    camadaMenu.removeAttribute("role");
    camadaMenu.removeAttribute("aria-modal");
    camadaMenu.removeAttribute("aria-label");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, rolagemSalva);
    destacar(null);
    if (devolverFoco) botaoMenu.focus({ preventScroll: true });
    pedirQuadro();
  }
}
botaoMenu.addEventListener("click", () => mudarMenu(!menuAberto));
camadaMenu.addEventListener("keydown", (evento) => {
  if (!menuAberto) return;
  if (evento.key === "Escape") {
    evento.preventDefault();
    mudarMenu(false);
  }
  if (evento.key !== "Tab") return;
  const focaveis = [...camadaMenu.querySelectorAll("a, button")];
  const primeiro = focaveis[0];
  const ultimo = focaveis.at(-1);
  if (evento.shiftKey && document.activeElement === primeiro) {
    evento.preventDefault();
    ultimo.focus();
  } else if (!evento.shiftKey && document.activeElement === ultimo) {
    evento.preventDefault();
    primeiro.focus();
  }
});
painelMenu.addEventListener("click", (evento) => {
  if (evento.target.closest("a")) mudarMenu(false);
});

// O scroll nativo só agenda um quadro. Nenhum evento de rolagem é cancelado.
let quadro = 0;
let geometria;
let ultimoP = -1;
function medirArco() {
  const w = document.documentElement.clientWidth;
  const h = palco.getBoundingClientRect().height;
  const celular = w < 920;
  const largura = celular ? Math.min(310, w * .58) : Math.min(440, w * .36);
  const altura = celular ? h * .23 : Math.min(h * .61, largura * 1.5);
  geometria = {
    largura, altura,
    x0: celular ? (w - largura) / 2 : w * .94 - largura,
    x1: celular ? w * .06 : w * .06,
    y0: celular ? 85 : Math.max(120, h * .16),
    y1: celular ? 76 : h * .12,
    larguraFinal: celular ? w * .88 : w * .46,
    alturaFinal: celular ? h * .45 : h * .76,
  };
  palco.style.setProperty("--arco-largura", `${geometria.larguraFinal}px`);
  palco.style.setProperty("--arco-altura", `${geometria.alturaFinal}px`);
  const foto = escalaDoArco(1, largura, altura, geometria.larguraFinal, geometria.alturaFinal);
  palco.style.setProperty("--foto-largura", `${foto.larguraFoto}px`);
  palco.style.setProperty("--foto-altura", `${foto.alturaFoto}px`);
}
function atualizarScroll() {
  quadro = 0;
  if (reduzido.matches || menuAberto) return;
  const rect = wrapper.getBoundingClientRect();
  const p = progressoDoCapitulo(rect.top, rect.height, palco.getBoundingClientRect().height);
  const mover = faixa(p, 0, .7);
  const g = geometria;
  const misturar = (a, b) => a + (b - a) * mover;
  const escala = escalaDoArco(mover, g.largura, g.altura, g.larguraFinal, g.alturaFinal);
  const variaveis = {
    "--p": p,
    // O fundo fica escuro até o hero apagar; a origem espera o fundo claro.
    "--fundo": faixa(p, .35, .6),
    "--sair": faixa(p, 0, .35),
    "--entrar": faixa(p, .6, 1),
    "--troca": faixa(p, .4, .6),
    "--arco-x": `${misturar(g.x0, g.x1)}px`,
    "--arco-y": `${misturar(g.y0, g.y1)}px`,
    "--arco-sx": escala.sx,
    "--arco-sy": escala.sy,
    // A moldura nasce no tamanho final; a foto mantém a proporção ao encolher.
    "--foto-sx": escala.fotoSx,
    "--foto-sy": escala.fotoSy,
  };
  for (const [chave, valor] of Object.entries(variaveis)) palco.style.setProperty(chave, valor);
  hero.inert = p >= .35;
  origem.inert = p <= .6;
  hero.setAttribute("aria-hidden", String(p >= .35));
  origem.setAttribute("aria-hidden", String(p <= .6));
  ultimoP = p;
}
function pedirQuadro() {
  if (!quadro && !reduzido.matches) quadro = requestAnimationFrame(atualizarScroll);
}
function modoDeMovimento() {
  document.documentElement.classList.toggle("com-movimento", !reduzido.matches);
  if (reduzido.matches) {
    cancelAnimationFrame(quadro);
    quadro = 0;
    palco.removeAttribute("style");
    for (const cena of [hero, origem]) {
      cena.inert = false;
      cena.removeAttribute("aria-hidden");
    }
  } else {
    medirArco();
    atualizarScroll();
  }
  configurarLetras();
}
window.addEventListener("scroll", pedirQuadro, { passive: true });
window.addEventListener("resize", () => {
  if (!reduzido.matches) { medirArco(); pedirQuadro(); }
  clearTimeout(resizeLetras);
  resizeLetras = setTimeout(configurarLetras, 180);
}, { passive: true });

// Destinos no palco sticky precisam do ponto final da passagem, não do topo absoluto da cena.
function navegar(hash, atualizarUrl = true) {
  const destino = document.querySelector(hash);
  if (!destino) return;
  if (hash === "#origem" && !reduzido.matches) {
    const rect = wrapper.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + rect.top + rect.height - palco.getBoundingClientRect().height, behavior: "instant" });
  } else if (hash === "#inicio") {
    window.scrollTo({ top: 0, behavior: "instant" });
  } else {
    destino.scrollIntoView({ behavior: "instant" });
  }
  if (atualizarUrl) history.pushState(null, "", hash);
  if (!reduzido.matches) atualizarScroll();
  (destino.querySelector("h1, h2") || destino).focus({ preventScroll: true });
}
document.addEventListener("click", (evento) => {
  const no = evento.target.closest('a[href^="#"]');
  if (!no || evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey) return;
  evento.preventDefault();
  navegar(no.getAttribute("href"));
});
window.addEventListener("hashchange", () => navegar(location.hash, false));

let fontesProntas = false;
let resizeLetras;
let letras = [];
let centros = [];
let pesos = [];
let ponteiro = null;
let quadroLetras = 0;
function medirLetras() {
  centros = letras.map((letra) => {
    const rect = letra.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  });
}
function configurarLetras() {
  cancelAnimationFrame(quadroLetras);
  quadroLetras = 0;
  ponteiro = null;
  tituloHero.style.fontSize = "";
  tituloHero.replaceChildren();
  tituloHero.removeAttribute("aria-label");
  letras = [];
  if (!fontesProntas || !ponteiroFino.matches || reduzido.matches) {
    tituloHero.textContent = config.textos.hero.titulo;
    return;
  }
  tituloHero.setAttribute("aria-label", config.textos.hero.titulo);
  config.textos.hero.titulo.split(" ").forEach((palavra, indice) => {
    if (indice) tituloHero.append(document.createTextNode(" "));
    const grupo = elemento("span", "palavra");
    grupo.setAttribute("aria-hidden", "true");
    for (const caractere of palavra) {
      const letra = elemento("span", "letra", caractere);
      grupo.append(letra);
      letras.push(letra);
    }
    tituloHero.append(grupo);
  });
  const linhas = [];
  for (const palavra of tituloHero.querySelectorAll(".palavra")) {
    const topo = palavra.offsetTop;
    if (!linhas.length || Math.abs(linhas.at(-1).topo - topo) > 2) linhas.push({ topo, palavras: [] });
    linhas.at(-1).palavras.push(palavra);
  }
  const limite = Math.min(tituloHero.clientWidth, conteudoHero.clientWidth - 24);
  const tamanhoBase = parseFloat(getComputedStyle(tituloHero).fontSize);
  tituloHero.replaceChildren();
  for (const linha of linhas) {
    const no = elemento("span", "linha-titulo");
    no.setAttribute("aria-hidden", "true");
    linha.palavras.forEach((palavra, i) => {
      if (i) no.append(document.createTextNode(" "));
      no.append(palavra);
    });
    tituloHero.append(no);
  }
  // Reserva a largura do pior caso, com todas as letras no peso máximo.
  for (const letra of letras) letra.style.fontVariationSettings = '"wght" 640, "opsz" 72';
  const maior = Math.max(...[...tituloHero.children].map(linha => linha.getBoundingClientRect().width));
  if (maior > limite) tituloHero.style.fontSize = `${tamanhoBase * limite / maior * .98}px`;
  for (const letra of letras) letra.style.fontVariationSettings = '"wght" 400, "opsz" 72';
  pesos = letras.map(() => 400);
  medirLetras();
}
function animarLetras() {
  quadroLetras = 0;
  if (!letras.length || reduzido.matches || !ponteiroFino.matches) return;
  let precisaContinuar = false;
  letras.forEach((letra, i) => {
    const distancia = ponteiro ? Math.hypot(centros[i].x - ponteiro.x, centros[i].y - ponteiro.y) : 220;
    const alvo = ponteiro ? 300 + 340 * (1 - Math.min(1, distancia / 220)) : 400;
    pesos[i] += (alvo - pesos[i]) * .16;
    if (Math.abs(alvo - pesos[i]) > .5) precisaContinuar = true;
    letra.style.fontVariationSettings = `"wght" ${pesos[i].toFixed(1)}, "opsz" 72`;
  });
  if (precisaContinuar) quadroLetras = requestAnimationFrame(animarLetras);
}
tituloHero.addEventListener("pointermove", (evento) => {
  if (!letras.length || menuAberto || ultimoP >= .35) return;
  if (!ponteiro) medirLetras();
  ponteiro = { x: evento.clientX, y: evento.clientY };
  if (!quadroLetras) quadroLetras = requestAnimationFrame(animarLetras);
}, { passive: true });
tituloHero.addEventListener("pointerleave", () => {
  ponteiro = null;
  if (letras.length && !quadroLetras) quadroLetras = requestAnimationFrame(animarLetras);
});
reduzido.addEventListener("change", modoDeMovimento);
ponteiroFino.addEventListener("change", configurarLetras);
pagina.hidden = false;
camadaMenu.hidden = false;
modoDeMovimento();
document.fonts.ready.then(() => { fontesProntas = true; configurarLetras(); });
if (location.hash) navegar(location.hash, false);
