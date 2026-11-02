# X4 — O resto do conteúdo como capítulos (experimento)

> **Este arquivo vale em conjunto com `AGENTS.md`, `p7-qualidade.md`, `x1-experimento-capitulos.md`, `x2-calculadora-frase.md`, `x3-texto-conta-contato.md` e `x3b-ajustes-avaliacao.md`.** Em caso de contradição, **este arquivo vence** e o executor não precisa perguntar. Execute **só esta tarefa**. Se algo faltar, **pare e pergunte**.
>
> Branch: `experimento-capitulos`, a partir do commit da X3b. Só podem mudar arquivos em `experimento/` e `testes/experimento.test.mjs`. **Teto de JS do experimento passa a ser 40.000 bytes** (decisão do diretor em 02/11: o conteúdo novo é montado em JS a partir do config).

## Por que

O experimento foi aprovado na avaliação de 02/11. Agora ele precisa ter **todo** o conteúdo do site atual, para a família poder comparar e decidir se ele vira o site novo. Decisões de Daniel em 02/11:
- **Sem formulário de degustação.** Fica só o botão direto, que já abre o WhatsApp com a mensagem pronta (`config.textos.whatsapp.degustacao`). Não use `config.textos.degustacao`.
- **"Por que vender" não vira seção.** Cada frase de `config.textos.porque.motivos` vai para o capítulo onde faz sentido (tabela abaixo).

## Regras gerais

- **Ordem dos capítulos:** início → origem → produtos → duas formas de vender (com a conta) → como preparar → como funciona → dúvidas → contato.
- **Fundos alternados:** origem (claro, `--leite`) → produtos (claro, continua a origem, separado por um fio `--ouro` de 1 px) → duas formas de vender (escuro, como hoje) → como preparar (claro) → como funciona (escuro, `--torra-2`) → dúvidas (claro) → contato (escuro, como hoje). No fundo claro, texto `--cacau`.
- **Textos:** tudo que já existe em `js/config.js` vem **por importação**, nunca copiado. Só texto realmente novo entra em `experimento/textos.js`. Voz e palavras proibidas como na X3.
- **Estilos:** só os 6 estilos (Abertura, Capítulo, Entrada, Frase, Texto, Nota). Cada capítulo novo tem título em Capítulo; a primeira frase depois do título, quando houver, em Entrada.
- **Largura:** miolo de até 1280 px, centralizado, padding lateral de 6vw (como a X3b).
- **Movimento:** nenhum efeito de rolagem novo. O arco do início/origem e o menu continuam sendo os únicos movimentos.
- **Fotos:** nenhuma imagem nova. Use as de `img/reais/` indicadas no config, com o mesmo `../` que o experimento já usa para o hero, sempre com `width`, `height`, `alt` do config e `loading="lazy"`. O **arco** fica para no máximo uma composição por capítulo (nos produtos, os dois pacotes contam como uma); as demais fotos são retângulos com cantos de 4 px.
- **Não use** as fotos 24, 27 e 28 (bebida gelada) nem fotos com caneca de outra marca.

## Onde vai cada frase de "Por que vender"

| Frase (`config.textos.porque.motivos[i]`) | Vai para |
|---|---|
| [0] "Um diferencial para o seu cardápio…" | Entrada logo abaixo do título "Duas formas de vender" |
| [1] "Rende cerca de 8 xícaras por pacote de 250 g." | Produtos (nota abaixo dos dois pacotes) e lista da aba "Revender o pacote" |
| [2] "Preparo em 3 passos, só com água quente." | Entrada do capítulo "Como preparar" e lista da aba "Servir na xícara" |
| [3] "Validade de 365 dias." | Produtos (nota, junto da conservação) e lista da aba "Revender o pacote" |
| [4] "Entrega sem taxa na Grande Vitória…" | Entrada do capítulo "Como funciona" e lista da aba "Revender o pacote" |

As listas das abas em `textos.js` hoje **copiam** essas frases: troque pelas referências ao config. Só "30 g para cada 100 ml de água fervente." continua em `textos.js` (não existe igual no config).

## 1. Produtos (`#produtos`)

1. Título (Capítulo): `config.textos.produtos.titulo` ("Qual escolher?").
2. Entrada: `config.textos.produtos.igual`.
3. Os produtos com `exibir: true`, lado a lado no desktop (um embaixo do outro no celular). Cada um:
   - foto do pacote (`foto`/`fotoPequena` com `srcset` 400w/800w), no arco;
   - `selo` em Frase (continua "Com açúcar" / "Sem açúcar"; **não** trocar por "diet" aqui);
   - `frase` em Texto; `peso` em Nota;
   - ingredientes num `<details>` com `<summary>` = `config.textos.produtos.ingredientesTitulo` e, dentro, o texto de `ingredientes` e depois `avisos` (Nota).
4. **O que vai dentro:** os 4 itens de `config.textos.diferenca.cartoes` (título em Frase, texto em Texto, foto retangular 9:16 pequena). Desktop: 4 colunas; celular: 2 colunas. A frase `config.textos.diferenca.destaque` fica acima deles, em Frase. Atenção: a foto do aroma já aparece na aba "Servir na xícara"; aqui ela pode aparecer de novo, mas se o executor achar repetitivo, pode usar só título e texto nesse item e explicar em "Decisões do executor".
5. Notas no fim: `motivos[1]`, `motivos[3]` e "Conservação: " + `config.textos.conservacao` (rótulo `config.textos.contato.conservacao`).

## 2. Duas formas de vender (`#vender`)

Igual à X3b, com duas mudanças: `motivos[0]` como Entrada logo abaixo do título, e as listas das abas vindo do config (tabela acima).

## 3. Como preparar (`#preparo`)

1. Título (Capítulo): `config.textos.preparo.titulo`.
2. Entrada: `motivos[2]`.
3. Os 3 passos de `config.textos.preparo.passos` numa lista ordenada (`<ol>`): número grande em Fraunces (estilo Capítulo, cor `--ouro` sobre claro só se o contraste passar de 3:1 para texto grande; senão `--cacau`), foto 2:3 retangular, `titulo` em Frase e `descricao` em Texto. Desktop: 3 colunas; celular: um embaixo do outro, foto até 60% da largura.
4. Notas no fim: `dica` e `rendimento`.

## 4. Como funciona (`#como`)

1. Título (Capítulo): `config.textos.como.titulo`.
2. Entrada: `motivos[4]`.
3. Os 3 passos de `config.textos.como.passos` numa `<ol>`. Os textos do config começam com "1. ", "2. ", "3. ": **retire esse prefixo por código** (expressão regular no início da frase) e mostre o número em Fraunces, estilo Capítulo, `--ouro` (no fundo escuro passa contraste). Texto do passo em Texto. Desktop: 3 colunas com um fio `--ouro` ligando os números; celular: vertical, com o fio na esquerda.
4. Botão "Pedir degustação gratuita" (o mesmo do hero) no fim do capítulo.

## 5. Dúvidas (`#duvidas`)

1. Título (Capítulo): `config.textos.faq.titulo`.
2. Todas as perguntas de `config.textos.faq.itens`, cada uma num `<details>`: `<summary>` com a pergunta em Frase e um sinal "+" desenhado em CSS que vira "−" quando aberto; resposta em Texto. Fios `--cacau` 20% entre as perguntas. Alvo de toque ≥ 44 px. Só HTML nativo (sem JS para abrir e fechar).
3. Aqui a resposta de "Como é a entrega?" aparece completa (pode dizer "família": não há foto de pessoa neste capítulo).

## 6. Menu

Os links do menu passam a ser, nesta ordem: Origem, Produtos, Duas formas de vender, Como preparar, Como funciona, Dúvidas, Contato, Site atual. Todos os `href` apontam para `id`s que existem. Os 8 links + o convite precisam caber no celular (390 × 844) com rolagem do painel se precisar; confira que nada fica cortado.

## Critérios

| ID | Critério | Como verificar |
|---|---|---|
| B-01 | Só mudam arquivos de `experimento/` e `testes/experimento.test.mjs`; nenhuma imagem nova. | `git status`, `git diff --name-only`. |
| B-02 | Capítulos na ordem pedida, com os `id`s `produtos`, `vender`, `preparo`, `como`, `duvidas`, `contato`; fundos alternados como na regra. | Tela e leitura do HTML gerado. |
| B-03 | Nenhum texto que existe no config está copiado em `textos.js` (inclusive as listas das abas). | Teste automático que compara as frases dos dois arquivos. |
| B-04 | As 5 frases de "Por que vender" estão nos lugares da tabela; não existe seção "Por que vender". | Tela e busca. |
| B-05 | Produtos: 2 pacotes com selo, frase, peso, ingredientes em `<details>` e avisos; "O que vai dentro" com os 4 itens; notas de rendimento, validade e conservação. Nada de "diet" neste capítulo. | Tela e busca. |
| B-06 | Como preparar e Como funciona como listas ordenadas; números de "Como funciona" sem o "1. " duplicado. | Tela e leitor de acessibilidade do DevTools. |
| B-07 | Dúvidas com `<details>` nativo, todas as perguntas do config, alvos ≥ 44 px, abre e fecha com Enter/Espaço. | Teclado. |
| B-08 | Sem formulário de degustação; os botões de degustação abrem o WhatsApp com `config.textos.whatsapp.degustacao`. | Clique e leitura do link. |
| B-09 | Menu com os 8 links na ordem pedida, todos funcionando, nada cortado a 390 × 844. | Tela. |
| B-10 | Todas as fotos com `width`, `height`, `alt` do config e `loading="lazy"` (exceto a do hero); arco no máximo uma composição por capítulo; sem fotos 24, 27, 28. | Leitura do HTML gerado. |
| B-11 | Só os 6 estilos de texto; contraste ≥ 4,5:1 (3:1 para números grandes); sem rolagem horizontal a 360, 768, 1280 e 1920 px; 0 erros no console; com movimento reduzido, nada se move. | DevTools. |
| B-12 | Palavras proibidas do `p7-qualidade.md` ausentes do experimento. | Teste automático existente. |
| B-13 | `node --test testes/` passa, com testes novos para B-02, B-03, B-04 e B-09; JS do experimento ≤ 40.000 bytes. | Comando e `Get-ChildItem experimento`. |

## Relatório e commit

Relatório final do `AGENTS.md`, com B-01 a B-13, o tamanho final do JS e "Decisões do executor". **Não faça commit**: Daniel testa primeiro. Sem push.
