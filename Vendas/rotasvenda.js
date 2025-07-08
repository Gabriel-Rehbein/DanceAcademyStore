const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * tags:
 *   name: Vendas
 *   description: Rotas para gerenciamento de vendas
 */

/**
 * @swagger
 * /vendas:
 *   get:
 *     summary: Lista todas as vendas
 *     tags: [Vendas]
 *     responses:
 *       200:
 *         description: Lista de vendas retornada com sucesso
 */
router.get('/', async (req, res, next) => {
  try {
    const vendas = await pool.query('SELECT * FROM vendas ORDER BY id');
    res.json(vendas.rows);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /vendas/{id}:
 *   get:
 *     summary: Buscar venda por ID, incluindo os itens
 *     tags: [Vendas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da venda
 *     responses:
 *       200:
 *         description: Venda encontrada com seus itens
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Venda não encontrada
 */
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

/**
 * @swagger
 * /vendas:
 *   post:
 *     summary: Cadastrar uma nova venda
 *     tags: [Vendas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itens
 *             properties:
 *               cliente:
 *                 type: string
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - id_produto
 *                     - quantidade
 *                   properties:
 *                     id_produto:
 *                       type: integer
 *                     quantidade:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Venda cadastrada com sucesso
 *       400:
 *         description: Dados inválidos ou incompletos
 */
router.post('/', async (req, res, next) => {
  try {
    const dados = req.body;
    if (!dados || !Array.isArray(dados.itens) || dados.itens.length === 0) {
      return res.status(400).json({ erro: 'Venda deve conter ao menos um item' });
    }

    const result = await pool.query(
      'INSERT INTO vendas (data, cliente) VALUES (NOW(), $1) RETURNING id',
      [dados.cliente || 'Cliente padrão']
    );
    const vendaId = result.rows[0].id;

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

/**
 * @swagger
 * /vendas/{id}:
 *   delete:
 *     summary: Excluir uma venda
 *     tags: [Vendas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da venda
 *     responses:
 *       204:
 *         description: Venda excluída com sucesso
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Venda não encontrada
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });

    await pool.query('DELETE FROM itens_venda WHERE id_venda = $1', [id]);
    const result = await pool.query('DELETE FROM vendas WHERE id = $1', [id]);

    if (result.rowCount === 0)
      return res.status(404).json({ erro: 'Venda não encontrada' });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
