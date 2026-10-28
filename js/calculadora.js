export function coposPorPacote(pesoPacoteGramas, porcaoGramas) {
  if (![pesoPacoteGramas, porcaoGramas].every((valor) => Number.isFinite(valor) && valor > 0)) return null;
  const copos = Math.floor(pesoPacoteGramas / porcaoGramas);
  return Number.isSafeInteger(copos) ? copos : null;
}

export function precoVendaCentavos(valor) {
  const texto = String(valor ?? "").trim();
  if (!/^\d+(?:[,.]\d{1,2})?$/.test(texto)) return null;
  const centavos = Math.round(Number(texto.replace(",", ".")) * 100);
  return Number.isSafeInteger(centavos) && centavos > 0 ? centavos : null;
}

export function calcularResultado(precoVenda, precoPacote, pesoPacoteGramas, porcaoGramas) {
  const vendaCentavos = precoVendaCentavos(precoVenda);
  const pacoteCentavos = precoVendaCentavos(precoPacote);
  const copos = coposPorPacote(pesoPacoteGramas, porcaoGramas);
  if (vendaCentavos === null || pacoteCentavos === null || copos === null) return null;

  const custoCentavos = (pacoteCentavos * porcaoGramas) / pesoPacoteGramas;
  const ganhoCentavos = vendaCentavos - custoCentavos;
  const resultado = {
    copos,
    custoCentavos,
    ganhoCentavos,
    margemPercentual: (ganhoCentavos / vendaCentavos) * 100,
    ganhoPacoteCentavos: ganhoCentavos * copos,
  };
  return Object.values(resultado).every(Number.isFinite) ? resultado : null;
}
