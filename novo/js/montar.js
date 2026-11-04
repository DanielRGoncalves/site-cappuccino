import { textos as t, config as q } from "./textos.js";
import { montarConta } from "./conta.js";
const NS = "http://www.w3.org/2000/svg";
export function el(tag, props = {}, ...filhos) {
  const no = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === "class") no.className = v;
    else if (k === "text") no.textContent = v;
    else no.setAttribute(k, v === true ? "" : v);
  }
  no.append(...filhos.flat(Infinity).filter((f) => f !== null && f !== undefined && f !== false));
  return no;
}
export function svg(tag, props = {}, ...filhos) {
  const no = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(props)) no.setAttribute(k, v);
  no.append(...filhos);
  return no;
}
const $ = (id) => document.getElementById(id);
const d = (nome, largura, altura, classe = "") =>
  el("img", {
    class: `desenho ${classe}`,
    src: `desenhos/${nome}.svg`,
    alt: "",
    width: largura,
    height: altura,
    "aria-hidden": "true",
    loading: "lazy",
  });
function seta() {
  return svg(
    "svg",
    { class: "seta", viewBox: "0 0 24 12", "aria-hidden": "true", focusable: "false" },
    svg("path", { d: "M1 6h20M15 1l6 5-6 5" }),
  );
}
function p(texto, href, classe = "") {
  const fora = href.startsWith("http");
  return el(
    "a",
    { class: `pilula ${classe}`, href, target: fora ? "_blank" : null, rel: fora ? "noopener" : null },
    el("span", { text: texto }),
  );
}
export function letreiro(texto, classe) {
  const caixa = el("div", { class: classe, role: "img", "aria-label": texto });
  texto.split(" ").forEach((palavra, i) => {
    if (i) caixa.append(" ");
    const grupo = el("span", { class: "palavra", "aria-hidden": "true" });
    for (const letra of palavra) grupo.append(el("span", { class: "letra", text: letra }));
    caixa.append(grupo);
  });
  return caixa;
}
function an() {
  const trilho = el(
    "p",
    { class: "anuncio-texto" },
    t.anuncio.map((t, i) => [
      i ? el("span", { class: "ponto", "aria-hidden": "true", text: "✳" }) : null,
      el("span", { text: t }),
    ]),
  );
  $("anuncio").append(trilho);
}
function tp() {
  const menu = el(
    "button",
    {
      class: "pilula pilula-linha botao-menu",
      type: "button",
      "aria-expanded": "false",
      "aria-controls": "menu",
      id: "botao-menu",
    },
    el("span", { text: t.menu }),
  );
  const marca = el("a", { class: "topo-marca", href: "#cena", "aria-label": t.marca }, el("span", { text: t.marca }));
  const acao = p(t.degustacaoCurta, t.whatsappDegustacao, "pilula-ouro topo-acao");
  $("topo").append(menu, marca, acao);
}
function tr() {
  const bico = svg(
    "svg",
    { class: "torneira-bico", viewBox: "0 0 120 110", "aria-hidden": "true", focusable: "false" },
    svg("path", { class: "registro", d: "M44 40 V24" }),
    svg("rect", { class: "peca", x: 28, y: 14, width: 32, height: 12, rx: 6 }),
    svg("path", { class: "peca", d: "M0 40 H74 Q102 40 102 68 V84 H78 V70 Q78 62 70 62 H0 Z" }),
    svg("rect", { class: "peca", x: 73, y: 82, width: 34, height: 12, rx: 5 }),
    svg("path", { class: "brilho", d: "M10 48 H62 Q82 48 88 60" }),
  );
  return el(
    "div",
    { class: "torneira", id: "torneira", "aria-hidden": "true" },
    d("02", 136, 175, "torneira-fruto"),
    bico,
    el("span", { class: "bico-ponta", id: "bico-ponta" }),
    el("span", { class: "plim plim-1", text: t.plim }),
    el("span", { class: "plim plim-2", text: t.plim }),
  );
}
function cena() {
  const [a, b] = t.titulo;
  const titulo = el(
    "h2",
    { class: "cena-titulo", id: "titulo" },
    el("span", { class: "titulo-a", text: a }),
    " ",
    el("span", { class: "titulo-b", text: b }),
  );
  const paradas = el(
    "div",
    { class: "paradas" },
    t.paradas.map((p, i) =>
      el(
        "figure",
        { class: `parada ${i % 2 ? "lado-esq" : "lado-dir"}` },
        d(p.desenho, p.largura, p.altura, `parada-desenho d${p.desenho}`),
        el("figcaption", {}, el("h3", { class: "rotulo", text: p.titulo }), el("p", { text: p.texto })),
      ),
    ),
  );
  const marca = el(
    "div",
    { class: "marca-bloco", id: "marca-bloco" },
    letreiro(t.marca, "marca"),
    el("p", { class: "marca-apoio", text: t.apoio }),
  );
  $("cena").append(
    el("span", { class: "corredor", id: "corredor", "aria-hidden": "true" }),
    el("div", { class: "cena-topo" }, tr(), titulo),
    paradas,
    marca,
  );
}
function pr() {
  const visiveis = q.produtos.filter((p) => p.exibir);
  const cartao = (p) =>
    el(
      "article",
      { class: "produto" },
      el(
        "div",
        { class: "produto-foto" },
        el("img", {
          src: `../${p.foto}`,
          srcset: `../${p.fotoPequena} 400w, ../${p.foto} 800w`,
          sizes: "(min-width: 920px) 30vw, 90vw",
          alt: p.alt,
          width: 800,
          height: 800,
          loading: "lazy",
        }),
        el("span", { class: "etiqueta", text: p.selo }),
        el("span", { class: "produto-peso", text: p.peso }),
      ),
      el("p", { class: "produto-meta" }, el("span", { text: t.produtos.rende }), el("span", { text: p.peso })),
      el("h3", { class: "produto-nome", text: p.nome }),
      el("p", { class: "produto-frase", text: p.frase }),
      el(
        "details",
        { class: "produto-ingredientes" },
        el("summary", { text: t.produtos.ingredientes }),
        el("p", { text: p.ingredientes }),
        el("p", { text: p.avisos }),
      ),
    );
  $("produtos").append(
    el("h2", { class: "sr", id: "titulo-produtos", text: t.produtos.titulo }),
    el("div", { class: "produtos-grade" }, visiveis.map(cartao)),
    el("p", { class: "produtos-igual", text: t.produtos.igual }),
    el(
      "a",
      { class: "botao-grande", href: t.whatsappDegustacao, target: "_blank", rel: "noopener" },
      el("span", { text: t.botao }),
      seta(),
    ),
  );
}
function faixa() {
  const grupo = (oculto) =>
    el(
      "span",
      { class: "faixa-grupo", "aria-hidden": oculto ? "true" : null },
      t.faixa.map((t) => [el("span", { text: t }), el("span", { class: "faixa-gota", "aria-hidden": "true" })]),
    );
  const pausa = el(
    "button",
    { class: "pilula pilula-linha pausar", type: "button", id: "pausar", "aria-pressed": "false" },
    el("span", { text: t.pausar }),
  );
  $("faixa").append(
    el(
      "div",
      { class: "faixa-janela" },
      el("div", { class: "faixa-trilho" }, grupo(false), grupo(true), grupo(true), grupo(true)),
    ),
    pausa,
  );
}
function vd(reduzido) {
  const v = t.vender;
  const cartoes = el(
    "div",
    { class: "vender-cartoes", id: "vender-cartoes" },
    v.cartoes.map((c, i) => {
      const foto = v.fotos[i];
      return el(
        "article",
        { class: "venda-cartao", "aria-labelledby": `titulo-venda-${i}` },
        el(
          "div",
          { class: "venda-texto" },
          el("p", { class: "rotulo", "aria-hidden": "true", text: `${i + 1} / 2` }),
          el("h3", { id: `titulo-venda-${i}`, text: c.titulo }),
          el("p", { class: "vender-frase", text: c.frase }),
          el(
            "ul",
            {},
            c.lista.map((item) => el("li", { text: item })),
          ),
          el(
            "div",
            { class: "arco venda-foto" },
            el("img", {
              src: `../${foto.foto}`,
              alt: foto.alt,
              width: foto.largura,
              height: foto.altura,
              loading: "lazy",
            }),
          ),
        ),
        montarConta(i === 1, reduzido),
      );
    }),
  );
  $("vender").append(
    el("h2", { class: "secao-titulo", id: "titulo-vender", text: v.titulo }),
    el("p", { class: "vender-entrada", text: v.entrada }),
    cartoes,
    el("div", { class: "vender-botoes" }, p(t.botao, t.whatsappDegustacao, "pilula-ouro pilula-grande")),
  );
}
function palco() {
  const h = t.hero,
    o = t.origem;
  const foto = (dados, classe, primeira, srcset, sizes) =>
    el("img", {
      class: classe,
      src: `../${dados.foto}`,
      srcset,
      sizes,
      alt: dados.alt,
      width: dados.largura,
      height: dados.altura,
      loading: primeira ? null : "lazy",
      decoding: "async",
    });
  const srcOrigem = `../${o.foto.foto} 720w, ${o.grande} 1440w`;
  $("inicio").append(
    el("div", { class: "arco foto-estatica" }, foto(h.foto, "", true)),
    el(
      "div",
      { class: "conteudo" },
      el("h1", { id: "titulo-hero", tabindex: "-1", text: h.titulo }),
      el("p", { class: "ato-entrada", text: h.apoio }),
      el(
        "div",
        { class: "ato-botoes" },
        p(h.degustacao, t.whatsappDegustacao, "pilula-ouro pilula-grande"),
        p(h.verFormas, "#vender", "pilula-grande pilula-vazada"),
      ),
    ),
  );
  $("origem").append(
    el(
      "div",
      { class: "arco foto-estatica" },
      foto(o.foto, "", false, srcOrigem, "(max-width: 919px) min(88vw, 430px), min(440px, 36vw)"),
    ),
    el(
      "div",
      { class: "conteudo" },
      el("h2", { id: "titulo-origem", tabindex: "-1", text: o.titulo }),
      el("p", { class: "ato-entrada", text: o.texto }),
    ),
  );
  const fh = foto(h.foto, "foto-hero", true),
    fo = foto(o.foto, "foto-origem", false, srcOrigem, "(max-width: 919px) 88vw, 46vw");
  fh.alt = "";
  fo.alt = "";
  $("arco").append(fh, fo);
}
function pp() {
  const p = t.preparo;
  $("preparo").append(
    el("h2", { class: "secao-titulo", id: "titulo-preparo", text: p.titulo }),
    el(
      "ol",
      { class: "preparo-grade" },
      p.passos.map((passo, i) =>
        el(
          "li",
          { class: `preparo-passo passo-${i + 1}` },
          el(
            "div",
            { class: "preparo-moldura" },
            el(
              "div",
              { class: "preparo-foto" },
              el("img", {
                src: `../${passo.foto}`,
                alt: passo.alt,
                width: passo.largura,
                height: passo.altura,
                loading: "lazy",
              }),
            ),
          ),
          el(
            "div",
            { class: "preparo-texto" },
            el("span", { class: "preparo-numero", "aria-hidden": "true", text: String(i + 1).padStart(2, "0") }),
            el("h3", {}, el("span", { class: "sr", text: `${t.passo} ${i + 1}: ` }), passo.titulo),
            el("p", { text: passo.descricao }),
          ),
        ),
      ),
    ),
    el("p", { class: "preparo-nota" }, el("span", { text: p.dica }), " ", el("span", { text: p.rendimento })),
  );
}
function como() {
  const c = t.como;
  $("como").append(
    el("h2", { class: "secao-titulo", id: "titulo-como", text: c.titulo }),
    el(
      "ol",
      { class: "como-lista" },
      c.passos.map((passo) => {
        const [, numero, resto] = passo.match(/^(\d+)\.\s*(.*)$/) || [null, "", passo];
        return el(
          "li",
          {},
          el("span", { class: "como-numero", "aria-hidden": "true", text: numero }),
          el("p", { text: resto }),
        );
      }),
    ),
  );
}
function duvidas() {
  const f = t.faq;
  $("duvidas").append(
    el("h2", { class: "secao-titulo", id: "titulo-duvidas", text: f.titulo }),
    el(
      "div",
      { class: "duvidas-lista" },
      f.itens.map((item) =>
        el(
          "details",
          {},
          el("summary", {}, el("span", { text: item.pergunta }), el("span", { class: "mais", "aria-hidden": "true" })),
          el("p", { text: item.resposta }),
        ),
      ),
    ),
  );
}
function ct() {
  const c = t.contato;
  $("contato").append(
    el(
      "div",
      { class: "contato-grade" },
      el(
        "div",
        { class: "contato-texto" },
        el("h2", { id: "titulo-contato", text: c.titulo }),
        el("p", { class: "contato-frase", text: c.texto }),
        el(
          "div",
          { class: "contato-botoes" },
          p(c.whatsapp, t.whatsappGeral, "pilula-ouro"),
          p(c.instagram.usuario, c.instagram.url, "pilula-linha-clara"),
        ),
        el(
          "dl",
          { class: "contato-notas" },
          el("div", {}, el("dt", { text: c.entregaTitulo }), el("dd", { text: c.entrega })),
          el("div", {}, el("dt", { text: c.pagamentoTitulo }), el("dd", { text: c.pagamento })),
        ),
      ),
      el(
        "div",
        { class: "contato-foto" },
        el("img", {
          src: q.textos.pagina.contato.foto,
          srcset: `${q.textos.pagina.contato.fotoPequena} 600w, ${q.textos.pagina.contato.foto} 1200w`,
          sizes: "(min-width: 920px) 40vw, 90vw",
          alt: c.alt,
          width: 1200,
          height: 1600,
          loading: "lazy",
        }),
      ),
    ),
    letreiro(t.marca, "rodape-marca"),
    el(
      "div",
      { class: "rodape-linha" },
      el("p", { text: `${c.legal.razaoSocial} · ${c.cnpj} ${c.legal.cnpj}` }),
      el("p", { text: c.legal.endereco }),
    ),
  );
}
function mn() {
  const painel = el(
    "nav",
    { class: "menu-painel", "aria-label": t.navegacao },
    el(
      "ul",
      {},
      t.links.map((l) => el("li", {}, el("a", { href: l.href, text: l.texto }))),
    ),
    el(
      "a",
      { class: "pilula pilula-ouro", href: t.whatsappDegustacao, target: "_blank", rel: "noopener" },
      el("span", { text: t.botao }),
    ),
  );
  $("menu").append(painel, d("10", 304, 439, "menu-arte"));
}
export function montar(reduzido) {
  document.querySelector(".pular").textContent = t.pular;
  $("faixa").setAttribute("aria-label", t.destaques);
  an();
  tp();
  palco();
  cena();
  pr();
  faixa();
  vd(reduzido);
  pp();
  como();
  duvidas();
  ct();
  mn();
}
