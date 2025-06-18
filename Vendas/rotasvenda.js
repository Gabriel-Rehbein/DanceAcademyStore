const express = require('express');
const router = express.Router();
const venda = require('./vendalogica');
const produto = require('../Produto/produtologica');

// Middleware para atualizar produtos dinamicamente antes de qualquer rota
router.use((req, res, next) => {
  venda.setProdutosExternos(produto.listarTodos());
  next();
});

// Listar todas as vendas
router.get('/', (req, res, next) => {
  try {
    const vendas = venda.listarVendas();
    res.json(vendas);
  } catch (err) {
    next(err);
  }
});

// Buscar venda por ID
router.get('/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });

    const item = venda.buscarVendaPorId(id);
    if (!item) return res.status(404).json({ erro: 'Venda não encontrada' });

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Criar nova venda
router.post('/', (req, res, next) => {
  try {
    const dados = req.body;
    if (!dados || !Array.isArray(dados.itens) || dados.itens.length === 0) {
      return res.status(400).json({ erro: 'Venda deve conter ao menos um item' });
    }

    const resultado = venda.adicionarVenda(dados);
    if (resultado.erro) return res.status(400).json({ erro: resultado.erro });

    res.status(201).json(resultado);
  } catch (err) {
    next(err);
  }
});

// Excluir venda
router.delete('/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });

    const sucesso = venda.deletarVenda(id);
    if (!sucesso) return res.status(404).json({ erro: 'Venda não encontrada' });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
