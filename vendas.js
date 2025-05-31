const express = require('express');
const router = express.Router();

let vendas = [];
let produtos = require('./produto_data');

router.get('/', (req, res) => {
  res.json(vendas);
});

router.get('/:id', (req, res) => {
  const venda = vendas.find(v => v.id === parseInt(req.params.id));
  if (!venda) return res.status(404).json({ erro: 'Venda não encontrada' });
  res.json(venda);
});

router.post('/', (req, res) => {
  const { produtoId, quantidade } = req.body;
  const produto = produtos.find(p => p.id === produtoId);
  if (!produto) return res.status(400).json({ erro: 'Produto não encontrado' });

  const novaVenda = {
    id: vendas.length + 1,
    produtoId,
    produtoNome: produto.nome,
    tipoProduto: produto.tipo,
    precoUnitario: produto.preco,
    quantidade,
    total: produto.preco * quantidade
  };

  vendas.push(novaVenda);
  res.status(201).json(novaVenda);
});

router.delete('/:id', (req, res) => {
  const index = vendas.findIndex(v => v.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ erro: 'Venda não encontrada' });

  vendas.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
