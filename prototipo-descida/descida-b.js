// G3: tempos em segundos; escorridos = [letra, posição 0–1, comprimento em, largura em].
const ajustes = {
  bico: { x: 56, y: 46 },
  crescer: 0.35, pescoco: 0.23, soltar: 0.16,
  // Firmeza da descida; queda autônoma; disparo na metade inferior; trecho sticky em svh.
  suavizacao: 60, quedaFinal: 0.4, entrada: 0.68, trechoFixo: 80,
  // Derretido completo em 70% do trecho; resposta exponencial em cerca de 80 ms.
  completarEm: 0.7, suavizacaoDerreter: 12.5,
  achatar: 0.12, fundir: 0.12, derreter: 0.6, atrasoPorEm: 0.04, atrasoMaximo: 0.48, limpar: 0.3,
  topoEm: 0, hasteEm: 0.11, sobreporEm: 0.055, filtroEm: 0.033,
  escorridos: [[0,.28,.19,.13], [2,.52,.42,.13], [4,.22,.24,.12],
    [6,.63,.32,.13], [7,.75,.56,.14], [10,.48,.6,.14], [12,.75,.48,.14]],
  // Os três maiores pingam; queda e sumiço terminam antes da frase de apoio.
  soltarAcimaEm: 0.45, esperaSoltar: 0.1, queda: 0.48, quedaEm: 0.5,
  gotinhas: 5, raio: 3, gravidade: 420, respingos: [[3,-48,105,0], [5,35,155,.04], [8,-80,190,.09], [4,62,125,.02], [6,12,215,.13]],
};
const formas = {
  semente: "M38 0C42 0 44 3 44 6C44 10 32 10 32 6C32 3 34 0 38 0Z",
  bulbo: "M38 0C42 0 43 25 53 39C77 77 1 77 23 39C33 25 34 0 38 0Z",
  pescoco: "M38 0C39 0 35 45 54 68C88 126 -12 126 22 68C41 45 37 0 38 0Z",
  gota: "M38 5C43 30 68 66 68 89C68 132 8 132 8 89C8 66 33 30 38 5Z",
  achatada: "M38 109C57 109 82 114 82 119C82 128 -6 128 -6 119C-6 114 19 109 38 109Z",
};

function carregar(nome) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = new URL(`./vendor/${nome}.min.js`, import.meta.url).href;
    script.onload = resolve; script.onerror = reject;
    document.head.append(script);
  });
}

export async function iniciar(descida, antiga, marca) {
  await carregar("gsap"); await carregar("MorphSVGPlugin");
  const { gsap, MorphSVGPlugin } = window;
  gsap.registerPlugin(MorphSVGPlugin);
  const a = ajustes, ns = "http://www.w3.org/2000/svg";
  const ajuste = new URLSearchParams(location.search).get("ajuste") === "1";
  descida.classList.add("cena-b");
  function svg(tag, atributos, pai) {
    const no = document.createElementNS(ns, tag);
    for (const [k, v] of Object.entries(atributos)) no.setAttribute(k, v);
    if (pai) pai.append(no);
    return no;
  }
  const gota = svg("svg", { id: "gota", class: "gota gota-b", viewBox: "0 0 76 126", "aria-hidden": "true" });
  const corpo = svg("path", { d: formas.semente, opacity: 0 }, gota);
  antiga.replaceWith(gota);
  const liquido = svg("svg", { class: "liquido-b", viewBox: "-120 -80 240 220", "aria-hidden": "true" }, descida);
  const pingos = Array.from({ length: a.gotinhas }, () => svg("circle", { r: a.raio, opacity: 0 }, liquido));
  const letras = [...marca.querySelectorAll(".letra")];
  // Coordenadas internas normalizadas: um ponto SVG = um em, sem medidas de layout.
  const camadas = a.escorridos.map(([indice, posicao, h, w]) => {
    const camada = svg("svg", { class: "derretido-b", viewBox: `-1 0 2 ${h + a.quedaEm + w}`,
      "aria-hidden": "true" }, letras[indice]);
    camada.style.left = `${posicao * 100}%`;
    camada.style.height = `${h + a.quedaEm + w}em`;
    return camada;
  });
  const fios = camadas.map(camada => svg("path", { opacity: 0 }, camada));
  const quedas = a.escorridos.map((e, i) => e[2] >= a.soltarAcimaEm ? svg("circle", { opacity: 0 }, camadas[i]) : null);
  const defs = svg("svg", { class: "filtro-derreter", "aria-hidden": "true" }, descida);
  const filtro = svg("filter", { id: "filtro-derreter", x: "-5%", y: "-40%", width: "110%", height: "300%", "color-interpolation-filters": "sRGB" }, svg("defs", {}, defs));
  const blur = svg("feGaussianBlur", { in: "SourceGraphic", stdDeviation: 1 }, filtro);
  svg("feColorMatrix", { type: "matrix", values: "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -8" }, filtro);
  marca.classList.add("marca-derretendo");
  const fim = marca.parentElement, fixo = document.createElement("div");
  fixo.className = "descida-fixo";
  fixo.append(...fim.childNodes); fim.append(fixo);
  fim.style.setProperty("--trecho-fixo", `${a.trechoFixo}svh`);
  let nasceu = false, soltou = false, ligado = true, molhado = false, recolher = null;
  let yLiso = null, quedaFinal = null;
  let tempoRolagem = 0, ultimoEscorrido = 0;
  const pingadas = quedas.map(() => null), finais = [];
  const nascimento = gsap.timeline({ id: "nascimento", paused: true, onComplete: () => { soltou = true; } })
    .to(corpo, { opacity: 1, duration: a.crescer / 2 })
    .to(corpo, { morphSVG: formas.bulbo, duration: a.crescer, ease: "sine.inOut" }, 0)
    .to(corpo, { morphSVG: formas.pescoco, duration: a.pescoco, ease: "sine.in" })
    .to(corpo, { morphSVG: formas.gota, duration: a.soltar, ease: "power2.in" });
  const derreter = gsap.timeline({ id: "derreter", paused: true });
  // Métricas de tinta; topoEm permite ajuste fino da altura do contato.
  const contexto = document.createElement("canvas").getContext("2d");
  function alvo() {
    const d = descida.getBoundingClientRect();
    const letras = [...marca.querySelectorAll(".letra")];
    const distancia = el => { const r = el.getBoundingClientRect(); return Math.abs(r.x + r.width / 2 - d.x - d.width / 2); };
    const letra = letras.reduce((a, b) => distancia(b) < distancia(a) ? b : a);
    const r = letra.getBoundingClientRect(), em = parseFloat(getComputedStyle(letra).fontSize);
    contexto.font = `750 ${em}px Fraunces`;
    const m = contexto.measureText(letra.textContent), haste = em * a.hasteEm;
    const base = r.top + (r.height - m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2 + m.fontBoundingBoxAscent - d.top;
    return { x: r.left - d.left + m.actualBoundingBoxRight - haste / 2,
      y: base - m.actualBoundingBoxAscent + em * a.topoEm, base, em, haste, letra };
  }
  function preparar() {
    pingadas.forEach(t => t?.kill());
    ultimoEscorrido = 0;
    const p = alvo(), { x, y, em, haste } = p;
    liquido.style.transform = `translate(${x - 120}px, ${y - 80}px)`;
    const w = haste / 2;
    const u = gota.clientWidth / 76;
    // O contato afunda na tinta; não cria uma superfície por cima da letra.
    const achatada = `M38 124Q${38 + w / u} 120 ${38 + w / u} 126Q38 132 ${38 - w / u} 126Q${38 - w / u} 120 38 124Z`;
    blur.setAttribute("stdDeviation", em * a.filtroEm);
    derreter.clear()
      .set(corpo, { opacity: 1, y: 0, attr: { d: formas.gota } })
      .set(liquido, { opacity: 1 })
      .to(corpo, { morphSVG: achatada, duration: a.achatar, ease: "power2.out" })
      .to(corpo, { opacity: 0, y: em * .04, duration: a.fundir }, a.achatar);
    a.escorridos.forEach(([indice, posicao, comprimento, largura], i) => {
      const letra = letras[indice], r = letra.getBoundingClientRect();
      const h = comprimento, w = largura, n = w * .18, b = w * .46;
      const fio = fios[i];
      fio.setAttribute("d", `M${-w*.8} 0Q${-n} 0 ${-n} ${h*.4}C${-n} ${h*.65} ${-b} ${h*.68} ${-b} ${h-b}C${-b} ${h+b*.3} ${b} ${h+b*.3} ${b} ${h-b}C${b} ${h*.68} ${n} ${h*.65} ${n} ${h*.4}Q${n} 0 ${w*.8} 0Z`);
      // Mede a distância real à letra atingida, inclusive quando há duas linhas.
      const atingida = p.letra.getBoundingClientRect();
      const distancia = Math.hypot(r.x + r.width/2 - atingida.x - atingida.width/2, r.y - atingida.y) / em;
      const inicio = a.achatar + Math.min(a.atrasoMaximo, distancia * a.atrasoPorEm);
      finais[i] = inicio + a.derreter;
      ultimoEscorrido = Math.max(ultimoEscorrido, finais[i]);
      // Posiciona escondido imediatamente, antes do primeiro quadro da timeline.
      gsap.set(fio, { scaleY: 0, svgOrigin: "0 0", opacity: 0 });
      derreter.set(fio, { opacity: 1 }, inicio)
        .to(fio, { scaleY: 1, duration: a.derreter, ease: "power2.in" }, inicio);
      if (quedas[i]) {
        const soltar = inicio + a.derreter + a.esperaSoltar;
        const animacao = ajuste ? derreter : gsap.timeline({ paused: true });
        if (!ajuste) pingadas[i] = animacao;
        const quando = ajuste ? soltar : a.esperaSoltar;
        animacao.set(quedas[i], { opacity: 0, attr: { cx: 0, cy: h-b, r: b } }, 0)
          .set(quedas[i], { opacity: 1 }, quando)
          .to(quedas[i], { attr: { cy: h+a.quedaEm }, duration: a.queda, ease: "power2.in" }, quando)
          .to(quedas[i], { opacity: 0, duration: a.queda*.45 }, quando+a.queda*.55);
      }
    });
    pingos.forEach((pingo, i) => {
      const [diametro, vx, impulso, atraso] = a.respingos[i], voo = { t: 0 };
      const duracao = 2 * impulso / a.gravidade, inicio = a.achatar + atraso;
      derreter.set(pingo, { opacity: 1, attr: { cx: 0, cy: 0, r: diametro / 2 * Math.max(.65, Math.min(1, em / 80)) } }, inicio)
        .to(voo, { t: duracao, duration: duracao, ease: "none", onUpdate: () => {
          pingo.setAttribute("cx", vx * voo.t);
          pingo.setAttribute("cy", -impulso * voo.t + a.gravidade * voo.t * voo.t / 2);
        } }, inicio)
        .fromTo(pingo, { opacity: 1 }, { opacity: 0, duration: a.limpar, immediateRender: false }, inicio + duracao - a.limpar)
        .set(pingo, { opacity: 0 }, inicio + duracao);
    });
  }
  preparar();
  // Recalcula apenas no resize/fontes; a descida da G1 permanece igual.
  function medir() {
    const tempo = derreter.progress(), pausada = derreter.paused();
    preparar(); derreter.progress(tempo).paused(pausada);
  }
  addEventListener("resize", medir);
  document.fonts.ready.then(medir);
  if (ajuste) {
    await carregar("GSDevTools");
    gsap.registerPlugin(window.GSDevTools);
    // Duas barras independentes, sem prender os controles à rolagem.
    [nascimento, derreter].forEach((animation, i) => {
      const painel = document.createElement("div");
      painel.className = "ajuste-gota"; painel.style.bottom = `${i * 60}px`;
      document.body.append(painel);
      window.GSDevTools.create({ animation, container: painel, globalSync: false });
    });
  }
  return {
    gota, alvo, bico: a.bico, pronta: () => soltou,
    quadro(p, dt) {
      if (!ligado) return;
      const pronta = this.nascer(p), largura = gota.clientWidth, altura = gota.clientHeight;
      const inicioFixo = parseFloat(getComputedStyle(fixo).top);
      const dentro = inicioFixo - fim.getBoundingClientRect().top;
      const trecho = fim.offsetHeight - fixo.offsetHeight;
      const preso = dentro >= 0;
      if (yLiso === null) yLiso = p.bicoY;
      // Subir além da entrada desfaz a queda e recolhe, sem disparar de novo nesse quadro.
      if (quedaFinal && p.topo + p.alvoY > innerHeight * (a.entrada + .08)) {
        quedaFinal = null; this.secar();
      }
      const destinoGota = p.alvoY - altura;
      const alvoY = Math.max(p.bicoY, Math.min(destinoGota, innerHeight * .45 - p.topo));
      if (pronta && !quedaFinal) yLiso += (alvoY - yLiso) * (1 - Math.exp(-dt * a.suavizacao));
      const progresso = Math.max(0, Math.min(1, (yLiso - p.bicoY) / (destinoGota - p.bicoY)));
      let x = p.bicoX + (p.alvoX - p.bicoX) * Math.min(1, progresso * 6)
        + Math.sin(progresso * Math.PI * 5) * 10 * Math.sin(Math.PI * progresso);
      x = this.trajeto(x, yLiso, altura, largura);
      if (pronta && !quedaFinal && p.topo + p.alvoY <= innerHeight * a.entrada) {
        // Guarda o início na tela; o destino é medido de novo inclusive no contato.
        quedaFinal = { t: 0, x, y: yLiso + p.topo };
      }
      if (quedaFinal) {
        quedaFinal.t = Math.min(a.quedaFinal, quedaFinal.t + dt);
        const t = ajuste ? quedaFinal.t / a.quedaFinal : preso ? 1 : Math.min(.98, quedaFinal.t / a.quedaFinal);
        const aceleracao = t * t;
        const contato = alvo();
        x = quedaFinal.x + (contato.x - quedaFinal.x) * aceleracao;
        yLiso = quedaFinal.y - p.topo + (contato.y - altura - (quedaFinal.y - p.topo)) * aceleracao;
        if (t === 1 && !molhado) this.molhar();
      }
      if (!ajuste && molhado) {
        const destino = Math.max(0, Math.min(1, dentro / Math.max(1, trecho * a.completarEm))) * ultimoEscorrido;
        const anterior = tempoRolagem;
        tempoRolagem += (destino - tempoRolagem) * (1 - Math.exp(-dt * a.suavizacaoDerreter));
        if (Math.abs(destino - tempoRolagem) < .0001) tempoRolagem = destino;
        derreter.time(tempoRolagem).pause();
        pingadas.forEach((animacao, i) => {
          if (!animacao) return;
          if (anterior < finais[i] - .0001 && tempoRolagem >= finais[i] - .0001) animacao.restart();
          if (tempoRolagem < finais[i] - .001) { animacao.pause(0); gsap.set(quedas[i], { opacity: 0 }); }
        });
      }
      gota.style.transform = `translate(${x - largura / 2}px, ${yLiso}px)`;
    },
    trajeto(x, y, altura, largura) {
      if (!soltou) return x;
      const desktop = innerWidth >= 920;
      const d = descida.getBoundingClientRect(), margem = largura / 2 + (desktop ? 16 : 8);
      let esquerda = -Infinity, direita = Infinity;
      for (const grupo of descida.querySelectorAll(".parada-grupo")) {
        const desenho = grupo.querySelector(".ilustra").getBoundingClientRect();
        const texto = grupo.querySelector(".parada-texto").getBoundingClientRect();
        if (y + altura < Math.min(desenho.top, texto.top) - d.top ||
            y > Math.max(desenho.bottom, texto.bottom) - d.top) continue;
        if (!desktop || grupo.closest(".lado-esq")) esquerda = Math.max(esquerda, Math.max(desenho.right, desktop ? texto.right : -Infinity) - d.left + margem);
        if (!desktop || grupo.closest(".lado-dir")) direita = Math.min(direita, Math.min(texto.left, desktop ? desenho.left : Infinity) - d.left - margem);
      }
      return Math.max(esquerda, Math.min(direita, x));
    },
    nascer(p) {
      if (ligado && !nasceu && p.topo + p.bicoY < innerHeight) {
        nasceu = true; nascimento.restart();
      }
      return soltou;
    },
    molhar(x, y) {
      recolher?.kill();
      molhado = true; preparar(); tempoRolagem = 0;
      if (ajuste) derreter.restart(); else derreter.time(0).pause();
    },
    secar() {
      if (!molhado) return;
      molhado = false; derreter.pause();
      gsap.set(quedas.filter(Boolean), { opacity: 0 });
      recolher?.kill();
      recolher = gsap.timeline()
        .to(fios, { scaleY: 0, duration: a.limpar, ease: "power2.in" }, 0)
        .to(liquido, { opacity: 0, duration: a.limpar }, 0)
        .to(corpo, { opacity: 1, y: 0, morphSVG: formas.gota, duration: a.limpar }, 0);
    },
    modo(ativo, reduzido) {
      if (reduzido) {
        pingadas.forEach(t => t?.pause(0));
        nascimento.pause(); recolher?.kill(); preparar(); derreter.progress(1).pause();
        gsap.set([liquido, corpo], { opacity: 0 });
        ligado = false; return;
      }
      if (ligado === ativo) return;
      ligado = ativo;
      if (!ativo) {
        pingadas.forEach(t => t?.pause());
        nascimento.pause(); derreter.pause(); recolher?.pause();
      } else {
        recolher?.resume();
        if (nasceu && !soltou) nascimento.resume();
        pingadas.forEach((t, i) => { if (t && tempoRolagem >= finais[i]) t.resume(); });
        if (molhado && ajuste) derreter.resume();
        else if (soltou) { derreter.progress(0).pause(); gsap.set(corpo, { opacity: 1 }); }
      }
    },
  };
}
