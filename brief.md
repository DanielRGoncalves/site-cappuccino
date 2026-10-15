# Brief — site do cappuccino da família

> Fonte da verdade para **fatos de negócio e textos**. Fatos informados em 15/10/2026.
> Se algo aqui contradizer o código, o brief vence. Se faltar informação, **não invente**: deixe o campo vazio em `js/config.js`, esconda a seção e liste como pendência.

## 1. Objetivo

1. Quem provou na feira vira **cliente recorrente**: acha o produto, faz o pedido pelo WhatsApp e retira na feira.
2. Novos clientes descobrem **onde e quando a barraca vai estar**.

Medida de sucesso (fora do código): pedidos que chegam pelo WhatsApp citando o site e clientes que voltam a cada ~15 dias.

## 2. Público

- **Principal:** quem provou na degustação de uma feira livre de Vila Velha (ES) e quer comprar de novo. Abre o site **no celular**, muitas vezes pelo link do Instagram ou do WhatsApp, às vezes com internet fraca.
- **Secundário:** quem ouviu falar e quer saber onde encontrar a barraca.
- Não é público técnico. Precisa de poucos toques até o WhatsApp e letras legíveis.

## 3. Jornada principal (celular)

1. Abre o link → vê o produto e o botão de WhatsApp sem rolar.
2. Vê os 3 produtos com preço → adiciona à sacola **ou** toca no botão de WhatsApp direto.
3. Escolhe em qual feira vai retirar → envia o pedido pelo WhatsApp.
4. Consulta a agenda das próximas feiras.

## 4. Fatos de negócio

| Item | Valor |
|---|---|
| Marca (provisória, em análise no INPI) | Cheiro das Águas |
| Venda | Presencial, em feiras livres de Vila Velha (ES), com degustação |
| Pedido | Pelo WhatsApp, **retirada na feira** |
| Entrega / frete / envio | **Não existe.** Não oferecer, nem mencionar como opção |
| Recompra típica | ~15 dias |
| WhatsApp | 5527998480547 |
| Instagram | https://instagram.com/cheirodasaguasgourmet (@cheirodasaguasgourmet) |
| Domínio | Nenhum por enquanto. Publicar no GitHub Pages: `https://danielrgoncalves.github.io/site-cappuccino/` |
| Validade | 365 dias |
| Conservação | Local seco e protegido da luz solar (texto já usado no site) |

### Produtos (pacote de 250 g, todos com cacau 100%)

| Produto | Preço |
|---|---|
| Cappuccino com açúcar | R$ 22,00 |
| Cappuccino sem açúcar | R$ 30,00 |
| Cappuccino descafeinado | R$ 30,00 |

- O **Cacau 50% sai do site**.
- Os nomes no site devem bater com os da embalagem (ver checklist humano H-03).
- As fotos dos 3 produtos ainda não existem. Usar a foto atual como provisória nos 3, com troca feita mudando só o caminho em `js/config.js`.

### Preparo

30 g (cerca de 3 colheres; **peso da colher a confirmar**) em 100 ml de água fervente, mexendo devagar. Com menos água fica mais cremoso. Um pacote rende cerca de 8 xícaras.

### Dados legais (manter no rodapé, vindos do config)

Agropecuária Cheiro das Águas Ltda. · CNPJ 57.813.645/0001-60 · CRG Santa Clara, S/N, Taparuba/MG, 36953-000. O endereço após a mudança está pendente (H-07).

## 5. Restrições

- **HTML, CSS e JS puros.** Sem framework, sem backend, sem build, sem dependências npm no site. A hospedagem é gratuita (GitHub Pages).
- **Configuração única:** nome, domínio, Instagram, WhatsApp, preços, produtos, fotos e textos variáveis ficam em `js/config.js`.
  - **Única exceção técnica:** as meta tags do `<head>` (título, descrição, Open Graph). O WhatsApp monta a prévia do link **sem rodar JavaScript**, então essas tags precisam estar escritas no HTML. Ficam marcadas com o comentário `SINCRONIZAR COM js/config.js`.
- **Agenda** em `agenda.json`, editável à mão (até pelo site do GitHub). Datas passadas somem sozinhas.
- Sem QR code impresso e sem domínio próprio.
- Sem analytics, rastreadores, pop-ups ou cookies.
- Depoimentos só quando existirem (seção oculta até lá).
- A história dos pais só entra com texto real deles (seção oculta até lá).

## 6. Tom e identidade

- **Tom:** de família, acolhedor e direto, como uma conversa na barraca. Frases curtas e "você".
- **Não pode:**
  - promessas que não dá para provar ("o melhor", "premium" como argumento);
  - alegações de saúde ("saudável", "emagrece", "diet");
  - ingredientes ou processos não informados acima;
  - histórias inventadas;
  - texto copiado de embalagem ou site de outra marca.
- **Identidade visual:** manter a atual (fundo escuro, dourado, serifada nos títulos). Este trabalho **não é um redesign**.

## 7. Seções do site (ordem)

1. Cabeçalho: logo, menu (Produtos, Agenda, Preparo, Dúvidas, Contato), sacola.
2. Hero: chamada e dois botões, "Ver onde estaremos" (#agenda) e "Pedir pelo WhatsApp".
3. Produtos (#produtos): 3 cards.
4. Agenda (#agenda): próximas feiras, ou aviso de agenda vazia.
5. Preparo (#preparo).
6. História (#historia): oculta enquanto não houver texto.
7. Depoimentos: ocultos enquanto não houver.
8. Dúvidas frequentes (#faq).
9. Rodapé (#contato): Instagram, WhatsApp e dados legais.
10. Botão flutuante de WhatsApp, fora da sacola.

## 8. Textos aprovados

> O executor usa estes textos como estão. Onde aparece `{marca}`, o texto vem do config.

**Hero:** manter o título atual. Subtítulo: "Provou na feira e gostou? Peça pelo WhatsApp e retire na próxima feira."

**Preparo:**
1. **30 g na xícara.** Cerca de 3 colheres. *(Texto "3 colheres" editável no config até confirmar a medida.)*
2. **100 ml de água fervente.** Despeje sobre o pó.
3. **Mexa devagar.** Até dissolver por completo.
- Dica: "Quer mais cremoso? Use um pouco menos de água."
- Rendimento: "Um pacote de 250 g rende cerca de 8 xícaras."

**Agenda vazia:** "Estamos fechando a agenda das próximas feiras. Chame no WhatsApp para saber onde vamos estar."

**FAQ:**
1. *Onde eu compro?* Nas feiras livres de Vila Velha. Veja a agenda acima. Você também pode pedir pelo WhatsApp e retirar na feira.
2. *Vocês entregam ou enviam pelo correio?* Não. Por enquanto, a retirada é sempre na feira.
3. *Como faço o pedido?* Monte sua sacola aqui no site ou chame no WhatsApp. A gente confirma o pedido e você retira na feira que escolher.
4. *Quanto rende um pacote?* Cerca de 8 xícaras, usando 30 g por xícara.
5. *Qual a diferença entre os três?* Os três levam cacau 100%. O com açúcar já vem adoçado; o sem açúcar é para adoçar como preferir; o descafeinado é para quem quer evitar cafeína, inclusive à noite.
6. *Qual a validade?* 365 dias. Confira a data impressa na embalagem.
7. *Como conservar?* Em local seco e protegido da luz solar.

**Mensagem padrão do botão de WhatsApp:** "Olá! Vi o site e quero fazer um pedido de cappuccino."

## 9. Fora do escopo agora

Pagamento online, frete, login, cadastro de clientes, lembrete de recompra, blog, domínio próprio, QR code, troca de identidade visual.

## 10. Pendências de conteúdo (não bloqueiam o código)

- Peso real da colher (texto do preparo).
- Fotos dos 3 produtos.
- Feiras reais (datas, horários, endereços) para `agenda.json`.
- Texto da história dos pais.
- Formas de pagamento aceitas (hoje: PIX e dinheiro; cartão?).
- Endereço legal após a mudança.
- O descafeinado leva açúcar ou não? (afeta só a descrição do produto)
