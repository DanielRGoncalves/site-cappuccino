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

// Mantém o percurso e o recorte da X1, desenhando a foto já no tamanho final.
export function escalaDoArco(mover, largura, altura, larguraFinal, alturaFinal) {
  if (![mover, largura, altura, larguraFinal, alturaFinal].every(valido)
    || Math.min(largura, altura, larguraFinal, alturaFinal) <= 0) return null;
  const p = limitar(mover);
  const finalX = larguraFinal / largura;
  const finalY = alturaFinal / altura;
  const finalFoto = Math.max(finalX, finalY);
  const antigoX = 1 + (finalX - 1) * p;
  const antigoY = 1 + (finalY - 1) * p;
  const sx = antigoX / finalX;
  const sy = antigoY / finalY;
  const foto = Math.max(antigoX, antigoY) / finalFoto;
  return {
    sx, sy, fotoSx: foto / sx, fotoSy: foto / sy,
    larguraFoto: largura * finalFoto, alturaFoto: altura * finalFoto,
  };
}
