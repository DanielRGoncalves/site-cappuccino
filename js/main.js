import { config } from "./config.js";
import { formatarReais, linkWhatsApp } from "./pedido.js";
import { calcularResultado } from "./calculadora.js";
import { montarPreparo } from "./preparo.js";

function montarIdentidade() {
  const logoWrap = document.querySelector(".logo-wrap");
  logoWrap.setAttribute("aria-label", `${config.marca} - início`);
  const logo = logoWrap.querySelector("img");
  logo.src = config.logo.foto;
  logo.alt = config.logo.alt;
  logoWrap.querySelector(".logo-fallback").textContent = config.marca;

  const introducao = document.getElementById("products-intro");
  introducao.textContent = config.textos.introducaoProdutos;
  introducao.hidden = !config.textos.introducaoProdutos;

  document.querySelector(".footer-brand h3").textContent = config.marca;
  document.getElementById("legal-name").textContent = config.dadosLegais.razaoSocial;
  document.getElementById("legal-cnpj").textContent = `CNPJ: ${config.dadosLegais.cnpj}`;
  document.getElementById("legal-address").textContent = `Endereço: ${config.dadosLegais.endereco}`;
  document.getElementById("storage-text").textContent = config.textos.conservacao;
  document.getElementById("copyright-name").textContent = config.dadosLegais.razaoSocial;
  const instagram = document.getElementById("instagram-link");
  instagram.href = config.instagram.url;
  instagram.textContent = config.instagram.usuario;

  const historia = document.querySelector(".brand-story");
  historia.hidden = !config.historia;
  historia.querySelector(".eyebrow").textContent = config.marca;
  historia.querySelector("h2").textContent = config.historia;
}

function montarProdutos() {
  const grade = document.querySelector(".products-grid");
  config.produtos.filter((produto) => produto.exibir).forEach((produto) => {
    const card = document.createElement("article");
    card.className = "product-card";
    const imagemArea = document.createElement("div");
    imagemArea.className = "product-image";
    const imagem = document.createElement("img");
    imagem.src = produto.foto;
    imagem.alt = produto.alt;
    imagem.width = 2048;
    imagem.height = 2048;
    imagem.loading = "lazy";
    imagemArea.appendChild(imagem);
    const corpo = document.createElement("div");
    corpo.className = "product-body";
    const titulo = document.createElement("h3");
    titulo.textContent = produto.nome;
    const descricao = document.createElement("p");
    descricao.textContent = `${produto.descricao} ${produto.peso}`;
    corpo.append(titulo, descricao);
    if (config.apresentacao.mostrarPrecos) {
      const preco = document.createElement("span");
      preco.className = "price";
      preco.textContent = formatarReais(produto.precoCentavos);
      corpo.appendChild(preco);
    }
    card.append(imagemArea, corpo);
    grade.appendChild(card);
  });
}

function montarCalculadora() {
  document.getElementById("padarias-title").textContent = config.textos.padarias.titulo;
  document.getElementById("padarias-description").textContent = config.textos.padarias.descricao;
  document.getElementById("calculator-notice").textContent = config.textos.padarias.aviso;

  const produtoInput = document.getElementById("calculator-product");
  const precoInput = document.getElementById("calculator-price");
  const resultadoEl = document.getElementById("calculator-result");
  const percentual = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

  config.produtos.filter((produto) => produto.exibir).forEach((produto) => {
    const opcao = document.createElement("option");
    opcao.value = produto.id;
    opcao.textContent = produto.nome;
    produtoInput.appendChild(opcao);
  });

  function atualizarResultado() {
    const produto = config.produtos.find((item) => item.exibir && item.id === produtoInput.value);
    const resultado = produto && calcularResultado(
      precoInput.value,
      produto.precoCentavos,
      config.pesoPacoteGramas,
      config.porcaoGramas,
    );
    resultadoEl.hidden = !resultado;
    if (!resultado) return;

    document.getElementById("calculator-cost").textContent = formatarReais(resultado.custoCentavos);
    document.getElementById("calculator-gain").textContent = formatarReais(resultado.ganhoCentavos);
    document.getElementById("calculator-margin").textContent = `${percentual.format(resultado.margemPercentual)}%`;
    document.getElementById("calculator-package-gain").textContent = formatarReais(resultado.ganhoPacoteCentavos);
  }

  precoInput.addEventListener("input", atualizarResultado);
  produtoInput.addEventListener("change", atualizarResultado);
}

function renderizarPreparo() {
  const preparo = montarPreparo(config.textos.preparo);
  document.getElementById("preparo-title").textContent = preparo.titulo;
  const lista = document.getElementById("preparo-steps");

  preparo.passos.forEach((passo) => {
    const card = document.createElement("article");
    card.className = "step";
    const numero = document.createElement("div");
    numero.className = "step-number";
    numero.setAttribute("aria-hidden", "true");
    numero.textContent = passo.numero;
    const titulo = document.createElement("h3");
    titulo.textContent = passo.titulo;
    const descricao = document.createElement("p");
    descricao.textContent = passo.descricao;
    card.append(numero, titulo, descricao);
    lista.appendChild(card);
  });

  document.getElementById("preparo-dica").textContent = preparo.dica;
  document.getElementById("preparo-rendimento").textContent = preparo.rendimento;
}

montarIdentidade();
montarProdutos();
montarCalculadora();
renderizarPreparo();
document.getElementById("pedir-amostra").href = linkWhatsApp(
  config.whatsapp,
  config.textos.whatsapp.amostra,
);

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("site-nav");

function fecharMenu(devolverFoco = false) {
  const estavaAberto = menuToggle.getAttribute("aria-expanded") === "true";
  nav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  if (estavaAberto && devolverFoco) menuToggle.focus();
}

menuToggle.addEventListener("click", () => {
  if (menuToggle.getAttribute("aria-expanded") === "true") {
    fecharMenu();
    return;
  }
  nav.classList.add("is-open");
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Fechar menu");
  nav.querySelector("a").focus();
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => fecharMenu());
});

window.matchMedia("(min-width: 920px)").addEventListener("change", (event) => {
  if (event.matches) fecharMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") fecharMenu(true);
});
