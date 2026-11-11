# Pesquisa 2 — celular, animações e qualidade verificável

Data: 10/11/2026. Análise: Codex, a pedido de Daniel, seguindo o formato da pesquisa 1.

## 1. Finalidade e situação

Selecionar contribuições da pesquisa do Gemini Argon sobre acessibilidade, celular e desempenho, confrontando as recomendações com a implementação. Este é um documento de apoio à discussão com Daniel e o Claude Diretor. **Não autoriza correções, redesign, mudanças nas animações ou novos critérios obrigatórios.** A atualização dos documentos do projeto continua para uma etapa posterior.

Base local: branch `prototipo-graza`, HEAD `c8f2d8c2eb8abcfc9b47e8348bdbf216f9cc0722`. Fonte recebida: [Texto colado(1).txt](https://chatgpt.com/library?file_id=libfile_61d9d459fc288191b603085e44f31807&account_id=personal), iniciado por “A avaliação técnica do site Cheiro das Águas exige separar...”.

O Gemini relata uma captura HTTP estática, sem executar JavaScript ou renderizar a página. Isso pode levantar dúvidas sobre a estrutura entregue, mas não comprova defeitos de foco, movimentos, leitura assistiva, contraste renderizado ou lentidão. Suas métricas foram corretamente declaradas como não medidas.

Nesta análise foram examinados HTML, CSS, módulos e testes locais e consultadas fontes oficiais pontuais. A tentativa de abrir o servidor local no navegador automatizado terminou sem conexão; **nenhuma verificação visual ou de execução no navegador foi concluída**. O servidor temporário foi encerrado. Não foram medidos Lighthouse, INP, LCP, CLS, quadros ou comportamento de aparelhos físicos. As constatações abaixo identificam quando a evidência é somente leitura do código.

## 2. Principal contribuição

A pesquisa vale principalmente como roteiro de verificação: separar pausa manual, preferência por movimento reduzido, navegação por teclado, leitura assistiva, carregamento com falhas e comportamento da viewport móvel. A existência de um botão ou atributo não comprova o efeito completo.

Três pontos merecem investigação prioritária por ligação direta com o código: recuperação quando JavaScript está habilitado mas um módulo não carrega; atualização da preferência de movimento na cena da gota; e alcance real do comando “Pausar animações”. São candidatos a tarefas futuras, não uma autorização para alterar a coreografia já aprovada.

## 3. O que já existe e o que a pesquisa não considerou

| Tema | Evidência local | Interpretação para o planejamento |
|---|---|---|
| Versão sem JavaScript | `index.html` contém `<noscript>` com título, apresentação, foto, entrega, pagamento, dados legais e links de WhatsApp/Instagram. | A ausência de texto nos contêineres principais antes do JS não comprova ausência de conteúdo essencial com JS desativado. Conferir a renderização dessa versão. |
| Compartilhamento | `title`, descrição, canonical e metatags Open Graph/Twitter, inclusive imagem absoluta, estão gravados no HTML. `G4-2` testa sincronização. | Preservar; verificar o domínio e a prévia real após publicação, sem tratar as metatags como ausentes. |
| Link de salto | O HTML tem `.pular` com `href="#conteudo"`, inicialmente vazio; `montar()` define seu texto pelo config. O CSS o revela ao foco. | Verificar comportamento com teclado, momento de disponibilidade e cenário sem JS; o HTML inicial sozinho não prova defeito na página inicializada. |
| Marca animada | `letreiro()` cria um contêiner com `role="img"` e nome acessível completo; letras têm `aria-hidden`. SVGs decorativos também são ocultados. | A proteção contra leitura fragmentada já existe no código. Confirmar anúncio real, em vez de recomendar sua criação do zero. |
| Arco de início/origem | `js/palco.js` usa CSS `sticky`, progresso próprio e `requestAnimationFrame`; não é um pin do ScrollTrigger. | Investigar esse módulo e seus eventos de resize. Uma configuração global do GSAP não controla automaticamente o arco. |
| Redução de movimento | O palco observa mudanças da consulta de mídia; a calculadora cancela sua animação e consulta o estado atual. A cena da gota recebe um booleano inicial. | Cobertura diferente entre módulos; testar carregamento e alternância com a página aberta separadamente. |
| Pausa | Botão nativo com `aria-pressed`, rótulo alternado e classe `pausado`. CSS pausa algumas animações e remove o empilhamento sticky dos cartões; o método da cena controla `pingar`. | Há implementação real, mas o alcance do comando não é global. Não afirmar que ele para todas as linhas do tempo. |
| Calculadoras | Inputs possuem label associado, `inputMode="decimal"` e região `aria-live="polite"` separada do resultado visual. | Atributos existentes não comprovam teclado virtual apropriado, conforto da leitura ou ausência de anúncio excessivo. |
| Viewport, fontes e fotos | CSS usa `svh` em vários trechos; fontes têm `font-display: swap`; imagens montadas têm dimensões e lazy fora do hero. | Não propor essas técnicas como se estivessem ausentes. Medir os problemas restantes antes de otimizar. |
| Regressão e peso | A suíte inclui verificações de metadados, referências, montagem, limites de bytes e preservação dos módulos aprovados. | São proteções úteis, com alcance específico; não constituem auditoria completa de acessibilidade ou desempenho. |

## 4. Pontos concretos para investigar

### 4.1. JavaScript desativado e módulo indisponível são cenários distintos

O `<noscript>` é apropriado para scripting desativado; não é um tratamento geral de erro de carregamento [T1]. `js/pagina.js` importa estaticamente montagem, textos, cena e palco. Se o módulo de entrada ou uma dependência obrigatória falhar antes da execução, a montagem não acontece e o navegador continua com JS habilitado: o conteúdo do `<noscript>` não passa automaticamente a servir de alternativa visual.

Essa vulnerabilidade de recuperação é uma inferência da estrutura, ainda sem reprodução visual nesta entrega. Futuro teste: bloquear deliberadamente o módulo inicial e, separadamente, uma dependência de animação, mantendo o JS ativo; conferir se produto e contato essencial continuam disponíveis. Depois comparar com o JS realmente desativado e com a indisponibilidade de uma biblioteca `vendor/`.

O projeto já trata a ausência dos objetos GSAP ao inicializar a cena, ocultando a camada da gota após a montagem. Preservar a distinção entre essa degradação controlada e a falha de uma importação ES. Uma solução futura precisa manter config único, sincronização e ausência de conteúdo duplicado acessível; colocar títulos no HTML indiscriminadamente pode gerar duplicação.

### 4.2. Preferência alterada enquanto a página está aberta

Em `js/pagina.js`, `reduzido` é uma cópia de `movimento.matches` feita na inicialização, repassada a `iniciarCena()`. O ramo de movimento reduzido em `js/cena.js` é escolhido uma vez; não há ali observador de mudança de mídia ou rotina de desmontagem/remontagem. Já `palco.js` e `conta.js` escutam mudanças.

Futuro teste: carregar no modo normal, chegar à cena, mudar para movimento reduzido sem recarregar e verificar gota, pin, transformações e conteúdo; repetir no sentido inverso. A cobertura estática incompleta é verificável no código; o efeito final e a severidade dependem de reprodução no navegador. Preservar o estado inicial reduzido já previsto: marca final legível, sem gota e sem pin.

### 4.3. O que “Pausar animações” deve interromper

O método `cena.pausar()` pausa/retoma a gotinha recorrente da torneira. Não desliga diretamente ticker, nascimento, linha do derretido ou gatilhos de entrada e balanço. O palco também não consulta a classe `pausado`. O CSS para a faixa e outras animações CSS e desativa o sticky dos cartões; portanto, há efeitos além do método da cena, mas não uma pausa de todo movimento.

Antes de mudar o comportamento, definir a intenção do controle: interromper efeitos automáticos, oferecer uma experiência geral com movimento reduzido ou ambos. Testar sua ativação em estados inicial, intermediário e final e confirmar que a leitura e os controles continuam disponíveis. Não aplicar `progress(1)` em todas as linhas do tempo sem avaliar as consequências para posições, gatilhos, foco e retomada.

A WCAG 2.2.2 considera condições específicas de início automático, duração e apresentação paralela; animações ligadas a interações também precisam ser analisadas segundo sua natureza, inclusive 2.3.3, de nível AAA [T2, T3]. A existência de movimento após a pausa não basta, isoladamente, para declarar violação AA.

### 4.4. Resize, teclado e barra dinâmica no celular

`palco.js` recalcula geometria em resize; `pagina.js` mede os cartões usando `innerHeight`; `cena.js` usa altura da janela e atualização do ScrollTrigger. Isso justifica reproduzir abertura do teclado, rotação e retração da barra do navegador em aparelho real. Não comprova que já ocorram saltos.

A proposta do Gemini de aplicar primeiro `ignoreMobileResize: true` não deve virar correção automática: a documentação alerta para posições de gatilho imprecisas ao evitar refresh [T4], e a opção não resolve os listeners próprios do palco ou dos cartões. `svh` já está em uso; examinar a combinação entre CSS e medidas JS [T5].

## 5. Ajustes necessários nas recomendações da pesquisa

- **Reutilização de provas:** ausência de mudanças em `cena.js` não garante geometria idêntica. Texto, fotos, fontes, CSS e montagem podem alterar alturas e invalidar provas. Reutilizar por dependências e condições compatíveis, não apenas pelo nome do arquivo alterado.
- **Arco e gota:** a pesquisa mistura os dois mecanismos. A fixação GSAP está no bloco da marca; o arco usa lógica própria. Investigar no módulo responsável.
- **Foco:** WCAG 2.4.11 AA exige que o componente não fique inteiramente oculto por conteúdo do autor. Visibilidade integral corresponde ao critério aprimorado AAA; rolagem suave não é obrigação [T6]. É possível adotar uma meta interna mais exigente, identificando-a como tal.
- **Métricas:** os referenciais de boa experiência são LCP até 2,5 s, INP até 200 ms e CLS até 0,1, avaliados no percentil 75 de visitas, separando dispositivos [T7]. Um ensaio local é evidência de laboratório, não aprovação da experiência de todos os usuários.
- **INP e rolagem:** INP cobre clique, toque e teclado; não mede diretamente o gesto de rolagem nem o tempo total para o aplicativo WhatsApp abrir [T8]. Avaliar fluidez por quadros/perfil e resposta dos controles por interações reais.
- **Orçamento por quadro:** 60 Hz oferece cerca de 16,7 ms para o quadro completo, incluindo trabalho do navegador; não é uma franquia exclusiva de CPU/JS. Tarefas acima de 50 ms ajudam a diagnosticar, mas ausência delas não garante fluidez [T9].
- **Ferramentas e testes:** Node, Lighthouse e ferramentas de acessibilidade têm escopos distintos. Os 69 testes não comprovam sintaxe ARIA completa, contraste renderizado nem toda a correção matemática. Há testes numéricos que importam a versão `antigo/`; avaliar a cobertura da raiz ao planejar mudanças de cálculo. A WAI ressalta a necessidade de julgamento humano e o risco de falsos resultados [T10].
- **“LCP instantâneo” e “impacto zero”:** conteúdo estático pode reduzir dependência de JS, mas fonte, imagem, rede e renderização ainda importam. Não há garantia de ganho ou sincronização sem custo.
- **Otimizações gráficas:** restringir filtros, promover camadas ou pausar fora de tela são experiências condicionadas a um gargalo medido. O filtro da marca já é restrito por CSS ao desktop. `will-change` amplo pode consumir recursos; preservar o efeito aprovado e comparar antes/depois.
- **Normas e referências:** a matriz da pesquisa é um ponto de partida, não uma declaração de conformidade. Este levantamento não conferiu todos os critérios WCAG citados nem todas as versões de navegador.

## 6. Rotina proporcional candidata

Esta proposta aproveita as provas existentes e pode ser incorporada ao planejamento após aprovação; não altera as regras atuais.

| Tipo de mudança | Conferência proporcional sugerida | Quando ampliar |
|---|---|---|
| Documento de análise | Coerência com fontes, código e limites; verificar somente os arquivos autorizados. | Se contiver instruções executáveis, conferir efeitos e permissões. |
| Texto, configuração ou imagem | Suíte rápida; revisar o trecho montado, quebras e resoluções afetadas; conferir links/metadados se atingidos. | Se mudar geometria de trechos animados, repetir a prova de movimento dependente. Cor exige contraste; valores exigem conta independente. |
| Menu, calculadora, layout ou movimento | Suíte mais cenário focal com teclado e mídia reduzida; estados de entrada/saída e retorno; perfil se houver risco de desempenho. | Aparelho real para teclado, toque, orientação ou barra dinâmica; leitor de tela para semântica e anúncios afetados. |
| Publicação autorizada | Conferir versão publicada, recursos efetivamente carregados, console, fluxo curto de contato e metadados. | Prévia real no WhatsApp e testes de aparelho conforme o impacto. Resposta HTTP 304 válida de cache não é falha por não ser 200. |

Registrar no relatório existente: código avaliado (commit e diff relevante se houver pendências), ambiente, viewport, movimento, rede/cache, cenário, resultado original e limitações. Não criar formulário ou ferramenta adicional por rotina. Cache e versão são particularmente importantes para distinguir código local de publicado.

## 7. Pequeno roteiro para uma futura tarefa de verificação

| Cenário | Procedimento | Estado desta entrega |
|---|---|---|
| Conteúdo essencial | Comparar JS desativado, módulo inicial bloqueado e biblioteca de animação ausente; conferir título e contato. | `<noscript>` e dependências conferidos no código; efeito visual pendente. |
| Mídia reduzida | Carregar em ambos os modos; alternar sem reload nos dois sentidos; conferir pin e leitura. | Diferença entre módulos identificada por código; reprodução pendente. |
| Pausa | Acionar antes, durante e após cada efeito; rolar e retomar. | Alcance do método e do CSS identificado; interação pendente. |
| Teclado e foco | Percorrer menu, salto, CTAs, detalhes e contas com Tab/Shift+Tab/Enter/Esc; conferir posição após navegação. | Rótulos e tratamento existentes lidos; teste manual pendente. |
| Leitura assistiva | Ouvir marca, seções, estado do menu e resultado da conta sem anúncio excessivo. | Semântica existente lida; NVDA, VoiceOver e TalkBack não testados. |
| Celular | Abrir teclado, inserir vírgula/ponto, usar ambos os tamanhos de orientação e rolar em ida/volta. | Android e iPhone físicos não testados. |
| Desempenho | Capturar carregamento e interações nos trechos relevantes, com condições registradas e comparação equivalente. | Métricas não medidas. |

Começar pelos cenários com ligação concreta ao código; não exigir todos os dispositivos em cada ajuste. Se algum aparelho não estiver disponível, registrar a lacuna. Não atribuir notas de auditoria nem declarar WCAG AA com base nesta seleção.

As proteções `G4-7` exigem igualdade dos módulos de movimento com o protótipo. Uma futura correção nesses arquivos precisará de escopo autorizado e revisão consciente dos testes, preservando a proteção contra regressões em vez de simplesmente removê-la.

## 8. Fontes oficiais consultadas

Consultas pontuais em 10/11/2026. As páginas Understanding explicam os critérios; o texto normativo é a [WCAG 2.2](https://www.w3.org/TR/WCAG22/). A lista não representa auditoria integral do padrão.

- **[T1] [MDN — noscript](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/noscript):** distingue scripting habilitado/desabilitado; dá base para separar alternativa sem JS de recuperação de erro.
- **[T2] [WAI — Pause, Stop, Hide, 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html):** condições e alternativas de controle de movimento automático.
- **[T3] [WAI — Animation from Interactions, 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html):** nível AAA e tratamento de animação não essencial ligada a interação.
- **[T4] [GSAP — ScrollTrigger.config](https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.config()/):** alcance e contrapartida de `ignoreMobileResize`.
- **[T5] [MDN — unidades de comprimento/viewport](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length):** diferenças entre viewport pequena, grande e dinâmica.
- **[T6] [WAI — Focus Not Obscured (Minimum), 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html):** limite do requisito AA e distinção da versão aprimorada.
- **[T7] [web.dev — Web Vitals](https://web.dev/articles/vitals):** métricas, limiares e percentil de avaliação.
- **[T8] [web.dev — INP](https://web.dev/articles/inp):** interações cobertas, medição em laboratório/campo e limites de interpretação.
- **[T9] [Chrome DevTools — Analyze runtime performance](https://developer.chrome.com/docs/devtools/performance):** uso de perfil, quadros e desaceleração para investigação.
- **[T10] [WAI — Selecting Evaluation Tools](https://www.w3.org/WAI/test-evaluate/tools/selecting/):** ferramentas ajudam, mas não determinam acessibilidade sozinhas.

## 9. Verificações e arquivos preservados

- Leitura de `index.html`, `css/estilo.css`, `js/pagina.js`, `js/montar.js`, `js/palco.js`, `js/cena.js`, `js/conta.js` e testes pertinentes.
- Conferência local da presença de `<noscript>`, título e link de WhatsApp nesse bloco, metatags estáticas e rótulo acessível unificado da marca.
- `node --test testes/`: 69 testes passaram, zero falhas. Essa execução não substitui os cenários pendentes da seção 7.
- Criado somente este documento. Preservados o código, os documentos canônicos, a alteração anterior em `ESTADO.md` e o relatório da pesquisa 1. Sem commit, push, publicação ou novas dependências.

Próxima decisão: combinar esta análise com a pesquisa 3 e a análise de conversão, então escolher verificações/correções concretas e atualizar a documentação quando Daniel solicitar.
