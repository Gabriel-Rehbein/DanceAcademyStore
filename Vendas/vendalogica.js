let vendas = [];
let produtos = [];

function setProdutosExternos(listaProdutos) {
  produtos = listaProdutos;
}

function listarVendas() {
  return vendas;
}

function buscarVendaPorId(id) {
  return vendas.find(v => v.id === id);
}

function adicionarVenda({ produtoId, quantidade }) {
  const produto = produtos.find(p => p.id === produtoId);
  if (!produto) return { erro: 'Produto não encontrado' };

  const novaVenda = {
    id: vendas.length + 1,
    produtoId,
    produtoNome: produto.nome,
    tipoProduto: produto.tipo,
    precoUnitario: produto.preco,
    quantidade,
    total: produto.preco * quantidade
  };

  vendas.push(novaVenda);
  return novaVenda;
}

function deletarVenda(id) {
  const index = vendas.findIndex(v => v.id === id);
  if (index === -1) return false;
  vendas.splice(index, 1);
  return true;
}

function resetarVendas() {
  vendas = [];
}

module.exports = {
  setProdutosExternos,
  listarVendas,
  buscarVendaPorId,
  adicionarVenda,
  deletarVenda,
  resetarVendas
};
