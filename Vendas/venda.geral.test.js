// Vendas/venda.geral.test.js
const request = require('supertest');
const app = require('../app');

describe('API Vendas - Loja de Ballet', () => {
  let idVenda;

  beforeAll(async () => {
    // Garante que um produto válido exista
    await request(app).post('/produtos').send({
      nome: 'Sapatilha Infantil',
      preco: 80.00,
      tipo: 'sapatilha'
    });
  });

  test('POST /vendas → cria venda válida', async () => {
    const res = await request(app).post('/vendas').send({
      itens: [
        { produtoId: 1, quantidade: 2 }
      ]
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.total).toBe(160);
    expect(res.body.produtoNome).toBe('Sapatilha Infantil');
    idVenda = res.body.id;
  });

  test('GET /vendas → retorna lista de vendas', async () => {
    const res = await request(app).get('/vendas');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('DELETE /vendas/:id → exclui venda existente', async () => {
    const res = await request(app).delete(`/vendas/${idVenda}`);
    expect(res.statusCode).toBe(204);
  });

  test('POST /vendas → erro ao usar produtoId inexistente', async () => {
    const res = await request(app).post('/vendas').send({
      itens: [{ produtoId: 999, quantidade: 1 }]
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.erro).toBe('Produto não encontrado');
  });

  test('POST /vendas → erro ao enviar quantidade negativa', async () => {
    const res = await request(app).post('/vendas').send({
      itens: [{ produtoId: 1, quantidade: -3 }]
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.erro).toMatch(/Quantidade/);
  });

  test('POST /vendas → erro ao omitir itens obrigatórios', async () => {
    const res = await request(app).post('/vendas').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.erro).toMatch(/Venda deve conter ao menos um item/);
  });

  test('GET /vendas/:id inválido → erro 400', async () => {
    const res = await request(app).get('/vendas/abc');
    expect(res.statusCode).toBe(400);
    expect(res.body.erro).toBe('ID inválido');
  });

  test('DELETE /vendas/:id inexistente → erro 404', async () => {
    const res = await request(app).delete('/vendas/9999');
    expect(res.statusCode).toBe(404);
    expect(res.body.erro).toBe('Venda não encontrada');
  });
});
