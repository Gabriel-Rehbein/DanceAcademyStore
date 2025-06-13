// Vendas/venda.unit.test.js
const venda = require('./vendalogica');

beforeEach(() => {
  venda.resetarVendas();
  venda.setProdutosExternos([
    { id: 1, nome: 'Colan', preco: 60, tipo: 'roupa' },
    { id: 2, nome: 'Sapatilha', preco: 80, tipo: 'calçado' }
  ]);
});

test('deve adicionar uma venda válida', () => {
  const resultado = venda.adicionarVenda({ produtoId: 1, quantidade: 2 });
  expect(resultado).toHaveProperty('id');
  expect(resultado.total).toBe(120);
});

test('deve retornar erro ao tentar vender produto inexistente', () => {
  const resultado = venda.adicionarVenda({ produtoId: 999, quantidade: 1 });
  expect(resultado.erro).toBe('Produto não encontrado');
});

test('deve listar as vendas existentes', () => {
  venda.adicionarVenda({ produtoId: 1, quantidade: 1 });
  const lista = venda.listarVendas();
  expect(lista.length).toBe(1);
});

test('deve deletar uma venda por ID', () => {
  const nova = venda.adicionarVenda({ produtoId: 2, quantidade: 1 });
  const sucesso = venda.deletarVenda(nova.id);
  expect(sucesso).toBe(true);
  expect(venda.listarVendas().length).toBe(0);
});
