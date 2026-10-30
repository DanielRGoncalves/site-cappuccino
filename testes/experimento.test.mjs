import assert from "node:assert/strict";
import { test } from "node:test";
import { progressoDoCapitulo, faixa } from "../experimento/capitulo.js";

test("progresso: início, meio e fim do percurso do wrapper", () => {
  assert.equal(progressoDoCapitulo(0, 2200, 1000), 0);
  assert.equal(progressoDoCapitulo(-600, 2200, 1000), .5);
  assert.equal(progressoDoCapitulo(-1200, 2200, 1000), 1);
});

test("progresso limita valores antes e depois do capítulo", () => {
  assert.equal(progressoDoCapitulo(500, 2200, 1000), 0);
  assert.equal(progressoDoCapitulo(-4000, 2200, 1000), 1);
  assert.equal(progressoDoCapitulo(-1, 1000, 1000), 0);
  assert.equal(progressoDoCapitulo(-1, 500, 1000), 0);
});

test("progresso rejeita entradas inválidas sem produzir NaN", () => {
  for (const invalido of [undefined, null, "", "100", NaN, Infinity, -Infinity, {}, []]) {
    assert.equal(progressoDoCapitulo(invalido, 2200, 1000), 0);
    assert.equal(progressoDoCapitulo(-600, invalido, 1000), 0);
    assert.equal(progressoDoCapitulo(-600, 2200, invalido), 0);
  }
  assert.equal(progressoDoCapitulo(-100, 2200, 0), 0);
  assert.equal(progressoDoCapitulo(-100, 2200, -10), 0);
});

test("faixa limita, interpola e respeita seus limites", () => {
  assert.equal(faixa(0, .4, .6), 0);
  assert.equal(faixa(.4, .4, .6), 0);
  assert.ok(Math.abs(faixa(.5, .4, .6) - .5) < 1e-12);
  assert.equal(faixa(.6, .4, .6), 1);
  assert.equal(faixa(1, .4, .6), 1);
  assert.equal(faixa(-10, 0, 1), 0);
  assert.equal(faixa(10, 0, 1), 1);
});

test("faixa rejeita entradas inválidas e intervalos vazios ou invertidos", () => {
  for (const invalido of [undefined, null, "", "0.5", NaN, Infinity, -Infinity, {}, []]) {
    assert.equal(faixa(invalido, 0, 1), 0);
    assert.equal(faixa(.5, invalido, 1), 0);
    assert.equal(faixa(.5, 0, invalido), 0);
  }
  assert.equal(faixa(.5, .5, .5), 0);
  assert.equal(faixa(.5, 1, 0), 0);
});
