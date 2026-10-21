import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { test } from "node:test";
import { config } from "../js/config.js";

const root = new URL("../", import.meta.url);
const html = await readFile(new URL("index.html", root), "utf8");

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
  const secoes = ['id="produtos"', 'id="porque"', 'id="padarias"', 'id="preparo"', 'id="como"', 'id="faq"', 'id="contato"'];
  const posicoes = secoes.map((id) => html.indexOf(id));
  assert.ok(posicoes.every((posicao) => posicao >= 0));
  assert.deepEqual(posicoes, [...posicoes].sort((a, b) => a - b));
  for (const id of ["produtos", "porque", "padarias", "como", "faq", "contato"]) {
    assert.match(html, new RegExp(`href="#${id}"`));
  }
  assert.match(html, /id="pedir-degustacao" href="#contato"/);
  assert.match(html, /id="floating-whatsapp" href="#contato"/);
});
