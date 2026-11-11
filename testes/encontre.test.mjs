import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { agruparLocais, linkDoLocal, mapaValido } from "../encontre/encontre.js";
import { encontre } from "../encontre/locais.js";

const pasta = new URL("../encontre/", import.meta.url);
const arquivos = (diretorio) => readdirSync(diretorio, { withFileTypes: true })
  .flatMap(item => item.isDirectory() ? arquivos(new URL(`${item.name}/`, diretorio)) : [new URL(item.name, diretorio)]);
const fontes = arquivos(pasta).map(url => [url, readFileSync(url, "utf8")]);
const html = readFileSync(new URL("index.html", pasta), "utf8");

test("G9-1: montagem segura e somente os endereços externos autorizados", () => {
  for (const [url, fonte] of fontes) {
    assert.doesNotMatch(fonte, /\b(?:innerHTML|outerHTML|eval)\b|document\s*\.\s*write/, url.pathname);
    for (const [endereco] of fonte.matchAll(/https?:\/\/[^\s"'`<>)]*/g)) {
      assert.match(endereco, /^https:\/\/www\.google\.com\/maps\/|^https:\/\/cheirodasaguasgourmet\.com\.br\/|^https?:\/\/www\.w3\.org(?:\/|$)/);
    }
    assert.doesNotMatch(fonte, /<script\b[^>]*\bsrc=["'](?:https?:)?\/\//i);
  }
  // Dados reais desde 11/11/2026 (autorizados por Daniel): confere o formato, não os exemplos.
  assert.ok(encontre.mapa.url === "" || encontre.mapa.url.startsWith("https://www.google.com/maps/d/embed"));
  assert.ok(encontre.locais.length > 0);
  for (const local of encontre.locais) {
    for (const campo of ["nome", "cidade", "bairro", "endereco"]) assert.ok(local[campo]?.trim(), `${local.nome}: ${campo}`);
    assert.ok(local.modalidades.length > 0 && local.modalidades.every(m => m in encontre.etiquetas), local.nome);
    assert.equal(typeof local.exemplo, "boolean");
  }
});

test("G9-2: referências locais existem e ../ se limita aos caminhos permitidos", () => {
  const validar = (referencia, origem) => {
    if (/^https?:\/\//.test(referencia) || referencia.startsWith("#")) return;
    if (referencia.includes("../")) {
      assert.match(referencia, /^\.\.\/(?:css\/fontes\/[^/]+|img\/logo\.webp|index\.html)?$/);
    }
    assert.ok(existsSync(new URL(referencia, origem)), `${origem.pathname}: ${referencia}`);
  };
  for (const [url, fonte] of fontes) {
    for (const [, referencia] of fonte.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/g)) validar(referencia, url);
    for (const [, referencia] of fonte.matchAll(/url\(["']?([^"')]+)["']?\)/g)) validar(referencia, url);
    for (const [, referencia] of fonte.matchAll(/\bfrom\s*["']([^"']+)["']/g)) validar(referencia, url);
    for (const [, referencia] of fonte.matchAll(/["']([^"']*\.\.\/[^"']*)["']/g)) validar(referencia, url);
  }
});

test("G9-3: agrupa e ordena cidades, bairros e nomes sem alterar os dados", () => {
  const locais = [
    { cidade: "Vitória", bairro: "Centro", nome: "Z Exemplo", ativo: true },
    { cidade: "Vila Velha", bairro: "Praia da Costa", nome: "B Exemplo", ativo: true },
    { cidade: "Vila Velha", bairro: "Itapuã", nome: "Á Exemplo", ativo: true },
    { cidade: "Vitória", bairro: "Centro", nome: "Á Exemplo", ativo: true },
    { cidade: "Vitória", bairro: "Bento Ferreira", nome: "C Exemplo", ativo: true },
    { cidade: "A", bairro: "A", nome: "Inativo", ativo: false },
    { cidade: "A", bairro: "A", nome: "Sem ativação" },
  ];
  const antes = structuredClone(locais);
  assert.deepEqual(agruparLocais(locais), [
    { cidade: "Vila Velha", bairros: [
      { bairro: "Itapuã", locais: [locais[2]] },
      { bairro: "Praia da Costa", locais: [locais[1]] },
    ] },
    { cidade: "Vitória", bairros: [
      { bairro: "Bento Ferreira", locais: [locais[4]] },
      { bairro: "Centro", locais: [locais[3], locais[0]] },
    ] },
  ]);
  assert.deepEqual(locais, antes);
  assert.deepEqual(agruparLocais([]), []);
  assert.deepEqual(agruparLocais([{ ativo: false }]), []);
});

test("G9-4: link explícito prevalece e busca codifica acentos, vírgulas e &", () => {
  const local = { nome: "Café Exemplo & Cia", endereco: "Rua São João, 100", bairro: "Itapuã", cidade: "Vitória", mapa: "" };
  const consulta = "Café Exemplo & Cia, Rua São João, 100, Itapuã, Vitória";
  const resultado = linkDoLocal(local);
  assert.equal(resultado, "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(consulta));
  assert.equal(new URL(resultado).searchParams.get("query"), consulta);
  assert.equal(linkDoLocal({ ...local, mapa: "https://www.google.com/maps/search/?api=1&query=exemplo" }), "https://www.google.com/maps/search/?api=1&query=exemplo");
});

test("G9-5: iframe aceita somente o prefixo aprovado do Google My Maps", () => {
  assert.equal(mapaValido("https://www.google.com/maps/d/embed?mid=exemplo"), true);
  assert.equal(mapaValido("https://www.google.com/maps/d/embed"), true);
  for (const url of ["", null, undefined, 123, "http://www.google.com/maps/d/embed", "https://www.google.com/maps/search/?api=1", "https://example.com/", "//www.google.com/maps/d/embed", " https://www.google.com/maps/d/embed", "https://example.com/?url=https://www.google.com/maps/d/embed"]) {
    assert.equal(mapaValido(url), false, String(url));
  }
});

test("G9-6: HTML em português, noindex, título principal e alternativa sem JS", () => {
  assert.match(html, /<html\s+lang="pt-BR"/);
  assert.match(html, /<meta\s+name="robots"\s+content="noindex"\s*\/?\s*>/);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
  assert.match(html, /<h1\s+id="titulo"/);
  assert.match(html, /<title>Onde encontrar \| Cheiro das Águas<\/title>/);
  assert.match(html, /<link\s+rel="canonical"\s+href="https:\/\/cheirodasaguasgourmet\.com\.br\/encontre\/"/);
  const noscript = html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1];
  assert.ok(noscript?.includes(encontre.semJs));
  assert.ok(noscript.includes(encontre.voltar));
  assert.match(noscript, /href="\.\.\/index\.html"/);
  assert.match(html, /<script\s+type="module"\s+src="encontre\.js"/);
});
