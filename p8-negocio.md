# P8 — Textos para "o seu negócio" (não ficar preso à padaria)

> **Esta tarefa vale em conjunto com `prototipo.md` e `p7-qualidade.md`** (branch `prototipo`). Em caso de contradição entre este arquivo e qualquer outro documento (`prototipo.md`, `p7-qualidade.md`, `brief.md`, `criterios.md`, `tarefas.md`, `AGENTS.md`), **este arquivo vence** e o executor não precisa perguntar. As demais regras do `AGENTS.md` continuam valendo (config único, sem frameworks, sem `innerHTML` com dados, acessibilidade). As regras de "Proibido" do `p7-qualidade.md` (palavras e afirmações vetadas) continuam valendo. Se algo faltar e não estiver aqui, **pare e pergunte**.

## Objetivo

O site deixa de falar só com padarias. Padaria continua sendo citada como exemplo, junto com cafeterias e restaurantes, mas o texto principal fala com **"o seu negócio"**. Só texto muda: nenhuma seção, id, link, estrutura ou estilo muda.

## O que mudar (texto atual → texto novo, tudo no `js/config.js`)

1. **`meta.titulo`**
   - Atual: "Cheiro das Águas | Cappuccino para padarias"
   - Novo: "Cheiro das Águas | Cappuccino artesanal e gourmet"
2. **`meta.descricao`**
   - Atual: "Cheiro das Águas: cappuccino artesanal e gourmet, com café Conilon e cacau 100%, para padarias da Grande Vitória."
   - Novo: "Cheiro das Águas: cappuccino artesanal e gourmet, com café Conilon e cacau 100%, para padarias, cafeterias, restaurantes e outros negócios da Grande Vitória."
3. **`textos.hero.titulo`**
   - Atual: "Cappuccino com cacau 100% para a sua padaria"
   - Novo: "Cappuccino com cacau 100% para o seu negócio"
4. **`textos.hero.subtitulo`**
   - Atual: "Artesanal e gourmet, feito à mão com café Conilon e cacau 100%. Pronto com água quente. Entregamos na Grande Vitória, sem taxa. Antes de qualquer venda, a degustação é gratuita."
   - Novo: "Para padarias, cafeterias, restaurantes e outros negócios: artesanal e gourmet, feito à mão com café Conilon e cacau 100%. Pronto com água quente. Entregamos na Grande Vitória, sem taxa. Antes de qualquer venda, a degustação é gratuita."
5. **`textos.hero.conta`**
   - Atual: "Ver a conta da padaria"
   - Novo: "Ver a conta do seu negócio"
6. **`textos.padarias.titulo`** (o nome da chave `padarias` e o id `#padarias` **não mudam**)
   - Atual: "Quanto rende na sua padaria"
   - Novo: "Quanto rende no seu negócio"
7. **`textos.whatsapp.degustacao`**
   - Atual: "Olá! Vi o site e quero pedir uma degustação do cappuccino para a minha padaria."
   - Novo: "Olá! Vi o site e quero pedir uma degustação do cappuccino para o meu negócio.\nNome do negócio: "
   (a quebra de linha vai codificada no link como `%0A`, e o final "Nome do negócio: " fica em aberto para a pessoa completar)
8. **`textos.whatsapp.geral`**
   - Atual: "Olá! Vi o site e quero conversar sobre o cappuccino para a minha padaria."
   - Novo: "Olá! Vi o site e quero conversar sobre o cappuccino para o meu negócio.\nNome do negócio: "

## Meta tags no `index.html`

Atualizar o bloco `SINCRONIZAR COM js/config.js` para ficar igual ao config: `<title>`, `description`, `og:title`, `og:description`, `twitter:title` e `twitter:description`. Nada mais no `<head>` muda.

## O que fazer

1. Fazer as 8 trocas do config e as meta tags do `index.html`.
2. Procurar por "padaria" (e variações: "padarias", "Padaria") em `index.html`, `js/`, `css/`, `testes/` e `README.md`. Em texto **visível** ao visitante, "padaria" só pode aparecer nestes lugares: o subtítulo do hero e a descrição das meta tags (como exemplo, junto com cafeterias e restaurantes). Qualquer outra ocorrência em texto visível deve ser reescrita no mesmo estilo ("seu negócio"). **Não renomear** chaves, ids, classes, nomes de arquivo nem funções (por exemplo `textos.padarias`, `#padarias`, `bakery-section`). Registre no relatório o que encontrou e o que alterou.
3. Atualizar os testes que dependam dos textos antigos (`estrutura.test.mjs`, `pedido.test.mjs`) para os textos novos, incluindo as mensagens do WhatsApp decodificadas.
4. Não mexer em mais nada (preços, calculadora, imagens, ingredientes, menu, FAQ, estilo).

## Critérios

| ID | Critério | Como verificar |
|---|---|---|
| R-01 | Hero: título, subtítulo e botão "Ver a conta do seu negócio" exatamente como acima; "Pedir degustação gratuita" não muda. | Leitura da página e do config. |
| R-02 | `<title>`, `description`, `og:*` e `twitter:*` do `index.html` batem com o `meta` do config. | Teste automático e leitura do `<head>`. |
| R-03 | Os dois links de WhatsApp (hero/contato e botão flutuante), ao decodificar o texto do `href`, mostram exatamente as mensagens novas, com quebra de linha e "Nome do negócio: " no final. | Inspecionar `href` no navegador e no teste. |
| R-04 | O título da calculadora é "Quanto rende no seu negócio"; o link "A conta" do menu continua levando a ela; nenhum id ou link mudou. | Clicar no menu a 360 e 1280 px. |
| R-05 | "Padaria" não aparece em nenhum outro texto visível além do subtítulo do hero e da descrição das meta tags. | `rg -n -i "padaria" index.html js css testes README.md` e leitura da página. |
| R-06 | A 360, 768 e 1280 px: sem rolagem horizontal, sem `overflow-x: hidden` em `html`/`body`, 0 erros e 0 avisos no console; o subtítulo do hero (mais longo) não quebra o layout do início. | DevTools. |
| R-07 | `node --test testes/` passa. | Rodar o comando. |
| R-08 | Nada mais mudou: preços, calculadora, produtos, ingredientes, menu, FAQ, imagens e estilo iguais. | `git diff --stat` mostrando só `js/config.js`, `index.html`, testes e, se for o caso, `README.md`. |

## Verificação humana (Daniel)

- Ler o início da página no celular: o título e o subtítulo continuam fáceis de ler?
- Tocar nos dois botões de WhatsApp: a mensagem aparece em duas linhas, com "Nome do negócio:" para completar?

## Commit

Um commit só, com a mensagem `P8: textos para o seu negócio`. Sem push. Termine com o relatório final do `AGENTS.md`, citando R-01 a R-08.
