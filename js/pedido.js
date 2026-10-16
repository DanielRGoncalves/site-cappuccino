import { config } from "./config.js";

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatarReais(centavos) {
  return moeda.format(centavos / 100);
}

export function montarLinkWhatsApp(numero, mensagem) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

export function montarPedido(sacola, cliente) {
  const itens = sacola.map(({ produto, quantidade }) => ({
    id: produto.id,
    nome: produto.nome,
    precoCentavos: produto.precoCentavos,
    quantidade,
    subtotalCentavos: produto.precoCentavos * quantidade,
  }));

  return {
    itens,
    totalCentavos: itens.reduce((total, item) => total + item.subtotalCentavos, 0),
    cliente: {
      nome: cliente.nome,
      padaria: cliente.padaria,
      cidadeBairro: cliente.cidadeBairro,
      pagamento: cliente.pagamento,
    },
  };
}

export function montarMensagemPedido(pedido) {
  const linhas = [
    `Olá, ${config.marca}! ☕`,
    "",
    "*Novo pedido:*",
    ...pedido.itens.map(
      (item) => `• ${item.quantidade}x ${item.nome} — ${formatarReais(item.subtotalCentavos)}`,
    ),
    "",
    `*Total: ${formatarReais(pedido.totalCentavos)}*`,
    "",
    `*Cliente:* ${pedido.cliente.nome}`,
    `*Padaria:* ${pedido.cliente.padaria}`,
    `*Cidade ou bairro:* ${pedido.cliente.cidadeBairro}`,
    `*Pagamento:* ${pedido.cliente.pagamento}`,
    "",
    config.textos.whatsapp.valoresReferencia,
    config.textos.whatsapp.recebimento,
  ];
  return linhas.join("\n");
}

export function linkWhatsApp(pedido) {
  return montarLinkWhatsApp(config.whatsapp, montarMensagemPedido(pedido));
}
