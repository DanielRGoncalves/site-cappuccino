import assert from "node:assert/strict";
import { test } from "node:test";
import { config } from "../antigo/js/config.js";
import { produtosVisiveis, indiceDaAba } from "../antigo/js/produtos.js";

test("as abas respeitam exibir e a ordem do config sem alterar os produtos", () => {
  const antes = structuredClone(config.produtos);
  const visiveis = produtosVisiveis(config.produtos);
  assert.deepEqual(visiveis.map((produto) => produto.id), ["com-acucar", "sem-acucar"]);
  assert.deepEqual(visiveis.map((produto) => produto.frase), [
    "Já vem adoçado: é só misturar com água quente e servir.",
    "Sem açúcar refinado na receita, para quem prefere adoçar a gosto.",
  ]);
  assert.deepEqual(config.produtos, antes);
  assert.deepEqual(produtosVisiveis([]), []);
});

test("setas percorrem as abas e voltam nas extremidades; Home e End vão aos extremos", () => {
  assert.equal(indiceDaAba(0, "ArrowRight", 2), 1);
  assert.equal(indiceDaAba(1, "ArrowRight", 2), 0);
  assert.equal(indiceDaAba(1, "ArrowLeft", 2), 0);
  assert.equal(indiceDaAba(0, "ArrowLeft", 2), 1);
  assert.equal(indiceDaAba(1, "Home", 2), 0);
  assert.equal(indiceDaAba(0, "End", 2), 1);
  assert.equal(indiceDaAba(1, "Tab", 2), 1);
  assert.equal(indiceDaAba(0, "ArrowRight", 1), 0);
  assert.equal(indiceDaAba(0, "ArrowLeft", 0), -1);
});
