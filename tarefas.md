# Tarefas (em ordem)

**Prompt padrão para o executor** (chat novo a cada tarefa):

> Leia AGENTS.md. Execute somente a tarefa **Tn** de tarefas.md e termine com o relatório final do AGENTS.md.

**Para correções:** se algum critério falhar, continue **no mesmo chat** da tarefa: "O critério C-xx falhou: <o que aconteceu>. Corrija só isso."

Cada tarefa vale ✅ quando os seus critérios **e** os das tarefas anteriores continuam passando.

---

## T1 — Separar CSS e JS do index.html (sem mudança visual)
- Mover o CSS embutido para `css/style.css` e o JS para `js/main.js` (`type="module"`).
- `git rm js/script.js`.
- **Não** mudar nenhum comportamento ou estilo, nem mesmo os bugs conhecidos (eles ficam para as próximas tarefas).
- **Pronto quando:** C-01, C-02, C-07, mais capturas a 360 e 1280 px idênticas às de antes da tarefa.

## T2 — Config único e produtos vindos do config
- Criar `js/config.js` com: marca, URL do site (GitHub Pages), WhatsApp, Instagram, dados legais, formas de pagamento (`["PIX", "Dinheiro"]`) e os 3 produtos (id, nome, descrição curta, peso, preço em centavos, foto, alt da foto). Campos `historia`, `depoimentos` e textos de preparo também ficam no config, vazios ou com o texto do brief.
- Gerar os cards de produto a partir do config. A sacola usa os preços do config. Remover o Cacau 50%.
- Grade com 3 colunas no desktop.
- Rodapé: Instagram correto, sem o link do domínio `cheirodasaguasagro`, dados legais vindos do config. O `alt` do logo também vem do config.
- Criar `js/pedido.js` (formatar R$, montar o link do WhatsApp), mais os testes dele.
- **Pronto quando:** C-03 (exceto o `<head>`, que é da T9), C-04, C-05, C-06, C-10, C-14, C-24 e C-45 (só a grade).

## T3 — Agenda de feiras
- `agenda.json` com `"feiras": []`. `js/agenda.js` com funções puras (validar o item, expandir as semanais, filtrar a partir de `hoje`, ordenar, limitar a 6, formatar "sáb, 07/11").
- Seção `#agenda` no site, com estado vazio. Suporte a `?hoje=AAAA-MM-DD`.
- Testes em `testes/agenda.test.mjs` cobrindo C-31 a C-35.
- Seção curta no `README.md` de como adicionar uma feira (com o exemplo do AGENTS.md).
- **Pronto quando:** C-06, C-30 a C-37.

## T4 — Checkout com retirada na feira
- Remover entrega e endereço. Campos: nome, feira de retirada (próximas feiras da agenda + "Combinar pelo WhatsApp") e pagamento (lista do config).
- A mensagem é montada em `js/pedido.js`, com testes.
- **Pronto quando:** C-12 (parte do checkout), C-22, C-23, C-24, C-06.

## T5 — Menu do celular
- Abaixo de 920 px, o botão de menu abre a navegação. Itens: Produtos, Agenda, Preparo, Dúvidas, Contato. Os links da navegação também ganham Agenda e Dúvidas no desktop.
- Usar `scroll-margin-top` nas seções.
- **Pronto quando:** C-41, C-42, e C-40 com o menu aberto.

## T6 — Botão flutuante de WhatsApp
- Link fixo no canto inferior, com a mensagem padrão do brief vinda do config. Ele se esconde com a sacola ou o checkout abertos.
- Botão "Pedir pelo WhatsApp" no hero, usando o mesmo link.
- **Pronto quando:** C-20, C-21.

## T7 — Conteúdo: hero, preparo, FAQ, história e depoimentos
- Aplicar os textos da seção 8 do brief. A história e os depoimentos usam o padrão "oculta se vazia".
- FAQ com `<details>`/`<summary>` (acessível e sem JS).
- **Pronto quando:** C-11, C-12, C-13, C-15, C-16.

## T8 — Imagens leves
- A partir de `cappuccino-tradicional.png` (2048 px, 1,9 MB), gerar `img/produtos/provisoria-800.webp` (≤ 120 KB) e `-400.webp` com `srcset`. Os 3 produtos apontam para ela no config.
- Logo do cabeçalho em WebP (≤ 40 KB). Mover os originais para `img/originais/`, fora de qualquer `<img>`.
- Gerar `img/og.jpg` (1200×630, ≤ 300 KB) com a foto e o logo, **sem texto de preço**.
- Atualizar o `README.md`: como trocar a foto de um produto (≤ 5 passos, incluindo como converter para WebP com o Squoosh).
- **Pronto quando:** C-05, C-51, C-52, C-53.

## T9 — Meta tags e compartilhamento
- Bloco `SINCRONIZAR` no `<head>` com tudo o que pede o C-54. URLs absolutas com a URL do GitHub Pages que está no config.
- Favicon (32 px) e `apple-touch-icon` (180 px) a partir do logo.
- **Pronto quando:** C-54 e C-03 completo.

## T10 — Revisão de layout a 360 px e acessibilidade
- Remover `overflow-x: hidden` de `html`/`body` e corrigir o que transbordar.
- Conferir 360, 768 e 1280 px com a sacola, o checkout e o menu abertos e fechados.
- **Pronto quando:** C-40, C-43, C-44, C-45, C-07.

## T11 — Publicar e passar no Lighthouse
- **Daniel (manual):** GitHub → Settings → Pages → Deploy from branch → `main` / root. O repositório precisa ser **público** no plano gratuito.
- **Executor:** rodar o Lighthouse na URL publicada e corrigir o que impedir 90+. Listar todos os links e o status de cada um.
- **Pronto quando:** C-50, C-55, C-56.

## T12 — Revisão final
- **Claude:** auditar o repositório contra **todos** os critérios C-xx.
- **Daniel + pais:** checklist H-01 a H-16.
- Só divulgar o link depois que tudo estiver ✅.
