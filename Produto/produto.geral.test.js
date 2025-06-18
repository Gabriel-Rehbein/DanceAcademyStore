const request = require('supertest');
const app = require('../app');

describe('API Produtos - Loja de Ballet', () => {
  let idProduto;

  test('POST /produtos → deve criar um produto válido', async () => {
    const res = await request(app).post('/produtos').send({
      nome: 'Colan Infantil Azul',
      preco: 59.90,
      tipo: 'colan'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.nome).toBe('Colan Infantil Azul');
    idProduto = res.body.id;
  });

  test('POST /produtos → deve falhar com nome ausente', async () => {
    const res = await request(app).post('/produtos').send({
      preco: 50,
      tipo: 'colan'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.erro).toMatch(/Nome do produto/);
  });

  test('POST /produtos → deve falhar com preço negativo', async () => {
    const res = await request(app).post('/produtos').send({
      nome: 'Colan Ruim',
      preco: -10,
      tipo: 'colan'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.erro).toMatch(/Preço/);
  });

  test('GET /produtos → deve listar todos os produtos', async () => {
    const res = await request(app).get('/produtos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /produtos/:id → deve retornar um produto existente', async () => {
    const res = await request(app).get(`/produtos/${idProduto}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('nome');
  });

  test('GET /produtos/:id inválido → deve retornar erro 400', async () => {
    const res = await request(app).get('/produtos/abc');
    expect(res.statusCode).toBe(400);
    expect(res.body.erro).toBe('ID inválido');
  });

  test('PUT /produtos/:id → deve atualizar um produto existente', async () => {
    const res = await request(app).put(`/produtos/${idProduto}`).send({
      nome: 'Colan Infantil Rosa',
      preco: 64.90,
      tipo: 'colan'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.nome).toBe('Colan Infantil Rosa');
  });

  test('PUT /produtos/:id inválido → erro 400', async () => {
    const res = await request(app).put('/produtos/abc').send({
      nome: 'Erro',
      preco: 1,
      tipo: 'erro'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.erro).toBe('ID inválido');
  });

  test('DELETE /produtos/:id → deve excluir o produto', async () => {
    const res = await request(app).delete(`/produtos/${idProduto}`);
    expect(res.statusCode).toBe(204);
  });

  test('DELETE /produtos/:id inexistente → deve retornar erro 404', async () => {
    const res = await request(app).delete(`/produtos/9999`);
    expect(res.statusCode).toBe(404);
    expect(res.body.erro).toBe('Produto não encontrado');
  });

  test('DELETE /produtos/:id inválido → deve retornar erro 400', async () => {
    const res = await request(app).delete(`/produtos/xyz`);
    expect(res.statusCode).toBe(400);
    expect(res.body.erro).toBe('ID inválido');
  });
});
