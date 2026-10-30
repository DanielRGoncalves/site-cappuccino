# X1 — Experimento de capítulos (protótipo isolado)

> **Este arquivo vale em conjunto com `AGENTS.md`, `p7-qualidade.md` e `p9-visual.md` (só a paleta e as regras de acessibilidade).** Em caso de contradição, **este arquivo vence** e o executor não precisa perguntar. As palavras proibidas do `p7-qualidade.md` continuam proibidas. Execute **só esta tarefa**. Se algo faltar, **pare e pergunte**.
>
> **Exceções declaradas a regras do AGENTS.md (só valem para esta tarefa):**
> 1. Os textos novos do experimento ficam em `experimento/textos.js`, não em `js/config.js`. Todo o resto (marca, contatos, fotos, textos do hero e da origem, WhatsApp) vem de `js/config.js`, **importado e nunca copiado**.
> 2. Uma fonte **hospedada no próprio projeto** (arquivo `.woff2` local) é permitida. Fontes externas, CDNs e bibliotecas continuam proibidos.

## O que é

Um **experimento** para Daniel descobrir, navegando, que direção visual lhe agrada mais do que o site atual. **Não é o site oficial, não é identidade aprovada, não é publicado.** Vive numa pasta nova (`experimento/`), na branch `experimento-capitulos`, e **não altera nenhum arquivo existente**. O site atual continua funcionando em `/index.html`.

A ideia central: **cada assunto é um capítulo**, com atmosfera própria, e a rolagem faz a passagem entre eles. Sem travar a rolagem, sem biblioteca.

## Arquivos (todos novos)

```
experimento/index.html
experimento/experimento.css
experimento/experimento.js     montagem da página, menu, abas, ligação do scroll
experimento/capitulo.js        funções puras (sem DOM): progresso e faixas
experimento/textos.js          textos novos do experimento
experimento/fontes/            fonte local (.woff2) + arquivo de licença
testes/experimento.test.mjs    testes das funções puras
```

Imagens: **só** as que já existem em `img/reais/` e `img/logo.webp`. Não crie nem converta imagens. Caminhos relativos a partir de `experimento/` (`../img/reais/...`, `../js/config.js`).

## Direção experimental (ponto de partida, não decisão)

- **Cores:** as do `p9-visual.md` (`--torra`, `--torra-2`, `--leite`, `--ouro`, `--cacau`, `--folha`). Nenhuma cor nova. O dourado é o fio e os detalhes; nada de terracota, gradiente decorativo ou brilho.
- **Fonte dos títulos:** **Fraunces** (licença OFL), variável, hospedada no projeto. Como obter: em pasta temporária fora do projeto, `npm pack @fontsource-variable/fraunces`, extraia e copie **um** `.woff2` do conjunto "latin" para `experimento/fontes/` (prefira o arquivo com todos os eixos, de nome com `full`; se passar de 200.000 bytes ou não existir, use o de eixo `wght` só), junto do arquivo de licença do pacote. Não adicione `package.json` nem `node_modules` ao projeto. Se não houver rede para isso, **pare e avise** (Daniel baixa a fonte). Texto corrido continua em `system-ui`. Se a fonte não carregar, o fallback é Georgia, e a página tem de continuar boa.
- **Tipografia:** título do hero grande (`clamp(2.6rem, 9vw, 7.5rem)`, linha ~1), peso 300 a 700 conforme o efeito. Sem caixa alta em rótulos, sem palavra destacada em outra cor, sem seta "→" em botões, sem numeração de capítulos.
- **Elemento marcante (só um):** a **moldura em arco** com fio dourado, que já existe no site atual, passa a ser a protagonista: ela **muda de lugar, tamanho e foto durante a rolagem** (capítulo 1 → 2).
- **Atmosferas:** capítulo 1 (hero) escuro `--torra`; capítulo 2 (origem) claro `--leite` com texto `--cacau`; capítulo 3 (duas formas de vender) escuro `--torra-2`. Entre o 2 e o 3 pode haver corte seco, mas com composição diferente (sem repetir o mesmo molde das seções).

## O que construir

### A. Faixa e rodapé do experimento
- Faixa fina no topo: "Experimento visual. Este não é o site oficial." (em `textos.js`). `<meta name="robots" content="noindex">`.
- Rodapé `#contato`: razão social, link do WhatsApp (mensagem geral do config), Instagram e o link "Voltar ao site atual" (`../index.html`).

### B. Menu interativo
- Botão fixo no canto, com **a palavra "Menu"** (vira "Fechar" quando aberto), `aria-expanded` e `aria-controls`.
- Abre um **painel em tela cheia** (`--torra`), revelado por `clip-path` em formato de arco/círculo a partir do botão, **até 700 ms**. Os links entram em sequência (atraso de ~60 ms entre eles), em Fraunces grande.
- Links: Origem (`#origem`), Duas formas de vender (`#vender`), Contato (`#contato`), "Site atual" (`../index.html`). Rótulos em `textos.js`.
- **Acesso fácil ao contato comercial:** dentro do painel, um botão "Pedir degustação gratuita" (WhatsApp, mensagem `config.textos.whatsapp.degustacao`) sempre visível.
- Resposta ao mouse e ao toque: ao passar o mouse ou focar um link, os outros baixam a opacidade (0,45). No toque, o mesmo efeito vale durante o toque.
- Acessibilidade: `Esc` fecha e devolve o foco ao botão; `Tab` fica **preso dentro do painel** enquanto aberto; o resto da página fica `inert`; fechar ao escolher um link; a rolagem do fundo é travada **só enquanto o menu está aberto**.

### C. Capítulo 1 (hero) e a transição para o capítulo 2 (origem)
**Composição do hero:** título (`config.textos.hero.titulo`) em Fraunces grande à esquerda; uma linha de apoio (`textos.js`: "Artesanal e gourmet, feito à mão com café Conilon e cacau 100%."); botão primário "Pedir degustação gratuita" (`config.textos.hero.degustacao`, abre o WhatsApp de degustação) e secundário "Ver as duas formas de vender" (rola até `#vender`). À direita, a foto do hero (`config.apresentacao.hero`) na moldura em arco. **Nenhum texto sobre a foto.**

**Efeito do mouse no título (só desktop):** o título é dividido em letras (`<span>`); o peso de cada letra (`font-variation-settings: "wght"`) varia entre 300 e 700 conforme a distância ao ponteiro (raio ~220 px), suavizado, com `requestAnimationFrame`. Só roda com `(pointer: fine)` e sem `prefers-reduced-motion`. Leitor de tela deve ler o título **uma vez e inteiro** (texto completo no `<h1>`, letras separadas com `aria-hidden="true"`, ou equivalente). No celular não há efeito; o título só aparece com um fade curto (≤ 400 ms) ao carregar.

**A transição (o coração do experimento):** um wrapper de capítulo com altura de **220 vh** e, dentro dele, um palco `position: sticky; top: 0; height: 100svh`. A rolagem é a **natural do navegador** (sem `preventDefault` em `wheel`, `touchmove` ou `scroll`, sem `scroll-snap` obrigatório). Um valor `p` de 0 a 1 (progresso dentro do wrapper) é calculado por uma função pura e gravado numa variável CSS `--p` no palco, com `requestAnimationFrame` e `scroll` com `{ passive: true }`. Com `p`:

| Faixa de `p` | O que acontece |
|---|---|
| 0 → 0,35 | Texto do hero sobe ~40 px e some (opacidade 1 → 0). |
| 0 → 1 | Fundo vai de `--torra` a `--leite` (`color-mix(in srgb, ...)` com `--p`). Cor do texto acompanha (leite → cacau). |
| 0 → 0,7 | O arco da foto se desloca da direita para a esquerda e cresce (de ~440 px para ~46% da largura no desktop; no celular, fica no topo e cresce até ~45 svh de altura). |
| 0,4 → 0,6 | Troca de foto por **crossfade** dentro do arco: `hero-720` → `origem-720`. |
| 0,6 → 1 | Texto da origem (`config.textos.origem.titulo` e `.texto`) entra suave (opacidade + 24 px) do lado oposto ao arco. |

Regra de legibilidade: nenhum texto fica visível (opacidade > 0,2) com contraste abaixo de 4,5:1 contra o fundo em qualquer ponto da rolagem. O texto do hero tem de estar totalmente apagado **antes** de o fundo clarear, e o texto da origem só aparece **depois**.

**Movimento reduzido (`prefers-reduced-motion: reduce`) e sem JS:** sem `sticky` e sem `--p`. Os dois capítulos aparecem empilhados e estáticos (hero escuro, origem clara), sem crossfade nem efeito de mouse.

Funções puras em `capitulo.js` (sem DOM, com testes): `progressoDoCapitulo(topoDoWrapper, alturaDoWrapper, alturaDaJanela)` devolvendo número entre 0 e 1, e `faixa(p, inicio, fim)` devolvendo 0 a 1 limitado. Sem `NaN` com entradas inválidas.

### D. Capítulo 3 — `#vender` ("Duas formas de vender")
- Título "Duas formas de vender" (`textos.js`). Um seletor de **duas abas** (`role="tablist"`, setas, Home e End, como nas abas já existentes; pode reaproveitar `indiceDaAba` de `js/produtos.js`): **"Servir na xícara"** e **"Revender o pacote"**. Abas grandes, em Fraunces, com alvo de toque ≥ 44 px.
- Ao alternar: o título, o texto, a lista curta e a **foto** mudam, com transição curta (≤ 350 ms, opacidade e leve deslocamento). A foto fica numa moldura em arco menor, ecoando o capítulo 1.
- **Conteúdo (só estes textos, sem inventar nada):**
  - Servir na xícara. Foto `img/reais/aroma-720.webp` (alt do config). Frase: "Vendemos por kg para quem prepara e serve na xícara." Lista: "Preparo em 3 passos, só com água quente." / "30 g para cada 100 ml de água fervente."
  - Revender o pacote. Foto `img/reais/produto-sem-800.webp` (alt do config). Frase: "Pacote de 250 g, com açúcar ou sem açúcar." Lista: "Rende cerca de 8 xícaras por pacote." / "Validade de 365 dias." / "Entrega sem taxa na Grande Vitória, de um dia para o outro."
- Dois botões abaixo: "Ver a conta do seu negócio" (`../index.html#padarias`) e "Pedir degustação gratuita" (WhatsApp de degustação). **Sem preços.** Sem calculadora neste experimento.

## O que NÃO fazer

Não altere `index.html`, `css/style.css`, `js/*.js`, `testes/*` existentes nem `img/`. Não adicione bibliotecas, `package.json` ou build. Não use `innerHTML` com dados, `overflow-x: hidden` em `html`/`body`, nem `scroll-snap` obrigatório. Não trave a rolagem (exceto com o menu aberto). Não use `will-change` fora do arco e do painel do menu. Não crie imagens. Não invente fatos, preços, depoimentos ou alegações. Não faça push.

## Critérios

| ID | Critério | Como verificar |
|---|---|---|
| X-01 | Isolamento: só arquivos novos (lista acima). `git status` não mostra nenhum arquivo existente modificado. `/index.html` continua igual. | `git status` e `git diff --name-only`. |
| X-02 | `experimento/index.html` abre pelo Live Server (`127.0.0.1:5500/experimento/index.html`) com 0 erros e 0 avisos no console e nenhum arquivo com erro 404 na aba Rede. | DevTools. |
| X-03 | Menu: abre e fecha com mouse, toque, `Enter`/`Espaço` e `Esc`; foco preso no painel; fundo `inert`; foco volta ao botão; botão de degustação visível no painel; animação ≤ 700 ms; links entram em sequência. | Teste manual com teclado e leitura do código. |
| X-04 | Hero: título do config em Fraunces (ou fallback), uma linha de apoio e dois botões; entende-se o que oferecemos em 5 segundos. Efeito de peso nas letras só com mouse e sem movimento reduzido; leitor de tela lê o título uma vez. | Visual a 360 e 1280 px; leitura do HTML gerado. |
| X-05 | Transição: em `p` = 0, 0,25, 0,5, 0,75 e 1 a página mostra o estado descrito na tabela; arco muda de lugar, tamanho e foto; fundo muda de torra para leite; sem texto ilegível em nenhum ponto; rolagem nunca trava nem "puxa". | Rolar devagar e conferir os 5 pontos; DevTools (variável `--p` visível na aba Elementos). |
| X-06 | Movimento reduzido: com `prefers-reduced-motion` emulado, nada se move, sem `sticky`, capítulos 1 e 2 empilhados e legíveis; menu abre sem deslocamento. | DevTools, "Renderização" > emular `prefers-reduced-motion`. |
| X-07 | `#vender`: as duas abas funcionam com mouse, toque, setas, Home e End; troca texto e foto; textos exatamente os listados; nenhum preço; CTAs levam ao destino certo. | Teste manual. |
| X-08 | A 360, 768 e 1280 px: sem rolagem horizontal; alvos de toque ≥ 44 px; hero e transição funcionam no celular (modo dispositivo do DevTools). | DevTools. |
| X-09 | Desempenho por construção: sem biblioteca; `scroll` com `{ passive: true }` e `requestAnimationFrame`; só `transform`, `opacity`, `clip-path` e variáveis CSS animados; JS do experimento ≤ 20.000 bytes e CSS ≤ 25.000 bytes (sem minificar); fonte ≤ 200.000 bytes. | Leitura do código e `Get-ChildItem`. |
| X-10 | Textos só de `js/config.js` e `experimento/textos.js`; nenhuma palavra proibida do `p7-qualidade.md`; faixa de experimento e `noindex` presentes. | Busca no projeto. |
| X-11 | Testes: `node --test testes/` passa, com os testes existentes **sem alteração** e `testes/experimento.test.mjs` cobrindo `progressoDoCapitulo` (início, meio, fim, fora do intervalo, entradas inválidas) e `faixa`. | Rodar o comando. |
| X-12 | Foco visível em tudo; contraste ≥ 4,5:1 nos textos; todas as `<img>` com `width`, `height` e `alt`. | Tab e DevTools. |

## Avaliação de Daniel (depois da execução)

Nota de 1 a 5 e uma frase para cada: **personalidade** (parece com a nossa história?), **fluidez** (a rolagem e o menu parecem naturais?), **clareza** (entendi o que vendem rápido?), **desempenho** (travou no seu celular?), **mobile** (funcionou bem no toque?). E duas perguntas: o que você mais gostou e o que menos gostou.

## Relatório e commit

Relatório final do `AGENTS.md`, com os critérios X-01 a X-12 (✅ ou ❌ e como verificou), e uma seção "Decisões do executor" para o que foi escolhido sozinho (por exemplo, qual arquivo da fonte). **Branch:** `experimento-capitulos` (criada por Daniel antes). **Commit:** `X1: experimento de capítulos`. Sem push. `git add` por nome de arquivo (`git add experimento` e `git add testes/experimento.test.mjs` são permitidos); **nunca** `git add .` e nunca `fotos-reais/`.
