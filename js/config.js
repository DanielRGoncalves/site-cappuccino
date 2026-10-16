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
  produtos: [
    {
      id: "com-acucar",
      nome: "Cappuccino com açúcar",
      descricao: "Com cacau 100%.",
      peso: "250 g",
      precoCentavos: 2200,
      foto: "cappuccino-tradicional.png",
      alt: "Foto provisória do cappuccino com açúcar",
    },
    {
      id: "sem-acucar",
      nome: "Cappuccino sem açúcar",
      descricao: "Com cacau 100%.",
      peso: "250 g",
      precoCentavos: 3000,
      foto: "cappuccino-tradicional.png",
      alt: "Foto provisória do cappuccino sem açúcar",
    },
    {
      id: "descafeinado",
      nome: "Cappuccino descafeinado",
      descricao: "Com cacau 100%.",
      peso: "250 g",
      precoCentavos: 3000,
      foto: "cappuccino-tradicional.png",
      alt: "Foto provisória do cappuccino descafeinado",
    },
  ],
  historia: "",
  depoimentos: [],
  textos: {
    introducaoProdutos: "",
    conservacao: "Local seco e protegido da luz solar",
    preparo: {
      passos: [
        { titulo: "30 g na xícara.", descricao: "Cerca de 3 colheres." },
        { titulo: "100 ml de água fervente.", descricao: "Despeje sobre o pó." },
        { titulo: "Mexa devagar.", descricao: "Até dissolver por completo." },
      ],
      dica: "Quer mais cremoso? Use um pouco menos de água.",
      rendimento: "Um pacote de 250 g rende cerca de 8 xícaras.",
    },
  },
};
