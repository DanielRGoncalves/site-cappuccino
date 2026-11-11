import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { agruparLocais, apresentacaoDoTitulo, dadosDaIlustracao, linkDoLocal, mapaValido } from "../encontre/encontre.js";
import { encontre } from "../encontre/locais.js";

const pasta = new URL("../encontre/", import.meta.url);
const arquivos = (diretorio) => readdirSync(diretorio, { withFileTypes: true })
  .flatMap(item => item.isDirectory() ? arquivos(new URL(`${item.name}/`, diretorio)) : [new URL(item.name, diretorio)]);
const fontes = arquivos(pasta).map(url => [url, readFileSync(url, "utf8")]);
const html = readFileSync(new URL("index.html", pasta), "utf8");

test("G9-1: montagem segura e somente os endereços externos autorizados", () => {
  for (const [url, fonte] of fontes) {
    assert.doesNotMatch(fonte, /\b(?:innerHTML|outerHTML|eval)\b|document\s*\.\s*write/, url.pathname);
    // O namespace C2PA do desenho não carrega recurso externo; links continuam na mesma lista permitida.
    const recursos = /\/(?:mae|galho)\.svg$/.test(url.pathname)
      ? fonte.replace('xmlns:c2pa="http://c2pa.org/manifest"', "") : fonte;
    for (const [endereco] of recursos.matchAll(/https?:\/\/[^\s"'`<>)]*/g)) {
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
      // G10: somente estas duas cópias locais de GSAP foram liberadas.
      assert.match(referencia, /^\.\.\/(?:css\/fontes\/[^/]+|img\/logo\.webp|index\.html|vendor\/(?:gsap|MorphSVGPlugin)\.min\.js)?$/);
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
    { estado: "ES", cidade: "Vitória", bairro: "Centro", nome: "Z Exemplo", ativo: true },
    { estado: "ES", cidade: "Vila Velha", bairro: "Praia da Costa", nome: "B Exemplo", ativo: true },
    { estado: "ES", cidade: "Vila Velha", bairro: "Itapuã", nome: "Á Exemplo", ativo: true },
    { estado: "ES", cidade: "Vitória", bairro: "Centro", nome: "Á Exemplo", ativo: true },
    { estado: "ES", cidade: "Vitória", bairro: "Bento Ferreira", nome: "C Exemplo", ativo: true },
    { estado: "ES", cidade: "A", bairro: "A", nome: "Inativo", ativo: false },
    { estado: "ES", cidade: "A", bairro: "A", nome: "Sem ativação" },
  ];
  const antes = structuredClone(locais);
  assert.deepEqual(agruparLocais(locais), [
    { estado: "ES", nome: "Espírito Santo", locais: [locais[2], locais[1], locais[4], locais[3], locais[0]] },
  ]);
  assert.deepEqual(locais, antes);
  assert.deepEqual(agruparLocais([]), []);
  assert.deepEqual(agruparLocais([{ ativo: false }]), []);
});

test("G10-1: agrupa ES antes de MG, ordena cidade, bairro, nome e valida os estados ativos", () => {
  const locais = [
    { estado: "MG", cidade: "Manhuaçu", bairro: "Centro", nome: "Café", ativo: true },
    { estado: "ES", cidade: "Vitória", bairro: "Centro", nome: "Café", ativo: true },
    { estado: "ES", cidade: "Vila Velha", bairro: "Itapuã", nome: "Z", ativo: true },
    { estado: "ES", cidade: "Vila Velha", bairro: "Centro", nome: "Z", ativo: true },
    { estado: "ES", cidade: "Vila Velha", bairro: "Centro", nome: "Á", ativo: true },
    { estado: "MG", cidade: "A", bairro: "A", nome: "Inativo", ativo: false },
  ];
  const antes = structuredClone(locais);
  const grupos = agruparLocais(locais, { MG: "Minas Gerais", ES: "Espírito Santo" });
  assert.deepEqual(grupos.map(grupo => grupo.estado), ["ES", "MG"]);
  assert.deepEqual(grupos[0].locais, [locais[4], locais[3], locais[2], locais[1]]);
  assert.deepEqual(grupos[1].locais, [locais[0]]);
  assert.deepEqual(locais, antes);
  for (const local of encontre.locais.filter(local => local.ativo === true)) {
    assert.ok(Object.hasOwn(encontre.estados, local.estado), `${local.nome}: estado existente`);
  }
  assert.deepEqual(agruparLocais([]), []);
});

test("G10-2: ilustração vazia não monta imagem nem reserva espaço", () => {
  for (const dados of [undefined, {}, { src: "" }, { src: "   ", alt: "Teste" }]) {
    assert.equal(dadosDaIlustracao(dados), null);
  }
  assert.deepEqual(dadosDaIlustracao({ src: "personagem.webp", alt: "Personagem" }), { src: "personagem.webp", alt: "Personagem" });
});

test("G10-3: saídas do Claude ficam ignoradas", () => {
  const ignorados = readFileSync(new URL("../.gitignore", import.meta.url), "utf8");
  assert.ok(ignorados.split(/\r?\n/).includes("Claude outputs/"));
});

test("G10/G12: JS próprio respeita 14.000 bytes e fallback preserva desenho e alfinete finais", () => {
  const bytes = fontes.filter(([url]) => url.pathname.endsWith(".js"))
    .reduce((soma, [, fonte]) => soma + Buffer.byteLength(fonte), 0);
  assert.ok(bytes <= 14_000, `${bytes} bytes`);
  const imagem = html.match(/<img\b[^>]*class="ilustracao"[^>]*>/)?.[0];
  assert.ok(imagem?.includes(`src="${encontre.ilustracao.src}"`));
  assert.match(imagem, /width="1230" height="742" alt=""/);
  assert.equal(encontre.ilustracao.alt, "");
  assert.ok(html.includes(encontre.texto));
  const fallback = html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1];
  assert.ok(fallback?.includes(encontre.mapa.url.replaceAll("&", "&amp;")));
  assert.ok(fallback.includes(encontre.mapa.titulo));
  assert.match(fallback, /class="camada-gota" aria-hidden="true"/);
  const alfinete = readFileSync(new URL("movimento.js", pasta), "utf8").match(/const alfinete = "([^"]+)"/)[1];
  assert.ok(fallback.includes(`d="${alfinete}"`));
});

test("G11-1/G12: um único h1 visível com escorridos, sem marca grande", () => {
  assert.doesNotMatch(html, /id=["']marca["']|\bmarca-grande\b/);
  assert.equal([...html.matchAll(/class="derretido"/g)].length, 5);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
});

test("G11-2/G12: título sempre visível e ilustração decorativa, sem DOM", () => {
  const ilustracao = { src: "galho.svg", alt: "Não repetir o título" };
  assert.deepEqual(apresentacaoDoTitulo(ilustracao), {
    classe: "", ilustracao: { src: "galho.svg", alt: "" },
  });
  assert.equal(ilustracao.alt, "Não repetir o título");
  for (const dados of [undefined, {}, { src: "" }, { src: "   " }]) {
    assert.deepEqual(apresentacaoDoTitulo(dados), { classe: "", ilustracao: null });
  }
});

test("G12-1: CSS usa Fraunces local, sem fontes de sistema", () => {
  for (const [url, fonte] of fontes.filter(([url]) => url.pathname.endsWith(".css"))) {
    assert.doesNotMatch(fonte, /system-ui|Arial|Roboto|Segoe UI|sans-serif/i, url.pathname);
    assert.match(fonte, /font-family:\s*Fraunces/);
    assert.match(fonte, /font-variation-settings:\s*"wght" 750, "SOFT" 100, "opsz" 144/);
  }
});

test("G12-2: galho existente, decorativo; mãe preservada e h1 sem classe de leitor", () => {
  assert.equal(encontre.ilustracao.src, "galho.svg");
  assert.ok(existsSync(new URL(encontre.ilustracao.src, pasta)));
  assert.ok(existsSync(new URL("mae.svg", pasta)));
  assert.equal(encontre.ilustracao.alt, "");
  assert.match(html, /<img[^>]+src="galho.svg"[^>]+alt=""[^>]+aria-hidden="true"/);
  assert.match(html, /<h1 id="titulo">/);
  assert.doesNotMatch(html, /somente-leitor/);
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
  const noscript = [...html.matchAll(/<noscript>([\s\S]*?)<\/noscript>/g)].map(([, conteudo]) => conteudo).join("\n");
  assert.ok(noscript?.includes(encontre.semJs));
  assert.ok(noscript.includes(encontre.voltar));
  assert.match(noscript, /href="\.\.\/index\.html"/);
  assert.match(html, /<script\s+type="module"\s+src="encontre\.js"/);
});
