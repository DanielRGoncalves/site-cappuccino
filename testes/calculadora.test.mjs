import assert from "node:assert/strict";
import { test } from "node:test";
import { config } from "../js/config.js";
import { calcularResultado, coposPorPacote, precoVendaCentavos } from "../js/calculadora.js";

test("W-01: tamanhos do config rendem 8, 5 e 4 copos por pacote", () => {
  assert.deepEqual(config.calculadora.copos, [
    { ml: 100, gramas: 30 }, { ml: 150, gramas: 45 }, { ml: 200, gramas: 60 },
  ]);
  assert.deepEqual(config.calculadora.copos.map(({ gramas }) => coposPorPacote(config.pesoPacoteGramas, gramas)), [8, 5, 4]);
  assert.equal(coposPorPacote(500, 30), 16);
  assert.equal(config.calculadora.exemploPrecoCopoCentavos, 900);
  assert.equal(config.calculadora.aConfirmar, true);
});

test("W-03: pacote de 30, copo de 100 ml e venda a 9", () => {
  assert.deepEqual(calcularResultado("9,00", "30,00", 250, 30), {
    copos: 8,
    custoCentavos: 360,
    ganhoCentavos: 540,
    margemPercentual: 60,
    ganhoPacoteCentavos: 4320,
  });
});

test("tamanho e preço informado mudam a conta; ganho negativo é mantido", () => {
  assert.equal(calcularResultado("9.50", "30.00", 250, 30).ganhoCentavos, 590);
  assert.deepEqual(calcularResultado("2", "30", 250, 30), {
    copos: 8, custoCentavos: 360, ganhoCentavos: -160,
    margemPercentual: -80, ganhoPacoteCentavos: -1280,
  });
  assert.deepEqual(config.calculadora.copos.map(({ gramas }) => {
    const { copos, custoCentavos, ganhoPacoteCentavos } = calcularResultado("9", "30", 250, gramas);
    return [copos, custoCentavos, ganhoPacoteCentavos];
  }), [[8, 360, 4320], [5, 540, 1800], [4, 720, 720]]);
  assert.equal(calcularResultado("9", "23", 250, 30).custoCentavos, 276);
});

test("W-04: entradas inválidas em qualquer preço ficam sem resultado", () => {
  for (const entrada of [undefined, null, "", " ", "0", "0,00", 0, -5, "-5", "abc", "9,999", "1,2,3", NaN, Infinity, "1e3", "999999999999999999"]) {
    assert.equal(precoVendaCentavos(entrada), null, String(entrada));
    assert.equal(calcularResultado(entrada, "30", 250, 30), null);
    assert.equal(calcularResultado("9", entrada, 250, 30), null);
  }
  for (const entrada of [undefined, null, "", "texto", 0, -30, NaN, Infinity]) {
    assert.equal(coposPorPacote(250, entrada), null);
    assert.equal(coposPorPacote(entrada, 30), null);
    assert.equal(calcularResultado("9", "30", 250, entrada), null);
    assert.equal(calcularResultado("9", "30", entrada, 30), null);
  }
  assert.equal(precoVendaCentavos("9,5"), 950);
  assert.equal(precoVendaCentavos("9.5"), 950);
  assert.equal(precoVendaCentavos(" 9,50 "), 950);
});
