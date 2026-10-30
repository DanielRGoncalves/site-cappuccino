const valido = (valor) => typeof valor === "number" && Number.isFinite(valor);
const limitar = (valor) => Math.min(1, Math.max(0, valor));

export function progressoDoCapitulo(topoDoWrapper, alturaDoWrapper, alturaDaJanela) {
  if (![topoDoWrapper, alturaDoWrapper, alturaDaJanela].every(valido)) return 0;
  if (alturaDaJanela <= 0 || alturaDoWrapper <= alturaDaJanela) return 0;
  return limitar(-topoDoWrapper / (alturaDoWrapper - alturaDaJanela));
}

export function faixa(p, inicio, fim) {
  if (![p, inicio, fim].every(valido) || fim <= inicio) return 0;
  return limitar((p - inicio) / (fim - inicio));
}
