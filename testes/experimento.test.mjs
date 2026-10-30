import assert from "node:assert/strict";
import { test } from "node:test";
import { progressoDoCapitulo, faixa, escalaDoArco } from "../experimento/capitulo.js";

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

test("Y-08: arco e recorte percorrem as mesmas dimensões da X1, sem ampliar no fim", () => {
  const perto = (real, esperado) => assert.ok(Math.abs(real - esperado) < 1e-8, `${real} != ${esperado}`);
  for (const [largura, altura, finalL, finalA] of [[208.8, 184, 316.8, 360], [440, 549, 588.8, 684], [440, 658.8, 883.2, 820.8]]) {
    for (const p of [0, .25, .5, .75, 1]) {
      const mover = faixa(p, 0, .7);
      const atual = escalaDoArco(mover, largura, altura, finalL, finalA);
      const x1 = 1 + (finalL / largura - 1) * mover;
      const y1 = 1 + (finalA / altura - 1) * mover;
      perto(finalL * atual.sx, largura * x1);
      perto(finalA * atual.sy, altura * y1);
      perto(atual.larguraFoto * atual.fotoSx * atual.sx, largura * Math.max(x1, y1));
      perto(atual.alturaFoto * atual.fotoSy * atual.sy, altura * Math.max(x1, y1));
      assert.ok(atual.sx <= 1 && atual.sy <= 1);
    }
    const fim = escalaDoArco(1, largura, altura, finalL, finalA);
    assert.equal(fim.sx, 1);
    assert.equal(fim.sy, 1);
    assert.equal(fim.fotoSx, 1);
    assert.equal(fim.fotoSy, 1);
  }
});

test("escala do arco limita o progresso e rejeita dimensões inválidas", () => {
  const dimensoes = [440, 549, 588.8, 684];
  assert.deepEqual(escalaDoArco(-1, ...dimensoes), escalaDoArco(0, ...dimensoes));
  assert.deepEqual(escalaDoArco(2, ...dimensoes), escalaDoArco(1, ...dimensoes));
  for (const invalido of [undefined, null, "", NaN, Infinity, -Infinity, {}]) {
    assert.equal(escalaDoArco(invalido, ...dimensoes), null);
    assert.equal(escalaDoArco(.5, invalido, 549, 588.8, 684), null);
  }
  assert.equal(escalaDoArco(.5, 0, 549, 588.8, 684), null);
  assert.equal(escalaDoArco(.5, 440, -1, 588.8, 684), null);
});
