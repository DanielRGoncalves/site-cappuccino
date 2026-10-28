# P11a — Simulação com fotos reais (branch `visual`)

> **Este arquivo vale em conjunto com `AGENTS.md`, `p7-qualidade.md`, `p8-negocio.md`, `p9-visual.md` e `p10b-calculadora.md`.** Em caso de contradição, **este arquivo vence** e o executor não precisa perguntar. As palavras proibidas do `p7-qualidade.md` continuam proibidas. Execute **só esta tarefa**. Se algo faltar, **pare e pergunte**.

## O que é

Trocar as fotos ilustrativas da internet pelas **fotos reais da família**, para simular como o site fica. É uma **simulação**: faltam fotos (veja `ESTADO.md`), e algumas serão trocadas depois. A branch continua **sem publicar** (`noindex` e faixa de protótipo ficam).

As imagens **já estão prontas** em `img/reais/` (WebP, nos tamanhos certos). **Não crie, não converta e não edite imagens.** Não mexa em `fotos-reais/` (originais pesados, fora do Git).

## Mapa das fotos

| Espaço no config | Arquivo | Largura × altura | `alt` |
|---|---|---|---|
| `apresentacao.hero.foto` | `img/reais/hero-720.webp` | 720 × 1080 | "Pacote de cappuccino Cheiro das Águas sobre grãos de café" |
| `apresentacao.hero.fotoPequena` | `img/reais/hero-480.webp` | 480 × 720 | (o mesmo do hero) |
| `apresentacao.origem.foto` | `img/reais/origem-720.webp` | 720 × 960 | "Pacotes de cappuccino Cheiro das Águas entre frutos de cacau e grãos de café" |
| diferencial "Café Conilon" | `img/reais/cafe-720.webp` | 720 × 1280 | "Grãos de café em um saco" |
| diferencial "Cacau 100%" | `img/reais/cacau-720.webp` | 720 × 1280 | "Pacote aberto com o cappuccino em pó" |
| diferencial "Feito à mão, em casa" | `img/reais/mao-720.webp` | 720 × 1280 | "Mulher mexendo o cappuccino em uma xícara de vidro" |
| diferencial "Aroma, sensações e cremosidade" | `img/reais/aroma-720.webp` | 720 × 1280 | "Café sendo servido em uma xícara ao lado do pacote de cappuccino" |
| preparo, passo 1 | `img/reais/preparo-1-480.webp` | 480 × 720 | "Colher com cappuccino em pó sobre a xícara de vidro" |
| preparo, passo 2 | `img/reais/preparo-2-480.webp` | 480 × 720 | "Água quente sendo despejada sobre o cappuccino em pó" |
| preparo, passo 3 | `img/reais/preparo-3-480.webp` | 480 × 720 | "Colher mexendo o cappuccino na xícara de vidro" |
| produto "com açúcar" (`foto` / `fotoPequena`) | `img/reais/produto-acucar-800.webp` / `-400.webp` | 800 × 800 / 400 × 400 | "Pacote de cappuccino de 250 g sobre um banco de madeira" |
| produto "sem açúcar" (`foto` / `fotoPequena`) | `img/reais/produto-sem-800.webp` / `-400.webp` | 800 × 800 / 400 × 400 | "Dois pacotes de cappuccino de 250 g lado a lado" |

- O produto **descafeinado** (`exibir: false`) continua sem aparecer; deixe os campos de foto dele como estão.
- Se o config ou o HTML pedirem `largura`/`altura` para os produtos, use as medidas da tabela.
- O `alt` dos preparos não pode dizer "ilustrativa". **Nenhum `alt` do site pode conter "ilustrativa"** nem "não representa o preparo".

## O que mudar

1. `js/config.js`: aponte cada espaço da tabela para o arquivo novo, com as medidas e o `alt` exatos. Os dois diferenciais que estavam com `foto: ""` e o passo 1 e 3 do preparo passam a ter foto (nenhum "Foto a definir" sobra na página).
2. Troque o texto `apresentacao.avisoPrototipo` por: "Protótipo: algumas fotos ainda serão trocadas por outras do nosso dia a dia."
3. **Meta tag `og:image`:** não mude (continua `img/og.jpg`).
4. `testes/estrutura.test.mjs`: atualize os testes que citam `img/ilustrativas/` (a lista de fotos esperadas e o teste "fotos ilustrativas WebP respeitam os limites da P9") para `img/reais/`, com os limites **em bytes (1 KB = 1.000 bytes)**: `hero-720` e `hero-480` até 120.000; `preparo-*` até 70.000; `produto-*-400` até 60.000; todas as outras até 100.000. As imagens entregues já foram conferidas contra esses limites (revisão de 28/10). Troque também o texto esperado da faixa de protótipo. Renomeie o teste para "fotos reais WebP respeitam os limites".
5. **Não apague** `img/ilustrativas/` nem `img/produtos/` (ficam guardadas por enquanto; só pare de usá-las).
6. Se o CSS fixar a proporção de alguma foto (arco do início, cartões, produtos, preparo), ajuste **só o necessário** para as novas proporções não cortarem nem esticarem a imagem. Informe no relatório o que mudou.

## Critérios

| ID | Critério | Como verificar |
|---|---|---|
| R-01 | Todos os espaços da tabela usam o arquivo, as medidas e o `alt` indicados; nenhum "Foto a definir" visível; nenhum caminho de `img/ilustrativas/` no config. | Leitura e busca. |
| R-02 | Nenhuma imagem esticada ou cortada de forma estranha a 360, 768 e 1280 px (hero em arco, cartões, preparo, abas dos produtos). | Visual. |
| R-03 | Todas as `<img>` com `width`, `height`, `alt` útil e `loading="lazy"` fora da primeira tela. | Leitura do HTML gerado. |
| R-04 | Nenhum `alt` com "ilustrativa". Faixa de protótipo com o texto novo; `noindex` mantido. | Busca. |
| R-05 | Sem rolagem horizontal, 0 erros e 0 avisos no console a 360, 768 e 1280 px. | DevTools. |
| R-06 | `node --test testes/` passa. | Rodar o comando. |

**Commit:** `P11a: simulação com fotos reais`. Sem push. `git add` por nome de arquivo (as imagens: `git add img/reais`). **Nunca** `git add .` e nunca adicione `fotos-reais/`.
