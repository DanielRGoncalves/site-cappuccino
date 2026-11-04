# G6 — Conteúdo sem repetição na pasta `novo/`

> Tarefa para o Codex. Leia antes: `AGENTS.md`, `ESTADO.md` (seção "Protótipo Graza") e `g4-migracao-graza.md` (as regras de "O que NÃO pode mudar" continuam valendo). Onde esta tarefa contradisser outro documento, **esta tarefa prevalece** (aprovada por Daniel em 04/11).

## Objetivo

Hoje a mesma informação aparece em muitos lugares da página `novo/` (ex.: "Cacau 100%" em 7 seções, "entrega sem taxa" em 5). Daniel aprovou um mapa em que **cada seção é dona de um assunto**. Esta tarefa só troca e remove **textos** e tira a seção "Dúvidas". Nada de visual, movimento ou calculadora muda.

## Regra de ouro: não mexer nos textos do site publicado

O `js/config.js` também alimenta o site da raiz e o `experimento/`. **Não altere nenhum texto que já existe no config.** Todo texto novo ou reescrito entra como **chave nova dentro de `textos.pagina`**, e `novo/js/textos.js` passa a usar essa chave. Os testes antigos têm que continuar passando sem mudança neles.

## Mudanças (chaves novas em `textos.pagina`, com estas palavras exatas)

| # | Seção | Hoje | Passa a ser | Chave nova sugerida |
|---|---|---|---|---|
| 1 | Origem: título | "Feito à mão em Taparuba, Minas Gerais" | "Feito em Taparuba, Minas Gerais" | `origem.titulo` |
| 2 | Origem: texto | "Cada pacote é preparado pela família, em casa, com café Conilon e cacau 100%." | "Cada pacote é preparado pela família, em casa." | `origem.texto` |
| 3 | Cena, parada 1 (Café Conilon): texto | "Café Conilon para dar mais sabor ao cappuccino." | "Café Conilon, plantado por nós." | `paradas[0]` (só o texto; o título fica) |
| 4 | Cena, parada 3 (Feito à mão, em casa): texto | "Preparado à mão, em casa, sem processo industrial." | "Preparado à mão, em casa, sem processo industrial e sem máquinas." | `paradas[2]` (só o texto) |
| 5 | Produtos: frase embaixo dos cartões | "Nos dois: café Conilon, cacau 100% e o mesmo preparo." | "A única diferença entre os dois é o açúcar." | `produtosIgual` |
| 6 | Vender: frase de abertura | "Um diferencial para o seu cardápio: cappuccino artesanal, feito à mão e com cacau 100%." | "Um diferencial para o seu cardápio." | `venderEntrada` |
| 7 | Vender, cartão "Servir na xícara": lista | "Preparo em 3 passos, só com água quente." e "30 g para cada 100 ml de água fervente." | **um item só:** "Não precisa de leite: ele já vem no pó. É só água quente." | `venderSemLeite` (e a chave `venderPreparo` deixa de ser usada; pode ser apagada de `textos.pagina`, porque foi criada na G4) |
| 8 | Vender, cartão "Revender o pacote": lista | "Rende cerca de 8 xícaras…", "Validade de 365 dias.", "Entrega sem taxa…" | **um item só:** "Validade de 365 dias." (continua vindo de `porque.motivos[3]`) | — |
| 9 | Como funciona, passo 3 | "3. Se gostar, faz o pedido e entregamos, sem taxa. Pagamento por Pix, cartão na maquininha na entrega ou dinheiro." | "3. Se gostar, faz o pedido e entregamos." | `comoPasso3` (os passos 1 e 2 continuam vindo de `como.passos`) |
| 10 | Contato: texto | "A gente leva o cappuccino e a água quente, e você prova na hora. Sem custo." | "Peça pelo WhatsApp e a gente combina como fazer." | `contato.texto` (substitui o valor dentro de `textos.pagina.contato`, que foi criado na G4) |
| 11 | Contato: notas | Entrega e Pagamento | **três notas:** Entrega, Pagamento e **Conservação**. Título "Conservação"; texto vem de `textos.conservacao` ("Local seco, ventilado e protegido da luz solar.") | `contato.conservacaoTitulo` |

## Remover a seção "Dúvidas"

- Tirar `<section id="duvidas">` do `novo/index.html`, a função `duvidas()` e a chamada dela em `montar.js`, o link "Dúvidas" do menu (`textos.pagina.links`, criado na G4) e as regras `.duvidas…` do `novo/css/estilo.css`.
- O `faq` do config **não é apagado** (o site da raiz usa).
- Nenhuma outra regra de CSS muda.

## O que não muda

- Faixa de aviso, hero, faixa correndo, títulos das paradas, ingredientes, preparo, calculadora, botões, `<noscript>`, meta tags.
- `cena.js`, `palco.js`, `capitulo.js`, `conta.js`: **nenhuma linha**.
- Os botões "Pedir degustação gratuita" repetidos na página são de propósito (uma ação, várias entradas).

## Testes

- Atualizar `testes/novo.test.mjs` onde ele depende de "Dúvidas"/`#duvidas` ou dos textos trocados.
- Acrescentar testes:
  1. Os 11 textos novos aparecem na página montada (ou no objeto de `novo/js/textos.js`), com as palavras exatas.
  2. Na página montada, contando só o texto visível (sem `aria-hidden`, sem o `<noscript>`, sem a faixa correndo, sem os ingredientes e sem o `<title>`/meta), **"cacau 100%" aparece no máximo 3 vezes** (título do hero; título e texto da parada 2) e **"sem taxa" no máximo 2** (faixa de aviso e nota de entrega).
  3. Não existe `#duvidas` nem link para ele.
  4. Nenhum texto antigo do config mudou (compare as chaves fora de `textos.pagina` com o arquivo da G4 no git: `git show HEAD:js/config.js`).
- `node --test testes/` inteiro passando.

## Verificação no navegador

Em 320, 390 e 1440 px: sem rolagem lateral, console sem erros, menu sem "Dúvidas" e funcionando, contato com as três notas lado a lado no computador (no celular, uma embaixo da outra está ok), e a gota e o derretido iguais (o diretor mede depois).

## Fora do escopo

Commit, push, mexer no site da raiz, "Você sabia?" (não volta agora), qualquer texto não listado acima.

## Relatório final

No formato do `AGENTS.md`, com a tabela das 11 mudanças (chave → texto) e a contagem do teste 2 (quantas vezes cada termo ficou).
