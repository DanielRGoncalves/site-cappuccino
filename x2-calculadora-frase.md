# X2 — Calculadora em frase dentro das abas + foto nítida (experimento)

> **Este arquivo vale em conjunto com `AGENTS.md`, `p7-qualidade.md`, `p10c-calculadora-kg.md` (regras da conta) e `x1-experimento-capitulos.md` (regras do experimento, inclusive as exceções e o fallback sem JS).** Em caso de contradição, **este arquivo vence** e o executor não precisa perguntar. Execute **só esta tarefa**. Se algo faltar, **pare e pergunte**.
>
> Branch: `experimento-capitulos`, a partir do commit da X1. Continua valendo: **não alterar nenhum arquivo fora de `experimento/` e `testes/experimento.test.mjs`**.

## Por que

A calculadora é um dos pontos fortes do site atual. No experimento, as duas abas de `#vender` ("Servir na xícara" e "Revender o pacote") são **exatamente os dois modos da calculadora**. Então a conta entra **dentro de cada aba**: o visitante escolhe como vende e, na mesma tela, vê quanto ganha. Para combinar com o estilo, a conta vira **uma frase com os campos dentro**.

## 1. A conta dentro de cada aba

Abaixo da lista de cada painel, separado por um fio dourado de 1px e 48px de espaço, entra um bloco de conta.

**Aba "Servir na xícara":**

> Se eu pago R$ [ kg ] no kg e vendo a xícara de [ 200 ml ▾ ] por R$ [ preço ],
> ganho **R$ 6,96** por xícara.

Abaixo, menor: Xícaras por kg · Custo do pó por xícara · Margem · Ganho por kg.

**Aba "Revender o pacote":**

> Se eu pago R$ [ pacote ] no pacote de 250 g e vendo por R$ [ venda ],
> ganho **R$ 9,00** por pacote.

Abaixo, menor: Margem.

**Regras da conta (iguais às do site atual, P10c):**
- Usar **as funções que já existem**, sem copiar lógica: `calcularResultado`, `coposPorPacote` e `calcularRevenda` de `../js/calculadora.js`, e `formatarReais` de `../js/pedido.js`. Peso do kg, tamanhos de xícara e tamanho inicial vêm de `config.calculadora.xicara`.
- Todos os campos de preço começam **vazios** e nunca são preenchidos com preço da família.
- Enquanto faltar um valor ou ele for inválido, no lugar do número grande aparece o texto `config.textos.padarias.semResultado` (ou `semResultadoRevenda`). Nunca `NaN`.
- "Xícaras por kg" aparece **sempre** (como hoje).
- As dicas do config aparecem abaixo da frase, pequenas: `dicaKg` e `dicaPrecoXicara` na xícara; `dicaPacote` e `config.calculadora.revenda.exemploPrecoVenda` na revenda. O aviso `config.textos.padarias.aviso` fica no fim do bloco da xícara. Se `config.calculadora.xicara.aConfirmar` for `true`, mostrar `avisoExemplo`.
- Os dois blocos ficam no DOM o tempo todo; **trocar de aba não apaga nada** do que foi digitado.

**Textos:** os rótulos dos resultados (`copos`, `custo`, `margem`, `ganhoPacote`, `ganho`, `ganhoRevenda`) vêm de `config.textos.padarias`. Só os **pedaços da frase** são novos, em `experimento/textos.js`: "Se eu pago R$", "no kg e vendo a xícara de", "por R$", "ganho", "por xícara.", "no pacote de 250 g e vendo por R$", "por pacote.", e um título curto para o bloco: "Faça a conta".

**Visual:**
- A frase em Fraunces, `clamp(1.4rem, 2.6vw, 2.1rem)`, linha 1,5, alinhada à esquerda.
- Campos **dentro da frase**: sem caixa, só um fio dourado embaixo (2px), mesma fonte e tamanho da frase, largura de ~6ch, `inputmode="decimal"`, `autocomplete="off"`. No foco, o fio fica mais grosso e aparece o contorno de foco visível. O seletor de xícara é um `<select>` com o mesmo estilo (opções de `config.calculadora.xicara.tamanhos`).
- O **número do ganho** é o protagonista: Fraunces, `clamp(2.4rem, 5vw, 4rem)`, cor `--ouro`. Ao mudar, uma transição curta de opacidade (≤ 200 ms); com movimento reduzido, troca imediata. Sem contagem animada.
- Os detalhes (margem etc.) numa linha discreta, em texto do sistema, cor `--leite` com opacidade suficiente para 4,5:1.

**Acessibilidade:**
- Cada campo tem `<label>` de verdade (pode ser visualmente escondido) com o rótulo do config: `precoKg`, `precoVenda`, `tamanhoXicara`, `precoPacote`, `precoVendaPacote`. As dicas ligadas por `aria-describedby`.
- O resultado tem `aria-live="polite"` e `aria-atomic="true"`, e é anunciado como frase completa ("ganho R$ 6,96 por xícara").
- Alvos de toque ≥ 44 px de altura. No celular a frase quebra naturalmente e os campos continuam utilizáveis.

## 2. Botão "Ver a conta do seu negócio"

Hoje leva para `../index.html#padarias`. Agora ele **rola até o bloco de conta da aba aberta** e coloca o foco no primeiro campo dela. A URL e o resto da navegação continuam como estão.

## 3. Foto da origem nítida no fim da passagem

O arco termina bem maior que a foto de 720 px e ainda cresce por `transform: scale`, então a foto fica borrada.

- Gere `experimento/img/origem-1440.webp` (1440 × 1920, mesmo enquadramento de `img/reais/origem-720.webp`, qualidade em torno de 80, **até 300.000 bytes**) a partir do original `fotos-reais/2.jpeg` (é a foto com os frutos de cacau). **Não altere `img/` nem `fotos-reais/`.** Não adicione `fotos-reais/` ao Git. Se não tiver ferramenta para converter, **pare e avise**.
- Use `srcset` com `../img/reais/origem-720.webp 720w` e `img/origem-1440.webp 1440w`, com `sizes` calculado para o **tamanho final** do arco.
- Troque a lógica do arco: ele é montado **no tamanho final** e, no começo da rolagem, aparece **encolhido** (escala ≤ 1), crescendo até 1. Assim o navegador desenha a foto no tamanho grande e ela fica nítida no fim. O resultado visual da passagem deve ser o mesmo de hoje.
- A foto do hero dentro do arco pode continuar com `hero-720`, desde que não fique borrada; se ficar, use o mesmo esquema.

## 4. Pequena correção

Ao navegar para `#inicio`, o foco não vai para o título porque o `h1` não tem `tabindex="-1"`. Adicione.

## Critérios

| ID | Critério | Como verificar |
|---|---|---|
| Y-01 | Só mudam arquivos de `experimento/` e `testes/experimento.test.mjs`; nada em `img/`, `js/`, `css/`, `index.html`, `testes/` existentes. | `git status` e `git diff --name-only`. |
| Y-02 | Xícara: kg R$ 84,00, 200 ml, venda R$ 12,00 → ganho R$ 6,96 por xícara; custo R$ 5,04; margem 58%; ganho por kg R$ 111,36; xícaras por kg 16. Kg R$ 108,00, 150 ml, venda R$ 12,00 → ganho R$ 7,14; ganho por kg R$ 157,08. | Tela. |
| Y-03 | Revenda: pacote R$ 30,00, venda R$ 39,00 → ganho R$ 9,00, margem 23,1%. Pacote R$ 35,00, venda R$ 59,00 → ganho R$ 24,00, margem 40,7%. | Tela. |
| Y-04 | Campos vazios ou inválidos mostram só o texto de "preencha os dois valores"; nunca `NaN`; "Xícaras por kg" sempre visível. | Tela. |
| Y-05 | Trocar de aba não apaga nenhum campo. | Manual. |
| Y-06 | Todos os campos com `<label>` e dica por `aria-describedby`; resultado com `aria-live`; tudo alcançável por Tab com foco visível; alvos ≥ 44 px. | Teclado e leitura do HTML gerado. |
| Y-07 | "Ver a conta do seu negócio" rola até a conta da aba aberta e foca o primeiro campo. | Clique nas duas abas. |
| Y-08 | Foto da origem nítida no fim da passagem a 1280 e 1920 px; arquivo novo ≤ 300.000 bytes; passagem com o mesmo movimento de antes. | Visual e `Get-ChildItem experimento/img`. |
| Y-09 | Com movimento reduzido: sem transições no número; resto como na X1. | DevTools, "Renderização". |
| Y-10 | A 360, 768 e 1280 px: sem rolagem horizontal; a frase quebra bem e os campos funcionam no toque; 0 erros no console (o aviso "[Intervention] Images loaded lazily" do Edge pode ser ignorado). | DevTools. |
| Y-11 | Textos novos só em `experimento/textos.js`; nenhuma palavra proibida do `p7-qualidade.md`; nenhum preço da família no site. | Busca. |
| Y-12 | `node --test testes/` passa. Se criar função pura nova (por exemplo, para montar a frase do resultado), ela tem teste em `testes/experimento.test.mjs`. | Rodar o comando. |

## Relatório e commit

Relatório final do `AGENTS.md`, com Y-01 a Y-12 (✅ ou ❌ e como verificou) e "Decisões do executor". **Não faça commit**: Daniel testa primeiro e o commit vem depois da aprovação. Sem push.
