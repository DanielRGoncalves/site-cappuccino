# G9 — Página "Onde encontrar" (protótipo, em `encontre/`)

> Tarefa para o Codex. Leia antes: `AGENTS.md` e `ESTADO.md`. Onde esta tarefa contradisser outro documento, **esta tarefa prevalece** (aprovada por Daniel em 10/11/2026). Risco: baixo. Chat novo, nome "site-capuccino G9".

## Objetivo

Criar uma página separada, `encontre/index.html`, que mostra onde o cappuccino é servido ou vendido: um mapa do Google My Maps embutido e, abaixo, a lista dos lugares por cidade e bairro. Referência de formato: https://sejabaco.com/encontre/ (mapa em cima, lista embaixo). É um **protótipo para o Davi avaliar**: usa lugares de exemplo e **não será publicado** nesta tarefa.

## Decisões já aprovadas por Daniel (10/11/2026)

- Página separada em `/encontre/`, com o título "Onde encontrar". Não é uma seção da página principal.
- **Exceção autorizada:** esta página pode ter um `<iframe>` do Google My Maps (`https://www.google.com/maps/d/embed?...`) e links `https://www.google.com/maps/search/?api=1&query=...`. Nenhum outro recurso externo (sem script externo, sem CDN, sem fonte externa, sem biblioteca de mapa).
- Diferença em relação à Baco: o endereço aparece escrito na lista, e cada lugar tem um link "Ver no mapa".

## O que criar (tudo dentro de `encontre/`)

| Arquivo | Conteúdo |
|---|---|
| `encontre/index.html` | Estrutura mínima, `lang="pt-BR"`, `<meta name="robots" content="noindex">`, título "Onde encontrar | Cheiro das Águas", canonical `https://cheirodasaguasgourmet.com.br/encontre/`. Sem GSAP. |
| `encontre/locais.js` | **Fonte única** dos dados e textos da página (formato abaixo). |
| `encontre/encontre.js` | Monta a página a partir de `locais.js` com `createElement` e `textContent` (sem `innerHTML`). |
| `encontre/encontre.css` | CSS próprio da página. |

Pode referenciar com `../` somente: `../css/fontes/` (as mesmas fontes locais), `../img/logo.webp` (ícone e logo) e `../index.html` ou `../` (link de volta). Não importe `../js/*.js`.

### Formato de `encontre/locais.js`

```js
export const encontre = {
  titulo: "Onde encontrar",
  texto: "Lugares que servem ou vendem o cappuccino Cheiro das Águas.",
  avisoExemplo: "Página de demonstração: os lugares abaixo são exemplos.",
  mapa: { url: "", titulo: "Mapa dos lugares que trabalham com o cappuccino Cheiro das Águas" },
  etiquetas: { xicara: "Serve na xícara", pacote: "Vende o pacote" },
  verNoMapa: "Ver no mapa",
  voltar: "Voltar ao site",
  locais: [
    { nome: "Padaria Exemplo", cidade: "Vila Velha", bairro: "Praia da Costa",
      endereco: "Rua de exemplo, 100", modalidades: ["xicara", "pacote"],
      mapa: "", exemplo: true, ativo: true },
  ],
};
```

- Preencha 4 lugares de exemplo, todos com `exemplo: true` e nomes claramente fictícios ("Padaria Exemplo", "Cafeteria Exemplo"...), em pelo menos 2 cidades (Vila Velha e Vitória) e 3 bairros. **Não use nome de estabelecimento real.**
- `mapa.url` fica **vazio**: Daniel vai colar o endereço do My Maps depois.

## Comportamento

1. Topo: logo e nome da marca com link de volta para a página principal; `<h1>` com o título; o texto.
2. Se algum lugar ativo tiver `exemplo: true`, mostrar `avisoExemplo` em destaque logo abaixo do título.
3. Mapa: se `mapa.url` começar com `https://www.google.com/maps/d/embed`, criar o `<iframe>` com `title`, `loading="lazy"` e `referrerpolicy="no-referrer-when-downgrade"`, largura total e altura de cerca de 60vh (mínimo 320 px, máximo 560 px). Se estiver vazio ou for outro endereço, **não criar** iframe nem espaço vazio.
4. Lista: só lugares com `ativo: true`; agrupar por cidade (`<h2>`) e bairro (`<h3>`), em ordem alfabética; dentro do bairro, por nome. Cada lugar: nome, endereço, etiquetas das modalidades e o link "Ver no mapa".
5. Link "Ver no mapa": usa `mapa` do lugar, se houver; senão monta `https://www.google.com/maps/search/?api=1&query=` + `encodeURIComponent("nome, endereço, bairro, cidade")`. Abre em nova aba com `rel="noopener"`. Cada link precisa de nome acessível único (ex.: `aria-label` "Ver Padaria Exemplo no mapa").
6. Lista vazia (nenhum ativo): mostrar só uma frase curta ("Em breve, os lugares aparecem aqui.") e nada de mapa.
7. Rodapé: link de volta ao site e os dados legais (copie o texto do rodapé legal da página principal).
8. Sem JavaScript: um `<noscript>` com uma frase e o link de volta.

## Visual

Mesma identidade da página principal: copie de `css/estilo.css` as variáveis de cor e as declarações `@font-face` necessárias (apontando para `../css/fontes/`). Lista simples e legível, sem animação. Texto com no mínimo 14 px; contraste ≥ 4,5:1; foco visível; sem rolagem lateral em 320, 390, 920 e 1440 px. A partir de 920 px a lista pode ficar em 2 colunas.

## O que não muda

Nenhum arquivo fora de `encontre/` e de `testes/encontre.test.mjs`, exceto `ESTADO.md` (ver "Relatório"). Não mexer em `index.html`, `css/`, `js/`, `vendor/`, `antigo/`, protótipos nem nos testes existentes. **Não adicionar link para `/encontre/` no menu da página principal** (fica para quando houver lugares reais).

## Testes (`testes/encontre.test.mjs`, arquivo novo)

1. **G9-1:** `encontre/` não usa `innerHTML`, `outerHTML`, `document.write` nem `eval`; as únicas URLs `http(s)` nos arquivos da pasta são `https://www.google.com/maps/` (iframe e busca), `https://cheirodasaguasgourmet.com.br/` (canonical) e `www.w3.org`; nenhum `<script src>` externo.
2. **G9-2:** caminhos com `../` só para `../css/fontes/`, `../img/logo.webp`, `../index.html` ou `../`; todo arquivo referenciado existe.
3. **G9-3:** a função de agrupar/ordenar (exportada, sem DOM) agrupa por cidade e bairro, ignora `ativo: false` e ordena como descrito.
4. **G9-4:** a função do link (exportada, sem DOM) usa `mapa` do lugar quando existe e, sem ele, gera a URL de busca codificada (testar com acento e vírgula).
5. **G9-5:** a função que valida `mapa.url` aceita só endereços que começam com `https://www.google.com/maps/d/embed` e recusa vazio e qualquer outro.
6. **G9-6:** `encontre/index.html` tem `noindex`, `lang="pt-BR"`, um `<h1>` (ou o ponto de montagem dele) e `<noscript>`.
7. `node --test testes/` inteiro passando (os 69 atuais + os novos).

## Verificação no navegador

Use só navegador **headless** (Playwright), com servidor próprio na raiz do repositório, encerrado ao final. **Não controle a tela, o mouse nem janelas do computador do Daniel.** Em 390 e 1440 px: página sem erro no console, sem rolagem lateral, aviso de exemplo visível, lista agrupada, links "Ver no mapa" com o `href` esperado. Teste também, temporariamente e sem deixar no arquivo, um `mapa.url` válido de exemplo para confirmar que o iframe é criado com o tamanho certo, e a lista vazia. A avaliação visual final é do Daniel.

## Fora do escopo

Commit, push, publicar, mexer na branch `prototipo`, link no menu ou no Instagram, lugares reais, fotos ou logos de estabelecimentos, filtro, busca, GPS, aviso de cookies.

## Relatório final

No formato do `AGENTS.md`: arquivos criados, resultado de cada critério G9-1 a G9-6, total de testes, bytes de cada arquivo de `encontre/` e duas capturas (390 e 1440 px). Atualize o `ESTADO.md`: item 2 de "Pendente agora" passa a registrar as decisões desta tarefa, o estado da G9 e que o procedimento de publicação precisará incluir a pasta `encontre` quando Daniel autorizar publicar.
