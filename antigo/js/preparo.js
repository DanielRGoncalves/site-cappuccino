export function montarPreparo(preparo) {
  return {
    titulo: preparo.titulo,
    passos: preparo.passos.map((passo, index) => ({
      numero: String(index + 1).padStart(2, "0"),
      titulo: passo.titulo,
      descricao: passo.descricao,
    })),
    dica: preparo.dica,
    rendimento: preparo.rendimento,
  };
}
