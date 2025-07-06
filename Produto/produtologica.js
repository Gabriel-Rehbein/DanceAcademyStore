// Produto/produtologica.js
const pool = require('../db');

// Listar todos os produtos
async function listarTodos() {
  const result = await pool.query('SELECT * FROM produtos ORDER BY id');
  return result.rows;
}

// Buscar por ID
async function buscarPorId(id) {
  if (isNaN(id)) throw new Error('ID inválido');

  const result = await pool.query('SELECT * FROM produtos WHERE id = $1', [id]);
  return result.rows[0] || null;
}

// Adicionar produto
async function adicionarProduto({ nome, preco, tipo }) {
  if (!nome || typeof nome !== 'string') {
    throw new Error('Nome do produto é obrigatório e deve ser uma string');
  }

  if (typeof preco !== 'number' || preco <= 0) {
    throw new Error('Preço deve ser um número positivo');
  }

  if (!tipo || typeof tipo !== 'string') {
    throw new Error('Tipo do produto é obrigatório e deve ser uma string');
  }

  const result = await pool.query(
    'INSERT INTO produtos (nome, preco, tipo) VALUES ($1, $2, $3) RETURNING *',
    [nome, preco, tipo]
  );
  return result.rows[0];
}

// Atualizar produto
async function atualizarProduto(id, dados) {
  if (isNaN(id)) throw new Error('ID inválido');

  const produtoAtual = await buscarPorId(id);
  if (!produtoAtual) return null;

  const nome = dados.nome || produtoAtual.nome;
  const preco = dados.preco !== undefined ? dados.preco : produtoAtual.preco;
  const tipo = dados.tipo || produtoAtual.tipo;

  if (typeof nome !== 'string') throw new Error('Nome deve ser uma string');
  if (typeof preco !== 'number' || preco <= 0) throw new Error('Preço deve ser um número positivo');
  if (typeof tipo !== 'string') throw new Error('Tipo deve ser uma string');

  const result = await pool.query(
    'UPDATE produtos SET nome=$1, preco=$2, tipo=$3 WHERE id=$4 RETURNING *',
    [nome, preco, tipo, id]
  );
  return result.rows[0];
}

// Deletar produto
async function deletarProduto(id) {
  if (isNaN(id)) throw new Error('ID inválido');

  const result = await pool.query('DELETE FROM produtos WHERE id=$1', [id]);
  return result.rowCount > 0;
}

module.exports = {
  listarTodos,
  buscarPorId,
  adicionarProduto,
  atualizarProduto,
  deletarProduto
};
