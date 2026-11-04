// Protótipo v4: uma gota sai da torneira, desce com a rolagem e molha o título.
const reduzido = matchMedia("(prefers-reduced-motion: reduce)");
const raiz = document.documentElement;
const descida = document.getElementById("descida");
let gota = document.getElementById("gota");
const bico = document.querySelector(".torneira-bico");
const marca = document.getElementById("marca");
const limitar = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const B = new URLSearchParams(location.search).get("versao") === "b"
  ? await (await import("./descida-b.js")).iniciar(descida, gota, marca) : null;
if (B) gota = B.gota;

let yLiso = null, xLiso = 0, velocidade = 0, ultimo = performance.now(), molhou = false, pedido = 0, visivel = false;

function pontos() {
  const d = descida.getBoundingClientRect();
  const b = bico.getBoundingClientRect();
  const escala = b.width / 80;
  const m = marca.getBoundingClientRect();
  const impacto = B?.alvo();
  // altura de cima das letras (um pouco abaixo do topo da caixa da linha)
  return {
    topo: d.top,
    bicoX: b.left + (B?.bico.x ?? 56) * escala - d.left, bicoY: b.top + (B?.bico.y ?? 46) * escala - d.top,
    alvoX: impacto?.x ?? d.width / 2, alvoY: impacto?.y ?? m.top + m.height * 0.3 - d.top,
  };
}

function quadro(agora) {
  pedido = 0;
  const dt = Math.min(0.05, (agora - ultimo) / 1000); ultimo = agora;
  const t = agora / 1000;
  const p = pontos();
  if (B) {
    B.quadro(p, dt);
    if (visivel) pedido = requestAnimationFrame(quadro);
    return;
  }
  if (B && !B.nascer(p)) yLiso = p.bicoY;
  const largura = B ? gota.clientWidth : gota.offsetWidth, alturaGota = B ? gota.clientHeight : gota.offsetHeight;
  // a gota acompanha um ponto a 45% da tela, preso entre a torneira e o título
  const fim = p.alvoY - alturaGota;
  const alvo = limitar(innerHeight * 0.45 - p.topo, p.bicoY, fim);
  if (yLiso === null) yLiso = alvo;
  const antes = yLiso;
  if (!B || B.pronta()) yLiso += (alvo - yLiso) * (1 - Math.exp(-dt * 9));
  velocidade += ((yLiso - antes) / Math.max(dt, 0.001) - velocidade) * 0.25;
  const progresso = limitar((yLiso - p.bicoY) / (fim - p.bicoY));
  // começa saindo do bico e vai para o centro; balança um pouco no caminho
  const xBase = p.bicoX + (p.alvoX - p.bicoX) * Math.min(1, progresso * 6);
  const balanco = Math.sin(progresso * Math.PI * 5) * 10 * Math.sin(Math.PI * progresso);
  let x = xBase + balanco;
  let sx = 1, sy = 1;
  if (progresso < 0.002) {
    // presa no bico: cresce e treme, como gota que ainda vai cair
    const pulsar = Math.sin(t * 2.2);
    sy = 1 + 0.08 * pulsar; sx = 1 - 0.05 * pulsar;
  } else {
    // quanto mais rápido cai, mais estica
    const estica = Math.min(0.55, Math.abs(velocidade) / 2200);
    sy = 1 + estica; sx = 1 / Math.sqrt(sy);
  }
  if (B) x = B.trajeto(x, yLiso, alturaGota * sy, largura * sx);
  const chegou = progresso > 0.998;
  if (chegou && !molhou) { if (B) { molhou = true; B.molhar(x, p.alvoY); } else molhar(x, p.alvoY); }
  if (progresso < (B ? 0.998 : 0.9) && molhou) secar();
  if (!B) gota.style.opacity = molhou ? 0 : 1;
  if (B && (molhou || !B.pronta())) { sx = 1; sy = 1; }
  gota.style.transform = `translate(${x - largura / 2}px, ${yLiso}px) scale(${sx}, ${sy})`;
  if (visivel) pedido = requestAnimationFrame(quadro);
}

function peca(classe, x, y) {
  const el = document.createElement("span");
  el.className = classe; el.setAttribute("aria-hidden", "true");
  el.style.left = `${x}px`; el.style.top = `${y}px`;
  descida.append(el);
  return el;
}

function molhar(x, y) {
  molhou = true;
  // anéis de onda
  for (let i = 0; i < 3; i++) {
    const anel = peca("onda-anel molhado", x, y);
    anel.animate([{ transform: "scale(1)", opacity: 0.8 }, { transform: "scale(12, 5)", opacity: 0 }],
      { duration: 1100, delay: i * 180, easing: "cubic-bezier(.2,.7,.3,1)", fill: "both" });
  }
  // respingos que sobem e caem
  for (let i = 0; i < 7; i++) {
    const r = peca("respingo molhado", x, y);
    const dx = (Math.random() - 0.5) * 140, alto = 40 + Math.random() * 60, tam = 0.5 + Math.random() * 0.7;
    r.animate([
      { transform: `translate(0, 0) scale(${tam})`, opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${-alto}px) scale(${tam})`, opacity: 1, offset: 0.4 },
      { transform: `translate(${dx}px, 30px) scale(${tam * 0.7})`, opacity: 0 },
    ], { duration: 750 + Math.random() * 300, easing: "cubic-bezier(.3,.6,.6,1)", fill: "both" });
  }
  // as letras ondulam a partir do ponto da batida
  const caixaMarca = marca.getBoundingClientRect(), d = descida.getBoundingClientRect();
  const impacto = x + d.left;
  for (const letra of marca.querySelectorAll(".letra")) {
    const l = letra.getBoundingClientRect();
    const dist = Math.abs(l.left + l.width / 2 - impacto);
    const forca = Math.max(0.25, 1 - dist / caixaMarca.width);
    letra.animate([
      { transform: "translateY(0)" }, { transform: `translateY(${10 * forca}px) scaleY(${1 - 0.06 * forca})` },
      { transform: `translateY(${-4 * forca}px)` }, { transform: "translateY(0)" },
    ], { duration: 700, delay: dist * 0.9, easing: "ease-out" });
  }
  // escorridos: gotinhas que descem pelas letras perto da batida
  const base = caixaMarca.bottom - d.top - caixaMarca.height * 0.3;
  [-34, 8, 46].forEach((desvio, i) => {
    const e = peca("escorrido molhado", x + desvio, base);
    e.animate([
      { transform: "translateY(-6px) scale(.3)", opacity: 0 },
      { transform: "translateY(0) scale(1)", opacity: 1, offset: 0.2 },
      { transform: "translateY(26px) scale(.8, 1.4)", opacity: 0.9, offset: 0.8 },
      { transform: "translateY(34px) scale(.4)", opacity: 0 },
    ], { duration: 2200, delay: 300 + i * 260, easing: "ease-in", fill: "both" });
  });
}

function secar() {
  molhou = false;
  if (B) { B.secar(); return; }
  descida.querySelectorAll(".molhado").forEach((el) => el.remove());
}

function pedir() { if (!pedido && visivel && raiz.classList.contains("descida-viva")) { ultimo = performance.now(); pedido = requestAnimationFrame(quadro); } }
new IntersectionObserver(([e]) => { visivel = e.isIntersecting; pedir(); }, { rootMargin: "200px" }).observe(descida);
function modo() {
  const ligado = !reduzido.matches && !raiz.classList.contains("pausado");
  if (raiz.classList.contains("descida-viva") !== ligado) raiz.classList.toggle("descida-viva", ligado);
  if (B) B.modo(ligado, reduzido.matches);
  if (ligado) pedir(); else {
    cancelAnimationFrame(pedido); pedido = 0; if (!B) secar();
    marca.getAnimations({ subtree: true }).forEach((animacao) => animacao.cancel());
  }
}
reduzido.addEventListener("change", modo);
new MutationObserver(modo).observe(raiz, { attributes: true, attributeFilter: ["class"] });
modo();
