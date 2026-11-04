const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatarReais(centavos) {
  return moeda.format(centavos / 100);
}

export function linkWhatsApp(numero, mensagem) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

export function validarDegustacao(cliente, textos) {
  const erros = {};
  if (!String(cliente.nome ?? "").trim()) erros.nome = textos.erros.nome;
  if (!textos.tipos.includes(cliente.tipo)) erros.tipo = textos.erros.tipo;
  if (!String(cliente.local ?? "").trim()) erros.local = textos.erros.local;
  return erros;
}

export function montarMensagemDegustacao(cliente, textos) {
  const quantidade = String(cliente.quantidade ?? "").trim();
  const numero = Number(quantidade);
  const porDia = quantidade && Number.isSafeInteger(numero) && numero >= 0
    ? String(numero) : textos.naoInformado;
  // Cada campo ocupa uma linha, mesmo se a função receber texto com quebras.
  const linha = (valor) => String(valor ?? "").trim().replace(/[\r\n]+/g, " ");
  return [
    textos.inicio,
    `${textos.negocio} ${linha(cliente.nome)} (${linha(cliente.tipo)})`,
    `${textos.local} ${linha(cliente.local)}`,
    `${textos.quantidade} ${porDia}`,
  ].join("\n");
}
