# P10b — Calculadora com duas abas: revender o pacote e servir na xícara (branch `visual`)

> **Este arquivo vale em conjunto com `prototipo.md`, `p7-qualidade.md`, `p8-negocio.md` e `p9-visual.md`.** Em caso de contradição, **este arquivo vence** e o executor não precisa perguntar. As demais regras do `AGENTS.md` continuam valendo (config único, sem frameworks nem CDNs, sem `innerHTML` com dados, acessibilidade, preços em centavos). As palavras proibidas do `p7-qualidade.md` continuam proibidas. Execute **só esta tarefa**. Se algo faltar, **pare e pergunte**.

## Por que mudar

Os negócios ganham dinheiro com o cappuccino de **dois jeitos**:
1. **Revendem o pacote de 250 g** na prateleira (exemplo real: uma padaria que já é cliente vende o com açúcar por R$ 39,00 e o sem açúcar por R$ 59,00).
2. **Servem na xícara.** A xícara é de louça e reutilizada, então não existe custo de copo descartável.

A calculadora atual só cobre o item 2 e fala em "copo". Ela passa a ter duas abas, e a palavra "copo" sai da calculadora (vira "xícara").

## Layout

```
Quanto rende no seu negócio            (título, já existe)
Texto de abertura                      (novo, config)
[aviso "Valores de exemplo…"]          (só na aba Xícara, ver abaixo)

Quanto você paga no pacote (R$)  [      ]   ← campo único, compartilhado pelas duas abas
O valor combinado com a gente.

[ Revender o pacote ] [ Servir na xícara ]  ← abas

── aba Revender o pacote ──
Por quanto você vende o pacote (R$) [      ]
Para comparar: um cliente nosso vende o com açúcar por R$ 39,00 e o sem açúcar por R$ 59,00.
Resultado: Ganho por pacote · Margem
(antes de preencher: "Preencha os dois valores para ver o ganho.")

── aba Servir na xícara ──
Tamanho da xícara: (150 ml) (200 ml) (300 ml)     ← começa em 200 ml
Por quanto você vende a xícara (R$) [      ]   ← começa vazio
Na região, a xícara costuma sair de R$ 8,00 a R$ 24,00, conforme o estabelecimento.
Resultado: Xícaras por pacote (sempre) · Custo do pó por xícara · Ganho por xícara · Margem · Ganho por pacote de 250 g
(antes de preencher o pacote e o preço da xícara: "Preencha os dois valores para ver o ganho.")
Aviso: "A conta considera só o custo do cappuccino em pó. Açúcar extra, energia e perdas não entram."
```

- A aba que abre primeiro é **Revender o pacote**.
- As abas seguem o **mesmo padrão acessível do seletor "Qual escolher?"** (`role="tablist"`, `role="tab"`, `aria-selected`, `role="tabpanel"`, setas, Home e End, foco visível). Reaproveite o código existente em `js/main.js` em vez de escrever outro do zero, desde que o comportamento do "Qual escolher?" não mude.
- O campo do pacote fica **fora das abas** e vale para as duas: trocar de aba não apaga o que foi digitado em nenhum campo.
- Resultados continuam dentro de uma área `aria-live="polite"` em cada aba.
- O visual segue a P9 (seção clara, mesmos estilos de campo e botões de tamanho).

## Config (substitui o bloco `calculadora` atual)

```js
calculadora: {
  revenda: {
    exemploPrecoVenda: "Para comparar: um cliente nosso vende o com açúcar por R$ 39,00 e o sem açúcar por R$ 59,00.",
  },
  xicara: {
    aConfirmar: true,
    tamanhos: [
      { ml: 150, gramas: 45 },
      { ml: 200, gramas: 60 },
      { ml: 300, gramas: 90 },
    ],
    tamanhoInicialMl: 200,
  },
},
```

Textos em `textos.padarias` (substituem ou completam os atuais):

| Chave | Texto |
|---|---|
| `descricao` | "Veja quanto você ganha revendendo o pacote na prateleira ou servindo o cappuccino na xícara." |
| `precoPacote` | "Quanto você paga no pacote (R$)" (já existe) |
| `dicaPacote` | "O valor combinado com a gente." (já existe) |
| `abaRevenda` | "Revender o pacote" |
| `abaXicara` | "Servir na xícara" |
| `precoVendaPacote` | "Por quanto você vende o pacote (R$)" |
| `ganhoRevenda` | "Ganho por pacote" |
| `semResultadoRevenda` | "Preencha os dois valores para ver o ganho." |
| `tamanhoXicara` | "Tamanho da xícara" (substitui `tamanhoCopo`) |
| `precoVenda` | "Por quanto você vende a xícara (R$)" |
| `dicaPrecoXicara` | "Na região, a xícara costuma sair de R$ 8,00 a R$ 24,00, conforme o estabelecimento." |
| `copos` | "Xícaras por pacote" |
| `custo` | "Custo do pó por xícara" |
| `ganho` | "Ganho por xícara" |
| `margem` | "Margem" (já existe; usado nas duas abas) |
| `ganhoPacote` | "Ganho por pacote de 250 g" (já existe) |
| `semResultado` | "Preencha os dois valores para ver o ganho." (substitui o texto atual) |
| `aviso` | "A conta considera só o custo do cappuccino em pó. Açúcar extra, energia e perdas não entram." |
| `avisoExemplo` | "Valores de exemplo, ainda a confirmar." (já existe) |

- O aviso "Valores de exemplo, ainda a confirmar." aparece **só na aba Servir na xícara** e só se `calculadora.xicara.aConfirmar` for `true`.
- Remova as chaves que deixarem de ser usadas (`tamanhoCopo`, `copos` antigo do bloco `calculadora`, `exemploPrecoCopoCentavos`). **Não existe mais preço de exemplo da xícara**: o campo começa vazio e a dica fica ligada a ele por `aria-describedby`, como a dica do pacote. Procure no projeto para não deixar referência quebrada.
- O README tem a seção "Mudar os preços da calculadora": atualize para os novos nomes (`calculadora.xicara.tamanhos`, `tamanhoInicialMl`, `aConfirmar`, o texto `calculadora.revenda.exemploPrecoVenda` e a dica `textos.padarias.dicaPrecoXicara`).

## Lógica (`js/calculadora.js`, sem DOM)

- Mantenha `coposPorPacote`, `precoVendaCentavos` e `calcularResultado` funcionando como hoje (são usados pela aba Xícara).
- Crie `calcularRevenda(precoVenda, precoPacote)`:
  - Usa `precoVendaCentavos` para ler os dois valores.
  - Retorna `{ ganhoCentavos, margemPercentual }`, com margem = ganho ÷ preço de venda × 100.
  - Retorna `null` se algum valor for inválido (vazio, zero, negativo, texto, `NaN`, `Infinity`), igual às outras funções.
  - Ganho negativo (vender mais barato do que pagou) é mantido, não vira `null`.

## Critérios

| ID | Critério | Como verificar |
|---|---|---|
| X-01 | Duas abas, "Revender o pacote" abre primeiro; mouse, toque, setas, Home e End funcionam; foco visível; o "Qual escolher?" continua funcionando igual. | Teste manual com teclado. |
| X-02 | Campo do pacote único, fora das abas, começa vazio; trocar de aba não apaga nenhum campo. | Teste manual. |
| X-03 | Revenda: pacote R$ 30,00 e venda R$ 39,00 → ganho R$ 9,00 e margem 23,1%. Pacote R$ 35,00 e venda R$ 59,00 → ganho R$ 24,00 e margem 40,7%. | Teste automático da função e conferência na tela. |
| X-04 | Revenda: com algum campo vazio ou inválido, só aparece "Preencha os dois valores para ver o ganho."; nunca `NaN`. | Teste automático e manual. |
| X-05 | Xícara: tamanhos 150, 200 e 300 ml, começando em 200 ml; "Xícaras por pacote" mostra 5, 4 e 2 (aparece sempre). O campo do preço da xícara começa vazio, com a dica de R$ 8,00 a R$ 24,00; sem os dois preços, só aparece "Preencha os dois valores para ver o ganho." | Teste automático e manual. |
| X-06 | Xícara: pacote R$ 30,00, 200 ml, venda R$ 15,00 → custo R$ 7,20, ganho R$ 7,80, margem 52%, ganho por pacote R$ 31,20. | Teste automático. |
| X-07 | A palavra "copo" não aparece mais em nenhum texto da calculadora; aviso novo sem "Copo". | Busca em `js/config.js` e leitura da tela. |
| X-08 | Aviso "Valores de exemplo…" só na aba Xícara e some com `calculadora.xicara.aConfirmar: false`. | Trocar o valor e ver. |
| X-09 | Todos os textos vêm do config; README atualizado; nenhuma chave antiga sobrando. | Busca no projeto. |
| X-10 | A 360, 768 e 1280 px: sem rolagem horizontal, 0 erros e 0 avisos no console, tudo alcançável por teclado. | DevTools e Tab. |
| X-11 | `node --test testes/` passa, com os testes da calculadora atualizados (os valores antigos de 100 ml saem; entram X-03 a X-06). | Rodar o comando. |

**Commit:** `P10b: calculadora com revenda e xícara`. Sem push. `git add` por nome de arquivo.
