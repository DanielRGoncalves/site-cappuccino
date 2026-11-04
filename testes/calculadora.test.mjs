import assert from "node:assert/strict";
import { test } from "node:test";
import { config } from "../antigo/js/config.js";
import { calcularResultado, calcularRevenda, coposPorPacote, precoVendaCentavos } from "../antigo/js/calculadora.js";

test("K-03: tamanhos de xícara rendem 22, 16 e 11 por kg; começa em 200 ml", () => {
  assert.deepEqual(config.calculadora.xicara.tamanhos, [
    { ml: 150, gramas: 45 }, { ml: 200, gramas: 60 }, { ml: 300, gramas: 90 },
  ]);
  assert.deepEqual(config.calculadora.xicara.tamanhos.map(({ gramas }) => coposPorPacote(config.calculadora.xicara.pesoGramas, gramas)), [22, 16, 11]);
  assert.equal(config.calculadora.xicara.pesoGramas, 1000);
  assert.equal(config.pesoPacoteGramas, 250);
  assert.equal(coposPorPacote(500, 60), 8);
  assert.equal(config.calculadora.xicara.tamanhoInicialMl, 200);
  assert.equal(config.calculadora.xicara.aConfirmar, false);
});

test("K-02: revenda de 30 por 39 e de 35 por 59", () => {
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

test("K-04: kg de 84, xícara de 200 ml e venda a 12", () => {
  const { margemPercentual, ...resultado } = calcularResultado("12,00", "84,00", config.calculadora.xicara.pesoGramas, 60);
  assert.ok(Math.abs(margemPercentual - 58) < 1e-10);
  assert.equal(new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(margemPercentual), "58");
  assert.deepEqual(resultado, {
    copos: 16, custoCentavos: 504, ganhoCentavos: 696,
    ganhoPacoteCentavos: 11136,
  });
});

test("K-05: kg de 108, xícara de 150 ml e venda a 12", () => {
  assert.deepEqual(calcularResultado("12.00", "108.00", config.calculadora.xicara.pesoGramas, 45), {
    copos: 22, custoCentavos: 486, ganhoCentavos: 714,
    margemPercentual: 59.5, ganhoPacoteCentavos: 15708,
  });
});

test("preço e peso informado mudam a conta; ganho negativo é mantido", () => {
  assert.equal(calcularResultado("12.50", "84.00", 1000, 60).ganhoCentavos, 746);
  assert.deepEqual(calcularResultado("4", "84", 1000, 60), {
    copos: 16, custoCentavos: 504, ganhoCentavos: -104,
    margemPercentual: -26, ganhoPacoteCentavos: -1664,
  });
  assert.equal(calcularResultado("12", "84", 500, 60).custoCentavos, 1008);
});

test("K-06: entradas inválidas em qualquer preço ficam sem resultado", () => {
  for (const entrada of [undefined, null, "", " ", "0", "0,00", 0, -5, "-5", "abc", "9,999", "1,2,3", NaN, Infinity, "1e3", "999999999999999999"]) {
    assert.equal(precoVendaCentavos(entrada), null, String(entrada));
    assert.equal(calcularRevenda(entrada, "30"), null);
    assert.equal(calcularRevenda("39", entrada), null);
    assert.equal(calcularResultado(entrada, "84", 1000, 60), null);
    assert.equal(calcularResultado("12", entrada, 1000, 60), null);
  }
  for (const entrada of [undefined, null, "", "texto", 0, -30, NaN, Infinity]) {
    assert.equal(coposPorPacote(250, entrada), null);
    assert.equal(coposPorPacote(entrada, 60), null);
    assert.equal(calcularResultado("12", "84", 1000, entrada), null);
    assert.equal(calcularResultado("12", "84", entrada, 60), null);
  }
  assert.equal(precoVendaCentavos("9,5"), 950);
  assert.equal(precoVendaCentavos("9.5"), 950);
  assert.equal(precoVendaCentavos(" 9,50 "), 950);
});
