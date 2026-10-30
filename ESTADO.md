# ESTADO do projeto — leia primeiro

> Arquivo de contexto para qualquer chat novo (Claude ou Codex). Resume onde o projeto está, o que já foi decidido e o que falta. **Não é uma tarefa**: as tarefas ficam nos arquivos `p*.md`. Atualizar ao fim de cada tarefa.
>
> Última atualização: 28/10/2026 (P10b, P10c e P11a feitas e revisadas; falta testar no celular e juntar as fotos que faltam para a P11).

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
| `visual` | protótipo com as fotos reais atuais (P9 a P11a) | **não publicar**; tem `noindex` e faixa de protótipo |

## Tarefas

| Tarefa | Arquivo | Situação |
|---|---|---|
| P1–P6 | `prototipo.md` | feitas e publicadas |
| P7 qualidade e diferenciais | `p7-qualidade.md` | feita e publicada |
| P8 textos para "o seu negócio" | `p8-negocio.md` | feita e publicada |
| P9 protótipo visual | `p9-visual.md` | feita (commit `1abb48e`, 20 testes), aprovada; Daniel gostou |
| P10 calculadora nova + formulário de degustação | `p9-visual.md` | feita (commit `36cb07f`), revisada pelo Claude em 28/10: W-01 a W-10 ok; texto de abertura da calculadora ajustado à mão (falava em "xícara de 30 g", conflitava com o seletor de copo) |
| P10b calculadora com duas abas (revender o pacote / servir na xícara) | `p10b-calculadora.md` | feita, revisada pelo Claude em 28/10: X-01 a X-11 ok |
| P10c aba Xícara calculada por kg; "diet" na calculadora | `p10c-calculadora-kg.md` | feita (commit `61ff298`), revisada pelo Claude em 28/10: K-01 a K-11 ok, 26 testes; falta testar toque no celular |
| P11a simulação com as fotos reais atuais | `p11a-fotos-reais.md` | feita (commit `8d4e948`), revisada pelo Claude em 28/10: 25 testes, sem erro no console; imagens em `img/reais/` |
| P11 fotos oficiais e versão oficial | a escrever | depende das fotos reais e dos valores confirmados |

## Fatos do negócio (confirmados pela família)

- Produtos exibidos: **com açúcar** e **sem açúcar**; descafeinado existe no config com `exibir: false`. No varejo, só há pacote de **250 g** (a embalagem é a mesma para os dois). Negócios que **servem na xícara** compram **por kg**, num pacote de 1 kg separado (embalagem ainda não definida). Preço do kg em 28/10: **R$ 84 tradicional** e **R$ 108 diet** (negociável, fora do site). O sem açúcar tem aprovação para ser chamado de **diet**: hoje só a calculadora usa "diet"; a aba dos produtos troca "Sem açúcar" por "diet" quando chegar a embalagem nova.
- Ingredientes com açúcar: "Leite em pó integral, bicarbonato de sódio, canela em pó, cacau 100%, açúcar refinado e café Conilon." Sem açúcar: os mesmos, sem o açúcar refinado.
- Avisos: "Contém leite e derivados. Não contém glúten." Conservação: "Local seco, ventilado e protegido da luz solar." Validade: 365 dias.
- Café Conilon; cacau 100%, não achocolatado; feito à mão, em casa, sem processo industrial.
- Entrega pela família na Grande Vitória, sem taxa, de um dia para o outro. Pagamento: Pix, cartão na maquininha na entrega ou dinheiro.
- **Degustação gratuita** antes da primeira venda: a família leva uma pequena quantidade do cappuccino e a água quente, e a pessoa experimenta na hora.
- WhatsApp 5533999096791; Instagram @cheirodasaguasgourmet.
- **Sem preços no site** (`apresentacao.mostrarPrecos: false`).

## Proibido escrever (vale em tudo)

Premium, melhor, saudável ou benefício de saúde; conservante, aditivo ("sem aditivos" é falso: o bicarbonato é aditivo), natural, orgânico, selos; "achocolatado" ou "café solúvel" como ingrediente (só vale a frase "Cacau 100%, não achocolatado."); origem do café, pontuação; marcas concorrentes ou ataques ao industrial.

## A confirmar (bloqueia a calculadora e a versão oficial)

- **Calculadora:** decidido em 28/10: 3 colheres = 30 g para 100 ml (rótulo diz 35 g: alinhar no rótulo novo); os negócios revendem o pacote e servem na xícara de louça (reutilizada, sem custo de copo); preço padrão do pacote para empresas R$ 30 (com açúcar) e R$ 35 (sem açúcar), negociável e fora do site; uma padaria cliente revende por R$ 39 e R$ 59. Falta confirmar: tamanhos de xícara usados nos negócios (P10b usa 150/200/300 ml) Preço da xícara: segundo o Davi, varia de R$ 8 a R$ 24 conforme o estabelecimento; o campo fica vazio, com essa faixa como dica. Com 30 g/100 ml, a xícara de 200 ml custa R$ 7,20 de pó (pacote a R$ 30): ganho baixo para quem cobra perto de R$ 8, bom acima de uns R$ 12.
- **Fotos reais:** 27 fotos recebidas em 28/10 (originais em `fotos-reais/`, fora do Git). Usadas na P11a: 1, 2, 4, 6, 11, 12, 13, 14, 15, 17, 19. Ainda faltam: produto no balcão ou na prateleira de uma padaria; a família preparando e entregando (mãe e pai, em Taparuba); cacau (só aparece na foto 2); pó e embalagem sem marca de outras empresas (as fotos 3, 6 e 18 mostram uma caneca de outra marca); o verso do rótulo com ingredientes; um cappuccino quente pronto na xícara de louça de padaria. Tirar na vertical, assunto no centro.
- **Fotos reais (confirmado por Daniel em 28/10):** todas autorizadas pelas pessoas que aparecem; têm edição (cor, luz), mas nenhuma foi gerada por IA. As fotos com pessoas (7 a 10, 13, 16, 24, 27, 28) podem ser usadas, por exemplo numa futura seção "quem somos". Continua valendo: não usar as que mostram a caneca de outra marca (3, 18 e a parte direita da 6).
- **Tamanho das imagens:** os testes contam 1 KB = 1.000 bytes. Imagens que o Claude grava na pasta do PC ganham um bloco C2PA (credenciais de conteúdo, ~5.800 bytes). Ao preparar imagens, deixar pelo menos 7.000 bytes de folga e conferir o tamanho final na pasta (`Get-ChildItem img/reais`).
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
