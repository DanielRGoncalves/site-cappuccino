# G11 — Desenho vira o título; gota sai da xícara

> Tarefa para o Codex. Leia antes: `AGENTS.md`, `ESTADO.md` e `g10-encontre-vida.md`. Onde esta tarefa contradisser outro documento, **esta tarefa prevalece** (aprovada por Daniel em 11/11/2026). Risco: baixo. Chat novo, nome "site-capuccino G11".

## Por quê

Na G10 o topo ficou com três títulos disputando o mesmo lugar: a marca grande derretendo, o `<h1>` "Onde encontrar" e o desenho `encontre/mae.svg`, que já traz "ONDE ENCONTRAR" escrito. Além disso, o escorrido do "C" ficou fora da letra. Decisão: **o desenho é o título**, e a gota nasce da xícara da personagem.

## Escopo (só `encontre/`, `testes/encontre.test.mjs` e `ESTADO.md`)

1. **Tirar a marca grande derretendo** (`#marca` e os escorridos do `index.html`, junto com o código que a anima). A marca continua só na barra do topo, como já está.
2. **Topo em uma coluna, centralizado:** primeiro o desenho (`mae.svg`), com largura de cerca de `min(88vw, 460px)`; abaixo dele, o texto "Lugares que servem ou vendem…" centralizado; depois o mapa. O mesmo vale para o celular e o computador.
3. **O `<h1>` "Onde encontrar" continua no HTML, mas escondido visualmente** (classe de "somente leitor de tela", sem `display:none`). Como o desenho já é o título visível, o `alt` dele fica `""` (decorativo), para o texto não ser lido duas vezes. Atualizar `ilustracao.alt` em `locais.js`.
4. **Gota da xícara:** a gota nasce na xícara do desenho, cai até a borda de cima do mapa e vira o alfinete (mesmo MorphSVG da G10). O ponto de partida fica numa constante em `movimento.js`, em frações da caixa do desenho: `origem: { x: 0.55, y: 0.42 }` (valor inicial; ajustar até a gota sair do fundo da xícara em 390 e 1440 px). A gota fica numa camada `aria-hidden="true"` posicionada sobre o desenho e o mapa, sem causar rolagem lateral. A animação acontece uma vez, quando a imagem termina de carregar. Com `prefers-reduced-motion` ou sem JS, o alfinete aparece parado na borda do mapa. Sem mapa válido, não há gota nem alfinete.
5. **Sem desenho** (`ilustracao.src` vazio): o `<h1>` volta a aparecer normalmente e não há gota (o alfinete aparece parado, se houver mapa).
6. Manter tudo o que a G10 já faz na lista, nos cartões, nos ícones e na frase final.

## Testes

- Ajustar o teste G10 do "letreiro final" para a nova estrutura (sem marca grande) e destacar a mudança no relatório. Não enfraquecer os demais.
- **G11-1:** `index.html` não tem mais `#marca` nem `.derretido`; tem exatamente um `<h1>`.
- **G11-2:** com ilustração, o `<h1>` recebe a classe de leitor de tela e a imagem tem `alt=""`; sem ilustração, o `<h1>` fica visível (testar a função que decide, sem DOM).
- JS próprio de `encontre/` ≤ 12.000 bytes. `node --test testes/` inteiro passando.

## Verificação

Só navegador **headless**, servidor próprio, encerrado no fim. **Não controle a tela, o mouse nem janelas do Daniel.** Em 390 e 1440 px: sem erro no console, sem rolagem lateral, gota saindo da xícara e alfinete na borda do mapa, um único título visível. Duas capturas no estado final. A avaliação visual é do Daniel.

## Fora do escopo

Commit, push, publicar, mudar o desenho, a lista ou o mapa do Google.

## Relatório

No formato do `AGENTS.md`, com bytes do JS de `encontre/`, total de testes, o valor final de `origem` e as capturas. Atualize o item 2 de "Pendente agora" do `ESTADO.md`.
