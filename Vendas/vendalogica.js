const pool = require('../db');

// Listar todas as vendas
async function listarVendas() {
  const result = await pool.query(`
    SELECT v.id, v.data, v.cliente, 
      json_agg(json_build_object(
        'id', i.id,
        'id_produto', i.id_produto,
        'quantidade', i.quantidade
      )) as itens
    FROM vendas v
    LEFT JOIN itens_venda i ON v.id = i.id_venda
    GROUP BY v.id
    ORDER BY v.id
  `);
  return result.rows;
}

// Buscar venda por ID
async function buscarVendaPorId(id) {
  if (isNaN(id)) throw new Error('ID inválido');

  const venda = await pool.query('SELECT * FROM vendas WHERE id = $1', [id]);
  if (venda.rows.length === 0) return null;

  const itens = await pool.query(
    'SELECT * FROM itens_venda WHERE id_venda = $1',
    [id]
  );

  return {
    ...venda.rows[0],
    itens: itens.rows
  };
}

// Adicionar venda
async function adicionarVenda({ itens, cliente }) {
  if (!Array.isArray(itens) || itens.length === 0) {
    throw new Error('Venda deve conter ao menos um item');
  }

  // Aceita apenas um item (MVP)
  const item = itens[0];
  const { id_produto, quantidade } = item;

  if (!id_produto || typeof id_produto !== 'number') {
    throw new Error('ID do produto é obrigatório e deve ser um número');
  }

  if (!quantidade || typeof quantidade !== 'number' || quantidade <= 0) {
    throw new Error('Quantidade deve ser um número positivo');
  }

  // Verifica se o produto existe
  const produto = await pool.query('SELECT * FROM produtos WHERE id = $1', [id_produto]);
  if (produto.rows.length === 0) {
    throw new Error('Produto não encontrado');
  }

  // cria a venda
  const novaVenda = await pool.query(
    'INSERT INTO vendas (data, cliente) VALUES (NOW(), $1) RETURNING *',
    [cliente || 'Cliente não informado']
  );

  const vendaId = novaVenda.rows[0].id;

  // registra o item
  await pool.query(
    'INSERT INTO itens_venda (id_venda, id_produto, quantidade) VALUES ($1, $2, $3)',
    [vendaId, id_produto, quantidade]
  );

  return { id: vendaId, mensagem: 'Venda cadastrada com sucesso' };
}

// Deletar venda
async function deletarVenda(id) {
  if (isNaN(id)) throw new Error('ID inválido');

  // exclui itens primeiro
  await pool.query('DELETE FROM itens_venda WHERE id_venda = $1', [id]);
  // depois exclui venda
  const result = await pool.query('DELETE FROM vendas WHERE id = $1', [id]);
  return result.rowCount > 0;
}

module.exports = {
  listarVendas,
  buscarVendaPorId,
  adicionarVenda,
  deletarVenda
};
