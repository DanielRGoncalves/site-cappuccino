const alfinete = "M24 0C11 0 3 10 3 23C3 40 24 64 24 64C24 64 45 40 45 23C45 10 37 0 24 0ZM24 14C36 14 36 32 24 32C12 32 12 14 24 14Z";
const formas = {
  semente: "M38 0C42 0 44 3 44 6C44 10 32 10 32 6C32 3 34 0 38 0Z",
  bulbo: "M38 0C42 0 43 25 53 39C77 77 1 77 23 39C33 25 34 0 38 0Z",
  pescoco: "M38 0C39 0 35 45 54 68C88 126 -12 126 22 68C41 45 37 0 38 0Z",
  gota: "M38 5C43 30 68 66 68 89C68 132 8 132 8 89C8 66 33 30 38 5Z",
};
const fiosEm = [[2,.79,.18,.11],[3,.48,.25,.11],[6,.79,.28,.12],[10,.48,.48,.13],[13,.26,.22,.11]];

function svg(tag, atributos) {
  const no = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [chave, valor] of Object.entries(atributos)) no.setAttribute(chave, valor);
  return no;
}

export function animarTopo(titulo, mapa) {
  const texto = titulo.textContent;
  titulo.replaceChildren();
  const letras = [], fios = [];
  for (const palavra of texto.split(" ")) {
    if (letras.length) { titulo.append(" "); letras.push(null); }
    const bloco = document.createElement("span");
    bloco.className = "palavra";
    for (const letra of palavra) {
      const no = document.createElement("span");
      no.className = "letra";
      no.textContent = letra;
      bloco.append(no);
      letras.push(no);
    }
    titulo.append(bloco);
  }
  for (const [i, x, h, w] of fiosEm) {
    if (!letras[i]) continue;
    const caixa = svg("svg", { class: "derretido", viewBox: `-1 0 2 ${h + w}`, "aria-hidden": "true", focusable: "false" });
    caixa.style.left = `${x * 100}%`;
    caixa.style.height = `${h + w}em`;
    const n = w * .18, b = w * .46;
    const fio = svg("path", { d: `M${-w * .8} 0Q${-n} 0 ${-n} ${h * .4}C${-n} ${h * .65} ${-b} ${h * .68} ${-b} ${h - b}C${-b} ${h + b * .3} ${b} ${h + b * .3} ${b} ${h - b}C${b} ${h * .68} ${n} ${h * .65} ${n} ${h * .4}Q${n} 0 ${w * .8} 0Z` });
    caixa.append(fio);
    letras[i].append(caixa);
    fios.push(fio);
  }
  const { gsap, MorphSVGPlugin: morph } = window;
  const menos = matchMedia("(prefers-reduced-motion: reduce)");
  const valido = !!mapa.querySelector("iframe");
  const capa = document.createElement("div");
  capa.className = "camada-gota";
  capa.setAttribute("aria-hidden", "true");
  const pino = svg("svg", { class: "alfinete", viewBox: "0 0 48 64" });
  const ponta = svg("path", { d: alfinete, "fill-rule": "evenodd" });
  pino.append(ponta);
  const gota = svg("svg", { class: "gota", viewBox: "0 0 76 126" });
  const corpo = svg("path", { d: formas.semente });
  gota.append(corpo);
  const sombra = document.createElement("div");
  sombra.className = "sombra";
  const spray = svg("svg", { class: "respingos" });
  const pingos = [-1, 0, 1].map(() => svg("circle", { r: 2, opacity: 0 }));
  spray.append(...pingos);
  capa.append(sombra, gota, spray, pino);
  if (valido) mapa.append(capa);
  let tl, saiu = false, feito = false;
  function medir() {
    const m = mapa.getBoundingClientRect();
    const r = fios[3]?.parentNode.getBoundingClientRect() || titulo.getBoundingClientRect();
    const em = parseFloat(getComputedStyle(titulo).fontSize);
    const x = r.left + r.width / 2 - m.left, y = r.top + em * .39 - m.top;
    for (const no of [pino, sombra, spray]) no.style.left = `${x}px`;
    gota.style.left = `${x - 13}px`;
    gota.style.top = `${y}px`;
    return -y - 43.105;
  }
  function fim() {
    feito = true;
    tl?.kill();
    for (const fio of fios) fio.style.transform = "scale(1)";
    if (fios[3]) fios[3].style.transform = "scaleY(.82)";
    pino.style.transform = "";
    ponta.setAttribute("d", alfinete);
    for (const no of [pino, sombra]) no.style.opacity = "1";
    gota.style.opacity = "0";
    pingos.forEach(p => p.setAttribute("opacity", 0));
    capa.dataset.movimento = "final";
    medir();
  }
  function iniciar() {
    if (saiu || feito) return;
    feito = true;
    const queda = medir();
    if (menos.matches || !gsap || !morph) { fim(); return; }
    gsap.registerPlugin(morph);
    capa.dataset.movimento = "animando";
    gsap.set(fios, { scaleY: 0, svgOrigin: "0 0" });
    gsap.set([pino, sombra, gota], { opacity: 0 });
    tl = gsap.timeline({ onComplete: fim });
    tl.to(fios, { scaleY: 1, duration: .9, ease: "sine.inOut", stagger: .025 }, .3);
    if (!valido) return;
    tl.set(gota, { opacity: 1 }, 1)
      .to(corpo, { morphSVG: formas.bulbo, duration: .23, ease: "sine.inOut" }, 1)
      .to(corpo, { morphSVG: formas.pescoco, duration: .16, ease: "sine.in" }, 1.23)
      .to(corpo, { morphSVG: formas.gota, duration: .11 }, 1.39)
      .to(fios[3], { scaleY: .82, duration: .18, ease: "sine.out" }, 1.5)
      .to(gota, { y: queda, scaleY: 1.25, scaleX: .85, duration: .52, ease: "power2.in" }, 1.5)
      .to(gota, { scaleY: .2, scaleX: 1.5, duration: .08, ease: "power2.out" }, 2.02)
      .set(gota, { opacity: 0 }, 2.1)
      .set(pino, { opacity: 1, scaleY: .18, scaleX: 1.1, transformOrigin: "50% 100%" }, 2.1)
      .fromTo(ponta, { morphSVG: formas.gota }, { morphSVG: alfinete, duration: .22, ease: "power2.out" }, 2.1)
      .to(pino, { scaleY: 1, scaleX: 1, duration: .4, ease: "back.out(1.5)" }, 2.1)
      .to(sombra, { opacity: 1, duration: .2 }, 2.1);
    pingos.forEach((p, i) => {
      tl.set(p, { attr: { cx: 0, cy: 0, opacity: 1 } }, 2.03)
        .to(p, { attr: { cx: (i - 1) * 19, cy: -14 - i * 3 }, duration: .13, ease: "power2.out" }, 2.03)
        .to(p, { attr: { cx: (i - 1) * 28, cy: 10, opacity: 0 }, duration: .23, ease: "power2.in" }, 2.16);
    });
  }
  const img = document.querySelector(".ilustracao");
  Promise.all([document.fonts.ready, img?.decode().catch(() => {})]).then(iniciar);
  const ajustar = () => feito ? fim() : medir();
  window.addEventListener("resize", ajustar);
  menos.addEventListener("change", fim);
  return () => {
    saiu = true;
    tl?.kill();
    window.removeEventListener("resize", ajustar);
    menos.removeEventListener("change", fim);
  };
}
