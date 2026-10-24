const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { neon } = require('@neondatabase/serverless');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const sql = neon(process.env.DATABASE_URL);

// O Postgres devolve bigint e numeric como texto; o front espera números
// (ex.: produto.preco_venda.toFixed(2)), como vinha do Supabase.
const formatarProduto = (row) => ({
  ...row,
  id: Number(row.id),
  preco_compra: Number(row.preco_compra),
  preco_venda: Number(row.preco_venda),
  desconto: row.desconto === null ? null : Number(row.desconto)
});

// ============= ROTA DE TESTE =============
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// ============= ROTAS DE PRODUTOS =============

// GET - Listar todos os produtos
app.get('/api/produtos', async (req, res) => {
  try {
    const rows = await sql`select * from produtos order by id asc`;
    res.json(rows.map(formatarProduto));
  } catch (err) {
    console.error('GET /api/produtos falhou:', err);
    res.status(500).json({ erro: 'Erro ao buscar produtos' });
  }
});

// GET - Buscar produto por ID
app.get('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [produto] = await sql`select * from produtos where id = ${id}`;

    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.json(formatarProduto(produto));
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar produto' });
  }
});

// POST - Criar novo produto
app.post('/api/produtos', async (req, res) => {
  try {
    const { nome, preco_compra, preco_venda, desconto } = req.body;

    if (!nome || !preco_compra || !preco_venda) {
      return res.status(400).json({ erro: 'Nome, preço de compra e preço de venda são obrigatórios' });
    }

    const [produto] = await sql`
      insert into produtos (nome, preco_compra, preco_venda, desconto)
      values (${nome}, ${parseFloat(preco_compra)}, ${parseFloat(preco_venda)}, ${desconto || 0})
      returning *
    `;

    res.status(201).json(formatarProduto(produto));
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar produto' });
  }
});

// PUT - Atualizar produto
app.put('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco_compra, preco_venda, desconto } = req.body;

    if (!nome || !preco_compra || !preco_venda) {
      return res.status(400).json({ erro: 'Nome, preço de compra e preço de venda são obrigatórios' });
    }

    const [produto] = await sql`
      update produtos
      set nome = ${nome},
          preco_compra = ${parseFloat(preco_compra)},
          preco_venda = ${parseFloat(preco_venda)},
          desconto = ${desconto || 0}
      where id = ${id}
      returning *
    `;

    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.json(formatarProduto(produto));
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar produto' });
  }
});

// DELETE - Excluir produto
app.delete('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const excluidos = await sql`delete from produtos where id = ${id} returning id`;

    if (excluidos.length === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.json({ mensagem: 'Produto excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao excluir produto' });
  }
});

module.exports = app;
