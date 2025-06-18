const express = require('express');
const router = express.Router();
const produto = require('./produtologica');

// Listar todos os produtos
router.get('/', (req, res, next) => {
  try {
    const lista = produto.listarTodos();
    res.json(lista);
  } catch (err) {
    next(err);
  }
});

// Buscar produto por ID
router.get('/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });

    const item = produto.buscarPorId(id);
    if (!item) return res.status(404).json({ erro: 'Produto não encontrado' });

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Adicionar novo produto
router.post('/', (req, res, next) => {
  try {
    const { nome, preco, tipo } = req.body;

    if (!nome || typeof nome !== 'string') {
      return res.status(400).json({ erro: 'Nome do produto é obrigatório e deve ser uma string' });
    }

    if (typeof preco !== 'number' || preco <= 0) {
      return res.status(400).json({ erro: 'Preço deve ser um número positivo' });
    }

    if (!tipo || typeof tipo !== 'string') {
      return res.status(400).json({ erro: 'Tipo do produto é obrigatório e deve ser uma string' });
    }

    const novo = produto.adicionarProduto({ nome, preco, tipo });
    res.status(201).json(novo);
  } catch (err) {
    next(err);
  }
});

// Atualizar produto
router.put('/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });

    const atualizado = produto.atualizarProduto(id, req.body);
    if (!atualizado) return res.status(404).json({ erro: 'Produto não encontrado' });

    res.json(atualizado);
  } catch (err) {
    next(err);
  }
});

// Deletar produto
router.delete('/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });

    const sucesso = produto.deletarProduto(id);
    if (!sucesso) return res.status(404).json({ erro: 'Produto não encontrado' });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
