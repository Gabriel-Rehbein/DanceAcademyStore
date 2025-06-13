const express = require('express');
const router = express.Router();
const produto = require('./produtologica');

router.get('/', (req, res) => {
  res.json(produto.listarTodos());
});

router.get('/:id', (req, res) => {
  const item = produto.buscarPorId(parseInt(req.params.id));
  if (!item) return res.status(404).json({ erro: 'Produto não encontrado' });
  res.json(item);
});

router.post('/', (req, res) => {
  const novo = produto.adicionarProduto(req.body);
  res.status(201).json(novo);
});

router.put('/:id', (req, res) => {
  const atualizado = produto.atualizarProduto(parseInt(req.params.id), req.body);
  if (!atualizado) return res.status(404).json({ erro: 'Produto não encontrado' });
  res.json(atualizado);
});

router.delete('/:id', (req, res) => {
  const sucesso = produto.deletarProduto(parseInt(req.params.id));
  if (!sucesso) return res.status(404).json({ erro: 'Produto não encontrado' });
  res.status(204).send();
});

module.exports = router;
