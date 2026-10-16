export const config = {
  marca: "Cheiro das Águas",
  siteUrl: "https://danielrgoncalves.github.io/site-cappuccino/",
  whatsapp: "5527998480547",
  instagram: {
    url: "https://instagram.com/cheirodasaguasgourmet",
    usuario: "@cheirodasaguasgourmet",
  },
  logo: {
    foto: "logo-cheiro.png",
    alt: "Cheiro das Águas",
  },
  dadosLegais: {
    razaoSocial: "Agropecuária Cheiro das Águas Ltda.",
    cnpj: "57.813.645/0001-60",
    endereco: "CRG Santa Clara, S/N, Taparuba/MG, 36953-000",
  },
  formasPagamento: ["PIX", "Dinheiro"],
  pesoPacoteGramas: 250,
  porcaoGramas: 30,
  produtos: [
    {
      id: "com-acucar",
      nome: "Cappuccino com açúcar",
      descricao: "Com cacau 100%.",
      peso: "250 g",
      precoCentavos: 3000,
      foto: "cappuccino-tradicional.png",
      alt: "Foto provisória do cappuccino com açúcar",
    },
    {
      id: "sem-acucar",
      nome: "Cappuccino sem açúcar",
      descricao: "Com cacau 100%.",
      peso: "250 g",
      precoCentavos: 3500,
      foto: "cappuccino-tradicional.png",
      alt: "Foto provisória do cappuccino sem açúcar",
    },
    {
      id: "descafeinado",
      nome: "Cappuccino descafeinado",
      descricao: "Com cacau 100%.",
      peso: "250 g",
      precoCentavos: 3500,
      foto: "cappuccino-tradicional.png",
      alt: "Foto provisória do cappuccino descafeinado",
    },
  ],
  historia: "",
  depoimentos: [],
  textos: {
    pagamentoACombinar: "Combinar pelo WhatsApp",
    whatsapp: {
      amostra: "Olá! Vi o site e quero pedir uma amostra do cappuccino para a minha padaria.",
      valoresReferencia: "Valores de referência, a confirmar.",
      recebimento: "Entrega ou retirada: a combinar.",
    },
    introducaoProdutos: "",
    padarias: {
      titulo: "Quanto rende na sua padaria",
      descricao:
        "Cada xícara leva 30 g. Um pacote de 250 g rende cerca de 8 xícaras. Digite por quanto você vende a xícara e veja a conta.",
      aviso:
        "A conta considera só o custo do cappuccino em pó. Copo, energia, perdas e outros custos não entram.",
    },
    conservacao: "Local seco e protegido da luz solar",
    preparo: {
      titulo: "Como preparar",
      passos: [
        { titulo: "30 g na xícara.", descricao: "Cerca de 3 colheres." },
        {
          titulo: "100 ml de água fervente.",
          descricao: "Despeje sobre o pó.",
        },
        { titulo: "Mexa devagar.", descricao: "Até dissolver por completo." },
      ],
      dica: "Quer mais cremoso? Use um pouco menos de água.",
      rendimento: "Um pacote de 250 g rende cerca de 8 xícaras.",
    },
  },
};
