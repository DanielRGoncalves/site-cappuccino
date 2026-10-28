import assert from "node:assert/strict";
import { test } from "node:test";
import { config } from "../js/config.js";
import { calcularResultado, calcularRevenda, coposPorPacote, precoVendaCentavos } from "../js/calculadora.js";

test("X-05: tamanhos de xícara rendem 5, 4 e 2; começa em 200 ml", () => {
  assert.deepEqual(config.calculadora.xicara.tamanhos, [
    { ml: 150, gramas: 45 }, { ml: 200, gramas: 60 }, { ml: 300, gramas: 90 },
  ]);
  assert.deepEqual(config.calculadora.xicara.tamanhos.map(({ gramas }) => coposPorPacote(config.pesoPacoteGramas, gramas)), [5, 4, 2]);
  assert.equal(coposPorPacote(500, 60), 8);
  assert.equal(config.calculadora.xicara.tamanhoInicialMl, 200);
  assert.equal(config.calculadora.xicara.aConfirmar, true);
});

test("X-03: revenda de 30 por 39 e de 35 por 59", () => {
  const percentual = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
  for (const [pacote, venda, ganho, margem] of [
    ["30,00", "39,00", 900, "23,1"],
    ["35.00", "59.00", 2400, "40,7"],
  ]) {
    const resultado = calcularRevenda(venda, pacote);
    assert.equal(resultado.ganhoCentavos, ganho);
    assert.equal(resultado.margemPercentual, ganho / precoVendaCentavos(venda) * 100);
    assert.equal(percentual.format(resultado.margemPercentual), margem);
  }
  assert.deepEqual(calcularRevenda("20", "30"), { ganhoCentavos: -1000, margemPercentual: -50 });
  assert.deepEqual(calcularRevenda("30", "30"), { ganhoCentavos: 0, margemPercentual: 0 });
});

test("X-06: pacote de 30, xícara de 200 ml e venda a 15", () => {
  assert.deepEqual(calcularResultado("15,00", "30,00", 250, 60), {
    copos: 4,
    custoCentavos: 720,
    ganhoCentavos: 780,
    margemPercentual: 52,
    ganhoPacoteCentavos: 3120,
  });
});

test("tamanho e preço informado mudam a conta; ganho negativo é mantido", () => {
  assert.equal(calcularResultado("15.50", "30.00", 250, 60).ganhoCentavos, 830);
  assert.deepEqual(calcularResultado("6", "30", 250, 60), {
    copos: 4, custoCentavos: 720, ganhoCentavos: -120,
    margemPercentual: -20, ganhoPacoteCentavos: -480,
  });
  assert.deepEqual(config.calculadora.xicara.tamanhos.map(({ gramas }) => {
    const { copos, custoCentavos, ganhoPacoteCentavos } = calcularResultado("15", "30", 250, gramas);
    return [copos, custoCentavos, ganhoPacoteCentavos];
  }), [[5, 540, 4800], [4, 720, 3120], [2, 1080, 840]]);
  assert.equal(calcularResultado("15", "23", 250, 60).custoCentavos, 552);
});

test("X-04 e X-05: entradas inválidas em qualquer preço ficam sem resultado", () => {
  for (const entrada of [undefined, null, "", " ", "0", "0,00", 0, -5, "-5", "abc", "9,999", "1,2,3", NaN, Infinity, "1e3", "999999999999999999"]) {
    assert.equal(precoVendaCentavos(entrada), null, String(entrada));
    assert.equal(calcularRevenda(entrada, "30"), null);
    assert.equal(calcularRevenda("39", entrada), null);
    assert.equal(calcularResultado(entrada, "30", 250, 60), null);
    assert.equal(calcularResultado("15", entrada, 250, 60), null);
  }
  for (const entrada of [undefined, null, "", "texto", 0, -30, NaN, Infinity]) {
    assert.equal(coposPorPacote(250, entrada), null);
    assert.equal(coposPorPacote(entrada, 60), null);
    assert.equal(calcularResultado("15", "30", 250, entrada), null);
    assert.equal(calcularResultado("15", "30", entrada, 60), null);
  }
  assert.equal(precoVendaCentavos("9,5"), 950);
  assert.equal(precoVendaCentavos("9.5"), 950);
  assert.equal(precoVendaCentavos(" 9,50 "), 950);
});
