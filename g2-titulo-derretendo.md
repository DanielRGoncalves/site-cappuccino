# G2 — Título que derrete e paradas maiores

> Escrita pelo diretor em 03/11/2026, depois da comparação de Daniel na G1. Experimento descartável dentro de `prototipo-descida/`. Não é a X5b, não muda o site nem a pasta `experimento/`.

## O que já está decidido

- **G1 encerrada.** Daniel achou a B melhor, mas quer **o café derretendo nas letras**, e não uma poça em cima do título. Também achou que sobra muito espaço vazio.
- Daniel aprovou em 03/11, a partir de testes parados do diretor:
  1. o **título numa linha só, largo**;
  2. **desenhos maiores e paradas mais juntas**.
- O **nascimento da gota da B** (G1) ficou bom: **não mexa nele**.

## Exceções (as mesmas da G1, com teto novo)

Esta tarefa **prevalece sobre o AGENTS.md** só dentro de `prototipo-descida/`:

1. **Biblioteca:** use apenas `vendor/` (GSAP 3.15.0, MorphSVG, GSDevTools). Sem CDN, npm, build ou outros plugins.
2. **Teto de JS próprio do protótipo (sem `vendor/`):** até **55.000 bytes** (a G1 terminou com 49.907). Registre o número final.

O resto do AGENTS.md vale. Se achar contradição, pare e pergunte.

## Por que a poça não funcionou (para guiar a solução)

O café e as letras têm a mesma cor (`#3B2618`). Café em cima da letra se mistura com ela e só aparece o que sobra para fora, como uma poça. Para parecer **derretendo**, quem muda é a **forma da letra**: a base "cede" e dela saem **escorridos** que descem e soltam gotas, como no "GRAZA" da Graza (letras grossas que pingam por baixo).

## Escopo

### Comum às versões A e B

1. **Título numa linha, largo.**
   - A partir de 920 px, "Cheiro das Águas" fica numa linha só e ocupa cerca de 85–90% da largura do conteúdo. Ponto de partida, que o diretor testou: `font-size: min(9.6vw, 150px)`, `letter-spacing: -.05em`, `line-height: .95`.
   - Abaixo de 920 px, pode quebrar em duas linhas, mas **só entre palavras**.
   - Mantenha o peso e a suavidade da G1 (`wght 750`, `SOFT 80`).
   - A frase de apoio fica abaixo com espaço suficiente para o escorrido mais comprido não encostar nela.
2. **Paradas maiores e mais juntas.**
   - No computador, ponto de partida testado pelo diretor:
     - `.parada { min-height: 56svh }`;
     - larguras dos desenhos: galho 460 px, cacau 320 px, mulher 300 px, xícara 380 px;
     - título das paradas em Fraunces mais grossa (por volta de `wght 700`, ~2,4rem);
     - texto das paradas com até 30ch.
   - No celular, os desenhos crescem dentro do layout atual (desenho à esquerda, texto à direita) e o espaço entre paradas diminui (hoje é `padding-bottom: 18svh`).
   - A gota continua passando entre as colunas **sem cobrir desenho nem texto** (confira isso no computador e em 390 px).

### Só na B: trocar a batida pelo derretido

3. **Contato:** a gota chega ao topo da letra atingida, achata rapidamente e **se funde à letra**. Ela não deixa tampa nem poça em cima. Os respingos da G1 podem continuar, pequenos.
4. **Escorridos:**
   - Saem da **base** das letras, com a parte de cima alargada e colada à letra, um pescoço e uma gota redonda na ponta. Cor `#3B2618`.
   - Ficam em **6 a 8 letras**, não em todas, com comprimentos variados (cerca de 0,15 a 0,6 em). Prefira posições sob as hastes.
   - A lista fica num objeto de ajustes no topo do arquivo: `[letra, posição na letra de 0 a 1, comprimento em em, largura em em]`.
5. **Animação "derreter"** (linha do tempo por tempo, disparada na chegada da gota):
   - O derretido **começa na letra atingida** e se espalha para as vizinhas, com atraso pela distância.
   - Cada escorrido cresce de cima para baixo, devagar no começo e acelerando, como coisa pesada.
   - Dois ou três dos mais compridos **soltam uma gota** que cai com aceleração e some antes de encostar na frase de apoio.
   - Tempos, atrasos e comprimentos ficam no objeto de ajustes, com comentário curto em português.
6. **Efeito de líquido (filtro gooey):**
   - Use **só a partir de 920 px**, aplicado ao título inteiro (letras + escorridos), para os escorridos se fundirem às letras.
   - A força deve ser proporcional ao tamanho da fonte (cerca de 0,03–0,04 em), sem deixar o nome ilegível.
   - **Abaixo de 920 px, não use o filtro** (o diretor testou: ele estraga as letras no celular). Lá ficam só os escorridos.
   - Se o filtro fizer o G2-10 falhar, aplique-o só ao estado final (sem animar por baixo dele) ou remova-o, e registre o que fez.
7. **Estado final:** os escorridos **ficam** depois da animação.
   - Ao rolar de volta para cima do ponto de chegada, eles se recolhem (crescem ao contrário) em cerca de 0,3 s.
   - Ao descer de novo, repetem sem acumular elementos.
8. **Movimento reduzido:** mostrar o título **já derretido, parado** (estado final, sem animação).
   - "Pausar animações": congelar onde estiver.
9. **Ajuste:** com `?versao=b&ajuste=1`, as barras do GSDevTools passam a ser "nascimento" e **"derreter"** (no lugar de "batida").

## Fora do escopo

- Não mexer no nascimento da gota, no meio da descida, nos textos, nas cores, nos outros capítulos, em `experimento/`, no site, no `ESTADO.md`, no `tarefas.md` nem nos testes.
- A versão A continua com a batida dela. Ela só recebe os ajustes comuns.
- Sem `git add` e sem commit.

## Critérios

| ID | Comportamento esperado | Como verificar |
|---|---|---|
| G2-01 | A partir de 920 px (920, 1280, 1440), o título fica numa linha ocupando ~85–90% da largura do conteúdo; abaixo disso (320, 360, 390, 414, 768), nunca quebra no meio de palavra; sem rolagem lateral, em A e B | Medição por largura |
| G2-02 | Desenhos maiores e paradas mais juntas no computador e no celular; a gota não cobre desenho nem texto em 1440 e 390 px | Capturas durante a descida |
| G2-03 | B: na chegada não aparece poça nem tampa em cima da letra | Sequência de capturas do contato |
| G2-04 | B: os escorridos crescem a partir da letra atingida e se espalham para as vizinhas; 2 ou 3 soltam gota | Sequência de capturas a cada ~150 ms |
| G2-05 | "Cheiro das Águas" legível em todos os quadros e no final; nenhum escorrido encosta na frase de apoio | Capturas em 1440 e 390 px |
| G2-06 | Filtro de líquido ativo só a partir de 920 px | Estilo calculado do título em 1440 e 390 px |
| G2-07 | Escorridos ficam depois de 3 s; recolhem ao subir; 3 ciclos sem acumular elementos | Captura + contagem |
| G2-08 | Movimento reduzido: título derretido parado, nenhuma animação rodando; pausa congela | Emulação no F12 + botão |
| G2-09 | `ajuste=1` mostra as barras "nascimento" e "derreter"; sem `ajuste=1`, o GSDevTools não carrega | Visual + aba Rede |
| G2-10 | Com CPU 4× mais lenta: sem quadros longos (acima de 50 ms) repetidos durante o "derreter", em 1440 e 390 px | Números no relatório |
| G2-11 | JS próprio ≤ 55.000 bytes; bytes transferidos de A e B registrados | Números no relatório |
| G2-12 | Nenhum erro no console em A, B e B com ajuste | Aba Console |
| G2-13 | Nada alterado fora de `prototipo-descida/`; `node --test testes/` passando | `git status` + testes |

Se não conseguir capturar telas, marque **Não verificado** (o diretor verifica depois). Não marque como verificado só lendo o código.

## Relatório

Relatório final do AGENTS.md, com:

- os valores escolhidos (tamanho do título, lista de escorridos, tempos do "derreter", força do filtro);
- os números de G2-10 e G2-11;
- os arquivos alterados.

## Depois

Daniel compara. São **no máximo duas rodadas de correção** desta tarefa.
