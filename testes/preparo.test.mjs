import assert from "node:assert/strict";
import { test } from "node:test";
import { config } from "../js/config.js";
import { montarPreparo } from "../js/preparo.js";

test("preparo devolve os três passos, a dica e o rendimento do config", () => {
  const resultado = montarPreparo(config.textos.preparo);
  assert.deepEqual(resultado.passos, config.textos.preparo.passos.map((passo, index) => ({
    numero: String(index + 1).padStart(2, "0"),
    titulo: passo.titulo,
    descricao: passo.descricao,
  })));
  assert.equal(resultado.dica, config.textos.preparo.dica);
  assert.equal(resultado.rendimento, config.textos.preparo.rendimento);
  assert.equal(resultado.titulo, config.textos.preparo.titulo);
});

test("alterar um texto no config muda o preparo montado", () => {
  const alterado = {
    ...config.textos.preparo,
    passos: [{ ...config.textos.preparo.passos[0], titulo: "Novo texto" }, ...config.textos.preparo.passos.slice(1)],
  };
  assert.equal(montarPreparo(alterado).passos[0].titulo, "Novo texto");
});
