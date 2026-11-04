# ESTADO do projeto — leia primeiro

> Arquivo de contexto para qualquer chat novo (Claude ou Codex). Resume onde o projeto está, o que já foi decidido e o que falta. **Não é uma tarefa**: as tarefas ficam nos arquivos `p*.md`. Atualizar ao fim de cada tarefa.
>
> Última atualização: 04/11/2026 (o diretor fez, na noite de 03 para 04/11, o **protótipo estilo Graza** em `prototipo-graza/` (GSAP, gota que desce, nome que derrete, topo que troca, calculadora nos cartões). **Daniel aprovou e ele vira a base do site novo** (a xícara da X5 sai). Decisões de 04/11 na seção "Protótipo Graza". Próximo passo: tarefa de migração para o Codex.)

## O que é

Site de apresentação do **Cheiro das Águas** (Agropecuária Cheiro das Águas Ltda., CNPJ 57.813.645/0001-60), cappuccino artesanal e gourmet feito à mão pela família em Taparuba/MG. Público: **negócios** da Grande Vitória (padarias, cafeterias, restaurantes etc.; padaria só como exemplo, o texto fala com "o seu negócio"). O site **apresenta**; preço e negociação são pelo WhatsApp/Instagram.

## Como trabalhamos

- **Claude** = diretor/revisor: planeja, escreve as tarefas (`p*.md`) com critérios, revisa lendo os arquivos. Não roda git nem testes e não faz push.
- **Codex** = executor: edita, roda `node --test testes/`. Um chat novo por tarefa, com nome "site-capuccino" + código (ex.: "site-capuccino X3"); correções pequenas no mesmo chat. Modelos (desde 29/10): **GPT-6.1 Sol, esforço médio** = padrão para tarefas com lógica, layout ou imagens; **GPT-6.1 Terra, esforço médio** = tarefas pequenas e bem especificadas; **Sol alto** só se o mesmo critério falhar duas vezes. No experimento, o Codex **não faz commit**: Daniel testa e faz o commit depois da aprovação.
- **Daniel** confere no **Live Server do VS Code** (VS Code aberto dentro de `site-cappuccino`), testa no celular e faz o push. Site atual: `127.0.0.1:5500/index.html`; experimento: `127.0.0.1:5500/experimento/index.html`. **Atenção:** se a porta 5500 abrir o projeto "controle de gastos" (servidor antigo ligado em segundo plano), fechar todas as janelas do VS Code e reabrir só esta pasta; o Live Server pode subir em outra porta (ex.: 5501). Abrir com botão direito no `index.html` > "Open with Live Server".
- Git Bash: `cd /e/cheiro-das-aguas/site-cappuccino`; um comando por linha; `git add` por nome de arquivo (nunca `git add .`); depois de cada tarefa: `git status`, `git log --oneline -3`, `node --test testes/`.
- Prompt padrão para o Codex: "Leia AGENTS.md, p7-qualidade.md, p8-negocio.md e p9-visual.md. Execute somente a tarefa **PX** descrita em … e termine com o relatório final do AGENTS.md. O … prevalece sobre os outros documentos onde houver contradição."

## Técnica

- Site estático: HTML, CSS e JS (módulos), sem backend, sem build, sem frameworks.
- `js/config.js` é a única fonte de textos e configurações. As meta tags do `index.html` ficam no bloco `<!-- SINCRONIZAR COM js/config.js -->` e precisam bater com o config.
- Sem `innerHTML` com dados; imagens com `width`, `height` e `alt`; acessibilidade (teclado, foco visível, contraste ≥ 4,5:1).
- Publicação: GitHub Pages, branch **`prototipo`**, domínio https://cheirodasaguasgourmet.com.br/ (arquivo `CNAME` no repositório; HTTPS ativo).

## Branches

| Branch | O que é | Situação |
|---|---|---|
| `main` | versão antiga de loja, com preços (tag `loja-v1`) | guardada, não usar |
| `prototipo` | versão publicada no domínio (P1–P8) | **no ar** |
| `visual` | protótipo com as fotos reais atuais (P9 a P11a) + troca do WhatsApp | **não publicar**; tem `noindex` e faixa de protótipo |
| `experimento-capitulos` | criada a partir da `visual`; experimento visual X1–X3 na pasta `experimento/` | **não publicar**; tem `noindex` e faixa "Experimento visual" |

Nota: na `prototipo`, `ESTADO.md`, `brief.md` e `criterios.md` foram apagados (limpeza antiga). Ao levar commits da `visual` para a `prototipo` com `cherry-pick`, o conflito nesses três se resolve com `git rm -f` neles e `git cherry-pick --continue`.

## Tarefas

| Tarefa | Arquivo | Situação |
|---|---|---|
| P1–P6 | `prototipo.md` | feitas e publicadas |
| P7 qualidade e diferenciais | `p7-qualidade.md` | feita e publicada |
| P8 textos para "o seu negócio" | `p8-negocio.md` | feita e publicada |
| P9 protótipo visual | `p9-visual.md` | feita (commit `1abb48e`, 20 testes), aprovada; Daniel gostou |
| P10 calculadora nova + formulário de degustação | `p9-visual.md` | feita (commit `36cb07f`), revisada pelo Claude em 28/10: W-01 a W-10 ok; texto de abertura da calculadora ajustado à mão (falava em "xícara de 30 g", conflitava com o seletor de copo) |
| P10b calculadora com duas abas (revender o pacote / servir na xícara) | `p10b-calculadora.md` | feita, revisada pelo Claude em 28/10: X-01 a X-11 ok |
| P10c aba Xícara calculada por kg; "diet" na calculadora | `p10c-calculadora-kg.md` | feita (commit `61ff298`), revisada pelo Claude em 28/10: K-01 a K-11 ok, 26 testes; falta testar toque no celular |
| P11a simulação com as fotos reais atuais | `p11a-fotos-reais.md` | feita (commit `8d4e948`), revisada pelo Claude em 28/10: 25 testes, sem erro no console; imagens em `img/reais/` |
| P11 fotos oficiais e versão oficial | a escrever | depende das fotos reais e dos valores confirmados |
| Troca do WhatsApp para 5533999096791 | (sem arquivo) | feita em 30/10 na `visual` e levada para a `prototipo` (publicada) |
| X1 experimento de capítulos: menu, hero, transição de rolagem, "Duas formas de vender" | `x1-experimento-capitulos.md` | feita e commitada; correções de título (linhas travadas), botões pílula e convite do menu aprovadas |
| X2 calculadora em frase dentro das abas; foto da origem nítida (1440 px) | `x2-calculadora-frase.md` | feita e commitada |
| X3 sistema de texto, calculadora em folha clara, contato com foto e ícones | `x3-texto-conta-contato.md` | feita (33 testes, JS 29.222 bytes) e commitada |
| Avaliação do experimento | — | feita em 02/11 (ver "Experimento visual"): direção aprovada |
| X3b ajustes da avaliação (estilo Entrada, textos pequenos, tempo da origem, Menu no celular, vírgula, botão redundante, largura máxima) | `x3b-ajustes-avaliacao.md` | feita e commitada; teve duas correções (aviso da calculadora; folha de 880 px sem "Faça a conta" visível) |
| X4 resto do conteúdo como capítulos | `x4-capitulos-conteudo.md` | feita e commitada (44 testes, JS 33.718 bytes, teto 40.000); teve uma correção de acabamento (notas em faixa, destaque em Entrada, dica do preparo) |
| X5 personalidade dos capítulos (trecho origem → produtos → faixa → duas formas de vender): xícara que enche com a rolagem, borda de espuma, faixa correndo com "Pausar animações", cartões empilhados com a calculadora | `x5-capitulos-personalidade.md` | **feita e aprovada em 02–03/11** (47 testes, JS 34.790 bytes, CSS 24.356 bytes). Teve uma correção: linha do resultado da calculadora numa linha só a partir de 541 px; espaço vazio da xícara encolhido com movimento reduzido. O diretor conferiu no navegador (sem rolagem lateral, sem erro no console, foco nunca coberto, pausar sem mudar a altura, fluido com CPU 6× mais lenta). Commit: Daniel confirma |
| X5b cena da gota no estilo Graza (substitui a xícara da X5) | `prototipo-graza/` (protótipo do diretor, 03–04/11) | **aprovado por Daniel em 04/11**; guardado na branch `prototipo-graza` (com o `prototipo-descida`). Vira a base do site novo |
| G4 migração do protótipo Graza para `novo/` (config único em `textos.pagina`, testes, meta tags) | `g4-migracao-graza.md` | **feita pelo Codex e revisada em 04/11** (`testes/novo.test.mjs`, 10 testes; 57 no total). O diretor repetiu a medição da gota e do derretido em `novo/`: igual ao protótipo. Correção do diretor: o Codex tinha deixado `montar.js`, `pagina.js` e `textos.js` em linha única para caber no teto de 40.000 bytes; reformatados e **teto do JS próprio subido para 50.000** (hoje 44.808). Falta Daniel testar no celular e fazer o commit |
| G6 conteúdo sem repetição no `novo/` (cada seção dona de um assunto; sai "Dúvidas"; textos novos só em `textos.pagina`) | `g6-conteudo-sem-repeticao.md` | **escrita em 04/11**, mapa aprovado por Daniel; executar no Codex (chat novo "site-capuccino G6", GPT-6.1 Terra, esforço médio); não fazer commit |
| G5 trocar a raiz pelo `novo/` (remover `noindex`, mover arquivos, publicar) | a escrever | depois da aprovação da família e das fotos oficiais |
| X6 personalidade do resto (como preparar, como funciona, dúvidas, contato) na mesma linguagem | a escrever | depois da cena da gota |
| X7 revisão no celular real e desempenho no 4G | a escrever | depois da X6 |

## Fatos do negócio (confirmados pela família)

- Produtos exibidos: **com açúcar** e **sem açúcar**; descafeinado existe no config com `exibir: false`. No varejo, só há pacote de **250 g** (a embalagem é a mesma para os dois). Negócios que **servem na xícara** compram **por kg**, num pacote de 1 kg separado (embalagem ainda não definida). Preço do kg em 28/10: **R$ 84 tradicional** e **R$ 108 diet** (negociável, fora do site). O sem açúcar tem aprovação para ser chamado de **diet**: hoje só a calculadora usa "diet"; a aba dos produtos troca "Sem açúcar" por "diet" quando chegar a embalagem nova.
- Ingredientes com açúcar: "Leite em pó integral, bicarbonato de sódio, canela em pó, cacau 100%, açúcar refinado e café Conilon." Sem açúcar: os mesmos, sem o açúcar refinado.
- Avisos: "Contém leite e derivados. Não contém glúten." Conservação: "Local seco, ventilado e protegido da luz solar." Validade: 365 dias.
- Café Conilon **plantado pela própria família** (confirmado por Daniel em 04/11); cacau 100%, não achocolatado; feito à mão, em casa, sem processo industrial e **sem máquinas** (nenhuma etapa mecanizada, confirmado em 04/11). Não precisa adicionar leite: o leite já vem no pó, o preparo é só com água.
- Entrega pela família na Grande Vitória, sem taxa, de um dia para o outro. Pagamento: Pix, cartão na maquininha na entrega ou dinheiro.
- **Degustação gratuita** antes da primeira venda: a família leva uma pequena quantidade do cappuccino e a água quente, e a pessoa experimenta na hora.
- WhatsApp 5533999096791; Instagram @cheirodasaguasgourmet.
- **Sem preços no site** (`apresentacao.mostrarPrecos: false`).

## Proibido escrever (vale em tudo)

Premium, melhor, saudável ou benefício de saúde; conservante, aditivo ("sem aditivos" é falso: o bicarbonato é aditivo), natural, orgânico, selos; "achocolatado" ou "café solúvel" como ingrediente (só vale a frase "Cacau 100%, não achocolatado."); origem do café, pontuação; marcas concorrentes ou ataques ao industrial. **Exceção desde 04/11:** pode dizer que o café é **plantado por nós** (fato confirmado); continua proibido inventar região, pontuação ou "origem" como selo.

## A confirmar (bloqueia a calculadora e a versão oficial)

- **Calculadora:** decidido em 28/10: 3 colheres = 30 g para 100 ml (rótulo diz 35 g: alinhar no rótulo novo); os negócios revendem o pacote e servem na xícara de louça (reutilizada, sem custo de copo); preço padrão do pacote para empresas R$ 30 (com açúcar) e R$ 35 (sem açúcar), negociável e fora do site; uma padaria cliente revende por R$ 39 e R$ 59. Falta confirmar: tamanhos de xícara usados nos negócios (P10b usa 150/200/300 ml) Preço da xícara: segundo o Davi, varia de R$ 8 a R$ 24 conforme o estabelecimento; o campo fica vazio, com essa faixa como dica. Com 30 g/100 ml, a xícara de 200 ml custa R$ 7,20 de pó (pacote a R$ 30): ganho baixo para quem cobra perto de R$ 8, bom acima de uns R$ 12.
- **Fotos reais:** 27 fotos recebidas em 28/10 (originais em `fotos-reais/`, fora do Git). Usadas na P11a: 1, 2, 4, 6, 11, 12, 13, 14, 15, 17, 19. Ainda faltam: produto no balcão ou na prateleira de uma padaria; a família preparando e entregando (mãe e pai, em Taparuba); cacau (só aparece na foto 2); pó e embalagem sem marca de outras empresas (as fotos 3, 6 e 18 mostram uma caneca de outra marca); o verso do rótulo com ingredientes; um cappuccino quente pronto na xícara de louça de padaria. Tirar na vertical, assunto no centro. **Pedido enviado ao Davi em 30/10** (lista: pais preparando em casa; entrega; pacote no balcão de padaria; cappuccino quente na xícara de louça com o pacote; cacau e café em grãos de perto; verso do pacote; casa e roça em Taparuba). Aguardando.
- **Fotos reais (confirmado por Daniel em 28/10):** todas autorizadas pelas pessoas que aparecem; têm edição (cor, luz), mas nenhuma foi gerada por IA. As fotos com pessoas (7 a 10, 13, 16, 24, 27, 28) podem ser usadas, por exemplo numa futura seção "quem somos". Continua valendo: não usar as que mostram a caneca de outra marca (3, 18 e a parte direita da 6).
- **Tamanho das imagens:** os testes contam 1 KB = 1.000 bytes. Imagens que o Claude grava na pasta do PC ganham um bloco C2PA (credenciais de conteúdo, ~5.800 bytes). Ao preparar imagens, deixar pelo menos 7.000 bytes de folga e conferir o tamanho final na pasta (`Get-ChildItem img/reais`).
- **Rótulo** da embalagem desatualizado (cita achocolatado e café solúvel) e igual para os dois produtos: atualizar e diferenciar antes de vender.
- Com o contador: "sem açúcar" ou "sem adição de açúcar"; nota fiscal.
- **INPI:** verificar o risco do nome "Cheiro das Águas".
- Com a família: prazo de entrega, pedido mínimo, condições para empresas.

## Experimento visual (branch `experimento-capitulos`)

Objetivo (pedido de Daniel em 30/10): descobrir, navegando, uma direção visual mais imersiva do que o site atual, sem mexer no site oficial. **Nada aqui é identidade aprovada** até a avaliação de Daniel.

- **Isolamento:** tudo em `experimento/` (HTML, CSS, JS, `textos.js`, `fontes/`, `img/`) + `testes/experimento.test.mjs`. Nenhum arquivo do site atual é alterado. Textos e dados vêm de `js/config.js` por importação (nunca copiados); só os textos novos ficam em `experimento/textos.js`. Sem JS, só aparece um aviso `<noscript>` e o link para o site atual (decisão de Daniel).
- **Direção:** cores atuais (torra, leite, ouro, cacau, folha); fonte de títulos **Fraunces** local (OFL, em `experimento/fontes/`); o elemento marcante é o **arco** com fio dourado, que muda de lugar, tamanho e foto na rolagem do hero para a origem (palco `sticky`, rolagem nativa, sem travar). Menu em tela cheia; botões em pílula; efeito de peso nas letras do título só com mouse.
- **Sistema de texto (X3, X3b):** 6 estilos para tudo: Abertura (só o h1), Capítulo, Entrada (Fraunces ~18–24 px, a frase logo abaixo de um título grande), Frase, Texto (17 px) e Nota (14 px). **Voz:** a marca fala como "nós", frases curtas, sem caixa alta nem exclamação; só a calculadora fala como "eu".
- **Calculadora:** em frase ("Se eu pago R$ … ganho R$ — por xícara."), dentro das abas "Servir na xícara" e "Revender o pacote", numa folha clara; reaproveita `js/calculadora.js`; campos vazios; dicas uma por vez.
- **Contato:** foto 10 (moça sorrindo com dois pacotes) no arco; título "Vamos marcar uma degustação?"; WhatsApp e Instagram com ícones genéricos (balão e câmera, **não** os logos oficiais); notas de entrega e pagamento vindas do FAQ do config. **Não dizer "família" junto dessa foto**: a moça **não é da família**, faz parte do grupo de influenciadoras da empresa (Daniel, 04/11). Na nota de entrega, o trecho "pela família" é removido por código.
- **Teto de JS do experimento:** 40.000 bytes (20.000 na X1, 30.000 com a calculadora, 40.000 na X4).
- **Calculadora (X3b):** folha de até 880 px, sem o texto visível "Faça a conta" (só nome acessível), rótulos dos resultados em Texto, aviso "Preencha os dois valores…" colado embaixo do número, "por R$ + campo + vírgula" sempre juntos.
- **Menu no celular:** o botão some ao rolar para baixo e volta ao rolar para cima (só até 540 px).
- **Aviso ignorável no console:** "[Intervention] Images loaded lazily…" é do próprio Edge.
- **Fotos 24, 27 e 28** (bebida gelada): não usar até a família confirmar esse jeito de servir.

**Avaliação de 02/11:** Daniel achou ok, exceto os textos pequenos abaixo dos títulos (resolvido na X3b com o estilo Entrada). Notas do Claude: personalidade 4, fluidez 3, clareza 3,5, desempenho 4 (provisória, falta 4G), mobile 3,5.

**Decisões de Daniel em 02/11:** (1) sem formulário de degustação: só o botão direto (abre o WhatsApp com a mensagem pronta); (2) "Por que vender" espalhado pelos capítulos, sem seção própria.

**Depois da X4 (02/11), Daniel não gostou da organização:** seções mal separadas, todas com o mesmo formato, só a primeira passagem (hero → origem) tem transição, e a calculadora parece uma caixa quadrada deslocada no meio. Referência principal: **Graza** (https://www.graza.co/): cada seção com formato e cor próprios, bordas curvas e fios tracejados entre seções, uma gota que cai com a rolagem, cartões que se empilham, faixa de texto correndo. Outras que ele gostou: Max Chocolatier e a página do AirPods Pro (seção fixada). Pesado não: público no celular, 4G.
**Decisões de Daniel (sim às três):** (1) **gota de café** caindo com a rolagem (da xícara da origem, virando borda de espuma no capítulo de produtos); (2) **"Duas formas de vender" vira dois cartões empilhados**, cada um com a calculadora inteira, de ponta a ponta, **sem abas e sem a caixa no meio**; (3) **faixa correndo** "Café Conilon · Cacau 100% · Feito à mão · Taparuba, MG" (textos do config). Também proposto e não vetado: bordas de espuma e fios tracejados dourados, cor própria por capítulo (usar a folha/verde), botão "Pausar animações".
**Pesquisa e protótipo (02/11):** a Graza usa GSAP (gota presa com "pin"), faixa em CSS puro (`@keyframes`, 20 s), fios em `border: dashed` e botão "Pause animations"; hoje ela **não** tem cartões empilhados nem borda curva (os cartões só deslizam). Peso medido: ~94 MB (87 MB de vídeo), 2,2 MB de JS. AirPods Pro: bloco alto (2,5 telas) com tela `sticky` dentro, como o nosso palco. Max Chocolatier: quase sem efeitos, personalidade nas fotos grandes. Suporte: `animation-timeline` no Chrome 115+ e Safari/iOS 26+; Firefox estável ainda não. Celular no Brasil (out/2026, StatCounter): Chrome 76,6%, Safari 19,7%. Protótipo do diretor (descartável, fora do projeto): JS 35.138 bytes, 60 fps com CPU 4×/6× mais lenta, nenhum campo coberto ao navegar por Tab.
**Desenho aprovado por Daniel (02/11):** gota trocada por **xícara que enche de café com a rolagem** (espuma sobe, escorre e sai vapor) e pousa na **borda de espuma**; produtos com topo claro e corpo **cor de café** (`--cacau`), pacotes em cartões de foto com etiquetas; **faixa dourada** entre produtos e vender ("Café Conilon · Cacau 100% · Feito à mão · Taparuba, MG", com "Taparuba, MG" novo no `textos.js`); "Duas formas de vender" com **topo em arco** e dois cartões (claro e **verde folha** com texto escuro) com a calculadora dentro, empilhados só no desktop; xícara e faixa também no celular. Teto de JS continua 40.000.
**Regras da X5:** sem bibliotecas nem build; preferir CSS (sticky, scroll-driven animations com fallback, SVG); reduced-motion sem movimento; no celular os cartões ficam um embaixo do outro; JS ≤ 45.000 bytes (propor e justificar se precisar subir o teto); começar só pelo trecho origem → produtos → duas formas de vender; se Daniel aprovar, o resto vira a X6.

Depois da X5: X6 = o resto dos capítulos na mesma linguagem; X7 = revisão no celular real e desempenho no 4G; em seguida a família vê e decide se o experimento vira o site novo.

## A ideia completa de Daniel (03/11)

O que ele quer do site, nas palavras dele resumidas:

- Um site de marca artesanal **com vida**, no nível da Graza: cada seção com formato próprio, desenhos com personalidade, movimento que dá **sensação de natureza e de processo** ("um processo que já existe"), e não desenhos trocando.
- A ideia atual de cena: no lugar da xícara da X5, **um fruto de café com uma torneira** (como a azeitona com torneira da Graza) pinga **uma gota de café**; a gota desce pela página acompanhando a rolagem; no caminho, **desenhos com texto ao lado**, alternando os lados (galho de café = "Café Conilon", cacau = "Cacau 100%", a moça com a cesta = "Feito à mão, em casa", xícara = "Taparuba, MG"); no fim a gota **cai no título "Cheiro das Águas", grande, e molha o título** de leve. No celular: desenho à esquerda, texto à direita, a gota passando entre os dois (como a Graza no celular).
- Decidido com Daniel em 03/11: a xícara que enche deixa de ser o fim (vira só um desenho com texto); a cena é um capítulo próprio, antes dos pacotes; cor única marrom (#3B2618) como os desenhos do ChatGPT, no lugar do colorido.
- Daniel quer **abstrair o esforço**: usar o caminho mais simples que dê um resultado bonito, em vez de construir tudo à mão.

## Cena da gota: o que já foi tentado (03/11)

| Tentativa | O que foi feito | Por que não serviu |
|---|---|---|
| v1 | Desenhos simples feitos pelo Claude em SVG; um objeto que troca de forma (fruto → grão → gota → fio) por CSS com a rolagem; xícara da X5 no fim | "Desenhos ruins", transição dura |
| v2 | Mesma cena com as formas se transformando aos poucos (morph de caminhos por JS), fruto descascando, grão torrando, derretendo, xícara com onda e respingos; dois estilos (colorido e traço) | Ainda "desenhos mudando", sem fluidez de natureza |
| v3 | Desenhos gerados pelo Daniel no ChatGPT (10 PNG, estilo Graza, ótimo resultado), convertidos pelo Claude em SVG nítido; tela `canvas` com vento no galho, pêndulo, queda em zigue-zague com inércia, troca de imagens, café espirrando e manchando o pires | Daniel gostou dos desenhos, **não da animação**: troca entre imagens parece ruim |
| v4 | Ideia do Daniel no estilo Graza: fruto + torneira provisória (desenhada pelo Claude), **uma gota só** (desenho 06) descendo com a rolagem, desenhos parados com leve balanço, título "Cheiro das Águas" com ondas, respingos, letras ondulando e gotinhas escorrendo | Não chegou no nível que ele quer |

Arquivos dessa fase:

- **Desenhos do ChatGPT:** `E:\cheiro-das-aguas\desenhos\` (01 galho, 02 fruto, 03 fruto aberto, 04 grão cru, 05 grão torrado, 06 gota, 07 cacau, 08 tigela, 09 xícara, 10 moça com cesta; fora do Git). Falta o **11 fruto com torneira** (prompt já passado ao Daniel, no mesmo chat do ChatGPT dos outros).
- **Versões em SVG** (feitas com potrace, uma cor, 2 a 32 KB cada) + xícara vazia e cheia: dentro de `prototipo-descida/desenhos/`.
- **Protótipo v4 para testar com Live Server:** `prototipo-descida/index.html`. É uma cópia descartável do experimento; **não entra no commit** (não usar `git add` nessa pasta; apagar quando a cena for decidida).

O que o diretor aprendeu:

- A Graza funciona porque **só a gota se move**; os desenhos ficam parados com pouca vida, e quem faz a diferença são ilustrações profissionais e o acabamento (GSAP, ritmo, tipografia própria grossa).
- Trocar uma imagem por outra (ou deformar formas) **não** dá sensação de processo; para movimento de verdade (fruto caindo, líquido, respingo) o caminho são **animações feitas por animador** ou **vídeo/sequência de quadros**.
- O título da Graza usa uma fonte própria grossa; a Fraunces do experimento fica fina demais para esse efeito.

## Para a pesquisa (o que Daniel vai buscar)

Perguntas abertas para destravar o projeto:

1. **Animação:** qual ferramenta dá movimento de natureza sem programar quadro a quadro? Candidatas: **Rive** (animação interativa controlada pela rolagem; runtime ~150 KB), **Lottie** (After Effects / LottieFiles; lottie-web ~250 KB ou dotLottie), **GSAP + ScrollTrigger** (o que a Graza usa; hoje grátis), vídeo gerado por IA (Sora, Veo, Kling, Runway) tocado pela rolagem como no AirPods (sequência de imagens WebP), ou contratar um animador/ilustrador (Workana, 99Freelas, Fiverr). Qualquer biblioteca **quebra as regras atuais** (sem bibliotecas, JS ≤ 40.000 bytes): decidir se o teto sobe.
2. **Desenho:** continuar com o ChatGPT (bom estilo, mas cada imagem é solta e não anima) ou pedir um conjunto feito para animar (partes separadas: galho, folhas, fruto, torneira, gota).
3. **Fluxo de trabalho:** se outra ferramenta (ex.: um construtor visual como Webflow/Framer, ou um agente que vê a tela e testa sozinho) faria esse tipo de site andar mais rápido que o fluxo Claude diretor + Codex executor + Daniel testando.
4. **Tipografia:** uma fonte de título grossa e com personalidade (licença livre) para o "Cheiro das Águas" grande.
5. **Peso:** o público está no celular com 4G; qualquer animação nova precisa de um orçamento de peso (sugestão: até ~1,5 MB na página toda).

Enquanto isso: X5 está pronta e pode seguir como está; o site publicado (`prototipo`) não muda.

## Protótipo Graza (04/11) — base do site novo

Pasta `prototipo-graza/` (ver o `LEIA-ME.md` dela). Feito pelo diretor; branch `prototipo-graza` guarda ele e o `prototipo-descida`.

**Decisões de Daniel em 04/11:**
1. **GSAP aceito** (gsap, ScrollTrigger e MorphSVGPlugin, cópia local em `vendor/`, licença sem custo). A regra "sem bibliotecas" do AGENTS.md passa a ter essa exceção, e o teto de JS precisa ser revisto (JS próprio ~32 KB + GSAP ~150 KB).
2. **Fontes:** Instrument Serif (títulos) + Fraunces (o nome grande). A Courier Prime saiu: os textos pequenos usam a fonte do sistema (`system-ui`).
3. **Sem JavaScript:** a página mostra o essencial (nome, título, texto do hero, botões de degustação e Instagram, faixa, entrega, pagamento, dados legais e a foto em arco), no mesmo estilo, num bloco `<noscript>` marcado `SINCRONIZAR COM js/config.js`. **Daniel quer conferir se isso não descaracteriza o site.**
4. **O protótipo Graza vira a base**; a xícara da X5 sai.
5. **"Você sabia?" saiu por enquanto.** Volta quando a família trouxer curiosidades reais (montar junto com Daniel).
6. **Mapa de conteúdo (04/11):** cada seção é dona de um assunto. Origem = onde e quem; cena = o que vai dentro (café plantado por nós, cacau, à mão sem máquinas, aroma); produtos = a escolha; vender = por que vale para o negócio (+ "não precisa de leite"); como preparar = preparo e rendimento; como funciona = degustação e pedido; contato = entrega, pagamento e conservação. **"Dúvidas" sai** do `novo/`. "Você sabia?" só volta com histórias da família que não caibam em outro lugar (como começou, desde quando).

**Também em 04/11:** cartão "Cappuccino por kg" removido (sem foto da embalagem de 1 kg); textos pequenos com no mínimo 14 px (inclusive o botão "Degustação" do topo no celular); paradas da gota como `h3`; menos repetição (apoio do hero = começo do subtítulo do config; frase embaixo do nome = `diferenca.destaque`).

**Falta para o oficial (vai para a G4):** todos os textos novos de `prototipo-graza/textos.js` para o `js/config.js`; estrutura `css/`, `js/`, `img/` (hoje usa `../experimento/img/` e `../js/`); meta tags `SINCRONIZAR`; testes `node --test` (textos do config, palavras proibidas, imagens com width/height/alt); tirar selo "Protótipo", link "Site atual" e `noindex`; atualizar AGENTS.md (GSAP) e o teto de JS; desenho 11 (fruto com torneira) no lugar da torneira provisória; teste no celular real e no 4G.

**Trazer da família:** curiosidades para o "Você sabia?"; as fotos já pedidas ao Davi em 30/10; foto da embalagem de 1 kg quando existir (o cartão por kg volta).

## Ideias em espera

- **Área para empresas** (ideia do irmão, Davi): portão com CNPJ/CPF não é segurança real em site estático e CPF traz questão de LGPD. Recomendado: link privado não listado + cadastro pelo WhatsApp + PDF de condições depois da degustação. Login de verdade só numa fase 2.
- Teste com um dono de negócio de fora (roteiro de 5 perguntas, a fazer).
- Teste de velocidade no 4G com as fotos.
- Limpar documentos antigos da época da loja (`brief.md`, `tarefas.md`, `criterios.md`).
- ai-memory (Fabio Akita): avaliar num projeto futuro; por enquanto este arquivo resolve.

## Para a versão oficial (P11, a escrever)

Na branch `visual`: trocar as fotos ilustrativas pelas reais (mesmos nomes e proporções), `apresentacao.prototipo: false`, remover o `noindex` e o "ilustrativa" dos textos alternativos, conferir tudo e levar para a branch publicada.
