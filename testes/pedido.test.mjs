import assert from "node:assert/strict";
import { test } from "node:test";
import { config } from "../antigo/js/config.js";
import { formatarReais, linkWhatsApp, montarMensagemDegustacao, validarDegustacao } from "../antigo/js/pedido.js";

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

test("o contato geral continua com a mensagem do config", () => {
  const geral = linkWhatsApp(config.whatsapp, config.textos.whatsapp.geral);
  assert.equal(new URL(geral).searchParams.get("text"),
    "Olá! Vi o site e quero conversar sobre o cappuccino para o meu negócio.\nNome do negócio: ");
  assert.match(geral, /%0ANome%20do%20neg%C3%B3cio%3A%20$/);
});

test("W-06: validação retorna as três mensagens exatas e aceita todos os tipos", () => {
  const textos = config.textos.degustacao;
  assert.deepEqual(validarDegustacao({ nome: " ", tipo: "", local: "" }, textos), {
    nome: "Escreva o nome do seu negócio.",
    tipo: "Escolha o tipo de negócio.",
    local: "Escreva o bairro e a cidade.",
  });
  for (const tipo of ["Padaria", "Cafeteria", "Restaurante", "Outro"]) {
    assert.deepEqual(validarDegustacao({ nome: "Negócio", tipo, local: "Centro, Vitória" }, textos), {});
  }
  assert.deepEqual(validarDegustacao({ nome: "Café", tipo: "inválido", local: "Vitória" }, textos), {
    tipo: "Escolha o tipo de negócio.",
  });
});

test("W-07: degustação gera mensagem exata de quatro linhas e link codificado", () => {
  const cliente = { nome: "João & Zé ☕", tipo: "Cafeteria", local: "Centro, Vitória", quantidade: "20" };
  const copia = { ...cliente };
  const mensagem = montarMensagemDegustacao(cliente, config.textos.degustacao.mensagem);
  assert.equal(mensagem, [
    "Olá! Vi o site e quero pedir uma degustação do cappuccino.",
    "Negócio: João & Zé ☕ (Cafeteria)",
    "Local: Centro, Vitória",
    "Cappuccinos por dia: 20",
  ].join("\n"));
  const link = linkWhatsApp(config.whatsapp, mensagem);
  assert.equal(link, `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(mensagem)}`);
  assert.equal(new URL(link).searchParams.get("text"), mensagem);
  assert.equal((link.match(/%0A/g) || []).length, 3);
  assert.deepEqual(cliente, copia);
});

test("degustação sem quantidade usa não informado; zero é preservado e quebras ficam em quatro linhas", () => {
  const cliente = { nome: "Café\nTeste", tipo: "Outro", local: "Centro\r\nVitória" };
  for (const quantidade of [undefined, "", " ", "abc", -1, "1.5", Infinity]) {
    const mensagem = montarMensagemDegustacao({ ...cliente, quantidade }, config.textos.degustacao.mensagem);
    assert.equal(mensagem.split("\n").length, 4);
    assert.ok(mensagem.endsWith("Cappuccinos por dia: não informado"));
  }
  assert.ok(montarMensagemDegustacao({ ...cliente, quantidade: 0 }, config.textos.degustacao.mensagem).endsWith("Cappuccinos por dia: 0"));
});
