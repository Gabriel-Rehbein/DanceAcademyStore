const request = require('supertest');
const app = require('./app');

describe('API Produtos - Loja de Ballet', () => {
  let idProduto;

  test('POST /produtos → deve criar um produto', async () => {
    const res = await request(app).post('/produtos').send({
      nome: 'Colan Infantil Azul',
      preco: 59.90,
      tipo: 'colan'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.nome).toBe('Colan Infantil Azul');
    idProduto = res.body.id;
  });

  test('GET /produtos → deve listar todos os produtos', async () => {
    const res = await request(app).get('/produtos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PUT /produtos/:id → deve atualizar um produto', async () => {
    const res = await request(app).put(`/produtos/${idProduto}`).send({
      nome: 'Colan Infantil Rosa',
      preco: 64.90,
      tipo: 'colan'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.nome).toBe('Colan Infantil Rosa');
  });

  test('DELETE /produtos/:id → deve excluir o produto', async () => {
    const res = await request(app).delete(`/produtos/${idProduto}`);
    expect(res.statusCode).toBe(204);
  });
});
