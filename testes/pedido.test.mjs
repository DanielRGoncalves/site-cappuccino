import assert from "node:assert/strict";
import { test } from "node:test";
import { config } from "../js/config.js";
import {
  formatarReais,
  linkWhatsApp,
  montarLinkWhatsApp,
  montarMensagemPedido,
  montarPedido,
} from "../js/pedido.js";

test("os preços do config são centavos e são formatados em reais", () => {
  assert.deepEqual(config.produtos.map((produto) => produto.precoCentavos), [2200, 3000, 3000]);
  assert.equal(formatarReais(2200), "R$ 22,00");
  assert.equal(formatarReais(3000), "R$ 30,00");
  assert.equal(formatarReais(5200), "R$ 52,00");
});

test("o link do WhatsApp preserva acentos, ampersand e emoji", () => {
  const mensagem = "Cliente: João & Zé ☕";
  const link = montarLinkWhatsApp(config.whatsapp, mensagem);
  assert.equal(link, `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(mensagem)}`);
  assert.equal(new URL(link).searchParams.get("text"), mensagem);
});

test("montarPedido cria dados independentes do envio com dois produtos", () => {
  const sacola = [
    { produto: config.produtos[0], quantidade: 2 },
    { produto: config.produtos[1], quantidade: 1 },
  ];
  const cliente = {
    nome: "João & Zé ☕",
    padaria: "Padaria Central",
    cidadeBairro: "Vitória / Centro",
    pagamento: "PIX",
  };
  const pedido = montarPedido(sacola, cliente);

  assert.deepEqual(pedido, {
    itens: [
      { id: "com-acucar", nome: config.produtos[0].nome, precoCentavos: 2200, quantidade: 2, subtotalCentavos: 4400 },
      { id: "sem-acucar", nome: config.produtos[1].nome, precoCentavos: 3000, quantidade: 1, subtotalCentavos: 3000 },
    ],
    totalCentavos: 7400,
    cliente,
  });
  assert.notStrictEqual(pedido.cliente, cliente);
});

test("mensagem e link usam os dados do pedido e codificam o nome", () => {
  const pedido = montarPedido(
    [
      { produto: config.produtos[0], quantidade: 2 },
      { produto: config.produtos[2], quantidade: 1 },
    ],
    {
      nome: "João & Zé ☕",
      padaria: "Padaria do Bairro",
      cidadeBairro: "Vila Velha",
      pagamento: config.textos.pagamentoACombinar,
    },
  );
  const mensagem = montarMensagemPedido(pedido);
  const link = linkWhatsApp(pedido);

  assert.match(mensagem, /2x Cappuccino com açúcar — R\$\s44,00/);
  assert.match(mensagem, /1x Cappuccino descafeinado — R\$\s30,00/);
  assert.match(mensagem, /\*Total: R\$\s74,00\*/);
  assert.match(mensagem, /\*Cliente:\* João & Zé ☕/);
  assert.match(mensagem, /\*Padaria:\* Padaria do Bairro/);
  assert.match(mensagem, /\*Cidade ou bairro:\* Vila Velha/);
  assert.match(mensagem, /\*Pagamento:\* Combinar pelo WhatsApp/);
  assert.ok(mensagem.endsWith("Valores de referência, a confirmar.\nEntrega ou retirada: a combinar."));
  assert.equal(link, `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(mensagem)}`);
  assert.equal(new URL(link).searchParams.get("text"), mensagem);
});
