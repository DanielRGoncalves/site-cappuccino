// Protótipo no estilo Graza. Textos do negócio vêm de js/config.js (fonte única);
// aqui ficam só os textos novos do protótipo e a escolha de onde cada um aparece.
import { config } from "../js/config.js";

const t = config.textos;
const entrega = t.faq.itens[5].resposta.replace(" pela família", "");
const pagamento = t.faq.itens[6].resposta;
const whatsapp = (mensagem) => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(mensagem)}`;

export const textos = {
  marca: config.marca,
  aviso: "Protótipo visual. Este não é o site oficial.",
  anuncio: [
    "Degustação gratuita antes da primeira venda",
    "Entrega sem taxa na Grande Vitória",
  ],
  prototipo: "Protótipo",
  menu: "Menu",
  fechar: "Fechar",
  navegacao: "Navegação do protótipo",
  links: [
    { texto: "Início", href: "#inicio" },
    { texto: "Origem", href: "#origem" },
    { texto: "O que vai dentro", href: "#cena" },
    { texto: config.textos.menu[1], href: "#produtos" },
    { texto: "Você sabia?", href: "#sabia" },
    { texto: "Duas formas de vender", href: "#vender" },
    { texto: t.preparo.titulo, href: "#preparo" },
    { texto: t.como.titulo, href: "#como" },
    { texto: t.faq.titulo, href: "#duvidas" },
    { texto: t.contato.titulo, href: "#contato" },
    { texto: "Site atual", href: "../index.html" },
  ],
  degustacaoCurta: "Degustação",
  whatsappDegustacao: whatsapp(t.whatsapp.degustacao),
  whatsappGeral: whatsapp(t.whatsapp.geral),
  hero: {
    titulo: t.hero.titulo,
    apoio: "Artesanal e gourmet, feito à mão com café Conilon e cacau 100%.",
    degustacao: t.hero.degustacao,
    verFormas: "Ver as duas formas de vender",
    foto: config.apresentacao.hero,
  },
  origem: { titulo: t.origem.titulo, texto: t.origem.texto, foto: t.origem, grande: "../experimento/img/origem-1440.webp" },
  // Título da cena da gota: "Feito à mão, do jeito simples" em duas partes desencontradas.
  titulo: [`${t.diferenca.titulo.split(", ")[0]},`, `${t.diferenca.titulo.split(", ")[1]}.`],
  plim: "*plim*",
  // Desenho, título curto (em caixa alta pelo CSS) e texto de cada parada da gota.
  paradas: [
    { desenho: "01", largura: 373, altura: 375, titulo: t.diferenca.cartoes[0].titulo, texto: t.diferenca.cartoes[0].texto },
    { desenho: "07", largura: 244, altura: 279, titulo: t.diferenca.cartoes[1].titulo, texto: t.diferenca.cartoes[1].texto },
    { desenho: "10", largura: 304, altura: 439, titulo: t.diferenca.cartoes[2].titulo, texto: t.diferenca.cartoes[2].texto },
    { desenho: "09", largura: 309, altura: 360, titulo: t.diferenca.cartoes[3].titulo, texto: t.diferenca.cartoes[3].texto },
  ],
  apoio: "Artesanal e gourmet, feito à mão com café Conilon e cacau 100%.",
  produtos: {
    titulo: t.produtos.titulo,
    igual: t.produtos.igual,
    rende: "≈ 8 xícaras",
    ingredientes: t.produtos.ingredientesTitulo,
    porKg: {
      selo: "Por kg",
      peso: "1 kg",
      meta: "Para servir",
      nome: "Cappuccino por kg",
      frase: "Vendemos por kg para quem prepara e serve na xícara.",
    },
  },
  botao: t.hero.degustacao,
  faixa: ["Café Conilon", "Cacau 100%", "Feito à mão", "Taparuba, MG"],
  pausar: "Pausar animações",
  retomar: "Retomar animações",
  sabia: {
    titulo: "Você sabia?",
    anterior: "Anterior",
    proximo: "Próximo",
    fatos: [
      t.preparo.rendimento,
      "Cacau 100%, não achocolatado.",
      t.faq.itens[1].resposta,
      t.faq.itens[3].resposta,
      t.faq.itens[4].resposta,
      entrega,
    ],
  },
  vender: {
    titulo: "Duas formas de vender",
    entrada: t.porque.motivos[0],
    fotos: [
      t.diferenca.cartoes.find((c) => c.foto.endsWith("/aroma-720.webp")),
      { ...config.produtos.find((p) => p.id === "sem-acucar"), largura: 800, altura: 800 },
    ],
    cartoes: [
      {
        titulo: t.padarias.abaXicara,
        frase: "Vendemos por kg para quem prepara e serve na xícara.",
        lista: [t.porque.motivos[2], "30 g para cada 100 ml de água fervente."],
      },
      {
        titulo: t.padarias.abaRevenda,
        frase: "Pacote de 250 g, com açúcar ou sem açúcar.",
        lista: [t.porque.motivos[1], t.porque.motivos[3], t.porque.motivos[4]],
      },
    ],
  },
  // Frase da calculadora (a mesma do experimento).
  conta: {
    vazio: "R$ —",
    titulo: "Faça a conta",
    compra: "Se eu pago R$",
    xicara: "no kg e vendo a xícara de",
    venda: "por R$",
    ganho: "ganho",
    porXicara: "por xícara.",
    pacote: "no pacote de 250 g e vendo por R$",
    porPacote: "por pacote.",
  },
  preparo: t.preparo,
  passo: "Passo",
  como: t.como,
  faq: t.faq,
  contato: {
    titulo: "Vamos marcar uma degustação?",
    texto: "A gente leva o cappuccino e a água quente, e você prova na hora. Sem custo.",
    whatsapp: "Conversar no WhatsApp",
    instagram: config.instagram,
    entregaTitulo: "Entrega",
    entrega,
    pagamentoTitulo: "Pagamento",
    pagamento,
    alt: "Mulher sorrindo atrás de dois pacotes de cappuccino Cheiro das Águas sobre a mesa",
    legal: config.dadosLegais,
    cnpj: t.contato.cnpj,
    voltar: "Voltar ao site atual",
  },
};

export { config };
