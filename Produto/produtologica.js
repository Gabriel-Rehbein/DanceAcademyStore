let produtos = [];
let proximoId = 1;

function listarTodos() {
  return produtos;
}

function buscarPorId(id) {
  return produtos.find(p => p.id === id);
}

function adicionarProduto({ nome, preco, tipo }) {
  const novoProduto = {
    id: proximoId++,
    nome,
    preco,
    tipo
  };
  produtos.push(novoProduto);
  return novoProduto;
}

function atualizarProduto(id, dados) {
  const produto = buscarPorId(id);
  if (!produto) return null;

  produto.nome = dados.nome;
  produto.preco = dados.preco;
  produto.tipo = dados.tipo;
  return produto;
}

function deletarProduto(id) {
  const index = produtos.findIndex(p => p.id === id);
  if (index === -1) return false;
  produtos.splice(index, 1);
  return true;
}

function resetarProdutos() {
  produtos = [];
  proximoId = 1;
}

module.exports = {
  listarTodos,
  buscarPorId,
  adicionarProduto,
  atualizarProduto,
  deletarProduto,
  resetarProdutos
};
