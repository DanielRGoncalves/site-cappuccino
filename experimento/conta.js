import { config } from "../js/config.js";
import { calcularResultado, coposPorPacote, calcularRevenda } from "../js/calculadora.js";
import { formatarReais } from "../js/pedido.js";
import { textos } from "./textos.js";

// Só apresentação e eventos: as regras da conta continuam nos módulos do site atual.
export function montarConta(revenda, reduzido) {
  const rotulos = config.textos.padarias;
  const frase = textos.conta;
  const tipo = revenda ? "revenda" : "xicara";
  const criar = (tag, classe, texto) => {
    const no = document.createElement(tag);
    if (classe) no.className = classe;
    if (texto !== undefined) no.textContent = texto;
    return no;
  };
  const bloco = criar("section", "conta");
  bloco.id = `conta-${tipo}`;
  const titulo = criar("h3", "conta-titulo", frase.titulo);
  titulo.id = `${bloco.id}-titulo`;
  bloco.setAttribute("aria-labelledby", titulo.id);
  const sentenca = criar("p", "conta-frase");
  const dicas = criar("div", "conta-dicas");
  const dicaCompra = criar("p", "", revenda ? rotulos.dicaPacote : rotulos.dicaKg);
  dicaCompra.id = `${bloco.id}-dica-compra`;
  const dicaVenda = criar("p", "", revenda ? config.calculadora.revenda.exemploPrecoVenda : rotulos.dicaPrecoXicara);
  dicaVenda.id = `${bloco.id}-dica-venda`;
  dicas.append(dicaCompra, dicaVenda);

  function campo(nome, rotulo, dica, seletor = false) {
    const grupo = criar("span", "conta-campo");
    const entrada = criar(seletor ? "select" : "input");
    entrada.id = `${bloco.id}-${nome}`;
    const label = criar("label", "sr-only", rotulo);
    label.htmlFor = entrada.id;
    entrada.setAttribute("aria-describedby", dica);
    if (!seletor) {
      entrada.type = "text";
      entrada.inputMode = "decimal";
      entrada.autocomplete = "off";
    }
    grupo.append(label, entrada);
    return { grupo, entrada };
  }

  const compra = campo("compra", revenda ? rotulos.precoPacote : rotulos.precoKg, dicaCompra.id);
  const venda = campo("venda", revenda ? rotulos.precoVendaPacote : rotulos.precoVenda, dicaVenda.id);
  venda.grupo.append(",");
  sentenca.append(`${frase.compra} `, compra.grupo, " ");
  let tamanho;
  if (revenda) {
    sentenca.append(`${frase.pacote} `, venda.grupo);
  } else {
    tamanho = campo("tamanho", rotulos.tamanhoXicara, dicaCompra.id, true);
    for (const { ml } of config.calculadora.xicara.tamanhos) {
      const opcao = criar("option", "", `${ml} ml`);
      opcao.value = ml;
      opcao.selected = ml === config.calculadora.xicara.tamanhoInicialMl;
      tamanho.entrada.append(opcao);
    }
    sentenca.append(`${frase.xicara} `, tamanho.grupo, ` ${frase.venda} `, venda.grupo);
  }

  const resultado = criar("span", "conta-resultado");
  resultado.setAttribute("aria-hidden", "true");
  const anuncio = criar("span", "sr-only");
  anuncio.setAttribute("aria-live", "polite");
  anuncio.setAttribute("aria-atomic", "true");
  const pendente = criar("p", "conta-pendente");
  const ganho = criar("strong", "conta-ganho");
  resultado.append(`${frase.ganho} `, ganho, ` ${revenda ? frase.porPacote : frase.porXicara}`);
  sentenca.append(" ", resultado);
  const detalhes = criar("dl", "conta-detalhes");
  function detalhe(chave) {
    const grupo = criar("div");
    const valor = criar("dd");
    grupo.append(criar("dt", "", rotulos[chave]), valor);
    detalhes.append(grupo);
    return { grupo, valor };
  }
  const copos = revenda ? null : detalhe("copos");
  const custo = revenda ? null : detalhe("custo");
  const margem = detalhe("margem");
  const porKg = revenda ? null : detalhe("ganhoPacote");
  const percentual = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

  function atualizar() {
    const xicara = revenda ? null : config.calculadora.xicara.tamanhos.find(({ ml }) => ml === Number(tamanho.entrada.value));
    const conta = revenda
      ? calcularRevenda(venda.entrada.value, compra.entrada.value)
      : calcularResultado(venda.entrada.value, compra.entrada.value, config.calculadora.xicara.pesoGramas, xicara.gramas);
    if (copos) copos.valor.textContent = coposPorPacote(config.calculadora.xicara.pesoGramas, xicara.gramas);
    const anterior = ganho.textContent;
    ganho.textContent = conta ? formatarReais(conta.ganhoCentavos) : frase.vazio;
    const semResultado = revenda ? rotulos.semResultadoRevenda : rotulos.semResultado;
    pendente.textContent = semResultado;
    pendente.style.visibility = conta ? "hidden" : "visible";
    anuncio.textContent = conta ? resultado.textContent : semResultado;
    margem.valor.textContent = conta ? `${percentual.format(conta.margemPercentual)}%` : "—";
    if (custo) custo.valor.textContent = conta ? formatarReais(conta.custoCentavos) : "—";
    if (porKg) porKg.valor.textContent = conta ? formatarReais(conta.ganhoPacoteCentavos) : "—";
    ganho.getAnimations().forEach((animacao) => animacao.cancel());
    if (conta && anterior !== ganho.textContent && !reduzido.matches) {
      ganho.animate([{ opacity: .45 }, { opacity: 1 }], { duration: 180 });
    }
  }
  bloco.append(titulo, sentenca, anuncio, pendente, dicas, detalhes);
  // As dicas ocupam a mesma linha reservada; só a do campo em foco aparece.
  bloco.addEventListener("focusin", (evento) => {
    const id = evento.target.getAttribute("aria-describedby");
    for (const dica of dicas.children) dica.classList.toggle("ativa", dica.id === id);
  });
  bloco.addEventListener("focusout", () => {
    for (const dica of dicas.children) dica.classList.remove("ativa");
  });
  if (!revenda) {
    if (config.calculadora.xicara.aConfirmar) bloco.append(criar("p", "conta-aviso", rotulos.avisoExemplo));
    bloco.append(criar("p", "conta-aviso", rotulos.aviso));
  }
  bloco.addEventListener("input", atualizar);
  bloco.addEventListener("change", atualizar);
  reduzido.addEventListener("change", () => ganho.getAnimations().forEach((animacao) => animacao.cancel()));
  atualizar();
  return bloco;
}
