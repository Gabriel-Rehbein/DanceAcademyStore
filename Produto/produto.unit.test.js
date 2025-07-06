const produto = require('./produtologica');
const pool = require('../db');

beforeEach(async () => {
  await pool.query('DELETE FROM produtos');
});

test('deve adicionar um produto corretamente', async () => {
  const item = await produto.adicionarProduto({ nome: 'Colan', preco: 120, tipo: 'roupa' });
  expect(item.nome).toBe('Colan');
  expect(item.preco).toBe(120);
});

test('deve listar todos os produtos', async () => {
  await produto.adicionarProduto({ nome: 'Colan', preco: 120, tipo: 'roupa' });
  const lista = await produto.listarTodos();
  expect(lista.length).toBe(1);
});

test('deve buscar um produto por ID', async () => {
  const novo = await produto.adicionarProduto({ nome: 'Colan', preco: 120, tipo: 'roupa' });
  const buscado = await produto.buscarPorId(novo.id);
  expect(buscado.nome).toBe('Colan');
});

test('buscar produto com ID inválido deve lançar erro', async () => {
  await expect(produto.buscarPorId('abc')).rejects.toThrow('ID inválido');
});

test('deve atualizar um produto existente', async () => {
  const novo = await produto.adicionarProduto({ nome: 'Colan', preco: 120, tipo: 'roupa' });
  const atualizado = await produto.atualizarProduto(novo.id, { nome: 'Sapatilha', preco: 90, tipo: 'calçado' });
  expect(atualizado.nome).toBe('Sapatilha');
  expect(atualizado.preco).toBe(90);
});

test('atualizar com ID inválido deve lançar erro', async () => {
  await expect(produto.atualizarProduto('x', { nome: 'Teste' })).rejects.toThrow('ID inválido');
});

test('atualizar com nome inválido deve lançar erro', async () => {
  const novo = await produto.adicionarProduto({ nome: 'Colan', preco: 120, tipo: 'roupa' });
  await expect(produto.atualizarProduto(novo.id, { nome: 123 })).rejects.toThrow('Nome deve ser uma string');
});

test('deve deletar um produto existente', async () => {
  const novo = await produto.adicionarProduto({ nome: 'Colan', preco: 120, tipo: 'roupa' });
  const sucesso = await produto.deletarProduto(novo.id);
  expect(sucesso).toBe(true);

  const lista = await produto.listarTodos();
  expect(lista.length).toBe(0);
});

test('deletar com ID inválido deve lançar erro', async () => {
  await expect(produto.deletarProduto('xyz')).rejects.toThrow('ID inválido');
});

test('adicionar com nome ausente deve lançar erro', async () => {
  await expect(produto.adicionarProduto({ preco: 120, tipo: 'roupa' }))
    .rejects.toThrow('Nome do produto é obrigatório e deve ser uma string');
});

test('adicionar com preço inválido deve lançar erro', async () => {
  await expect(produto.adicionarProduto({ nome: 'Colan', preco: -50, tipo: 'roupa' }))
    .rejects.toThrow('Preço deve ser um número positivo');
});
