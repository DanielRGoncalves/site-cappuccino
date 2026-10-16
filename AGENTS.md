# AGENTS.md — regras para o executor

Você implementa **uma tarefa por vez** de `tarefas.md`. O planejamento e os critérios são definidos fora daqui; seu trabalho é executar com precisão e provar que funcionou.

## Antes de começar

1. Leia `brief.md` (fatos e textos), `criterios.md` (o que é "pronto") e só a tarefa pedida em `tarefas.md`.
2. Se a tarefa contradisser o brief ou os critérios, ou se faltar informação, **pare e pergunte**. Não escolha sozinho.

## Escopo

- Faça **só** a tarefa pedida. Nada de refatorar, renomear, reformatar ou "melhorar" o que a tarefa não pede.
- Não mude a identidade visual (cores, fontes, estilo), a menos que a tarefa peça.
- Não adicione bibliotecas, frameworks, CDNs, fontes externas, analytics nem build.
- Se notar um problema fora do escopo, **anote no relatório**. Não corrija.

## Stack e estrutura

HTML, CSS e JS puros. JS em **ES modules** (`<script type="module">`). Sem backend.

```
index.html          estrutura; no <head>, só as meta tags marcadas
css/style.css       todo o CSS
js/config.js        ÚNICA fonte de marca, contatos, preços, produtos, fotos e textos variáveis
js/main.js          inicialização e montagem da página
js/calculadora.js   funções puras: custo por xícara, ganho e margem (sem DOM)
js/preparo.js       funções puras: dados do preparo a partir do config
js/pedido.js        funções puras: montar o objeto do pedido, a mensagem e o link do WhatsApp, formatar R$
img/                imagens otimizadas (img/produtos/, logo, og)
testes/*.test.mjs   testes com `node --test` (sem dependências)
README.md           como mudar preço, foto e agenda, e como publicar
```

Funções com regra de negócio (agenda, mensagem, preço) ficam em módulos **sem acesso ao DOM**, para que o Node consiga testá-las.

## Regras fixas

1. **Config único.** Marca, domínio, Instagram, WhatsApp, preços, produtos, fotos, formas de pagamento, dados legais e textos variáveis vêm de `js/config.js`. Exceção: as meta tags do `<head>`, dentro de um bloco entre `<!-- SINCRONIZAR COM js/config.js -->` e `<!-- /SINCRONIZAR -->`.
2. **Preços** ficam como número em centavos no config (ex.: `2200`). Formate com `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`.
3. **Sem promessa de entrega.** Nunca crie opção, campo ou texto que prometa entrega, envio, frete, prazo, pedido mínimo ou nota fiscal, nem campo de endereço. **Exceções aprovadas no brief, usadas exatamente como estão:** a linha "Entrega ou retirada: a combinar." no fim da mensagem do pedido e as respostas do FAQ que dizem que a forma de receber é combinada pelo WhatsApp.
4. **Não invente fatos**: preços, ingredientes, histórias, depoimentos, feiras, benefícios de saúde. Use só o brief. Se faltar algo, deixe o campo vazio, esconda a seção e registre no relatório.
5. **Textos do brief** são usados como estão.
6. **Datas:** converta `"AAAA-MM-DD"` à mão para data local (`new Date(ano, mes - 1, dia)`). **Nunca** use `new Date("AAAA-MM-DD")`, porque isso lê como UTC e erra o dia no Brasil. As funções da agenda recebem `hoje` como parâmetro. A página aceita `?hoje=AAAA-MM-DD` para teste manual.
7. **Segurança:** dados do `agenda.json` e qualquer texto digitado pelo usuário entram no DOM com `textContent` ou `createElement`, nunca com `innerHTML`. Links do WhatsApp são montados só com `encodeURIComponent`.
8. **Acessibilidade:** botões têm `<button>` e rótulo, foco visível, `aria-expanded` em quem abre e fecha algo, `alt` em imagens.
9. **Sem `overflow-x: hidden` em `html` ou `body`.** Corrija a causa do transbordo.
10. **Imagens:** toda `<img>` tem `width`, `height` e `alt`. Use `loading="lazy"` fora da primeira tela.
11. **Apagar arquivos** só com `git rm`.
12. **Pedido como dados.** `js/pedido.js` cria um objeto de pedido (itens, quantidades, subtotais, total, cliente) e dele gera a mensagem e o link do WhatsApp. Não implemente pagamento online.
13. **Foco em padarias.** O brief manda: nada de feira, agenda ou retirada na feira no site.
14. **Contradição entre documentos:** se `AGENTS.md`, `brief.md`, `criterios.md` e `tarefas.md` se contradisserem, **pare e pergunte**, como já manda a seção "Antes de começar".

## Formato do `agenda.json` (SUSPENSO — não crie `agenda.json` nem `js/agenda.js`)

> Mantido só como referência, caso a agenda de feiras volte.

```json
{
  "atualizado_em": "2026-10-15",
  "feiras": [
    {
      "tipo": "semanal",
      "dia_semana": "sabado",
      "desde": "2026-11-07",
      "ate": null,
      "excecoes": ["2026-11-14"],
      "inicio": "06:00",
      "fim": "12:00",
      "nome": "Nome da feira",
      "bairro": "Bairro",
      "endereco": "Rua tal, s/n",
      "mapa": "https://maps.google.com/?q=..."
    },
    {
      "tipo": "data",
      "data": "2026-11-20",
      "inicio": "16:00",
      "fim": "21:00",
      "nome": "Feira especial",
      "bairro": "Bairro",
      "endereco": "",
      "mapa": ""
    }
  ]
}
```

- `dia_semana`: `domingo`, `segunda`, `terca`, `quarta`, `quinta`, `sexta` ou `sabado`.
- `ate`, `excecoes`, `endereco` e `mapa` são opcionais.
- O arquivo publicado começa com `"feiras": []`. **Não coloque feiras de exemplo no arquivo real**; o exemplo fica no `README.md` e nos testes.

## Como testar

- Servidor local: `python -m http.server 8000` (ou `py -m http.server 8000` no Windows) e abra `http://localhost:8000`. Abrir via file:// não funciona com módulos e `fetch`.
- Testes: `node --test testes/`.
- Antes de entregar, rode os testes e confira no navegador os critérios citados pela tarefa.

## Git

- **Um commit por tarefa**, com a mensagem `Tn: resumo curto` (ex.: `T3: agenda a partir de agenda.json`).
- Não faça push, rebase nem reescreva o histórico. Quem revisa e publica é o Daniel.

## Relatório final (obrigatório)

Responda nesta ordem:

1. **Arquivos alterados**, com uma linha sobre cada um.
2. **Critérios:** para cada ID que a tarefa cita, diga ✅ ou ❌ e **como verificou** (comando e resultado, ou o passo manual).
3. **O que precisa de verificação humana** (ex.: teste no celular real).
4. **Pendências e problemas fora do escopo** que você notou.
5. **O que você NÃO fez** e por quê.

Não declare um critério como ✅ sem ter verificado.
