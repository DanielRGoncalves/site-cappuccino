# ESTADO do projeto — leia primeiro

> Arquivo de contexto para qualquer chat novo (Claude ou Codex). Diz onde o projeto está e **o que falta agora**. O histórico (tarefas P1–P11, experimento X1–X5, tentativas da cena da gota, protótipos G4/G6/G7) está no Git: `git log -- ESTADO.md` e os arquivos `p*.md`, `x*.md`, `g*.md`. **Não é uma tarefa.** Atualizar ao fim de cada tarefa.
>
> Última atualização: 10/11/2026. **Daniel e o Davi aprovaram o site novo.** R1 (rótulo do diet), G5 (novo na raiz, anterior em `antigo/`) e G8 (números da calculadora centralizados) estão commitadas na `prototipo-graza` (HEAD `c8f2d8c`). O site novo foi **publicado** na branch `prototipo` em 04/11/2026 (tag `antes-g5` marca o estado anterior). Assunto em aberto: localização dos estabelecimentos (ver "Pendente agora").

## O que é

Site de apresentação do **Cheiro das Águas** (Agropecuária Cheiro das Águas Ltda., CNPJ 57.813.645/0001-60), cappuccino artesanal e gourmet feito à mão pela família em Taparuba/MG. Público: **negócios** da Grande Vitória (padarias, cafeterias, restaurantes etc.; o texto fala com "o seu negócio"). O site **apresenta**; preço e negociação são pelo WhatsApp/Instagram.

## Como trabalhamos

- **Claude** = diretor/revisor: planeja, escreve as tarefas com critérios, revisa lendo os arquivos e mede no navegador. Não faz commit nem push.
- **Codex** = executor: edita, roda `node --test testes/`. Um chat novo por tarefa, com nome "site-capuccino" + código (ex.: "site-capuccino G5"). Modelos: **GPT-6.1 Sol, esforço médio** = tarefas com lógica, layout ou imagens; **GPT-6.1 Terra, esforço médio** = tarefas pequenas e bem especificadas; **Sol alto** só se o mesmo critério falhar duas vezes. O Codex **não faz commit**.
- **Daniel** confere no **Live Server do VS Code** (VS Code aberto dentro de `site-cappuccino`; botão direito no `index.html` > "Open with Live Server"), testa no celular e faz commit e push. Página principal: `127.0.0.1:5500/index.html`; anterior: `127.0.0.1:5500/antigo/index.html`. Se a porta 5500 abrir outro projeto, fechar todas as janelas do VS Code e reabrir só esta pasta.
- Git Bash: `cd /e/cheiro-das-aguas/site-cappuccino`; um comando por linha; `git add` por nome de arquivo (nunca `git add .`); **o diretor só lista arquivos para o `git add` depois de ver o `git status` do Daniel**. Depois de cada tarefa: `git status`, `git log --oneline -3`, `node --test testes/`.

## Técnica (site principal na raiz)

- Site estático: HTML, CSS e JS (módulos), sem backend e sem build. Única biblioteca permitida: **GSAP** (gsap, ScrollTrigger, MorphSVGPlugin), cópia local em `vendor/`, sem CDN.
- A raiz é **independente**: `index.html`, `css/estilo.css`, `css/fontes/`, `js/` (config, montagem, movimento, calculadora e pedido), `img/` (com `img/reais/`), `desenhos/` e `vendor/`. `js/config.js` é a fonte única de textos da página principal, inclusive `textos.pagina`. Nenhum caminho com `../` nas fontes do principal.
- O site anterior está em `antigo/` (`index.html`, `css/`, `js/` e `img/`); `antigo/js/config.js` alimenta esse site e os experimentos. Não alterar por causa do principal. `assets/` está vazia, sem referências e foi mantida na raiz.
- Meta tags no bloco `<!-- SINCRONIZAR COM js/config.js -->`; o `<noscript>` também é sincronizado e conferido por teste.
- Movimento da gota e do derretido (`cena.js`, objeto `ajustes`) foi ajustado à mão e medido: **não mexer** sem pedido do Daniel.
- Teto de JS próprio de `js/`: 50.000 bytes (sem contar as cópias de config, calculadora e pedido); `vendor/` ≤ 160.000. Texto informativo com no mínimo 14 px. Sem `innerHTML` com dados; imagens com `width`, `height` e `alt`; contraste ≥ 4,5:1.
- `index.html` da raiz sem `noindex`; `antigo/index.html` mantém `noindex`, canonical e `og:url` em `/antigo/`. A imagem de compartilhamento foi copiada para `img/og.jpg` na raiz, preservando as URLs de imagem dos dois sites.
- Testes: `testes/novo.test.mjs` (+ os antigos); `node --test testes/` inteiro passando.
- **G8 feita em 04/11/2026:** exceção de CSS autorizada por Daniel no bloco `/* G8: números da conta centralizados. */`: inputs da `.conta` e resultado `.conta-ganho` centralizados; seletor e regras originais preservados. G4-7 aceita somente esse bloco G8 adicional; G8-1 confere suas duas regras exatas. Verificado: 69 testes passando e Playwright em 1280 e 390 px, com 50, 20 e 200 ml → 17,00, sem novas quebras ou transbordo. Capturas: `C:/Users/danda/.codex/visualizations/2026/11/04/01a1a892-b82c-7280-9ecd-3cf8712e0b9a/g8-calculadora-1280.png` e `g8-calculadora-390.png`. Servidor próprio e navegador encerrados; sem commit.
- Ao preparar imagens: os testes contam 1 KB = 1.000 bytes; imagens gravadas pelo Claude na pasta do PC ganham ~5.800 bytes (bloco C2PA): deixar 7.000 bytes de folga e conferir o tamanho final na pasta.
- Publicação: GitHub Pages, branch **`prototipo`**, domínio https://cheirodasaguasgourmet.com.br/ (arquivo `CNAME`). Procedimento (usado em 04/11/2026), com o Git limpo na `prototipo-graza`: `git switch prototipo`; `git tag <marcador>`; `git rm -r -q index.html css js img novo` (na primeira vez; nas próximas, só as pastas do site que mudaram de lugar); `git checkout prototipo-graza -- index.html css js img vendor desenhos antigo .gitignore`; `git status` sem nada solto; commit; `git push origin prototipo`; **`git switch prototipo-graza`**. O `/novo/` deixou de existir. Para desfazer sem apagar histórico: `git revert` + push (a tag marca o estado anterior). O procedimento antigo (`git checkout prototipo-graza -- novo`) é obsoleto.

## Branches

| Branch | O que é |
|---|---|
| `main` | loja antiga, com preços (tag `loja-v1`); guardada, não usar |
| `prototipo` | **publicada** no domínio desde 04/11/2026: site novo na raiz + site antigo em `/antigo/` (só arquivos do site; sem ESTADO.md, AGENTS.md, testes e documentos). Tag `antes-g5` = estado anterior (antigo na raiz + `/novo/`). **Não trabalhar nela**: depois de publicar, voltar sempre para `prototipo-graza` |
| `prototipo-graza` | trabalho local: site principal na raiz e anterior em `antigo/` (G5); tarefas `g*.md`, este arquivo |
| `visual`, `experimento-capitulos` | experimentos antigos; não publicar |

Nota: na `prototipo`, `ESTADO.md`, `brief.md` e `criterios.md` foram apagados. Se um `cherry-pick` der conflito neles: `git rm -f` nos três e `git cherry-pick --continue`.

## Pendente agora (nesta ordem)

1. **Confirmar a publicação** (Daniel): testar o site no ar no celular real e no 4G; mandar o link `cheirodasaguasgourmet.com.br` para si no WhatsApp e ver a prévia (título e imagem); conferir se a calculadora está centralizada no ar (G8 deve ter entrado na publicação; não confirmado).
2. **G9 e G10 commitadas; G12 feita localmente em 11/11/2026, sem commit nem publicação, substituindo a G11.** Execução na `prototipo-graza`, a partir dos arquivos locais da G11 sobre o HEAD `b83a227`. Página separada em `encontre/index.html`, com `noindex`, dados e textos em `encontre/locais.js`, sem link no menu principal nem importação dos módulos de `js/`.
   - **Topo G12:** `galho.svg` decorativo, preservado como recebido, ocupa 60% da janela a partir de 920 px e encosta na borda esquerda; título “Onde encontrar” visível e texto à direita. Abaixo de 920 px, título e texto centralizados acima do galho, com largura de 118vw e recorte pelo próprio contêiner. Toda a página usa Fraunces local, com SOFT 100; título com peso 750 e opsz 144. `mae.svg` permanece guardado para uso futuro.
   - **Animação G12:** cinco escorridos em em nas letras d, e, n, t e r; formas semente, bulbo, pescoço e gota copiadas de `js/cena.js`, sem importar nem alterar esse módulo. Sequência de 2,5 s ao carregar as fontes e a imagem: derreter, formar e soltar, acelerar e esticar, achatar com três respingos, morph para alfinete com quique e sombra na borda superior do mapa. Sem mapa válido ou lista ativa, só os escorridos. Movimento reduzido, ausência de GSAP ou ausência de JS deixam o estado final parado. Redimensionar recalcula a posição sem repetir e, durante a animação, assenta o estado final.
   - **G10 preservada:** oito lugares reais, URL e conteúdo do Google My Maps, estados ES/MG nessa ordem, cartões ordenados por cidade/bairro/nome em 1/2/3 colunas (640/1100 px), ícones de xícara/pacote, pontilhado e frase final do config; lista sem animação. Só GSAP e MorphSVGPlugin locais, sem ScrollTrigger.
   - **Testes:** `node --test testes/`: **83 testes, 83 passando**. G12-1 verifica Fraunces local e ausência de fontes de sistema; G12-2 verifica galho existente/decorativo, mãe preservada e h1 visível. Testes G10/G11 atualizados para título visível, galho, cinco escorridos estáticos e teto novo de 14.000 bytes; G9-1 aceita o mesmo namespace XML C2PA também em galho.svg, sem ampliar a lista de recursos externos. Demais verificações preservadas. JS próprio de `encontre/`: **14.000/14.000 bytes** (encontre.js: 5.283; locais.js: 2.788; movimento.js: 5.929). Contrastes calculados: 11,62:1 no fundo claro, 10,17:1 nos cartões e 15,29:1 no cabeçalho.
   - **Playwright com Edge headless:** 15 cenários/quadros em 390, 920 e 1440 px, sem erros ou avisos do código próprio nem rolagem lateral. Conferidos composição, cinco escorridos ligados às letras, queda, impacto, alfinete e sombra na borda superior, oito cartões e grade 1/2/3. Também verificados movimento reduzido, sem JS, sem GSAP, sem ilustração, mapa inválido, lista vazia e redimensionamento durante/depois da animação. Servidor próprio e navegador encerrados; sem controlar tela, mouse ou janelas do Daniel.
   - **Evidências:** pasta `C:/Users/danda/.codex/visualizations/2026/11/11/01a1cbbd-2577-7ea3-b026-b5a0fcdccf69/`: capturas finais `g12-encontre-390.png` e `g12-encontre-1440.png`; sequência `g12-derreter-1440.png`, `g12-soltar-1440.png`, `g12-impacto-1440.png` e `g12-alfinete-1440.png`; script `g12-verificar.cjs` e medições `g12-verificacao.json`. O iframe do Google continua emitindo avisos internos sobre carregamento/API obsoleta e pode aparecer parcialmente desenhado nas capturas headless; conferir mapa e animação no navegador/celular real. A avaliação visual final é do Daniel.
   - **Publicação futura:** incluir também `encontre` quando Daniel autorizar. G12 não faz commit, push, publicação nem adiciona link no menu ou Instagram. Página principal, `vendor/`, `js/cena.js`, desenhos recebidos e `.gitignore` preservados.
3. **Rótulo do diet**: conferir o verso do rótulo novo (30 g; sem "achocolatado" nem "café solúvel"). Os ingredientes já foram confirmados pelo Daniel em 04/11/2026.
4. **Limpeza** (se o Daniel quiser): apagar `prototipo-graza/`, `prototipo-descida/`, `experimento/` e os documentos antigos da loja. Atenção: os testes G4-1 e G4-7 dependem de `prototipo-graza/`, e o G7-3 consulta o commit `ee5f338`; ao limpar, ajustar esses testes e não reescrever o histórico.

## Fatos do negócio (confirmados pela família)

- Produtos exibidos: **com açúcar** e **sem açúcar**; descafeinado existe no config com `exibir: false`. Varejo: pacote de **250 g**. Quem serve na xícara compra **por kg** (pacote de 1 kg, embalagem ainda não definida; o cartão "por kg" saiu do site até haver foto).
- Ingredientes com açúcar: "Leite em pó integral, bicarbonato de sódio, canela em pó, cacau 100%, açúcar refinado e café Conilon." Sem açúcar: os mesmos, sem o açúcar refinado.
- O diet tem os mesmos ingredientes do com açúcar, sem o açúcar (confirmado pelo Daniel em 04/11/2026).
- Avisos: "Contém leite e derivados. Não contém glúten." Conservação: "Local seco, ventilado e protegido da luz solar." Validade: 365 dias.
- Café Conilon **plantado pela própria família**; cacau 100%, não achocolatado; feito à mão, em casa, sem processo industrial e **sem máquinas**. Não precisa de leite: já vem no pó, o preparo é só com água.
- Entrega pela família na Grande Vitória, sem taxa, de um dia para o outro. Pagamento: Pix, cartão na maquininha na entrega ou dinheiro.
- **Degustação gratuita** antes da primeira venda.
- WhatsApp 5533999096791; Instagram @cheirodasaguasgourmet.
- **Sem preços no site** (`apresentacao.mostrarPrecos: false`).
- Fotos: originais em `fotos-reais/` (fora do Git), todas autorizadas e sem IA. **Davi e Gustavo** (fotos 21 e 22) são os cabeças da empresa: pode mostrar tudo deles. A moça da foto 10 **não é da família** (grupo de influenciadoras): não dizer "família" junto dela. **Não usar:** bebida gelada (fotos 23, 24, 25, 27, 28) e fotos com caneca de outra marca (3, 18 e a parte direita da 6).

## Proibido escrever (vale em tudo)

Premium, melhor, saudável ou benefício de saúde; conservante, aditivo ("sem aditivos" é falso: o bicarbonato é aditivo), natural, orgânico, selos; "achocolatado" ou "café solúvel" como ingrediente (só vale a frase "Cacau 100%, não achocolatado."); região de origem do café, pontuação; marcas concorrentes ou ataques ao industrial. **Pode** dizer que o café é **plantado por nós**.

## Em espera (não é para agora)

- **"Você sabia?"**: volta quando a família trouxer histórias reais (como começou, desde quando); montar junto com Daniel.
- **Parceiros (Doce Minas, ES)**: precisa de autorização, uso do nome/logo, o que eles fazem, cidade e um depoimento; decidir "parceiros" ou "clientes".
- Desenho 11 (fruto com torneira, do ChatGPT) no lugar da torneira provisória (opcional).
- Foto da embalagem de 1 kg (o cartão "por kg" volta).
- Fotos pedidas ao Davi em 30/10 (pais preparando, entrega, pacote no balcão, xícara de louça, cacau e café de perto, verso do pacote, casa e roça).
- Com o contador: o diet usa no site "Sem adição de açúcares e sem adoçantes artificiais" (como no rótulo); confirmar a redação; nota fiscal. **INPI:** risco do nome "Cheiro das Águas". Com a família: prazo de entrega, pedido mínimo, condições para empresas.
- Detalhe técnico anotado: em `cena.js` há o seletor `.vender-cartao`, mas a classe na página é `.venda-cartao` (não mexer sem tarefa).
- Área para empresas (ideia do Davi): link privado + cadastro pelo WhatsApp; login só numa fase 2.
