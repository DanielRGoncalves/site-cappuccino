const escorridos = [[0, .28, .19, .13], [2, .52, .32, .13], [4, .22, .24, .12], [7, .63, .42, .13], [12, .65, .6, .14], [13, .48, .28, .13]];
const alfinete = "M24 0C11 0 3 10 3 23C3 40 24 64 24 64C24 64 45 40 45 23C45 10 37 0 24 0ZM24 14C36 14 36 32 24 32C12 32 12 14 24 14Z";
const gota = "M24 0C24 0 8 31 8 44C8 70 40 70 40 44C40 31 24 0 24 0Z";

function svg(tag, atributos) {
  const no = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [chave, valor] of Object.entries(atributos)) no.setAttribute(chave, valor);
  return no;
}

export function montarLetreiro(marca, texto) {
  marca.replaceChildren();
  marca.setAttribute("aria-label", texto);
  const letras = [];
  for (const palavra of texto.split(" ")) {
    if (letras.length) marca.append(" ");
    const grupo = document.createElement("span");
    grupo.className = "palavra";
    grupo.setAttribute("aria-hidden", "true");
    for (const letra of palavra) {
      const no = document.createElement("span");
      no.className = "letra";
      no.textContent = letra;
      grupo.append(no);
      letras.push(no);
    }
    marca.append(grupo);
  }
  for (const [indice, posicao, h, w] of escorridos) {
    if (!letras[indice]) continue;
    const n = w * .18, b = w * .46;
    const caixa = svg("svg", { class: `derretido${h === .6 ? " origem-gota" : ""}`, viewBox: `-1 0 2 ${h}`, "aria-hidden": "true" });
    caixa.style.left = `${posicao * 100}%`;
    caixa.style.height = `${h}em`;
    caixa.append(svg("path", { d: `M${-w * .8} 0Q${-n} 0 ${-n} ${h * .4}C${-n} ${h * .65} ${-b} ${h * .68} ${-b} ${h - b}C${-b} ${h + b * .3} ${b} ${h + b * .3} ${b} ${h - b}C${b} ${h * .68} ${n} ${h * .65} ${n} ${h * .4}Q${n} 0 ${w * .8} 0Z` }));
    letras[indice].append(caixa);
  }
}

export function animarTopo(marca, mapa) {
  const { gsap, MorphSVGPlugin } = window;
  const fios = [...marca.querySelectorAll(".derretido path")];
  const origem = marca.querySelector(".origem-gota");
  const reduzir = matchMedia("(prefers-reduced-motion: reduce)");
  const pino = mapa.firstChild ? svg("svg", { class: "alfinete", viewBox: "0 0 48 64", "aria-hidden": "true" }) : null;
  const corpo = pino ? svg("path", { d: alfinete, "fill-rule": "evenodd" }) : null;
  if (pino) { pino.append(corpo); mapa.append(pino); }
  let tl, cancelado = false;
  function posicionar() {
    if (!pino || !origem) return;
    const r = origem.getBoundingClientRect(), m = mapa.getBoundingClientRect();
    pino.style.left = `${Math.max(24, Math.min(m.width - 24, r.left + r.width / 2 - m.left))}px`;
  }
  function finalizar() {
    tl?.kill();
    for (const fio of fios) fio.removeAttribute("transform");
    if (pino) {
      pino.style.transform = "";
      pino.style.opacity = "";
      corpo.setAttribute("d", alfinete);
    }
    marca.dataset.movimento = "final";
    posicionar();
  }
  document.fonts.ready.then(() => {
    if (cancelado) return;
    posicionar();
    if (reduzir.matches || !gsap || !MorphSVGPlugin) { finalizar(); return; }
    gsap.registerPlugin(MorphSVGPlugin);
    marca.dataset.movimento = "animando";
    tl = gsap.timeline({ onComplete: finalizar });
    tl.fromTo(fios, { scaleY: .05, svgOrigin: "0 0" }, { scaleY: 1, duration: 1.2, ease: "power2.inOut" }, 0);
    if (pino && origem) {
      const r = origem.getBoundingClientRect(), p = pino.getBoundingClientRect();
      const inicioY = r.bottom - p.bottom;
      tl.set(corpo, { attr: { d: gota } }, 0).set(pino, { opacity: 0 }, 0).set(pino, { opacity: 1 }, 1.2)
        .fromTo(pino, { y: inicioY, scale: .6, transformOrigin: "50% 100%" }, { y: 0, scale: 1, duration: .65, ease: "power2.in", immediateRender: true }, 1.2)
        .to(corpo, { morphSVG: alfinete, duration: .4, ease: "power2.out" }, 1.85);
    }
  });
  const ajustar = () => tl ? finalizar() : posicionar();
  window.addEventListener("resize", ajustar);
  reduzir.addEventListener("change", finalizar);
  return () => {
    cancelado = true;
    tl?.kill();
    window.removeEventListener("resize", ajustar);
    reduzir.removeEventListener("change", finalizar);
  };
}
