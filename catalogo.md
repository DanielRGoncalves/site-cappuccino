# Tarefa extra — Catálogo para padarias (`catalogo.html`)

> **Esta tarefa não está em `tarefas.md`.** Para esta tarefa, ela vale no lugar da regra "só a tarefa pedida em `tarefas.md`". Todas as demais regras do `AGENTS.md` continuam valendo (config único, sem frameworks, sem `innerHTML` com dados, acessibilidade, commit único). Em caso de contradição entre este arquivo e `brief.md`, **pare e pergunte**.

## O que é

Uma página nova, **separada da loja**, para mostrar os produtos às padarias: `catalogo.html`, na raiz do projeto. Usa o mesmo CSS e a mesma identidade visual do site. Tem que abrir bem no celular e **imprimir bem** (para o Daniel salvar em PDF e mandar pelo WhatsApp ou mostrar à padaria).

## Decisões já tomadas (não mude)

1. **Só 2 produtos:** cappuccino com açúcar e cappuccino sem açúcar. O **descafeinado fica de fora, momentaneamente**: ele continua existindo em `js/config.js`, mas com `emCatalogo: false`.
2. **Preços do catálogo separados dos da loja.** Ficam num bloco próprio do config, em centavos, e **não** leem o `precoCentavos` da loja. Valores iniciais: com açúcar `3000`, sem açúcar `3500` (provisórios; a confirmar com a família).
3. **Interruptor de preços:** `catalogo.mostrarPrecos` (`true` ou `false`). Com `false`, a página não mostra nenhum preço.
4. **Foto:** a que já existe (`cappuccino-tradicional.png`), a mesma para os 2 produtos. Gerar uma cópia leve só para o catálogo (ver passo 4). Não apagar nem mover o original.
5. **Sem** sacola, checkout, calculadora, menu nem botão flutuante. A loja (`index.html`) **não muda**.

## Conteúdo da página (só textos do `brief.md` e do `config.js`)

1. Cabeçalho simples: logo e nome da marca (do config).
2. Título e subtítulo vindos de `catalogo.titulo` e `catalogo.subtitulo` do config. Valores: título **"Catálogo para padarias"**; subtítulo **"Cappuccino com cacau 100%, pronto com água quente."**
3. Dois cards de produto: foto, nome, peso (250 g), descrição (do config) e preço (se `mostrarPrecos` for `true`).
4. Bloco "Como preparar": os 3 passos, a dica e o rendimento, do mesmo lugar do config que a loja já usa (`textos.preparo`). Não duplicar texto.
5. Linha com validade (365 dias) e conservação (do config).
6. Botão **"Pedir degustação"**: abre o WhatsApp com a mensagem de degustação do config (a mesma da loja), codificada com `encodeURIComponent`.
7. Rodapé: Instagram, WhatsApp e dados legais, vindos do config.

## Passos

1. **`js/config.js`:** adicionar `emCatalogo: true/false` em cada produto (descafeinado `false`) e o bloco:
   ```js
   catalogo: {
     titulo: "Catálogo para padarias",
     subtitulo: "Cappuccino com cacau 100%, pronto com água quente.",
     mostrarPrecos: true,
     precos: { "com-acucar": 3000, "sem-acucar": 3500 },
     foto: "img/produtos/catalogo-800.webp",
   },
   ```
2. **`js/catalogo.js`** (módulo): função pura `produtosDoCatalogo(config)` (sem DOM) que devolve só os produtos com `emCatalogo: true`, cada um com o preço do bloco `catalogo.precos` (ou `null` se `mostrarPrecos` for `false`). Outra parte monta a página no navegador. Reaproveitar a formatação de R$ do `js/pedido.js`.
3. **`catalogo.html`:** estrutura só com contêineres; o conteúdo é montado pelo JS a partir do config. Meta tags básicas (título e descrição) escritas à mão, **sem preço**, dentro de um bloco `SINCRONIZAR COM js/config.js` como manda o AGENTS.md.
4. **Imagem leve:** gerar `img/produtos/catalogo-800.webp` (800 px de largura, **≤ 120 KB**) a partir de `cappuccino-tradicional.png`. Toda `<img>` com `width`, `height` e `alt` útil.
5. **CSS:** reaproveitar `css/style.css` e acrescentar só o necessário para a página. Incluir `@media print`: **fundo branco, texto escuro, sem sombras**, cartões sem quebrar no meio da página, e o botão "Pedir degustação" visível, mas sem prejudicar a impressão.
6. **Testes:** `testes/catalogo.test.mjs` para `produtosDoCatalogo` (ver critérios).
7. **README.md:** acrescentar uma seção curta: como mudar os preços do catálogo, como esconder os preços e como salvar a página em PDF (Ctrl+P → "Salvar como PDF").
8. Não mexer em `index.html`, no checkout, na calculadora nem em nenhum outro item da loja. Se algo fora do escopo for necessário, pare e pergunte.

## Critérios (todos precisam passar)

| ID | Critério | Como verificar |
|---|---|---|
| K-01 | A página mostra exatamente 2 produtos (com açúcar e sem açúcar) e **nenhuma** menção a "descafeinado". | Visual e busca no texto renderizado. |
| K-02 | Os preços vêm só de `catalogo.precos`. Mudar o preço da loja não muda o catálogo, e o inverso. | Teste manual nos dois sentidos, desfazendo depois. |
| K-03 | Com `mostrarPrecos: false` não aparece nenhum preço, nem "R$", nem espaço vazio. | Teste manual e automático. |
| K-04 | A foto do catálogo é WebP, ≤ 120 KB, 800 px, com `width`, `height` e `alt`. O original continua no lugar. | Tamanho do arquivo e leitura do HTML. |
| K-05 | O botão "Pedir degustação" tem `href` para `https://wa.me/<número do config>?text=` com a mensagem de degustação do config, codificada. | Inspecionar o `href`; teste em celular real. |
| K-06 | A 360 e a 1280 px: sem rolagem horizontal (`document.documentElement.scrollWidth <= 360` a 360 px), sem `overflow-x: hidden` em `html`/`body`, e 0 erros e 0 avisos no console. | DevTools. |
| K-07 | Impressão (Ctrl+P, A4): fundo branco, texto legível, sem botão cortado e sem card partido ao meio. | Visualização de impressão. |
| K-08 | Preparo, validade, conservação, Instagram, WhatsApp e dados legais vêm do config, sem texto novo escrito à mão no HTML. | Procurar os textos fora do config. |
| K-09 | `node --test testes/` passa, incluindo os testes novos (2 produtos, preços separados, `mostrarPrecos: false`, descafeinado excluído). | Rodar o comando. |
| K-10 | A loja não mudou: o diff do `index.html` é vazio e a loja ainda mostra os 3 produtos com os preços dela. | `git diff` e abrir a loja. |

## Verificação humana (Daniel)

- Abrir `catalogo.html` pelo servidor local no celular (ou DevTools a 360 px) e ler tudo em voz alta.
- Visualização de impressão em A4 e salvar um PDF de teste.
- Confirmar com a família: os preços do catálogo (H-18) e o texto da degustação (H-17).

## Commit

Um commit só, com a mensagem `Catálogo: página para padarias`. Sem push. Termine com o relatório final do `AGENTS.md`, citando K-01 a K-10.
