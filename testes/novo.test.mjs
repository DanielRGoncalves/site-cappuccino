import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { config } from "../js/config.js";
import { textos } from "../novo/js/textos.js";
import { montar } from "../novo/js/montar.js";

const base = new URL("../novo/", import.meta.url);
const ler = (nome) => readFileSync(new URL(nome, base), "utf8");
const strings = (objeto) => typeof objeto === "string" ? [objeto]
  : objeto && typeof objeto === "object" ? Object.values(objeto).flatMap(strings) : [];
const arquivos = (pasta = "") => readdirSync(new URL(pasta || ".", base), { withFileTypes: true })
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
  assert.match(ler("js/textos.js"), /import\s*\{\s*config\s*\}\s*from\s*"\.\.\/\.\.\/js\/config\.js"/);
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
  assert.deepEqual(textos, esperado, "Mesmas palavras do protótipo, exceto as remoções pedidas");
  // Mudar os textos novos muda o objeto montado: impede cópias literais silenciosas.
  const p = config.textos.pagina;
  const original = p.contato.titulo;
  try {
    p.contato.titulo = "Teste de configuração";
    const atualizado = await import(`../novo/js/textos.js?config=${Date.now()}`);
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
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.match(html, /rel="icon" href="\.\.\/img\/logo.webp"/);
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
  for (const nome of fontes()) assert.doesNotMatch(ler(nome).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, ""), /protótipo|prototipo|Site atual|Voltar ao site atual/i, nome);
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
    const bytes = arquivos().filter((nome) => nome.startsWith(pasta)).reduce((n, nome) => n + statSync(new URL(nome, base)).size, 0);
    t.diagnostic(`${pasta}: ${bytes} bytes / ${teto}`);
    assert.ok(bytes <= teto, `${pasta}: ${bytes}`);
  }
});

test("G4-7: ajustes e módulos de movimento idênticos ao protótipo; CSS só com remoções permitidas e caminhos", () => {
  const prototipo = (nome) => readFileSync(new URL(`../prototipo-graza/${nome}`, import.meta.url), "utf8");
  const ajustes = (texto) => texto.match(/const ajustes = \{[\s\S]*?\n\};/)[0];
  assert.equal(ajustes(ler("js/cena.js")), ajustes(prototipo("cena.js")));
  for (const nome of ["cena.js", "palco.js", "capitulo.js"]) assert.equal(ler(`js/${nome}`), prototipo(nome), nome);
  assert.equal(ler("js/conta.js"), prototipo("conta.js").replaceAll('from "../js/', 'from "../../js/'));
  for (const nome of ["gsap.min.js", "ScrollTrigger.min.js", "MorphSVGPlugin.min.js"]) {
    assert.equal(ler(`vendor/${nome}`), prototipo(`vendor/${nome}`), nome);
  }
  const esperado = prototipo("estilo.css").replace(/^\/\* Protótipo[^\n]*\n/, "")
    .replaceAll('url("fontes/', 'url("../fontes/').replace(/^\.anuncio-selo[^\n]*\n/m, "");
  assert.equal(ler("css/estilo.css"), esperado);
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
