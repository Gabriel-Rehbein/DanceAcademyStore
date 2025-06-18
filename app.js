const express = require('express');
const app = express();

const produtoRoutes = require('./Produto/rotasproduto');
const vendaRoutes = require('./Vendas/rotasvenda');

app.use(express.json());

// Rotas principais
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

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  res.status(err.status || 500).json({
    erro: err.message || 'Erro interno no servidor'
  });
});

module.exports = app;

// Inicialização do servidor
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor da Loja de Ballet rodando em http://localhost:${PORT}`);
  });
}
