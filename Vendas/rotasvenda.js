const express = require('express');
const router = express.Router();
const venda = require('./vendalogica');
const produto = require('../Produto/produtologica');

venda.setProdutosExternos(produto.listarTodos());

router.get('/', (req, res) => {
  res.json(venda.listarVendas());
});

router.get('/:id', (req, res) => {
  const item = venda.buscarVendaPorId(parseInt(req.params.id));
  if (!item) return res.status(404).json({ erro: 'Venda não encontrada' });
  res.json(item);
});

router.post('/', (req, res) => {
  const resultado = venda.adicionarVenda(req.body);
  if (resultado.erro) return res.status(400).json({ erro: resultado.erro });
  res.status(201).json(resultado);
});

router.delete('/:id', (req, res) => {
  const sucesso = venda.deletarVenda(parseInt(req.params.id));
  if (!sucesso) return res.status(404).json({ erro: 'Venda não encontrada' });
  res.status(204).send();
});

module.exports = router;
