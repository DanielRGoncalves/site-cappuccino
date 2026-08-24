// ==========================================
// 1. SELECIONANDO OS ELEMENTOS DO DOM
// ==========================================
const radioTaparuba = document.getElementById("radioTaparuba");
const radioES = document.getElementById("radioES");
const enderecoContainer = document.getElementById("enderecoContainer");
const cidadeContainer = document.getElementById("cidadeContainer");
const btnEnviar = document.getElementById("btnEnviarPedido");

// ==========================================
// 2. LÓGICA DE EXIBIÇÃO DOS CAMPOS
// ==========================================
radioTaparuba.addEventListener("change", () => {
  if (radioTaparuba.checked) {
    enderecoContainer.classList.remove("hidden");
    cidadeContainer.classList.add("hidden");
  }
});

radioES.addEventListener("change", () => {
  if (radioES.checked) {
    cidadeContainer.classList.remove("hidden");
    enderecoContainer.classList.add("hidden");
  }
});

// ==========================================
// 3. CAPTURA DE DADOS E DISPARO PARA O WHATSAPP
// ==========================================
btnEnviar.addEventListener("click", () => {
  // Capturando os valores digitados e removendo espaços extras com o .trim()
  const nome = document.getElementById("nomeCompleto").value.trim();
  const pedido = document.getElementById("pedido").value;
  const quantidade = document.getElementById("quantidade").value;

  // Validação básica: impede o envio se faltar informação essencial
  if (!nome || !pedido || !quantidade) {
    alert(
      "Por favor, preencha seu nome e escolha um pedido antes de continuar.",
    );
    return;
  }

  // Verifica qual opção de entrega foi selecionada
  const localizacaoSelecionada = document.querySelector(
    'input[name="localizacao"]:checked',
  );

  if (!localizacaoSelecionada) {
    alert("Por favor, selecione onde você está (Taparuba ou Espírito Santo).");
    return;
  }

  // Montando o esqueleto da mensagem
  let mensagem = `Olá! Me chamo ${nome} e gostaria de fazer uma encomenda:\n\n`;
  mensagem += `☕ *Pedido:* ${quantidade}x ${pedido}\n`;

  // Injetando o texto final de acordo com o estado selecionado
  if (localizacaoSelecionada.value === "taparuba") {
    const endereco = document.getElementById("enderecoCompleto").value.trim();

    if (!endereco) {
      alert("Por favor, informe o endereço para a entrega.");
      return;
    }

    mensagem += `📍 *Local de Entrega:* Taparuba e região\n`;
    mensagem += `🏠 *Endereço:* ${endereco}\n\n`;
    mensagem += `Como podemos combinar a entrega?`;
  } else if (localizacaoSelecionada.value === "es") {
    const cidade = document.getElementById("cidadeES").value.trim();

    if (!cidade) {
      alert("Por favor, informe sua cidade no Espírito Santo.");
      return;
    }

    mensagem += `📍 *Local de Entrega:* Espírito Santo\n`;
    mensagem += `🏙️ *Cidade:* ${cidade}\n\n`;
    mensagem += `Gostaria de conversar sobre a melhor forma de envio!`;
  }

  // ==========================================
  // 4. PREPARANDO A URL FINAL
  // ==========================================

  // ATENÇÃO: Coloque o número do WhatsApp do seu pai aqui.
  // Formato: DDI + DDD + NÚMERO (Tudo junto, sem espaços, sem '+', sem traços)
  // Exemplo: 5533999999999
  const numeroWhatsApp = "5527998480547";

  // O encodeURIComponent transforma espaços e quebras de linha em caracteres seguros para links da internet (%20, %0A, etc)
  const textoCodificado = encodeURIComponent(mensagem);

  const urlFinal = `https://wa.me/${numeroWhatsApp}?text=${textoCodificado}`;

  // Abre o link do WhatsApp em uma nova aba
  window.open(urlFinal, "_blank");
});
