# Protótipo de apresentação para padarias

> **Este arquivo substitui `tarefas.md` e prevalece sobre `brief.md` e `criterios.md`** nesta branch (`prototipo`). Execute só a tarefa **Pn** pedida. Em caso de contradição entre este arquivo e os outros documentos, **este vence** (não precisa perguntar). Todas as demais regras do `AGENTS.md` continuam valendo (config único, sem frameworks, sem `innerHTML` com dados, acessibilidade, imagens com `width`/`height`/`alt`, um commit por tarefa com a mensagem `Pn: resumo`, sem push). Os critérios `C-xx` e `H-xx` antigos **não valem** aqui, só os `P-xx` abaixo. Se algo faltar, **pare e pergunte**.

## Objetivo

O site deixa de ser uma loja e vira uma **apresentação para o dono da padaria**: por que vender este cappuccino, quanto rende e como pedir uma degustação. Será mostrado no PC ou no celular, na própria padaria ou por link. Não há venda no site: a ação final é falar com a família pelo WhatsApp.

## Decisões (não mude)

1. **Só 2 produtos aparecem:** com açúcar e sem açúcar. O descafeinado continua no config com `exibir: false` e **não aparece em lugar nenhum** (cards, calculadora, FAQ, textos).
2. **Sem loja:** sem sacola, sem checkout, sem campos de cliente, sem botão "adicionar". A versão com loja está guardada na tag `loja-v1`.
3. **Preços ocultos por padrão.** Interruptor no config: `apresentacao.mostrarPrecos: false`. Com `true`, cada card mostra o preço do pacote (o `precoCentavos` do produto). Com `false`, nenhum preço aparece nos cards.
4. **A calculadora fica** (seção `#padarias`, com os textos e valores de referência que já existem). Ela usa o `precoCentavos` do pacote e continua com o aviso de que os valores são de referência. Só passa a oferecer os 2 produtos que têm `exibir: true`.
5. **Nada de "premium"**, nem benefícios de saúde, nem fatos inventados. Só use os fatos e textos desta página.
6. **Foto:** a que já existe (`cappuccino-tradicional.png`), a mesma para os 2 produtos.

## Fatos permitidos

- Cappuccino com cacau 100%, pacote de 250 g, com açúcar e sem açúcar.
- Preparo: 30 g na xícara (cerca de 3 colheres), 100 ml de água fervente, mexer devagar até dissolver.
- Um pacote de 250 g rende cerca de 8 xícaras.
- Validade de 365 dias; guardar em local seco e protegido da luz solar.
- Entrega feita pela família na Grande Vitória, sem taxa, de um dia para o outro.
- Antes da primeira venda, a família faz uma degustação.
- Pagamento: Pix, cartão na maquininha na entrega ou dinheiro.
- Contato por WhatsApp e Instagram; dados legais, do config.

## Estrutura e textos da página (ordem fixa)

Menu do cabeçalho (celular e PC): **Produtos** (`#produtos`), **Por que vender** (`#porque`), **A conta** (`#padarias`), **Como funciona** (`#como`), **Dúvidas** (`#faq`), **Contato** (`#contato`).

1. **Hero.** Título: "Cappuccino com cacau 100% para a sua padaria". Subtítulo: "Pó pronto para preparar com água quente. Entregamos na Grande Vitória, sem taxa. Antes de qualquer venda, você prova." Botão principal: **"Pedir degustação"** (WhatsApp, mensagem de degustação do config). Botão secundário: **"Ver a conta da padaria"** (rola até `#padarias`).
2. **Produtos** (`#produtos`). Cards dos 2 produtos: foto, nome, peso, descrição (do config) e, só se `mostrarPrecos` for `true`, o preço.
3. **Por que vender** (`#porque`). 4 cartões, nesta ordem: "Rende cerca de 8 xícaras por pacote de 250 g." / "Preparo em 3 passos, só com água quente." / "Validade de 365 dias." / "Entrega sem taxa na Grande Vitória, de um dia para o outro."
4. **A conta** (`#padarias`): a calculadora que já existe. Não mude os textos dela.
5. **Como preparar** (`#preparo`): gerado de `textos.preparo` do config, como já é.
6. **Como funciona** (`#como`). 3 passos: "1. Você pede uma degustação pelo WhatsApp." / "2. Fazemos a degustação antes da primeira venda e combinamos os detalhes." / "3. Se gostar, faz o pedido e entregamos, sem taxa. Pagamento por Pix, cartão na maquininha na entrega ou dinheiro."
7. **Dúvidas** (`#faq`, `<details>`/`<summary>`): 6 itens com estas perguntas, respondidos só com os fatos permitidos: "Como funciona a degustação?", "Quanto rende um pacote?", "Como preparar?", "Quanto tempo dura?", "Como é a entrega?", "Como posso pagar?".
8. **Contato** (`#contato`): botão WhatsApp (mensagem geral do config), Instagram, dados legais.
9. **Botão flutuante de WhatsApp** no canto inferior (mensagem geral do config), sempre visível.

História e depoimentos continuam ocultos (padrão "oculta se vazia").

## Tarefas

### P1 — Enxugar: sair da loja, ficar com 2 produtos
- Remover sacola, checkout, botões "adicionar" e tudo que só serve à loja (HTML, CSS, JS). Remover arquivos que ficarem sem uso com `git rm`. Manter em `js/pedido.js` só o que ainda for usado (formatação de R$ e `linkWhatsApp` simples para mensagens fixas). Atualizar os testes.
- Em `js/config.js`: `exibir: true/false` por produto (descafeinado `false`) e `apresentacao: { mostrarPrecos: false }`.
- Cards só dos produtos com `exibir: true`; preço só com `mostrarPrecos: true`.
- **Pronto quando:** P-01, P-02, P-03, P-09, P-10.

### P2 — Estrutura nova e textos
- Montar as seções 1 a 9 acima, com os textos exatos. Textos fixos de apresentação vão para o config (objeto `textos`). Menu com os 6 itens; `scroll-margin-top` nas seções.
- Botões "Pedir degustação" com `href` válido no HTML (ex.: `#contato`) que o JS troca pelo link do WhatsApp.
- **Pronto quando:** P-04, P-05, P-06, P-07, P-09, P-10.

### P3 — Calculadora só com os 2 produtos
- A calculadora oferece só os produtos com `exibir: true`. Mantém os textos, o aviso e os valores de referência. Atualizar os testes.
- **Pronto quando:** P-08, P-09.

### P4 — Imagens leves e meta tags
- `img/produtos/provisoria-800.webp` (≤ 120 KB) e `-400.webp` com `srcset`; logo em WebP (≤ 40 KB); originais para `img/originais/`; `img/og.jpg` (1200×630, ≤ 300 KB) com foto e logo, **sem preço**.
- Meta tags no bloco `SINCRONIZAR` (título, descrição, Open Graph, Twitter, favicon, `apple-touch-icon`), com a URL do GitHub Pages do config. Descrição: cappuccino para padarias, sem preço e **sem a palavra "premium"**.
- README: como trocar a foto (até 5 passos), como ligar os preços (`mostrarPrecos`) e como mudar os preços da calculadora.
- **Pronto quando:** P-11, P-12.

### P5 — Celular, PC e acessibilidade
- Remover `overflow-x: hidden` de `html`/`body` e corrigir o que transbordar. Conferir 360, 768 e 1280 px com o menu aberto e fechado.
- Botões com tamanho confortável para toque; foco visível; contraste legível.
- **Pronto quando:** P-13, P-14.

### P6 — Publicar e Lighthouse
- **Daniel (manual):** publicar a branch `prototipo` no GitHub Pages (Settings → Pages), ou fazer o merge em `main` se preferir.
- **Executor:** rodar o Lighthouse na URL publicada (celular) e corrigir o que impedir 90+ em todas as categorias. Listar todos os links e o status de cada um.
- **Pronto quando:** P-15, P-16.

## Critérios

| ID | Critério | Como verificar |
|---|---|---|
| P-01 | Não existe sacola, checkout, botão "adicionar" nem campo de cliente. | Visual e busca no código. |
| P-02 | Aparecem exatamente 2 produtos (com açúcar e sem açúcar). "Descafeinado" não aparece em nenhum texto renderizado. | Visual e busca no texto da página. |
| P-03 | Com `mostrarPrecos: false` não há "R$" nos cards; com `true`, cada card mostra o preço do config. | Trocar o valor, ver, desfazer. |
| P-04 | As seções existem na ordem e com os ids e textos de "Estrutura e textos" acima. | Leitura da página e do HTML. |
| P-05 | Menu com os 6 itens funciona no PC e no celular (abre, fecha, rola até a seção). | Visual a 360 e 1280 px. |
| P-06 | "Pedir degustação" (hero) e o botão flutuante têm `href` do WhatsApp com a mensagem certa do config, codificada. O hero tem `href` válido no HTML antes do JS. | Inspecionar `href`; ver o HTML cru. |
| P-07 | O FAQ tem 6 itens, só com fatos permitidos, e nenhum texto de feira, retirada, frete ou pagamento online. | Leitura. |
| P-08 | A calculadora mostra só os 2 produtos; os valores de referência dão R$ 3,60 (com açúcar) e R$ 4,20 (sem açúcar) por xícara de pó. | `node --test` e conferência manual. |
| P-09 | `node --test testes/` passa. | Rodar o comando. |
| P-10 | Textos fixos, contatos, preços e produtos vêm do config; a palavra "premium" não existe no projeto. | Busca no projeto. |
| P-11 | Imagens em WebP com `srcset`, `width`, `height` e `alt`; tamanhos dentro dos limites; `og.jpg` 1200×630 ≤ 300 KB sem preço. | Tamanho dos arquivos e HTML. |
| P-12 | Meta tags completas e sincronizadas com o config; prévia do link no WhatsApp com título, descrição e imagem. | Ler o `<head>`; testar o link. |
| P-13 | A 360, 768 e 1280 px: sem rolagem horizontal, sem `overflow-x: hidden` em `html`/`body`, 0 erros e 0 avisos no console. | DevTools. |
| P-14 | Navegação por teclado alcança menu, botões, calculadora e FAQ com foco visível. | Teste com Tab. |
| P-15 | Lighthouse no celular com 90+ em Desempenho, Acessibilidade, Boas práticas e SEO. | Relatório do Lighthouse. |
| P-16 | Todos os links da página funcionam. | Lista de links com status. |

## Verificação humana (Daniel)

- Abrir no PC e no celular real e passar pelo site inteiro como se fosse mostrar a um dono de padaria.
- Confirmar com a família: preços e valores da calculadora, prazo de entrega, como funciona a degustação.
- Conferir a prévia do link no WhatsApp depois de publicar.
