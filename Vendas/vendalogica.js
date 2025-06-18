let vendas = [];
let produtos = [];

function setProdutosExternos(listaProdutos) {
  produtos = listaProdutos || [];
}

function listarVendas() {
  return vendas;
}

function buscarVendaPorId(id) {
  if (isNaN(id)) throw new Error('ID inválido');
  return vendas.find(v => v.id === id);
}

function adicionarVenda({ itens }) {
  if (!Array.isArray(itens) || itens.length === 0) {
    return { erro: 'Venda deve conter ao menos um item' };
  }

  const item = itens[0]; // MVP: aceita apenas um item por venda
  const { produtoId, quantidade } = item;

  if (!produtoId || typeof produtoId !== 'number') {
    return { erro: 'ID do produto é obrigatório e deve ser um número' };
  }

  if (!quantidade || typeof quantidade !== 'number' || quantidade <= 0) {
    return { erro: 'Quantidade deve ser um número positivo' };
  }

  const produto = produtos.find(p => p.id === produtoId);
  if (!produto) {
    return { erro: 'Produto não encontrado' };
  }

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
  if (isNaN(id)) throw new Error('ID inválido');

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
