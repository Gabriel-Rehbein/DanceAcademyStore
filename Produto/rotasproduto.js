const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Rotas para gerenciamento de produtos
 */

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 */
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM produtos ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /produtos/{id}:
 *   get:
 *     summary: Buscar produto por ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Produto não encontrado
 */
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

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Adicionar um novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - preco
 *               - tipo
 *               - quantidade
 *             properties:
 *               nome:
 *                 type: string
 *               preco:
 *                 type: number
 *               tipo:
 *                 type: string
 *               quantidade:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', async (req, res, next) => {
  try {
    const { nome, preco, tipo, quantidade } = req.body;

    if (!nome || typeof nome !== 'string') {
      return res.status(400).json({ erro: 'Nome do produto é obrigatório e deve ser uma string' });
    }

    if (typeof preco !== 'number' || preco <= 0) {
      return res.status(400).json({ erro: 'Preço deve ser um número positivo' });
    }

    if (!tipo || typeof tipo !== 'string') {
      return res.status(400).json({ erro: 'Tipo do produto é obrigatório e deve ser uma string' });
    }

    if (typeof quantidade !== 'number' || quantidade < 0) {
      return res.status(400).json({ erro: 'Quantidade deve ser um número não-negativo' });
    }

    const result = await pool.query(
      'INSERT INTO produtos (nome, preco, tipo, quantidade) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, preco, tipo, quantidade]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /produtos/{id}:
 *   put:
 *     summary: Atualizar um produto existente
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               preco:
 *                 type: number
 *               tipo:
 *                 type: string
 *               quantidade:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       400:
 *         description: ID inválido ou dados inválidos
 *       404:
 *         description: Produto não encontrado
 */
router.put('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { nome, preco, tipo, quantidade } = req.body;

    if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });

    const produto = await pool.query('SELECT * FROM produtos WHERE id = $1', [id]);
    if (produto.rows.length === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    const result = await pool.query(
      'UPDATE produtos SET nome=$1, preco=$2, tipo=$3, quantidade=$4 WHERE id=$5 RETURNING *',
      [nome || produto.rows[0].nome, preco ?? produto.rows[0].preco, tipo || produto.rows[0].tipo, quantidade ?? produto.rows[0].quantidade, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     summary: Deletar um produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Produto deletado com sucesso
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Produto não encontrado
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });

    const result = await pool.query('DELETE FROM produtos WHERE id=$1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.status(200).json({ mensagem: 'Produto deletado com sucesso' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
