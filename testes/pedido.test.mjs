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
  assert.deepEqual(config.produtos.map((produto) => produto.precoCentavos), [3000, 3500, 3500]);
  assert.equal(formatarReais(3000), "R$ 30,00");
  assert.equal(formatarReais(3500), "R$ 35,00");
  assert.equal(formatarReais(6500), "R$ 65,00");
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
      { id: "com-acucar", nome: config.produtos[0].nome, precoCentavos: 3000, quantidade: 2, subtotalCentavos: 6000 },
      { id: "sem-acucar", nome: config.produtos[1].nome, precoCentavos: 3500, quantidade: 1, subtotalCentavos: 3500 },
    ],
    totalCentavos: 9500,
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

  assert.match(mensagem, /2x Cappuccino com açúcar — R\$\s60,00/);
  assert.match(mensagem, /1x Cappuccino descafeinado — R\$\s35,00/);
  assert.match(mensagem, /\*Total: R\$\s95,00\*/);
  assert.match(mensagem, /\*Cliente:\* João & Zé ☕/);
  assert.match(mensagem, /\*Padaria:\* Padaria do Bairro/);
  assert.match(mensagem, /\*Cidade ou bairro:\* Vila Velha/);
  assert.match(mensagem, /\*Pagamento:\* Combinar pelo WhatsApp/);
  assert.ok(mensagem.endsWith("Valores de referência, a confirmar.\nEntrega ou retirada: a combinar."));
  assert.equal(link, `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(mensagem)}`);
  assert.equal(new URL(link).searchParams.get("text"), mensagem);
});
