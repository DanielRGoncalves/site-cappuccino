// Cena da gota no estilo Graza: nasce na torneira, desce presa à tela enquanto a página sobe,
// encontra o nome e o derrete. Tudo ligado à rolagem (ida e volta), exceto o nascimento.
import { svg } from "./montar.js";

const ajustes = {
  linha: 0.3,            // altura da gota na tela enquanto desce (fração da janela)
  linhaCelular: 0.27,
  crescer: 0.3, pescoco: 0.2, soltar: 0.14, // nascimento (segundos)
  aproximar: 0.38,       // nos últimos 38% da tela a gota desliza até a letra
  esticarVelocidade: 3000, esticarMaximo: 0.32, // gota estica ao rolar rápido
  trechoFixo: 0.95,      // título preso por 95% da altura da tela
  completar: 0.68,       // derretido termina em 68% do trecho preso
  suavizar: 0.45,        // atraso da animação em relação à rolagem (s)
  hasteEm: 0.11, filtroEm: 0.033,
  // [letra, posição na letra (0 a 1), comprimento em em, largura em em]
  escorridos: [[0, .28, .19, .13], [2, .52, .42, .13], [4, .22, .24, .12], [6, .63, .32, .13], [7, .75, .56, .14], [10, .48, .6, .14], [12, .75, .48, .14]],
  achatar: 0.12, fundir: 0.12, derreter: 0.6, atrasoPorEm: 0.05, atrasoMaximo: 0.5,
  soltarAcimaEm: 0.45, esperaSoltar: 0.1, queda: 0.5, quedaEm: 0.5,
  respingos: [[3, -48, 105, 0], [5, 35, 155, .04], [8, -80, 190, .09], [4, 62, 125, .02], [6, 12, 215, .13]], gravidade: 420,
};

const formas = {
  semente: "M38 0C42 0 44 3 44 6C44 10 32 10 32 6C32 3 34 0 38 0Z",
  bulbo: "M38 0C42 0 43 25 53 39C77 77 1 77 23 39C33 25 34 0 38 0Z",
  pescoco: "M38 0C39 0 35 45 54 68C88 126 -12 126 22 68C41 45 37 0 38 0Z",
  gota: "M38 5C43 30 68 66 68 89C68 132 8 132 8 89C8 66 33 30 38 5Z",
};

const limitar = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const suave = (t) => t * t * (3 - 2 * t);

export function iniciarCena({ reduzido }) {
  const { gsap, ScrollTrigger, MorphSVGPlugin } = window;
  gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);
  const a = ajustes;
  const cena = document.getElementById("cena");
  const camada = document.getElementById("camada-gota");
  const bico = document.getElementById("bico-ponta");
  const corredor = document.getElementById("corredor");
  const bloco = document.getElementById("marca-bloco");
  const marca = bloco.querySelector(".marca");
  const letras = [...marca.querySelectorAll(".letra")];
  const ultimaParada = [...cena.querySelectorAll(".parada")].pop();

  // Escorridos: filhos das letras, medidos em em (acompanham qualquer mudança de layout).
  const fios = [], quedas = [];
  for (const [indice, posicao, h, w] of a.escorridos) {
    const alto = h + a.quedaEm + w;
    const caixa = svg("svg", { class: "derretido", viewBox: `-1 0 2 ${alto}`, "aria-hidden": "true", focusable: "false" });
    caixa.style.left = `${posicao * 100}%`;
    caixa.style.height = `${alto}em`;
    const n = w * .18, b = w * .46;
    const fio = svg("path", { d: `M${-w * .8} 0Q${-n} 0 ${-n} ${h * .4}C${-n} ${h * .65} ${-b} ${h * .68} ${-b} ${h - b}C${-b} ${h + b * .3} ${b} ${h + b * .3} ${b} ${h - b}C${b} ${h * .68} ${n} ${h * .65} ${n} ${h * .4}Q${n} 0 ${w * .8} 0Z` });
    caixa.append(fio);
    const queda = h >= a.soltarAcimaEm ? svg("circle", { cx: 0, cy: h - b, r: b, opacity: 0 }) : null;
    if (queda) caixa.append(queda);
    letras[indice].append(caixa);
    fios.push({ fio, indice, h, b });
    quedas.push(queda);
  }

  // Filtro que funde escorridos e letras (só no computador, pelo CSS).
  const filtroSvg = svg("svg", { class: "filtro-svg", "aria-hidden": "true", focusable: "false" });
  const filtro = svg("filter", { id: "filtro-derreter", x: "-5%", y: "-40%", width: "110%", height: "300%", "color-interpolation-filters": "sRGB" });
  const blur = svg("feGaussianBlur", { in: "SourceGraphic", stdDeviation: 1 });
  filtro.append(blur, svg("feColorMatrix", { type: "matrix", values: "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -8" }));
  filtroSvg.append(svg("defs", {}, filtro));
  cena.append(filtroSvg);
  marca.classList.add("derretendo");

  // Gota, conta que se forma de novo na torneira e respingos (camada fixa).
  const gota = svg("svg", { class: "gota", viewBox: "0 0 76 126", "aria-hidden": "true", focusable: "false" });
  const corpo = svg("path", { d: formas.semente, opacity: 0 });
  gota.append(corpo);
  const conta = svg("svg", { class: "gota", viewBox: "0 0 76 126", "aria-hidden": "true", focusable: "false" });
  const contaCorpo = svg("path", { d: formas.semente, opacity: 0 });
  conta.append(contaCorpo);
  const liquido = svg("svg", { class: "liquido", viewBox: "-120 -80 240 220", "aria-hidden": "true", focusable: "false" });
  const pingos = a.respingos.map(() => svg("circle", { cx: 0, cy: 0, r: 3, opacity: 0 }));
  liquido.append(...pingos);
  camada.append(liquido, conta, gota);

  // Medidas refeitas a cada atualização do ScrollTrigger (fontes, tamanho da janela).
  const tinta = document.createElement("canvas").getContext("2d");
  let alvo = null, em = 100, larguraGota = 20, alturaGota = 33, linha = 0, contatoNoBloco = 0;
  function medir() {
    const celular = innerWidth < 920;
    linha = innerHeight * (celular ? a.linhaCelular : a.linha);
    em = parseFloat(getComputedStyle(marca).fontSize);
    camada.style.setProperty("--gota-em", `${em}px`);
    larguraGota = parseFloat(getComputedStyle(gota).width) || 20;
    alturaGota = larguraGota * 126 / 76;
    blur.setAttribute("stdDeviation", (em * a.filtroEm).toFixed(2));
    const xCorredor = corredor.getBoundingClientRect().left;
    const distancia = (l) => { const r = l.getBoundingClientRect(); return Math.abs(r.left + r.width / 2 - xCorredor); };
    const letra = letras.reduce((x, y) => (distancia(y) < distancia(x) ? y : x));
    const r = letra.getBoundingClientRect();
    tinta.font = `750 ${em}px Fraunces`;
    const m = tinta.measureText(letra.textContent);
    const base = (r.height - m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2 + m.fontBoundingBoxAscent;
    const haste = em * a.hasteEm;
    const novo = { letra, dx: m.actualBoundingBoxRight - haste / 2, dy: base - m.actualBoundingBoxAscent, haste };
    const trocou = !alvo || alvo.letra !== letra;
    alvo = novo;
    contatoNoBloco = r.top + alvo.dy - bloco.getBoundingClientRect().top;
    return trocou;
  }
  function contato() {
    const r = alvo.letra.getBoundingClientRect();
    return { x: r.left + alvo.dx, y: r.top + alvo.dy };
  }

  // Derretido: linha do tempo comandada pela rolagem.
  let derreter = null, gatilho = null;
  function montarDerretido() {
    const tl = gsap.timeline({ paused: true });
    const u = larguraGota / 76, w = alvo.haste / 2 / u;
    const achatada = `M38 124Q${38 + w} 120 ${38 + w} 126Q38 132 ${38 - w} 126Q${38 - w} 120 38 124Z`;
    // fromTo sem render imediato: não atrapalha o nascimento; ao voltar, a gota reaparece inteira.
    tl.fromTo(corpo, { morphSVG: formas.gota, opacity: 1, y: 0 }, { morphSVG: achatada, duration: a.achatar, ease: "power2.out", immediateRender: false }, 0)
      .fromTo(corpo, { opacity: 1 }, { opacity: 0, y: 2, duration: a.fundir, immediateRender: false }, a.achatar);
    const atingida = alvo.letra.getBoundingClientRect();
    fios.forEach(({ fio, indice, h, b }, i) => {
      const r = letras[indice].getBoundingClientRect();
      const dist = Math.abs(r.left + r.width / 2 - atingida.left - atingida.width / 2) / em;
      const inicio = a.achatar * .7 + Math.min(a.atrasoMaximo, dist * a.atrasoPorEm);
      gsap.set(fio, { scaleY: 0, svgOrigin: "0 0", opacity: 0 });
      tl.set(fio, { opacity: 1 }, inicio).to(fio, { scaleY: 1, duration: a.derreter, ease: "power2.in" }, inicio);
      if (quedas[i]) {
        const solta = inicio + a.derreter + a.esperaSoltar;
        tl.set(quedas[i], { opacity: 0, attr: { cy: h - b } }, 0)
          .set(quedas[i], { opacity: 1 }, solta)
          .to(quedas[i], { attr: { cy: h + a.quedaEm }, duration: a.queda, ease: "power2.in" }, solta)
          .to(quedas[i], { opacity: 0, duration: a.queda * .45 }, solta + a.queda * .55);
      }
    });
    const escala = Math.max(.65, Math.min(1.2, em / 90));
    pingos.forEach((pingo, i) => {
      const [diametro, vx, impulso, atraso] = a.respingos[i];
      const voo = { t: 0 }, dur = 2 * impulso / a.gravidade, ini = a.achatar + atraso;
      tl.set(pingo, { opacity: 0, attr: { cx: 0, cy: 0, r: diametro / 2 * escala } }, 0)
        .set(pingo, { opacity: 1 }, ini)
        .to(voo, { t: dur, duration: dur, ease: "none", onUpdate: () => {
          pingo.setAttribute("cx", vx * escala * voo.t);
          pingo.setAttribute("cy", (-impulso * voo.t + a.gravidade * voo.t * voo.t / 2) * escala);
        } }, ini)
        .to(pingo, { opacity: 0, duration: .15 }, ini + dur - .15);
    });
    // Folga no fim: o título continua preso um pouco depois do derretido completo.
    const total = tl.duration();
    tl.to({}, { duration: total * (1 / a.completar - 1) });
    return tl;
  }

  let trocou = false;
  function construir() {
    gatilho?.kill(); derreter?.kill();
    derreter = montarDerretido();
    gatilho = ScrollTrigger.create({
      trigger: bloco,
      // Mede com o título solto (o ScrollTrigger desfaz o pin antes de chamar).
      start: () => { trocou = medir() || trocou; return `top ${linha + alturaGota - contatoNoBloco}px`; },
      end: () => `+=${innerHeight * a.trechoFixo}`,
      pin: true,
      scrub: a.suavizar,
      animation: derreter,
      invalidateOnRefresh: true,
    });
  }

  // Movimento reduzido: título já derretido, parado; sem gota nem trecho preso.
  if (reduzido) {
    medir();
    derreter = montarDerretido();
    derreter.progress(1);
    camada.hidden = true;
    return { pausar() {} };
  }

  medir();
  construir();
  trocou = false;
  // Se a letra-alvo mudar (celular x computador), refaz o derretido com as novas distâncias.
  ScrollTrigger.addEventListener("refresh", () => {
    if (!trocou) return;
    trocou = false;
    requestAnimationFrame(() => { construir(); ScrollTrigger.refresh(); trocou = false; });
  });
  let pausado = false;

  // Nascimento por tempo: a gota se forma no bico quando a torneira aparece.
  const nascimento = gsap.timeline({ paused: true })
    .to(corpo, { opacity: 1, duration: a.crescer / 2 })
    .to(corpo, { morphSVG: formas.bulbo, duration: a.crescer, ease: "sine.inOut" }, 0)
    .to(corpo, { morphSVG: formas.pescoco, duration: a.pescoco, ease: "sine.in" })
    .to(corpo, { morphSVG: formas.gota, duration: a.soltar, ease: "power2.in" });
  const pingar = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.2 })
    .set(contaCorpo, { attr: { d: formas.semente }, opacity: 0 })
    .to(contaCorpo, { opacity: 1, duration: .4 })
    .to(contaCorpo, { morphSVG: formas.bulbo, duration: 2.4, ease: "sine.inOut" }, 0)
    .to(contaCorpo, { opacity: 0, duration: .5 }, "+=.6");
  let nasceu = false;
  if (bico.getBoundingClientRect().top < linha) { nascimento.progress(1); nasceu = true; }

  // Quadro a quadro: posição da gota na tela.
  let ultimoY = scrollY, ultimoT = performance.now(), esticar = 0, ativo = true;
  ScrollTrigger.create({ trigger: cena, start: "top bottom", end: "bottom top", onToggle: (s) => { ativo = s.isActive; camada.style.visibility = ativo ? "" : "hidden"; } });
  gsap.ticker.add(() => {
    if (!ativo) return;
    const agora = performance.now(), dt = Math.max(1, agora - ultimoT);
    const v = Math.abs(scrollY - ultimoY) / dt * 1000;
    ultimoY = scrollY; ultimoT = agora;
    const p = bico.getBoundingClientRect();
    if (!nasceu && p.top < innerHeight * .9) { nasceu = true; nascimento.play(); }
    if (nascimento.progress() < 1 && p.top < linha) nascimento.timeScale(4);
    const c = contato();
    const xBico = p.left, solta = p.top < linha - 2;
    const falta = c.y - alturaGota - linha;
    let y = Math.min(Math.max(p.top, linha), c.y - alturaGota);
    // Só sai do corredor depois de passar pela última parada (não encosta no texto dela).
    const livre = limitar((y - ultimaParada.getBoundingClientRect().bottom) / 40);
    const perto = suave(1 - limitar(falta / (innerHeight * a.aproximar))) * livre;
    const x = xBico + (c.x - xBico) * perto;
    const alvoEsticar = solta && falta > 40 ? limitar(v / a.esticarVelocidade) * a.esticarMaximo * (1 - perto) : 0;
    esticar += (alvoEsticar - esticar) * Math.min(1, dt / 90);
    const sy = 1 + esticar, sx = 1 / Math.sqrt(sy);
    gota.style.transform = `translate(${x - larguraGota / 2}px, ${y}px) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
    // Conta nova na torneira só depois que a primeira gota foi embora.
    const mostrarConta = solta && nascimento.progress() === 1;
    conta.style.transform = `translate(${xBico - larguraGota / 2}px, ${p.top}px)`;
    conta.style.opacity = mostrarConta ? 1 : 0;
    if (mostrarConta && !pingar.isActive() && !pausado) pingar.play();
    liquido.style.transform = `translate(${c.x - 120}px, ${c.y - 80}px)`;
  });

  // Desenhos balançam quando a gota passa por eles.
  for (const desenho of cena.querySelectorAll(".parada-desenho")) {
    const balancar = () => gsap.fromTo(desenho, { rotation: 0 }, { keyframes: { rotation: [0, -4, 3, -1.5, 0] }, duration: 1, ease: "sine.inOut", overwrite: true });
    ScrollTrigger.create({ trigger: desenho, start: () => `center ${linha}px`, onEnter: balancar, onEnterBack: balancar });
  }

  // Entrada dos blocos ao aparecer na tela.
  const entrar = ".parada, .produto, .vender-cartao, .preparo-passo, .como-lista li";
  gsap.set(entrar, { autoAlpha: 0, y: 36 });
  ScrollTrigger.batch(entrar, { start: "top 90%", once: true, onEnter: (lote) => gsap.to(lote, { autoAlpha: 1, y: 0, duration: .8, stagger: .08, ease: "power3.out", overwrite: true }) });

  document.fonts.ready.then(() => ScrollTrigger.refresh());
  return {
    pausar(sim) {
      pausado = sim;
      if (sim) pingar.pause(); else pingar.play();
    },
  };
}
