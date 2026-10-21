# Apresentação Cheiro das Águas

## Trocar a foto de um produto

1. Prepare a foto em formato WebP, quadrada, nas larguras de 800 px e 400 px. Mantenha a versão de 800 px com até 120 KB.
2. Coloque os dois arquivos em `img/produtos/`.
3. Em `js/config.js`, encontre o produto pelo `id` e atualize `foto` com o caminho da versão de 800 px e `fotoPequena` com o da versão de 400 px.
4. Atualize `alt` para descrever a foto e confira o card no servidor local.

## Mostrar os preços nos cards

Em `js/config.js`, mude `apresentacao.mostrarPrecos` de `false` para `true`. Para ocultá-los novamente, volte para `false`.

## Mudar os preços da calculadora

Em `js/config.js`, altere o `precoCentavos` de cada produto. Por exemplo, `3000` corresponde a R$ 30,00. A calculadora usa esse valor e a porção configurada em `porcaoGramas` para calcular o custo do pó por xícara.
