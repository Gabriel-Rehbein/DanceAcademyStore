const request = require('supertest');
const app = require('../app');
const pool = require('../db');

describe('API Vendas - Loja de Ballet', () => {
  let produtoId;

  beforeEach(async () => {
    // Remove os dados respeitando ordem de FK
    await pool.query('DELETE FROM itens_venda');
    await pool.query('DELETE FROM vendas');
    await pool.query('DELETE FROM produtos');

    // Insere um produto válido
    const res = await request(app).post('/produtos').send({
      nome: 'Sapatilha Infantil',
      preco: 80.00,
      tipo: 'sapatilha',
      quantidade: 50
    });
    produtoId = res.body.id;
  });

  test('POST /vendas → cria venda válida', async () => {
    const res = await request(app).post('/vendas').send({
      itens: [{ id_produto: produtoId, quantidade: 2 }],
      cliente: 'Maria'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('mensagem', 'Venda cadastrada com sucesso');
  });

  test('POST /vendas → erro ao usar produtoId inexistente', async () => {
    const res = await request(app).post('/vendas').send({
      itens: [{ id_produto: 9999, quantidade: 1 }],
      cliente: 'Fulano'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.erro).toBe('Produto não encontrado');
  });
});
