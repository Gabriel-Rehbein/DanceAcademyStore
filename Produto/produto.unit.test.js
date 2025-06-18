const produto = require('./produtologica');

beforeEach(() => {
  produto.resetarProdutos();
});

test('deve adicionar um produto corretamente', () => {
  const item = produto.adicionarProduto({ nome: 'Colan', preco: 120, tipo: 'roupa' });
  expect(item).toEqual({
    id: 1,
    nome: 'Colan',
    preco: 120,
    tipo: 'roupa'
  });
});

test('deve listar todos os produtos', () => {
  produto.adicionarProduto({ nome: 'Colan', preco: 120, tipo: 'roupa' });
  const lista = produto.listarTodos();
  expect(lista.length).toBe(1);
});

test('deve buscar um produto por ID', () => {
  const novo = produto.adicionarProduto({ nome: 'Colan', preco: 120, tipo: 'roupa' });
  const buscado = produto.buscarPorId(novo.id);
  expect(buscado.nome).toBe('Colan');
});

test('buscar produto com ID inválido deve lançar erro', () => {
  expect(() => produto.buscarPorId('abc')).toThrow('ID inválido');
});

test('deve atualizar um produto existente', () => {
  const novo = produto.adicionarProduto({ nome: 'Colan', preco: 120, tipo: 'roupa' });
  const atualizado = produto.atualizarProduto(novo.id, { nome: 'Sapatilha', preco: 90, tipo: 'calçado' });
  expect(atualizado.nome).toBe('Sapatilha');
  expect(atualizado.preco).toBe(90);
});

test('atualizar com ID inválido deve lançar erro', () => {
  expect(() => produto.atualizarProduto('x', { nome: 'Teste' })).toThrow('ID inválido');
});

test('atualizar com nome inválido deve lançar erro', () => {
  const novo = produto.adicionarProduto({ nome: 'Colan', preco: 120, tipo: 'roupa' });
  expect(() => produto.atualizarProduto(novo.id, { nome: 123 })).toThrow('Nome deve ser uma string');
});

test('deve deletar um produto existente', () => {
  const novo = produto.adicionarProduto({ nome: 'Colan', preco: 120, tipo: 'roupa' });
  const sucesso = produto.deletarProduto(novo.id);
  expect(sucesso).toBe(true);
  expect(produto.listarTodos().length).toBe(0);
});

test('deletar com ID inválido deve lançar erro', () => {
  expect(() => produto.deletarProduto('xyz')).toThrow('ID inválido');
});

test('adicionar com nome ausente deve lançar erro', () => {
  expect(() => produto.adicionarProduto({ preco: 120, tipo: 'roupa' }))
    .toThrow('Nome do produto é obrigatório e deve ser uma string');
});

test('adicionar com preço inválido deve lançar erro', () => {
  expect(() => produto.adicionarProduto({ nome: 'Colan', preco: -50, tipo: 'roupa' }))
    .toThrow('Preço deve ser um número positivo');
});
