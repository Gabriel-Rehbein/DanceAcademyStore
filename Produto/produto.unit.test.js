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

test('deve atualizar um produto existente', () => {
  const novo = produto.adicionarProduto({ nome: 'Colan', preco: 120, tipo: 'roupa' });
  const atualizado = produto.atualizarProduto(novo.id, { nome: 'Sapatilha', preco: 90, tipo: 'calçado' });
  expect(atualizado.nome).toBe('Sapatilha');
});

test('deve deletar um produto existente', () => {
  const novo = produto.adicionarProduto({ nome: 'Colan', preco: 120, tipo: 'roupa' });
  const sucesso = produto.deletarProduto(novo.id);
  expect(sucesso).toBe(true);
  expect(produto.listarTodos().length).toBe(0);
});
