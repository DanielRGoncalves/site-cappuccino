# P10c — Aba "Servir na xícara" calculada por kg (branch `visual`)

> **Este arquivo vale em conjunto com `AGENTS.md`, `p7-qualidade.md`, `p8-negocio.md`, `p9-visual.md`, `p10b-calculadora.md` e `p11a-fotos-reais.md`.** Em caso de contradição, **este arquivo vence** e o executor não precisa perguntar. As palavras proibidas do `p7-qualidade.md` continuam proibidas. Execute **só esta tarefa**. Se algo faltar, **pare e pergunte**.

## Por que mudar

Os negócios que **servem na xícara** não compram o pacote de 250 g: compram **por kg** (entregue num pacote de 1 kg separado). Quem **revende** continua comprando o pacote de 250 g. Então cada aba passa a ter o **seu próprio** campo de preço de compra.

Além disso, a família tem aprovação para chamar o produto sem açúcar de **diet**. Nesta tarefa, "diet" entra **só na calculadora**. A aba dos produtos ("Qual escolher?") continua com "Sem açúcar" até chegar a embalagem nova (será outra tarefa).

## Layout novo

```
Quanto rende no seu negócio
Texto de abertura (config)

[ Revender o pacote ] [ Servir na xícara ]       ← abas (como hoje)

── aba Revender o pacote ──
Quanto você paga no pacote de 250 g (R$) [      ]     ← vazio
O valor combinado com a gente.
Por quanto você vende o pacote (R$) [      ]
Para comparar: um cliente nosso vende o tradicional por R$ 39,00 e o diet por R$ 59,00.
Resultado: Ganho por pacote · Margem
("Preencha os dois valores para ver o ganho.")

── aba Servir na xícara ──
[aviso "Valores de exemplo, ainda a confirmar."]
Quanto você paga no kg (R$) [      ]                   ← vazio
O valor combinado com a gente. Para servir na xícara, vendemos por kg.
Tamanho da xícara: (150 ml) (200 ml) (300 ml)          ← começa em 200 ml (como hoje)
Por quanto você vende a xícara (R$) [      ]
Na região, a xícara costuma sair de R$ 8,00 a R$ 24,00, conforme o estabelecimento.
Resultado: Xícaras por kg (sempre) · Custo do pó por xícara · Ganho por xícara · Margem · Ganho por kg
("Preencha os dois valores para ver o ganho.")
Aviso: "A conta considera só o custo do cappuccino em pó. Açúcar extra, energia e perdas não entram."
```

- O campo de preço que hoje fica **acima das abas** (`calculator-package-price`) **sai de lá**. Entram dois campos, um dentro de cada aba: o do pacote (aba Revenda) e o do kg (aba Xícara). Os dois começam **vazios** e nunca são preenchidos com preço da família.
- Cada campo novo tem `label`, dica ligada por `aria-describedby`, `inputmode="decimal"` e o mesmo estilo dos outros.
- Trocar de aba continua **não apagando** nada do que foi digitado.
- Abas, teclado, foco, `aria-live` e visual continuam como na P10b.

## Config

No bloco `calculadora`:

```js
calculadora: {
  revenda: {
    exemploPrecoVenda: "Para comparar: um cliente nosso vende o tradicional por R$ 39,00 e o diet por R$ 59,00.",
  },
  xicara: {
    aConfirmar: true,
    pesoGramas: 1000,          // a conta da xícara é por kg
    tamanhos: [ /* iguais aos de hoje: 150/45, 200/60, 300/90 */ ],
    tamanhoInicialMl: 200,
  },
},
```

Em `textos.padarias` (troca ou cria):

| Chave | Texto |
|---|---|
| `precoPacote` | "Quanto você paga no pacote de 250 g (R$)" |
| `dicaPacote` | "O valor combinado com a gente." (igual) |
| `precoKg` | "Quanto você paga no kg (R$)" |
| `dicaKg` | "O valor combinado com a gente. Para servir na xícara, vendemos por kg." |
| `copos` | "Xícaras por kg" |
| `ganhoPacote` | "Ganho por kg" (era "Ganho por pacote de 250 g") |

Todos os outros textos ficam iguais. Atualize o README (seção da calculadora) com `calculadora.xicara.pesoGramas` e os textos novos.

## Lógica (`js/calculadora.js`)

- **Não precisa de função nova.** A aba Xícara passa a chamar `coposPorPacote(config.calculadora.xicara.pesoGramas, gramas)` e `calcularResultado(precoXicara, precoKg, config.calculadora.xicara.pesoGramas, gramas)`. O resultado `ganhoPacoteCentavos` passa a significar **ganho por kg** (só muda o rótulo).
- A aba Revenda continua com `calcularRevenda(precoVendaPacote, precoPacote)`, agora lendo o campo de pacote **de dentro da aba**.
- `config.pesoPacoteGramas` (250) continua existindo para o resto do site; a calculadora da xícara não usa mais ele.

## Critérios

| ID | Critério | Como verificar |
|---|---|---|
| K-01 | Não existe mais campo de preço acima das abas; a aba Revenda tem "Quanto você paga no pacote de 250 g" e a aba Xícara tem "Quanto você paga no kg", os dois vazios, com as dicas exatas. | Leitura e tela. |
| K-02 | Revenda: pacote R$ 30,00 e venda R$ 39,00 → ganho R$ 9,00 e margem 23,1%. Pacote R$ 35,00 e venda R$ 59,00 → ganho R$ 24,00 e margem 40,7%. | Teste automático e tela. |
| K-03 | Xícara: "Xícaras por kg" mostra 22, 16 e 11 para 150, 200 e 300 ml (aparece sempre). | Teste automático e tela. |
| K-04 | Xícara: kg R$ 84,00, 200 ml, venda R$ 12,00 → custo R$ 5,04, ganho R$ 6,96, margem 58%, ganho por kg R$ 111,36. | Teste automático. |
| K-05 | Xícara: kg R$ 108,00, 150 ml, venda R$ 12,00 → custo R$ 4,86, ganho R$ 7,14, margem 59,5%, ganho por kg R$ 157,08. | Teste automático. |
| K-06 | Com qualquer um dos dois preços de uma aba vazio ou inválido, só aparece "Preencha os dois valores para ver o ganho."; nunca `NaN`. | Teste automático e manual. |
| K-07 | Trocar de aba não apaga nenhum dos quatro campos de preço. | Teste manual. |
| K-08 | "diet" aparece só na frase de comparação da calculadora; a aba "Qual escolher?" continua com "Sem açúcar". | Busca no config e tela. |
| K-09 | Aviso "Valores de exemplo…" só na aba Xícara e some com `aConfirmar: false`. | Trocar o valor e ver. |
| K-10 | A 360, 768 e 1280 px: sem rolagem horizontal, 0 erros e 0 avisos no console, tudo alcançável por teclado com foco visível. | DevTools e Tab. |
| K-11 | `node --test testes/` passa, com os testes da calculadora atualizados (os de "pacote de 30" na xícara saem; entram K-02 a K-05). | Rodar o comando. |

**Commit:** `P10c: xícara calculada por kg`. Sem push. `git add` por nome de arquivo; nunca `git add .`.
