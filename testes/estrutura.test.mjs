import assert from "node:assert/strict";
import { readFile, access, stat } from "node:fs/promises";
import { test } from "node:test";
import { config } from "../js/config.js";
import { produtosVisiveis, indiceDaAba } from "../js/produtos.js";

const root = new URL("../", import.meta.url);
const html = await readFile(new URL("index.html", root), "utf8");
const main = await readFile(new URL("js/main.js", root), "utf8");

test("protótipo tem noindex fora das metas sincronizadas e conteúdo visual no config", () => {
  assert.match(html, /<!-- Remover ao publicar a versão oficial -->\s*<meta name="robots" content="noindex"\s*\/>/);
  assert.ok(html.indexOf('name="robots"') > html.indexOf("<!-- /SINCRONIZAR -->"));
  assert.equal(config.apresentacao.prototipo, true);
  assert.equal(config.apresentacao.avisoPrototipo,
    "Protótipo: algumas fotos ainda serão trocadas por outras do nosso dia a dia.");
  assert.equal(config.textos.origem.titulo, "Feito à mão em Taparuba, Minas Gerais");
  assert.equal(config.textos.origem.texto,
    "Cada pacote é preparado pela família, em casa, com café Conilon e cacau 100%.");
  assert.equal(config.textos.produtos.titulo, "Qual escolher?");
  assert.equal(config.textos.produtos.igual, "Nos dois: café Conilon, cacau 100% e o mesmo preparo.");
  assert.deepEqual(config.textos.diferenca.cartoes.map((c) => c.foto), [
    "img/reais/cafe-720.webp", "img/reais/cacau-720.webp", "img/reais/mao-720.webp", "img/reais/aroma-720.webp",
  ]);
  assert.deepEqual(config.textos.preparo.passos.map((p) => p.foto), [
    "img/reais/preparo-1-480.webp", "img/reais/preparo-2-480.webp", "img/reais/preparo-3-480.webp",
  ]);
  assert.doesNotMatch(html + main,
    /Foto a definir|Cada pacote é preparado pela família|Nos dois: café Conilon/);
});

test("fotos reais WebP respeitam os limites", async () => {
  for (const [arquivo, limite] of [
    ["hero-720.webp", 120000], ["hero-480.webp", 120000],
    ["origem-720.webp", 100000], ["cafe-720.webp", 100000],
    ["cacau-720.webp", 100000], ["mao-720.webp", 100000], ["aroma-720.webp", 100000],
    ["preparo-1-480.webp", 70000], ["preparo-2-480.webp", 70000], ["preparo-3-480.webp", 70000],
    ["produto-acucar-800.webp", 100000], ["produto-sem-800.webp", 100000],
    ["produto-acucar-400.webp", 60000], ["produto-sem-400.webp", 60000],
  ]) {
    const url = new URL(`img/reais/${arquivo}`, root);
    assert.ok((await stat(url)).size <= limite, arquivo);
    const bytes = await readFile(url);
    assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
  }
});

test("meta tags de título, descrição e URL seguem o config", () => {
  const bloco = html.match(/<!-- SINCRONIZAR COM js\/config\.js -->([\s\S]*?)<!-- \/SINCRONIZAR -->/)?.[1];
  assert.ok(bloco, "bloco de meta tags sincronizadas ausente");

  const meta = (chave) => {
    const escapar = chave.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return bloco.match(new RegExp(`<meta (?:name|property)="${escapar}" content="([^"]+)"\\s*/>`))?.[1];
  };
  const imagemUrl = new URL(config.meta.imagem, config.siteUrl).href;

  assert.equal(bloco.match(/<title>([^<]+)<\/title>/)?.[1], config.meta.titulo);
  assert.equal(meta("description"), config.meta.descricao);
  assert.equal(meta("og:title"), config.meta.titulo);
  assert.equal(meta("og:description"), config.meta.descricao);
  assert.equal(meta("twitter:title"), config.meta.titulo);
  assert.equal(meta("twitter:description"), config.meta.descricao);
  assert.equal(bloco.match(/<link rel="canonical" href="([^"]+)"\s*\/>/)?.[1], config.siteUrl);
  assert.equal(meta("og:url"), config.siteUrl);
  assert.equal(meta("og:image"), imagemUrl);
  assert.equal(meta("twitter:image"), imagemUrl);
  assert.equal(meta("og:image:alt"), config.meta.imagemAlt);
});

test("a página carrega CSS externo e JS como módulo", async () => {
  assert.match(html, /<link\s+rel="stylesheet"\s+href="css\/style\.css"\s*\/>/);
  assert.match(html, /<script\s+type="module"\s+src="js\/main\.js"><\/script>/);
  assert.doesNotMatch(html, /<style\b|<script(?![^>]*\bsrc=)[^>]*>/i);
  await access(new URL("css/style.css", root));
  await access(new URL("js/main.js", root));
});

test("o arquivo JS antigo não é usado", async () => {
  assert.doesNotMatch(html, /script\.js/);
  await assert.rejects(access(new URL("js/script.js", root)), { code: "ENOENT" });
});

test("a apresentação tem seções em ordem, menu e links válidos antes do JS", () => {
  const secoes = ['id="origem"', 'id="diferenca"', 'id="produtos"', 'id="porque"', 'id="padarias"', 'id="preparo"', 'id="como"', 'id="degustacao"', 'id="faq"', 'id="contato"'];
  const posicoes = secoes.map((id) => html.indexOf(id));
  assert.ok(posicoes.every((posicao) => posicao >= 0));
  assert.deepEqual(posicoes, [...posicoes].sort((a, b) => a - b));
  const nav = html.match(/<nav class="nav"[\s\S]*?<\/nav>/)?.[0];
  assert.ok(nav);
  assert.deepEqual([...nav.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]),
    ["diferenca", "produtos", "porque", "padarias", "como", "faq", "contato"]);
  assert.deepEqual(config.textos.menu,
    ["Diferenciais", "Produtos", "Por que vender", "A conta", "Como funciona", "Dúvidas", "Contato"]);
  assert.match(html, /id="pedir-degustacao" href="#degustacao"/);
  assert.match(html, /id="floating-whatsapp" href="#contato"/);
});

test("os textos e a ordem da apresentação vêm do config", () => {
  const textos = config.textos;
  assert.equal(textos.hero.titulo, "Cappuccino com cacau 100% para o seu negócio");
  assert.equal(textos.hero.subtitulo,
    "Para padarias, cafeterias, restaurantes e outros negócios: artesanal e gourmet, feito à mão com café Conilon e cacau 100%. Pronto com água quente. Entregamos na Grande Vitória, sem taxa. Antes de qualquer venda, a degustação é gratuita.");
  assert.equal(textos.hero.degustacao, "Pedir degustação gratuita");
  assert.equal(textos.hero.conta, "Ver a conta do seu negócio");
  assert.equal(textos.padarias.titulo, "Quanto rende no seu negócio");
  assert.deepEqual({ ...textos.diferenca, cartoes: textos.diferenca.cartoes.map(({ titulo, texto }) => ({ titulo, texto })) }, {
    titulo: "Feito à mão, do jeito simples",
    cartoes: [
      { titulo: "Café Conilon", texto: "Café Conilon para dar mais sabor ao cappuccino." },
      { titulo: "Cacau 100%", texto: "Cacau 100%, não achocolatado." },
      { titulo: "Feito à mão, em casa", texto: "Preparado à mão, em casa, sem processo industrial." },
      { titulo: "Aroma, sensações e cremosidade", texto: "Um aroma que se sente ao preparar, sabor que aparece na xícara e uma textura cremosa." },
    ],
    destaque: "Artesanal e gourmet: qualidade e simplicidade no processo.",
  });
  assert.equal(textos.porque.motivos.length, 5);
  assert.equal(textos.porque.motivos[0],
    "Um diferencial para o seu cardápio: cappuccino artesanal, feito à mão e com cacau 100%.");
  assert.equal(textos.como.passos[1],
    "2. Fazemos uma degustação gratuita: levamos uma pequena quantidade do cappuccino e a água quente, e você experimenta na hora.");
  assert.equal(textos.conservacao, "Local seco, ventilado e protegido da luz solar.");
  assert.deepEqual(textos.faq.itens.map((item) => item.pergunta), [
    "O que torna este cappuccino diferente do industrial?",
    "Como funciona a degustação?",
    "Quanto rende um pacote?",
    "Como preparar?",
    "Quanto tempo dura?",
    "Como é a entrega?",
    "Como posso pagar?",
  ]);
  assert.equal(textos.faq.itens[0].resposta,
    "Ele é feito à mão, em casa, sem processo industrial. O chocolate é cacau 100%, não achocolatado, e o café é Conilon. A ideia é qualidade e simplicidade no preparo.");
  assert.equal(textos.faq.itens[1].resposta,
    "A degustação é gratuita e acontece antes da primeira venda. Levamos uma pequena quantidade do cappuccino e a água quente, e você experimenta na hora.");
  assert.equal(textos.faq.itens[4].resposta,
    "A validade é de 365 dias. Conserve em local seco, ventilado e protegido da luz solar.");
  assert.equal(config.meta.titulo, "Cheiro das Águas | Cappuccino artesanal e gourmet");
  assert.equal(config.meta.descricao,
    "Cheiro das Águas: cappuccino artesanal e gourmet, com café Conilon e cacau 100%, para padarias, cafeterias, restaurantes e outros negócios da Grande Vitória.");
  assert.doesNotMatch(html + main, /Feito à mão, do jeito simples|Pedir degustação gratuita|Ingredientes: Leite em pó integral/);
});

test("a frase sobre cacau e achocolatado é permitida onde aparecer", () => {
  const conteudo = html + main + JSON.stringify(config);
  assert.doesNotMatch(conteudo, /premium|melhor|saudável|conservante|aditivo|natural|orgânico|solúvel/i);
  assert.doesNotMatch(conteudo.replace(/cacau 100%, não achocolatado[.,]/gi, ""), /achocolatado/i);
});

test("avisos ficam visíveis e só ingredientes ficam em details fechado nos dois cards", () => {
  const comAcucar = config.produtos.find((produto) => produto.id === "com-acucar");
  const semAcucar = config.produtos.find((produto) => produto.id === "sem-acucar");
  assert.equal(comAcucar.ingredientes,
    "Leite em pó integral, bicarbonato de sódio, canela em pó, cacau 100%, açúcar refinado e café Conilon.");
  assert.equal(comAcucar.avisos, "Contém leite e derivados. Não contém glúten.");
  assert.equal(semAcucar.ingredientes,
    "Leite em pó integral, bicarbonato de sódio, canela em pó, cacau 100% e café Conilon.");
  assert.equal(semAcucar.avisos, "Contém leite e derivados. Não contém glúten.");
  assert.equal(config.textos.produtos.ingredientesTitulo, "Ingredientes");
  assert.equal(config.textos.produtos.ingredientesRotulo, "Ingredientes: ");
  assert.doesNotMatch(main, /Ingredientes: |Ingredientes e avisos/);

  const inicio = main.indexOf("function configurarAbas(");
  const fim = main.indexOf("function montarCalculadora()", inicio);
  assert.ok(inicio >= 0 && fim > inicio);
  const montarProdutos = new Function("document", "config", "formatarReais", "produtosVisiveis", "indiceDaAba",
    `${main.slice(inicio, fim)}; montarProdutos();`);
  const renderizar = (produto) => {
    const grade = { children: [], appendChild(node) { this.children.push(node); } };
    const document = {
      querySelector: () => grade,
      getElementById: () => ({ appendChild() {} }),
      createElement: (tagName) => ({
        tagName, children: [],
        setAttribute(nome, valor) { this[nome] = valor; },
        addEventListener() {},
        appendChild(node) { this.children.push(node); },
        append(...nodes) { this.children.push(...nodes); },
      }),
    };
    montarProdutos(document, { ...config, produtos: [produto] }, () => "", produtosVisiveis, indiceDaAba);
    return grade.children[0].children[1].children;
  };
  for (const produto of [comAcucar, semAcucar]) {
    const corpo = renderizar(produto);
    const avisos = corpo.find((node) => node.className === "product-warnings");
    const detalhes = corpo.find((node) => node.tagName === "details");
    assert.equal(corpo[4], avisos, "aviso deve vir logo depois do peso");
    assert.equal(corpo[5], detalhes, "ingredientes devem vir depois do aviso");
    assert.equal(avisos.textContent, produto.avisos);
    assert.equal(detalhes.className, "product-details");
    assert.equal(detalhes.open, undefined);
    assert.equal(detalhes.children[0].tagName, "summary");
    assert.equal(detalhes.children[0].textContent, config.textos.produtos.ingredientesTitulo);
    assert.equal(detalhes.children[1].textContent,
      `${config.textos.produtos.ingredientesRotulo}${produto.ingredientes}`);
    assert.equal(detalhes.children.length, 2, "aviso não deve ficar dentro de details");
  }
  const semIngredientes = renderizar({ ...semAcucar, ingredientes: "" });
  assert.ok(!semIngredientes.some((node) => node.tagName === "details"));
  assert.ok(semIngredientes.some((node) => node.className === "product-warnings"));
  const semAvisos = renderizar({ ...semAcucar, avisos: "" });
  assert.ok(!semAvisos.some((node) => node.className === "product-warnings"));
  assert.ok(semAvisos.some((node) => node.tagName === "details"));
});
