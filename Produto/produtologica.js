let produtos = [];
let proximoId = 1;

function listarTodos() {
  return produtos;
}

function buscarPorId(id) {
  if (isNaN(id)) throw new Error('ID inválido');
  return produtos.find(p => p.id === id);
}

function adicionarProduto({ nome, preco, tipo }) {
  if (!nome || typeof nome !== 'string') {
    throw new Error('Nome do produto é obrigatório e deve ser uma string');
  }

  if (typeof preco !== 'number' || preco <= 0) {
    throw new Error('Preço deve ser um número positivo');
  }

  if (!tipo || typeof tipo !== 'string') {
    throw new Error('Tipo do produto é obrigatório e deve ser uma string');
  }

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
  if (isNaN(id)) throw new Error('ID inválido');

  const produto = buscarPorId(id);
  if (!produto) return null;

  if (dados.nome && typeof dados.nome !== 'string') {
    throw new Error('Nome deve ser uma string');
  }

  if (dados.preco !== undefined && (typeof dados.preco !== 'number' || dados.preco <= 0)) {
    throw new Error('Preço deve ser um número positivo');
  }

  if (dados.tipo && typeof dados.tipo !== 'string') {
    throw new Error('Tipo deve ser uma string');
  }

  produto.nome = dados.nome || produto.nome;
  produto.preco = dados.preco !== undefined ? dados.preco : produto.preco;
  produto.tipo = dados.tipo || produto.tipo;

  return produto;
}

function deletarProduto(id) {
  if (isNaN(id)) throw new Error('ID inválido');

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
