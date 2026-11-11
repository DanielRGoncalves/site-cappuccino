import { encontre } from "./locais.js";

const ordem = new Intl.Collator("pt-BR");

export function agruparLocais(locais) {
  const cidades = new Map();
  for (const local of locais) {
    if (local.ativo !== true) continue;
    if (!cidades.has(local.cidade)) cidades.set(local.cidade, new Map());
    const bairros = cidades.get(local.cidade);
    if (!bairros.has(local.bairro)) bairros.set(local.bairro, []);
    bairros.get(local.bairro).push(local);
  }
  return [...cidades].sort(([a], [b]) => ordem.compare(a, b))
    .map(([cidade, bairros]) => ({
      cidade,
      bairros: [...bairros].sort(([a], [b]) => ordem.compare(a, b))
        .map(([bairro, itens]) => ({
          bairro,
          locais: itens.sort((a, b) => ordem.compare(a.nome, b.nome)),
        })),
    }));
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
  item.append(elemento("h4", "local-nome", local.nome), elemento("p", "endereco", local.endereco));
  const etiquetas = elemento("ul", "etiquetas");
  for (const modalidade of local.modalidades) {
    if (dados.etiquetas[modalidade]) etiquetas.append(elemento("li", "etiqueta", dados.etiquetas[modalidade]));
  }
  const link = elemento("a", "ver-mapa", dados.verNoMapa);
  link.href = linkDoLocal(local);
  link.target = "_blank";
  link.rel = "noopener";
  link.setAttribute("aria-label", dados.verNoMapaAcessivel.replace("{nome}", local.nome));
  item.append(etiquetas, link);
  return item;
}

export function montarPagina(dados = encontre) {
  const topo = document.getElementById("topo");
  const titulo = document.getElementById("titulo");
  const apresentacao = document.getElementById("apresentacao");
  const mapa = document.getElementById("mapa");
  const lista = document.getElementById("locais");
  const rodape = document.getElementById("rodape");
  topo.replaceChildren();
  apresentacao.replaceChildren();
  mapa.replaceChildren();
  lista.replaceChildren();
  rodape.replaceChildren();
  titulo.textContent = dados.titulo;

  const marca = elemento("a", "marca");
  marca.href = "../index.html";
  const logo = elemento("img");
  logo.src = "../img/logo.webp";
  logo.width = 56;
  logo.height = 56;
  logo.alt = "";
  marca.append(logo, elemento("span", "", dados.marca));
  topo.append(marca);

  const grupos = agruparLocais(dados.locais);
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
      const cidade = elemento("section", "cidade");
      cidade.append(elemento("h2", "cidade-titulo", grupo.cidade));
      for (const grupoBairro of grupo.bairros) {
        const bairro = elemento("div", "bairro");
        const itens = elemento("ul", "lista-locais");
        for (const local of grupoBairro.locais) itens.append(montarLocal(local, dados));
        bairro.append(elemento("h3", "bairro-titulo", grupoBairro.bairro), itens);
        cidade.append(bairro);
      }
      lista.append(cidade);
    }
  } else {
    apresentacao.append(elemento("p", "texto", dados.vazio));
  }

  rodape.append(linkDeVolta(dados));
  for (const linha of dados.legal) rodape.append(elemento("p", "legal", linha));
}

if (typeof document !== "undefined") montarPagina();
