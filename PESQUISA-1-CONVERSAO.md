# Pesquisa 1 — contribuições para conversão em degustações

Data: 10/11/2026. Análise: Codex, a pedido de Daniel.

## 1. Finalidade e limites

Selecionar o que vale aproveitar da pesquisa do Gemini Argon sobre conversas qualificadas e pedidos de degustação, confrontando as propostas com o site atual. Este documento é material para discussão com Daniel e o Claude Diretor; **não aprova mudanças de produto, textos, preços, layout ou regras de execução**. A atualização dos documentos canônicos fica para uma etapa posterior, como combinado nesta conversa.

Base local: branch `prototipo-graza`, HEAD `c8f2d8c2eb8abcfc9b47e8348bdbf216f9cc0722`. Já havia uma alteração não commitada em `ESTADO.md`, preservada nesta entrega.

Fonte recebida: pesquisa 1 em [Texto colado.txt](https://chatgpt.com/library?file_id=libfile_96d4218650808191be3e667fe2a70e90&account_id=personal), que começa por “O aumento de conversas qualificadas e pedidos de degustação...”. O Gemini declara que **não navegou no site nem inspecionou o DOM publicado**: partiu do contexto do prompt. Assim, suas descrições não são uma auditoria da página, e suas previsões comerciais são hipóteses.

Nesta análise foram lidos código e documentos locais, executadas funções da calculadora e consultadas pontualmente fontes primárias externas. Não foram medidos conversão, cliques, abandono ou comportamento de clientes, nem realizada nova inspeção visual do domínio público.

## 2. Principal contribuição

O ponto mais útil é a tensão entre **preços negociados fora do site e uma calculadora que exige o preço de compra**. Um visitante novo pode ainda não conhecer esse valor; a família, numa apresentação presencial, pode fornecê-lo na hora. São dois contextos diferentes para a mesma ferramenta.

Isso justifica observar o uso e comparar alternativas: manter os campos vazios com orientação clara para obter o preço, oferecer um exemplo explicitamente ilustrativo e aprovado, ou divulgar uma referência comercial autorizada. A pesquisa não demonstra que preencher automaticamente os campos seja a melhor opção, nem que a calculadora atual esteja causando abandono.

As outras contribuições úteis são explicar os limites da conta, facilitar a primeira mensagem e acompanhar o caminho entre contato, degustação e venda. Parte importante disso já existe.

## 3. O que o site já atende

| Tema da pesquisa | Situação encontrada no código | Consequência para o planejamento |
|---|---|---|
| Dois produtos ativos | `js/config.js` marca com açúcar e diet com `exibir: true`; `js/montar.js` filtra a lista. Descafeinado tem `exibir: false`. | Não é preciso trocar ocultação por CSS: o cartão do descafeinado já não é montado. |
| Mensagem inicial do WhatsApp | `js/textos.js` gera links codificados a partir do config: uma mensagem de degustação e outra de contato geral, ambas com espaço para nome do negócio. | A melhoria candidata seria distinguir intenção de revenda/xícara, não criar preenchimento inicial do zero. |
| Calculadoras começam vazias | `js/conta.js` cria os inputs de compra e venda sem atribuir valores iniciais. | A dúvida sobre o preço desconhecido se aplica à implementação atual. |
| Rendimento por kg | A conta da xícara já apresenta “Xícaras por kg”, inclusive antes de preencher os preços. | Melhorar descoberta ou compreensão, se necessário; não duplicar o indicador. |
| Entrada inválida ou ganho negativo | `js/calculadora.js` rejeita preços inválidos e preserva diferenças negativas. | Preservar esse comportamento em qualquer experiência. |
| Terminologia financeira | O resultado usa “ganho” e o percentual “Margem”; não usa “lucro líquido”. Há aviso de que só o pó entra na conta da xícara. | A pesquisa descreve uma troca de “lucro” que não corresponde à interface atual. Avaliar clareza dos termos existentes. |
| Aviso na revenda | `js/conta.js` acrescenta o aviso metodológico somente na conta da xícara. | Candidata a revisão: a diferença compra/venda do pacote também não representa lucro líquido. |
| Degustação e validade | `textos.como` informa que a família leva cappuccino e água quente para provar na hora; a revenda exibe validade de 365 dias. | Confirmar se clientes encontram e entendem; não registrar essas informações como ausentes. |
| Navegação rápida | O menu já aponta para Produtos, Duas formas de vender, Preparo, Como funciona e Contato. O hero tem link para `#vender`, onde ficam as contas. | Testar esses atalhos antes de propor uma barra nova. |
| Confiança e identidade real | O config e a montagem usam fotos reais, ingredientes, avisos, dados legais e foto identificada de Davi e Gustavo. | Aproveitar os ativos existentes; a lista de estabelecimentos depende de dados e autorizações. |

Constatações por leitura e execução local de módulos; não equivalem a comprovação da visibilidade, legibilidade ou facilidade de uso no celular.

## 4. Contribuições a preservar no próximo planejamento

### 4.1. Orientação para quem ainda não recebeu a cotação

Observar um comerciante usando o site sem ajuda e outro acompanhando uma apresentação da família. Perguntar o que entendem por preço de compra e o que fariam sem esse dado. Evitar explicar o campo antes de observar a dificuldade.

Se o problema se confirmar, comparar soluções simples, respeitando a decisão vigente de negociar preços pelo WhatsApp. Um exemplo precisa ter finalidade e valores aprovados, indicação visível de que não é uma oferta e manutenção pelo config. Um custo hipotético não deve parecer preço de atacado confirmado.

O NN/g sustenta oferecer informação preliminar de preço e cenários representativos [S2, S3]. Aplicar isso ao cappuccino é uma hipótese local, não uma obrigação de publicar tabela ou de preencher a calculadora automaticamente.

### 4.2. Explicação fiel da conta

Preservar a distinção entre diferença de venda menos pó/pacote e resultado final do negócio. É candidata uma redação simples que explicite os custos excluídos em ambas as modalidades, sem prometer lucro ou economia.

A expressão sugerida pelo Gemini, “Margem Bruta sobre o Custo do Pó”, é ambígua: o código calcula o percentual dividindo a diferença pelo **preço de venda**, não pelo custo. Qualquer rótulo futuro deve corresponder à fórmula. Alterar palavras também exige conferir comprimento e leitura no layout aprovado.

Há outro ponto concreto para revisar antes de promover a simulação como retorno por kg: `ganhoPacoteCentavos` multiplica o ganho unitário pelo número inteiro de porções. Com kg a R$ 84,00, porção de 60 g e venda a R$ 12,00, a função retorna 16 porções, custo unitário de R$ 5,04, ganho unitário de R$ 6,96 e ganho por kg de R$ 111,36. Os 16 copos consomem 960 g; ficam 40 g, com custo proporcional de R$ 3,36. Se a intenção for descontar o desembolso do kg inteiro contra a receita apenas desses 16 copos, a diferença é R$ 108,00. São tratamentos distintos da sobra. **Definir o significado pretendido para “Ganho por kg” antes de alterar fórmula ou texto.** Esta observação foi reproduzida executando a função; não é evidência de perdas reais no preparo.

### 4.3. Conversa inicial com intenção compreensível

Pode ser útil distinguir interesse em revender o pacote e servir na xícara, se isso ajudar a família a responder. A página já tem mensagens preenchidas; a proposta seria uma extensão pequena, sujeita à avaliação de utilidade.

As mensagens devem continuar centralizadas no config e os links montados com `encodeURIComponent`. Não espalhar preços ou textos comerciais no HTML. A seção de venda tem dois cartões e um convite compartilhado: criar ações por modalidade também pode exigir mudança de montagem e verificação visual.

O visitante pode editar a mensagem, compartilhar o link ou responder na conversa anterior. Uma frase recebida dá contexto; não comprova todo o percurso nem permite calcular taxa de clique ou de envio.

Exportar uma simulação ao WhatsApp fica para depois de demonstrada a necessidade. Exigiria separar valores digitados pelo visitante de condições ofertadas pela família, evitar envio involuntário e preservar a validação dos campos.

### 4.4. Informação operacional guiada por dúvidas reais

Levantar com a família as perguntas que efetivamente travam a degustação ou a compra: prazo, área atendida, conservação após aberto, modo de preparo e formato da visita. Acrescentar somente fatos confirmados e somente onde faltar clareza.

Manter a diretriz da G6 de reduzir repetição: cada seção tem um assunto. A pesquisa não justifica restaurar o FAQ inteiro, repetir rendimento e entrega em toda a página ou alterar o ritmo aprovado sem observar um problema.

## 5. Acompanhamento manual útil

Usar um registro simples, mantido pela família, sem instalar analytics. Campos candidatos: estabelecimento e cidade/bairro, data do primeiro contato, canal informado, versão/período do site quando conhecido, intenção (pacote/xícara/ambas), dúvida principal e datas de avanço das etapas. Registrar somente o necessário; não criar formulário de endereço no site.

Separar as etapas, corrigindo a definição agregada do Gemini:

| Etapa | Definição proposta para validar com a família |
|---|---|
| Conversa qualificada | Representante de estabelecimento da área atendida manifesta interesse comercial identificável. Não exige que seja pessoalmente o decisor final. |
| Degustação solicitada | O estabelecimento pede ou aceita avaliar o produto, mesmo sem horário marcado. |
| Degustação agendada | Há combinação de data/horário ou janela de atendimento. |
| Degustação realizada | A família confirma que a prova aconteceu. |
| Primeiro pedido | Registrar separadamente confirmação e pagamento, conforme a rotina real. |
| Recompra | Novo pedido; acompanhar o intervalo real antes de definir uma janela fixa. |

Contar estabelecimentos únicos e acompanhar grupos de contatos com tempo de observação comparável. Apresentar quantidades e denominadores: por exemplo, “4 de 10 conversas qualificadas solicitaram degustação”, sem chamar isso de conversão de visitantes do site. Sem contagem de visitantes ou cliques, essas taxas não estão disponíveis.

Perguntar de forma breve se o site ajudou e qual dúvida ficou. Contatos que voltam pela conversa antiga também podem ter usado a página. Dados ausentes ficam como desconhecidos, sem atribuição presumida.

Comparar períodos pode revelar sinais, mas sofre influência de preço, abordagem, região, qualidade dos contatos e demora até a degustação. O exemplo de 20 contatos antes/depois do Gemini não prova causalidade nem significância. Baixo volume não torna A/B impossível em termos absolutos; pode torná-lo pouco informativo ou demorado. Começar por observação qualitativa e contagens honestas.

## 6. Sugestões que precisam ser corrigidas ou adiadas

- **20 g por 100 ml e 50 doses por kg:** exemplo do Gemini sem sustentação no produto. O preparo registrado é 30 g em 100 ml de água; o config da calculadora usa 45 g/150 ml, 60 g/200 ml e 90 g/300 ml, com rendimentos inteiros teóricos de 22, 16 e 11. Não substituir por números da pesquisa nem confundir água adicionada com volume final medido da bebida. Rendimento prático depende de teste do preparo.
- **“Zera integralmente custo e desperdício de leite”:** o leite já está no pó e seu custo integra o insumo. É válido preservar “não precisa adicionar leite”; alegar economia comparativa ou eliminação de perdas exige medição e uma referência comparável.
- **Estoque local, rota dedicada, duração e ausência de compromisso:** a pesquisa levanta possibilidades, não fatos confirmados. Não publicar essas condições nem qualificá-las como garantias.
- **Mínimo para entrega, nota fiscal, uso em máquina ou bico vaporizador, validade após aberto e desconto por volume:** tratar como perguntas à família, não como funcionalidades ou benefícios já disponíveis. Não introduzir condições comerciais sem aprovação.
- **Preços sugeridos e margens típicas:** não transformar exemplos de clientes do config em tabela recomendada, margem garantida ou preço de compra oficial. Faixa de custo por dose também depende de preço e porção e não resolve sozinha a política comercial.
- **Leite incluso, diet e público:** não deduzir adequação a doenças, dietas ou grupos de saúde a partir do nome do produto.
- **“Abandono imediato”, “alto potencial”, meta de dois segundos e recompra em 45 dias:** não são resultados medidos deste site. Tempos e janelas precisam de finalidade e base real.
- **Poucas palavras nunca afetam o visual:** a pesquisa afirma esforço mínimo e ausência de impacto em mudanças textuais. Texto maior pode quebrar linhas, deslocar controles e afetar a rolagem; verificar o estado alterado.

## 7. Sequência candidata para decidir depois das outras pesquisas

| Prioridade candidata | Ação de avaliação | Evidência procurada |
|---|---|---|
| 1 | Observar a compreensão da calculadora sem cotação prévia e durante demonstração. | Se a pessoa sabe o que inserir, onde obtém o preço e como interpreta o resultado. |
| 2 | Definir os limites da conta e o tratamento da sobra por kg. | Exemplos conferidos independentemente e interpretação aprovada dos rótulos. |
| 3 | Levantar dúvidas recorrentes e combinar o registro manual das etapas. | Necessidades reais, contagens com denominadores conhecidos e lacunas explícitas. |
| 4 | Experimentar mensagens por modalidade, se fizerem diferença no atendimento. | Família identifica o interesse com menos perguntas, sem texto excessivo. |
| 5 | Acrescentar dados operacionais e estabelecimentos autorizados. | Fatos confirmados, manutenção definida e ausência de duplicação desnecessária. |

Antes de escrever tarefas: combinar os resultados das pesquisas 2 e 3, decidir o que Daniel deseja testar e reconciliar os documentos antigos com a versão atual. Este relatório não cria uma G9 nem modifica a ordem de implementação.

## 8. Fontes externas verificadas e limites

Consultas pontuais realizadas em 10/11/2026. Foram usadas paráfrases, sem reproduzir os estudos completos.

- **[S1] [NN/g — B2B Usability](https://www.nngroup.com/articles/b2b-usability/), Jakob Nielsen, 31/05/2006.** Sustenta facilitar a pesquisa do fornecedor e observar usuários representativos. O artigo recebido na pesquisa foi descrito com autoria/data diferentes; a página consultada não é uma publicação de 2018–2024. Seu público não é uma amostra de padarias capixabas.
- **[S2] [NN/g — State the Price to Give B2B Sites a Competitive Advantage](https://www.nngroup.com/articles/show-price/), Hoa Loranger, 01/12/2013.** Apoia oferecer informação de preço para pesquisa inicial; não prova que a política atual prejudica este negócio.
- **[S3] [NN/g — Show Prices for Common Scenarios](https://www.nngroup.com/articles/show-prices-for-common-scenarios/), Jakob Nielsen, 09/04/2006.** Fundamenta considerar exemplos como alternativa a exigir configuração detalhada. Não define os valores do cappuccino.
- **[S4] [NN/g — The Layer-Cake Pattern of Scanning Content on the Web](https://www.nngroup.com/articles/layer-cake-pattern-scanning/), Kara Pernice, 04/08/2019.** Apoia títulos descritivos e agrupamento de conteúdo; não estabelece uma regra de 15 segundos nem mede nossa página.
- **[S5] [Stanford Guidelines for Web Credibility](https://credibility.stanford.edu/guidelines/), resumo de maio de 2002.** Apoia identificação da organização, pessoas reais, contato e informações verificáveis. É uma referência histórica; não comprova efeito específico de uma foto ou texto na venda do produto.
- **[S6] [Baymard — Mobile E-Commerce Usability](https://baymard.com/research/mcommerce-usability).** A página pública cobre formulários e otimização de entrada, mas não comprova que preencher esta calculadora aumenta pedidos. O endereço `research/mobile-ecommerce` citado pelo Gemini retornou 404 nesta consulta; outro link do relatório era uma busca do Google, não o artigo indicado.
- **Gartner:** o endereço fornecido na pesquisa redirecionou para a página geral de marketing na abertura direta. Resultados de busca mostraram conteúdo relacionado, mas não foram suficientes para conferir a metodologia e as afirmações específicas atribuídas. Não foram usados como prova para nossas prioridades.

A consulta confirma princípios úteis, mas não sustenta classificar toda recomendação como evidência forte ou diretamente transferível. Não houve acesso integral a relatórios pagos, levantamento de mercado local ou certificação financeira.

## 9. Verificações e escopo desta entrega

- Conferidos `js/config.js`, `js/textos.js`, `js/montar.js`, `js/conta.js`, `js/calculadora.js`, testes relacionados e documentos de contexto/G6.
- Executada diretamente a calculadora da raiz com os valores descritos na seção 4.2; o resultado reproduziu os valores registrados.
- `node --test testes/`: 69 testes passaram, zero falhas. Isso verifica a suíte existente, não as hipóteses comerciais nem a experiência visual.
- Criado somente este documento. Código, configuração, identidade visual e documentos canônicos não foram alterados; a pendência anterior em `ESTADO.md` foi preservada. Sem commit, push, publicação, analytics ou contato com terceiros.

As divergências documentais já identificadas entre a loja antiga e a apresentação atual continuam para discussão posterior. A verificação com a família e com compradores reais permanece necessária antes de converter propostas em conteúdo ou implementação.
