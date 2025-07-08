const express = require('express');
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path'); // <-- Correto aqui, fora do objeto

// Configuração do Swagger
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API da Loja de Ballet',
      version: '1.0.0',
      description: 'Documentação da API com Swagger',
    },
  },
  apis: [
    path.join(__dirname, 'Produto/*.js'),
    path.join(__dirname, 'Vendas/*.js')
  ],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middlewares
app.use(express.json());

// Rotas
const produtoRoutes = require('./Produto/rotasproduto');
const vendaRoutes = require('./Vendas/rotasvenda');

app.use('/produtos', produtoRoutes);
app.use('/vendas', vendaRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.send('API da Loja de Ballet 🩰');
});

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  res.status(err.status || 500).json({
    erro: err.message || 'Erro interno no servidor'
  });
});

// Exporta app
module.exports = app;

// Inicialização
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor da Loja de Ballet rodando em http://localhost:${PORT}`);
    console.log(`Documentação Swagger disponível em http://localhost:${PORT}/api-docs`);
  });
}
