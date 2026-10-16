import assert from "node:assert/strict";
import { test } from "node:test";
import { config } from "../js/config.js";
import { formatarReais, montarLinkWhatsApp } from "../js/pedido.js";

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
