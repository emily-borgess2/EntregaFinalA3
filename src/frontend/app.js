/*
  JavaScript do protótipo Cognify

  O que este arquivo faz:
  - Troca de telas (mostra/oculta .pagina)
  - Carrinho simples (salvo no localStorage)
  - Cadastro (salva dados no localStorage)
  - Pagamento simulado (resumo do carrinho + seleção de forma)

  Observação: é propositalmente simples (nível iniciante).
*/

// Troca de telas:
// - remove "ativa" de todas
// - adiciona "ativa" na tela indicada
function mostrarPagina(id) {
  var paginas = document.querySelectorAll(".pagina");
  for (var i = 0; i < paginas.length; i++) {
    paginas[i].classList.remove("ativa");
  }
  var alvo = document.getElementById(id);
  if (alvo) {
    alvo.classList.add("ativa");
  }
}

// ==========================
// Eventos da TELA INICIAL
// ==========================
document.getElementById("btnEntrar").onclick = function () {
  alert("No prototipo, use Criar conta para ver o fluxo completo.");
};

document.getElementById("btnCriar").onclick = function () {
  mostrarPagina("tela-cadastro");
};

document.getElementById("voltarInicio1").onclick = function () {
  mostrarPagina("tela-inicial");
};

document.getElementById("btnSaibaMais").onclick = function () {
  mostrarPagina("tela-saiba-mais");
};

document.getElementById("voltarInicioSaibaMais").onclick = function () {
  mostrarPagina("tela-inicial");
};
