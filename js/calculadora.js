export function xicarasPorPacote(pesoPacoteGramas, porcaoGramas) {
  return Math.floor(pesoPacoteGramas / porcaoGramas);
}

export function custoPoPorXicara(precoPacoteCentavos, pesoPacoteGramas, porcaoGramas) {
  return (precoPacoteCentavos * porcaoGramas) / pesoPacoteGramas;
}

export function precoVendaCentavos(valor) {
  const texto = String(valor ?? "").trim();
  if (!/^\d+(?:[,.]\d{1,2})?$/.test(texto)) return null;
  const centavos = Math.round(Number(texto.replace(",", ".")) * 100);
  return Number.isSafeInteger(centavos) && centavos > 0 ? centavos : null;
}

export function calcularResultado(precoVenda, precoPacoteCentavos, pesoPacoteGramas, porcaoGramas) {
  const vendaCentavos = precoVendaCentavos(precoVenda);
  if (vendaCentavos === null) return null;

  const xicaras = xicarasPorPacote(pesoPacoteGramas, porcaoGramas);
  const custoCentavos = custoPoPorXicara(precoPacoteCentavos, pesoPacoteGramas, porcaoGramas);
  const ganhoCentavos = vendaCentavos - custoCentavos;

  return {
    xicaras,
    custoCentavos,
    ganhoCentavos,
    margemPercentual: (ganhoCentavos / vendaCentavos) * 100,
    ganhoPacoteCentavos: ganhoCentavos * xicaras,
  };
}
