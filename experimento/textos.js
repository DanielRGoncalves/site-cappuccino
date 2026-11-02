import { config } from "../js/config.js";

export const textos = {
  aviso: "Experimento visual. Este não é o site oficial.",
  menu: "Menu",
  fechar: "Fechar",
  navegacao: "Navegação do experimento",
  links: [
    { texto: "Origem", href: "#origem" },
    { texto: config.textos.menu[1], href: "#produtos" },
    { texto: "Duas formas de vender", href: "#vender" },
    { texto: config.textos.preparo.titulo, href: "#preparo" },
    { texto: config.textos.como.titulo, href: "#como" },
    { texto: config.textos.faq.titulo, href: "#duvidas" },
    { texto: config.textos.contato.titulo, href: "#contato" },
    { texto: "Site atual", href: "../index.html" },
  ],
  apoio: "Artesanal e gourmet, feito à mão com café Conilon e cacau 100%.",
  verFormas: "Ver as duas formas de vender",
  voltar: "Voltar ao site atual",
  produtos: { conteudo: "O que vai dentro", rendimento: "Rendimento", validade: "Validade", conservacao: "Conservação" },
  contato: {
    entrega: "Entrega",
    pagamento: "Pagamento",
    titulo: "Vamos marcar uma degustação?",
    texto: "A gente leva o cappuccino e a água quente, e você prova na hora. Sem custo.",
    botao: "Conversar no WhatsApp",
    alt: "Mulher sorrindo atrás de dois pacotes de cappuccino Cheiro das Águas sobre a mesa",
  },
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
  vender: {
    titulo: "Duas formas de vender",
    abas: [
      {
        titulo: config.textos.padarias.abaXicara,
        frase: "Vendemos por kg para quem prepara e serve na xícara.",
        lista: [
          config.textos.porque.motivos[2],
          "30 g para cada 100 ml de água fervente.",
        ],
      },
      {
        titulo: config.textos.padarias.abaRevenda,
        frase: "Pacote de 250 g, com açúcar ou sem açúcar.",
        lista: [
          config.textos.porque.motivos[1],
          config.textos.porque.motivos[3],
          config.textos.porque.motivos[4],
        ],
      },
    ],
  },
};
