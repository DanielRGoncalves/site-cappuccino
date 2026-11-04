export function produtosVisiveis(produtos) {
  return produtos.filter((produto) => produto.exibir);
}

export function indiceDaAba(atual, tecla, total) {
  if (total < 1) return -1;
  if (tecla === "ArrowRight") return (atual + 1) % total;
  if (tecla === "ArrowLeft") return (atual + total - 1) % total;
  if (tecla === "Home") return 0;
  if (tecla === "End") return total - 1;
  return atual;
}
