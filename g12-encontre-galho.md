# G12 — Topo com o galho, título derretendo e gota que vira alfinete (com qualidade)

> Tarefa para o Codex. Leia antes: `AGENTS.md`, `ESTADO.md`, `g10-encontre-vida.md` e `g11-encontre-desenho-titulo.md`. A G11 está **sem commit** no disco: parta do estado atual dos arquivos e preserve o que servir. Onde esta tarefa contradisser outro documento, **esta tarefa prevalece** (aprovada por Daniel em 11/11/2026). Risco: médio (animação). Chat novo, nome "site-capuccino G12".

## Por quê

O desenho vertical (`mae.svg`) ficou "jogado" no topo. Daniel quer um topo que preencha a tela e chame atenção, como o galho da Graza, e uma animação **de qualidade** em que a localização "caia" de algo que derrete. Também não quer a fonte de sistema (parece Arial) nesta página: quer algo aconchegante, "de chocolate", como a marca do site principal.

## Decisões

- **Desenho do topo:** `encontre/galho.svg` (já está na pasta; Claude vetorizou). O galho de café entra pela borda esquerda e a personagem (a mãe de Daniel) está sentada num fruto, com a xícara. O desenho é decorativo (`alt=""` / `aria-hidden`). `mae.svg` sai do topo, mas **o arquivo fica** na pasta para uso futuro. `ilustracao.src` passa a ser `"galho.svg"`.
- **Título visível de novo:** o `<h1>` "Onde encontrar" volta a aparecer (sem a classe de leitor de tela da G11) e é ele que derrete.
- **Fonte:** em toda a página `encontre/`, usar só **Fraunces** (cópia local `../css/fontes/`), sem `system-ui`/Arial. Título: `font-variation-settings: "wght" 750, "SOFT" 100, "opsz" 144`, como a marca da principal (`.sem-js-marca` e `.marca .letra` em `css/estilo.css`). Texto corrido e cartões: Fraunces com `"SOFT" 100` e `opsz` baixo, peso 400 a 600, mínimo 16 px no texto corrido e 14 px nas etiquetas. Instrument Serif pode ser usada em detalhes, se combinar.

## Composição

- **A partir de 920 px:** faixa de topo com o galho encostado na **borda esquerda da janela** (sai do container até a borda; largura de cerca de 58 a 62% da janela), e no espaço livre da direita o título derretendo, com o texto curto embaixo, alinhados à esquerda e verticalmente centralizados em relação ao desenho. O mapa vem logo abaixo, e a gota cai do título até a borda de cima do mapa.
- **Abaixo de 920 px:** título e texto centralizados em cima; o galho embaixo, encostado na borda esquerda e um pouco maior que a tela, cortado à direita pelo próprio contêiner (sem rolagem lateral e sem `overflow-x: hidden` em `html`/`body`). A gota cai do título, passa à frente do desenho e chega ao mapa.

## Animação (uma vez, ao carregar; GSAP + MorphSVG locais)

Copie de `js/cena.js` (sem importar nem alterar o arquivo) as formas da gota (`semente`, `bulbo`, `pescoco`, `gota`) e a técnica dos escorridos medidos em `em`. Sequência, com cerca de 2,5 s no total:

1. **Derreter:** depois de ~0,3 s, a base de 4 ou 5 letras do título cede e os escorridos crescem (ease suave, ~0,9 s). Os escorridos ficam **dentro do traço da letra**: nascem de um ponto da base que tenha tinta (evitar curvas abertas, como a do "C" na G10, em que o escorrido saiu da letra e parecia um "Ç").
2. **Formar a gota:** no escorrido mais longo (o que fica acima do ponto de queda), a ponta incha (`semente` → `bulbo` → `pescoco`), o pescoço afina e a gota se solta; o escorrido recua um pouco depois de soltar.
3. **Cair:** queda com aceleração (ease `power2.in`), esticando na vertical conforme a velocidade (até ~1,25× de altura e ~0,85× de largura).
4. **Impacto:** na borda do mapa, a gota achata (~0,08 s), solta 2 ou 3 respingos pequenos que caem e somem, e então se transforma (MorphSVG) no **alfinete**, que sobe com um leve quique (`back.out`) e assenta, com uma pequena sombra oval embaixo.
5. **Estado final:** título com os escorridos parados e alfinete na borda do mapa.

Sem mapa válido: os escorridos acontecem, mas não há gota nem alfinete. Com `prefers-reduced-motion` ou sem JS: tudo parado no estado final. Tudo decorativo com `aria-hidden="true"`. Recalcular as posições ao redimensionar a janela, sem repetir a animação.

## Limites

- Só `encontre/`, `testes/encontre.test.mjs` e `ESTADO.md`. Não mexer na página principal, em `vendor/` nem em `js/cena.js`.
- JS próprio de `encontre/` ≤ **14.000 bytes** (limite novo; atualizar o teste). Contraste ≥ 4,5:1, foco visível, sem `innerHTML`.
- Lista, cartões, ícones, frase final e mapa do Google continuam como na G10.

## Testes

- Ajustar os testes G10/G11 afetados (título visível, `galho.svg`, limite de 14.000) e destacar as mudanças no relatório. Não enfraquecer os demais.
- **G12-1:** nenhum CSS de `encontre/` usa `system-ui`, `Arial`, `Roboto`, `Segoe UI` nem `sans-serif`.
- **G12-2:** `ilustracao.src` é `galho.svg`, o arquivo existe e a imagem é decorativa; o `<h1>` não tem classe de leitor de tela.
- `node --test testes/` inteiro passando.

## Verificação

Só navegador **headless**, servidor próprio, encerrado no fim. **Não controle a tela, o mouse nem janelas do Daniel.** Em 390, 920 e 1440 px: sem erro no console do código próprio, sem rolagem lateral, galho encostado na borda esquerda, escorridos dentro das letras, gota saindo do título e alfinete na borda do mapa. Capturas do estado final em 390 e 1440 px e uma sequência de 4 quadros da animação em 1440 px (derreter, soltar, impacto, alfinete). A avaliação final é do Daniel.

## Fora do escopo

Commit, push, publicar, mudar o desenho, a lista ou o mapa do Google, apagar `mae.svg`.

## Relatório

No formato do `AGENTS.md`, com bytes do JS de `encontre/`, total de testes e as capturas. Atualize o item 2 de "Pendente agora" do `ESTADO.md` (G11 substituída pela G12; `mae.svg` guardado para uso futuro).
