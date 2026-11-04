# ESTADO do projeto — leia primeiro

> Arquivo de contexto para qualquer chat novo (Claude ou Codex). Diz onde o projeto está e **o que falta agora**. O histórico (tarefas P1–P11, experimento X1–X5, tentativas da cena da gota, protótipos G4/G6/G7) está no Git: `git log -- ESTADO.md` e os arquivos `p*.md`, `x*.md`, `g*.md`. **Não é uma tarefa.** Atualizar ao fim de cada tarefa.
>
> Última atualização: 04/11/2026. **Daniel aprovou o site novo** (pasta `novo/`, publicada para teste em `/novo/`). Falta só trocar o rótulo do sem açúcar e depois fazer o novo virar o principal (G5).

## O que é

Site de apresentação do **Cheiro das Águas** (Agropecuária Cheiro das Águas Ltda., CNPJ 57.813.645/0001-60), cappuccino artesanal e gourmet feito à mão pela família em Taparuba/MG. Público: **negócios** da Grande Vitória (padarias, cafeterias, restaurantes etc.; o texto fala com "o seu negócio"). O site **apresenta**; preço e negociação são pelo WhatsApp/Instagram.

## Como trabalhamos

- **Claude** = diretor/revisor: planeja, escreve as tarefas com critérios, revisa lendo os arquivos e mede no navegador. Não faz commit nem push.
- **Codex** = executor: edita, roda `node --test testes/`. Um chat novo por tarefa, com nome "site-capuccino" + código (ex.: "site-capuccino G5"). Modelos: **GPT-6.1 Sol, esforço médio** = tarefas com lógica, layout ou imagens; **GPT-6.1 Terra, esforço médio** = tarefas pequenas e bem especificadas; **Sol alto** só se o mesmo critério falhar duas vezes. O Codex **não faz commit**.
- **Daniel** confere no **Live Server do VS Code** (VS Code aberto dentro de `site-cappuccino`; botão direito no `index.html` > "Open with Live Server"), testa no celular e faz commit e push. Página nova: `127.0.0.1:5500/novo/index.html`. Se a porta 5500 abrir outro projeto, fechar todas as janelas do VS Code e reabrir só esta pasta.
- Git Bash: `cd /e/cheiro-das-aguas/site-cappuccino`; um comando por linha; `git add` por nome de arquivo (nunca `git add .`); **o diretor só lista arquivos para o `git add` depois de ver o `git status` do Daniel**. Depois de cada tarefa: `git status`, `git log --oneline -3`, `node --test testes/`.

## Técnica (site novo, pasta `novo/`)

- Site estático: HTML, CSS e JS (módulos), sem backend e sem build. Única biblioteca permitida: **GSAP** (gsap, ScrollTrigger, MorphSVGPlugin), cópia local em `novo/vendor/`, sem CDN.
- `novo/` é **independente**: tem o próprio `js/config.js` (fonte única de textos do `novo/`, inclusive `textos.pagina`), `calculadora.js`, `pedido.js`, `img/` (com `img/reais/`), fontes, desenhos e vendor. Nenhum caminho com `../`.
- O `js/config.js` da raiz alimenta o site antigo e o `experimento/`; não mexer nele por causa do `novo/`.
- Meta tags no bloco `<!-- SINCRONIZAR COM js/config.js -->`; o `<noscript>` também é sincronizado e conferido por teste.
- Movimento da gota e do derretido (`cena.js`, objeto `ajustes`) foi ajustado à mão e medido: **não mexer** sem pedido do Daniel.
- Teto de JS próprio de `novo/js/`: 50.000 bytes (sem contar as cópias de config, calculadora e pedido); `vendor/` ≤ 160.000. Texto informativo com no mínimo 14 px. Sem `innerHTML` com dados; imagens com `width`, `height` e `alt`; contraste ≥ 4,5:1.
- `novo/index.html` ainda tem `<meta name="robots" content="noindex">` (sai na G5).
- Testes: `testes/novo.test.mjs` (+ os antigos); `node --test testes/` inteiro passando.
- Publicação: GitHub Pages, branch **`prototipo`**, domínio https://cheirodasaguasgourmet.com.br/ (arquivo `CNAME`). Para atualizar o `/novo/`: `git switch prototipo`, `git checkout prototipo-graza -- novo`, commit, `git push origin prototipo`.

## Branches

| Branch | O que é |
|---|---|
| `main` | loja antiga, com preços (tag `loja-v1`); guardada, não usar |
| `prototipo` | **publicada** no domínio: site antigo na raiz + página nova em `/novo/` |
| `prototipo-graza` | onde o site novo é trabalhado (`novo/`, tarefas `g*.md`, este arquivo) |
| `visual`, `experimento-capitulos` | experimentos antigos; não publicar |

Nota: na `prototipo`, `ESTADO.md`, `brief.md` e `criterios.md` foram apagados. Se um `cherry-pick` der conflito neles: `git rm -f` nos três e `git cherry-pick --continue`.

## Pendente agora (nesta ordem)

1. **Rótulo novo do sem açúcar** (Daniel faz antes do novo virar o principal).
   - Trocar as fotos do pacote sem açúcar: no `novo/js/config.js`, produto `id: "sem-acucar"` usa `img/reais/produto-sem-800.webp` e `produto-sem-400.webp` (manter nomes e proporção, ou atualizar `largura`/`altura` no config).
   - Conferir se outras fotos da página mostram o rótulo antigo do sem açúcar (hero, paradas da gota, preparo, "abrindo", "bule", "equipe") e trocar as que mostrarem.
   - Com o rótulo novo: decidir com Daniel se o selo "Sem açúcar" vira **"diet"** (o sem açúcar tem aprovação para ser chamado de diet; ficou combinado trocar quando chegasse a embalagem nova) e conferir se o rótulo novo já corrige os pontos abaixo (achocolatado, café solúvel, 35 g → 30 g).
   - Ao preparar imagens: os testes contam 1 KB = 1.000 bytes; imagens gravadas pelo Claude na pasta do PC ganham ~5.800 bytes (bloco C2PA): deixar 7.000 bytes de folga e conferir o tamanho final na pasta.
2. **G5 — o novo vira o principal** (tarefa a escrever; Codex GPT-6.1 Terra, esforço médio).
   - Mover o site antigo (raiz: `index.html`, `css/`, `js/`, `img/`) para `/antigo/`, com `noindex`.
   - Mover o `novo/` para a raiz; garantir `img/og.jpg` na raiz; **tirar o `noindex`**; conferir `canonical` e `og:*`; testes ajustados.
   - Antes de escrever, confirmar com Daniel: (a) a família aprovou; (b) aceita perder a seção "Dúvidas" (saiu do `novo/`).
   - Depois de publicar: testar no celular real e no 4G.

## Fatos do negócio (confirmados pela família)

- Produtos exibidos: **com açúcar** e **sem açúcar**; descafeinado existe no config com `exibir: false`. Varejo: pacote de **250 g**. Quem serve na xícara compra **por kg** (pacote de 1 kg, embalagem ainda não definida; o cartão "por kg" saiu do site até haver foto).
- Ingredientes com açúcar: "Leite em pó integral, bicarbonato de sódio, canela em pó, cacau 100%, açúcar refinado e café Conilon." Sem açúcar: os mesmos, sem o açúcar refinado.
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
- Com o contador: "sem açúcar" ou "sem adição de açúcar"; nota fiscal. **INPI:** risco do nome "Cheiro das Águas". Com a família: prazo de entrega, pedido mínimo, condições para empresas.
- Detalhe técnico anotado: em `cena.js` há o seletor `.vender-cartao`, mas a classe na página é `.venda-cartao` (não mexer sem tarefa).
- Área para empresas (ideia do Davi): link privado + cadastro pelo WhatsApp; login só numa fase 2.
- Depois da G5: apagar `prototipo-graza/`, `prototipo-descida/` e `experimento/` e os documentos antigos da loja (`brief.md`, `tarefas.md`, `criterios.md`), se Daniel quiser.
