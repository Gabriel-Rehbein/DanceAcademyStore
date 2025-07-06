const express = require('express');
const app = express();

// importa rotas
const produtoRoutes = require('./Produto/rotasproduto');
const vendaRoutes = require('./Vendas/rotasvenda');

// middlewares
app.use(express.json());

// rotas principais
app.use('/produtos', produtoRoutes);
app.use('/vendas', vendaRoutes);

// rota raiz
app.get('/', (req, res) => {
  res.send('API da Loja de Ballet 🩰');
});

// rota não encontrada
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// middleware global de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  res.status(err.status || 500).json({
    erro: err.message || 'Erro interno no servidor'
  });
});

// exporta o app
module.exports = app;

// inicialização
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor da Loja de Ballet rodando em http://localhost:${PORT}`);
  });
}
