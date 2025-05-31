const express = require('express');
const app = express();

// Importa as rotas
const produtoRoutes = require('./produto');
const vendaRoutes = require('./vendas');

// Middleware para tratar JSON
app.use(express.json());

// Rotas base
app.use('/produtos', produtoRoutes);
app.use('/vendas', vendaRoutes);

// Rota raiz opcional
app.get('/', (req, res) => {
  res.send('API da Loja de Ballet 🩰');
});

// Exporta para uso em testes
module.exports = app;

// Inicia servidor somente se não estiver sendo testado
if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Servidor da Loja de Ballet rodando em http://localhost:${PORT}`);
  });
}
