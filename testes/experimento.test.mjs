import assert from "node:assert/strict";
import { test } from "node:test";
import { progressoDoCapitulo, faixa, escalaDoArco } from "../experimento/capitulo.js";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { textos } from "../experimento/textos.js";
import { config } from "../js/config.js";

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
  assert.match(js, /vender\.append\(tituloVender, elemento\("p", "entrada", motivos\[0\]\), cartoesVenda, botoesVenda\)/);
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

test("B-13: JavaScript do experimento respeita 40.000 bytes", () => {
  const pasta = new URL("../experimento/", import.meta.url);
  const bytes = readdirSync(pasta).filter((nome) => nome.endsWith(".js"))
    .reduce((total, nome) => total + statSync(new URL(nome, pasta)).size, 0);
  assert.ok(bytes <= 40000, `${bytes} bytes`);
});

// DOM mínimo para executar a montagem real no Node, sem dependências.
class No {
  constructor(tag, texto = "") {
    this.tagName = tag;
    this.children = [];
    this.atributos = {};
    this.texto = String(texto);
    this.className = "";
    this.style = { setProperty(nome, valor) { this[nome] = valor; } };
    this.dataset = {};
    const classes = new Set();
    this.classList = { toggle(nome, ativo) { if (ativo) classes.add(nome); else classes.delete(nome); }, remove(nome) { classes.delete(nome); }, contains(nome) { return classes.has(nome); } };
    this.eventos = {};
  }
  set textContent(texto) { this.texto = String(texto); this.children = []; }
  get textContent() { return this.texto + this.children.map((no) => no.textContent).join(""); }
  set value(valor) { this.valor = String(valor); }
  get value() { return this.valor ?? (this.tagName === "select" ? this.children.find((no) => no.selected)?.value : "") ?? ""; }
  setAttribute(nome, valor) { this.atributos[nome] = String(valor); }
  getAttribute(nome) { return this.atributos[nome] ?? null; }
  removeAttribute(nome) { delete this.atributos[nome]; }
  append(...nos) { this.children.push(...nos.map((no) => typeof no === "string" ? new No("#text", no) : no)); }
  prepend(...nos) { this.children.unshift(...nos); }
  replaceChildren(...nos) { this.children = []; this.texto = ""; this.append(...nos); }
  addEventListener(tipo, callback) { this.eventos[tipo] = callback; }
  getAnimations() { return []; }
  getBoundingClientRect() { return { height: 700 }; }
}
const descendentes = (no) => [no, ...no.children.flatMap(descendentes)];
const porTag = (no, tag) => descendentes(no).filter((item) => item.tagName === tag);
const porClasse = (no, classe) => descendentes(no).filter((item) => item.className.split(" ").includes(classe));

async function montarPagina() {
  const nos = new Map([...ler("index.html").matchAll(/<([\w-]+)[^>]*\bid="([^"]+)"[^>]*>/g)]
    .map(([, tag, id]) => [id, Object.assign(new No(tag), { id })]));
  const ambiente = {
    document: {
      getElementById: (id) => nos.get(id),
      createElement: (tag) => new No(tag), createElementNS: (_, tag) => new No(tag),
      documentElement: new No("html"), fonts: { ready: Promise.resolve() }, addEventListener() {},
    },
    matchMedia: (consulta) => ({ matches: consulta.includes("reduced-motion"), addEventListener() {} }),
    window: { scrollY: 0, innerHeight: 900, addEventListener() {} }, location: { hash: "" }, cancelAnimationFrame() {},
  };
  const originais = Object.fromEntries(Object.keys(ambiente).map((nome) => [nome, Object.getOwnPropertyDescriptor(globalThis, nome)]));
  try {
    for (const [nome, valor] of Object.entries(ambiente)) Object.defineProperty(globalThis, nome, { configurable: true, writable: true, value: valor });
    await import("../experimento/experimento.js");
    nos.set("raiz", ambiente.document.documentElement);
    return nos;
  } finally {
    for (const [nome, descritor] of Object.entries(originais)) {
      if (descritor) Object.defineProperty(globalThis, nome, descritor);
      else delete globalThis[nome];
    }
  }
}
const paginaMontada = montarPagina();

test("C-02/B-02: faixa entre produtos e vender; topo claro, espuma e corpo café", async () => {
  const html = ler("index.html");
  const ids = [...html.matchAll(/<(?:section|footer)[^>]*\bid="([^"]+)"/g)].map(([, id]) => id);
  assert.deepEqual(ids, ["inicio", "origem", "produtos", "faixa", "vender", "preparo", "como", "duvidas", "contato"]);
  const pagina = await paginaMontada;
  for (const id of ["produtos", "preparo", "como", "duvidas"]) {
    assert.equal(porTag(pagina.get(id), "h2")[0].id, `titulo-${id}`);
  }
  for (const id of ["preparo", "duvidas"]) assert.match(html, new RegExp(`class="capitulo claro [^"]+" id="${id}"`));
  assert.deepEqual(pagina.get("produtos").children.map((no) => no.className), ["produtos-topo", "", "produtos-corpo"]);
  assert.equal(porClasse(pagina.get("produtos"), "xicara-trilho")[0].children[0], pagina.get("xicara"));
  assert.match(html, /class="xicara"[^>]*aria-hidden="true"[^>]*focusable="false"/);
  assert.match(html, /class="espuma"[^>]*preserveAspectRatio="none"[^>]*aria-hidden="true"/);
  assert.match(ler("experimento.css"), /\.produtos-corpo \{[^}]*background: var\(--cacau\); color: var\(--leite\)/);
  assert.match(ler("experimento.css"), /\.claro \{ background: var\(--leite\); color: var\(--cacau\); \}/);
  assert.match(ler("experimento.css"), /\.como \{ background: var\(--torra-2\); \}/);
});

test("B-03: textos existentes são referenciados, sem literais copiados do config", () => {
  const strings = (valor) => typeof valor === "string" ? [valor] : valor && typeof valor === "object" ? Object.values(valor).flatMap(strings) : [];
  const existentes = new Set(strings(config).filter(Boolean));
  const literais = [...ler("textos.js").matchAll(/"([^"\n]*)"/g)].map(([, valor]) => valor);
  assert.deepEqual(literais.filter((valor) => existentes.has(valor)), []);
  assert.deepEqual(textos.vender.abas[0].lista, [config.textos.porque.motivos[2], "30 g para cada 100 ml de água fervente."]);
  assert.deepEqual(textos.vender.abas[1].lista, [1, 3, 4].map((i) => config.textos.porque.motivos[i]));
});

test("B-04: os cinco motivos aparecem nos destinos aprovados, sem capítulo próprio", async () => {
  const pagina = await paginaMontada;
  for (const [id, indices] of [["vender", [0, 1, 2, 3, 4]], ["produtos", [1, 3]], ["preparo", [2]], ["como", [4]]]) {
    for (const indice of indices) assert.ok(pagina.get(id).textContent.includes(config.textos.porque.motivos[indice]), `${id}: motivo ${indice}`);
  }
  for (const [id, indice] of [["vender", 0], ["preparo", 2], ["como", 4]]) {
    assert.equal(porClasse(pagina.get(id), "entrada")[0].textContent, config.textos.porque.motivos[indice]);
  }
  assert.ok(!ler("index.html").includes('id="porque"'));
});

test("B-05/B-06/B-07: produtos, listas e dúvidas usam todo o conteúdo do config", async () => {
  const pagina = await paginaMontada;
  const produtos = pagina.get("produtos");
  const visiveis = config.produtos.filter((produto) => produto.exibir);
  const itens = porClasse(produtos, "produto");
  assert.equal(itens.length, visiveis.length);
  visiveis.forEach((produto, i) => {
    for (const chave of ["selo", "frase", "peso", "ingredientes", "avisos"]) assert.ok(itens[i].textContent.includes(produto[chave]));
    assert.equal(porTag(itens[i], "summary")[0].textContent, config.textos.produtos.ingredientesTitulo);
    assert.equal(porTag(itens[i], "img")[0].srcset, `../${produto.fotoPequena} 400w, ../${produto.foto} 800w`);
    assert.equal(porTag(itens[i], "img")[0].alt, produto.alt);
    assert.equal(porClasse(itens[i], "produto-selo")[0].textContent, produto.selo);
    assert.equal(porClasse(itens[i], "produto-peso")[0].textContent, produto.peso);
    assert.equal(porClasse(itens[i], "arco").length, 0);
    assert.equal(itens[i].textContent.split(produto.peso).length - 1, 1);
  });
  assert.doesNotMatch(produtos.textContent, /diet/i);
  assert.equal(porClasse(produtos, "ingredientes-grade")[0].children.length, 4);
  for (const id of ["preparo", "como"]) assert.equal(porTag(pagina.get(id), "ol")[0].children.length, 3);
  porTag(pagina.get("como"), "ol")[0].children.forEach((item, i) => {
    assert.equal(porTag(item, "p")[0].textContent, config.textos.como.passos[i].replace(/^\d+\.\s*/, ""));
    assert.doesNotMatch(porTag(item, "p")[0].textContent, /^\d+\./);
  });
  const perguntas = porTag(pagina.get("duvidas"), "details");
  assert.equal(perguntas.length, config.textos.faq.itens.length);
  perguntas.forEach((item, i) => {
    assert.equal(porTag(item, "summary")[0].textContent, config.textos.faq.itens[i].pergunta);
    assert.equal(porTag(item, "p")[0].textContent, config.textos.faq.itens[i].resposta);
  });
});

test("C-07: faixa do config + Taparuba, quatro cópias e só uma acessível", async () => {
  const pagina = await paginaMontada;
  assert.equal(textos.taparuba, "Taparuba, MG");
  const grupos = porClasse(pagina.get("faixa"), "faixa-grupo");
  assert.equal(grupos.length, 4);
  const esperado = [config.textos.diferenca.cartoes[0].titulo, config.textos.diferenca.cartoes[1].titulo,
    config.textos.diferenca.cartoes[2].titulo.split(",")[0], textos.taparuba].join(" · ");
  assert.equal(esperado, "Café Conilon · Cacau 100% · Feito à mão · Taparuba, MG");
  grupos.forEach((grupo, i) => {
    assert.equal(grupo.textContent, esperado);
    assert.equal(grupo.getAttribute("aria-hidden"), i ? "true" : null);
  });
});

test("C-08: botão alterna textos, aria-pressed e a classe pausado", async () => {
  const pagina = await paginaMontada;
  const botao = porTag(pagina.get("faixa"), "button")[0];
  assert.equal(botao.type, "button");
  assert.equal(botao.textContent, textos.pausar);
  assert.equal(botao.getAttribute("aria-pressed"), "false");
  const anterior = Object.getOwnPropertyDescriptor(globalThis, "document");
  Object.defineProperty(globalThis, "document", { configurable: true, value: { documentElement: pagina.get("raiz") } });
  try {
    for (const pausado of [true, false]) {
      botao.eventos.click();
      assert.equal(botao.textContent, pausado ? textos.retomar : textos.pausar);
      assert.equal(botao.getAttribute("aria-pressed"), String(pausado));
      assert.equal(pagina.get("raiz").classList.contains("pausado"), pausado);
    }
  } finally {
    if (anterior) Object.defineProperty(globalThis, "document", anterior);
    else delete globalThis.document;
  }
});

test("C-10: dois artigos nomeados com as contas inteiras, sem abas", async () => {
  const pagina = await paginaMontada;
  const cartoes = porClasse(pagina.get("vender"), "venda-cartao");
  assert.equal(cartoes.length, 2);
  cartoes.forEach((cartao, i) => {
    assert.equal(cartao.tagName, "article");
    const titulo = porTag(cartao, "h3")[0];
    assert.equal(titulo.textContent, textos.vender.abas[i].titulo);
    assert.equal(cartao.getAttribute("aria-labelledby"), titulo.id);
    const conta = porClasse(cartao, "conta")[0];
    assert.equal(conta.id, i ? "conta-revenda" : "conta-xicara");
    assert.ok(descendentes(conta).some((no) => no.getAttribute("aria-live") === "polite"));
    porTag(conta, "input").forEach((campo) => assert.equal(campo.value, ""));
    assert.equal(cartao.style["--cartao-topo"], `${72 + i * 24}px`);
  });
  assert.ok(!descendentes(pagina.get("vender")).some((no) => /^(tab|tablist|tabpanel)$/.test(no.getAttribute("role"))));
  assert.doesNotMatch(ler("experimento.js"), /indiceDaAba|selecionarAba/);
  assert.doesNotMatch(ler("experimento.css"), /\.abas\b|\.aba-painel\b/);
});

test("B-08/B-09: menu com oito links válidos e degustação direta com mensagem do config", async () => {
  assert.deepEqual(textos.links.map(({ texto }) => texto), ["Origem", "Produtos", "Duas formas de vender", "Como preparar", "Como funciona", "Dúvidas", "Contato", "Site atual"]);
  assert.deepEqual(textos.links.map(({ href }) => href), ["#origem", "#produtos", "#vender", "#preparo", "#como", "#duvidas", "#contato", "../index.html"]);
  const pagina = await paginaMontada;
  const linksMenu = porClasse(pagina.get("menu-painel"), "menu-links")[0].children;
  assert.deepEqual(linksMenu.map(({ href }) => href), textos.links.map(({ href }) => href));
  for (const { href } of linksMenu) {
    if (href.startsWith("#")) assert.ok(pagina.has(href.slice(1)), href);
    else assert.ok(statSync(new URL(href, new URL("../experimento/", import.meta.url))).isFile());
  }
  const href = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(config.textos.whatsapp.degustacao)}`;
  for (const id of ["inicio", "vender", "como", "contato", "menu-painel"]) {
    assert.ok(porTag(pagina.get(id), "a").some((no) => no.href === href), id);
    assert.equal(porTag(pagina.get(id), "form").length, 0);
  }
  assert.doesNotMatch(ler("experimento.js"), /config\.textos\.degustacao/);
});

test("B-10/B-12: fotos existentes com dimensões e textos sem palavras proibidas", async () => {
  const pagina = await paginaMontada;
  for (const id of ["produtos", "preparo", "como", "duvidas", "vender"]) {
    for (const foto of porTag(pagina.get(id), "img")) {
      assert.ok(foto.width > 0 && foto.height > 0 && foto.alt);
      assert.equal(foto.loading, "lazy");
      assert.ok(statSync(new URL(foto.src, new URL("../experimento/", import.meta.url))).isFile());
      assert.doesNotMatch(foto.src, /(?:24|27|28)\./);
    }
  }
  const texto = [...pagina.values()].map((no) => no.textContent).join(" ")
    .replace(/cacau 100%, não achocolatado[.,]/gi, "");
  assert.doesNotMatch(texto, /premium|melhor|saudável|conservante|aditivo|natural|orgânico|solúvel|achocolatado/i);
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
