import { config } from "./config.js";
import { formatarReais, linkWhatsApp, montarLinkWhatsApp, montarPedido } from "./pedido.js";
import { calcularResultado } from "./calculadora.js";
import { montarPreparo } from "./preparo.js";

// ======== ESTADO DO CARRINHO ========
// cada item: { produto, quantidade }
let cart = [];

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
  config.produtos.forEach((produto) => {
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
    const rodape = document.createElement("div");
    rodape.className = "product-footer";
    const preco = document.createElement("span");
    preco.className = "price";
    preco.textContent = formatarReais(produto.precoCentavos);
    const botao = document.createElement("button");
    botao.className = "add-button";
    botao.type = "button";
    botao.textContent = "Adicionar";
    botao.addEventListener("click", () => adicionarAoCarrinho(produto));
    rodape.append(preco, botao);
    corpo.append(titulo, descricao, rodape);
    card.append(imagemArea, corpo);
    grade.appendChild(card);
  });
}

function montarPagamentos() {
  const grupo = document.querySelector("#grupo-pagamento .option-group");
  [...config.formasPagamento, config.textos.pagamentoACombinar].forEach((forma, index) => {
    const opcao = document.createElement("div");
    opcao.className = "option-pill";
    const input = document.createElement("input");
    input.type = "radio";
    input.id = `pagamento-${index}`;
    input.name = "pagamento";
    input.value = forma;
    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.textContent = forma;
    opcao.append(input, label);
    grupo.appendChild(opcao);
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

  config.produtos.forEach((produto) => {
    const opcao = document.createElement("option");
    opcao.value = produto.id;
    opcao.textContent = produto.nome;
    produtoInput.appendChild(opcao);
  });

  function atualizarResultado() {
    const produto = config.produtos.find((item) => item.id === produtoInput.value);
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
montarPagamentos();
montarCalculadora();
renderizarPreparo();
document.getElementById("pedir-amostra").href = montarLinkWhatsApp(
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

const cartCountEl = document.querySelector(".cart-count");
const cartButton = document.querySelector(".cart-button");
const cartToast = document.getElementById("cart-toast");

const overlay = document.getElementById("cart-overlay");
const cartDrawer = document.getElementById("cart-drawer");
const cartClose = document.getElementById("cart-close");
const cartList = document.getElementById("cart-list");
const cartEmpty = document.getElementById("cart-empty");
const cartTotalEl = document.getElementById("cart-total");
const openCheckoutBtn = document.getElementById("open-checkout");

const checkoutModal = document.getElementById("checkout-modal");
const checkoutClose = document.getElementById("checkout-close");
const checkoutForm = document.getElementById("checkout-form");
const checkoutSummary = document.getElementById("checkout-summary");

const campoNome = document.getElementById("campo-nome");
const grupoNome = document.getElementById("grupo-nome");
const campoPadaria = document.getElementById("campo-padaria");
const grupoPadaria = document.getElementById("grupo-padaria");
const campoCidadeBairro = document.getElementById("campo-cidade-bairro");
const grupoCidadeBairro = document.getElementById("grupo-cidade-bairro");
const grupoPagamento = document.getElementById("grupo-pagamento");

// ======== LÓGICA DO TOAST (AVISO VISUAL) ========
let toastTimeout;
function mostrarAvisoAdicionado() {
  cartToast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    cartToast.classList.remove("show");
  }, 2000);
}

// ======== CÁLCULOS ========
function totalCarrinho() {
  return cart.reduce(
    (soma, item) => soma + item.produto.precoCentavos * item.quantidade,
    0,
  );
}
function quantidadeTotal() {
  return cart.reduce((soma, item) => soma + item.quantidade, 0);
}

// ======== RENDERIZAÇÃO DO CARRINHO ========
function renderCarrinho() {
  cartCountEl.textContent = quantidadeTotal();
  cartTotalEl.textContent = formatarReais(totalCarrinho());
  openCheckoutBtn.disabled = cart.length === 0;

  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.appendChild(cartEmpty);
    return;
  }

  cart.forEach((item, index) => {
    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.produto.nome}</h4>
        <p>${formatarReais(item.produto.precoCentavos)} · un.</p>
        <button class="cart-item-remove" type="button" data-index="${index}">Remover</button>
      </div>
      <div class="cart-item-controls">
        <button class="qty-button" type="button" data-index="${index}" data-acao="menos" aria-label="Diminuir quantidade">−</button>
        <span class="qty-value">${item.quantidade}</span>
        <button class="qty-button" type="button" data-index="${index}" data-acao="mais" aria-label="Aumentar quantidade">+</button>
      </div>
    `;
    cartList.appendChild(el);
  });
}

function adicionarAoCarrinho(produto) {
  const existente = cart.find((item) => item.produto.id === produto.id);
  if (existente) {
    existente.quantidade += 1;
  } else {
    cart.push({ produto, quantidade: 1 });
  }
  renderCarrinho();
  mostrarAvisoAdicionado();
}

// ======== ABRIR / FECHAR PAINÉIS ========
function abrirCarrinho() {
  overlay.classList.add("is-open");
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
}
function fecharCarrinho() {
  overlay.classList.remove("is-open");
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
}
function abrirCheckout() {
  if (cart.length === 0) return;
  renderResumoCheckout();
  fecharCarrinho();
  checkoutModal.classList.add("is-open");
  checkoutModal.setAttribute("aria-hidden", "false");
}
function fecharCheckout() {
  checkoutModal.classList.remove("is-open");
  checkoutModal.setAttribute("aria-hidden", "true");
}

function renderResumoCheckout() {
  let html = "";
  cart.forEach((item) => {
    html += `<div class="checkout-summary-item"><span>${item.quantidade}x ${item.produto.nome}</span><span>${formatarReais(item.produto.precoCentavos * item.quantidade)}</span></div>`;
  });
  html += `<div class="checkout-summary-total"><span>Total</span><span>${formatarReais(totalCarrinho())}</span></div>`;
  checkoutSummary.innerHTML = html;
}

// ======== EVENTOS: CARRINHO ========
cartButton.addEventListener("click", abrirCarrinho);
cartClose.addEventListener("click", fecharCarrinho);
overlay.addEventListener("click", () => {
  fecharCarrinho();
  fecharCheckout();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    fecharMenu(true);
    fecharCarrinho();
    fecharCheckout();
  }
});

cartList.addEventListener("click", (event) => {
  const target = event.target;
  const indexAttr = target.getAttribute("data-index");
  if (indexAttr === null) return;
  const i = parseInt(indexAttr, 10);

  if (target.classList.contains("cart-item-remove")) {
    cart.splice(i, 1);
    renderCarrinho();
    return;
  }

  if (target.classList.contains("qty-button")) {
    const acao = target.getAttribute("data-acao");
    if (acao === "mais") {
      cart[i].quantidade += 1;
    } else {
      cart[i].quantidade -= 1;
      if (cart[i].quantidade <= 0) {
        cart.splice(i, 1);
      }
    }
    renderCarrinho();
  }
});

openCheckoutBtn.addEventListener("click", abrirCheckout);
checkoutClose.addEventListener("click", fecharCheckout);

// ======== VALIDAÇÃO DO PEDIDO ========
checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let valido = true;

  if (!campoNome.value.trim()) {
    grupoNome.classList.add("has-error");
    valido = false;
  } else {
    grupoNome.classList.remove("has-error");
  }

  if (!campoPadaria.value.trim()) {
    grupoPadaria.classList.add("has-error");
    valido = false;
  } else {
    grupoPadaria.classList.remove("has-error");
  }

  if (!campoCidadeBairro.value.trim()) {
    grupoCidadeBairro.classList.add("has-error");
    valido = false;
  } else {
    grupoCidadeBairro.classList.remove("has-error");
  }

  // Forma de pagamento obrigatória
  const pagamentoSelecionado = document.querySelector(
    'input[name="pagamento"]:checked',
  );
  if (!pagamentoSelecionado) {
    grupoPagamento.classList.add("has-error");
    valido = false;
  } else {
    grupoPagamento.classList.remove("has-error");
  }

  if (!valido) return;

  const pedido = montarPedido(cart, {
    nome: campoNome.value.trim(),
    padaria: campoPadaria.value.trim(),
    cidadeBairro: campoCidadeBairro.value.trim(),
    pagamento: pagamentoSelecionado.value,
  });
  enviarPedidoWhatsApp(pedido);
});

function enviarPedidoWhatsApp(pedido) {
  window.location.href = linkWhatsApp(pedido);

  // Reseta o carrinho e o formulário após abrir o WhatsApp
  cart = [];
  renderCarrinho();
  checkoutForm.reset();
  fecharCheckout();
}
