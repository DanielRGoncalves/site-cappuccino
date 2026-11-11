# G13 — Ligar o site principal à página "Onde encontrar"

> Tarefa para o Codex. Leia antes: `AGENTS.md`, `ESTADO.md` e `g12-encontre-galho.md`. Onde esta tarefa contradisser outro documento, **esta tarefa prevalece** (aprovada por Daniel em 11/11/2026). Risco: médio (mexe na página principal, que está publicada). Chat novo, nome "site-capuccino G13".

## Objetivo

Deixar explícito, para quem visita o site principal, que existe a página `encontre/` com o mapa dos lugares. A entrada deve parecer **parte do site**: mesmas cores (leite, cacau, ouro e o verde pistache `--folha`), mesmas fontes (Instrument Serif nos títulos, Fraunces na marca), mesmos componentes (`pilula`, `secao-titulo`, desenhos em `desenhos/`) e movimento na medida, como o resto da página. Nada de bloco com cara de colado.

## Escopo

1. **Menu:** em `js/config.js` (`textos.pagina.links`), adicionar `{ texto: "Onde encontrar", href: "encontre/" }` logo antes de "Contato".
2. **Seção-chamada nova**, entre "Como funciona" (`#como`) e o contato:
   - `<section class="encontre-chamada" id="encontre-chamada" aria-labelledby="titulo-encontre-chamada">` no `index.html`, montada em `js/montar.js` como as outras seções.
   - Faixa com fundo verde pistache (`--folha`) e texto cacau (contraste ≥ 4,5:1 medido).
   - O galho de `encontre/galho.svg` entra pela borda esquerda da faixa, menor que na página `encontre/` (decorativo, `alt=""`, `loading="lazy"`), e é cortado pela faixa, sem rolagem lateral.
   - Ao lado (abaixo no celular): título "Onde encontrar" no estilo `secao-titulo`, a frase "Veja os lugares que já servem ou vendem o Cheiro das Águas." e uma `pilula` "Ver no mapa" que leva a `encontre/` (mesma aba).
   - Movimento discreto, uma vez, quando a faixa entra na tela: um alfinete pequeno, desenhado na mesma cor, cai e assenta ao lado do botão (pode usar GSAP/ScrollTrigger, já carregados na página). Com `prefers-reduced-motion`: parado.
   - Todos os textos novos em `js/config.js` (`textos.pagina.encontre`), passando por `js/textos.js`.
3. **Rodapé:** um link discreto "Onde encontrar" (`encontre/`) na linha do rodapé, perto dos dados legais.
4. **`encontre/index.html`:** remover `<meta name="robots" content="noindex">`. A página agora tem dados reais e autorizados, e deve aparecer na busca do Google (canonical já aponta para `/encontre/`). Ajustar os testes G9 que exigem `noindex`, destacando a mudança no relatório.
5. **`ESTADO.md`:** no procedimento de publicação, incluir a pasta `encontre` no `git checkout prototipo-graza -- ...`, e atualizar "Pendente agora".

## Limites

- Não mexer em `js/cena.js` (objeto `ajustes`), na gota principal, nas outras seções nem em `antigo/`.
- JS próprio de `js/` continua ≤ 50.000 bytes (hoje 46.116). Sem `innerHTML`. Imagens com `width`, `height` e `alt`. Texto informativo ≥ 14 px.
- Atualizar o `<noscript>` e as meta tags só se algum teste de sincronização exigir.

## Testes

- **G13-1:** o menu tem "Onde encontrar" → `encontre/`, antes de "Contato".
- **G13-2:** a seção `#encontre-chamada` existe entre `#como` e `#contato`; o botão aponta para `encontre/`; todo texto dela vem do config.
- **G13-3:** o rodapé tem um link para `encontre/`.
- **G13-4:** `encontre/index.html` não tem `noindex`.
- Ajustar testes existentes só se forem afetados legitimamente (ex.: contagem de links do menu), justificando no relatório. `node --test testes/` inteiro passando.

## Verificação

Só navegador **headless**, servidor próprio, encerrado no fim. **Não controle a tela, o mouse nem janelas do Daniel.** Em 390, 920 e 1440 px: sem erro no console, sem rolagem lateral, menu abrindo com o link novo, faixa com contraste ≥ 4,5:1, botão levando a `/encontre/`, alfinete assentando uma vez. Capturas da faixa em 390 e 1440 px. A avaliação visual é do Daniel.

## Fora do escopo

Commit, push, publicar, mexer na página `encontre/` além do `noindex`, mudar a gota ou outras seções.

## Relatório

No formato do `AGENTS.md`, com bytes do JS de `js/`, contraste medido da faixa, total de testes e as capturas.
