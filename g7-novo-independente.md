# G7 — Deixar `novo/` independente (para publicar em `/novo/`) e trocar 3 fotos

> Tarefa para o Codex. Leia antes: `AGENTS.md`, `ESTADO.md` (seção "Protótipo Graza"), `g4-migracao-graza.md` ("O que NÃO pode mudar" continua valendo) e `g6-conteudo-sem-repeticao.md`. Onde esta tarefa contradisser outro documento, **esta tarefa prevalece** (aprovada por Daniel em 04/11).

## Objetivo

Daniel vai publicar a página nova em `https://cheirodasaguasgourmet.com.br/novo/` para testar com clientes, **sem mudar o site que está no ar**. A branch publicada (`prototipo`) tem versões antigas de `js/config.js`, `js/calculadora.js`, `js/pedido.js` e não tem `img/reais/`. Por isso `novo/` precisa funcionar **sozinha**: nenhum arquivo de fora da pasta. Junto, entram 3 fotos novas, que o diretor já preparou e estão em `novo/img/`.

## Parte A — `novo/` independente

1. Copie para dentro de `novo/js/`: `js/config.js`, `js/calculadora.js` e `js/pedido.js`. Troque os imports de `novo/js/*.js` para `./config.js`, `./calculadora.js`, `./pedido.js`.
2. A cópia `novo/js/config.js` passa a ser a **fonte única do `novo/`** (inclusive `textos.pagina`). Ponha no topo dela um comentário de uma linha: "Config da página nova (novo/). O site da raiz usa js/config.js."
3. **Tire `textos.pagina` do `js/config.js` da raiz** (ele só existe para o `novo/`). O resto do config da raiz fica exatamente como está no HEAD. Ajuste o `testes/experimento.test.mjs` só no que for preciso (a exclusão da chave `pagina` feita na G4 deixa de ser necessária).
4. Copie para `novo/img/` só as imagens que a página usa e que hoje vêm de fora: as de `img/reais/` (mantendo os nomes, em `novo/img/reais/`) e `img/logo.webp` (ícone). Ajuste os caminhos no `novo/js/config.js` e no `novo/index.html`. Depois disso, **nenhum caminho do `novo/` pode começar com `../`**.
5. Meta tags: o `og:image` continua absoluto (`https://cheirodasaguasgourmet.com.br/img/og.jpg`, que existe no site no ar). O `canonical` continua apontando para a raiz. **O `noindex` continua.**

## Parte B — 3 fotos (arquivos já prontos em `novo/img/`, não reprocessar)

| # | Onde | Sai | Entra | `alt` |
|---|---|---|---|---|
| 1 | Contato (o arco ao lado de "Vamos marcar uma degustação?") | `contato-600/1200.webp` (foto 10, moça com dois pacotes) | `equipe-600.webp` (600×750) e `equipe-1200.webp` (1200×1500) | "Davi e Gustavo, da Cheiro das Águas, rindo à mesa com o cappuccino" |
| 2 | Duas formas de vender, cartão "Revender o pacote" (foto pequena do arco) | a foto do produto sem açúcar (repetia a de "Produtos") | `abrindo-600.webp` (600×800) | "Mão abrindo um pacote de cappuccino Cheiro das Águas" |
| 3 | Como funciona (**lugar novo**) | — | `bule-600.webp` (600×800) e `bule-1080.webp` (1080×1440) | "Moça sorrindo com um pacote de cappuccino e um bule vermelho" |

- Na foto 1, acrescente uma legenda (`<figcaption>`, estilo Nota, 14 px, centralizada embaixo do arco): "Davi e Gustavo, à frente da Cheiro das Águas." O texto vai para `textos.pagina.contato.legenda` no `novo/js/config.js`.
- A foto 3 em **Como funciona**:
  - a partir de 920 px: duas colunas, lista à esquerda e foto à direita (`grid-template-columns: minmax(0, 1.3fr) minmax(0, .7fr)`, foto com no máximo 360 px de largura, centralizada na vertical). Use o **mesmo estilo do arco do contato** (`.contato-foto`: arco em cima, borda dourada, `aspect-ratio: 3 / 4` aqui) numa classe nova `.como-foto`; não altere `.contato-foto`;
  - abaixo de 920 px: foto **acima** da lista, `width: min(70%, 320px)`, centralizada;
  - `loading="lazy"`, `width` e `height` no `<img>`, `srcset` com as duas larguras.
  - Os dados da foto (caminhos, tamanhos, `alt`) ficam em `textos.pagina.como.foto` no `novo/js/config.js`.
- Os arquivos `novo/img/contato-600.webp` e `novo/img/contato-1200.webp` ficam sem uso: apague com `git rm`.
- Nada mais muda no CSS. As exceções desta tarefa são só as regras novas de `.como-foto`, do grid de Como funciona e da legenda do contato.

## O que não muda

`cena.js`, `palco.js`, `capitulo.js` e `conta.js` (nenhuma linha, além dos caminhos de import em `conta.js`), os valores de `ajustes`, textos (exceto a legenda nova), calculadora, `<noscript>`, site da raiz (exceto tirar `textos.pagina` do config), `experimento/`, protótipos.

## Testes (`testes/novo.test.mjs`)

Atualize o que depender de `../js/config.js` e dos caminhos. Acrescente:

1. **Independência:** nenhum arquivo de `novo/` (HTML, JS, CSS) referencia caminho com `../` nem importa algo de fora da pasta; todo arquivo referenciado existe **dentro** de `novo/`.
2. As 3 fotos novas aparecem nos lugares certos, com `alt`, `width` e `height` da tabela, e `contato-600/1200` não são mais usadas.
3. `js/config.js` da raiz é igual a `git show HEAD:js/config.js` **menos** a chave `textos.pagina` (compare o objeto importado), ou seja, o site da raiz não mudou.
4. JS próprio de `novo/js/` dentro do teto: **as cópias de `config.js`, `calculadora.js` e `pedido.js` não contam** (são dados e regras do site, não código da página). Teto continua 50.000 bytes.
5. `node --test testes/` inteiro passando.

## Verificação no navegador

**O teste principal:** copie **só** a pasta `novo/` para uma pasta temporária fora do repositório, sirva essa pasta sozinha (por exemplo `python -m http.server` dentro dela) e abra `index.html`. A página tem que funcionar inteira, sem nenhum 404. Isso simula a publicação.

Em 320, 390, 920 e 1440 px: sem rolagem lateral, console sem erros, Como funciona com a foto ao lado (≥ 920) e acima (< 920), contato com a foto e a legenda, calculadora funcionando, menu, "Pausar animações" e movimento reduzido iguais a antes.

## Fora do escopo

Commit, push, publicar, mexer na branch `prototipo`, tirar o `noindex`, outras fotos, outros textos.

## Relatório final

No formato do `AGENTS.md`, com: a lista de arquivos copiados para dentro de `novo/`, o resultado do teste com a pasta sozinha, os tamanhos (JS próprio, peso da página aberta) e capturas de Como funciona e do contato em 390 e 1440 px.
