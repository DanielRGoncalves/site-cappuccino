// Topo que troca com a rolagem (vindo do prototipo-descida): hero escuro → origem clara,
// com a foto em arco viajando e crescendo. Rolagem nativa; o scroll só agenda um quadro.
import { progressoDoCapitulo, faixa, escalaDoArco } from "./capitulo.js";

export function iniciarPalco(reduzido) {
  const $ = (id) => document.getElementById(id);
  const wrapper = $("capitulos"), palco = $("palco"), hero = $("inicio"), origem = $("origem"), topo = $("topo");
  let quadro = 0, geometria;

  function medir() {
    const w = document.documentElement.clientWidth;
    const h = palco.getBoundingClientRect().height;
    const celular = w < 920;
    const largura = celular ? Math.min(310, w * .58) : Math.min(440, w * .36);
    const altura = celular ? h * .23 : Math.min(h * .61, largura * 1.5);
    geometria = {
      largura, altura,
      x0: celular ? (w - largura) / 2 : w * .94 - largura,
      x1: w * .06,
      y0: celular ? 85 : Math.max(120, h * .16),
      y1: celular ? 76 : h * .12,
      larguraFinal: celular ? w * .88 : w * .46,
      alturaFinal: celular ? h * .45 : h * .76,
    };
    palco.style.setProperty("--arco-largura", `${geometria.larguraFinal}px`);
    palco.style.setProperty("--arco-altura", `${geometria.alturaFinal}px`);
    const foto = escalaDoArco(1, largura, altura, geometria.larguraFinal, geometria.alturaFinal);
    palco.style.setProperty("--foto-largura", `${foto.larguraFoto}px`);
    palco.style.setProperty("--foto-altura", `${foto.alturaFoto}px`);
  }

  function atualizar() {
    quadro = 0;
    if (reduzido.matches) return;
    const rect = wrapper.getBoundingClientRect();
    const p = progressoDoCapitulo(rect.top, rect.height, palco.getBoundingClientRect().height);
    const mover = faixa(p, 0, .7), g = geometria;
    const misturar = (a, b) => a + (b - a) * mover;
    const escala = escalaDoArco(mover, g.largura, g.altura, g.larguraFinal, g.alturaFinal);
    const fundo = faixa(p, .3, .55);
    const variaveis = {
      "--p": p,
      "--fundo": fundo,               // fundo escuro até o hero apagar
      "--sair": faixa(p, 0, .3),
      "--entrar": faixa(p, .55, .75),
      "--troca": faixa(p, .35, .55),
      "--arco-x": `${misturar(g.x0, g.x1)}px`,
      "--arco-y": `${misturar(g.y0, g.y1)}px`,
      "--arco-sx": escala.sx, "--arco-sy": escala.sy,
      "--foto-sx": escala.fotoSx, "--foto-sy": escala.fotoSy,
    };
    for (const [k, v] of Object.entries(variaveis)) palco.style.setProperty(k, v);
    hero.inert = p >= .3; origem.inert = p <= .55;
    hero.setAttribute("aria-hidden", String(p >= .3));
    origem.setAttribute("aria-hidden", String(p <= .55));
    // Topo transparente enquanto o palco ocupa a tela, com a cor acompanhando o fundo.
    topo.classList.toggle("sobre-palco", rect.bottom > topo.offsetHeight);
    topo.style.setProperty("--fundo", fundo);
  }
  const pedir = () => { if (!quadro && !reduzido.matches) quadro = requestAnimationFrame(atualizar); };

  function modo() {
    document.documentElement.classList.toggle("com-movimento", !reduzido.matches);
    if (reduzido.matches) {
      cancelAnimationFrame(quadro); quadro = 0;
      palco.removeAttribute("style");
      topo.classList.remove("sobre-palco");
      for (const ato of [hero, origem]) { ato.inert = false; ato.removeAttribute("aria-hidden"); }
    } else { medir(); atualizar(); }
  }

  addEventListener("scroll", pedir, { passive: true });
  addEventListener("resize", () => { if (!reduzido.matches) { medir(); pedir(); } }, { passive: true });
  reduzido.addEventListener("change", modo);
  modo();

  // "Origem" fica no fim da passagem do palco, não no topo da seção.
  return function irPara(hash) {
    if (hash === "#origem" && !reduzido.matches) {
      const r = wrapper.getBoundingClientRect();
      scrollTo({ top: scrollY + r.top + r.height - palco.getBoundingClientRect().height, behavior: "instant" });
      return true;
    }
    if (hash === "#inicio") { scrollTo({ top: 0, behavior: "instant" }); return true; }
    return false;
  };
}
