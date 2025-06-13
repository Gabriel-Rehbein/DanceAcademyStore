const express = require('express');
const app = express();

const produtoRoutes = require('./Produto/rotasproduto');
const vendaRoutes = require('./Vendas/rotasvenda');

app.use(express.json());

app.use('/produtos', produtoRoutes);
app.use('/vendas', vendaRoutes);

app.get('/', (req, res) => {
  res.send('API da Loja de Ballet 🩰');
});

module.exports = app;

if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Servidor da Loja de Ballet rodando em http://localhost:${PORT}`);
  });
}
