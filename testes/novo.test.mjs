import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { config } from "../js/config.js";
import { config as configAntigo } from "../antigo/js/config.js";
import { textos } from "../js/textos.js";
import { montar } from "../js/montar.js";

const base = new URL("../", import.meta.url);
const ler = (nome) => readFileSync(new URL(nome, base), "utf8");
const strings = (objeto) => typeof objeto === "string" ? [objeto]
  : objeto && typeof objeto === "object" ? Object.values(objeto).flatMap(strings) : [];
const pastasPublicadas = ["css/", "js/", "vendor/", "desenhos/", "img/"];
const arquivos = (pasta) => pasta === undefined
  ? ["index.html", ...pastasPublicadas.flatMap((nome) => arquivos(nome))]
  : readdirSync(new URL(pasta, base), { withFileTypes: true })
  .flatMap((item) => item.isDirectory() ? arquivos(`${pasta}${item.name}/`) : [`${pasta}${item.name}`]);
const fontes = () => arquivos().filter((nome) => /\.(html|js|css)$/.test(nome) && !nome.startsWith("vendor/"));
const html = ler("index.html");
const atributos = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, k, v]) => [k, v]));
const whatsapp = (mensagem) => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(mensagem)}`;

// Executa a montagem real, inclusive os controles das calculadoras, sem dependências.
class No {
  constructor(tag) {
    this.tagName = tag; this.children = []; this.atributos = {}; this.texto = "";
    this.style = { setProperty() {} };
    this.classList = { toggle() {}, remove() {} };
  }
  set textContent(valor) { this.texto = String(valor); this.children = []; }
  get textContent() { return this.texto + this.children.map((no) => no.textContent).join(""); }
  setAttribute(k, v) { this.atributos[k] = String(v); if (k === "id") this.id = String(v); }
  append(...filhos) { this.children.push(...filhos.map((f) => typeof f === "object" ? f : Object.assign(new No("#text"), { texto: String(f) }))); }
  set value(v) { this.valor = String(v); }
  get value() { return this.valor ?? this.children.find((no) => no.selected)?.value ?? ""; }
  addEventListener() {}
  getAnimations() { return []; }
}
const descendentes = (no) => [no, ...no.children.flatMap(descendentes)];
const nos = new Map([...html.matchAll(/<([\w-]+)[^>]*\bid="([^"]+)"[^>]*>/g)]
  .map(([, tag, id]) => [id, Object.assign(new No(tag), { id })]));
const pular = new No("a");
const documentoAnterior = Object.getOwnPropertyDescriptor(globalThis, "document");
try {
  Object.defineProperty(globalThis, "document", { configurable: true, value: {
    getElementById: (id) => nos.get(id), querySelector: () => pular,
    createElement: (tag) => new No(tag), createElementNS: (_, tag) => new No(tag),
  } });
  montar({ matches: true, addEventListener() {} });
} finally {
  if (documentoAnterior) Object.defineProperty(globalThis, "document", documentoAnterior);
  else delete globalThis.document;
}
const montados = () => [...nos.values()].flatMap(descendentes);

test("G4-1: todas as strings exportadas vêm do config ou de derivações explícitas", async () => {
  assert.match(ler("js/textos.js"), /import\s*\{\s*config\s*\}\s*from\s*"\.\/config\.js"/);
  const permitidas = new Set([...strings(config),
    `${config.textos.hero.subtitulo.split(":")[0]}.`,
    `${config.textos.diferenca.titulo.split(", ")[0]},`,
    `${config.textos.diferenca.titulo.split(", ")[1]}.`,
    config.textos.faq.itens[5].resposta.replace(" pela família", ""),
    whatsapp(config.textos.whatsapp.degustacao), whatsapp(config.textos.whatsapp.geral),
    // IDs de desenhos são dados estruturais, sem texto visível.
    "01", "07", "10", "09",
  ]);
  for (const valor of strings(textos)) assert.ok(permitidas.has(valor), valor);
  assert.equal(textos.apoio, config.textos.diferenca.destaque);
  const { textos: referencia } = await import("../prototipo-graza/textos.js");
  const esperado = structuredClone(referencia);
  delete esperado.aviso; delete esperado.prototipo; delete esperado.contato.voltar;
  esperado.links = esperado.links.filter((link) => link.href.startsWith("#"));
  esperado.navegacao = config.textos.pagina.navegacao;
  esperado.origem.grande = config.textos.pagina.origemGrande;
  esperado.pular = config.textos.pagina.pular;
  esperado.destaques = config.textos.pagina.destaques;
  esperado.links = esperado.links.filter((link) => link.href !== "#duvidas");
  esperado.origem.titulo = config.textos.pagina.origem.titulo;
  esperado.origem.texto = config.textos.pagina.origem.texto;
  esperado.paradas[0].texto = config.textos.pagina.paradas[0];
  esperado.paradas[2].texto = config.textos.pagina.paradas[2];
  esperado.produtos.igual = config.textos.pagina.produtosIgual;
  esperado.vender.entrada = config.textos.pagina.venderEntrada;
  esperado.vender.cartoes[0].lista = [config.textos.pagina.venderSemLeite];
  esperado.vender.cartoes[1].lista = [config.textos.porque.motivos[3]];
  esperado.vender.cartoes[1].frase = config.textos.pagina.venderPacote;
  esperado.como.passos[2] = config.textos.pagina.comoPasso3;
  esperado.contato.texto = config.textos.pagina.contato.texto;
  esperado.contato.conservacaoTitulo = config.textos.pagina.contato.conservacaoTitulo;
  esperado.contato.conservacao = config.textos.conservacao;
  esperado.contato.alt = config.textos.pagina.contato.alt;
  esperado.contato.legenda = config.textos.pagina.contato.legenda;
  esperado.como.foto = config.textos.pagina.como.foto;
  esperado.vender.fotos[1] = config.textos.pagina.venderFoto;
  delete esperado.faq;
  assert.deepEqual(textos, esperado, "Mesmas palavras do protótipo, exceto as mudanças da G4/G6/G7");
  // Mudar os textos novos muda o objeto montado: impede cópias literais silenciosas.
  const p = config.textos.pagina;
  const original = p.contato.titulo;
  try {
    p.contato.titulo = "Teste de configuração";
    const atualizado = await import(`../js/textos.js?config=${Date.now()}`);
    assert.equal(atualizado.textos.contato.titulo, p.contato.titulo);
  } finally { p.contato.titulo = original; }
  for (const no of montados()) {
    for (const k of ["textContent", "alt", "aria-label", "title"]) {
      const valor = no.atributos[k];
      if (valor && /[a-zÀ-ú]/i.test(valor)) assert.ok(permitidas.has(valor), `${k}: ${valor}`);
    }
  }
});

test("G4-2: head e noscript sincronizados com o config, sem avisos de protótipo", () => {
  const head = html.match(/<!-- SINCRONIZAR COM js\/config.js -->([\s\S]*?)<!-- \/SINCRONIZAR -->/)[1];
  const tags = Object.fromEntries([...head.matchAll(/<meta\b[^>]*>/g)].map(([tag]) => {
    const a = atributos(tag); return [a.name || a.property, a.content];
  }));
  assert.equal(head.match(/<title>(.*?)<\/title>/)[1], config.meta.titulo);
  const imagem = new URL(config.meta.imagem, config.siteUrl).href;
  for (const [nome, valor] of Object.entries({ description: config.meta.descricao,
    "og:type": "website", "og:locale": "pt_BR", "og:site_name": config.marca,
    "og:title": config.meta.titulo, "og:description": config.meta.descricao,
    "og:url": config.siteUrl, "og:image": imagem, "og:image:alt": config.meta.imagemAlt,
    "og:image:width": "1200", "og:image:height": "630", "twitter:card": "summary_large_image",
    "twitter:title": config.meta.titulo, "twitter:description": config.meta.descricao, "twitter:image": imagem,
  })) assert.equal(tags[nome], valor, nome);
  assert.ok(head.includes(`rel="canonical" href="${config.siteUrl}"`));
  assert.doesNotMatch(html, /<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i);
  assert.match(html, /rel="icon" href="img\/logo.webp"/);
  const semJs = html.match(/<noscript>([\s\S]*?)<\/noscript>/)[1];
  assert.match(semJs, /SINCRONIZAR COM js\/config.js/);
  const textosSemJs = [...semJs.matchAll(/>([^<>]+)</g)].map(([, s]) => s.trim()).filter(Boolean);
  assert.deepEqual(textosSemJs, [config.marca, config.textos.hero.titulo, config.textos.hero.subtitulo,
    config.textos.hero.degustacao, config.instagram.usuario, textos.faixa.join(" · "),
    textos.contato.entregaTitulo, textos.contato.entrega, textos.contato.pagamentoTitulo, textos.contato.pagamento,
    `${config.dadosLegais.razaoSocial} · ${config.textos.contato.cnpj} ${config.dadosLegais.cnpj} · ${config.dadosLegais.endereco}`,
    // CSS estático herdado do noscript; não é texto informativo.
    ".anuncio, .topo, #conteudo, .contato, .camada-gota { display: none; }",
  ]);
  assert.ok(semJs.includes(`href="${whatsapp(config.textos.whatsapp.degustacao)}"`));
  assert.ok(semJs.includes(`href="${config.instagram.url}"`));
  assert.ok(semJs.includes(`alt="${config.apresentacao.hero.alt}"`));
  // Comentários históricos dos módulos congelados não aparecem na página.
  // O config copiado conserva dados antigos não usados; não aparecem na página nova.
  for (const nome of fontes().filter((n) => n !== "js/config.js")) assert.doesNotMatch(ler(nome).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, ""), /protótipo|prototipo|Site atual|Voltar ao site atual/i, nome);
});

test("G4-3: palavras proibidas ausentes das fontes e do conteúdo renderizado", () => {
  const conferir = (texto, nome) => {
    // As duas ocorrências aprovadas do config mantêm a mesma afirmação sobre cacau.
    texto = texto.replace(/cacau 100%, não achocolatado[.,]/gi, "");
    assert.doesNotMatch(texto, /premium|melhor|saudável|conservante|aditivo|natural|orgânico|achocolatado|solúvel|sem aditivos|\bgraza\b/i, nome);
  };
  // Mantém os comentários de procedência nos arquivos que a G4 manda copiar literalmente.
  for (const nome of fontes()) conferir(ler(nome).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, ""), nome);
  for (const no of montados()) conferir(no.textContent, no.tagName);
});

test("G4-4: imagens reais montadas e no HTML têm alt, width, height e lazy fora do hero", () => {
  for (const foto of montados().filter((no) => no.tagName === "img")) {
    const a = foto.atributos;
    assert.ok(Object.hasOwn(a, "alt"), a.src);
    assert.ok(Number(a.width) > 0 && Number(a.height) > 0, a.src);
    if (!a.src.includes("/hero-")) assert.equal(a.loading, "lazy", a.src);
  }
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    const a = atributos(tag);
    assert.ok(Object.hasOwn(a, "alt") && Number(a.width) > 0 && Number(a.height) > 0);
  }
  assert.equal(montados().filter((no) => no.tagName === "h1").length, 1);
});

test("G4-5: sem APIs inseguras nem recursos externos; WhatsApp codificado", () => {
  for (const nome of fontes()) {
    let codigo = ler(nome);
    assert.doesNotMatch(codigo, /innerHTML|outerHTML|document\.write|\beval\s*\(/, nome);
    // URLs de compartilhamento exigidas pela regra 6 não carregam recursos externos.
    // A exceção é restrita ao bloco de metadados, cujo conteúdo exato é testado acima.
    if (nome === "index.html") codigo = codigo.replace(/<!-- SINCRONIZAR COM js\/config.js -->[\s\S]*?<!-- \/SINCRONIZAR -->/, "");
    for (const [url] of codigo.matchAll(/https?:\/\/[^\s"'<>`]+/g)) {
      // O config copiado contém o domínio canônico usado só nos metadados.
      if (nome === "js/config.js" && url === config.siteUrl) continue;
      assert.match(url, /^https?:\/\/(?:wa\.me|instagram\.com|www\.w3\.org)(?:\/|$)/, `${nome}: ${url}`);
    }
  }
  assert.match(ler("js/textos.js"), /encodeURIComponent\(mensagem\)/);
  for (const [href, mensagem] of [[textos.whatsappGeral, config.textos.whatsapp.geral], [textos.whatsappDegustacao, config.textos.whatsapp.degustacao]]) {
    assert.equal(new URL(href).searchParams.get("text"), mensagem);
  }
});

test("G4-6: JS próprio e vendor dentro dos tetos de bytes", (t) => {
  for (const [pasta, teto] of [["js/", 50000], ["vendor/", 160000]]) {
    const copias = ["js/config.js", "js/calculadora.js", "js/pedido.js"];
    const bytes = arquivos().filter((nome) => nome.startsWith(pasta) && !copias.includes(nome)).reduce((n, nome) => n + statSync(new URL(nome, base)).size, 0);
    t.diagnostic(`${pasta}: ${bytes} bytes / ${teto}`);
    assert.ok(bytes <= teto, `${pasta}: ${bytes}`);
  }
});

test("G4-7: ajustes e módulos de movimento idênticos ao protótipo; CSS só com remoções permitidas e caminhos", () => {
  const prototipo = (nome) => readFileSync(new URL(`../prototipo-graza/${nome}`, import.meta.url), "utf8");
  const ajustes = (texto) => texto.match(/const ajustes = \{[\s\S]*?\n\};/)[0];
  assert.equal(ajustes(ler("js/cena.js")), ajustes(prototipo("cena.js")));
  for (const nome of ["cena.js", "palco.js", "capitulo.js"]) assert.equal(ler(`js/${nome}`), prototipo(nome), nome);
  assert.equal(ler("js/conta.js"), prototipo("conta.js").replaceAll('from "../js/', 'from "./'));
  for (const nome of ["gsap.min.js", "ScrollTrigger.min.js", "MorphSVGPlugin.min.js"]) {
    assert.equal(ler(`vendor/${nome}`), prototipo(`vendor/${nome}`), nome);
  }
  const esperado = prototipo("estilo.css").replace(/^\/\* Protótipo[^\n]*\n/, "")
    .replace(/^\.anuncio-selo[^\n]*\n/m, "")
    .replace(/^\/\* Dúvidas \*\/\r?\n|^\.duvidas[^\n]*\n/gm, "")
    // Única exceção de layout autorizada por Daniel na G6: três notas no computador.
    .replace(/(\.contato-notas \{[^\n]*repeat\()2,/, "$13,");
  // G7 só acrescenta estes dois blocos de foto/grid/legenda; o restante fica literal.
  const css = ler("css/estilo.css").replace(/\/\* G7: (?:foto e grid de Como funciona|legenda do contato fora do arco)\. \*\/[\s\S]*?\/\* \/G7 \*\/\r?\n/g, "");
  assert.equal(css, esperado);
});

test("G4-8: fontes informativas >= 14px, sem overflow-x hidden em html/body", () => {
  const excecoes = [{ seletor: ".plim", motivo: "Onomatopeia decorativa da torneira, em ancestral aria-hidden; não informa conteúdo." }];
  const css = ler("css/estilo.css");
  for (const [, seletor, bloco] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (excecoes.some((e) => seletor.trim() === e.seletor && e.motivo)) continue;
    for (const [, valor] of bloco.matchAll(/(?:font-size|font|--(?:nota|texto|frase|numero-ganho))\s*:\s*([^;]+)/g)) {
      // Nos clamp(), o primeiro argumento é o mínimo; não testar o coeficiente vw isolado.
      const limpo = valor.replace(/clamp\(([^,]+),[^,]+,[^)]+\)/g, "$1");
      for (const [, numero, unidade] of limpo.matchAll(/([\d.]+)(px|rem|vw)\b/g)) {
        const minimo = Number(numero) * (unidade === "rem" ? 16 : unidade === "vw" ? 3.2 : 1);
        assert.ok(minimo >= 14, `${seletor.trim()}: ${valor}`);
      }
    }
    if (/\b(?:html|body)\b/.test(seletor)) assert.doesNotMatch(bloco, /overflow-x:\s*hidden/);
  }
  assert.match(css, /body\s*\{[^}]*overflow-x: clip/);
});

test("G4-9: referências locais, fontes, desenhos, fotos, imports e âncoras existem", () => {
  const existe = (caminho, origem = base) => {
    if (!caminho || caminho.startsWith("#") || /^https?:/.test(caminho)) return;
    assert.ok(statSync(new URL(caminho, origem)).isFile(), caminho);
  };
  for (const [tag] of html.matchAll(/<(?:script|link|img)\b[^>]*>/g)) {
    const a = atributos(tag); existe(a.src || a.href);
  }
  for (const [, caminho] of ler("css/estilo.css").matchAll(/url\(["']?([^"')]+)["']?\)/g)) existe(caminho, new URL("css/", base));
  for (const nome of arquivos().filter((n) => n.startsWith("js/") && n.endsWith(".js"))) {
    for (const [, caminho] of ler(nome).matchAll(/from\s*"([^"]+)"/g)) existe(caminho, new URL(nome, base));
  }
  for (const no of montados()) {
    const a = no.atributos;
    existe(a.src);
    for (const candidato of (a.srcset || "").split(",").filter(Boolean)) existe(candidato.trim().split(/\s/)[0]);
    if (a.href?.startsWith("#")) assert.ok(nos.has(a.href.slice(1)), a.href);
  }
  assert.deepEqual(arquivos().filter((n) => n.startsWith("desenhos/")).sort(), ["01", "02", "07", "09", "10"].map((n) => `desenhos/${n}.svg`));
  assert.ok(!arquivos().some((n) => /courier/i.test(n)));
});

test("G4-10: testes antigos continuam passando", (t) => {
  const pasta = new URL("./", import.meta.url);
  const antigos = readdirSync(pasta).filter((nome) => nome.endsWith(".test.mjs") && nome !== "novo.test.mjs")
    .map((nome) => new URL(nome, pasta));
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const saida = execFileSync(process.execPath, ["--test", "--test-reporter=tap", ...antigos.map((url) => decodeURIComponent(url.pathname).replace(/^\/(\w:)/, "$1"))], { encoding: "utf8", env });
  assert.match(saida, /# fail 0/);
  t.diagnostic(saida.match(/# tests \d+/)?.[0] || "Testes antigos sem falhas");
});

test("G6-1: as 11 mudanças têm palavras exatas e aparecem na montagem", () => {
  const mudancas = [
    [textos.origem.titulo, "Feito em Taparuba, Minas Gerais"],
    [textos.origem.texto, "Cada pacote é preparado pela família, em casa."],
    [textos.paradas[0].texto, "Café Conilon, plantado por nós."],
    [textos.paradas[2].texto, "Preparado à mão, em casa, sem processo industrial e sem máquinas."],
    [textos.produtos.igual, "A única diferença entre os dois é o açúcar."],
    [textos.vender.entrada, "Um diferencial para o seu cardápio."],
    [textos.vender.cartoes[0].lista, ["Não precisa de leite: ele já vem no pó. É só água quente."]],
    [textos.vender.cartoes[1].lista, ["Validade de 365 dias."]],
    [textos.como.passos[2], "3. Se gostar, faz o pedido e entregamos."],
    [textos.contato.texto, "Peça pelo WhatsApp e a gente combina como fazer."],
    [[textos.contato.conservacaoTitulo, textos.contato.conservacao],
      ["Conservação", "Local seco, ventilado e protegido da luz solar."]],
  ];
  const conteudo = montados().map((no) => no.textContent).join(" ");
  for (const [atual, esperado] of mudancas) {
    assert.deepEqual(atual, esperado);
    // O número do passo é montado em um span separado; a frase fica no parágrafo.
    for (const frase of strings(esperado)) assert.ok(conteudo.includes(frase.replace(/^\d+\.\s*/, "")), frase);
  }
  assert.deepEqual(textos.como.passos.slice(0, 2), config.textos.como.passos.slice(0, 2));
  assert.equal(textos.vender.cartoes[1].lista[0], config.textos.porque.motivos[3]);
  const notas = descendentes(nos.get("contato")).find((no) => no.className === "contato-notas");
  assert.deepEqual(notas.children.map((no) => no.children[0].textContent), ["Entrega", "Pagamento", "Conservação"]);
});

// Percorre cada nó uma vez, descartando as subárvores excluídas pela G6.
// Não usa o textContent de cada ancestral, que duplicaria a contagem.
const textoVisivel = (no) => {
  if (no.atributos["aria-hidden"] === "true" || ["noscript", "title", "meta"].includes(no.tagName)
    || no.id === "faixa" || no.className === "produto-ingredientes" || no.className === "sr") return "";
  return [no.texto, ...no.children.map(textoVisivel)].join(" ");
};
test("G6-2: texto visível tem até 3 cacau 100% e até 2 sem taxa", (t) => {
  const conteudo = [...nos.values()].map(textoVisivel).join(" ");
  const cacau = (conteudo.match(/cacau 100%/gi) || []).length;
  const taxa = (conteudo.match(/sem taxa/gi) || []).length;
  t.diagnostic(`Texto visível: cacau 100% = ${cacau}; sem taxa = ${taxa}`);
  assert.ok(cacau <= 3, `cacau 100%: ${cacau}`);
  assert.ok(taxa <= 2, `sem taxa: ${taxa}`);
  assert.equal(cacau, 3, "Hero e título/texto da parada 2 permanecem");
  assert.equal(taxa, 2, "Anúncio e nota de entrega permanecem");
});

test("G6-3: Dúvidas foi removida do HTML, montagem, menu e CSS", () => {
  assert.ok(!nos.has("duvidas"));
  assert.ok(!textos.links.some((link) => link.href === "#duvidas" || link.texto === "Dúvidas"));
  for (const no of montados()) {
    assert.notEqual(no.id, "duvidas");
    assert.notEqual(no.atributos.href, "#duvidas");
  }
  for (const nome of ["index.html", "js/montar.js", "css/estilo.css"]) {
    assert.doesNotMatch(ler(nome), /duvidas/i, nome);
  }
  assert.ok(!Object.hasOwn(textos, "faq"));
});

test("G7-3: config do antigo preserva a versão anterior à migração sem textos.pagina", async () => {
  // Snapshot anterior à G5: continua verificando o mesmo config após o futuro commit.
  const original = execFileSync("git", ["show", "ee5f33800dbb8388dbf2a73de25c2b7d53b14bbb:js/config.js"], {
    cwd: new URL("../", import.meta.url), encoding: "utf8",
  });
  const { config: anterior } = await import(`data:text/javascript;base64,${Buffer.from(original).toString("base64")}`);
  const semPagina = (valor) => {
    const copia = structuredClone(valor);
    delete copia.textos.pagina;
    return copia;
  };
  assert.ok(!Object.hasOwn(configAntigo.textos, "pagina"));
  assert.deepEqual(configAntigo, semPagina(anterior));
});

test("G5-a: a página principal não tem noindex", () => {
  const robots = [...html.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => atributos(tag))
    .filter((a) => /^(robots|googlebot)$/i.test(a.name || ""));
  for (const a of robots) assert.doesNotMatch(a.content || "", /noindex/i);
});

test("G5-b: a página antiga mantém noindex e sua URL própria", () => {
  const antigo = ler("antigo/index.html");
  assert.match(antigo, /<meta name="robots" content="noindex"\s*\/>/);
  const url = new URL("antigo/", config.siteUrl).href;
  assert.ok(antigo.includes(`rel="canonical" href="${url}"`));
  assert.ok(antigo.includes(`property="og:url" content="${url}"`));
});

test("G5-c: imagem de compartilhamento existe e é a citada em og:image e twitter:image", () => {
  const imagem = new URL("img/og.jpg", base);
  assert.ok(statSync(imagem).isFile());
  assert.deepEqual(readFileSync(imagem), readFileSync(new URL("antigo/img/og.jpg", base)));
  const url = new URL("img/og.jpg", config.siteUrl).href;
  for (const nome of ["og:image", "twitter:image"]) {
    const tag = [...html.matchAll(/<meta\b[^>]*>/g)].map(([t]) => atributos(t))
      .find((a) => (a.property || a.name) === nome);
    assert.equal(tag?.content, url, nome);
  }
});

test("G5-d: a pasta anterior da página principal não existe mais", () => {
  assert.equal(existsSync(new URL("novo", base)), false);
});

test("G5-e: todos os src/href locais do HTML antigo existem", () => {
  const origem = new URL("antigo/index.html", base);
  const antigo = readFileSync(origem, "utf8");
  const ids = new Set([...antigo.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => id));
  let locais = 0;
  for (const [, caminho] of antigo.matchAll(/\b(?:src|href)="([^"]*)"/g)) {
    if (!caminho || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(caminho)) continue;
    if (caminho.startsWith("#")) { assert.ok(ids.has(caminho.slice(1)), caminho); continue; }
    const url = new URL(caminho, origem);
    url.hash = ""; url.search = "";
    assert.ok(statSync(url).isFile(), caminho);
    locais++;
  }
  assert.ok(locais > 0, "Verificou arquivos locais além das âncoras");
});

test("G7-1: novo é independente, sem ../ e com recursos dentro da pasta", () => {
  const existeDentro = (caminho, origem = base) => {
    if (!caminho || caminho.startsWith("#") || /^https?:/.test(caminho)) return;
    assert.doesNotMatch(caminho, /\.\.\//);
    const url = new URL(caminho, origem);
    assert.ok(url.href.startsWith(base.href), `${origem}: ${caminho}`);
    assert.ok(statSync(url).isFile(), caminho);
  };
  for (const nome of arquivos().filter((n) => /\.(html|css|js)$/.test(n))) {
    const codigo = ler(nome);
    assert.doesNotMatch(codigo, /\.\.\//, nome);
    for (const [, caminho] of codigo.matchAll(/(?:from\s*|import\s*\(\s*)["']([^"']+)["']/g)) {
      assert.ok(caminho.startsWith("./"), `${nome}: ${caminho}`);
      existeDentro(caminho, new URL(nome, base));
    }
  }
  for (const [tag] of html.matchAll(/<(?:script|link|img)\b[^>]*>/g)) {
    const a = atributos(tag); existeDentro(a.src || a.href);
  }
  for (const [, caminho] of ler("css/estilo.css").matchAll(/url\(["']?([^"')]+)["']?\)/g)) existeDentro(caminho, new URL("css/", base));
  for (const no of montados()) {
    existeDentro(no.atributos.src);
    for (const candidato of (no.atributos.srcset || "").split(",").filter(Boolean)) existeDentro(candidato.trim().split(/\s/)[0]);
  }
  for (const nome of ["calculadora.js", "pedido.js"]) {
    assert.equal(ler(`js/${nome}`), readFileSync(new URL(`../antigo/js/${nome}`, import.meta.url), "utf8"));
  }
  assert.ok(ler("js/config.js").startsWith("// Config da página principal (raiz). O site antigo usa antigo/js/config.js."));
});

test("G7-2: fotos novas nos três lugares, dimensões, alt, srcset e legenda", () => {
  const imagem = (raiz, src, alt, largura, altura, srcset) => {
    const foto = descendentes(raiz).find((no) => no.tagName === "img" && no.atributos.src === src);
    assert.ok(foto, src);
    assert.equal(foto.atributos.alt, alt);
    assert.equal(foto.atributos.width, String(largura));
    assert.equal(foto.atributos.height, String(altura));
    assert.equal(foto.atributos.loading, "lazy");
    if (srcset) assert.equal(foto.atributos.srcset, srcset);
  };
  imagem(nos.get("contato"), "img/equipe-1200.webp", "Davi e Gustavo, da Cheiro das Águas, rindo à mesa com o cappuccino", 1200, 1500,
    "img/equipe-600.webp 600w, img/equipe-1200.webp 1200w");
  const legenda = descendentes(nos.get("contato")).find((no) => no.tagName === "figcaption");
  assert.equal(legenda.textContent, "Davi e Gustavo, à frente da Cheiro das Águas.");
  assert.equal(legenda.textContent, config.textos.pagina.contato.legenda);
  const revenda = descendentes(nos.get("vender")).find((no) => no.atributos["aria-labelledby"] === "titulo-venda-1");
  imagem(revenda, "img/abrindo-600.webp", "Mão abrindo um pacote de cappuccino Cheiro das Águas", 600, 800);
  imagem(nos.get("como"), "img/bule-1080.webp", "Moça sorrindo com um pacote de cappuccino e um bule vermelho", 1080, 1440,
    "img/bule-600.webp 600w, img/bule-1080.webp 1080w");
  for (const nome of fontes()) assert.doesNotMatch(ler(nome), /contato-(600|1200)\.webp/, nome);
  assert.ok(!arquivos().some((nome) => /contato-(600|1200)\.webp/.test(nome)));
});
