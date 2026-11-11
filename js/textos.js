import { config } from "./config.js";
const t = config.textos;
const p = t.pagina;
const entrega = t.faq.itens[5].resposta.replace(" pela família", "");
const pagamento = t.faq.itens[6].resposta;
const whatsapp = (mensagem) => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(mensagem)}`;
export const textos = {
  marca: config.marca,
  pular: p.pular,
  destaques: p.destaques,
  anuncio: p.anuncio,
  menu: p.menu,
  fechar: p.fechar,
  navegacao: p.navegacao,
  links: p.links,
  degustacaoCurta: p.degustacaoCurta,
  whatsappDegustacao: whatsapp(t.whatsapp.degustacao),
  whatsappGeral: whatsapp(t.whatsapp.geral),
  hero: {
    titulo: t.hero.titulo,
    apoio: `${t.hero.subtitulo.split(":")[0]}.`,
    degustacao: t.hero.degustacao,
    verFormas: p.verFormas,
    foto: config.apresentacao.hero,
  },
  origem: { titulo: p.origem.titulo, texto: p.origem.texto, foto: t.origem, grande: p.origemGrande },
  titulo: [`${t.diferenca.titulo.split(", ")[0]},`, `${t.diferenca.titulo.split(", ")[1]}.`],
  plim: p.plim,
  paradas: [
    {
      desenho: "01",
      largura: 373,
      altura: 375,
      titulo: t.diferenca.cartoes[0].titulo,
      texto: p.paradas[0],
    },
    {
      desenho: "07",
      largura: 244,
      altura: 279,
      titulo: t.diferenca.cartoes[1].titulo,
      texto: t.diferenca.cartoes[1].texto,
    },
    {
      desenho: "10",
      largura: 304,
      altura: 439,
      titulo: t.diferenca.cartoes[2].titulo,
      texto: p.paradas[2],
    },
    {
      desenho: "09",
      largura: 309,
      altura: 360,
      titulo: t.diferenca.cartoes[3].titulo,
      texto: t.diferenca.cartoes[3].texto,
    },
  ],
  apoio: t.diferenca.destaque,
  produtos: {
    titulo: t.produtos.titulo,
    igual: p.produtosIgual,
    rende: p.rende,
    ingredientes: t.produtos.ingredientesTitulo,
  },
  botao: t.hero.degustacao,
  faixa: p.faixa,
  pausar: p.pausar,
  retomar: p.retomar,
  vender: {
    titulo: p.venderTitulo,
    entrada: p.venderEntrada,
    fotos: [
      t.diferenca.cartoes.find((c) => c.foto.endsWith("/aroma-720.webp")),
      p.venderFoto,
    ],
    cartoes: [
      { titulo: t.padarias.abaXicara, frase: p.venderXicara, lista: [p.venderSemLeite] },
      {
        titulo: t.padarias.abaRevenda,
        frase: p.venderPacote,
        lista: [t.porque.motivos[3]],
      },
    ],
  },
  conta: p.conta,
  preparo: t.preparo,
  passo: p.passo,
  como: { ...t.como, foto: p.como.foto, passos: [t.como.passos[0], t.como.passos[1], p.comoPasso3] },
  encontre: p.encontre,
  contato: {
    titulo: p.contato.titulo,
    texto: p.contato.texto,
    whatsapp: p.contato.whatsapp,
    instagram: config.instagram,
    entregaTitulo: p.contato.entregaTitulo,
    entrega,
    pagamentoTitulo: p.contato.pagamentoTitulo,
    pagamento,
    conservacaoTitulo: p.contato.conservacaoTitulo,
    conservacao: t.conservacao,
    alt: p.contato.alt,
    legenda: p.contato.legenda,
    legal: config.dadosLegais,
    cnpj: t.contato.cnpj,
  },
};
export { config };
