import assert from "node:assert/strict";
import { test } from "node:test";
import { progressoDoCapitulo, faixa, escalaDoArco } from "../experimento/capitulo.js";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { textos } from "../experimento/textos.js";

const ler = (nome) => readFileSync(new URL(`../experimento/${nome}`, import.meta.url), "utf8");

test("A-02: seis estilos compartilhados e Entrada nos três apoios", () => {
  const css = ler("experimento.css");
  for (const estilo of ["abertura", "capitulo", "frase", "entrada", "texto", "nota"]) {
    assert.match(css, new RegExp(`--${estilo}:`));
  }
  assert.match(css, /--entrada: 380 clamp\(1\.15rem, 1\.7vw, 1\.5rem\)\/1\.45/);
  assert.doesNotMatch(css, /font-size\s*:/);
  const fontes = [...css.matchAll(/font:\s*([^;]+);/g)].map((item) => item[1]);
  assert.ok(fontes.every((valor) => /^(inherit|var\(--(abertura|capitulo|frase|entrada|texto|nota|numero-ganho)\))$/.test(valor)));
  for (const texto of ["textos.apoio", "config.textos.origem.texto", "textos.contato.texto"]) {
    assert.ok(ler("experimento.js").includes(`elemento("p", "entrada", ${texto})`));
  }
});

test("A-05: contato agrupa serviços com rótulos do textos e respostas do config", () => {
  assert.equal(textos.contato.entrega, "Entrega");
  assert.equal(textos.contato.pagamento, "Pagamento");
  const js = ler("experimento.js");
  assert.match(js, /config\.textos\.faq\.itens\.find/);
  assert.match(js, /contato-servico/);
  assert.match(js, /contato-legais/);
  assert.match(js, /join\(" · "\)/);
});

test("A-08: depois da conta fica só o convite à degustação", () => {
  const js = ler("experimento.js");
  assert.doesNotMatch(js, /botaoConta|config\.textos\.hero\.conta/);
  assert.match(js, /botoesVenda\.append\(degustacao\(\)\)/);
  assert.match(js, /vender\.append\(tituloVender, abas, \.\.\.paineis, botoesVenda\)/);
});

test("A-06: origem termina de entrar com 40% de tela de leitura parada", () => {
  for (const altura of [900, 844]) {
    const percurso = altura * 1.6;
    for (const p of [.75, .8, 1]) assert.equal(faixa(p, .55, .75), 1);
    assert.ok(percurso * .25 >= altura * .35);
  }
  assert.match(ler("experimento.css"), /\.com-movimento \.capitulos \{ height: 260vh; \}/);
  assert.match(ler("experimento.js"), /"--entrar": faixa\(p, \.55, \.75\)/);
});

test("A-11: JavaScript do experimento respeita 30.000 bytes", () => {
  const pasta = new URL("../experimento/", import.meta.url);
  const bytes = readdirSync(pasta).filter((nome) => nome.endsWith(".js"))
    .reduce((total, nome) => total + statSync(new URL(nome, pasta)).size, 0);
  assert.ok(bytes <= 30000, `${bytes} bytes`);
});

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
