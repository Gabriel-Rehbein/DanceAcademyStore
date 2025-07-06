const pool = require('../db');
const venda = require('./vendalogica');

beforeEach(async () => {
  await pool.query('DELETE FROM itens_venda');
  await pool.query('DELETE FROM vendas');
  await pool.query('DELETE FROM produtos');

  // cria produtos reais no banco
  await pool.query(
    `INSERT INTO produtos (id, nome, preco, tipo)
     VALUES (1, 'Colan', 60, 'roupa'), (2, 'Sapatilha', 80, 'calçado')`
  );
});

test('deve adicionar uma venda válida', async () => {
  const resultado = await venda.adicionarVenda({
    itens: [{ id_produto: 1, quantidade: 2 }],
    cliente: 'Maria'
  });
  expect(resultado).toHaveProperty('mensagem', 'Venda cadastrada com sucesso');
  expect(resultado.id).toBeDefined();
});

test('deve retornar erro ao tentar vender produto inexistente', async () => {
  await expect(
    venda.adicionarVenda({
      itens: [{ id_produto: 999, quantidade: 1 }],
      cliente: 'Maria'
    })
  ).rejects.toThrow(/Produto não encontrado/);
});

test('deve retornar erro ao enviar quantidade negativa', async () => {
  await expect(
    venda.adicionarVenda({
      itens: [{ id_produto: 1, quantidade: -2 }],
      cliente: 'Maria'
    })
  ).rejects.toThrow(/quantidade/i);
});

test('deve listar as vendas existentes', async () => {
  await venda.adicionarVenda({
    itens: [{ id_produto: 1, quantidade: 1 }],
    cliente: 'Maria'
  });
  const lista = await venda.listarVendas();
  expect(lista.length).toBe(1);
  expect(lista[0]).toHaveProperty('id');
});

test('deve deletar uma venda existente', async () => {
  const nova = await venda.adicionarVenda({
    itens: [{ id_produto: 2, quantidade: 1 }],
    cliente: 'João'
  });
  const sucesso = await venda.deletarVenda(nova.id);
  expect(sucesso).toBe(true);
  const vendasRestantes = await venda.listarVendas();
  expect(vendasRestantes.length).toBe(0);
});
