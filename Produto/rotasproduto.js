// Produto/rotasproduto.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Listar todos os produtos
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM produtos ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Buscar produto por ID
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });

    const result = await pool.query('SELECT * FROM produtos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Adicionar novo produto
router.post('/', async (req, res, next) => {
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

    const result = await pool.query(
      'INSERT INTO produtos (nome, preco, tipo) VALUES ($1, $2, $3) RETURNING *',
      [nome, preco, tipo]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Atualizar produto
router.put('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { nome, preco, tipo } = req.body;

    if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });

    const result = await pool.query(
      'UPDATE produtos SET nome=$1, preco=$2, tipo=$3 WHERE id=$4 RETURNING *',
      [nome, preco, tipo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Deletar produto
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });

    const result = await pool.query('DELETE FROM produtos WHERE id=$1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
