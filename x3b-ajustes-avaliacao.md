# X3b — Ajustes da avaliação (experimento)

> **Este arquivo vale em conjunto com `AGENTS.md`, `p7-qualidade.md`, `x1-experimento-capitulos.md`, `x2-calculadora-frase.md` e `x3-texto-conta-contato.md`.** Em caso de contradição, **este arquivo vence** e o executor não precisa perguntar. Execute **só esta tarefa**. Se algo faltar, **pare e pergunte**.
>
> Branch: `experimento-capitulos`, a partir do commit da X3. Só podem mudar arquivos em `experimento/` e `testes/experimento.test.mjs`. Teto de JS do experimento: **30.000 bytes** (hoje 29.222; esta tarefa deve **economizar** bytes onde puder).

## Por que

Avaliação de 02/11 (Daniel e Claude). A direção visual foi aprovada, mas:
1. Os textos pequenos logo abaixo dos títulos grandes parecem soltos: o título do início tem ~120 px e a frase de baixo tem 17 px em outra fonte, sem nenhum degrau entre eles. O mesmo acontece com "Faça a conta", "Preencha os dois valores…" e as notas do contato.
2. O texto da origem só fica 100% visível no fim do palco e já sai da tela: no desktop, a foto ainda aparece e o texto já foi embora.
3. No celular, o botão "Menu" fixo cobre títulos e a calculadora.
4. Na calculadora, a 1440 px, a vírgula depois do último campo cai sozinha na linha de baixo.
5. O botão "Ver a conta do seu negócio" aparece embaixo da própria conta (redundante).
6. Em telas largas (≥ 1600 px) o conteúdo se espalha: no "Duas formas de vender", a foto fica colada na borda direita, longe do texto.

## 1. Sexto estilo de texto: Entrada

Acrescente ao sistema de texto do topo do `experimento.css`:

| Estilo | Fonte | Tamanho | Uso |
|---|---|---|---|
| Entrada | Fraunces, peso 380 | `clamp(1.15rem, 1.7vw, 1.5rem)`, linha 1,45 | a frase **logo abaixo** de um título de Abertura ou Capítulo |

Use a Entrada em: frase de apoio do hero (`textos.apoio`), texto da origem, texto do contato ("A gente leva…"). Largura máxima: 34ch.

**Espaço título → Entrada:** 28 px no desktop, 18 px no celular (substitui os margens atuais desses três parágrafos). O botão vem 32 px depois da Entrada.

A tabela da X3 passa a ter 6 estilos; a regra "nenhum outro `font-size` no CSS" continua valendo.

## 2. Textos pequenos com função clara

**Calculadora:**
- "Faça a conta": continua no estilo Nota, mas ganha um fio `--ouro` de 32 × 2 px **acima** dele (12 px de distância) e 28 px de espaço até a frase. Assim vira uma etiqueta, não uma linha perdida.
- "Preencha os dois valores para ver o ganho." fica **colado embaixo do número** (8 px), alinhado pela esquerda com o início do número, em vez de solto embaixo da frase.
- **Vírgula:** a vírgula depois do último campo fica sempre junto do campo (envolver campo + vírgula num elemento com `white-space: nowrap`). Vale para as duas abas.

**Contato (notas do rodapé):** em vez de 5 linhas iguais, dois grupos:
- Grupo 1, em duas colunas no desktop (uma no celular): **Entrega** e **Pagamento**. Cada um com rótulo em Nota na cor `--ouro` e a resposta do FAQ embaixo, em Nota `--leite` (como já vem do config). Rótulos novos em `textos.js`: "Entrega", "Pagamento".
- Grupo 2, depois de 24 px: razão social, CNPJ e endereço numa linha só no desktop, separados por " · " (quebram normalmente no celular), em Nota com opacidade de cor que mantenha contraste ≥ 4,5:1. Depois, o link "Voltar ao site atual".

## 3. Origem com tempo de leitura

Hoje (`experimento.js`, função do palco): `--sair` 0–0,35, `--troca` 0,4–0,6, `--fundo` 0,35–0,6, `--entrar` 0,6–1, e `.com-movimento .capitulos { height: 220vh }`.

Mude para:
- `--sair` 0–0,3; `--fundo` 0,3–0,55; `--troca` 0,35–0,55; `--entrar` 0,55–0,75.
- `.capitulos` com `height: 260vh`.

Resultado esperado: depois de entrar, o texto da origem fica **parado e 100% visível** por pelo menos 35% da altura da tela de rolagem antes de o palco ir embora, no desktop e no celular. Movimento reduzido continua sem animação.

## 4. Botão Menu no celular

Só em telas até 540 px:
- Ao rolar **para baixo** mais de 120 px, o botão sai de cena (desliza para cima e some, 200 ms). Ao rolar **para cima** ou voltar ao topo, ele volta.
- Ele **sempre** aparece quando recebe foco pelo teclado ou quando o menu está aberto.
- Com movimento reduzido: aparece e some sem deslizar.
- Escute a rolagem com `{ passive: true }` e só mude uma classe; nada de cálculo pesado a cada evento.

No desktop, nada muda.

## 5. Botão redundante

Remova o botão "Ver a conta do seu negócio" que fica **depois** da calculadora (`botaoConta` em `experimento.js`). Ali fica só "Pedir degustação gratuita". O botão do hero "Ver as duas formas de vender" continua.

## 6. Largura máxima

Em `.vender` e `.contato`, o conteúdo fica num miolo de no máximo **1280 px**, centralizado (o fundo continua de ponta a ponta). No "Duas formas de vender", a foto do painel fica a no máximo 8vw do texto, sem colar na borda.

## Critérios

| ID | Critério | Como verificar |
|---|---|---|
| A-01 | Só mudam arquivos de `experimento/` e `testes/experimento.test.mjs`. | `git status`, `git diff --name-only`. |
| A-02 | Estilo Entrada criado e usado no apoio do hero, no texto da origem e no texto do contato; nenhum `font-size` fora dos 6 estilos (exceções da X3 mantidas). | Busca por `font-size` e tela. |
| A-03 | "Faça a conta" com fio dourado acima; "Preencha os dois valores…" colado embaixo do número. | Tela nas duas abas. |
| A-04 | A vírgula nunca fica sozinha numa linha a 360, 768, 1280, 1440 e 1920 px. | DevTools, modo responsivo. |
| A-05 | Notas do contato em dois grupos (Entrega/Pagamento com rótulo dourado; dados legais juntos); textos de entrega e pagamento continuam vindo do config. | Tela e leitura do código. |
| A-06 | O texto da origem fica parado e 100% opaco por ≥ 35% da altura da tela de rolagem, a 1440 × 900 e 390 × 844. | Rolar devagar; anotar no relatório o intervalo de rolagem medido. |
| A-07 | No celular, o Menu some ao rolar para baixo e volta ao rolar para cima; aparece com Tab e com o menu aberto; desktop igual a antes. | DevTools 390 px e teclado. |
| A-08 | Botão "Ver a conta do seu negócio" removido de depois da calculadora. | Tela. |
| A-09 | A 1920 px, `.vender` e `.contato` ficam num miolo de até 1280 px; sem rolagem horizontal a 360, 768, 1280 e 1920 px. | DevTools. |
| A-10 | Contraste ≥ 4,5:1 em todo texto; 0 erros no console; com movimento reduzido, nada se move. | DevTools. |
| A-11 | `node --test testes/` passa (incluir testes para: 6 estilos, rótulos "Entrega"/"Pagamento" no `textos.js`, ausência do `botaoConta` depois da conta); JS do experimento ≤ 30.000 bytes. | Comando e `Get-ChildItem experimento`. |

## Relatório e commit

Relatório final do `AGENTS.md`, com A-01 a A-11, o tamanho final do JS e "Decisões do executor". **Não faça commit**: Daniel testa primeiro. Sem push.
