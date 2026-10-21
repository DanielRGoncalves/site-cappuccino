import assert from "node:assert/strict";
import { test } from "node:test";
import { config } from "../js/config.js";
import {
  calcularResultado,
  custoPoPorXicara,
  precoVendaCentavos,
  produtosDaCalculadora,
  xicarasPorPacote,
} from "../js/calculadora.js";

test("a calculadora oferece só os dois produtos visíveis, com os custos de referência", () => {
  const { pesoPacoteGramas, porcaoGramas } = config;
  const produtos = produtosDaCalculadora(config.produtos);
  assert.deepEqual(produtos.map((produto) => produto.id), ["com-acucar", "sem-acucar"]);
  assert.equal(xicarasPorPacote(pesoPacoteGramas, porcaoGramas), 8);
  assert.deepEqual(
    produtos.map((produto) => custoPoPorXicara(produto.precoCentavos, pesoPacoteGramas, porcaoGramas)),
    [360, 420],
  );
  assert.equal(config.textos.padarias.aviso, "A conta considera só o custo do cappuccino em pó. Copo, energia, perdas e outros custos não entram.");
  assert.equal(xicarasPorPacote(250, 40), 6);
  assert.equal(custoPoPorXicara(2300, 250, 30), 276);
});

test("ganho, margem e ganho por pacote, inclusive ganho negativo", () => {
  const parametros = [3000, 250, 30];
  assert.deepEqual(calcularResultado("9,00", ...parametros), {
    xicaras: 8,
    custoCentavos: 360,
    ganhoCentavos: 540,
    margemPercentual: 60,
    ganhoPacoteCentavos: 4320,
  });
  assert.equal(calcularResultado("9.5", ...parametros).ganhoCentavos, 590);
  assert.deepEqual(calcularResultado("2", ...parametros), {
    xicaras: 8,
    custoCentavos: 360,
    ganhoCentavos: -160,
    margemPercentual: -80,
    ganhoPacoteCentavos: -1280,
  });
});

test("preço de venda inválido fica sem resultado", () => {
  for (const entrada of ["", " ", "0", "0,00", "-5", "abc", "9,999", "1,2,3"]) {
    assert.equal(precoVendaCentavos(entrada), null, entrada);
    assert.equal(calcularResultado(entrada, 3000, 250, 30), null, entrada);
  }
  assert.equal(precoVendaCentavos("9,5"), 950);
  assert.equal(precoVendaCentavos("9.5"), 950);
});
