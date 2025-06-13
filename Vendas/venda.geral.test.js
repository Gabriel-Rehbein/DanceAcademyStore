// Vendas/venda.geral.test.js
const request = require('supertest');
const app = require('../app');

describe('API Vendas - Loja de Ballet', () => {
  let idVenda;

  // Primeiro, cria um produto necessário para a venda
  beforeAll(async () => {
    await request(app).post('/produtos').send({
      nome: 'Sapatilha Infantil',
      preco: 80.00,
      tipo: 'sapatilha'
    });
  });

  test('POST /vendas → deve criar uma venda com produtoId existente', async () => {
    const res = await request(app).post('/vendas').send({
      produtoId: 1,
      quantidade: 2
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.total).toBeGreaterThan(0);
    idVenda = res.body.id;
  });

  test('GET /vendas → deve listar todas as vendas', async () => {
    const res = await request(app).get('/vendas');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('DELETE /vendas/:id → deve excluir a venda', async () => {
    const res = await request(app).delete(`/vendas/${idVenda}`);
    expect(res.statusCode).toBe(204);
  });

  test('POST /vendas com produto inválido → erro esperado', async () => {
    const res = await request(app).post('/vendas').send({
      produtoId: 999,
      quantidade: 1
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.erro).toBe('Produto não encontrado');
  });
});
