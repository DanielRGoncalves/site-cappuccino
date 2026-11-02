# ESTADO do projeto — leia primeiro

> Arquivo de contexto para qualquer chat novo (Claude ou Codex). Resume onde o projeto está, o que já foi decidido e o que falta. **Não é uma tarefa**: as tarefas ficam nos arquivos `p*.md`. Atualizar ao fim de cada tarefa.
>
> Última atualização: 02/11/2026 (experimento visual X1, X2 e X3 feitos e commitados na branch `experimento-capitulos`; **avaliação feita em 02/11: direção aprovada**; próximas tarefas X3b (ajustes da avaliação) e X4 (resto do conteúdo), já escritas. Número do WhatsApp trocado e publicado em 30/10).

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
| X3b ajustes da avaliação (estilo Entrada, textos pequenos, tempo da origem, Menu no celular, vírgula, botão redundante, largura máxima) | `x3b-ajustes-avaliacao.md` | escrita em 02/11; a executar |
| X4 resto do conteúdo como capítulos | `x4-capitulos-conteudo.md` | escrita em 02/11; começa depois da X3b aprovada; teto de JS sobe para 40.000 bytes |

## Fatos do negócio (confirmados pela família)

- Produtos exibidos: **com açúcar** e **sem açúcar**; descafeinado existe no config com `exibir: false`. No varejo, só há pacote de **250 g** (a embalagem é a mesma para os dois). Negócios que **servem na xícara** compram **por kg**, num pacote de 1 kg separado (embalagem ainda não definida). Preço do kg em 28/10: **R$ 84 tradicional** e **R$ 108 diet** (negociável, fora do site). O sem açúcar tem aprovação para ser chamado de **diet**: hoje só a calculadora usa "diet"; a aba dos produtos troca "Sem açúcar" por "diet" quando chegar a embalagem nova.
- Ingredientes com açúcar: "Leite em pó integral, bicarbonato de sódio, canela em pó, cacau 100%, açúcar refinado e café Conilon." Sem açúcar: os mesmos, sem o açúcar refinado.
- Avisos: "Contém leite e derivados. Não contém glúten." Conservação: "Local seco, ventilado e protegido da luz solar." Validade: 365 dias.
- Café Conilon; cacau 100%, não achocolatado; feito à mão, em casa, sem processo industrial.
- Entrega pela família na Grande Vitória, sem taxa, de um dia para o outro. Pagamento: Pix, cartão na maquininha na entrega ou dinheiro.
- **Degustação gratuita** antes da primeira venda: a família leva uma pequena quantidade do cappuccino e a água quente, e a pessoa experimenta na hora.
- WhatsApp 5533999096791; Instagram @cheirodasaguasgourmet.
- **Sem preços no site** (`apresentacao.mostrarPrecos: false`).

## Proibido escrever (vale em tudo)

Premium, melhor, saudável ou benefício de saúde; conservante, aditivo ("sem aditivos" é falso: o bicarbonato é aditivo), natural, orgânico, selos; "achocolatado" ou "café solúvel" como ingrediente (só vale a frase "Cacau 100%, não achocolatado."); origem do café, pontuação; marcas concorrentes ou ataques ao industrial.

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
- **Sistema de texto (X3):** 5 estilos para tudo: Abertura (só o h1), Capítulo, Frase, Texto (17 px) e Nota (14 px). **Voz:** a marca fala como "nós", frases curtas, sem caixa alta nem exclamação; só a calculadora fala como "eu".
- **Calculadora:** em frase ("Se eu pago R$ … ganho R$ — por xícara."), dentro das abas "Servir na xícara" e "Revender o pacote", numa folha clara; reaproveita `js/calculadora.js`; campos vazios; dicas uma por vez.
- **Contato:** foto 10 (moça sorrindo com dois pacotes) no arco; título "Vamos marcar uma degustação?"; WhatsApp e Instagram com ícones genéricos (balão e câmera, **não** os logos oficiais); notas de entrega e pagamento vindas do FAQ do config. **Não dizer "família" junto dessa foto**, porque nenhuma foto com pessoas mostra os pais; se a moça for da família, Daniel avisa e ajustamos. Na nota de entrega, o trecho "pela família" é removido por código.
- **Teto de JS do experimento:** 30.000 bytes (subiu de 20.000 com a calculadora).
- **Aviso ignorável no console:** "[Intervention] Images loaded lazily…" é do próprio Edge.
- **Fotos 24, 27 e 28** (bebida gelada): não usar até a família confirmar esse jeito de servir.

**Próximo passo, depois da avaliação: X4.** Trazer o resto do conteúdo como capítulos, nesta ordem proposta: início → origem → produtos (com e sem açúcar, ingredientes, avisos) → duas formas de vender + conta → como preparar → como funciona → dúvidas → contato. Duas decisões de Daniel pendentes:
1. Volta o **formulário de degustação** (abre o WhatsApp com tudo preenchido) ou fica só o botão direto?
2. **"Por que vender"** (5 frases soltas): espalhar cada frase onde faz sentido (validade nos produtos, entrega em "como funciona") em vez de uma seção própria? (recomendação do Claude)

Depois da X4: X5 = revisão no celular real e desempenho no 4G; em seguida a família vê e decide se o experimento vira o site novo.

## Ideias em espera

- **Área para empresas** (ideia do irmão, Davi): portão com CNPJ/CPF não é segurança real em site estático e CPF traz questão de LGPD. Recomendado: link privado não listado + cadastro pelo WhatsApp + PDF de condições depois da degustação. Login de verdade só numa fase 2.
- Teste com um dono de negócio de fora (roteiro de 5 perguntas, a fazer).
- Teste de velocidade no 4G com as fotos.
- Limpar documentos antigos da época da loja (`brief.md`, `tarefas.md`, `criterios.md`).
- ai-memory (Fabio Akita): avaliar num projeto futuro; por enquanto este arquivo resolve.

## Para a versão oficial (P11, a escrever)

Na branch `visual`: trocar as fotos ilustrativas pelas reais (mesmos nomes e proporções), `apresentacao.prototipo: false`, remover o `noindex` e o "ilustrativa" dos textos alternativos, conferir tudo e levar para a branch publicada.
