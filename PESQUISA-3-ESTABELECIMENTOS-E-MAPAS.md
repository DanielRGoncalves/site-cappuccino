# Pesquisa 3 — estabelecimentos e opções de mapa

Data: 10/11/2026. Análise: Codex, a pedido de Daniel, no mesmo formato das pesquisas 1 e 2.

## 1. Finalidade, base e limites

Selecionar as contribuições da pesquisa do Gemini Argon sobre locais que trabalham com a Cheiro das Águas. Este documento apoia a discussão com Daniel e o Claude Diretor; **não aprova a seção, seu nome, posição, textos, ferramenta ou publicação**. A atualização dos documentos e a definição de uma tarefa ficam para depois.

Fonte recebida: [Markdown colado.md](https://chatgpt.com/library?file_id=libfile_c41186c5a89081918cfabbc8998499e9&account_id=personal), iniciado por “A inclusão de uma seção de estabelecimentos parceiros...”. Base local: branch `prototipo-graza`, HEAD `c8f2d8c2eb8abcfc9b47e8348bdbf216f9cc0722`.

Foram consultados o contexto e partes pertinentes do código/testes, a extração textual da referência Baco e documentação oficial de mapas, preços e políticas. Não foi testada a interação do mapa incorporado, nem o funcionamento de links em aplicativos no celular. Não foram criados mapas, contas, chaves, cadastros ou protótipos. Os dados reais dos estabelecimentos continuam pendentes.

## 2. Conclusão útil para o projeto

**Lista de estabelecimentos com nome, cidade/bairro, modalidade de venda e link externo de mapa é a candidata inicial mais simples de avaliar.** Pode aproveitar a estrutura atual sem nova biblioteca ou serviço incorporado, mas ainda exige tarefa de interface, dados confirmados, ajustes pontuais nos testes e aprovação dos textos.

O mapa deve responder a uma necessidade demonstrada: visualizar distribuição, escolher por proximidade ou facilitar uma manutenção que a família consiga assumir. A quantidade de locais, sozinha, não determina a escolha. A pesquisa não mediu preferência dos visitantes, efeito na degustação ou custo real de implementar cada alternativa.

O ganho principal é separar três decisões: **para quem a seção serve, quais informações estão confirmadas e quem as manterá**. A escolha de tecnologia vem em seguida.

## 3. Encaixe no estado atual

| Situação local | Implicação |
|---|---|
| O objetivo principal continua sendo degustação e negociação com negócios pelo WhatsApp. | A seção deve ajudar essa jornada e também esclarecer onde o consumidor pode experimentar/comprar, sem prometer resultado comercial. |
| `ESTADO.md` registra autorização para discutir a divulgação e espera pelos dados do Davi. | Isso não equivale a autorização de cada local para nome/logo, nem confirma modalidade ou disponibilidade. |
| A proposta registrada é seção entre Como funciona e Contato, com link no menu. | É uma hipótese existente para avaliar; a pesquisa não torna essa posição obrigatória. |
| Dados e textos variáveis vêm de `js/config.js`; a montagem usa criação de elementos e `textContent`. | Manter uma lista canônica de locais e rótulos no config e reaproveitar os padrões seguros de montagem. |
| GSAP e dois plugins locais são as únicas bibliotecas permitidas. | Leaflet ou API JS externa exigem decisão específica; um link externo não é uma biblioteca incorporada. |
| `G4-5` permite nas fontes apenas URLs de `wa.me`, `instagram.com` e `www.w3.org`, com exceções restritas. | Até um link do Google Maps falharia nesse teste. A tarefa deve prever autorização e ajuste estreito para links de mapas, sem liberar scripts/iframes ou qualquer URL arbitrária. |
| `G4-7` protege CSS e módulos aprovados; outros testes verificam textos e montagem. | Nova seção precisa de exceções/testes bem definidos. Não remover proteções para acomodar a mudança. |
| JS próprio ocupa 46.116 de 50.000 bytes no critério atual. | Há 3.884 bytes de margem, não uma prova de que qualquer implementação caberá. Medir o resultado; preservar folga para outras correções. |

## 4. Referência Baco: o que foi possível confirmar

A extração textual de [sejabaco.com/encontre/](https://sejabaco.com/encontre/) consultada mostra uma lista agrupada por municípios e bairros, com nomes e formatos vendidos, instrução para consultar o endereço no mapa e navegação separada para revenda. O link do iframe aponta diretamente para [Google My Maps — ONDE ESTÁ A BACO?](https://www.google.com/maps/d/embed?ehbc=2E312F&mid=1SYcifmHjsjifnHxypwgER6_cBZN0gY0). Assim, o produto incorporado pôde ser identificado, além da inferência do Gemini [M1].

Isso **não comprova** como o administrador mantém mapa e lista, se há integração interna, quantos locais estão ativos ou se o mapa funciona bem no celular. Variações de pontuação não demonstram edição manual em duas bases. A extração textual tampouco mede dificuldade de uso, cookies efetivamente gravados ou desvio de conversão. Contagens aproximadas de locais no histórico e no Gemini divergem; nenhuma foi adotada como dado necessário à nossa decisão.

O aprendizado aproveitável é associar localização e formato vendido. O projeto pode aprender com isso sem copiar WordPress, plugin, iframe, feed social ou toda a arquitetura da referência. A presença de uma lista e de um mapa cria um risco de divergência **se** forem mantidos independentemente; não torna essa divergência inevitável.

## 5. Comparação aplicada e corrigida

| Alternativa | Benefício possível | Custo, dependência e manutenção | Tratamento candidato |
|---|---|---|---|
| Lista/cartões + link externo | Local e modalidade legíveis, com caminho direto para consultar o mapa. | Maps URLs não exige chave; não incorpora mapa na página. Há trabalho de cadastro, conferência e publicação [M2]. | Melhor primeira candidata, condicionada a dados e interface aprovados. |
| Google My Maps incorporado | Múltiplos pontos e edição em ferramenta visual por mantenedor autorizado. | Serviço externo; acesso/permissões e mapa público precisam ser definidos. A lista pode divergir se houver edição independente [M3]. | Avaliar se a manutenção visual e a visão espacial resolverem necessidade real; exige exceção para incorporação. |
| Google Maps Embed API | Mapa incorporado por URL, inclusive modos de lugar, pesquisa e rota. | API com chave; documentação de configuração inclui faturamento habilitado. Requisições Embed são sem cobrança na documentação consultada [M4]. | Não é equivalente a uma coleção arbitrária de parceiros com marcadores controlados; não descartar genericamente como “um local por iframe”. |
| Google Maps JavaScript API | Controle dos marcadores e interações de um conjunto próprio. | Biblioteca externa, configuração Cloud, chave restrita, faturamento e manutenção. Há precificação por SKU [M5]. | Complexidade a justificar, com orçamento e autorização próprios. |
| Leaflet + base OSM + provedor de tiles | Controle de mapa e dados, com escolha da infraestrutura. | Biblioteca, dados e entrega dos mapas são componentes distintos; observar licenças, atribuição, política do provedor e disponibilidade [M6, M7]. | Exige exceção para biblioteca/serviço e experiência técnica antes de adoção. |
| SVG próprio | Representação local da distribuição ou seletor visual de município, sem mapa externo carregado. | Trabalho de desenho e manutenção; não fornece navegação viária. Exige alternativa textual/teclado se interativo. | Opcional se acrescentar compreensão; não é passo obrigatório aos 10–20 locais. |

### Informações técnicas que vale preservar

- **Maps URLs:** usam a mesma sintaxe entre plataformas e não exigem API key. Podem abrir Google Maps no aplicativo ou navegador conforme disponibilidade; não garantem abertura automática do Apple Maps nem início imediato da navegação. Busca e rota são ações diferentes. Ao construir links, usar parâmetros e codificação adequados; nome/endereço ou identificador do lugar ajudam a evitar homônimos [M2].
- **My Maps:** a ajuda oficial consultada prevê até 10.000 linhas/formas/lugares no mapa e 2.000 por camada; não multiplicar limites de camadas para inventar um teto maior. A ferramenta admite importação e reimportação de dados; isso permite discutir uma fonte de atualização controlada, sem pressupor sincronização contínua ou obrigatoriedade de edição duplicada [M3].
- **Embed API:** a documentação inclui modo `search` com resultados de uma pesquisa. Isso corrige a afirmação absoluta de que exibe somente um lugar. Pesquisa aberta não garante uma seleção exata dos estabelecimentos autorizados [M4].
- **Preços da Platform:** a tabela global consultada em 10/11/2026 lista Dynamic Maps com 10.000 eventos mensais sem cobrança e US$ 7 por mil na primeira faixa paga; Embed aparece sem cobrança e sem limite de uso. São condições por SKU e conta, sujeitas a termos e mudanças, não uma autorização para criar conta ou gastar. Geocodificação e Places podem ter cobranças próprias; não equivalem a usar links simples [M5].
- **OpenStreetMap:** a política dos tiles públicos exige atribuição, identificação/cache adequados e proíbe uso pesado/inadequado, sem SLA. Ela não estabelece a proibição genérica de site comercial nem obriga todo uso comercial a contratar um provedor. Um serviço alternativo pode ser apropriado conforme tráfego e requisitos [M6].
- **Peso:** biblioteca compactada em rede não é comparável diretamente com o limite em bytes de arquivos locais usado nos testes. O config ficar fora do teto de JS próprio não elimina seu custo de transferência, análise e manutenção. O iframe também consome rede/CPU mesmo sem entrar nesse teto. As estimativas de 800–1.500 bytes ou “cerca de 1 KB” não foram demonstradas [M7].

## 6. Dados mínimos e manutenção: contribuição prioritária

Definir primeiro um pequeno conjunto de dados comerciais verificáveis. A estrutura abaixo é uma proposta, não um schema aprovado ou autorização para incluir exemplos no site.

| Informação | Finalidade |
|---|---|
| Identificador estável e nome comercial confirmado | Distinguir registros e filiais sem depender de grafia variável. |
| Cidade, bairro e endereço comercial com número/complemento quando necessário | Permitir localização sem obrigar o uso de mapa interativo. |
| Modalidades confirmadas: xícara, pacote ou ambas | Evitar enviar a pessoa ao local com expectativa errada. |
| Link de mapa conferido | Abrir a filial correta; não confiar só em busca genérica. |
| Sabores efetivamente disponíveis, se houver confirmação atual | Diferenciar informação estável de estoque que varia. |
| Estado de publicação e data da confirmação | Permitir ocultar informação não confirmada e revisar o cadastro. |
| Instagram, foto e logo opcionais | Usar somente se houver finalidade, material e autorização para aquele uso. |

Manter evidência de autorização e contato do responsável em registro interno adequado, separado do que será servido ao visitante. **`js/config.js` é um arquivo público:** `ativo: false` oculta o cartão, mas não torna secreto o conteúdo ainda presente no arquivo. Não colocar ali conversas, documentos de autorização, contatos privados ou dados internos desnecessários.

O fluxo mais simples a avaliar é: Davi confirma dados e permissões, mantenedor confere o endereço/link e prepara a alteração, Daniel revisa e publica conforme o processo vigente. Quem fará cada etapa, a disponibilidade e o prazo de atualização ainda precisam ser combinados. A pesquisa presume comunicação diária e alterações pontuais; não temos essas medições.

Revisar por evento real: mudança de endereço, modalidade, autorização, abastecimento ou encerramento da relação. As janelas de 60–90 dias sem reposição sugeridas não definem sozinhas se um local deve ser removido. Distinguir falta temporária de estoque de encerramento e decidir como comunicar. Não prometer atualização em dois minutos ou publicação imediata sem testar o fluxo.

Um painel externo pode ser uma escolha futura se a autonomia comercial trouxer ganho concreto. Deve haver uma fonte canônica e transformação controlada para as visualizações, em vez de instruir duas pessoas a manter listas paralelas. Essa mudança exigiria rever explicitamente a regra atual de config único e as dependências; não faz parte desta entrega.

## 7. Interface e públicos: hipóteses para validar

- Para um comprador comercial, estabelecimentos reais podem ajudar a reconhecer aplicação do produto, mas sua presença **não comprova giro, volume de venda, satisfação ou endosso**. Não chamar uma lista de prova de rentabilidade nem sugerir depoimento inexistente.
- Para quem procura o produto, mostrar endereço e modalidade de maneira clara é mais importante que enfeitar a seção. Confirmar se o local está apto a receber esse público; ser cliente comercial não implica necessariamente ponto de atendimento público.
- “Quem já serve” pode excluir quem só revende pacotes; “Onde encontrar” indica uma utilidade diferente de “Quem trabalha com o produto”. Escolher o nome conforme o conteúdo real e a intenção de divulgação.
- A posição entre Como funciona e Contato e um link no menu são candidatos existentes. Comparar a leitura antes/depois, inclusive o deslocamento do contato e os efeitos dependentes da geometria, conforme a pesquisa 2.
- Preservar a diretriz G6 contra repetição. A sugestão do Gemini de mais um convite à degustação pode ser avaliada, mas não exige um CTA por cartão ou uma promessa de inclusão em “seleção de parceiros”.
- Fotos e logos podem ficar de fora da primeira experiência por simplicidade; não estão definitivamente descartados. Exigem autorização, boa imagem, alt e controle de peso, como os demais recursos.
- Link externo não incorpora o mapa na visita inicial. Um iframe faz requisições ao serviço quando carregado; cookies e outras informações dependem do produto e do navegador. Não concluir automaticamente que existe rastreamento, que um banner é sempre necessário ou que um link dispensa toda análise de privacidade. Nenhuma obrigação jurídica foi determinada nesta avaliação.
- `loading="lazy"` adia carga; carregamento por clique pode adiá-la até uma ação explícita. Nenhum dos dois transforma o serviço em local, remove sua manutenção ou prova conformidade por si só.

## 8. Experimento candidato e critérios para escolher depois

Primeiro, reunir os locais reais e confirmar a finalidade da divulgação. Com dados suficientes e tarefa autorizada, uma pequena lista tipográfica pode validar a utilidade sem iniciar uma integração cartográfica. Três ou seis locais não são um requisito mínimo; os cenários de 3–5, 10–20 e mais de 50 são hipóteses de escala.

| Condição observada | Resposta a avaliar |
|---|---|
| Lista curta, fácil de percorrer | Nome, cidade/bairro, modalidade, endereço e link; sem filtro por padrão. |
| Lista longa ou cidades difíceis de localizar | Agrupamento e, se necessário, filtro/busca, guiados pelo uso. |
| Visitantes precisam comparar proximidade espacial | Experimentar mapa como alternativa à lista, mantendo acesso textual. |
| Atualizações técnicas viram gargalo frequente | Comparar autonomia de ferramenta externa, processo editorial e custo de integração. |

Verificações candidatas para uma futura tarefa:

1. Lista vazia não gera seção nem item de menu sem destino; registro incompleto não gera cartão enganoso. Não usar estabelecimentos fictícios no conteúdo publicado.
2. Nome, endereço e modalidade correspondem à confirmação; dados internos não aparecem em arquivos públicos.
3. O link abre o local correto no navegador e nos celulares disponíveis, inclusive nomes com acentos e filiais semelhantes. Rótulos permitem distinguir cada destino com teclado/leitor de tela.
4. Sem biblioteca ou recurso externo novo no carregamento quando a opção escolhida for lista; sem overflow, foco oculto ou prejuízo à leitura e ao contato nas larguras afetadas.
5. Ajustar apenas as exceções autorizadas de testes/config/HTML/CSS e medir bytes reais, sem tratar a estimativa do relatório como orçamento comprovado.
6. Ensaiar inclusão, alteração e ocultação de um registro com o mantenedor e conferir o resultado após publicação autorizada.

Para avaliar utilidade, perguntar a parceiros e compradores se a seção os ajudou e observar dúvidas/destinos incorretos. Usar as etapas manuais da pesquisa 1. Sem contagem de visitantes, não afirmar que a taxa de conversão do site permaneceu estável ou cresceu. Uma janela de 30–60 dias pode ser um período de observação escolhido, mas não garante amostra ou causalidade.

## 9. Decisões que faltam

1. Quais locais, filiais e modalidades estão confirmados e autorizados? Quais recebem consumidor final?
2. O objetivo inicial é demonstrar presença comercial, orientar consumidores ou ambos?
3. Quem confirma mudanças, quem edita e quem publica? Com que frequência e prazo real?
4. Nome e posição da seção, link no menu e eventual uso de fotos/Instagram.
5. Qual problema concreto justificaria mapa incorporado, painel externo ou busca por proximidade?

O material atual favorece avaliar primeiro lista com links, mas preserva My Maps e outras opções para decisão informada. Não fecha a escolha nem cria a tarefa G9.

## 10. Fontes oficiais e verificação

Consultas em 10/11/2026; links servem para revalidar condições antes de uma decisão de implementação ou gasto.

- **[M1] [Baco — Encontre](https://sejabaco.com/encontre/)** e o endereço do iframe My Maps citado na seção 4. Inspeção textual e identificação de URL; sem validação gráfica/interativa do mapa.
- **[M2] [Google Maps URLs — Get Started](https://developers.google.com/maps/documentation/urls/get-started).** Sintaxe, codificação, ausência de API key e comportamento por plataforma.
- **[M3] [My Maps — limites de lugares/formas](https://support.google.com/mymaps/answer/3433053)** e [importação/reimportação](https://support.google.com/mymaps/answer/3024836). Não foi criada conta nem testada a edição colaborativa.
- **[M4] [Maps Embed API — modos](https://developers.google.com/maps/documentation/embed/embedding-map), [uso/cobrança](https://developers.google.com/maps/documentation/embed/usage-and-billing) e [quickstart](https://developers.google.com/maps/documentation/embed/quickstart).** Não confundir API Embed com My Maps ou iframe obtido pelo compartilhamento comum do Maps.
- **[M5] [Google Maps Platform — tabela global de preços](https://developers.google.com/maps/billing-and-pricing/pricing).** Valores por SKU, em dólares, conforme consulta; não houve avaliação tributária, contratação ou simulação de conta brasileira.
- **[M6] [OSMF — Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/).** Requisitos e ausência de SLA dos tiles raster públicos; outros provedores e APIs têm suas próprias condições.
- **[M7] [Leaflet — site oficial](https://leafletjs.com/) e [instalação](https://leafletjs.com/download).** Tamanho depende de versão, distribuição e compressão; não foi baixada ou adicionada biblioteca.

Conferidos `ESTADO.md`, partes de `js/config.js`, `js/montar.js`, `index.html`, regras G6 e testes `G4-5`, `G4-6` e proteções relacionadas. `node --test testes/`: 69 testes passaram, zero falhas. Isso verifica a versão atual, sem a seção proposta.

Criado somente este documento. Código, regras e configurações foram preservados, assim como a alteração anterior em `ESTADO.md` e os relatórios das pesquisas 1 e 2. Sem commit, push ou publicação. A consolidação e a atualização da documentação ficam para a próxima decisão de Daniel.
