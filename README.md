# Apresentação Cheiro das Águas

## Trocar a foto de um produto

1. Abra [squoosh.app](https://squoosh.app/), clique em **Drop OR Paste** e selecione uma foto quadrada.
2. No painel da direita, ative **Resize**, mantenha as proporções e digite **800** em **Width**; em **Compress**, escolha **WebP** e ajuste a qualidade até a prévia ficar com no máximo **120 KB**.
3. Clique no botão de download e salve como `nome-800.webp`. Mude **Width** para **400**, clique em download outra vez e salve como `nome-400.webp`.
4. Coloque os dois arquivos em `img/produtos/`. Em `js/config.js`, encontre o produto pelo `id` e atualize `foto` com o caminho de `nome-800.webp` e `fotoPequena` com o de `nome-400.webp`.
5. Atualize `alt` para descrever a foto e confira o card no servidor local.

## Mostrar os preços nos cards

Em `js/config.js`, mude `apresentacao.mostrarPrecos` de `false` para `true`. Para ocultá-los novamente, volte para `false`.

## Mudar os preços da calculadora

Em `js/config.js`, altere o `precoCentavos` de cada produto. Por exemplo, `3000` corresponde a R$ 30,00. A calculadora usa esse valor e a porção configurada em `porcaoGramas` para calcular o custo do pó por xícara.

Os textos dos diferenciais ficam em `js/config.js`, em `textos.diferenca`; quando a família informar os dados do cappuccino sem açúcar, preencha os campos `ingredientes` e `avisos` desse produto no mesmo arquivo.
