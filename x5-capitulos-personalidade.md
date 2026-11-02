# X5 — Personalidade dos capítulos: origem → produtos → duas formas de vender (experimento)

> **Este arquivo vale em conjunto com `AGENTS.md`, `p7-qualidade.md`, `x1-experimento-capitulos.md`, `x2-calculadora-frase.md`, `x3-texto-conta-contato.md`, `x3b-ajustes-avaliacao.md` e `x4-capitulos-conteudo.md`.** Em caso de contradição, **este arquivo vence** e o executor não precisa perguntar. Execute **só esta tarefa**. Se algo faltar, **pare e pergunte**.
>
> Branch: `experimento-capitulos`, a partir do commit da X4. Só podem mudar arquivos em `experimento/` e `testes/experimento.test.mjs`. **Teto de JS do experimento continua 40.000 bytes** (hoje 33.718; o protótipo do diretor ficou em 35.138). Nenhuma imagem nova. Sem bibliotecas, sem build.

## Por que

Depois da X4, Daniel não gostou da organização: os capítulos estavam mal separados, todos com o mesmo formato, só a passagem início → origem tinha transição e a calculadora parecia uma caixa deslocada. Referência: Graza (cada seção com cor e formato próprios, um desenho que se move com a rolagem, faixa de texto correndo, bordas desenhadas entre seções).

O diretor pesquisou as referências e montou um protótipo descartável. **Daniel aprovou o desenho em 02/11**, com uma troca: em vez de uma gota, uma **xícara que enche de café com a rolagem**, transborda e pousa na borda de espuma do capítulo de produtos.

Esta tarefa cobre só o trecho **origem → produtos → faixa → duas formas de vender**. O resto (como preparar, como funciona, dúvidas, contato) fica para a X6.

## Regras gerais

- **Movimento só com CSS** sempre que possível: `position: sticky` para a xícara e os cartões; *scroll-driven animations* (`animation-timeline`) só como melhoria, dentro de `@supports (animation-timeline: view())`. Sem `requestAnimationFrame` novo e sem listener de rolagem novo. O único JS de movimento permitido é a função curta que calcula o `top` dos cartões (seção 4) e o botão "Pausar animações".
- **Sem suporte a scroll-driven** (Firefox, iPhone com iOS anterior ao 26): a xícara aparece **já cheia**, com espuma e vapor, e continua descendo presa à tela até pousar na espuma (o `sticky` funciona em todos). Nada quebra.
- **Movimento reduzido** (`prefers-reduced-motion: reduce`): nada se move. Xícara cheia, parada, em cima da espuma; faixa parada; cartões um embaixo do outro, sem pin.
- **"Pausar animações"** (seção 3): o mesmo resultado do movimento reduzido para a xícara, a faixa e os cartões, sem mudar a altura da página (sem pulo de layout).
- **Celular (até 919 px):** cartões um embaixo do outro, sem pin. A xícara, a espuma, o arco, as cores e a faixa continuam (são baratos).
- **Textos:** tudo que existe no config vem por importação. Textos novos só em `experimento/textos.js`. Os 6 estilos de texto continuam (nenhum `font-size` novo). Palavras proibidas do `p7-qualidade.md` continuam proibidas.
- **Cores:** só a paleta (`--torra`, `--torra-2`, `--leite`, `--ouro`, `--cacau`, `--folha`) e misturas delas com `color-mix`. Contrastes medidos pelo diretor: torra sobre folha 4,86; leite sobre cacau 11,6; ouro sobre cacau 6,06; torra sobre ouro 7,97; **ouro sobre leite 1,92 (só para enfeite, nunca para texto ou foco)**.
- **Fios tracejados:** `1px dashed var(--ouro)` no fundo café; `1px dashed currentColor` dentro dos cartões.

## 1. Produtos (`#produtos`)

A seção deixa de ser `capitulo claro`. Ela tem três partes, nesta ordem:

**1a. Topo claro** (`.produtos-topo`): fundo `--leite`, texto `--cacau`, fio `--ouro` de 1 px no alto (continua a separação da X4). Desktop: grade com duas colunas, `minmax(0, 1fr) 30%`; à esquerda o título (`config.textos.produtos.titulo`, Capítulo, máx. 14ch) e a Entrada (`config.textos.produtos.igual`); à direita o **trilho** da xícara. Celular: uma coluna, trilho abaixo do texto.

**1b. A xícara** (decorativa, `aria-hidden="true"`, `focusable="false"`):
- O SVG fica **escrito no `experimento/index.html`** (estático, não conta no JS e não usa `innerHTML`); o JS só o move para dentro do trilho. Use exatamente este desenho (aprovado por Daniel; ajustes finos de traço são permitidos e devem ser explicados no relatório):

```html
<svg class="xicara" id="xicara" viewBox="0 0 260 250" aria-hidden="true" focusable="false">
  <defs><clipPath id="xicara-dentro"><path d="M52 112H208C208 176 178 214 130 214S52 176 52 112Z"/></clipPath></defs>
  <g class="vapor"><path d="M104 92c-12-16 12-24 0-42"/><path d="M130 88c-14-18 14-28 0-50"/><path d="M156 92c-12-16 12-24 0-42"/></g>
  <g class="espuma-alta"><path d="M56 114c4-16 26-22 40-14 10-12 36-14 48-2 14-10 40-6 48 8 8 2 12 6 12 8Z"/><circle cx="92" cy="104" r="3"/><circle cx="150" cy="100" r="2.5"/><circle cx="176" cy="108" r="2"/></g>
  <g clip-path="url(#xicara-dentro)"><g class="cafe"><rect x="40" y="112" width="180" height="110"/><path class="creme" d="M40 112h180v14c-20 6-40-4-60 2s-40 6-60 0-40 2-60-2Z"/></g></g>
  <path class="contorno" d="M50 110H210C210 178 180 216 130 216S50 178 50 110Z"/>
  <path class="contorno" d="M208 130c34-6 38 40 0 46"/>
  <path class="contorno" d="M30 226c30 10 170 10 200 0"/><path class="contorno" d="M40 222h180"/>
  <g class="escorrer"><path d="M50 108c-4 14-8 24-4 36 3 7 9 5 9-3 0-12 1-22 1-33Z"/><path d="M208 108c4 10 8 20 5 30-2 7-9 5-9-1 0-10-1-18-1-29Z"/></g>
</svg>
```

- Cores: contorno `--cacau`, traço 3; café `color-mix(in srgb, var(--cacau) 80%, var(--ouro))`; creme, espuma alta e escorrido `color-mix(in srgb, var(--leite) 70%, var(--ouro))` com contorno `--cacau` de 2; bolhas `--leite`; vapor `--cacau` com opacidade 0,45, traço 2,5, `stroke-dasharray: 60`.
- **Estado de repouso (CSS sem animação) = xícara cheia**, com espuma alta, escorrido e vapor visíveis.
- **Trilho:** coluna flex centralizada, `min-height: 110svh` no desktop e `62svh` no celular. A xícara tem `position: sticky; top: 26svh`, largura `min(100%, 260px)` no desktop e 190 px no celular. O trilho termina **encostando na espuma**: a margem inferior negativa deve fazer o pires pousar na crista da onda (no protótipo: −58 px no desktop, −30 px no celular; ajuste até o pires ficar sobre a onda, sem afundar nem flutuar).
- **Animação (só com suporte e movimento permitido):** `timeline-scope: --pingo` em `.produtos` e `view-timeline: --pingo block` na espuma (1c). Faixas do protótipo, como ponto de partida:
  - café subindo (`translateY(104px)` → 0): `cover 0%` a `cover 34%`;
  - espuma alta subindo acima da borda (`scaleY(0)` → 1, origem embaixo): `cover 30%` a `cover 38%`;
  - escorrido pelos lados (`scaleY(0)` → 1, origem no alto): `cover 36%` a `cover 44%`;
  - vapor se desenhando (`stroke-dashoffset` 60 → 0): `cover 36%` a `cover 52%` (o do meio, `38%` a `56%`).
  - Use `transform-box: fill-box` nos grupos animados.
  - **Ordem obrigatória:** a xícara está cheia e com a espuma acima da borda **antes** de o pires encostar na onda; o vapor termina depois.
- **Ajustes pedidos pelo diretor:** no protótipo o escorrido ficou curto e discreto; deixe-o visível como espuma escorrendo pelos dois lados da xícara (até mais ou menos metade da altura da xícara), sem tapar a alça.

**1c. Borda de espuma** (`.espuma`, SVG decorativo, `aria-hidden`): largura total, altura `clamp(44px, 6vw, 90px)`, `preserveAspectRatio="none"`, `fill: var(--cacau)`, fundo `--leite`:

```
viewBox="0 0 1440 90"
d="M0 46C80 20 160 20 240 40s160 34 240 10 160-38 240-14 160 40 240 16 160-38 240-14 160 36 240 12V90H0Z"
```

**1d. Corpo cor de café** (`.produtos-corpo`): fundo `--cacau`, texto `--leite`, foco `--ouro`. Mesmo miolo de 1280 px.
- Os dois pacotes viram **cartões de foto**: foto do pacote preenchendo um retângulo 4:3 com cantos de 28 px (20 px no celular), **sem o arco**; por cima, duas etiquetas em pílula: `produto.selo` no canto superior esquerdo e `produto.peso` no direito (Nota, borda `--leite` 1 px, fundo `color-mix(in srgb, var(--torra) 55%, transparent)`). Abaixo: selo em Frase, frase em Texto, ingredientes no `<details>` como hoje (fio de cima tracejado `--ouro`). O peso sai de baixo da frase (já está na etiqueta). O `alt` da foto continua o do config.
- "O que vai dentro" e as notas (rendimento, validade, conservação) continuam como na X4, separados por fios tracejados `--ouro`; rótulos das notas em `--ouro`.
- Nada de "diet" neste capítulo (como na X4).

## 2. A faixa que corre (`#faixa`, entre produtos e duas formas de vender)

- Um elemento novo no `index.html`, entre `#produtos` e `#vender`. Fundo `--ouro`, texto `--torra`, fios `--torra` de 1 px em cima e embaixo, texto em Frase, sem quebrar linha.
- Texto: `config.textos.diferenca.cartoes[0].titulo` · `cartoes[1].titulo` · `cartoes[2].titulo` cortado na primeira vírgula ("Feito à mão") · `textos.taparuba` (novo em `textos.js`: **"Taparuba, MG"**, aprovado por Daniel). Resultado: "Café Conilon · Cacau 100% · Feito à mão · Taparuba, MG".
- Movimento só com CSS: trilho flex com 4 cópias do grupo, `@keyframes` de `translateX(0)` a `translateX(-50%)`, 40 s, `linear`, `infinite`, sem emenda visível em 360, 1440 e 1920 px. **Só a primeira cópia é lida pelo leitor de tela**; as outras têm `aria-hidden="true"`.
- Movimento reduzido: uma cópia só, parada, centralizada, quebrando linha se precisar, **sem " · " sobrando no fim**.

## 3. Botão "Pausar animações"

- `<button type="button">` dentro da faixa: no desktop, à direita e centralizado na altura da faixa; no celular, embaixo do texto, alinhado à direita. Nota, fundo `--torra`, texto `--leite`, alvo ≥ 44 px, foco visível `--torra` sobre o ouro.
- Textos novos em `textos.js`: "Pausar animações" e "Retomar animações". `aria-pressed` acompanha o estado.
- Ao pausar: classe `pausado` no `<html>`. A faixa para onde está; a xícara mostra o estado cheio e fica parada no fim do trilho (`position: static`, trilho com `justify-content: flex-end`); os cartões deixam de prender. **A altura da página não muda.** Ao retomar, tudo volta.
- Com movimento reduzido, o botão não aparece (nada se move).
- Opcional: lembrar a escolha no `localStorage`, sempre com `try/catch`.

## 4. Duas formas de vender (`#vender`)

- **Topo em arco:** a seção começa com o canto superior em arco largo, o mesmo desenho do arco das fotos: `border-radius: 50% 50% 0 0 / 110px 110px 0 0` no desktop e `/ 48px 48px 0 0` no celular, com o ouro da faixa aparecendo nos cantos (no protótipo: a faixa ganha um respiro embaixo e a seção sobe por cima dela; o executor pode resolver de outro jeito, sem `overflow-x: hidden` no `html`/`body`).
- Título (`textos.vender.titulo`) e Entrada (`motivos[0]`) **centralizados**.
- **Sem abas.** Remova o `tablist`, os botões de aba, `selecionarAba`, a navegação por setas, o import de `indiceDaAba` e o CSS de `.abas` e `.aba-painel` que ficar sem uso. (`js/produtos.js` não muda.)
- **Dois cartões** (`<article>` com `aria-labelledby` apontando para o próprio título), na ordem de `textos.vender.abas`:
  - cartão 1 "Servir na xícara": fundo `--leite`, texto `--cacau`;
  - cartão 2 "Revender o pacote": fundo `--folha`, texto `--torra`;
  - cantos de 32 px (24 px no celular), sombra suave para cima `0 -12px 40px` com `--torra` a 50%;
  - conteúdo à esquerda (desktop, coluna `.8fr`): "1 / 2" ou "2 / 2" em Nota (só visual, pode ter `aria-hidden`); o título em Capítulo; `dados.frase` em Frase; a lista; a foto da X4 num arco pequeno (até 180 × 200 px; no celular 72% da largura e 260 px de altura);
  - à direita (coluna `1.2fr`): **a calculadora inteira** (`montarConta`), **sem a folha clara**: sem fundo, sem padding, sem largura máxima, herdando a cor do cartão. Fios, sublinhados dos campos, seta do `select` e foco em `currentColor` (no cartão verde, seta e foco escuros: o ouro não tem contraste no verde nem no leite). No celular, a calculadora vem embaixo do texto, ocupando a largura do cartão.
  - O comportamento da calculadora não muda: campos vazios, dicas uma por vez, `aria-live` anunciando o ganho, vírgula presa ao último campo, avisos.
- **Empilhamento (só desktop ≥ 920 px, movimento permitido, não pausado):** os dois cartões com `position: sticky`; o cartão 2 sobe e cobre o cartão 1, deixando aparecer uma tira de uns 24 px do cartão 1 em cima. O `top` de cada cartão vem de uma variável CSS calculada por uma função curta em JS: `min(72 + i × 24, altura da janela − altura do cartão − 16)` em px, recalculada ao carregar, quando as fontes ficam prontas e no `resize` (no listener que já existe). Assim, num notebook de 1366 × 768, onde o cartão é mais alto que a tela, ele prende pelo pé e nada da calculadora fica escondido.
- Depois dos cartões, o botão "Pedir degustação gratuita" centralizado.

## 5. O que não muda

Início, origem e o palco (arco viajante), menu, como preparar, como funciona, dúvidas e contato continuam como na X4. Os links do menu continuam válidos (`#produtos` e `#vender` existem).

## Critérios

| ID | Critério | Como verificar |
|---|---|---|
| C-01 | Só mudam arquivos de `experimento/` e `testes/experimento.test.mjs`; nenhuma imagem nova; nenhuma biblioteca. | `git status`, `git diff --name-only`. |
| C-02 | Ordem: origem → produtos (topo claro → espuma → corpo café) → faixa → duas formas de vender → como preparar…; cores de cada parte como nas seções 1, 2 e 4. | Tela a 1440 × 900 e 390 × 844; teste automático da ordem dos `id`s com `faixa` entre `produtos` e `vender`. |
| C-03 | Xícara: SVG estático no `index.html`, `aria-hidden`, dentro do trilho. Com suporte e movimento permitido, rolando devagar: enche, a espuma sobe acima da borda, escorre pelos dois lados e o vapor se desenha, **nessa ordem**, e a xícara está cheia antes de o pires encostar na onda. | Rolar devagar a 1440 × 900 e 390 × 844 no Chrome/Edge; capturas em 4 pontos no relatório. |
| C-04 | No fim do trilho, o pires pousa na crista da onda: não flutua (≤ 8 px de folga) nem afunda (a borda do pires visível), no desktop e no celular. | Capturas aproximadas a 1440 × 900 e 390 × 844. |
| C-05 | Sem suporte a scroll-driven: xícara cheia (com espuma, escorrido e vapor) desce presa e pousa na onda, sem erro no console. | Simular removendo o bloco `@supports` num teste manual, ou no Firefox; anotar como foi feito. |
| C-06 | Produtos: pacotes em cartões de foto 4:3 com etiquetas de selo e peso; textos, ingredientes e avisos do config; "O que vai dentro" e notas com fios tracejados; nada de "diet". | Tela e testes B-05 atualizados. |
| C-07 | Faixa: texto "Café Conilon · Cacau 100% · Feito à mão · Taparuba, MG" montado do config + `textos.taparuba`; corre sem emenda; só a primeira cópia sem `aria-hidden`. | Tela a 360, 1440 e 1920 px; leitor de acessibilidade do DevTools; teste automático do texto e do `aria-hidden`. |
| C-08 | "Pausar animações": para a faixa, deixa a xícara cheia e parada no fim do trilho e solta os cartões; `aria-pressed` e o texto do botão mudam; a altura do documento é a mesma antes e depois (diferença 0 px). Alvo ≥ 44 px e foco visível. | Clique e teclado (Tab + Enter/Espaço); `document.documentElement.scrollHeight` antes e depois, no relatório. |
| C-09 | Movimento reduzido: nada se move (faixa parada numa cópia, sem " · " sobrando; xícara cheia parada em cima da espuma; cartões sem pin); botão de pausar escondido. | DevTools > Renderização > "Emular a funcionalidade de mídia CSS prefers-reduced-motion" = reduce, a 1440 × 900 e 390 × 844. |
| C-10 | Duas formas de vender: topo em arco com o ouro nos cantos; título e Entrada centralizados; **sem abas** (nenhum `role="tab"`/`tablist` no experimento); dois cartões com a calculadora inteira dentro, sem a folha clara. | Tela; busca por `tablist`; testes A-08 e B-03 atualizados. |
| C-11 | Desktop: o cartão 2 sobe e cobre o 1, com a tira do cartão 1 visível; a 1440 × 900 e a 1366 × 768 o fim de cada cartão (aviso da calculadora) aparece inteiro antes de ser coberto. Celular: um embaixo do outro, sem sticky. | Rolar devagar nos três tamanhos; capturas no relatório. |
| C-12 | Calculadora igual por dentro: as duas contas calculam como antes, o leitor de tela anuncia o ganho (`aria-live`), dicas uma por vez, vírgula presa ao último campo a 360, 768, 1280, 1440 e 1920 px. | Preencher as duas contas; DevTools; testes existentes da calculadora passando. |
| C-13 | Teclado: Tab passa por todos os campos das duas calculadoras e nenhum campo focado fica coberto pelo outro cartão (o elemento no centro do campo focado é o próprio campo). | Teclado a 1440 × 900 e 1366 × 768; anotar no relatório como foi conferido. |
| C-14 | Contraste ≥ 4,5:1 em todo texto (incluindo o cartão verde, as etiquetas sobre a foto e os rótulos dourados no café); foco visível em todos os fundos; alvos ≥ 44 px. | DevTools (seletor de cor mostra o contraste) ou cálculo no relatório. |
| C-15 | Sem rolagem horizontal a 360, 768, 1280 e 1920 px; 0 erros no console; sem `overflow-x: hidden` em `html`/`body`. | DevTools e console. |
| C-16 | Fluidez: ao rolar do topo de produtos até o fim de "Duas formas de vender" com a CPU limitada (DevTools > Desempenho > CPU 4× e 6× mais lenta), sem travadas visíveis; nenhum listener de rolagem ou `requestAnimationFrame` novo. | Gravação no painel Desempenho; anotar quadros longos no relatório. |
| C-17 | `node --test testes/` passa, com testes novos para C-02, C-07, C-08 (textos e `aria-pressed`) e C-10; testes antigos que mudam por causa desta tarefa (B-02, A-08, B-05 etc.) ajustados e explicados no relatório; JS do experimento ≤ 40.000 bytes; textos e palavras proibidas como antes. | Comando e `Get-ChildItem experimento`. |

## Relatório e commit

Relatório final do `AGENTS.md`, com C-01 a C-17, o tamanho final do JS e do CSS, as capturas pedidas, "Decisões do executor" (inclusive ajustes nas faixas de animação e no desenho da xícara) e "Testes alterados" (quais e por quê). **Não faça commit**: Daniel testa primeiro. Sem push.
