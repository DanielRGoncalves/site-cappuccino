# ESTADO do projeto — leia primeiro

> Arquivo de contexto para qualquer chat novo (Claude ou Codex). Resume onde o projeto está, o que já foi decidido e o que falta. **Não é uma tarefa**: as tarefas ficam nos arquivos `p*.md`. Atualizar ao fim de cada tarefa.
>
> Última atualização: 28/10/2026 (P10 feita e revisada; próxima: P11, que depende das fotos e dos valores).

## O que é

Site de apresentação do **Cheiro das Águas** (Agropecuária Cheiro das Águas Ltda., CNPJ 57.813.645/0001-60), cappuccino artesanal e gourmet feito à mão pela família em Taparuba/MG. Público: **negócios** da Grande Vitória (padarias, cafeterias, restaurantes etc.; padaria só como exemplo, o texto fala com "o seu negócio"). O site **apresenta**; preço e negociação são pelo WhatsApp/Instagram.

## Como trabalhamos

- **Claude** = diretor/revisor: planeja, escreve as tarefas (`p*.md`) com critérios, revisa lendo os arquivos. Não roda git nem testes e não faz push.
- **Codex (GPT-6 Luna)** = executor: edita, roda `node --test testes/`, faz commit local. Um chat novo por tarefa. Luna esforço baixo = textos; médio = lógica/imagens; alto = estrutura + layout + testes. **Sol** só se o mesmo critério falhar duas vezes.
- **Daniel** confere no **Live Server do VS Code** (VS Code aberto dentro de `site-cappuccino`, endereço `127.0.0.1:5500/index.html`), testa no celular e faz o push.
- Git Bash: `cd /e/cheiro-das-aguas/site-cappuccino`; um comando por linha; `git add` por nome de arquivo (nunca `git add .`); depois de cada tarefa: `git status`, `git log --oneline -3`, `node --test testes/`.
- Prompt padrão para o Codex: "Leia AGENTS.md, p7-qualidade.md, p8-negocio.md e p9-visual.md. Execute somente a tarefa **PX** descrita em … e termine com o relatório final do AGENTS.md. O … prevalece sobre os outros documentos onde houver contradição."

## Técnica

- Site estático: HTML, CSS e JS (módulos), sem backend, sem build, sem frameworks.
- `js/config.js` é a única fonte de textos e configurações. As meta tags do `index.html` ficam no bloco `<!-- SINCRONIZAR COM js/config.js -->` e precisam bater com o config.
- Sem `innerHTML` com dados; imagens com `width`, `height` e `alt`; acessibilidade (teclado, foco visível, contraste ≥ 4,5:1).
- Publicação: GitHub Pages, branch **`prototipo`**, domínio https://cheirodasaguasgourmet.com.br/ (arquivo `CNAME` no repositório; HTTPS ativo).

## Branches

| Branch | O que é | Situação |
|---|---|---|
| `main` | versão antiga de loja, com preços (tag `loja-v1`) | guardada, não usar |
| `prototipo` | versão publicada no domínio (P1–P8) | **no ar** |
| `visual` | protótipo com fotos ilustrativas da internet (P9, P10) | **não publicar**; tem `noindex` e faixa de protótipo |

## Tarefas

| Tarefa | Arquivo | Situação |
|---|---|---|
| P1–P6 | `prototipo.md` | feitas e publicadas |
| P7 qualidade e diferenciais | `p7-qualidade.md` | feita e publicada |
| P8 textos para "o seu negócio" | `p8-negocio.md` | feita e publicada |
| P9 protótipo visual | `p9-visual.md` | feita (commit `1abb48e`, 20 testes), aprovada; Daniel gostou |
| P10 calculadora nova + formulário de degustação | `p9-visual.md` | feita (commit `36cb07f`), revisada pelo Claude em 28/10: W-01 a W-10 ok; texto de abertura da calculadora ajustado à mão (falava em "xícara de 30 g", conflitava com o seletor de copo) |
| P10b calculadora com duas abas (revender o pacote / servir na xícara) | `p10b-calculadora.md` | escrita em 28/10, a executar no Codex |
| P11 fotos oficiais e versão oficial | a escrever | depende das fotos reais e dos valores confirmados |

## Fatos do negócio (confirmados pela família)

- Produtos exibidos: **com açúcar** e **sem açúcar**; descafeinado existe no config com `exibir: false`. Só há pacote de **250 g**. A embalagem é a mesma para os dois.
- Ingredientes com açúcar: "Leite em pó integral, bicarbonato de sódio, canela em pó, cacau 100%, açúcar refinado e café Conilon." Sem açúcar: os mesmos, sem o açúcar refinado.
- Avisos: "Contém leite e derivados. Não contém glúten." Conservação: "Local seco, ventilado e protegido da luz solar." Validade: 365 dias.
- Café Conilon; cacau 100%, não achocolatado; feito à mão, em casa, sem processo industrial.
- Entrega pela família na Grande Vitória, sem taxa, de um dia para o outro. Pagamento: Pix, cartão na maquininha na entrega ou dinheiro.
- **Degustação gratuita** antes da primeira venda: a família leva uma pequena quantidade do cappuccino e a água quente, e a pessoa experimenta na hora.
- WhatsApp 5527998480547; Instagram @cheirodasaguasgourmet.
- **Sem preços no site** (`apresentacao.mostrarPrecos: false`).

## Proibido escrever (vale em tudo)

Premium, melhor, saudável ou benefício de saúde; conservante, aditivo ("sem aditivos" é falso: o bicarbonato é aditivo), natural, orgânico, selos; "achocolatado" ou "café solúvel" como ingrediente (só vale a frase "Cacau 100%, não achocolatado."); origem do café, pontuação; marcas concorrentes ou ataques ao industrial.

## A confirmar (bloqueia a calculadora e a versão oficial)

- **Calculadora:** decidido em 28/10: 3 colheres = 30 g para 100 ml (rótulo diz 35 g: alinhar no rótulo novo); os negócios revendem o pacote e servem na xícara de louça (reutilizada, sem custo de copo); preço padrão do pacote para empresas R$ 30 (com açúcar) e R$ 35 (sem açúcar), negociável e fora do site; uma padaria cliente revende por R$ 39 e R$ 59. Falta confirmar: tamanhos de xícara usados nos negócios (P10b usa 150/200/300 ml) Preço da xícara: segundo o Davi, varia de R$ 8 a R$ 24 conforme o estabelecimento; o campo fica vazio, com essa faixa como dica. Com 30 g/100 ml, a xícara de 200 ml custa R$ 7,20 de pó (pacote a R$ 30): ganho baixo para quem cobra perto de R$ 8, bom acima de uns R$ 12.
- **Fotos reais:** mãos preparando, pó na xícara, xícara pronta, produto no balcão (mais as que substituem as ilustrativas). Tirar na vertical, assunto no centro.
- **Rótulo** da embalagem desatualizado (cita achocolatado e café solúvel) e igual para os dois produtos: atualizar e diferenciar antes de vender.
- Com o contador: "sem açúcar" ou "sem adição de açúcar"; nota fiscal.
- **INPI:** verificar o risco do nome "Cheiro das Águas".
- Com a família: prazo de entrega, pedido mínimo, condições para empresas.

## Ideias em espera

- **Área para empresas** (ideia do irmão, Davi): portão com CNPJ/CPF não é segurança real em site estático e CPF traz questão de LGPD. Recomendado: link privado não listado + cadastro pelo WhatsApp + PDF de condições depois da degustação. Login de verdade só numa fase 2.
- Teste com um dono de negócio de fora (roteiro de 5 perguntas, a fazer).
- Teste de velocidade no 4G com as fotos.
- Limpar documentos antigos da época da loja (`brief.md`, `tarefas.md`, `criterios.md`).
- ai-memory (Fabio Akita): avaliar num projeto futuro; por enquanto este arquivo resolve.

## Para a versão oficial (P11, a escrever)

Na branch `visual`: trocar as fotos ilustrativas pelas reais (mesmos nomes e proporções), `apresentacao.prototipo: false`, remover o `noindex` e o "ilustrativa" dos textos alternativos, conferir tudo e levar para a branch publicada.
