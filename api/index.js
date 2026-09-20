const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ============= ROTA DE TESTE =============
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// ============= ROTAS DE AUTENTICAÇÃO =============
app.post('/api/login', (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.status(400).json({ erro: 'Usuário e senha obrigatórios' });
  }

  if (usuario === 'admin' && senha === 'admin') {
    return res.json({ sucesso: true, mensagem: 'Login realizado', usuario });
  } else {
    return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
  }
});

// ============= ROTAS DE PRODUTOS =============

// GET - Listar todos os produtos
app.get('/api/produtos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar produtos' });
  }
});

// GET - Buscar produto por ID
app.get('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.json(data);
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

    const { data, error } = await supabase
      .from('produtos')
      .insert([{
        nome,
        preco_compra: parseFloat(preco_compra),
        preco_venda: parseFloat(preco_venda),
        desconto: desconto || 0
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
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

    const { data, error } = await supabase
      .from('produtos')
      .update({
        nome,
        preco_compra: parseFloat(preco_compra),
        preco_venda: parseFloat(preco_venda),
        desconto: desconto || 0
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar produto' });
  }
});

// DELETE - Excluir produto
app.delete('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.json({ mensagem: 'Produto excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao excluir produto' });
  }
});

module.exports = app;
