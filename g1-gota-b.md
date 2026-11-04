# G1 — Gota B: comparar a gota atual com uma versão em GSAP + MorphSVG

> Escrita pelo diretor em 03/11/2026. Experimento descartável dentro de `prototipo-descida/`. **Não é a X5b** (a X5b continua em pausa) e não muda o site nem a pasta `experimento/`.

## Exceção autorizada por Daniel (03/11/2026)

Esta tarefa **prevalece sobre o AGENTS.md** nos dois pontos abaixo, **só dentro de `prototipo-descida/`**:

1. **Biblioteca:** pode usar as cópias locais já colocadas em `prototipo-descida/vendor/` (GSAP 3.15.0: `gsap.min.js`, `MorphSVGPlugin.min.js`, `GSDevTools.min.js`, licença em `vendor/LEIA-ME.txt`). Não baixe outras versões, não use CDN, não use npm, não crie build, não use nenhum outro plugin (nem ScrollTrigger, nem Physics2D).
2. **Teto de JS:** o protótipo já tem 41.316 bytes de JS próprio (acima dos 40.000 do experimento). Aqui o teto não bloqueia: **o JS próprio do protótipo (sem `vendor/`) pode chegar a 50.000 bytes**; registre o número final no relatório. Os arquivos de `vendor/` contam à parte.

Todo o resto do AGENTS.md vale (textos do config, `textContent`, acessibilidade, sem `overflow-x: hidden` em html/body, palavras proibidas do ESTADO.md). Se achar outra contradição, pare e pergunte.

## Contexto

Leia no `ESTADO.md` as seções "A ideia completa de Daniel (03/11)" e "Cena da gota: o que já foi tentado (03/11)". Referência principal: **Graza** (https://www.graza.co/).

O que está ruim hoje (versão A, `prototipo-descida/descida.js`), segundo a revisão do diretor:

- a gota é uma imagem só (`desenhos/06.svg`) esticada por `scale`; ela não nasce no bico (só pulsa) e, ao chegar no título, **some de uma vez** (`opacity: 0`);
- a batida vira 3 elipses e 7 pontinhos de 8×10 px, como se o título fosse a superfície de uma poça; depois disso nada fica molhado;
- ao rolar de volta, tudo some de uma vez;
- no celular, "Cheiro das Águas" quebra no meio da palavra ("Água / s") em 360, 390 e 414 px (cada letra é um `inline-block`);
- o título em Fraunces fina enfraquece o efeito (na Graza o título é grosso e uma gota fica pendurada embaixo de uma letra).

## Objetivo

Ter, na mesma página, duas versões da cena para Daniel comparar:

- **A (padrão, sem parâmetro):** a versão atual, só com os dois ajustes comuns.
- **B (`?versao=b`):** o **nascimento da gota no bico** e a **batida no título** refeitos com GSAP + MorphSVG. O **meio da descida continua igual ao da A** (a gota acompanha a rolagem do mesmo jeito).

## Escopo

### Ajustes comuns (A e B)

1. **Título sem quebra no meio da palavra:** agrupe as letras de cada palavra num elemento que não quebra por dentro (`white-space: nowrap`); a linha só pode quebrar entre palavras. Ajuste o tamanho para que, de preferência, "Cheiro das Águas" caiba numa linha a partir de 360 px.
2. **Título mais grosso:** suba o peso da Fraunces local (eixo `wght`) no "Cheiro das Águas" para algo próximo do título da Graza (valor sugerido 700 a 800; escolha e registre). Confira se o arquivo `fontes/fraunces-latin-full-normal.woff2` tem o eixo `SOFT`; se tiver, teste um valor que arredonde as letras e registre o que escolheu. Não adicione fonte nova.

### Só na B

3. **Troca de versão:** `?versao=b` liga a B; sem parâmetro, A. Os arquivos de `vendor/` só são carregados na B (por exemplo, `descida-b.js` injeta os `<script>` e só depois inicia). Mostre um rótulo pequeno "Versão A" ou "Versão B" junto do aviso do experimento (texto novo em `textos.js`).
4. **Gota em SVG:** na B a gota é um caminho SVG na própria página (cor `#3B2618`, mesmo estilo do desenho 06), para o MorphSVG poder mudar a forma dela.
5. **Nascimento (linha do tempo por tempo, disparada pela rolagem):** quando a torneira entra na tela, a gota **cresce na ponta do bico, forma um pescoço que afina e se solta**, e então passa a acompanhar a rolagem como na A. Nada aparece ou some de uma vez. A posição da ponta do bico fica num **único valor** no topo do arquivo, porque o desenho da torneira ainda vai ser trocado (desenho 11, do ChatGPT). Não redesenhe a torneira.
6. **Batida (linha do tempo por tempo, disparada quando a gota chega):** a gota **achata ao tocar** o topo das letras, vira uma **mancha que se espalha e escorre um pouco pela letra**, solta algumas gotinhas que sobem e caem com aceleração (como gravidade), e **uma gota nova se forma embaixo de uma letra perto da batida, estica e fica pendurada** (como a gota sob o "A" da Graza). **A mancha e a gota pendurada ficam** depois da animação. Tire as elipses de onda da B. Se usar um filtro SVG de líquido (blur + matriz de cor, o efeito "gooey") para as gotinhas se juntarem, aplique só na camada do líquido, nunca no texto.
7. **Voltar e repetir:** ao rolar de volta para cima do ponto de chegada, a mancha e a gota pendurada somem com uma transição curta (não de uma vez). Ao descer de novo, a batida se repete sem acumular elementos na página.
8. **Ajuste visual:** com `?versao=b&ajuste=1`, carregue o `GSDevTools` ligado às linhas do tempo do nascimento e da batida (com `id` legível, ex.: "nascimento", "batida"), para Daniel ver em câmera lenta. Sem `ajuste=1`, o GSDevTools não é carregado. Lembre que o GSDevTools não funciona com animação presa à rolagem: por isso essas duas partes são por tempo.
9. **Parâmetros num lugar só:** tempos, tamanhos, posição do bico e quantidade de gotinhas ficam num objeto no topo de `descida-b.js`, com comentário curto em português, para que cada ajuste de Daniel seja um número.
10. **Movimento reduzido e "Pausar animações":** na B, como na A, nada se move; a B mostra o estado final parado (mancha e gota pendurada) ou nada, e você registra qual escolheu.

## Fora do escopo

- Não mexer no meio da descida, nas paradas, nos desenhos, no tamanho das ilustrações, nas cores, nos textos das paradas nem nos outros capítulos.
- Não mexer em `experimento/`, no site (`index.html`, `css/`, `js/`), no `ESTADO.md`, no `tarefas.md` nem nos testes.
- Não fazer commit nem `git add`. A pasta `prototipo-descida/` fica fora do Git.

## Critérios

| ID | Comportamento esperado | Como verificar |
|---|---|---|
| G-01 | Sem parâmetro, a A funciona como antes, só com os ajustes comuns | Comparar com o comportamento atual; relatar diferenças |
| G-02 | `?versao=b` liga a B; os arquivos de `vendor/` só aparecem na aba Rede na B | Aba Rede (F12) nas duas versões |
| G-03 | "Cheiro das Águas" nunca quebra no meio de palavra em 320, 360, 390, 414, 768, 1280 e 1440 px, nas duas versões | Medir as linhas das letras de cada palavra (script ou captura por largura) |
| G-04 | Título mais grosso nas duas versões; valor de `wght` (e `SOFT`, se existir) registrado | Relatório + captura |
| G-05 | B: a gota nasce no bico (cresce, afina, solta) sem aparecer de uma vez | Sequência de capturas do nascimento ou GSDevTools em câmera lenta |
| G-06 | B: na batida a gota não some de uma vez; mancha e gota pendurada ficam visíveis depois | Sequência de capturas da batida + captura 3 s depois |
| G-07 | B: rolar de volta limpa com transição; descer 3 vezes não acumula elementos | Contar os elementos da camada do líquido antes e depois de 3 ciclos |
| G-08 | B: com `ajuste=1` aparece o GSDevTools controlando "nascimento" e "batida"; sem `ajuste=1` ele não carrega | Visual + aba Rede |
| G-09 | Movimento reduzido e "Pausar animações": nada se move em A e B | Emular `prefers-reduced-motion` no F12 e usar o botão |
| G-10 | Desempenho: com CPU 4× mais lenta (aba Desempenho), registrar quadros longos (acima de 50 ms) durante o nascimento e a batida, em A e B, no desktop e emulando celular de 390 px. Falha se a B tiver quadros longos repetidos durante a batida | Números no relatório |
| G-11 | Peso: bytes transferidos da página em A e B (aba Rede, cache desativado) e JS próprio do protótipo sem `vendor/` ≤ 50.000 bytes | Números no relatório |
| G-12 | Nenhum erro no console em A, B e B com ajuste | Aba Console (o aviso "[Intervention] Images loaded lazily…" do Edge pode ser ignorado) |
| G-13 | Nenhum arquivo fora de `prototipo-descida/` alterado; `node --test testes/` continua passando | `git status` e o comando de testes |
| G-14 | Textos novos só em `textos.js` (o rótulo da versão); nenhuma palavra proibida | Leitura do diff |

Se você não conseguir abrir um navegador para algum critério visual, marque **Não verificado** e diga o que Daniel precisa olhar. Não marque como verificado só lendo o código.

## Relatório

Termine com o relatório final do AGENTS.md, contendo também:

- os valores escolhidos (peso do título, `SOFT`, tempos principais da batida);
- os números de G-10 e G-11;
- o que ficou para Daniel julgar a olho;
- a lista de arquivos criados e alterados dentro de `prototipo-descida/`.

## Depois (não faça agora)

Daniel compara A e B. São **no máximo duas rodadas de correção** desta tarefa. Se a B não ficar claramente melhor para ele, o GSAP para aqui e o próximo passo é outro caminho (desenhos em partes ou animador).
