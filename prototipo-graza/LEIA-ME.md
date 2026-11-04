# Protótipo estilo Graza (feito pelo Claude na noite de 03 para 04/11/2026)

Página inteira, do topo ao rodapé, com **a mesma mecânica e o mesmo ritmo da Graza**, mas com os desenhos, textos e cores do Cheiro das Águas. É descartável, como a `prototipo-descida`: serve para você ver, adaptar e decidir.

**Não mexi** no site, em `experimento/`, em `prototipo-descida/`, no `ESTADO.md` nem em nenhum `p*.md`/`x*.md`. **Não faça `git add` desta pasta** até decidir o que fica.

## Como abrir

1. No VS Code (aberto na pasta `site-cappuccino`), clique com o botão direito em `prototipo-graza/index.html` e escolha **Open with Live Server**.
2. Se abrir outra coisa, o endereço é `127.0.0.1:5500/prototipo-graza/index.html` (ou 5501, se o Live Server subir em outra porta).
3. Aperte **Ctrl+Shift+R** para não pegar arquivo velho.
4. Para ver no celular pelo computador: **F12** › botão **Alternar emulação de dispositivo** (ícone de celular e tablet no canto de cima das ferramentas, ou Ctrl+Shift+M) › escolha um tamanho, por exemplo 390 × 844 › **Ctrl+Shift+R** de novo.

## O que tem na página (na ordem)

| Parte | O que veio da Graza | O que é nosso |
|---|---|---|
| Faixa de aviso e topo | barra fina no alto; topo fixo com menu, marca no meio e botão à direita | "Degustação gratuita…", selo "Protótipo" |
| Topo que troca com a rolagem (04/11, do `prototipo-descida`) | (não existe na Graza) | hero escuro com o título do site e a foto em arco; ao rolar, o fundo clareia e o arco cresce e vira a foto da origem. O topo fica transparente por cima |
| Torneira e gota | fruto com torneira e "*DRIP*"; título em duas partes desencontradas, serifada estreita | fruto 02 do ChatGPT + torneira desenhada por mim; "*plim*"; título "Feito à mão," / "do jeito simples." |
| Descida da gota | **a gota fica parada na tela e a página sobe**; desenhos com legenda curta em fonte de máquina de escrever, alternando os lados | galho (Café Conilon), cacau (Cacau 100%), moça com cesta (Feito à mão, em casa), xícara (Aroma, sensações e cremosidade) |
| Nome grande | o nome enorme recebe a gota | "Cheiro das Águas" fica **preso na tela** e **derrete com a rolagem** (o derretido da G3) |
| Produtos | cartões de foto com etiqueta em pílula, legenda pequena em cima e nome sublinhado; botão largo com sombra quadriculada | com açúcar, sem açúcar e **por kg** (desenho da tigela, porque a embalagem de 1 kg ainda não existe); botão "Pedir degustação gratuita" abre o WhatsApp |
| Faixa correndo | faixa de texto que corre, com "Pause animations" | "Café Conilon · Cacau 100% · Feito à mão · Taparuba, MG" + "Pausar animações" |
| Você sabia? | o "FUN FACT": desenho enorme saindo da borda, letreiro em curva, um fato por vez com setas | galho + fruto aberto; 6 fatos tirados do `config.js` |
| Duas formas de vender | (não existe na Graza) | seção escura com topo em arco; dois cartões, claro e verde, **cada um com a calculadora em frase**; no computador, os cartões se empilham ao rolar |
| Como preparar | cartões de receita | as 3 fotos do preparo |
| Como funciona e Dúvidas | linhas tracejadas, perguntas que abrem | textos do `config.js` |
| Contato e rodapé | rodapé escuro com o nome enorme ocupando a largura | foto da moça em arco, WhatsApp, Instagram, entrega e pagamento, CNPJ e endereço; borda de espuma no topo |

No celular, o título vem **antes** da torneira, para a gota não cruzar o texto. Cada parada mostra o desenho à esquerda e o texto à direita, com a gota passando entre os dois. Os produtos deslizam para o lado.

## O que eu verifiquei no navegador daqui (Chromium, sem placa de vídeo)

- **Gota no corredor:** nenhum toque em desenho, legenda ou título, com amostras a cada 100 px de rolagem, em 1440, 1280, 920, 414, 390 e 360 px de largura.
- **Título preso:** fica parado na tela durante todo o trecho, de 703 a 855 px de rolagem, conforme a tela. O derretido chega a **100% antes de o título soltar**, tanto rolando no ritmo normal quanto rápido, em 1440, 920, 390 e 360 px.
- **Rolar de volta:** os escorridos recolhem e a gota volta a aparecer. Trocando o tamanho da janela de 1440 para 390 e de volta, os escorridos continuam colados nas letras.
- **Movimento reduzido:** o nome aparece já derretido e parado, sem gota, sem título preso e com nenhuma animação rodando. Isso corrige o defeito que ficou na G3.
- **Botões e menu:** "Pausar animações" para a faixa, o balanço dos desenhos e a gotinha da torneira. O menu abre, coloca o foco no primeiro link e fecha com Esc, devolvendo o foco ao botão.
- **Rolagem lateral:** nenhuma, em 320, 360, 768, 920, 1024, 1280, 1440 e 1920 px.
- **Console:** sem erros.
- **CPU 4× mais lenta:** nenhum quadro acima de 50 ms na descida e no derretido, no computador e no celular.
- **Palavras proibidas:** nenhuma. "Não achocolatado" só aparece nas duas frases já aprovadas.
- **Peso:** cerca de 0,57 MB ao abrir e 1,0 MB depois de rolar tudo, sem compressão. Isso inclui GSAP 183 KB, fontes 180 KB, desenhos 181 KB e fotos 434 KB. JS próprio: cerca de 33 KB.

**Só você consegue julgar:** se o movimento está fluido de verdade na sua máquina e no seu celular, se o ritmo agrada e se o conjunto "parece Graza" e ao mesmo tempo "parece Cheiro das Águas".

## Onde mudar as coisas

- **Ritmo da gota e do derretido:** no topo de `cena.js`, no objeto `ajustes`:
  - `linha`: altura da gota na tela;
  - `trechoFixo`: quanto tempo o título fica preso;
  - `completar`: em que ponto do trecho o derretido termina;
  - `suavizar`: atraso da animação em relação à rolagem;
  - `escorridos`: quais letras pingam.
- **Textos:** os textos do negócio vêm de `../js/config.js`. Os textos novos e a ordem das paradas ficam em `textos.js`.
- **Cores e tamanhos:** no início de `estilo.css` (`--leite`, `--cacau`, `--ouro`, `--folha`) e nas classes `.d01`, `.d07`, `.d10` e `.d09`, que definem o tamanho de cada desenho.

## Fica para você decidir

1. **Fontes novas:** **Instrument Serif** nos títulos e **Courier Prime** nos textos pequenos, as duas com licença livre (ver `fontes/LICENCAS.txt`). A Fraunces grossa continua só no nome. É a mudança que mais deixa a página "com cara de Graza".
2. **Torneira:** provisória, desenhada por mim no traço dos desenhos. Quando o desenho 11 (fruto com torneira) do ChatGPT chegar, ele entra no lugar.
3. **Cartão "por kg":** usa o desenho da tigela porque a embalagem de 1 kg ainda não existe.
4. **GSAP com ScrollTrigger:** biblioteca de animação, licença sem custo; está no `vendor/LEIA-ME.txt`. É o que a Graza usa. Se esta direção for aprovada, o teto de JS do projeto precisa subir.

## Mudanças de 04/11

- Entrou o topo que troca com a rolagem e a calculadora dos dois cartões, vindos do `prototipo-descida` (arquivos `palco.js`, `capitulo.js`, `conta.js`). A conta usa as mesmas regras do site (`js/calculadora.js`).
- Como o título do site agora está no topo, a cena da gota ganhou o título "Feito à mão, do jeito simples." e a última parada virou "Aroma, sensações e cremosidade" (a frase da origem já aparece no topo).
- O topo usa a Instrument Serif, como o resto do protótipo. Para voltar à Fraunces fina do experimento, troque a fonte em `.ato h1` e `.ato h2` no `estilo.css`.
- O efeito de o título engrossar com o mouse, do experimento, não veio.
- Conferido de novo: gota sem encostar em nada, título preso, derretido completo, conta certa (R$ 84 no kg e R$ 12 na xícara de 200 ml dá ganho de R$ 6,96; R$ 30 e R$ 39 no pacote dá R$ 9,00), movimento reduzido com o topo parado, sem rolagem lateral e sem erros no console.
