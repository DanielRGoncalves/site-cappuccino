# X3 — Sistema de texto, calculadora refinada e contato (experimento)

> **Este arquivo vale em conjunto com `AGENTS.md`, `p7-qualidade.md`, `p10c-calculadora-kg.md`, `x1-experimento-capitulos.md` e `x2-calculadora-frase.md`.** Em caso de contradição, **este arquivo vence** e o executor não precisa perguntar. Execute **só esta tarefa**. Se algo faltar, **pare e pergunte**.
>
> Branch: `experimento-capitulos`, a partir do commit da X2. Só podem mudar arquivos em `experimento/` e `testes/experimento.test.mjs`. **Teto de JS do experimento passa a ser 30.000 bytes** (decisão do diretor em 30/10; substitui os 20.000 da X1).

## Por que

Daniel quer que o site inteiro tenha a mesma personalidade. Hoje cada parte usa tamanhos próprios (só a calculadora tem cinco tamanhos e duas fontes, e cinco linhas pequenas empilhadas sem hierarquia). O contato é só uma lista de links e não fecha a história.

## 1. Sistema de texto (vale para todo o experimento)

Crie, no topo do `experimento.css`, **cinco estilos de texto** como classes ou variáveis, e faça **todo** texto do experimento usar um deles. Nenhum outro tamanho de fonte pode sobrar no CSS (exceto o do botão Menu e da faixa de experimento, que podem usar "Nota").

| Estilo | Fonte | Tamanho | Uso |
|---|---|---|---|
| Abertura | Fraunces | o atual do título do hero | só o `h1` do hero |
| Capítulo | Fraunces | `clamp(2.4rem, 5vw, 4.6rem)`, linha 1,05 | títulos de capítulo (origem, duas formas de vender, contato), links do menu |
| Frase | Fraunces | `clamp(1.4rem, 2.4vw, 2.1rem)`, linha 1,35 | frases de destaque, `h3` dos painéis, abas, frase da calculadora, valores secundários da conta, convite do menu |
| Texto | sistema | 17 px, linha 1,6 | parágrafos e listas |
| Nota | sistema | 14 px, linha 1,5, cor com contraste ≥ 4,5:1 | dicas, avisos, rótulos dos resultados, dados legais, "Faça a conta" |

Botões continuam como estão (pílula, Fraunces).

**Voz (regra para todo texto novo):** a marca fala como "nós" ("Vendemos por kg…", "A gente leva…"), com frases curtas, diretas e em letra normal (sem caixa alta, sem exclamação). Só a calculadora fala como "eu" (o dono do negócio). Nada de adjetivos vazios; as palavras proibidas do `p7-qualidade.md` continuam proibidas.

## 2. Calculadora refinada (nas duas abas)

**Fundo de folha:** o bloco da conta vira uma "folha" clara dentro do capítulo escuro: fundo `--leite`, texto `--cacau`, cantos de 4 px, padding generoso (48 px no desktop, 24 px no celular), **sem sombra**. O título "Faça a conta" fica dentro da folha, no estilo Nota, em `--cacau`.

**Frase sempre completa:**
- A frase termina sempre com o resultado: "…por R$ [ ], **ganho R$ — por xícara.**" (e "…**por pacote.**" na revenda). Sem vírgula solta.
- O número é o protagonista: Fraunces, `clamp(2.4rem, 5vw, 4rem)`, cor `--cacau`, com um fio `--ouro` de 3 px embaixo. Enquanto faltar valor, mostra "—", e o texto `semResultado`/`semResultadoRevenda` do config aparece logo abaixo no estilo Nota. O espaço do número é reservado, para a frase **não mudar de tamanho** ao preencher.
- O `aria-live` continua anunciando a frase completa com o valor, ou o texto de "preencha os dois valores".

**Campos:** dentro da frase, com fio de 2 px `--cacau` embaixo (no foco, `--ouro` e 3 px, mais o contorno de foco visível). O `<select>` de ml perde a seta padrão (`appearance: none`) e ganha uma seta pequena desenhada em SVG inline no CSS, na cor `--cacau`.

**Dicas uma por vez:** cada campo mantém sua dica ligada por `aria-describedby`, mas **só a dica do campo em foco fica visível**, numa única linha abaixo da frase (estilo Nota, altura reservada para não pular). Sem foco, a linha fica vazia.

**Resultados secundários:** numa linha em colunas (grid de 2 colunas no celular, até 4 no desktop), separada da frase por um fio `--cacau` com 20% de opacidade. Rótulo no estilo Nota, valor no estilo Frase. Xícara: Xícaras por kg (sempre com valor), Custo do pó por xícara, Margem, Ganho por kg. Revenda: Margem. Valor vazio aparece como "—".

**Aviso de rodapé:** "A conta considera só o custo…" (config) fica no fim da folha, estilo Nota, depois de um fio fino.

**Espaço:** remova o vazio grande entre a lista do painel e a conta. No máximo 48 px.

Toda a lógica e os valores continuam como na X2 (mesmas funções, mesmos resultados). Critérios Y-02 a Y-07 da X2 continuam valendo.

## 3. Contato como capítulo final (`#contato`)

**Composição (desktop):** duas colunas. À esquerda, a foto num arco (o mesmo arco do site). À direita:
1. Título (Capítulo): "Vamos marcar uma degustação?"
2. Texto: "A gente leva o cappuccino e a água quente, e você prova na hora. Sem custo."
3. Botão primário grande: "Conversar no WhatsApp", com ícone, abrindo o WhatsApp com a mensagem de degustação do config.
4. Link do Instagram com ícone e o usuário do config.
5. Fio fino, e abaixo um bloco de notas (estilo Nota) com: a resposta da pergunta "Como é a entrega?" e a de "Como posso pagar?" de `config.textos.faq.itens` (busque pelo texto da pergunta; não copie a resposta), depois razão social, CNPJ e endereço de `config.dadosLegais`, e o link "Voltar ao site atual".

No celular: foto em cima (até 45 svh), conteúdo abaixo. Fundo do capítulo: `--torra` (fecha escuro, como abriu).

Textos novos em `experimento/textos.js`: o título, o texto e o rótulo do botão acima. Não use a palavra "família" neste capítulo.

**Foto:** use o original `fotos-reais/10.jpeg` (moça sorrindo com dois pacotes na mesa). Corte 3:4 centrado no rosto e nos pacotes: `experimento/img/contato-600.webp` (600 × 800) e `experimento/img/contato-1200.webp` (1200 × 1600), até 70.000 e 200.000 bytes. `srcset` com os dois, `loading="lazy"`, `width`/`height`. `alt`: "Mulher sorrindo atrás de dois pacotes de cappuccino Cheiro das Águas sobre a mesa". Não altere `fotos-reais/` nem `img/`.

**Ícones:** dois ícones em SVG inline, desenhados no traço do site (linha de 1,5 px, cantos arredondados, cor `currentColor`, 24 × 24, `aria-hidden="true"`):
- WhatsApp: um **balão de conversa simples**. Não reproduza o logo do WhatsApp.
- Instagram: uma **câmera fotográfica clássica** (corpo, visor em cima, lente redonda). Não reproduza o logo do Instagram.
O texto do link continua visível ao lado do ícone (o ícone nunca é o único rótulo).

## Critérios

| ID | Critério | Como verificar |
|---|---|---|
| Z-01 | Só mudam arquivos de `experimento/` e `testes/experimento.test.mjs`. | `git status`, `git diff --name-only`. |
| Z-02 | Todo texto usa um dos 5 estilos; não sobra `font-size` fora deles (exceto as exceções citadas). | Busca por `font-size` no CSS e conferência visual. |
| Z-03 | Calculadora em folha clara; frase sempre completa com "—" quando vazia; frase não muda de tamanho ao preencher; número em `--cacau` com fio dourado. | Tela, preenchendo e apagando. |
| Z-04 | Só a dica do campo em foco aparece; todas continuam ligadas por `aria-describedby`. | Tab pelos campos. |
| Z-05 | Seta do `<select>` própria; campos com foco visível; alvos ≥ 44 px. | Tela e teclado. |
| Z-06 | Resultados secundários em colunas, com "—" quando vazio; Y-02 a Y-07 da X2 continuam corretos. | Tela com os valores da X2. |
| Z-07 | Contato com foto, título, texto, botão de WhatsApp com ícone, Instagram com ícone e notas (entrega, pagamento, dados legais) vindas do config; sem a palavra "família". | Tela e busca. |
| Z-08 | Ícones são balão e câmera genéricos, não os logos oficiais; texto visível ao lado. | Visual e leitura do SVG. |
| Z-09 | Fotos novas nos tamanhos e limites de bytes indicados, com `srcset`, `width`, `height`, `alt`. | `Get-ChildItem experimento/img` e leitura do HTML gerado. |
| Z-10 | Contraste ≥ 4,5:1 em todo texto (inclusive Nota na folha clara e no fundo escuro). | DevTools. |
| Z-11 | A 360, 768 e 1280 px: sem rolagem horizontal, 0 erros no console; com movimento reduzido, nada se move. | DevTools. |
| Z-12 | `node --test testes/` passa; JS do experimento ≤ 30.000 bytes. | Comando e `Get-ChildItem`. |

## Relatório e commit

Relatório final do `AGENTS.md`, com Z-01 a Z-12 e "Decisões do executor". **Não faça commit**: Daniel testa primeiro. Sem push.
