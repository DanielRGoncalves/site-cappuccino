# G3 — Ritmo da gota, escorridos presos às letras e laterais preenchidas

> Escrita pelo diretor em 03/11/2026, depois do teste de Daniel na G2. Experimento descartável dentro de `prototipo-descida/`. Não é a X5b; não muda o site nem `experimento/`.

## Decidido / observado por Daniel (03/11)

- O derretido da B está no caminho certo, mas:
  1. **a gota desce devagar demais e o título derrete devagar demais**; ao rolar no ritmo normal ele passa do título antes de ver a transformação;
  2. **no celular (360 × 1221, modo dispositivo do F12) os escorridos apareceram acima do título**, soltos, longe das letras;
  3. **sobra muito espaço nas laterais**, principalmente no computador.
- Para as laterais, o diretor mostrou um teste parado a Daniel: **desenho grande encostado na borda e texto ao lado, virado para o centro, alternando os lados**.

## Exceções (as mesmas da G2)

Só dentro de `prototipo-descida/` esta tarefa prevalece sobre o AGENTS.md: usar apenas `vendor/` (GSAP 3.15.0, MorphSVG, GSDevTools), sem CDN, npm, build ou outros plugins. **Teto de JS próprio (sem `vendor/`): 58.000 bytes** (a G2 terminou com 53.702); registre o número final.

## Escopo

### 1. Escorridos presos às letras (só na B) — corrige o problema 2

Diagnóstico do diretor: hoje os escorridos ficam numa camada própria e são posicionados por medidas em pixels (`getBoundingClientRect` + métricas do canvas), calculadas em momentos específicos. Se o título mudar de lugar depois dessa medida (troca do tamanho da janela, modo dispositivo do F12, carregamento de fonte ou de imagem, zoom), os escorridos ficam para trás. O diretor não conseguiu reproduzir no navegador dele, mas a causa possível é essa.

Correção pedida: **cada escorrido passa a ser filho da própria letra** (o `span.letra` com `position: relative`) e é posicionado **por CSS em unidades `em`** (esquerda em % da letra, topo pela linha de base em `em`). Assim ele acompanha a letra em qualquer mudança de layout, sem nenhum cálculo em pixels. A animação continua a mesma (crescer de cima para baixo, soltar gotas). O ponto de contato da gota pode continuar medido, mas **na hora da chegada**.

### 2. Ritmo (só na B) — corrige o problema 1

- **Nascimento mais rápido:** total de **até 0,8 s** (hoje 1,35 s). A gota não pode ficar parada no bico esperando enquanto a pessoa rola.
- **Acompanhar a rolagem sem atraso perceptível:** a suavização atual da descida deixa a gota para trás. Deixe-a mais firme (registre o valor).
- **Queda final por gravidade:** quando o título estiver entrando na metade de baixo da tela, a gota **deixa de seguir a rolagem e cai sozinha** até o topo da letra, acelerando, em cerca de 0,35–0,45 s.
- **Título preso na tela durante o derretido:** o bloco final (título + frase de apoio) fica **fixo na tela (`position: sticky`) por cerca de 60% da altura da tela de rolagem**, enquanto a gota cai e o título derrete. Depois ele segue com a página. Assim, mesmo rolando no ritmo normal, a pessoa vê a transformação inteira.
- **Derretido mais rápido:** do contato até o último escorrido terminar, **até 1,2 s** (hoje passa de 2 s). Ponto de partida: crescimento 0,6 s, atraso 0,04 s por em. As gotas que se soltam podem cair depois disso.
- Tudo continua no objeto de ajustes do topo de `descida-b.js`, com comentário curto.

### 3. Laterais preenchidas (A e B, computador a partir de 920 px) — corrige o problema 3

Ponto de partida, testado parado pelo diretor:

- Em cada parada, **desenho e texto lado a lado**: o desenho fica do lado da borda e o texto do lado do centro, alternando como hoje (galho à direita, cacau à esquerda etc.).
- Desenhos maiores: galho ~560 px, cacau ~400 px, mulher ~360 px, xícara ~460 px. Podem **encostar na borda da tela** (ou passar um pouco dela), **sem criar rolagem lateral** (sem `overflow-x: hidden` em html/body; corte, se precisar, no próprio contêiner da descida).
- Título das paradas maior: ~3rem, `wght 750`, `SOFT 80`, entrelinha 1; texto com até 24ch.
- Paradas com `min-height` por volta de 62svh.
- O corredor do meio por onde a gota passa continua livre: **a gota não encosta em desenho nem texto**.
- **Abaixo de 920 px** o layout do celular continua o da G2 (desenho à esquerda, texto à direita), só conferir que nada piorou.

## Fora do escopo

Não mexer nas formas do nascimento (só no tempo), nos desenhos, nos textos, nas cores, na versão A além do item 3, nos outros capítulos, em `experimento/`, no site, no `ESTADO.md`, no `tarefas.md` nem nos testes. Sem `git add` e sem commit.

## Critérios

| ID | Comportamento esperado | Como verificar |
|---|---|---|
| G3-01 | Escorridos sempre colados à base das letras: em 360 × 1221, 360 × 740, 390 × 844 e 1440 × 900; também depois de **trocar o tamanho da janela de 1440 para 360 antes e depois do derretido**, e com zoom de 125% | Capturas + distância (em px) entre o topo de cada escorrido e a base da sua letra |
| G3-02 | Nascimento ≤ 0,8 s; a gota não fica para trás ao rolar rápido (40 passos de roda em ~1,5 s) | Valor nos ajustes + capturas |
| G3-03 | Queda final por gravidade, independente da rolagem, em 0,35–0,45 s | Valor nos ajustes + sequência de capturas |
| G3-04 | Título e frase ficam fixos na tela enquanto derrete; com rolagem contínua e normal, o derretido termina com o título ainda visível, no computador e em 390 px | Sequência de capturas durante rolagem contínua |
| G3-05 | Do contato ao último escorrido: ≤ 1,2 s | Valores nos ajustes |
| G3-06 | Computador: desenho e texto lado a lado, desenhos nos tamanhos indicados, sem rolagem lateral em 920, 1280 e 1440 px | Medição + capturas |
| G3-07 | A gota não encosta em desenho nem texto em 1440, 1280, 920, 414, 390 e 360 px | Amostras a cada 100 px de rolagem |
| G3-08 | Continuam valendo da G2: nome legível, sem poça, sem risco solto, recolher ao subir, 3 ciclos sem acumular, movimento reduzido parado, barras "nascimento" e "derreter" com `ajuste=1` | Repetir as verificações |
| G3-09 | Com CPU 4× mais lenta, sem quadros acima de 50 ms repetidos durante o derretido, em 1440 e 390 px | Números |
| G3-10 | JS próprio ≤ 58.000 bytes; nenhum erro no console; `node --test testes/` passando; nada fora de `prototipo-descida/` alterado | Números + `git status` |

Se não conseguir verificar no navegador, marque **Não verificado** (o diretor verifica). Não marque como verificado só lendo o código.

## Relatório

Relatório final do AGENTS.md, com os novos valores (tempos, suavização, altura do trecho fixo, tamanhos dos desenhos), os números de G3-09 e G3-10 e os arquivos alterados.

## Depois

Daniel compara. São no máximo duas rodadas de correção desta tarefa.
