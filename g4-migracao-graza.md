# G4 — Migrar o protótipo Graza para uma pasta oficial (`novo/`)

> Tarefa para o Codex. Leia antes: `AGENTS.md`, `ESTADO.md` (seções "Protótipo Graza" e "Cena da gota") e `prototipo-graza/LEIA-ME.md`. Onde esta tarefa contradisser o `AGENTS.md`, **esta tarefa prevalece** (decisões de Daniel de 04/11).

## Objetivo

O protótipo `prototipo-graza/` foi aprovado por Daniel. Ele vira a base do site novo. Esta tarefa **move** o protótipo para uma pasta própria e organizada (`novo/`), com todos os textos vindo do `js/config.js`, testes, meta tags e sem nada de "protótipo". **Não é um redesign**: o resultado visual e o movimento têm que ficar **iguais** ao protótipo.

Por que uma pasta paralela e não trocar o `index.html` da raiz: o site publicado e o experimento continuam funcionando. A troca da raiz é outra tarefa (G5), depois que Daniel e a família aprovarem.

## O que NÃO pode mudar (a parte mais importante)

O movimento foi ajustado à mão e medido. **Copie sem alterar a lógica**:

- `cena.js`: nada além dos caminhos de importação. Nenhum valor do objeto `ajustes` muda (linha, crescer, pescoco, soltar, aproximar, trechoFixo, completar, suavizar, escorridos...). Nenhuma outra linha muda.
- `palco.js` e `capitulo.js`: nada além dos caminhos de importação.
- `conta.js`: só o que for necessário para os caminhos e para ler o config (as contas vêm de `js/calculadora.js`, como hoje).
- `estilo.css`: nenhum valor de tamanho, cor, espaçamento, animação ou seletor muda. Só caminhos (`url(...)`) e o que as regras abaixo mandarem tirar.
- Não "melhore", não reorganize o CSS, não renomeie classes.

Se achar um problema, **anote no relatório**; não corrija.

## Estrutura alvo

```
novo/
  index.html
  css/estilo.css
  js/pagina.js  montar.js  textos.js  cena.js  palco.js  capitulo.js  conta.js
  vendor/gsap.min.js  ScrollTrigger.min.js  MorphSVGPlugin.min.js  LEIA-ME.txt
  fontes/   (só as usadas: Instrument Serif normal e itálico, Fraunces; LICENCAS.txt atualizado, sem Courier Prime)
  desenhos/ (só os usados: 01, 02, 07, 09, 10)
  img/      (contato-600.webp, contato-1200.webp, origem-1440.webp, copiados de experimento/img/)
```

- `prototipo-graza/` e `prototipo-descida/` **não são apagados nem alterados** (Daniel decide depois).
- As fotos que já estão em `img/reais/` continuam sendo lidas de `../img/reais/` (não duplicar).
- Importe o config de `../js/config.js`.
- `js/calculadora.js` e `js/pedido.js` do site são reaproveitados, sem mudança.

## Regras desta tarefa

1. **GSAP é permitido** (decisão de Daniel, 04/11): só as três cópias locais de `vendor/`, **sem CDN**. Acrescente no `AGENTS.md`, em "Escopo", **uma linha** dizendo isso (e nada mais no AGENTS.md). A regra continua proibindo qualquer outra biblioteca.
2. **Teto de JS:** o JS **próprio** de `novo/js/` ≤ 40.000 bytes; `vendor/` à parte (≤ 160.000 bytes no total). Peso da página aberta, sem rolar: ≤ 1,0 MB (sem contar vídeo, não há).
3. **Config único:** nenhum texto visível ao usuário pode ficar escrito só em `novo/js/textos.js`. Mova **todos** os textos novos do `prototipo-graza/textos.js` para o `js/config.js` (por exemplo numa chave `textos.pagina`; o nome fica a seu critério), **com as mesmas palavras**. Isso inclui: faixa de aviso (2 frases), "plim", os links do menu, rótulos de botões, textos do contato (título "Vamos marcar uma degustação?", frase, "Conversar no WhatsApp", "Entrega", "Pagamento", alt da foto), "Ver as duas formas de vender", "Pausar/Retomar animações", "Duas formas de vender", frases dos dois cartões, "Passo", etc. `novo/js/textos.js` só **monta** o objeto a partir do config.
4. **Texto de apoio do hero e frase embaixo do nome grande** já saem do config (`hero.subtitulo` antes dos dois-pontos; `diferenca.destaque`); mantenha assim.
5. **Tirar tudo que é de protótipo:** selo "Protótipo", frase "Protótipo visual. Este não é o site oficial.", link "Site atual" (menu e rodapé), link "Voltar ao site atual" (inclusive no `<noscript>`), título da aba com "protótipo", `title` do selo.
6. **`<head>` do `novo/index.html`:** título, descrição, `og:*` e `twitter:*` iguais ao `config.meta`, dentro do bloco `<!-- SINCRONIZAR COM js/config.js -->` ... `<!-- /SINCRONIZAR -->`. **Mantenha `<meta name="robots" content="noindex">`** por enquanto (será removido na G5, junto com a troca da raiz). Ícone: `../img/logo.webp`.
7. **`<noscript>`:** os textos precisam ser **idênticos** ao config (hero.titulo, hero.subtitulo, degustação, instagram, faixa, entrega, pagamento, dados legais). O bloco já tem o comentário `SINCRONIZAR`; um teste confere.
8. **Acessibilidade:** manter `<button>` com rótulo, `aria-expanded` no menu, foco visível, `alt` e `width`/`height` em toda `<img>` (`loading="lazy"` fora da primeira tela), um único `h1`, menu com `inert` no conteúdo, `prefers-reduced-motion` com o nome já derretido e sem animação (como hoje).
9. **Segurança:** nada de `innerHTML` com dados; links do WhatsApp só com `encodeURIComponent` (como hoje).
10. **Sem `overflow-x: hidden`** em `html`/`body` (o protótipo usa `overflow-x: clip` no `body`; mantenha, e confirme que não há rolagem lateral).
11. **Texto mínimo de 14 px** em todo texto informativo (já corrigido no protótipo; não regredir). Exceção: nada.
12. **Palavras proibidas** (lista do ESTADO.md): premium, melhor, saudável, conservante, aditivo, natural, orgânico, achocolatado (só na frase "Cacau 100%, não achocolatado."), solúvel como ingrediente, "sem aditivos", marcas concorrentes. O teste varre `novo/`.

## Testes (novo arquivo `testes/novo.test.mjs`, `node --test`, sem dependências)

Siga o estilo de `testes/experimento.test.mjs`. Cubra:

1. `novo/js/textos.js` importa o config e **todas** as strings exportadas existem no config (ou são derivadas dele).
2. O `<noscript>` e as meta tags do `novo/index.html` batem com o config.
3. Nenhuma palavra proibida em `novo/` (HTML, JS e CSS, exceto `vendor/`).
4. Toda `<img>` criada em `montar.js` e no HTML tem `width`, `height` e `alt`.
5. Sem `innerHTML`, `outerHTML`, `document.write`, `eval`, URL `http(s)://` externa em `novo/` (exceto `wa.me`, `instagram.com` e `www.w3.org` do SVG e a licença em `vendor/LEIA-ME.txt`).
6. Tamanho do JS próprio ≤ 40.000 bytes; `vendor/` ≤ 160.000 bytes.
7. Os valores do objeto `ajustes` de `novo/js/cena.js` são **iguais** aos de `prototipo-graza/cena.js` (compare o texto do objeto): garante que o movimento não foi mexido.
8. Nenhum `font-size` ou `font:` abaixo de 14px em `novo/css/estilo.css`, exceto o ícone/decoração listados num array de exceções no teste, **com o motivo** (ex.: `.anuncio-selo` já foi removido; se sobrar `.plim` decorativo de 11px, liste e justifique).
9. Todos os arquivos referenciados em `novo/` existem (fontes, desenhos, imagens, vendor).
10. Os testes antigos continuam passando (`node --test testes/`).

## Verificação no navegador (Playwright, se estiver disponível; senão diga "não verificado")

Servir a pasta do site (Live Server ou `python -m http.server`) e abrir `novo/index.html`. Em 320, 360, 390, 768, 920, 1024, 1440 e 1920 px de largura:

- **N-01** sem rolagem lateral (`scrollWidth - innerWidth = 0`), também com JavaScript desligado;
- **N-02** console sem erros nem avisos;
- **N-03** movimento reduzido: nenhuma animação rodando, nome derretido, sem título preso;
- **N-04** com JS desligado aparece a versão curta (título, botões, faixa, entrega, pagamento, foto);
- **N-05** menu abre, foco vai ao primeiro link, Esc fecha e devolve o foco ao botão; "Pausar animações" pausa a faixa;
- **N-06** a página abre sem 404 (`network` sem falhas);
- **N-07** compare capturas de tela de `prototipo-graza/` e `novo/` nas larguras 1440 e 390 (topo, cena da gota, produtos, vender, preparo, contato): devem ser **visualmente iguais**, exceto o selo/aviso removidos e o texto do rodapé. Diferença visível = falha.

**Verificação humana (anote, não declare ✅):** fluidez da gota e do derretido no celular real; peso no 4G; se a versão sem JavaScript mantém a cara do site. O diretor mede a gota (corredor sem tocar em nada, derretido 100% antes de soltar, quadros ≤ 50 ms com CPU 4×) depois da sua entrega.

## Fora do escopo (anote, não faça)

- Trocar o `index.html` da raiz, `CNAME`, branches ou publicar.
- Remover o `noindex`.
- Cartão "por kg" e "Você sabia?" (saíram; voltam em outra tarefa).
- Desenho 11 (fruto com torneira): a torneira provisória fica.
- Apagar `experimento/`, `prototipo-descida/`, `prototipo-graza/`.
- Mudar `js/config.js` além de **acrescentar** os textos novos (não altere textos existentes, preços nem `produtos`).
- Fazer commit (Daniel faz).

## Relatório final (formato do AGENTS.md)

1. Arquivos criados/alterados, uma linha cada.
2. Critérios: N-01 a N-07 e cada teste (1 a 10), ✅ ou ❌ e **como verificou**.
3. O que precisa de verificação humana.
4. Pendências e problemas fora do escopo.
5. O que **não** fez e por quê.
6. **Lista de strings movidas para o config** (chave nova → texto), para o diretor conferir uma por uma.
