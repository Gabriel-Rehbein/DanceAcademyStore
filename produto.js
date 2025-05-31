const express = require('express');
const router = express.Router();

let produtos = [];

router.get('/', (req, res) => {
  res.json(produtos);
});

router.get('/:id', (req, res) => {
  const produto = produtos.find(p => p.id === parseInt(req.params.id));
  if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
  res.json(produto);
});

router.post('/', (req, res) => {
  const { nome, preco, tipo } = req.body;
  const novoProduto = {
    id: produtos.length + 1,
    nome,
    preco,
    tipo // Ex: "sapatilha", "colan", "acessório"
  };
  produtos.push(novoProduto);
  res.status(201).json(novoProduto);
});

router.put('/:id', (req, res) => {
  const produto = produtos.find(p => p.id === parseInt(req.params.id));
  if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });

  produto.nome = req.body.nome;
  produto.preco = req.body.preco;
  produto.tipo = req.body.tipo;
  res.json(produto);
});

router.delete('/:id', (req, res) => {
  const index = produtos.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ erro: 'Produto não encontrado' });

  produtos.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
