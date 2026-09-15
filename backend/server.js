const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// ============= ROTAS DE AUTENTICAÇÃO =============

app.post('/api/login', (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.status(400).json({ erro: 'Usuário e senha obrigatórios' });
  }

  db.get(
    'SELECT * FROM usuarios WHERE usuario = ? AND senha = ?',
    [usuario, senha],
    (err, row) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro no servidor' });
      }

      if (row) {
        return res.json({ sucesso: true, mensagem: 'Login realizado', usuario: row.usuario });
      } else {
        return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
      }
    }
  );
});

// ============= ROTAS DE PRODUTOS =============

// GET - Listar todos os produtos
app.get('/api/produtos', (req, res) => {
  db.all('SELECT * FROM produtos ORDER BY nome', (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar produtos' });
    }
    res.json(rows);
  });
});

// GET - Buscar produto por ID
app.get('/api/produtos/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM produtos WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar produto' });
    }

    if (!row) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.json(row);
  });
});

// POST - Criar novo produto
app.post('/api/produtos', (req, res) => {
  const { nome, preco_compra, preco_venda, desconto } = req.body;

  if (!nome || !preco_compra || !preco_venda) {
    return res.status(400).json({ erro: 'Nome, preço de compra e preço de venda são obrigatórios' });
  }

  db.run(
    'INSERT INTO produtos (nome, preco_compra, preco_venda, desconto) VALUES (?, ?, ?, ?)',
    [nome, preco_compra, preco_venda, desconto || 0],
    function (err) {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao criar produto' });
      }

      res.status(201).json({
        id: this.lastID,
        nome,
        preco_compra,
        preco_venda,
        desconto: desconto || 0
      });
    }
  );
});

// PUT - Atualizar produto
app.put('/api/produtos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, preco_compra, preco_venda, desconto } = req.body;

  if (!nome || !preco_compra || !preco_venda) {
    return res.status(400).json({ erro: 'Nome, preço de compra e preço de venda são obrigatórios' });
  }

  db.run(
    'UPDATE produtos SET nome = ?, preco_compra = ?, preco_venda = ?, desconto = ? WHERE id = ?',
    [nome, preco_compra, preco_venda, desconto || 0, id],
    function (err) {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao atualizar produto' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
      }

      res.json({ id, nome, preco_compra, preco_venda, desconto: desconto || 0 });
    }
  );
});

// DELETE - Excluir produto
app.delete('/api/produtos/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM produtos WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao excluir produto' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.json({ mensagem: 'Produto excluído com sucesso' });
  });
});

// ============= INICIAR SERVIDOR =============

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;
