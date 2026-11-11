# G10 — "Onde encontrar" com vida (layout, marca derretendo, gota-alfinete, ícones)

> Tarefa para o Codex. Leia antes: `AGENTS.md`, `ESTADO.md` e `g9-onde-encontrar.md`. Onde esta tarefa contradisser outro documento, **esta tarefa prevalece** (aprovada por Daniel em 11/11/2026). Risco: baixo. Chat novo, nome "site-capuccino G10". Commit-base: HEAD atual da `prototipo-graza` (G9 já commitada).

## Objetivo

A página `encontre/` funciona, mas está sem vida e com buraco na lista (Vila Velha tem 4 lugares, as outras cidades 1). Deixar a página com a cara da principal (inspirada na Graza), **sem atrapalhar quem só quer achar um lugar**. A ilustração da personagem fica para a G11: aqui só se reserva o espaço.

## Decisões aprovadas por Daniel (11/11/2026)

- **GSAP liberado nesta página**, só as cópias locais `../vendor/gsap.min.js` e `../vendor/MorphSVGPlugin.min.js` (ScrollTrigger não é necessário). Nada de CDN.
- A lista **não** tem animação. Movimento só no topo, uma vez, ao abrir a página.
- Com `prefers-reduced-motion: reduce` ou sem JS: tudo aparece no estado final, parado.

## Escopo (só `encontre/`, `testes/encontre.test.mjs`, `.gitignore` e `ESTADO.md`)

1. **Agrupar por estado.** Em `locais.js`, cada lugar ganha `estado: "ES"` ou `"MG"`, e o objeto ganha `estados: { ES: "Espírito Santo", MG: "Minas Gerais" }`. A lista vira: `<h2>` por estado (ES primeiro, depois MG) e, dentro, uma **grade de cartões** (1 coluna no celular, 2 a partir de ~640 px, 3 a partir de ~1100 px). Cada cartão: linha pequena "Cidade · Bairro", nome, endereço, etiquetas e "Ver no mapa". Ordem dentro do estado: cidade, bairro, nome. Sem buraco visível em 390, 920 e 1440 px.
2. **Marca derretendo no topo.** "Cheiro das Águas" grande (mesma fonte e cor do título da principal) com 4 a 6 escorridos saindo da base das letras, na mesma técnica de `js/cena.js` (escorridos medidos em `em`, filhos das letras). Aqui **não** há gota caindo nem rolagem: ao abrir, os escorridos crescem uma vez (~1,2 s) e param. Não importar nem alterar `js/cena.js`; copiar só o necessário para `encontre/`. Abaixo, o `<h1>` "Onde encontrar" e o texto.
3. **Gota que vira alfinete.** O escorrido mais longo solta uma gota que cai até a borda de cima do mapa e, ao chegar, vira (MorphSVG) um **alfinete de mapa** na mesma cor, que fica parado ali. Decorativo: `aria-hidden="true"`. Se o mapa não existir (url inválida ou lista vazia), não há gota nem alfinete. Sem rolagem lateral em nenhuma largura.
4. **Ícones nas etiquetas.** Xicarinha ao lado de "Serve na xícara" (versão mini e simplificada de `desenhos/09.svg`, copiada para `encontre/`) e um pacotinho simples no mesmo traço ao lado de "Vende o pacote". Ícones com `aria-hidden="true"`; o texto continua.
5. **Frase final.** Depois da lista, centralizada: um pontilhado curto e a frase **"Feito à mão em Taparuba/MG."** (texto em `locais.js`). Sem animação.
6. **Espaço para a ilustração (G11).** `locais.js` ganha `ilustracao: { src: "", alt: "" }`. Com `src` vazio, nada é criado (nem espaço vazio). Com `src` preenchido, mostra a imagem ao lado do título no computador e acima dele no celular, com `width`, `height` e `alt`.
7. **`.gitignore`:** adicionar a linha `Claude outputs/`.

## Limites

- JS próprio de `encontre/` ≤ 12.000 bytes no total. Texto informativo ≥ 14 px, contraste ≥ 4,5:1, foco visível. Sem `innerHTML`.
- Não mexer em `index.html` da raiz, `css/`, `js/`, `vendor/`, `desenhos/`, `antigo/`, protótipos nem nos testes de outras tarefas. Não adicionar link no menu.

## Testes (`testes/encontre.test.mjs`)

- **G9-2** passa a aceitar também `../vendor/gsap.min.js` e `../vendor/MorphSVGPlugin.min.js` (destacar essa mudança no relatório).
- **G10-1:** a função de agrupar (sem DOM) agrupa por estado na ordem ES, MG e ordena cidade, bairro, nome; todo lugar ativo tem `estado` existente em `estados`.
- **G10-2:** `ilustracao.src` vazio → nada é montado (testar a função que decide, sem DOM).
- **G10-3:** `.gitignore` contém `Claude outputs/`.
- `node --test testes/` inteiro passando.

## Verificação

Só navegador **headless** (Playwright), servidor próprio, encerrado no fim. **Não controle a tela, o mouse nem janelas do Daniel.** Em 390 e 1440 px: sem erro no console, sem rolagem lateral, animação termina com o alfinete na borda do mapa, lista em cartões sem buraco. Conferir também com `reducedMotion: "reduce"` (estado final parado). Duas capturas (390 e 1440, já no estado final). A avaliação visual é do Daniel.

## Fora do escopo

Commit, push, publicar, a ilustração da personagem, mudar o mapa do Google, filtro, busca, GPS.

## Relatório

No formato do `AGENTS.md`, com bytes do JS de `encontre/`, total de testes e as capturas. Atualize o item 2 de "Pendente agora" do `ESTADO.md` (G9 commitada com 8 lugares reais e mapa da conta da empresa; G10 feita; G11 = ilustração pendente).
