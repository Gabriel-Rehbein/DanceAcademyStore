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

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const novaVenda = await client.query(
      'INSERT INTO vendas (data, cliente) VALUES (NOW(), $1) RETURNING id',
      [cliente || 'Cliente não informado']
    );

    const vendaId = novaVenda.rows[0].id;

    for (const item of itens) {
      const { id_produto, quantidade } = item;

      if (!id_produto || typeof id_produto !== 'number') {
        throw new Error('ID do produto inválido');
      }

      if (!quantidade || typeof quantidade !== 'number' || quantidade <= 0) {
        throw new Error('Quantidade deve ser um número positivo');
      }

      const produto = await client.query(
        'SELECT * FROM produtos WHERE id = $1',
        [id_produto]
      );

      if (produto.rowCount === 0) {
        throw new Error('Produto não encontrado');
      }

      const estoqueAtual = produto.rows[0].quantidade;

      if (estoqueAtual < quantidade) {
        throw new Error('Estoque insuficiente para o produto');
      }

      await client.query(
        'UPDATE produtos SET quantidade = quantidade - $1 WHERE id = $2',
        [quantidade, id_produto]
      );

      await client.query(
        'INSERT INTO itens_venda (id_venda, id_produto, quantidade) VALUES ($1, $2, $3)',
        [vendaId, id_produto, quantidade]
      );
    }

    await client.query('COMMIT');
    return { id: vendaId, mensagem: 'Venda cadastrada com sucesso' };

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// Deletar venda
async function deletarVenda(id) {
  if (isNaN(id)) throw new Error('ID inválido');

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Recupera itens para devolver ao estoque
    const itens = await client.query(
      'SELECT id_produto, quantidade FROM itens_venda WHERE id_venda = $1',
      [id]
    );

    for (const item of itens.rows) {
      await client.query(
        'UPDATE produtos SET quantidade = quantidade + $1 WHERE id = $2',
        [item.quantidade, item.id_produto]
      );
    }

    await client.query('DELETE FROM itens_venda WHERE id_venda = $1', [id]);
    const result = await client.query('DELETE FROM vendas WHERE id = $1', [id]);

    await client.query('COMMIT');
    return result.rowCount > 0;

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  listarVendas,
  buscarVendaPorId,
  adicionarVenda,
  deletarVenda
};
