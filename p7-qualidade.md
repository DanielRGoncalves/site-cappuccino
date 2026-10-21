# P7 — Destacar a qualidade e os diferenciais do cappuccino (versão 2)

> **Esta tarefa vale em conjunto com `prototipo.md`** (branch `prototipo`). Em caso de contradição entre este arquivo e `prototipo.md`, `brief.md`, `criterios.md`, `tarefas.md` ou o `AGENTS.md`, **este arquivo vence** e o executor não precisa perguntar. Todas as demais regras do `AGENTS.md` continuam valendo (config único, sem frameworks, sem `innerHTML` com dados, acessibilidade, imagens com `width`/`height`/`alt`). Se algo faltar e não estiver aqui, **pare e pergunte**.

## Objetivo

Mostrar logo no começo do site **por que este cappuccino é diferente** e por que a padaria deveria vendê-lo: é artesanal e gourmet, feito à mão, com café Conilon e cacau 100%, sem processo industrial. A mensagem central é **qualidade + simplicidade no processo**. Também deixar claro que a **degustação é gratuita**.

## Fatos autorizados (informados pela família em 21/10/2026)

- O café é o **Conilon**, para dar mais sabor.
- O chocolate é **cacau 100%**, não achocolatado. (O rótulo impresso da embalagem está desatualizado e ainda cita achocolatado e café solúvel; o site segue os dados atuais.)
- O cappuccino é feito **à mão, em casa**, sem processo industrial. É **artesanal** e **gourmet**.
- Ingredientes do **cappuccino com açúcar**: leite em pó integral, bicarbonato de sódio, canela em pó, cacau 100%, açúcar refinado e café Conilon.
- Avisos da embalagem: "Contém leite e derivados." e "Não contém glúten."
- Conservação: em local seco, **ventilado** e protegido da luz solar.
- A **degustação é gratuita**: a família leva uma pequena quantidade do cappuccino e a água quente, e a pessoa experimenta na hora. Ela acontece antes da primeira venda.
- Só existe o pacote de 250 g (não há embalagem maior).
- Valem as ideias de **aroma, sensações e cremosidade**, só em termos gerais.

## Proibido (não escreva em lugar nenhum)

- "Premium", "melhor", "o melhor", "mais saudável" ou qualquer benefício de saúde.
- "Sem conservantes", "sem aditivos", "natural", "orgânico" ou qualquer selo ou certificação. (O bicarbonato de sódio é um aditivo, então "sem aditivos" seria falso.)
- "Achocolatado" ou "café solúvel" como ingrediente do produto (a única menção permitida de achocolatado é a frase "Cacau 100%, não achocolatado.").
- Origem do café (região ou fazenda), pontuação ou qualquer dado de qualidade que não esteja aqui.
- Nomes de marcas concorrentes e frases que ataquem produtos industriais. A comparação é só do nosso lado.
- Lista de ingredientes ou avisos para o **cappuccino sem açúcar** (a família ainda não informou). O campo fica vazio e a linha, oculta.

## Textos (use exatamente estes, todos no `js/config.js`)

### Hero
- Subtítulo (substitui o atual): "Artesanal e gourmet, feito à mão com café Conilon e cacau 100%. Pronto com água quente. Entregamos na Grande Vitória, sem taxa. Antes de qualquer venda, a degustação é gratuita."
- O botão principal passa de "Pedir degustação" para **"Pedir degustação gratuita"**. O link do WhatsApp e a mensagem dele não mudam. O segundo botão e o título não mudam. Troque o texto do botão em todos os lugares onde ele aparece (hero e contato) e nos testes.

### Nova seção `#diferenca`, logo depois do hero e antes de `#produtos`
- Título: "Feito à mão, do jeito simples"
- Quatro cartões, nesta ordem (título e texto):
  1. **Café Conilon** — "Café Conilon para dar mais sabor ao cappuccino."
  2. **Cacau 100%** — "Cacau 100%, não achocolatado."
  3. **Feito à mão, em casa** — "Preparado à mão, em casa, sem processo industrial."
  4. **Aroma, sensações e cremosidade** — "Um aroma que se sente ao preparar, sabor que aparece na xícara e uma textura cremosa."
- Frase de destaque no fim da seção: "Artesanal e gourmet: qualidade e simplicidade no processo."

### Cards de produto (`#produtos`)
Cada produto ganha, no config, o campo `ingredientes` (texto) e `avisos` (texto). Se o campo for vazio, a linha **não aparece**.
- **Com açúcar:** `ingredientes`: "Leite em pó integral, bicarbonato de sódio, canela em pó, cacau 100%, açúcar refinado e café Conilon." `avisos`: "Contém leite e derivados. Não contém glúten."
- **Sem açúcar:** os dois campos ficam vazios (vazio = linha oculta).
No card, mostre "Ingredientes: …" e, abaixo, os avisos, em texto pequeno, sem destaque exagerado.

### Menu (7 itens, nesta ordem)
Diferenciais (`#diferenca`), Produtos (`#produtos`), Por que vender (`#porque`), A conta (`#padarias`), Como funciona (`#como`), Dúvidas (`#faq`), Contato (`#contato`).

### "Por que vender" (`#porque`): 5 cartões
O primeiro é novo: "Um diferencial para o seu cardápio: cappuccino artesanal, feito à mão e com cacau 100%." Os 4 que já existem continuam, na mesma ordem, depois dele.

### Como funciona (`#como`): passo 2 muda
"2. Fazemos uma degustação gratuita: levamos uma pequena quantidade do cappuccino e a água quente, e você experimenta na hora." Os passos 1 e 3 não mudam.

### FAQ: 7 itens
- Nova pergunta, em **primeiro lugar**: "O que torna este cappuccino diferente do industrial?" Resposta: "Ele é feito à mão, em casa, sem processo industrial. O chocolate é cacau 100%, não achocolatado, e o café é Conilon. A ideia é qualidade e simplicidade no preparo."
- A resposta de "Como funciona a degustação?" passa a ser: "A degustação é gratuita e acontece antes da primeira venda. Levamos uma pequena quantidade do cappuccino e a água quente, e você experimenta na hora."
- Na resposta que fala da conservação ou da validade (se houver), use: "Conserve em local seco, ventilado e protegido da luz solar." Mantenha o resto como está.
- As demais perguntas continuam, na mesma ordem.

### Preparo e conservação
Onde o site mostrar a conservação (`textos.conservacao` no config e qualquer outro lugar), o texto passa a ser: "Local seco, ventilado e protegido da luz solar."

### Meta tags (sincronizadas com o config, como já está)
- Descrição (`description`, `og:description`, `twitter:description`): "Cheiro das Águas: cappuccino artesanal e gourmet, com café Conilon e cacau 100%, para padarias da Grande Vitória."
- O título e as imagens não mudam. Sem preço, sem "premium".

## O que fazer

1. `js/config.js`: acrescentar e atualizar os textos acima (subtítulo do hero, botão, seção `diferenca`, `ingredientes` e `avisos` por produto, cartão novo de "Por que vender", passo 2 de "Como funciona", FAQ, conservação, descrição das meta tags e o item novo do menu). Nenhum texto de apresentação escrito à mão no HTML ou no JS.
2. `index.html` e `js/main.js`: criar a seção `#diferenca` (montada a partir do config, com contêiner no HTML), na posição indicada; menu com 7 itens, no PC e no celular; `scroll-margin-top` na nova seção; linhas de ingredientes e avisos nos cards (ocultas se vazias); meta tags com o texto novo, dentro do bloco `SINCRONIZAR`.
3. `css/style.css`: estilo da nova seção e das linhas de ingredientes usando a identidade visual existente. A grade dos cartões (4 na seção nova, 5 em "Por que vender") deve ficar equilibrada a 360, 768 e 1280 px, sem cartão sozinho de forma estranha. O rodapé continua com o espaço para o botão flutuante.
4. `testes/estrutura.test.mjs`: atualizar para a nova ordem das seções, os 7 itens do menu, os 7 itens do FAQ, as meta tags iguais ao config e a regra "ingredientes vazios não geram linha". Atualizar qualquer teste que cite "Pedir degustação".
5. `README.md`: acrescentar uma linha dizendo onde estão os textos de diferenciais e como preencher `ingredientes` e `avisos` do sem açúcar quando a família informar.
6. Não mexer em mais nada (preços, calculadora, imagens, preparo, contato e publicação ficam como estão).

## Critérios

| ID | Critério | Como verificar |
|---|---|---|
| Q-01 | O subtítulo do hero é exatamente o texto acima; o botão principal diz "Pedir degustação gratuita" e continua levando ao WhatsApp com a mensagem de degustação. | Leitura da página, `href` e config. |
| Q-02 | `#diferenca` existe entre o hero e `#produtos`, com título, 4 cartões e frase de destaque, com os textos exatos acima. | Leitura da página e do HTML. |
| Q-03 | O menu tem 7 itens na ordem indicada; no PC e no celular cada item rola até a seção certa sem esconder o título sob o cabeçalho. | Visual a 360 e 1280 px. |
| Q-04 | "Por que vender" tem 5 cartões, com o novo em primeiro lugar. | Visual. |
| Q-05 | O FAQ tem 7 itens, com a pergunta nova em primeiro lugar e as respostas exatas (incluindo a da degustação gratuita). | Visual e leitura. |
| Q-06 | Nenhuma destas palavras aparece no texto visível, no config nem nas meta tags: premium, melhor, saudável, conservante, aditivo, natural, orgânico, solúvel. "Achocolatado" só aparece na frase "Cacau 100%, não achocolatado." | `rg -n -i "premium\|melhor\|saudável\|conservante\|aditivo\|natural\|orgânico\|solúvel\|achocolatado"`. Só podem sobrar `prototipo.md`, `p7-qualidade.md`, `brief.md` e a frase permitida. |
| Q-07 | Os textos novos vêm só do `js/config.js`; as meta tags do `<head>` batem com o config. | Busca dos textos no HTML e JS; teste automático. |
| Q-08 | A 360, 768 e 1280 px: sem rolagem horizontal, sem `overflow-x: hidden` em `html`/`body`, 0 erros e 0 avisos no console. | DevTools. |
| Q-09 | Navegação por teclado alcança o menu (7 itens), a nova seção e o FAQ com foco visível. | Teste com Tab. |
| Q-10 | `node --test testes/` passa, incluindo os testes atualizados. | Rodar o comando. |
| Q-11 | Preços, calculadora, imagens e botões do WhatsApp continuam funcionando como antes. | `git diff --stat` e teste manual. |
| Q-12 | O card do **com açúcar** mostra os ingredientes e os avisos exatos; o card do **sem açúcar** não mostra linha de ingredientes nem de avisos. Preencher o campo no config faz a linha aparecer. | Visual; teste temporário no config, desfeito depois. |
| Q-13 | O passo 2 de "Como funciona" e a conservação estão com os textos exatos acima. | Leitura. |

## Verificação humana (Daniel e a família)

- Ler a página inteira no celular e perguntar à família se tudo é verdade e se é o que querem dizer.
- A família precisa informar: os ingredientes do **sem açúcar**, a **ordem correta** dos ingredientes (pelo rótulo, do que tem mais para o que tem menos) e se "Não contém glúten" continua valendo com a receita atual.
- A família precisa **atualizar o rótulo da embalagem** (ele ainda cita achocolatado e café solúvel) antes de vender para as padarias. Consultar o contador ou o responsável técnico sobre o rótulo e o registro do produto.

## Commit

Um commit só, com a mensagem `P7: destacar qualidade e diferenciais`. Sem push. Termine com o relatório final do `AGENTS.md`, citando Q-01 a Q-13.
