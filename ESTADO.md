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
2. **G9 — "Onde encontrar": protótipo concluído localmente em 10/11/2026**, para avaliação do Davi, sem commit nem publicação. Decisões aprovadas por Daniel: página separada em `encontre/index.html`, com `noindex`, mesma identidade visual e sem link no menu principal; dados e textos próprios em `encontre/locais.js`, sem importar os módulos da raiz. Exceção autorizada somente para iframe do Google My Maps (`https://www.google.com/maps/d/embed`) e links de busca no Google Maps, sem biblioteca de mapa, CDN ou script externo.
   - Quatro lugares claramente fictícios, todos com `exemplo: true`, em Vila Velha e Vitória, distribuídos por três bairros; aviso de demonstração em destaque. Lista alfabética por cidade, bairro e nome, endereço escrito, etiquetas de xícara/pacote e links "Ver no mapa". `mapa.url` permanece vazio: não há iframe nem espaço reservado até Daniel colar a URL. Referência de formato: https://sejabaco.com/encontre/ . Lista vazia mostra apenas a frase prevista, sem mapa.
   - Verificado: **75 testes passando** (`node --test testes/`, 69 anteriores + 6 novos G9-1 a G9-6), sem alterar testes existentes nem critérios. Playwright exclusivamente headless em 320, 390, 920 e 1440 px: sem erros no console ou rolagem lateral, fontes a partir de 14 px, contraste mínimo 10,16:1 e foco visível. Conferidos agrupamento, links, dados legais, versão sem JS, mapa inválido, inativos e lista vazia. Iframe válido testado só em memória, com resposta externa simulada: largura total, alturas mínima de 320 px e máxima de 560 px e atributos exigidos; o funcionamento de um mapa real depende da URL definitiva. Capturas: `C:/Users/danda/.codex/visualizations/2026/11/10/01a1c70f-318b-7051-9cee-8a03432cb6a3/g9-encontre-390.png` e `g9-encontre-1440.png`. Servidor próprio e navegador encerrados.
   - **Pendente com Davi/Daniel:** avaliação visual e teste no celular real; lugares reais e autorizações; URL do My Maps. O Davi liberou mostrar os lugares e vai mandar os dados; foi pedido a ele: nome do lugar, endereço comercial completo, se serve na xícara ou vende o pacote, sabor (com açúcar/diet), Instagram, se os donos autorizaram nome, endereço e logo, quantos lugares são. Ainda sem resposta. Só endereço comercial; sem superlativos nem depoimento inventado. A página principal e seu limite de JS permanecem intactos (46.116 de 50.000 bytes).
   - **Publicação futura:** o procedimento de publicação precisará incluir também a pasta `encontre` quando Daniel autorizar publicar. Esta tarefa não publica o protótipo, não troca de branch e não adiciona link no menu ou Instagram.
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
