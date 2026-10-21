import assert from "node:assert/strict";
import { test } from "node:test";
import { config } from "../js/config.js";
import { formatarReais, linkWhatsApp } from "../js/pedido.js";

test("os preços do config são centavos e são formatados em reais", () => {
  assert.deepEqual(config.produtos.map((produto) => produto.precoCentavos), [3000, 3500, 3500]);
  assert.equal(formatarReais(3000), "R$ 30,00");
  assert.equal(formatarReais(3500), "R$ 35,00");
});

test("a apresentação começa com dois produtos e preços ocultos", () => {
  assert.deepEqual(config.produtos.filter((produto) => produto.exibir).map((produto) => produto.id), ["com-acucar", "sem-acucar"]);
  assert.equal(config.produtos.find((produto) => produto.id === "descafeinado").exibir, false);
  assert.equal(config.apresentacao.mostrarPrecos, false);
});

test("o link do WhatsApp codifica uma mensagem fixa", () => {
  const mensagem = "Olá! João & Zé ☕";
  const link = linkWhatsApp(config.whatsapp, mensagem);
  assert.equal(link, `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(mensagem)}`);
  assert.equal(new URL(link).searchParams.get("text"), mensagem);
});

test("degustação e contato geral usam mensagens distintas do config", () => {
  const degustacao = linkWhatsApp(config.whatsapp, config.textos.whatsapp.degustacao);
  const geral = linkWhatsApp(config.whatsapp, config.textos.whatsapp.geral);
  assert.equal(new URL(degustacao).searchParams.get("text"), "Olá! Vi o site e quero pedir uma degustação do cappuccino para a minha padaria.");
  assert.equal(new URL(geral).searchParams.get("text"), "Olá! Vi o site e quero conversar sobre o cappuccino para a minha padaria.");
  assert.notEqual(degustacao, geral);
});
