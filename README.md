# Site Cheiro das Águas

## Trocar a foto de um produto

1. Coloque a nova imagem na pasta do site. As fotos atuais são provisórias.
2. Abra `js/config.js` e encontre o produto pelo `id`.
3. Troque apenas o valor de `foto` pelo caminho da nova imagem, por exemplo `img/produtos/nova-foto.webp`.
4. Atualize o `alt` para descrever a imagem real e confira o card no servidor local (`python -m http.server 8000`).

O caminho `img/logo.webp` citado em C-05 ainda depende da geração do arquivo na T8. Nesta etapa, `logo-cheiro.png` permite testar a troca isolada.
