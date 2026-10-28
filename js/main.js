import { config } from "./config.js";
import { formatarReais, linkWhatsApp, validarDegustacao, montarMensagemDegustacao } from "./pedido.js";
import { calcularResultado, calcularRevenda, coposPorPacote } from "./calculadora.js";
import { montarPreparo } from "./preparo.js";
import { produtosVisiveis, indiceDaAba } from "./produtos.js";

function montarFoto(dados, primeiraTela = false) {
  if (!dados.foto) {
    const quadro = document.createElement("div");
    quadro.className = "photo-placeholder";
    quadro.textContent = config.apresentacao.fotoPendente;
    return quadro;
  }
  const imagem = document.createElement("img");
  imagem.src = dados.foto;
  imagem.alt = dados.alt;
  imagem.width = dados.largura;
  imagem.height = dados.altura;
  if (!primeiraTela) imagem.loading = "lazy";
  return imagem;
}

function montarIdentidade() {
  const textos = config.textos;
  const faixa = document.getElementById("prototype-banner");
  faixa.textContent = config.apresentacao.avisoPrototipo;
  faixa.hidden = !config.apresentacao.prototipo;
  const hero = config.apresentacao.hero;
  const fotoHero = montarFoto(hero, true);
  fotoHero.srcset = `${hero.fotoPequena} 480w, ${hero.foto} 720w`;
  fotoHero.sizes = "(min-width: 920px) 440px, (min-width: 640px) 380px, 280px";
  fotoHero.fetchPriority = "high";
  document.getElementById("hero-photo").appendChild(fotoHero);
  const logoWrap = document.querySelector(".logo-wrap");
  logoWrap.setAttribute("aria-label", `${config.marca} - início`);
  const logo = logoWrap.querySelector("img");
  logo.src = config.logo.foto;
  logo.alt = config.logo.alt;
  logoWrap.querySelector(".logo-fallback").textContent = config.marca;

  document.querySelectorAll("#site-nav a").forEach((link, index) => {
    link.textContent = textos.menu[index];
  });
  document.getElementById("hero-title").textContent = textos.hero.titulo;
  document.getElementById("hero-subtitle").textContent = textos.hero.subtitulo;
  document.getElementById("pedir-degustacao").textContent = textos.hero.degustacao;
  document.getElementById("ver-conta").textContent = textos.hero.conta;
  document.getElementById("products-title").textContent = textos.produtos.titulo;

  const introducao = document.getElementById("products-intro");
  introducao.textContent = config.textos.introducaoProdutos;
  introducao.hidden = !config.textos.introducaoProdutos;

  document.querySelector(".footer-brand h3").textContent = config.marca;
  document.getElementById("legal-name").textContent = config.dadosLegais.razaoSocial;
  document.getElementById("legal-cnpj").textContent = `${textos.contato.cnpj} ${config.dadosLegais.cnpj}`;
  document.getElementById("legal-address").textContent = `${textos.contato.endereco} ${config.dadosLegais.endereco}`;
  document.getElementById("storage-label").textContent = textos.contato.conservacao;
  document.getElementById("storage-text").textContent = config.textos.conservacao;
  document.getElementById("contact-title").textContent = textos.contato.titulo;
  document.getElementById("contact-label").textContent = textos.contato.faleConosco;
  document.getElementById("contact-whatsapp").textContent = textos.contato.whatsapp;
  document.getElementById("floating-whatsapp").textContent = textos.contato.flutuante;
  document.getElementById("copyright-prefix").textContent = textos.contato.direitosPrefixo;
  document.getElementById("copyright-name").textContent = config.dadosLegais.razaoSocial;
  document.getElementById("copyright-text").textContent = textos.contato.direitos;
  const instagram = document.getElementById("instagram-link");
  instagram.href = config.instagram.url;
  instagram.textContent = config.instagram.usuario;

  const historia = document.querySelector(".brand-story");
  historia.hidden = !config.historia;
  historia.querySelector(".eyebrow").textContent = config.marca;
  historia.querySelector("h2").textContent = config.historia;
}

function montarApresentacao() {
  const origem = config.textos.origem;
  document.getElementById("origem-title").textContent = origem.titulo;
  document.getElementById("origem-text").textContent = origem.texto;
  document.getElementById("origem-photo").appendChild(montarFoto(origem));
  const diferenca = config.textos.diferenca;
  document.getElementById("diferenca-title").textContent = diferenca.titulo;
  const cartoes = document.getElementById("diferenca-cards");
  diferenca.cartoes.forEach((item) => {
    const card = document.createElement("article");
    card.className = "difference-card";
    const titulo = document.createElement("h3");
    titulo.textContent = item.titulo;
    const descricao = document.createElement("p");
    descricao.textContent = item.texto;
    card.append(montarFoto(item), titulo, descricao);
    cartoes.appendChild(card);
  });
  document.getElementById("diferenca-destaque").textContent = diferenca.destaque;

  const porque = config.textos.porque;
  document.getElementById("porque-title").textContent = porque.titulo;
  const motivos = document.getElementById("porque-cards");
  porque.motivos.forEach((motivo) => {
    const card = document.createElement("article");
    card.className = "reason-card";
    card.textContent = motivo;
    motivos.appendChild(card);
  });

  const como = config.textos.como;
  document.getElementById("como-title").textContent = como.titulo;
  const passos = document.getElementById("como-passos");
  como.passos.forEach((passo) => {
    const card = document.createElement("article");
    card.className = "process-card";
    card.textContent = passo;
    passos.appendChild(card);
  });

  const faq = config.textos.faq;
  document.getElementById("faq-title").textContent = faq.titulo;
  const lista = document.getElementById("faq-items");
  faq.itens.forEach((item) => {
    const detalhes = document.createElement("details");
    const pergunta = document.createElement("summary");
    pergunta.textContent = item.pergunta;
    const resposta = document.createElement("p");
    resposta.textContent = item.resposta;
    detalhes.append(pergunta, resposta);
    lista.appendChild(detalhes);
  });
}

function configurarAbas(abas, paineis) {
  function selecionarAba(index, focar = false) {
    abas.forEach((aba, posicao) => {
      const selecionada = posicao === index;
      aba.setAttribute("aria-selected", String(selecionada));
      aba.tabIndex = selecionada ? 0 : -1;
      paineis[posicao].hidden = !selecionada;
    });
    if (focar) abas[index].focus();
  }

  abas.forEach((aba, index) => {
    aba.addEventListener("click", () => selecionarAba(index));
    aba.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      selecionarAba(indiceDaAba(index, event.key, abas.length), true);
    });
  });
  selecionarAba(0);
}

function montarProdutos() {
  const grade = document.querySelector(".products-grid");
  const listaAbas = document.getElementById("product-tabs");
  const abas = [];
  const paineis = [];

  produtosVisiveis(config.produtos).forEach((produto) => {
    const aba = document.createElement("button");
    aba.type = "button";
    aba.id = `tab-${produto.id}`;
    aba.className = `product-tab product-${produto.id}`;
    aba.setAttribute("role", "tab");
    aba.setAttribute("aria-controls", `panel-${produto.id}`);
    aba.textContent = produto.selo;
    abas.push(aba);
    listaAbas.appendChild(aba);
    const card = document.createElement("article");
    card.className = `product-card product-${produto.id}`;
    card.id = `panel-${produto.id}`;
    card.setAttribute("role", "tabpanel");
    card.setAttribute("aria-labelledby", aba.id);
    card.tabIndex = 0;
    paineis.push(card);
    const imagemArea = document.createElement("div");
    imagemArea.className = "product-image";
    const imagem = document.createElement("img");
    imagem.src = produto.foto;
    imagem.srcset = `${produto.fotoPequena} 400w, ${produto.foto} 800w`;
    imagem.sizes = "(min-width: 920px) 360px, (min-width: 640px) 280px, 240px";
    imagem.alt = produto.alt;
    imagem.width = 800;
    imagem.height = 800;
    imagem.loading = "lazy";
    imagemArea.appendChild(imagem);
    const corpo = document.createElement("div");
    corpo.className = "product-body";
    const titulo = document.createElement("h3");
    titulo.textContent = produto.nome;
    const descricao = document.createElement("p");
    descricao.textContent = produto.frase;
    const selo = document.createElement("span");
    selo.className = "product-tag";
    selo.textContent = produto.selo;
    const peso = document.createElement("p");
    peso.className = "product-weight";
    peso.textContent = produto.peso;
    corpo.append(selo, titulo, descricao, peso);
    if (produto.avisos) {
      const avisos = document.createElement("p");
      avisos.className = "product-warnings";
      avisos.textContent = produto.avisos;
      corpo.appendChild(avisos);
    }
    if (produto.ingredientes) {
      const detalhes = document.createElement("details");
      detalhes.className = "product-details";
      const resumo = document.createElement("summary");
      resumo.textContent = config.textos.produtos.ingredientesTitulo;
      detalhes.appendChild(resumo);
      const ingredientes = document.createElement("p");
      ingredientes.className = "product-ingredients";
      ingredientes.textContent = `${config.textos.produtos.ingredientesRotulo}${produto.ingredientes}`;
      detalhes.appendChild(ingredientes);
      corpo.appendChild(detalhes);
    }
    if (config.apresentacao.mostrarPrecos) {
      const preco = document.createElement("span");
      preco.className = "price";
      preco.textContent = formatarReais(produto.precoCentavos);
      corpo.appendChild(preco);
    }
    card.append(imagemArea, corpo);
    grade.appendChild(card);
  });
  configurarAbas(abas, paineis);
  document.getElementById("products-shared").textContent = config.textos.produtos.igual;
}

function montarCalculadora() {
  const textos = config.textos.padarias;
  const rotulos = {
    "padarias-title": textos.titulo,
    "padarias-description": textos.descricao,
    "calculator-notice": textos.aviso,
    "calculator-example-notice": textos.avisoExemplo,
    "calculator-cup-label": textos.tamanhoXicara,
    "calculator-package-price-label": textos.precoPacote,
    "calculator-package-hint": textos.dicaPacote,
    "calculator-kg-price-label": textos.precoKg,
    "calculator-kg-hint": textos.dicaKg,
    "calculator-tab-resale": textos.abaRevenda,
    "calculator-tab-cup": textos.abaXicara,
    "calculator-resale-price-label": textos.precoVendaPacote,
    "calculator-resale-hint": config.calculadora.revenda.exemploPrecoVenda,
    "calculator-resale-gain-label": textos.ganhoRevenda,
    "calculator-resale-margin-label": textos.margem,
    "calculator-resale-empty": textos.semResultadoRevenda,
    "calculator-price-label": textos.precoVenda,
    "calculator-price-hint": textos.dicaPrecoXicara,
    "calculator-cups-label": textos.copos,
    "calculator-cost-label": textos.custo,
    "calculator-gain-label": textos.ganho,
    "calculator-margin-label": textos.margem,
    "calculator-package-gain-label": textos.ganhoPacote,
    "calculator-empty": textos.semResultado,
  };
  Object.entries(rotulos).forEach(([id, texto]) => {
    document.getElementById(id).textContent = texto;
  });
  document.getElementById("calculator-example-notice").hidden = !config.calculadora.xicara.aConfirmar;
  configurarAbas(
    [document.getElementById("calculator-tab-resale"), document.getElementById("calculator-tab-cup")],
    [document.getElementById("calculator-panel-resale"), document.getElementById("calculator-panel-cup")],
  );

  const pacoteInput = document.getElementById("calculator-package-price");
  const kgInput = document.getElementById("calculator-kg-price");
  const precoInput = document.getElementById("calculator-price");
  const revendaInput = document.getElementById("calculator-resale-price");
  const resultadoEl = document.getElementById("calculator-result");
  const percentual = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
  let xicara = config.calculadora.xicara.tamanhos.find(({ ml }) => ml === config.calculadora.xicara.tamanhoInicialMl);

  function atualizarResultado() {
    const revenda = calcularRevenda(revendaInput.value, pacoteInput.value);
    document.getElementById("calculator-resale-result").hidden = !revenda;
    document.getElementById("calculator-resale-empty").hidden = Boolean(revenda);
    document.getElementById("calculator-resale-gain").textContent = revenda ? formatarReais(revenda.ganhoCentavos) : "";
    document.getElementById("calculator-resale-margin").textContent = revenda ? `${percentual.format(revenda.margemPercentual)}%` : "";

    document.getElementById("calculator-cups-count").textContent = coposPorPacote(config.calculadora.xicara.pesoGramas, xicara.gramas);
    const resultado = calcularResultado(precoInput.value, kgInput.value, config.calculadora.xicara.pesoGramas, xicara.gramas);
    resultadoEl.hidden = !resultado;
    document.getElementById("calculator-empty").hidden = Boolean(resultado);
    document.getElementById("calculator-cost").textContent = resultado ? formatarReais(resultado.custoCentavos) : "";
    document.getElementById("calculator-gain").textContent = resultado ? formatarReais(resultado.ganhoCentavos) : "";
    document.getElementById("calculator-margin").textContent = resultado ? `${percentual.format(resultado.margemPercentual)}%` : "";
    document.getElementById("calculator-package-gain").textContent = resultado ? formatarReais(resultado.ganhoPacoteCentavos) : "";
  }

  const opcoes = document.getElementById("calculator-cups");
  config.calculadora.xicara.tamanhos.forEach((tamanho) => {
    const rotulo = document.createElement("label");
    rotulo.className = "cup-option";
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "calculator-cup";
    radio.value = tamanho.ml;
    radio.checked = tamanho.ml === config.calculadora.xicara.tamanhoInicialMl;
    const texto = document.createElement("span");
    texto.textContent = `${tamanho.ml} ml`;
    radio.addEventListener("change", () => {
      xicara = tamanho;
      atualizarResultado();
    });
    rotulo.append(radio, texto);
    opcoes.appendChild(rotulo);
  });
  precoInput.addEventListener("input", atualizarResultado);
  revendaInput.addEventListener("input", atualizarResultado);
  pacoteInput.addEventListener("input", atualizarResultado);
  kgInput.addEventListener("input", atualizarResultado);
  atualizarResultado();
}

function montarDegustacao() {
  const textos = config.textos.degustacao;
  document.getElementById("degustacao-title").textContent = textos.titulo;
  document.getElementById("degustacao-description").textContent = textos.texto;
  document.getElementById("degustacao-submit").textContent = textos.botao;
  const campos = {};
  ["nome", "tipo", "local", "quantidade"].forEach((nome) => {
    campos[nome] = document.getElementById(`degustacao-${nome}`);
    document.getElementById(`degustacao-${nome}-label`).textContent =
      nome === "quantidade" ? `${textos[nome]} ${textos.opcional}` : textos[nome];
  });
  ["", ...textos.tipos].forEach((tipo) => {
    const opcao = document.createElement("option");
    opcao.value = tipo;
    opcao.textContent = tipo || textos.selecionarTipo;
    campos.tipo.appendChild(opcao);
  });

  const lerCliente = () => Object.fromEntries(Object.entries(campos).map(([nome, campo]) => [nome, campo.value]));
  function mostrarErro(nome, mensagem = "") {
    document.getElementById(`degustacao-${nome}-error`).textContent = mensagem;
    campos[nome].setAttribute("aria-invalid", String(Boolean(mensagem)));
  }
  ["nome", "tipo", "local"].forEach((nome) => {
    campos[nome].addEventListener(nome === "tipo" ? "change" : "input", () => {
      if (campos[nome].getAttribute("aria-invalid") === "true") {
        mostrarErro(nome, validarDegustacao(lerCliente(), textos)[nome]);
      }
    });
  });
  document.getElementById("degustacao-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const cliente = lerCliente();
    const erros = validarDegustacao(cliente, textos);
    ["nome", "tipo", "local"].forEach((nome) => mostrarErro(nome, erros[nome]));
    const primeiroErro = Object.keys(erros)[0];
    if (primeiroErro) {
      campos[primeiroErro].focus();
      return;
    }
    if (!campos.quantidade.reportValidity()) return;
    const mensagem = montarMensagemDegustacao(cliente, textos.mensagem);
    window.open(linkWhatsApp(config.whatsapp, mensagem), "_blank", "noopener,noreferrer");
  });
}

function renderizarPreparo() {
  const preparo = montarPreparo(config.textos.preparo);
  document.getElementById("preparo-title").textContent = preparo.titulo;
  const lista = document.getElementById("preparo-steps");

  preparo.passos.forEach((passo, index) => {
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
    card.append(montarFoto(config.textos.preparo.passos[index]), numero, titulo, descricao);
    lista.appendChild(card);
  });

  document.getElementById("preparo-dica").textContent = preparo.dica;
  document.getElementById("preparo-rendimento").textContent = preparo.rendimento;
}

montarIdentidade();
montarApresentacao();
montarProdutos();
montarCalculadora();
renderizarPreparo();
montarDegustacao();
const linkGeral = linkWhatsApp(config.whatsapp, config.textos.whatsapp.geral);
document.getElementById("contact-whatsapp").href = linkGeral;
document.getElementById("floating-whatsapp").href = linkGeral;

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
