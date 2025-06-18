const venda = require('./vendalogica');

beforeEach(() => {
  venda.resetarVendas();
  venda.setProdutosExternos([
    { id: 1, nome: 'Colan', preco: 60, tipo: 'roupa' },
    { id: 2, nome: 'Sapatilha', preco: 80, tipo: 'calçado' }
  ]);
});

test('deve adicionar uma venda válida', () => {
  const resultado = venda.adicionarVenda({
    itens: [{ produtoId: 1, quantidade: 2 }]
  });
  expect(resultado).toHaveProperty('id');
  expect(resultado.total).toBe(120);
});

test('deve retornar erro ao tentar vender produto inexistente', () => {
  const resultado = venda.adicionarVenda({
    itens: [{ produtoId: 999, quantidade: 1 }]
  });
  expect(resultado.erro).toBe('Produto não encontrado');
});

test('deve retornar erro ao enviar quantidade inválida (negativa)', () => {
  const resultado = venda.adicionarVenda({
    itens: [{ produtoId: 1, quantidade: -2 }]
  });
  expect(resultado.erro).toMatch(/Quantidade/);
});

test('deve retornar erro ao enviar quantidade inválida (não numérica)', () => {
  const resultado = venda.adicionarVenda({
    itens: [{ produtoId: 1, quantidade: 'duas' }]
  });
  expect(resultado.erro).toMatch(/Quantidade/);
});

test('deve retornar erro ao enviar produtoId inválido', () => {
  const resultado = venda.adicionarVenda({
    itens: [{ produtoId: 'abc', quantidade: 1 }]
  });
  expect(resultado.erro).toMatch(/ID do produto/);
});

test('deve listar as vendas existentes', () => {
  venda.adicionarVenda({ itens: [{ produtoId: 1, quantidade: 1 }] });
  const lista = venda.listarVendas();
  expect(lista.length).toBe(1);
  expect(lista[0]).toHaveProperty('produtoNome', 'Colan');
});

test('deve deletar uma venda por ID', () => {
  const nova = venda.adicionarVenda({ itens: [{ produtoId: 2, quantidade: 1 }] });
  const sucesso = venda.deletarVenda(nova.id);
  expect(sucesso).toBe(true);
  expect(venda.listarVendas().length).toBe(0);
});

test('deletar com ID inválido deve lançar erro', () => {
  expect(() => venda.deletarVenda('xyz')).toThrow('ID inválido');
});

test('buscar venda por ID inválido deve lançar erro', () => {
  expect(() => venda.buscarVendaPorId('abc')).toThrow('ID inválido');
});
