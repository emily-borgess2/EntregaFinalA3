var planoEscolhido = null;

var CHAVE_CARRINHO = "cognify_carrinho_demo";
var CHAVE_APOS_CADASTRO = "cognify_apos_cadastro";

function entrarCadastro(destinoAposCadastro) {
  if (destinoAposCadastro === "pagamento") {
    localStorage.setItem(CHAVE_APOS_CADASTRO, "pagamento");
    document.getElementById("btnSubmitCadastro").textContent =
      "Continuar para o pagamento";
  } else {
    localStorage.setItem(CHAVE_APOS_CADASTRO, "planos");
    document.getElementById("btnSubmitCadastro").textContent =
      "Continuar para os planos";
  }
  mostrarPagina("tela-cadastro");
}

function precoPlanoMensal(cod) {
  if (cod === "basico") return 0;
  if (cod === "intermediario") return 29;
  if (cod === "premium") return 49;
  return 0;
}

function contarItensCarrinho() {
  var lista = obterCarrinho();
  var o = { basico: 0, intermediario: 0, premium: 0 };
  for (var i = 0; i < lista.length; i++) {
    var k = lista[i];
    if (o[k] !== undefined) {
      o[k]++;
    }
  }
  return o;
}

function planoPrincipalDoCarrinho() {
  var c = contarItensCarrinho();
  if (c.premium > 0) return "premium";
  if (c.intermediario > 0) return "intermediario";
  if (c.basico > 0) return "basico";
  return "basico";
}

function montarTelaPagamento() {
  document.getElementById("formPagamento").reset();
  var msgPg = document.getElementById("msgErroPagamento");
  msgPg.hidden = true;
  msgPg.textContent = "";

  var el = document.getElementById("listaResumoPagamento");
  var totalEl = document.getElementById("totalPagamento");
  var lista = obterCarrinho();

  if (lista.length === 0) {
    el.innerHTML =
      '<p class="ajuda">Seu carrinho está vazio. Volte em <strong>Conheça os planos</strong> para adicionar itens.</p>' +
      '<button type="button" class="btn btn-secundario" id="btnIrPlanosPagamento">Ver planos</button>';
    totalEl.textContent = "";
    document.getElementById("btnIrPlanosPagamento").onclick = function () {
      mostrarPagina("tela-saiba-mais");
    };
    return;
  }

  var contagem = contarItensCarrinho();
  var nomes = nomesPlanos();
  var html = '<ul class="lista-resumo-pagamento">';
  var total = 0;
  var ordem = ["basico", "intermediario", "premium"];
  for (var t = 0; t < ordem.length; t++) {
    var cod = ordem[t];
    var q = contagem[cod];
    if (q < 1) continue;
    var unit = precoPlanoMensal(cod);
    var sub = unit * q;
    total += sub;
    var precoTxt =
      unit === 0 ? "grátis (demo)" : "R$ " + unit + "/mês x " + q + " = R$ " + sub + "/mês";
    html += "<li>" + q + "x " + nomes[cod] + " — " + precoTxt + "</li>";
  }
  html += "</ul>";
  el.innerHTML = html;
  totalEl.textContent = "Total estimado (demo): R$ " + total + "/mês";
}

function obterCarrinho() {
  try {
    var txt = localStorage.getItem(CHAVE_CARRINHO);
    if (!txt) return [];
    var arr = JSON.parse(txt);
    if (Array.isArray(arr)) return arr;
  } catch (e) {
  }
  return [];
}

function salvarCarrinho(lista) {
  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(lista));
  atualizarContadorCarrinho();
}

function adicionarPlanoNoCarrinho(codigo) {
  var lista = obterCarrinho();
  lista.push(codigo);
  salvarCarrinho(lista);
}

function atualizarContadorCarrinho() {
  var n = obterCarrinho().length;
  var badges = document.querySelectorAll(".contador-carrinho");
  for (var b = 0; b < badges.length; b++) {
    badges[b].textContent = String(n);
  }
}

function nomesPlanos() {
  return { basico: "Básico", intermediario: "Intermediário", premium: "Premium" };
}

function mostrarResumoCarrinho() {
  var lista = obterCarrinho();
  if (lista.length === 0) {
    alert("Carrinho vazio. Clique no ícone do carrinho no card do plano para adicionar.");
    return;
  }
  var nomes = nomesPlanos();
  var linhas = [];
  for (var i = 0; i < lista.length; i++) {
    var cod = lista[i];
    linhas.push("- " + (nomes[cod] || cod));
  }
  alert("Itens no carrinho (protótipo):\n\n" + linhas.join("\n"));
}

function mostrarPagina(id) {
  var paginas = document.querySelectorAll(".pagina");
  for (var i = 0; i < paginas.length; i++) {
    paginas[i].classList.remove("ativa");
  }
  var alvo = document.getElementById(id);
  if (alvo) {
    alvo.classList.add("ativa");
  }
  if (id === "tela-pagamento") {
    montarTelaPagamento();
  }
  if (id === "tela-jogos") {
    montarTelaJogos();
  }
  atualizarContadorCarrinho();
}


var planoAtualJogos = "basico";
var perfilAtualJogos = "todos";

var limitesJogosPorPlano = {
  basico: 4,
  intermediario: 8,
  premium: 12
};

var jogosCognify = [
  {
    titulo: "Missão Foco Rápido",
    perfis: ["tdah"],
    objetivo: "Treinar atenção sustentada, tempo de resposta e controle de impulsividade.",
    indicado: "Atividades curtas, metas rápidas e feedback visual imediato."
  },
  {
    titulo: "Sequência Zen",
    perfis: ["tdah", "tea"],
    objetivo: "Organizar etapas, seguir rotina e reduzir distrações durante a tarefa.",
    indicado: "Bom para crianças que precisam de previsibilidade e instruções objetivas."
  },
  {
    titulo: "Letras em Movimento",
    perfis: ["dislexia"],
    objetivo: "Trabalhar reconhecimento de letras, sílabas e associação som-imagem.",
    indicado: "Foco em leitura inicial, consciência fonológica e reforço visual."
  },
  {
    titulo: "Memória de Emoções",
    perfis: ["tea"],
    objetivo: "Estimular identificação de emoções e interpretação de expressões simples.",
    indicado: "Usa pares visuais, baixa carga textual e repetição guiada."
  },
  {
    titulo: "Caça-Sílabas",
    perfis: ["dislexia"],
    objetivo: "Reforçar leitura por blocos, combinação silábica e discriminação visual.",
    indicado: "Ideal para evoluir leitura sem pressionar velocidade."
  },
  {
    titulo: "Circuito da Atenção",
    perfis: ["tdah"],
    objetivo: "Treinar alternância de foco, tomada de decisão e autocontrole.",
    indicado: "Rodadas curtas para manter engajamento e reduzir fadiga."
  },
  {
    titulo: "Rotina Visual",
    perfis: ["tea"],
    objetivo: "Montar sequências de rotina com apoio visual e previsibilidade.",
    indicado: "Ajuda na organização diária e na compreensão de começo, meio e fim."
  },
  {
    titulo: "Som das Palavras",
    perfis: ["dislexia"],
    objetivo: "Estimular consciência fonêmica, rimas e associação entre som e grafia.",
    indicado: "Recomendado para fortalecer base de leitura e escrita."
  },
  {
    titulo: "Labirinto Calmo",
    perfis: ["tea", "tdah"],
    objetivo: "Trabalhar planejamento, tolerância à espera e resolution de problemas.",
    indicado: "Visual limpo, poucas distrações e reforço positivo por etapa."
  },
  {
    titulo: "Palavra Quebra-Cabeça",
    perfis: ["dislexia", "tdah"],
    objetivo: "Formar palavras por partes, com suporte visual e desafios progressivos.",
    indicado: "Une leitura, memória operacional e atenção seletiva."
  },
  {
    titulo: "Histórias Sociais",
    perfis: ["tea"],
    objetivo: "Simular situações sociais simples com escolhas guiadas.",
    indicado: "Reforça comunicação, contexto social e compreensão de regras."
  },
  {
    titulo: "Desafio Multissensorial",
    perfis: ["tdah", "tea", "dislexia"],
    objetivo: "Integrar som, imagem e resposta motora em desafios adaptativos.",
    indicado: "Boa opção para plano completo com trilhas personalizadas."
  }
];

function nomesPerfis() {
  return { tdah: "TDAH", tea: "TEA", dislexia: "Dislexia" };
}

function abrirJogosDoPlano(plano) {
  planoAtualJogos = plano || "basico";
  perfilAtualJogos = "todos";
  mostrarPagina("tela-jogos");
}

function filtrarJogosPorPlanoEPerfil(plano, perfil) {
  var limite = limitesJogosPorPlano[plano] || limitesJogosPorPlano.basico;
  var liberados = jogosCognify.slice(0, limite);
  if (perfil === "todos") return liberados;

  var filtrados = [];
  for (var i = 0; i < liberados.length; i++) {
    if (liberados[i].perfis.indexOf(perfil) >= 0) {
      filtrados.push(liberados[i]);
    }
  }
  return filtrados;
}

function montarTelaJogos() {
  var selectPlano = document.getElementById("filtroPlanoJogos");
  if (!selectPlano) return;

  selectPlano.value = planoAtualJogos;

  var chips = document.querySelectorAll(".chip-filtro");
  for (var c = 0; c < chips.length; c++) {
    chips[c].classList.remove("ativo");
    if (chips[c].getAttribute("data-perfil") === perfilAtualJogos) {
      chips[c].classList.add("ativo");
    }
  }

  var nomes = nomesPlanos();
  var limite = limitesJogosPorPlano[planoAtualJogos] || 4;
  var jogos = filtrarJogosPorPlanoEPerfil(planoAtualJogos, perfilAtualJogos);
  var nomesP = nomesPerfis();

  document.getElementById("resumoPlanoJogos").textContent =
    "Plano " + nomes[planoAtualJogos] + ": " + limite +
    " jogos liberados. Use os filtros para visualizar recomendações por perfil.";
  document.getElementById("qtdJogosPlano").textContent = String(limite);
  document.getElementById("qtdJogosFiltro").textContent = String(jogos.length);

  var html = "";
  if (jogos.length === 0) {
    html = '<article class="card-jogo"><h3>Nenhum jogo encontrado</h3><p>Este plano ainda não possui jogo liberado para o filtro selecionado.</p></article>';
  }

  for (var i = 0; i < jogos.length; i++) {
    var jogo = jogos[i];
    var tags = "";
    for (var t = 0; t < jogo.perfis.length; t++) {
      tags += '<span class="tag-jogo">' + nomesP[jogo.perfis[t]] + '</span>';
    }
    html +=
      '<article class="card-jogo">' +
      '<h3>' + jogo.titulo + '</h3>' +
      '<p><strong>Objetivo:</strong> ' + jogo.objetivo + '</p>' +
      '<p><strong>Indicação:</strong> ' + jogo.indicado + '</p>' +
      '<div class="tags-jogo">' + tags + '</div>' +
      '</article>';
  }

  document.getElementById("listaJogos").innerHTML = html;
}

document.getElementById("btnEntrar").onclick = function () {
  alert("No prototipo, use Criar conta para ver o fluxo completo.");
};

document.getElementById("btnCriar").onclick = function () {
  entrarCadastro("planos");
};

document.getElementById("voltarInicio1").onclick = function () {
  localStorage.removeItem(CHAVE_APOS_CADASTRO);
  mostrarPagina("tela-inicial");
};

document.getElementById("voltarCadastro").onclick = function () {
  mostrarPagina("tela-cadastro");
};

document.getElementById("btnSaibaMais").onclick = function () {
  mostrarPagina("tela-saiba-mais");
};

document.getElementById("btnAbrirJogosHome").onclick = function () {
  abrirJogosDoPlano(planoPrincipalDoCarrinho());
};

document.getElementById("voltarInicioSaibaMais").onclick = function () {
  mostrarPagina("tela-inicial");
};

document.getElementById("voltarSaibaMaisJogos").onclick = function () {
  mostrarPagina("tela-saiba-mais");
};

document.getElementById("btnAbrirCarrinhoJogos").onclick = function () {
  mostrarResumoCarrinho();
};

document.getElementById("filtroPlanoJogos").onchange = function () {
  planoAtualJogos = this.value;
  montarTelaJogos();
};

document.getElementById("btnAdicionarPlanoJogos").onclick = function () {
  adicionarPlanoNoCarrinho(planoAtualJogos);
  alert("Plano " + nomesPlanos()[planoAtualJogos] + " adicionado ao carrinho.");
};

document.getElementById("btnAcessarJogosResumo").onclick = function () {
  abrirJogosDoPlano(localStorage.getItem("cognify_plano_demo") || "basico");
};

document.body.addEventListener("click", function (ev) {
  var btnJogos = ev.target.closest(".btn-ver-jogos");
  if (btnJogos) {
    abrirJogosDoPlano(btnJogos.getAttribute("data-plano"));
    return;
  }

  var chip = ev.target.closest(".chip-filtro");
  if (chip) {
    perfilAtualJogos = chip.getAttribute("data-perfil") || "todos";
    montarTelaJogos();
  }
});

document.getElementById("btnAbrirCarrinhoSaibaMais").onclick = function () {
  mostrarResumoCarrinho();
};

document.getElementById("btnFinalizarCompra").onclick = function () {
  entrarCadastro("pagamento");
};

document.getElementById("btnAbrirCarrinho").onclick = function () {
  mostrarResumoCarrinho();
};

document.getElementById("btnAbrirCarrinhoPlanos").onclick = function () {
  mostrarResumoCarrinho();
};

document.getElementById("btnAbrirCarrinhoPagamento").onclick = function () {
  mostrarResumoCarrinho();
};

document.getElementById("voltarCadastroPagamento").onclick = function () {
  entrarCadastro("pagamento");
};

document.body.addEventListener("click", function (ev) {
  var alvo = ev.target.closest(".btn-so-carrinho");
  if (!alvo) return;
  var cod = alvo.getAttribute("data-plano");
  if (!cod) return;
  adicionarPlanoNoCarrinho(cod);
});

document.getElementById("formCadastro").onsubmit = function (e) {
  e.preventDefault();

  var nomeResp = document.getElementById("nomeResp").value.trim();
  var email = document.getElementById("email").value.trim();
  var senha = document.getElementById("senha").value;
  var nomeCrianca = document.getElementById("nomeCrianca").value.trim();
  var idade = document.getElementById("idade").value;
  var transtorno = document.getElementById("transtorno").value;

  var msg = document.getElementById("msgErroCadastro");
  msg.hidden = true;
  msg.textContent = "";

  if (!nomeResp || !email || !senha || !nomeCrianca || !idade || !transtorno) {
    msg.textContent = "Preencha todos os campos.";
    msg.hidden = false;
    return;
  }

  if (senha.length < 4) {
    msg.textContent = "A senha deve ter pelo menos 4 caracteres (regra simples do prototipo).";
    msg.hidden = false;
    return;
  }

  var dados = {
    nomeResp: nomeResp,
    email: email,
    nomeCrianca: nomeCrianca,
    idade: idade,
    transtorno: transtorno
  };
  localStorage.setItem("cognify_cadastro_demo", JSON.stringify(dados));

  var depois = localStorage.getItem(CHAVE_APOS_CADASTRO);
  localStorage.removeItem(CHAVE_APOS_CADASTRO);

  if (depois === "pagamento") {
    mostrarPagina("tela-pagamento");
  } else {
    mostrarPagina("tela-planos");
    resetPlanos();
  }
};

document.getElementById("formPagamento").onsubmit = function (e) {
  e.preventDefault();
  var err = document.getElementById("msgErroPagamento");
  err.hidden = true;
  err.textContent = "";

  if (obterCarrinho().length === 0) {
    err.textContent =
      "Não há itens no carrinho. Volte em Conheça os planos ou escolha outro fluxo.";
    err.hidden = false;
    return;
  }

  var radios = document.getElementsByName("formaPagamento");
  var escolha = "";
  for (var r = 0; r < radios.length; r++) {
    if (radios[r].checked) {
      escolha = radios[r].value;
      break;
    }
  }
  if (!escolha) {
    err.textContent = "Escolha uma forma de pagamento.";
    err.hidden = false;
    return;
  }

  var nomesPg = { pix: "PIX", cartao: "cartão de crédito", boleto: "boleto" };
  var plano = planoPrincipalDoCarrinho();
  localStorage.setItem("cognify_plano_demo", plano);
  salvarCarrinho([]);

  var cadastroStr = localStorage.getItem("cognify_cadastro_demo");
  var nomeCrianca = "a criança";
  if (cadastroStr) {
    try {
      var c = JSON.parse(cadastroStr);
      if (c.nomeCrianca) nomeCrianca = c.nomeCrianca;
    } catch (err2) {
    }
  }

  document.getElementById("textoResumo").textContent =
    "Pagamento efetuado com sucesso! " +
    "Cadastro salvo (demo). Forma de pagamento: " +
    nomesPg[escolha] +
    ". Plano: " +
    plano +
    ". Perfil de " +
    nomeCrianca +
    " registrado.";

  mostrarPagina("tela-resumo");
};

function resetPlanos() {
  planoEscolhido = null;
  var cards = document.querySelectorAll("#tela-planos .card-plano");
  for (var i = 0; i < cards.length; i++) {
    cards[i].classList.remove("selecionado");
  }
  document.getElementById("msgPlanoSelecionado").textContent =
    "Nenhum plano selecionado ainda.";
  document.getElementById("btnConfirmarPlano").disabled = true;
}

var botoesEscolher = document.querySelectorAll("#tela-planos .btn-escolher");
for (var j = 0; j < botoesEscolher.length; j++) {
  botoesEscolher[j].onclick = function () {
    var card = this.closest(".card-plano");
    if (!card) return;

    var todos = document.querySelectorAll("#tela-planos .card-plano");
    for (var k = 0; k < todos.length; k++) {
      todos[k].classList.remove("selecionado");
    }
    card.classList.add("selecionado");

    planoEscolhido = card.getAttribute("data-plano");
    var nomes = { basico: "Básico", intermediario: "Intermediário", premium: "Premium" };
    document.getElementById("msgPlanoSelecionado").textContent =
      "Plano selecionado: " + nomes[planoEscolhido] + ".";
    document.getElementById("btnConfirmarPlano").disabled = false;
  };
}

document.getElementById("btnConfirmarPlano").onclick = function () {
  if (!planoEscolhido) return;
  localStorage.setItem("cognify_plano_demo", planoEscolhido);

  salvarCarrinho([planoEscolhido]);

  mostrarPagina("tela-pagamento");
};

document.getElementById("btnRecomecar").onclick = function () {
  mostrarPagina("tela-inicial");
};

document.getElementById("btnModo").onclick = function () {
  var body = document.body;
  if (body.classList.contains("modo-escuro")) {
    body.classList.remove("modo-escuro");
    this.textContent = "Modo escuro";
  } else {
    body.classList.add("modo-escuro");
    this.textContent = "Modo claro";
  }
};

atualizarContadorCarrinho();
