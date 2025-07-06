// Vendas/rotasvenda.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Listar todas as vendas
router.get('/', async (req, res, next) => {
  try {
    const vendas = await pool.query('SELECT * FROM vendas ORDER BY id');
    res.json(vendas.rows);
  } catch (err) {
    next(err);
  }
});

// Buscar venda por ID + itens
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });

    const venda = await pool.query('SELECT * FROM vendas WHERE id = $1', [id]);
    if (venda.rows.length === 0)
      return res.status(404).json({ erro: 'Venda não encontrada' });

    const itens = await pool.query(
      'SELECT * FROM itens_venda WHERE id_venda = $1',
      [id]
    );

    res.json({
      ...venda.rows[0],
      itens: itens.rows
    });
  } catch (err) {
    next(err);
  }
});

// Criar nova venda
router.post('/', async (req, res, next) => {
  try {
    const dados = req.body;
    if (!dados || !Array.isArray(dados.itens) || dados.itens.length === 0) {
      return res.status(400).json({ erro: 'Venda deve conter ao menos um item' });
    }

    // cria a venda
    const result = await pool.query(
      'INSERT INTO vendas (data, cliente) VALUES (NOW(), $1) RETURNING id',
      [dados.cliente || 'Cliente padrão']
    );
    const vendaId = result.rows[0].id;

    // cadastra itens da venda
    for (const item of dados.itens) {
      await pool.query(
        'INSERT INTO itens_venda (id_venda, id_produto, quantidade) VALUES ($1, $2, $3)',
        [vendaId, item.id_produto, item.quantidade]
      );
    }

    res.status(201).json({ mensagem: 'Venda cadastrada com sucesso', id: vendaId });
  } catch (err) {
    next(err);
  }
});

// Excluir venda
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });

    // exclui itens primeiro (FK)
    await pool.query('DELETE FROM itens_venda WHERE id_venda = $1', [id]);

    // depois exclui a venda
    const result = await pool.query('DELETE FROM vendas WHERE id = $1', [id]);

    if (result.rowCount === 0)
      return res.status(404).json({ erro: 'Venda não encontrada' });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
