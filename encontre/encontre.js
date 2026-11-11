import { encontre } from "./locais.js";
import { animarTopo } from "./movimento.js";

const ordem = new Intl.Collator("pt-BR");

export function agruparLocais(locais, estados = encontre.estados) {
  return ["ES", "MG"].filter(estado => estado in estados).map(estado => ({
    estado, nome: estados[estado],
    locais: locais.filter(local => local.ativo === true && local.estado === estado)
      .sort((a, b) => ordem.compare(a.cidade, b.cidade) || ordem.compare(a.bairro, b.bairro) || ordem.compare(a.nome, b.nome)),
  })).filter(grupo => grupo.locais.length);
}

export function dadosDaIlustracao(ilustracao) {
  return ilustracao?.src?.trim() ? ilustracao : null;
}

export function apresentacaoDoTitulo(ilustracao) {
  const imagem = dadosDaIlustracao(ilustracao);
  return { classe: "", ilustracao: imagem ? { ...imagem, alt: "" } : null };
}

export function linkDoLocal(local) {
  return local.mapa || "https://www.google.com/maps/search/?api=1&query="
    + encodeURIComponent([local.nome, local.endereco, local.bairro, local.cidade].join(", "));
}

export function mapaValido(url) {
  return typeof url === "string" && url.startsWith("https://www.google.com/maps/d/embed");
}

function elemento(tag, classe, texto) {
  const no = document.createElement(tag);
  if (classe) no.className = classe;
  if (texto !== undefined) no.textContent = texto;
  return no;
}

function linkDeVolta(dados) {
  const link = elemento("a", "voltar", dados.voltar);
  link.href = "../index.html";
  return link;
}

function montarLocal(local, dados) {
  const item = elemento("li", "local");
  item.append(elemento("p", "local-regiao", `${local.cidade} · ${local.bairro}`),
    elemento("h3", "local-nome", local.nome), elemento("p", "endereco", local.endereco));
  const etiquetas = elemento("ul", "etiquetas");
  for (const modalidade of local.modalidades) {
    if (!dados.etiquetas[modalidade]) continue;
    const etiqueta = elemento("li", "etiqueta");
    const icone = elemento("img");
    icone.src = modalidade === "xicara" ? "xicara.svg" : "pacote.svg";
    icone.width = 24;
    icone.height = 24;
    icone.alt = "";
    icone.loading = "lazy";
    icone.setAttribute("aria-hidden", "true");
    etiqueta.append(icone, elemento("span", "", dados.etiquetas[modalidade]));
    etiquetas.append(etiqueta);
  }
  const link = elemento("a", "ver-mapa", dados.verNoMapa);
  link.href = linkDoLocal(local);
  link.target = "_blank";
  link.rel = "noopener";
  link.setAttribute("aria-label", dados.verNoMapaAcessivel.replace("{nome}", local.nome));
  item.append(etiquetas, link);
  return item;
}

let encerrarMovimento;

export function montarPagina(dados = encontre) {
  encerrarMovimento?.();
  const topo = document.getElementById("topo");
  const titulo = document.getElementById("titulo");
  const apresentacao = document.getElementById("apresentacao");
  const mapa = document.getElementById("mapa");
  const lista = document.getElementById("locais");
  const rodape = document.getElementById("rodape");
  const introducao = document.querySelector(".introducao");
  const fecho = document.getElementById("fecho");
  for (const no of [topo, apresentacao, mapa, lista, rodape]) no.replaceChildren();
  titulo.textContent = dados.titulo;

  const voltar = linkDeVolta(dados);
  const logo = elemento("img");
  logo.src = "../img/logo.webp";
  logo.width = 56;
  logo.height = 56;
  logo.alt = "";
  voltar.prepend(logo);
  topo.append(voltar);

  introducao.querySelector(".ilustracao-moldura")?.remove();
  const { classe, ilustracao } = apresentacaoDoTitulo(dados.ilustracao);
  titulo.className = classe;
  let imagem;
  if (ilustracao) {
    imagem = elemento("img", "ilustracao");
    Object.assign(imagem, { src: ilustracao.src, alt: ilustracao.alt, width: 1230, height: 742 });
    imagem.setAttribute("aria-hidden", "true");
    const moldura = elemento("div", "ilustracao-moldura");
    moldura.append(imagem);
    introducao.prepend(moldura);
  }

  const grupos = agruparLocais(dados.locais, dados.estados);
  fecho.textContent = dados.fraseFinal;
  fecho.hidden = !grupos.length;
  if (grupos.length) {
    if (dados.locais.some(local => local.ativo === true && local.exemplo === true)) {
      apresentacao.append(elemento("p", "aviso-exemplo", dados.avisoExemplo));
    }
    apresentacao.append(elemento("p", "texto", dados.texto));
    if (mapaValido(dados.mapa.url)) {
      const iframe = elemento("iframe", "mapa");
      iframe.src = dados.mapa.url;
      iframe.title = dados.mapa.titulo;
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      mapa.append(iframe);
    }
    for (const grupo of grupos) {
      const estado = elemento("section", "estado");
      const itens = elemento("ul", "lista-locais");
      estado.append(elemento("h2", "estado-titulo", grupo.nome));
      for (const local of grupo.locais) itens.append(montarLocal(local, dados));
      estado.append(itens);
      lista.append(estado);
    }
  } else {
    apresentacao.append(elemento("p", "texto", dados.vazio));
  }

  rodape.append(linkDeVolta(dados));
  for (const linha of dados.legal) rodape.append(elemento("p", "legal", linha));
  encerrarMovimento = animarTopo(titulo, mapa);
}

if (typeof document !== "undefined") montarPagina();
