import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { test } from "node:test";
import { config } from "../js/config.js";

const root = new URL("../", import.meta.url);
const html = await readFile(new URL("index.html", root), "utf8");
const main = await readFile(new URL("js/main.js", root), "utf8");

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
  const secoes = ['id="diferenca"', 'id="produtos"', 'id="porque"', 'id="padarias"', 'id="preparo"', 'id="como"', 'id="faq"', 'id="contato"'];
  const posicoes = secoes.map((id) => html.indexOf(id));
  assert.ok(posicoes.every((posicao) => posicao >= 0));
  assert.deepEqual(posicoes, [...posicoes].sort((a, b) => a - b));
  const nav = html.match(/<nav class="nav"[\s\S]*?<\/nav>/)?.[0];
  assert.ok(nav);
  assert.deepEqual([...nav.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]),
    ["diferenca", "produtos", "porque", "padarias", "como", "faq", "contato"]);
  assert.deepEqual(config.textos.menu,
    ["Diferenciais", "Produtos", "Por que vender", "A conta", "Como funciona", "Dúvidas", "Contato"]);
  assert.match(html, /id="pedir-degustacao" href="#contato"/);
  assert.match(html, /id="floating-whatsapp" href="#contato"/);
});

test("os textos e a ordem da P7 vêm do config", () => {
  const textos = config.textos;
  assert.equal(textos.hero.subtitulo,
    "Artesanal e gourmet, feito à mão com café Conilon e cacau 100%. Pronto com água quente. Entregamos na Grande Vitória, sem taxa. Antes de qualquer venda, a degustação é gratuita.");
  assert.equal(textos.hero.degustacao, "Pedir degustação gratuita");
  assert.deepEqual(textos.diferenca, {
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
  assert.equal(config.meta.descricao,
    "Cheiro das Águas: cappuccino artesanal e gourmet, com café Conilon e cacau 100%, para padarias da Grande Vitória.");
  assert.doesNotMatch(html + main, /Feito à mão, do jeito simples|Pedir degustação gratuita|Ingredientes: Leite em pó integral/);
});

test("ingredientes e avisos vazios não geram linhas no card", () => {
  const comAcucar = config.produtos.find((produto) => produto.id === "com-acucar");
  const semAcucar = config.produtos.find((produto) => produto.id === "sem-acucar");
  assert.equal(comAcucar.ingredientes,
    "Leite em pó integral, bicarbonato de sódio, canela em pó, cacau 100%, açúcar refinado e café Conilon.");
  assert.equal(comAcucar.avisos, "Contém leite e derivados. Não contém glúten.");
  assert.equal(semAcucar.ingredientes, "");
  assert.equal(semAcucar.avisos, "");

  const inicio = main.indexOf("function montarProdutos() {");
  const fim = main.indexOf("function montarCalculadora()", inicio);
  assert.ok(inicio >= 0 && fim > inicio);
  const montarProdutos = new Function("document", "config", "formatarReais",
    `${main.slice(inicio, fim)}; montarProdutos();`);
  const renderizar = (produto) => {
    const grade = { children: [], appendChild(node) { this.children.push(node); } };
    const document = {
      querySelector: () => grade,
      createElement: (tagName) => ({
        tagName, children: [],
        appendChild(node) { this.children.push(node); },
        append(...nodes) { this.children.push(...nodes); },
      }),
    };
    montarProdutos(document, { ...config, produtos: [produto] }, () => "");
    return grade.children[0].children[1].children;
  };
  const classes = (nodes) => nodes.map((node) => node.className);
  const linhasCom = renderizar(comAcucar);
  assert.ok(classes(linhasCom).includes("product-ingredients"));
  assert.ok(classes(linhasCom).includes("product-warnings"));
  assert.equal(linhasCom.find((node) => node.className === "product-ingredients").textContent,
    `Ingredientes: ${comAcucar.ingredientes}`);
  assert.equal(linhasCom.find((node) => node.className === "product-warnings").textContent,
    comAcucar.avisos);
  assert.ok(!classes(renderizar(semAcucar)).includes("product-ingredients"));
  assert.ok(!classes(renderizar(semAcucar)).includes("product-warnings"));
  const linhasPreenchidas = renderizar({ ...semAcucar, ingredientes: "Ingrediente informado.", avisos: "Aviso informado." });
  assert.ok(classes(linhasPreenchidas).includes("product-ingredients"));
  assert.ok(classes(linhasPreenchidas).includes("product-warnings"));
});
