import { config } from "../antigo/js/config.js";
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
  no.src = `../antigo/${dados.foto}`;
  no.width = dados.largura;
  no.height = dados.altura;
  no.alt = dados.alt;
  if (dados.fotoPequena && dados.foto.startsWith("img/reais/produto-")) {
    no.srcset = `../antigo/${dados.fotoPequena} 400w, ../antigo/${dados.foto} 800w`;
    no.sizes = "(max-width: 540px) 78vw, (max-width: 919px) 40vw, 360px";
  }
  if (dados.foto === config.textos.origem.foto) {
    no.srcset = `../antigo/${dados.foto} 720w, img/origem-1440.webp 1440w`;
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
conteudoHero.append(tituloHero, elemento("p", "entrada", textos.apoio), botoesHero);
hero.append(fotoEstatica(config.apresentacao.hero, true), conteudoHero);

const conteudoOrigem = elemento("div", "conteudo");
const tituloOrigem = elemento("h2", "", config.textos.origem.titulo);
tituloOrigem.id = "titulo-origem";
tituloOrigem.tabIndex = -1;
conteudoOrigem.append(tituloOrigem, elemento("p", "entrada", config.textos.origem.texto));
origem.append(fotoEstatica(config.textos.origem), conteudoOrigem);
arco.append(imagem(config.apresentacao.hero, "foto-hero", true), imagem(config.textos.origem, "foto-origem"));
// O arco viajante duplica as fotos estáticas, mas é só decorativo para leitores de tela.
for (const foto of arco.children) foto.alt = "";

function abrirCapitulo(id, titulo, entrada) {
  const secao = $(id);
  const cabecalho = elemento("h2", "", titulo);
  cabecalho.id = `titulo-${id}`;
  cabecalho.tabIndex = -1;
  secao.append(cabecalho);
  if (entrada) secao.append(elemento("p", "entrada", entrada));
  return secao;
}

const motivos = config.textos.porque.motivos;
const produtos = $("produtos");
const topoProdutos = elemento("div", "produtos-topo");
const tituloProdutos = elemento("div", "produtos-titulo");
const cabecalhoProdutos = elemento("h2", "", config.textos.produtos.titulo);
cabecalhoProdutos.id = "titulo-produtos";
cabecalhoProdutos.tabIndex = -1;
tituloProdutos.append(cabecalhoProdutos, elemento("p", "entrada", config.textos.produtos.igual));
const trilhoXicara = elemento("div", "xicara-trilho");
trilhoXicara.append($("xicara"));
topoProdutos.append(tituloProdutos, trilhoXicara);
const corpoProdutos = elemento("div", "produtos-corpo");
const pacotes = elemento("div", "produtos-grade");
config.produtos.filter((produto) => produto.exibir).forEach((produto) => {
  const item = elemento("article", "produto");
  const moldura = elemento("div", "produto-foto");
  moldura.append(imagem({ ...produto, largura: 800, altura: 800 }),
    elemento("span", "produto-selo nota", produto.selo), elemento("span", "produto-peso nota", produto.peso));
  item.append(moldura, elemento("h3", "frase", produto.selo),
    elemento("p", "", produto.frase));
  if (produto.ingredientes || produto.avisos) {
    const detalhes = elemento("details", "produto-ingredientes");
    detalhes.append(elemento("summary", "", config.textos.produtos.ingredientesTitulo));
    if (produto.ingredientes) detalhes.append(elemento("p", "nota", produto.ingredientes));
    if (produto.avisos) detalhes.append(elemento("p", "nota", produto.avisos));
    item.append(detalhes);
  }
  pacotes.append(item);
});
corpoProdutos.append(pacotes);
const dentro = elemento("div", "produtos-dentro");
dentro.append(elemento("h3", "frase", textos.produtos.conteudo),
  elemento("p", "entrada", config.textos.diferenca.destaque));
const ingredientes = elemento("div", "ingredientes-grade");
config.textos.diferenca.cartoes.forEach((cartao) => {
  const item = elemento("article");
  item.append(imagem(cartao, "foto-retangular"), elemento("h4", "frase", cartao.titulo),
    elemento("p", "", cartao.texto));
  ingredientes.append(item);
});
dentro.append(ingredientes);
corpoProdutos.append(dentro);
const faixaProdutos = elemento("div", "produtos-notas");
for (const [chave, texto] of [["rendimento", motivos[1]], ["validade", motivos[3]], ["conservacao", config.textos.conservacao]]) {
  const item = elemento("div");
  item.append(elemento("h3", "nota", textos.produtos[chave]), elemento("p", "", texto));
  faixaProdutos.append(item);
}
corpoProdutos.append(faixaProdutos);
produtos.replaceChildren(topoProdutos, $("espuma"), corpoProdutos);

const faixaSecao = $("faixa");
faixaSecao.setAttribute("aria-label", textos.faixa);
const janelaFaixa = elemento("div", "faixa-janela");
const trilhoFaixa = elemento("div", "faixa-trilho");
const textoFaixa = [...config.textos.diferenca.cartoes.slice(0, 3).map((item) => item.titulo.split(",")[0]), textos.taparuba].join(" · ");
for (let i = 0; i < 4; i++) {
  const grupo = elemento("span", "faixa-grupo", textoFaixa);
  if (i) grupo.setAttribute("aria-hidden", "true");
  trilhoFaixa.append(grupo);
}
janelaFaixa.append(trilhoFaixa);
const pausar = elemento("button", "faixa-pausar", textos.pausar);
pausar.type = "button";
pausar.setAttribute("aria-pressed", "false");
pausar.addEventListener("click", () => {
  const pausado = pausar.getAttribute("aria-pressed") !== "true";
  document.documentElement.classList.toggle("pausado", pausado);
  pausar.setAttribute("aria-pressed", String(pausado));
  pausar.textContent = pausado ? textos.retomar : textos.pausar;
});
faixaSecao.append(janelaFaixa, pausar);

const preparo = abrirCapitulo("preparo", config.textos.preparo.titulo, motivos[2]);
const passosPreparo = elemento("ol", "preparo-passos");
config.textos.preparo.passos.forEach((passo, i) => {
  const item = elemento("li");
  const numero = elemento("span", "passo-numero", i + 1);
  numero.setAttribute("aria-hidden", "true");
  item.append(numero, imagem(passo, "foto-retangular"), elemento("h3", "frase", passo.titulo),
    elemento("p", "", passo.descricao));
  passosPreparo.append(item);
});
preparo.append(passosPreparo);
preparo.append(elemento("p", "preparo-dica", config.textos.preparo.dica));

const como = abrirCapitulo("como", config.textos.como.titulo, motivos[4]);
const passosComo = elemento("ol", "como-passos");
config.textos.como.passos.forEach((passo, i) => {
  const item = elemento("li");
  const numero = elemento("span", "passo-numero", i + 1);
  numero.setAttribute("aria-hidden", "true");
  item.append(numero, elemento("p", "", passo.replace(/^\d+\.\s*/, "")));
  passosComo.append(item);
});
como.append(passosComo, degustacao());

const duvidas = abrirCapitulo("duvidas", config.textos.faq.titulo);
const perguntas = elemento("div", "duvidas-lista");
config.textos.faq.itens.forEach(({ pergunta, resposta }) => {
  const item = elemento("details");
  item.append(elemento("summary", "frase", pergunta), elemento("p", "", resposta));
  perguntas.append(item);
});
duvidas.append(perguntas);

const vender = $("vender");
const tituloVender = elemento("h2", "", textos.vender.titulo);
tituloVender.id = "titulo-vender";
tituloVender.tabIndex = -1;
const fotosVenda = [
  config.textos.diferenca.cartoes.find((cartao) => cartao.foto.endsWith("/aroma-720.webp")),
  { ...config.produtos.find((produto) => produto.id === "sem-acucar"), largura: 800, altura: 800 },
];
const cartoesVenda = elemento("div", "vender-cartoes");
textos.vender.abas.forEach((dados, i) => {
  const cartao = elemento("article", "venda-cartao");
  const titulo = elemento("h3", "", dados.titulo);
  titulo.id = `titulo-venda-${i}`;
  cartao.setAttribute("aria-labelledby", titulo.id);
  const conteudo = elemento("div", "venda-texto");
  const numero = elemento("span", "nota", `${i + 1} / 2`);
  numero.setAttribute("aria-hidden", "true");
  const lista = elemento("ul");
  dados.lista.forEach((texto) => lista.append(elemento("li", "", texto)));
  const moldura = elemento("div", "arco");
  moldura.append(imagem(fotosVenda[i]));
  conteudo.append(numero, titulo, elemento("p", "frase", dados.frase), lista, moldura);
  cartao.append(conteudo, montarConta(i === 1, reduzido));
  cartoesVenda.append(cartao);
});
const botoesVenda = elemento("div", "botoes");
botoesVenda.append(degustacao());
vender.append(tituloVender, elemento("p", "entrada", motivos[0]), cartoesVenda, botoesVenda);

function medirCartoes() {
  [...cartoesVenda.children].forEach((cartao, i) => {
    const topo = Math.min(72 + i * 24, window.innerHeight - cartao.getBoundingClientRect().height - 16);
    cartao.style.setProperty("--cartao-topo", `${topo}px`);
  });
}

const contato = $("contato");
const molduraContato = elemento("div", "arco contato-foto");
const fotoContato = elemento("img");
fotoContato.src = "img/contato-600.webp";
fotoContato.srcset = "img/contato-600.webp 600w, img/contato-1200.webp 1200w";
fotoContato.sizes = "(max-width: 919px) min(88vw, 430px), 37vw";
fotoContato.width = 600;
fotoContato.height = 800;
fotoContato.loading = "lazy";
fotoContato.decoding = "async";
fotoContato.alt = textos.contato.alt;
molduraContato.append(fotoContato);
const conteudoContato = elemento("div", "contato-conteudo");
const tituloContato = elemento("h2", "", textos.contato.titulo);
tituloContato.id = "titulo-contato";
tituloContato.tabIndex = -1;
function iconeContato(camera = false) {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  for (const [nome, valor] of Object.entries({ width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 1.5, "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true", focusable: "false" })) svg.setAttribute(nome, valor);
  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", camera
    ? "M4 6.5h3l1.5-3h7l1.5 3h3a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 19V8A1.5 1.5 0 0 1 4 6.5Z M16 13.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
    : "M5 3.5h14A2.5 2.5 0 0 1 21.5 6v9a2.5 2.5 0 0 1-2.5 2.5H9l-5.5 4v-5A2.5 2.5 0 0 1 2.5 15V6A2.5 2.5 0 0 1 5 3.5Z");
  svg.append(path);
  return svg;
}
const linksContato = elemento("div", "contato-links");
const conversa = link(textos.contato.botao, linkDegustacao, "botao");
conversa.prepend(iconeContato());
const instagram = link(config.instagram.usuario, config.instagram.url);
instagram.prepend(iconeContato(true));
linksContato.append(conversa, instagram);
const notasContato = elemento("div", "contato-notas");
const servicos = elemento("div", "contato-servico");
["Como é a entrega?", "Como posso pagar?"].forEach((pergunta, i) => {
  const item = config.textos.faq.itens.find((item) => item.pergunta === pergunta);
  if (!item?.resposta) return;
  const grupo = elemento("div");
  grupo.append(elemento("p", "contato-rotulo", i ? textos.contato.pagamento : textos.contato.entrega), elemento("p", "", i ? item.resposta : item.resposta.replace("pela família ", "")));
  servicos.append(grupo);
});
notasContato.append(servicos,
  elemento("p", "contato-legais", [config.dadosLegais.razaoSocial, `${config.textos.contato.cnpj} ${config.dadosLegais.cnpj}`, config.dadosLegais.endereco].filter(Boolean).join(" · ")),
  link(textos.voltar, "../index.html"),
);
conteudoContato.append(tituloContato, elemento("p", "entrada", textos.contato.texto), linksContato);
contato.append(molduraContato, conteudoContato, notasContato);

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
    "--fundo": faixa(p, .3, .55),
    "--sair": faixa(p, 0, .3),
    "--entrar": faixa(p, .55, .75),
    "--troca": faixa(p, .35, .55),
    "--arco-x": `${misturar(g.x0, g.x1)}px`,
    "--arco-y": `${misturar(g.y0, g.y1)}px`,
    "--arco-sx": escala.sx,
    "--arco-sy": escala.sy,
    // A moldura nasce no tamanho final; a foto mantém a proporção ao encolher.
    "--foto-sx": escala.fotoSx,
    "--foto-sy": escala.fotoSy,
  };
  for (const [chave, valor] of Object.entries(variaveis)) palco.style.setProperty(chave, valor);
  hero.inert = p >= .3;
  origem.inert = p <= .55;
  hero.setAttribute("aria-hidden", String(p >= .3));
  origem.setAttribute("aria-hidden", String(p <= .55));
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
let ultimaRolagem = window.scrollY;
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  camadaMenu.classList.toggle("menu-recolhido", !menuAberto && y > 120 && y > ultimaRolagem);
  ultimaRolagem = y;
  pedirQuadro();
}, { passive: true });
window.addEventListener("resize", () => {
  medirCartoes();
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
  if (!letras.length || menuAberto || ultimoP >= .3) return;
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
medirCartoes();
document.fonts.ready.then(() => { fontesProntas = true; configurarLetras(); medirCartoes(); });
if (location.hash) navegar(location.hash, false);
