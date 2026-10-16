# Brief — site do cappuccino da família (foco em padarias)

> Fonte da verdade para **fatos de negócio e textos**. Fatos informados em 15 e 16/10/2026.
> **Mudança de foco em 16/10/2026:** saem as feiras e o consumidor final; entra a venda direta a **padarias da Grande Vitória (ES)**.
> Se algo aqui contradizer o código, o brief vence. Se faltar informação, **não invente**: deixe o campo vazio em `js/config.js`, esconda a seção e liste como pendência.

## 1. Objetivo

**Fase 1 (agora):** o dono ou gerente de uma padaria da Grande Vitória entende o produto, vê quanto ele rende e **chama no WhatsApp** com um pedido ou um pedido de amostra.

**Fase 2 (depois, fora do escopo agora):** comprar direto no site, com todos os meios de pagamento, por um serviço de pagamento terceirizado. A Fase 1 já deixa o pedido montado como dados (ver seção 5) para que a Fase 2 não exija refazer o site.

Medida de sucesso (fora do código): conversas de padarias no WhatsApp citando o site, pedidos de amostra e primeiros pedidos.

## 2. Público

- **Principal:** dono, gerente ou comprador de padaria, confeitaria ou cafeteria na Grande Vitória. Recebe o link por WhatsApp ou Instagram, abre **no celular**, entre uma tarefa e outra. Quer saber: o que é, quanto custa, quanto rende, como serve e como pedir.
- **Secundário:** cliente que já conhece a marca pela feira ou pelo Instagram e quer pedir pelo WhatsApp. Usa o mesmo caminho.
- Não é público técnico. Precisa de poucos toques até o WhatsApp e letras legíveis.

## 3. Jornada principal (celular)

1. Abre o link → vê o produto, a frase de valor e os botões "Pedir amostra" e "Fazer pedido" sem rolar.
2. Vê os 3 produtos com preço → monta o pedido na sacola **ou** toca em "Pedir amostra".
3. Na seção "Quanto rende na sua padaria", digita por quanto vende a xícara e vê o custo do pó por xícara e a diferença.
4. Informa nome, padaria, cidade/bairro e forma de pagamento → envia o pedido pelo WhatsApp.

## 4. Fatos de negócio

| Item | Valor |
|---|---|
| Marca (provisória, em análise no INPI) | Cheiro das Águas |
| Venda neste site | Direta a padarias da Grande Vitória (ES). A venda no varejo e nas feiras continua existindo, mas **não é o foco do site** |
| Pedido | Pelo WhatsApp |
| Entrega, frete, prazo | **Ainda não definidos.** O site não promete entrega, frete nem prazo. Diz que a forma de receber é **combinada pelo WhatsApp** |
| Pedido mínimo | Não definido. Campo vazio no config; a informação fica oculta enquanto vazio |
| Preço | **Provisório:** a tabela abaixo (a mesma de antes). Ainda não há preço específico para padarias (pendência P-01) |
| Pagamento | PIX e dinheiro, mais "Combinar pelo WhatsApp" |
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
- Os nomes no site devem bater com os da embalagem (checklist H-03).
- As fotos dos 3 produtos ainda não existem. Usar a foto atual como provisória nos 3, com a troca feita mudando só o caminho em `js/config.js`.

### Preparo

30 g (cerca de 3 colheres; **peso da colher a confirmar**) em 100 ml de água fervente, mexendo devagar. Com menos água fica mais cremoso. Um pacote rende cerca de 8 xícaras.

### Rendimento e calculadora

- Porção: **30 g por xícara** (`porcaoGramas: 30` no config). Xícaras por pacote = 250 ÷ 30, **arredondado para baixo** (8).
- Custo do pó por xícara = preço do pacote × 30 ÷ 250. Com os preços atuais: R$ 2,64 (com açúcar) e R$ 3,60 (sem açúcar e descafeinado). O site **calcula** esse valor a partir do config; não escreve o número no texto.
- A calculadora recebe só **um dado do visitante: o preço de venda da xícara**. Mostra: custo do pó por xícara, ganho bruto por xícara, margem bruta em % e ganho por pacote de 250 g.
- Aviso obrigatório ao lado do resultado: "A conta considera só o custo do cappuccino em pó. Copo, energia, perdas e outros custos não entram."
- O site **não promete lucro**: o resultado é a conta do próprio visitante.

### Dados legais (manter no rodapé, vindos do config)

Agropecuária Cheiro das Águas Ltda. · CNPJ 57.813.645/0001-60 · CRG Santa Clara, S/N, Taparuba/MG, 36953-000. O endereço após a mudança está pendente (H-07).

## 5. Restrições

- **HTML, CSS e JS puros.** Sem framework, sem backend, sem build, sem dependências npm no site. A hospedagem é gratuita (GitHub Pages).
- **Configuração única:** nome, domínio, Instagram, WhatsApp, preços, produtos, porção, fotos e textos variáveis ficam em `js/config.js`.
  - **Única exceção técnica:** as meta tags do `<head>` (título, descrição, Open Graph). O WhatsApp monta a prévia do link **sem rodar JavaScript**, então essas tags precisam estar escritas no HTML. Ficam marcadas com o comentário `SINCRONIZAR COM js/config.js`.
- **Pedido como dados (preparo para a Fase 2):** `js/pedido.js` monta um **objeto de pedido** (itens, quantidades, subtotais, total, dados do cliente) separado de **como ele é enviado**. Hoje o único envio é o link do WhatsApp. Não construir pagamento online agora.
- Sem QR code impresso e sem domínio próprio.
- Sem analytics, rastreadores, pop-ups ou cookies.
- Depoimentos só quando existirem (seção oculta até lá).
- A história dos pais só entra com texto real deles (seção oculta até lá).

## 6. Tom e identidade

- **Tom:** de empresa familiar, simpático e profissional. Frases curtas, "você", sem gíria.
- **Não pode:**
  - promessas que não dá para provar ("o melhor", "premium" como argumento);
  - promessa de lucro ou de economia;
  - alegações de saúde ("saudável", "emagrece", "diet");
  - entrega, frete, prazo, pedido mínimo, nota fiscal ou prazo de pagamento que não estejam neste brief;
  - ingredientes ou processos não informados acima;
  - histórias inventadas;
  - texto copiado de embalagem ou site de outra marca.
- **Identidade visual:** manter a atual (fundo escuro, dourado, serifada nos títulos). Este trabalho **não é um redesign**.

## 7. Seções do site (ordem)

1. Cabeçalho: logo, menu (Produtos, Para padarias, Preparo, Dúvidas, Contato), sacola.
2. Hero: chamada e dois botões, "Pedir amostra" e "Fazer pedido" (rola até #produtos).
3. Produtos (#produtos): 3 cards.
4. Para padarias (#padarias): rendimento e calculadora.
5. Preparo (#preparo).
6. História (#historia): oculta enquanto não houver texto.
7. Depoimentos: ocultos enquanto não houver.
8. Dúvidas frequentes (#faq).
9. Rodapé (#contato): Instagram, WhatsApp e dados legais.
10. Botão flutuante de WhatsApp, fora da sacola.

A agenda de feiras **sai do site** (tarefa adiada, não apagada do histórico).

## 8. Textos aprovados

> O executor usa estes textos como estão. Onde aparece `{marca}`, o texto vem do config.

**Hero:** manter o título atual. Subtítulo: "Cappuccino com cacau 100%, pronto com água quente. Peça uma amostra ou faça seu pedido pelo WhatsApp."

**Para padarias (#padarias):**
- Título: "Quanto rende na sua padaria"
- Texto: "Cada xícara leva 30 g. Um pacote de 250 g rende cerca de 8 xícaras. Digite por quanto você vende a xícara e veja a conta."
- Aviso: "A conta considera só o custo do cappuccino em pó. Copo, energia, perdas e outros custos não entram."
- Campo: "Preço de venda da xícara (R$)". Rótulos do resultado: "Custo do pó por xícara", "Ganho por xícara", "Margem", "Ganho por pacote de 250 g".

**Preparo:**
1. **30 g na xícara.** Cerca de 3 colheres. *(Texto "3 colheres" editável no config até confirmar a medida.)*
2. **100 ml de água fervente.** Despeje sobre o pó.
3. **Mexa devagar.** Até dissolver por completo.
- Dica: "Quer mais cremoso? Use um pouco menos de água."
- Rendimento: "Um pacote de 250 g rende cerca de 8 xícaras."

**FAQ:**
1. *Como faço o pedido?* Monte seu pedido aqui no site e envie pelo WhatsApp, ou chame direto. A gente confirma os valores e combina com você como receber.
2. *Posso provar antes de comprar?* Peça uma amostra pelo WhatsApp e a gente combina os detalhes.
3. *Vocês atendem a minha padaria?* Atendemos a Grande Vitória. A forma de receber é combinada pelo WhatsApp.
4. *Quanto rende um pacote?* Cerca de 8 xícaras, usando 30 g por xícara.
5. *Qual a diferença entre os três?* Os três levam cacau 100%. O com açúcar já vem adoçado; o sem açúcar é para adoçar como preferir; o descafeinado é para quem quer evitar cafeína, inclusive à noite.
6. *Qual a validade?* 365 dias. Confira a data impressa na embalagem.
7. *Como conservar?* Em local seco e protegido da luz solar.

**Mensagens padrão do WhatsApp** (editáveis no config):
- Botão flutuante e contato geral: "Olá! Vi o site e quero conversar sobre o cappuccino para a minha padaria."
- "Pedir amostra": "Olá! Vi o site e quero pedir uma amostra do cappuccino para a minha padaria."
- Pedido: montado por `js/pedido.js`. Termina com as linhas "Valores de referência, a confirmar." e "Entrega ou retirada: a combinar."

## 9. Fora do escopo agora

Pagamento online (Fase 2), frete e prazo, login, cadastro de clientes, lembrete de recompra, blog, domínio próprio, QR code, troca de identidade visual, **agenda de feiras** (adiada).

## 10. Pendências (não bloqueiam o código)

- **P-01** Preço específico para padarias e pedido mínimo (hoje vale a tabela de varejo).
- **P-02** Como a padaria recebe: quem entrega, onde, com que frequência e prazo.
- **P-03** Amostra: existe, é grátis, como chega à padaria.
- **P-04** Nota fiscal e prazo de pagamento (boleto, a prazo).
- **P-05** Fotos dos 3 produtos.
- **P-06** Peso real da colher (texto do preparo).
- **P-07** Formas de pagamento aceitas (hoje: PIX e dinheiro; cartão?).
- **P-08** Endereço legal após a mudança.
- **P-09** O descafeinado leva açúcar ou não? (afeta só a descrição do produto)
- **P-10** Texto da história dos pais.
- **P-11** Exigências de rotulagem para venda a comércio (perguntar ao contador).
- **P-12** Se a venda ao consumidor final continua pelo site.
