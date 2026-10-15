// ======== ESTADO DO CARRINHO ========
// cada item: { produto, preco, quantidade }
let cart = [];

// Número oficial para o envio dos pedidos via WhatsApp
const numeroWhatsApp = "5527998480547";

const cartCountEl = document.querySelector(".cart-count");
const cartButton = document.querySelector(".cart-button");
const addButtons = document.querySelectorAll(".add-button");
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
const campoEndereco = document.getElementById("campo-endereco");
const endRua = document.getElementById("end-rua");
const endNumero = document.getElementById("end-numero");
const endBairro = document.getElementById("end-bairro");
const endCidade = document.getElementById("end-cidade");
const grupoPagamento = document.getElementById("grupo-pagamento");

const formatBRL = (valor) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

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
    (soma, item) => soma + item.preco * item.quantidade,
    0,
  );
}
function quantidadeTotal() {
  return cart.reduce((soma, item) => soma + item.quantidade, 0);
}

// ======== RENDERIZAÇÃO DO CARRINHO ========
function renderCarrinho() {
  cartCountEl.textContent = quantidadeTotal();
  cartTotalEl.textContent = formatBRL(totalCarrinho());
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
        <h4>${item.produto}</h4>
        <p>${formatBRL(item.preco)} · un.</p>
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

function adicionarAoCarrinho(produto, preco) {
  const existente = cart.find((item) => item.produto === produto);
  if (existente) {
    existente.quantidade += 1;
  } else {
    cart.push({ produto, preco, quantidade: 1 });
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
    html += `<div class="checkout-summary-item"><span>${item.quantidade}x ${item.produto}</span><span>${formatBRL(item.preco * item.quantidade)}</span></div>`;
  });
  html += `<div class="checkout-summary-total"><span>Total</span><span>${formatBRL(totalCarrinho())}</span></div>`;
  checkoutSummary.innerHTML = html;
}

// ======== EVENTOS: ADICIONAR PRODUTO ========
addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const produto = button.getAttribute("data-produto");
    const preco = parseFloat(button.getAttribute("data-preco"));
    adicionarAoCarrinho(produto, preco);
  });
});

// ======== EVENTOS: CARRINHO ========
cartButton.addEventListener("click", abrirCarrinho);
cartClose.addEventListener("click", fecharCarrinho);
overlay.addEventListener("click", () => {
  fecharCarrinho();
  fecharCheckout();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
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

// ======== ENTREGA: MOSTRAR/ESCONDER CAMPO DE ENDEREÇO ========
document.querySelectorAll('input[name="entrega"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    const isEntrega = document.getElementById("entrega-endereco").checked;
    campoEndereco.style.display = isEntrega ? "block" : "none";
    if (!isEntrega) {
      campoEndereco.classList.remove("has-error");
    }
  });
});

// ======== VALIDAÇÃO E ENVIO DO PEDIDO ========
checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let valido = true;

  // Nome completo obrigatório
  if (campoNome.value.trim().length < 3) {
    grupoNome.classList.add("has-error");
    valido = false;
  } else {
    grupoNome.classList.remove("has-error");
  }

  // Endereço obrigatório se "Entregar no endereço" estiver marcado
  const entregaSelecionada = document.querySelector(
    'input[name="entrega"]:checked',
  ).value;

  let enderecoCompleto = "";
  if (entregaSelecionada === "endereco") {
    // Verifica se algum campo está vazio
    if (
      !endRua.value.trim() ||
      !endNumero.value.trim() ||
      !endBairro.value.trim() ||
      !endCidade.value.trim()
    ) {
      campoEndereco.classList.add("has-error");
      valido = false;
    } else {
      campoEndereco.classList.remove("has-error");
      // Monta a string bonitinha pro WhatsApp
      enderecoCompleto = `${endRua.value.trim()}, ${endNumero.value.trim()} - ${endBairro.value.trim()}, ${endCidade.value.trim()}`;
    }
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

  enviarPedidoWhatsApp({
    nome: campoNome.value.trim(),
    entrega: entregaSelecionada,
    endereco: enderecoCompleto,
    pagamento: pagamentoSelecionado.value,
  });
});

function enviarPedidoWhatsApp(dados) {
  // Monta a mensagem final com itens, total, dados do cliente e pagamento
  let mensagem = `Olá, Cheiro das Águas! ☕\n\n`;
  mensagem += `*Novo pedido:*\n`;

  cart.forEach((item) => {
    mensagem += `• ${item.quantidade}x ${item.produto} — ${formatBRL(item.preco * item.quantidade)}\n`;
  });

  mensagem += `\n*Total: ${formatBRL(totalCarrinho())}*\n\n`;
  mensagem += `*Cliente:* ${dados.nome}\n`;

  if (dados.entrega === "endereco") {
    mensagem += `*Entrega:* ${dados.endereco}\n`;
  } else {
    mensagem += `*Entrega:* Retirar no local\n`;
  }

  mensagem += `*Pagamento:* ${dados.pagamento}\n\n`;
  mensagem += `Podemos confirmar o pedido?`;

  const textoCodificado = encodeURIComponent(mensagem);
  const urlFinal = `https://wa.me/${numeroWhatsApp}?text=${textoCodificado}`;

  window.location.href = urlFinal;

  // Reseta o carrinho e o formulário após o envio
  cart = [];
  renderCarrinho();
  checkoutForm.reset();
  campoEndereco.style.display = "none";
  fecharCheckout();
}
