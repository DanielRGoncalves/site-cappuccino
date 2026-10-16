# Tarefas (em ordem)

**Prompt padrão para o executor** (chat novo a cada tarefa):

> Leia AGENTS.md. Execute somente a tarefa **Tn** de tarefas.md e termine com o relatório final do AGENTS.md.

**Para correções:** se algum critério falhar, continue **no mesmo chat** da tarefa: "O critério C-xx falhou: <o que aconteceu>. Corrija só isso."

Cada tarefa vale ✅ quando os seus critérios **e** os das tarefas anteriores continuam passando.

> **Foco desde 16/10/2026:** venda direta a padarias da Grande Vitória, com pedido pelo WhatsApp. A agenda de feiras e a retirada na feira saíram. Pagamento online é a Fase 2 e não faz parte destas tarefas.

---

## T1 — Separar CSS e JS do index.html ✅
Feita e aprovada.

## T2 — Config único e produtos vindos do config ✅
Feita, aprovada e publicada no repositório. O preparo já está no config com o texto do brief.

## T3 — Calculadora "Quanto rende na sua padaria"
- Em `js/config.js`, adicionar `porcaoGramas: 30` (se ainda não existir).
- Criar `js/calculadora.js` com **funções puras, sem DOM**: xícaras por pacote (250 ÷ porção, arredondado para baixo), custo do pó por xícara (em centavos, a partir do preço do pacote), ganho por xícara, margem em %, ganho por pacote. Preço de venda inválido (vazio, zero, negativo, texto) devolve "sem resultado", nunca `NaN`.
- Seção `#padarias` entre os produtos e o preparo, com o texto da seção 8 do brief: campo de preço de venda da xícara, escolha do produto (3 opções, vindas do config), resultado e aviso. O resultado aparece ao digitar. Valores em R$ no formato brasileiro (aceitar vírgula ou ponto).
- Testes em `testes/calculadora.test.mjs`, incluindo os valores de referência da seção 4 do brief (R$ 2,64 e R$ 3,60 por xícara com os preços da época; a T5.1 atualiza para R$ 3,60 e R$ 4,20) e entradas inválidas.
- Não mexer em menu, hero, checkout nem FAQ.
- **Pronto quando:** C-06, C-60 a C-64.

## T3.1 — Preparo gerado a partir do config
- Motivo: o `config.js` já tem o preparo novo, mas o `index.html` ainda mostra o texto antigo escrito à mão (35 g, 150 ml, "sem ferver").
- Gerar a seção `#preparo` a partir de `config.textos.preparo`: os 3 passos (número, título e descrição), a dica e o rendimento. Remover os 3 cards e os textos antigos escritos no HTML.
- O subtítulo da seção e qualquer outro texto do preparo que não esteja no brief também vêm do config. O subtítulo atual ("Três passos simples para manter a experiência cremosa...") só fica se for movido para o config; textos que citem "interior" ou "pausa" saem.
- Teste automático simples: a função que monta o preparo devolve 3 passos, a dica e o rendimento do config. Mudar um texto no config muda a página.
- Não mexer em mais nada.
- **Pronto quando:** C-03, C-04, C-06, C-07, C-11.

## T4 — Pedido pelo WhatsApp e "Pedir amostra"
- Remover entrega, endereço e qualquer menção à retirada na feira do checkout. Campos: nome (obrigatório), padaria (obrigatório), cidade ou bairro (obrigatório), forma de pagamento (lista do config + "Combinar pelo WhatsApp").
- `js/pedido.js`: criar `montarPedido(sacola, cliente)`, que devolve um **objeto de pedido** (itens, quantidades, subtotais, total, cliente), e `linkWhatsApp(pedido)`, que o consome. A mensagem termina com "Valores de referência, a confirmar." e "Entrega ou retirada: a combinar." Testes dos dois.
- Botão "Pedir amostra" com a mensagem própria do brief (seção 8), vinda do config.
- **Pronto quando:** C-06, C-07, C-12, C-22 a C-26.

## T5 — Menu do celular
- Abaixo de 920 px, o botão de menu abre a navegação. Itens: Produtos, Para padarias, Preparo, Contato. No desktop, os mesmos itens. **"Dúvidas" não entra agora**, porque o `#faq` só existe na T7; a T7 adiciona o item.
- Usar `scroll-margin-top` nas seções.
- **Pronto quando:** C-41, C-42, e C-40 com o menu aberto.

## T5.1 — Atualizar os preços
- Em `js/config.js`: com açúcar `3000` centavos; sem açúcar `3500`; descafeinado `3500`.
- Atualizar os testes que usam os preços antigos: os valores de referência da calculadora passam a ser **R$ 3,60** (360 centavos, com açúcar) e **R$ 4,20** (420 centavos, sem açúcar e descafeinado), com 8 xícaras por pacote. Atualizar também qualquer teste do pedido que use os preços (subtotais e total).
- Procurar `2200`, `22,00`, `2,64` e `264` no projeto (HTML, JS, testes, README) e atualizar o que for número de preço. Texto de preço fora do config não deve existir.
- Não mexer em mais nada.
- **Pronto quando:** C-03, C-04, C-06, C-07, C-10, C-60.

## T6 — Botão flutuante de WhatsApp e botões do hero
- Link fixo no canto inferior, com a mensagem padrão do brief vinda do config. Ele se esconde com a sacola ou o checkout abertos.
- Hero: botão "Pedir amostra" (principal) e botão "Fazer pedido" (rola até `#produtos`, estilo secundário). Hoje há dois botões principais lado a lado: só um pode ser principal.
- Acessibilidade do "Pedir amostra": hoje é um `<a>` sem `href` no HTML (o `href` só existe depois que o JS roda). Deixar um `href` válido já no HTML (ex.: `#contato`), que o JS troca pelo link do WhatsApp, para o botão receber foco por teclado.
- **Pronto quando:** C-20, C-21, C-26, C-07.

## T7 — Conteúdo: hero, FAQ, história e depoimentos
- Aplicar os textos da seção 8 do brief (subtítulo do hero, FAQ). O preparo já foi feito na T3.1; aqui só conferir que continua igual ao do brief.
- A história e os depoimentos usam o padrão "oculta se vazia".
- FAQ com `<details>`/`<summary>` (acessível e sem JS), na seção `#faq`.
- Adicionar o item **"Dúvidas"** (rola até `#faq`) ao menu do cabeçalho e ao menu do celular, que a T5 deixou sem ele.
- Remover do HTML qualquer texto antigo de feira, agenda ou retirada.
- **Pronto quando:** C-11, C-12, C-13, C-15, C-16, C-41, C-42.

## T8 — Imagens leves
- A partir de `cappuccino-tradicional.png` (2048 px, 1,9 MB), gerar `img/produtos/provisoria-800.webp` (≤ 120 KB) e `-400.webp` com `srcset`. Os 3 produtos apontam para ela no config.
- Logo do cabeçalho em WebP (≤ 40 KB). Mover os originais para `img/originais/`, fora de qualquer `<img>`.
- Gerar `img/og.jpg` (1200×630, ≤ 300 KB) com a foto e o logo, **sem texto de preço**.
- Atualizar o `README.md`: como trocar a foto de um produto (≤ 5 passos, incluindo como converter para WebP com o Squoosh).
- **Pronto quando:** C-05, C-51, C-52, C-53.

## T9 — Meta tags e compartilhamento
- Bloco `SINCRONIZAR` no `<head>` com tudo o que pede o C-54. URLs absolutas com a URL do GitHub Pages que está no config. A descrição fala de cappuccino para padarias, sem preço.
- Favicon (32 px) e `apple-touch-icon` (180 px) a partir do logo.
- **Pronto quando:** C-54 e C-03 completo.

## T10 — Revisão de layout a 360 px e acessibilidade
- Remover `overflow-x: hidden` de `html`/`body` e corrigir o que transbordar.
- Conferir 360, 768 e 1280 px com a sacola, o checkout, a calculadora e o menu abertos e fechados.
- **Pronto quando:** C-40, C-43, C-44, C-45, C-07.

## T11 — Publicar e passar no Lighthouse
- **Daniel (manual):** GitHub → Settings → Pages → Deploy from branch → `main` / root. O repositório precisa ser **público** no plano gratuito.
- **Executor:** rodar o Lighthouse na URL publicada e corrigir o que impedir 90+. Listar todos os links e o status de cada um.
- **Pronto quando:** C-50, C-55, C-56.

## T12 — Revisão final
- **Claude:** auditar o repositório contra **todos** os critérios C-xx ativos.
- **Daniel + pais:** checklist H-01 a H-20 (menos os itens suspensos).
- Só divulgar o link depois que tudo estiver ✅.

---

## Adiadas

- **Agenda de feiras** (antiga T3, critérios C-30 a C-37): suspensa. Pode voltar se as feiras voltarem a ser um canal.
## Fase 2 — Pagamento com cartão no site (plano; nada disto é para o executor ainda)

**Condições antes de escrever código** (todas dependem da família, não do site):
1. Decidir como a padaria recebe e quanto custa: entrega, frete, pedido mínimo, prazo. Sem isso não há preço final para cobrar no cartão.
2. Abrir conta PJ em um provedor de pagamento com o CNPJ da empresa.
3. Definir nota fiscal, termos de venda e política de privacidade (LGPD) para publicar no site.
4. Confirmar com o contador a tributação das vendas online.

**Caminho em dois degraus:**
- **Degrau A (sem backend):** link de pagamento do provedor. O pedido continua indo ao WhatsApp, e a conversa termina com o link do provedor para a padaria pagar com cartão, Pix ou boleto. Custo de construção: quase zero; a taxa só incide sobre cada venda.
- **Degrau B (com backend):** função serverless (por exemplo, Cloudflare Workers ou Netlify Functions, com plano gratuito para este volume) que cria a cobrança a partir do objeto de pedido e recebe o aviso de pagamento (webhook) do provedor. Os dados do cartão **nunca passam pelo nosso código**: a página de pagamento é do provedor. O site continua estático.
