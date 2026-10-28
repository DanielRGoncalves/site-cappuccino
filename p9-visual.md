# P9 e P10 — Protótipo visual (branch `visual`)

> **Este arquivo vale em conjunto com `prototipo.md`, `p7-qualidade.md` e `p8-negocio.md`.** Em caso de contradição, **este arquivo vence** e o executor não precisa perguntar. As demais regras do `AGENTS.md` continuam valendo (config único, sem frameworks nem CDNs, sem fontes externas, sem `innerHTML` com dados, acessibilidade, imagens com `width`/`height`/`alt`). As palavras e afirmações proibidas do `p7-qualidade.md` continuam proibidas. Execute **só a tarefa pedida (P9 ou P10)**. Se algo faltar, **pare e pergunte**.

## O que é

Um **protótipo** para a família ver como o site pode ficar, com fotos ilustrativas tiradas da internet. **Não é publicado:** fica na branch `visual` e é visto pelo Live Server. As fotos estão em `img/ilustrativas/` (leia `img/ilustrativas/fontes.txt`) e serão trocadas por fotos reais depois.

## Direção visual

A identidade vem da embalagem real: saco preto fosco com letras em dourado e o selo redondo do leão. O protótipo mantém isso e aquece o fundo, que hoje é um preto neutro, para um tom de café torrado.

**Paleta (substitui as variáveis de cor atuais em `:root`)**

| Nome | Hex | Uso |
|---|---|---|
| `--torra` | `#17110d` | Fundo principal |
| `--torra-2` | `#231a13` | Superfícies (cartões, cabeçalho) |
| `--leite` | `#f1e7d8` | Texto principal no fundo escuro; fundo das seções claras |
| `--ouro` | `#c9a45b` | Botão principal, detalhes, selo do **com açúcar** (o dourado da embalagem) |
| `--cacau` | `#3b2618` | Texto nas seções claras |
| `--folha` | `#6f8a5a` | Selo do **sem açúcar** e detalhes ligados a ele |

Contraste mínimo de 4,5:1 para todo texto. Se alguma combinação não passar, escureça ou clareie o tom e registre no relatório.

**Tipografia:** sem fontes externas. Títulos em `Georgia, "Times New Roman", serif`; texto em `system-ui, "Segoe UI", Roboto, sans-serif`. Corpo com 17 px, altura de linha 1,6, linhas com até 70 caracteres. Escala dos títulos: 17 → 21 → 26 → 33 → 41 → 52 px (h1 com 41 px no celular e 52 px no PC). Títulos em letra normal (sem caixa alta), sem palavra destacada em outra cor ou itálico, e sem rótulos em caixa alta acima dos títulos.

**O elemento marcante (só um):** a foto do início fica numa moldura **com o topo em arco**, como uma janela, com um fio dourado fino por dentro, ecoando o selo redondo do logo. O resto da página fica calmo.

**Ritmo:** seções escuras, com **duas seções claras** (fundo `--leite`, texto `--cacau`) para quebrar: "Qual escolher?" e "A conta".

**Movimento:** só a foto do início aparece com um fade curto (até 400 ms) ao carregar. Nenhuma outra animação de entrada. Com `prefers-reduced-motion: reduce`, nada se move.

**Proibido no visual:** caixa alta nos rótulos, seta "→" em botões, sombras iguais em todos os cartões, gradientes decorativos, numeração 01/02/03 fora do preparo e do "Como funciona" (que são sequências de verdade).

**Fotos (para a P9):** gerar versões WebP em `img/ilustrativas/` e usar só elas na página. Todas as fotos são verticais e estreitas (cerca de 736 px de largura); **não usar nenhuma esticada em largura total**: elas ficam em colunas ou molduras.

| Original | WebP | Limite |
|---|---|---|
| `hero.jpg` | `hero-720.webp` e `hero-480.webp` | ≤ 120 KB cada |
| `origem.jpg` | `origem-720.webp` | ≤ 100 KB |
| `cafe.png` | `cafe-720.webp` | ≤ 100 KB |
| `cacau.jpg` | `cacau-720.webp` | ≤ 100 KB |
| `preparo-2.jpg` | `preparo-2-480.webp` | ≤ 70 KB |

Foto que falta (mãos, preparo 1, preparo 3, balcão) vira um **espaço reservado**: um quadro em `--torra-2` com fio dourado e o texto pequeno "Foto a definir", no mesmo tamanho que a foto teria.

---

## P9 — Visual, fotos e produtos

### 1. Marcação de protótipo
- Faixa fina no topo da página, acima do cabeçalho: "Protótipo: as fotos são ilustrativas e serão trocadas por fotos reais." O texto vem do config (`apresentacao.avisoPrototipo`), e a faixa só aparece se `apresentacao.prototipo` for `true`.
- `<meta name="robots" content="noindex">` no `<head>`, fora do bloco `SINCRONIZAR`, com um comentário: "Remover ao publicar a versão oficial".

### 2. Início (hero)
```
PC (≥ 920 px)                              Celular
┌──────────────────────────┬────────────┐  ┌──────────────┐
│ Título (h1)              │  ╭──────╮  │  │  ╭────────╮  │
│ Subtítulo                │  │ foto │  │  │  │  foto  │  │
│ [Pedir degustação]       │  │ arco │  │  │  ╰────────╯  │
│ [Ver a conta]            │  ╰──────╯  │  │ Título       │
└──────────────────────────┴────────────┘  │ Subtítulo    │
                                           │ [Botões]     │
                                           └──────────────┘
```
- Texto alinhado à esquerda. A foto (`hero-720.webp` com `srcset` para `hero-480.webp`) fica na moldura em arco. No celular, a foto vem antes do texto, com altura máxima de 60% da tela.
- Títulos, textos e botões continuam os do config (P8). Nenhum texto novo.

### 3. Nova faixa "Origem" (`#origem`), logo depois do início
- Duas colunas no PC (foto à esquerda, texto à direita); uma coluna no celular.
- Foto: `origem-720.webp`.
- Texto (config, `textos.origem`): título "Feito à mão em Taparuba, Minas Gerais" e parágrafo "Cada pacote é preparado pela família, em casa, com café Conilon e cacau 100%."
- Não entra no menu.

### 4. Diferenciais com fotos
- Os 4 cartões continuam com os mesmos textos. Cada um ganha uma imagem acima do título: Café Conilon → `cafe-720.webp`; Cacau 100% → `cacau-720.webp`; Feito à mão, em casa → espaço reservado; Aroma, sensações e cremosidade → espaço reservado.
- As imagens dos cartões vêm de um novo campo `foto` em cada cartão do config (vazio = espaço reservado).

### 5. Produtos viram "Qual escolher?" (seção clara)
- A seção `#produtos` fica com fundo `--leite`. Título (config): "Qual escolher?".
- No lugar dos dois cards, **um seletor com duas abas**: "Com açúcar" e "Sem açúcar". Acessível: `role="tablist"`, `role="tab"`, `aria-selected`, `role="tabpanel"`, setas do teclado trocam de aba, foco visível.
- Cada aba mostra: a foto do produto (a provisória que já existe), o nome, um **selo** com a cor do produto (`--ouro` para com açúcar, `--folha` para sem açúcar), a frase da aba, o peso (250 g), os avisos visíveis e os ingredientes no `<details>` (como hoje).
- Frases das abas (config, novo campo `frase` em cada produto):
  - Com açúcar: "Já vem adoçado: é só misturar com água quente e servir."
  - Sem açúcar: "Sem açúcar refinado na receita, para quem prefere adoçar a gosto."
- Abaixo do seletor, uma linha (config, `textos.produtos.igual`): "Nos dois: café Conilon, cacau 100% e o mesmo preparo."
- Preço continua oculto (`mostrarPrecos: false`).

### 6. Preparo com fotos
- Os 3 passos continuam com os mesmos textos, agora com imagem em cada um: passo 1 → espaço reservado; passo 2 → `preparo-2-480.webp`; passo 3 → espaço reservado. A numeração 1, 2, 3 fica (é uma sequência).

### 7. Não mexer
Calculadora, formulário (são da P10), FAQ, "Como funciona", "Por que vender", rodapé, mensagens de WhatsApp e meta tags do bloco `SINCRONIZAR` ficam como estão (só ganham a paleta nova).

### Critérios da P9

| ID | Critério | Como verificar |
|---|---|---|
| V-01 | Faixa de protótipo visível com o texto do config; some com `apresentacao.prototipo: false`. Meta `noindex` presente com o comentário. | Leitura e teste trocando o valor. |
| V-02 | Paleta nova aplicada pelas variáveis; nenhum texto com contraste abaixo de 4,5:1. | DevTools (contraste) nas seções escuras e claras. |
| V-03 | Hero: foto na moldura em arco com fio dourado; no PC, texto à esquerda e foto à direita; no celular, foto antes do texto e no máximo 60% da altura da tela. | Visual a 360 e 1280 px. |
| V-04 | Faixa `#origem` com a foto e os textos exatos do config. | Leitura. |
| V-05 | Diferenciais com as fotos indicadas e espaços reservados "Foto a definir" nos outros dois. | Visual. |
| V-06 | "Qual escolher?": abas funcionam com mouse, toque e setas do teclado; selos com as cores certas; frases exatas; avisos visíveis; ingredientes no `<details>`; "descafeinado" não aparece; nenhum preço. | Teste manual e teste automático das funções puras. |
| V-07 | Preparo com a imagem do passo 2 e espaços reservados nos passos 1 e 3. | Visual. |
| V-08 | Todas as imagens novas em WebP, nos limites de tamanho, com `width`, `height`, `alt` útil e `loading="lazy"` fora da primeira tela. Nenhuma foto esticada além do tamanho original. | Tamanho dos arquivos e leitura do HTML. |
| V-09 | Só a foto do início tem animação de entrada; com movimento reduzido, nada se move. | DevTools (emular `prefers-reduced-motion`). |
| V-10 | A 360, 768 e 1280 px: sem rolagem horizontal, sem `overflow-x: hidden` em `html`/`body`, 0 erros e 0 avisos no console. | DevTools. |
| V-11 | Todos os textos novos vêm do config; nenhuma palavra proibida do `p7-qualidade.md`. | Busca no projeto. |
| V-12 | `node --test testes/` passa, com os testes atualizados para a nova estrutura. | Rodar o comando. |

**Commit:** `P9: protótipo visual`. Sem push. Não commitar o arquivo original `img/ilustrativas/cafe.png` (4,7 MB); commitar as versões WebP, os outros originais e o `fontes.txt`.

---

## P10 — Calculadora nova e formulário de degustação

### 1. Calculadora (`#padarias`, seção clara)
- Os valores abaixo são **de exemplo** e ficam no config com `aConfirmar: true`. Enquanto for `true`, a calculadora mostra o aviso "Valores de exemplo, ainda a confirmar." (config).
- Config novo (`calculadora`):
  ```js
  calculadora: {
    aConfirmar: true,
    copos: [
      { ml: 100, gramas: 30 },
      { ml: 150, gramas: 45 },
      { ml: 200, gramas: 60 },
    ],
    exemploPrecoCopoCentavos: 900,
  },
  ```
- Campos, nesta ordem:
  1. **Tamanho do copo**: botões de escolha 100 ml, 150 ml e 200 ml (um grupo de rádios estilizado, acessível). Começa em 100 ml.
  2. **Quanto você paga no pacote (R$)**: campo vazio, com a dica "O valor combinado com a gente." Nunca preenchido com o preço de vocês.
  3. **Por quanto você vende o copo (R$)**: já preenchido com o exemplo do config (R$ 9,00).
- Resultados:
  - **Copos por pacote** (250 g ÷ gramas do copo, arredondado para baixo): aparece sempre, mesmo sem o preço do pacote.
  - **Custo do pó por copo, ganho por copo, margem e ganho por pacote**: só aparecem quando o preço do pacote for preenchido. Antes disso, uma linha: "Preencha o valor do pacote para ver o ganho."
  - O aviso atual ("A conta considera só o custo do cappuccino em pó...") continua.
- Funções puras em `js/calculadora.js` (sem DOM), com testes: copos por pacote por tamanho, custos e ganhos, entradas inválidas (vazio, zero, negativo, texto) sem `NaN`.
- Título e textos continuam do config. Os rótulos novos também vão para o config.

### 2. Formulário de degustação (`#degustacao`, logo antes do FAQ)
- Título (config): "Pedir degustação gratuita". Texto: "Conte um pouco sobre o seu negócio. Abrimos a conversa no WhatsApp com tudo preenchido."
- Campos:
  - "Nome do negócio" (obrigatório)
  - "Tipo de negócio": Padaria, Cafeteria, Restaurante, Outro (obrigatório)
  - "Bairro e cidade" (obrigatório)
  - "Cappuccinos vendidos por dia, mais ou menos" (opcional, número)
- Botão: "Abrir conversa no WhatsApp".
- Ao enviar, abre `https://wa.me/<número do config>?text=` com esta mensagem (codificada com `encodeURIComponent`):
  ```
  Olá! Vi o site e quero pedir uma degustação do cappuccino.
  Negócio: <nome> (<tipo>)
  Local: <bairro e cidade>
  Cappuccinos por dia: <número ou "não informado">
  ```
- Mensagens de erro, ao lado do campo e anunciadas para leitor de tela: "Escreva o nome do seu negócio.", "Escolha o tipo de negócio.", "Escreva o bairro e a cidade." Nada é salvo em lugar nenhum.
- O botão "Pedir degustação gratuita" do início passa a **rolar até `#degustacao`** (em vez de abrir o WhatsApp). O botão flutuante continua abrindo o WhatsApp com a mensagem geral.
- A função que monta a mensagem fica em `js/pedido.js`, pura, com testes.

### Critérios da P10

| ID | Critério | Como verificar |
|---|---|---|
| W-01 | Seletor de copo com 100, 150 e 200 ml; "Copos por pacote" muda com o tamanho (8, 5 e 4 com os valores de exemplo). | Teste automático e manual. |
| W-02 | O campo do pacote começa vazio e nunca mostra o preço de vocês; os valores em R$ só aparecem depois de preenchido. | Teste manual. |
| W-03 | Com pacote R$ 30,00, copo de 100 ml e venda R$ 9,00: custo R$ 3,60, ganho R$ 5,40, margem 60%, ganho por pacote R$ 43,20. | Teste automático. |
| W-04 | Entradas inválidas não geram `NaN` nem resultado. | Teste automático. |
| W-05 | Aviso "Valores de exemplo, ainda a confirmar." aparece com `aConfirmar: true` e some com `false`. | Trocar o valor e ver. |
| W-06 | Formulário valida os 3 campos obrigatórios com as mensagens exatas; o erro é anunciado (`aria-describedby`/`aria-live`). | Teste manual com teclado e envio vazio. |
| W-07 | Com tudo preenchido, o link aberto tem a mensagem exata, em 4 linhas, codificada. | Teste automático da função e inspeção do link. |
| W-08 | O botão do início rola até `#degustacao`; o flutuante continua com a mensagem geral. | Clique a 360 e 1280 px. |
| W-09 | A 360, 768 e 1280 px: sem rolagem horizontal, 0 erros e 0 avisos no console; tudo alcançável por teclado com foco visível. | DevTools e Tab. |
| W-10 | `node --test testes/` passa. | Rodar o comando. |

**Commit:** `P10: calculadora nova e formulário de degustação`. Sem push.

## Verificação humana (Daniel)
- Abrir pelo Live Server (VS Code aberto **dentro** de `site-cappuccino`) no PC e no celular (mesmo Wi-Fi) e mostrar à família.
- Anotar o que agrada e o que não agrada antes de ir para a versão oficial.
- Os números da calculadora continuam de exemplo até a família e as padarias confirmarem (checklist 1).
