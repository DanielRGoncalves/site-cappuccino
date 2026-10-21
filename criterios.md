# Critérios de pronto

Cada critério tem um **ID**, o que precisa ser verdade e **como verificar**. Uma tarefa só está pronta quando os critérios que ela cita passam, junto com os anteriores (sem regressão).

Servidor local para testar: `python -m http.server 8000` na raiz do projeto, depois abrir `http://localhost:8000`. Abrir o `index.html` direto (file://) **não vale**.

---

## Estrutura e manutenção

| ID | Critério | Como verificar |
|---|---|---|
| C-01 | Não há `<style>` nem `<script>` com código dentro do `index.html`. O CSS fica em `css/style.css` e o JS em `js/*.js` (ES modules). | Procurar `<style` no `index.html`: 0 resultados. Procurar `<script>` sem `src`: 0 resultados. |
| C-02 | O arquivo antigo `js/script.js` não existe mais e nenhum arquivo o referencia. | `git ls-files js/script.js` não mostra nada; procurar `script.js` no projeto: 0 resultados. |
| C-03 | Marca, domínio, Instagram, WhatsApp, preços, produtos e fotos ficam **só** em `js/config.js`. | Procurar `Cheiro das Águas`, `5527998480547`, `cheirodasaguas` e `30,00`/`30.0`/`35,00`/`35.0` (e os valores antigos `22,00`/`22.0`) fora de `js/config.js`. Só pode haver ocorrências dentro do bloco do `<head>` marcado `SINCRONIZAR COM js/config.js`, no `README.md`, em `testes/` e nos `.md` de documentação. |
| C-04 | Trocar um valor no config muda o site inteiro. | Teste manual: mudar o preço do "com açúcar" para 23 no config e recarregar. O card, a sacola, o total e a mensagem do WhatsApp mostram R$ 23,00. Depois desfazer. |
| C-05 | Trocar a foto de um produto é mudar um caminho no config. | O `README.md` explica isso em até 5 passos. Teste: apontar um produto para `img/logo.webp`; só aquele card muda. |
| C-06 | Os testes automáticos passam. | `node --test testes/` termina sem falhas. |
| C-07 | Não há erro no console. | No DevTools (Console), recarregar com o cache limpo, nas larguras 360 e 1280: 0 erros e 0 avisos vindos do nosso código. |

## Conteúdo e negócio

| ID | Critério | Como verificar |
|---|---|---|
| C-10 | Aparecem exatamente 3 produtos, com o nome, 250 g e o preço da tabela do brief. O Cacau 50% não aparece. | Visual, mais procurar `50%` no texto renderizado: 0 resultados (ignorar CSS). |
| C-11 | O preparo diz 30 g, 100 ml, água **fervente**, mexer devagar, a dica de menos água para ficar mais cremoso e o rendimento de cerca de 8 xícaras. Não aparecem "35 g", "150 ml" nem "sem ferver". | Leitura da seção mais busca no código-fonte. |
| C-12 | O site não cria campo de endereço completo, cálculo de frete, pedido mínimo, nota fiscal nem pagamento por cartão no site. Sobre entrega e prazo, só aparecem as frases do brief (FAQ e linha final do pedido). | Procurar `endereço`, `frete`, `mínimo`, `nota fiscal`, `retirar`, `feira` no HTML e JS. Só podem sobrar as frases aprovadas do brief e o endereço legal do rodapé. |
| C-13 | A validade de 365 dias e a conservação aparecem no FAQ. | Leitura. |
| C-14 | O rodapé mostra o Instagram `@cheirodasaguasgourmet` com link correto e não tem nenhum link para `cheirodasaguasagro`. | Procurar `cheirodasaguasagro`: 0 resultados. Clicar no link do Instagram. |
| C-15 | As seções de história e de depoimentos ficam ocultas quando os campos no config estão vazios e aparecem quando são preenchidos. | Teste com o campo vazio e preenchido (só localmente, sem commitar texto falso). |
| C-16 | Os textos seguem o brief (seção 8) sem inventar fatos. | Comparar com o brief. |

## WhatsApp e pedido

| ID | Critério | Como verificar |
|---|---|---|
| C-20 | Existe um botão flutuante de WhatsApp em todas as rolagens, fora da sacola. Ele abre `https://wa.me/5527998480547?text=` com a mensagem padrão do brief (padaria), codificada. | Inspecionar o `href`; num celular real, tocar: abre a conversa com o número certo e o texto preenchido. |
| C-21 | O botão flutuante tem área de toque ≥ 48×48 px e `aria-label`, e não cobre o botão "Finalizar pedido" nem os controles da sacola (fica oculto com a sacola ou o checkout abertos). | DevTools a 360 px, abrir a sacola. |
| C-22 | O checkout pede: nome (obrigatório), padaria (obrigatório), cidade ou bairro (obrigatório) e forma de pagamento (lista do config: PIX, Cartão na entrega (maquininha), Dinheiro + "Combinar pelo WhatsApp"). Não tem campo de endereço completo. | Visual e validação: enviar vazio mostra os erros. |
| C-23 | A mensagem do pedido contém: os itens com quantidade e subtotal, o total, o nome, a padaria, a cidade ou bairro, o pagamento e as linhas finais "Valores de referência, a confirmar." e "Entrega sem taxa na Grande Vitória, horário a combinar." Os valores batem com a sacola. | Teste automático da função que monta a mensagem, mais um teste manual com 2 produtos diferentes. |
| C-24 | O link do pedido é montado só com `encodeURIComponent`. Um nome com acento, `&` e emoji chega certo. | Teste automático com o nome `João & Zé ☕`. |
| C-25 | O pedido é um **objeto de dados** (itens, quantidades, subtotais, total, cliente) criado por `montarPedido`, separado do envio. O link do WhatsApp é gerado a partir desse objeto. | Ler `js/pedido.js`; teste automático que valida o objeto sem passar pelo link. |
| C-26 | O botão "Pedir degustação" abre o WhatsApp com a mensagem própria de degustação do brief, vinda do config, codificada. | Inspecionar o `href`; teste em celular real. |

## Calculadora para padarias

| ID | Critério | Como verificar |
|---|---|---|
| C-60 | As contas ficam em `js/calculadora.js`, funções puras sem DOM. Xícaras por pacote = 250 ÷ porção, arredondado para baixo. Custo do pó por xícara = preço do pacote × porção ÷ 250. | Teste automático: com os preços do brief, o custo é R$ 3,60 (com açúcar) e R$ 4,20 (sem açúcar e descafeinado) e o rendimento é 8. |
| C-61 | Ganho por xícara = preço de venda − custo do pó. Margem = ganho ÷ preço de venda, em %. Ganho por pacote = ganho por xícara × xícaras por pacote. | Teste automático com pelo menos 3 preços de venda, incluindo um menor que o custo (ganho negativo é mostrado, não escondido). |
| C-62 | Preço de venda vazio, zero, negativo ou texto não gera `NaN` nem erro: mostra o estado "sem resultado" (nenhum valor na tela). Aceita vírgula e ponto. | Teste automático e teste manual digitando `abc`, `0`, `-5`, `9,5` e `9.5`. |
| C-63 | A porção (30 g), os preços e os nomes vêm do config. Trocar o preço ou a porção no config muda a calculadora. | Teste manual como em C-04. |
| C-64 | O aviso do brief aparece junto do resultado e o texto não promete lucro ou economia. | Leitura. |

## Agenda (SUSPENSA: foco em padarias; ignorar C-30 a C-37)

| ID | Critério | Como verificar |
|---|---|---|
| C-30 | A agenda vem de `agenda.json`, no formato definido em `AGENTS.md`. | Ler o código. |
| C-31 | Datas passadas não aparecem. A feira de **hoje** aparece. A lista é ordenada da mais próxima para a mais distante, com no máximo 6 itens. | Testes automáticos com um `hoje` fixo. Manual: `?hoje=AAAA-MM-DD` na URL simula o dia. |
| C-32 | Uma feira semanal gera as próximas ocorrências, respeitando `desde`, `ate` e `excecoes`. | Testes automáticos. |
| C-33 | Fuso: no dia 2026-11-07 às 08:00 e às 23:30 (horário de Brasília), uma feira com data 2026-11-07 aparece. Nunca usar `new Date("AAAA-MM-DD")`. | Teste automático, mais busca por `new Date("` com data ISO pura: 0 resultados. |
| C-34 | Com a lista vazia, se `agenda.json` falhar ao carregar ou se todas as datas já passaram, aparece o texto "agenda vazia" do brief com o botão de WhatsApp. Nada de erro na tela. | Testar os 3 casos (renomear o arquivo temporariamente para simular a falha). |
| C-35 | Um item inválido (data mal escrita, campo faltando) é ignorado com `console.warn`, e os outros itens continuam aparecendo. | Teste automático. |
| C-36 | O conteúdo do `agenda.json` é inserido com `textContent`, nunca com `innerHTML`. | Ler o código. |
| C-37 | Cada feira mostra o dia da semana e a data (ex.: "sáb, 07/11"), o horário, o nome, o bairro e o link "Ver no mapa" (só se houver). | Visual. |

## Celular, layout e acessibilidade

| ID | Critério | Como verificar |
|---|---|---|
| C-40 | Sem rolagem horizontal a 360 px, sem esconder o problema: `html` e `body` **não** têm `overflow-x: hidden`. | DevTools 360×740: no console, `document.documentElement.scrollWidth <= 360` retorna `true`. Repetir com a sacola e o checkout abertos e com o menu aberto. |
| C-41 | O menu do celular funciona abaixo de 920 px: o botão abre e fecha, `aria-expanded` alterna, `Esc` fecha, tocar num link fecha e rola até a seção, e o foco fica visível. | Teste manual com toque e com teclado (Tab/Enter/Esc). |
| C-42 | O cabeçalho fixo não cobre o título da seção ao navegar pelo menu. | Clicar em cada item do menu (`scroll-margin-top`). |
| C-43 | Todo texto ≥ 14 px no celular e alvos de toque ≥ 44 px. | DevTools, mais Lighthouse (Acessibilidade). |
| C-44 | Todas as imagens têm `alt` útil, ou `alt=""` se forem decorativas. | Lighthouse e leitura. |
| C-45 | Layout correto em 360, 768 e 1280 px; a grade de produtos usa 3 colunas no desktop (sem buraco de 4ª coluna). | Capturas nas 3 larguras. |

## Desempenho, imagens e compartilhamento

| ID | Critério | Como verificar |
|---|---|---|
| C-50 | Lighthouse **no celular**, na URL publicada do GitHub Pages, em janela anônima: Desempenho, Acessibilidade, Boas práticas e SEO **≥ 90**. Vale a mediana de 3 execuções. | DevTools, aba Lighthouse, modo Mobile. Guardar as notas no relatório. |
| C-51 | Fotos de produto em WebP, no máximo 800 px de largura e **≤ 120 KB** cada. O logo do cabeçalho ≤ 40 KB. Nenhum arquivo de imagem servido > 200 KB, exceto a imagem de compartilhamento. | `Get-ChildItem img -Recurse` (tamanhos) ou aba Network. |
| C-52 | Peso total transferido no primeiro carregamento ≤ 600 KB. | DevTools Network, cache desativado, 360 px: rodapé "transferred". |
| C-53 | Toda `<img>` tem `width` e `height`; as imagens fora da primeira tela usam `loading="lazy"`. | Ler o HTML gerado (inspecionar). |
| C-54 | O `<head>` tem `title`, `description`, `og:title`, `og:description`, `og:image` (URL **absoluta**, 1200×630, JPG ≤ 300 KB), `og:url`, `og:type`, `og:locale=pt_BR`, `twitter:card=summary_large_image`, `theme-color`, favicon e `apple-touch-icon`. | Ler o `<head>`; colar a URL publicada em https://www.opengraph.xyz. |
| C-55 | Ao colar o link publicado numa conversa de WhatsApp, a prévia mostra a imagem, o título e a descrição. | Teste real (o WhatsApp guarda cache; testar com `?v=1` no fim, se precisar). |
| C-56 | Nenhum link quebrado: toda âncora `#id` existe e todo link externo responde. | O executor lista todos os `href` e o resultado de cada um no relatório; a pessoa clica nos externos. |

---

# Checklist de revisão humana

Feito por Daniel, com os pais nos itens marcados (👪), **antes de divulgar o link**. Cada item é sim ou não.

- [ ] **H-01** 👪 Os preços estão certos: com açúcar R$ 30,00; sem açúcar R$ 35,00; descafeinado R$ 35,00.
- [ ] **H-02** 👪 O preparo está certo, inclusive a quantidade de colheres para 30 g (pesar a colher).
- [ ] **H-03** 👪 Os nomes dos produtos são iguais aos da embalagem (ex.: "sem açúcar" × "sem adição de açúcar").
- [ ] **H-04** 👪 As formas de pagamento listadas (Pix, cartão na maquininha na entrega, dinheiro) são as aceitas de verdade.
- [ ] **H-05** *(suspenso: agenda de feiras fora do site)*
- [ ] **H-06** 👪 Nenhum texto promete algo que eles não fazem (entrega, sabor "o melhor", benefícios de saúde).
- [ ] **H-07** 👪 Os dados legais no rodapé (razão social, CNPJ, endereço) estão atualizados.
- [ ] **H-08** 👪 Os textos do hero e da seção "da casa" são verdadeiros para eles (ex.: "nascentes", "roça").
- [ ] **H-09** Pedido de teste do **celular real**: monte uma sacola com 2 produtos, envie e confira se a mensagem chega certa no WhatsApp do número 5527998480547.
- [ ] **H-10** O botão flutuante abre o WhatsApp num Android **e**, se possível, num iPhone.
- [ ] **H-11** A prévia do link no WhatsApp aparece com imagem e título (C-55).
- [ ] **H-12** O link do Instagram abre o perfil certo.
- [ ] **H-13** Leitura completa no celular, em voz alta: não tem erro de português nem frase estranha.
- [ ] **H-14** Teste com internet fraca (DevTools → Network → "Slow 4G"): o produto e o botão de WhatsApp aparecem em até ~3 s.
- [ ] **H-15** Um dono de padaria, que nunca viu o site, consegue dizer em 30 s o que é o produto, quanto rende e como pedir uma degustação.
- [ ] **H-16** Você sabe sozinho, seguindo o `README.md`: mudar um preço e trocar uma foto.
- [ ] **H-17** 👪 A degustação funciona como o site diz: eles fazem antes da primeira venda e sabem combinar com a padaria.
- [ ] **H-18** 👪 Os preços de tabela do site valem para padarias, ou há preço próprio (então trocar no config).
- [ ] **H-19** 👪 "Entregamos na Grande Vitória, sem taxa, de um dia para o outro" é verdade e vai continuar sendo (o prazo é editável no config).
- [ ] **H-20** A calculadora: digite o preço de uma xícara que você conhece (ex.: R$ 9,00) e confira à mão o custo, o ganho e a margem.
