const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ============= DADOS EM MEMÓRIA =============
let produtos = [
  { id: 1, nome: 'Cimento CP-32 (saco 50kg)', preco_compra: 25.00, preco_venda: 35.00, desconto: 5 },
  { id: 2, nome: 'Tinta Acrílica 18L', preco_compra: 45.00, preco_venda: 75.00, desconto: 10 },
  { id: 3, nome: 'Parafuso Phillips 3/16', preco_compra: 0.50, preco_venda: 1.50, desconto: 0 },
  { id: 4, nome: 'Areia Lavada (m³)', preco_compra: 30.00, preco_venda: 50.00, desconto: 5 },
  { id: 5, nome: 'Tijolo Cerâmico 8 furos', preco_compra: 0.80, preco_venda: 1.50, desconto: 0 },
  { id: 6, nome: 'Cal Hidratada (saco 20kg)', preco_compra: 8.00, preco_venda: 15.00, desconto: 5 },
  { id: 7, nome: 'Cano PVC 100mm (metro)', preco_compra: 12.00, preco_venda: 20.00, desconto: 10 },
  { id: 8, nome: 'Telha de Barro', preco_compra: 1.50, preco_venda: 3.00, desconto: 0 }
];

let proximoId = 9;

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

  // Autenticação simples em memória
  if (usuario === 'admin' && senha === 'admin') {
    return res.json({ sucesso: true, mensagem: 'Login realizado', usuario: usuario });
  } else {
    return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
  }
});

// ============= ROTAS DE PRODUTOS =============

// GET - Listar todos os produtos
app.get('/api/produtos', (req, res) => {
  res.json(produtos);
});

// GET - Buscar produto por ID
app.get('/api/produtos/:id', (req, res) => {
  const { id } = req.params;
  const produto = produtos.find(p => p.id == id);

  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  res.json(produto);
});

// POST - Criar novo produto
app.post('/api/produtos', (req, res) => {
  const { nome, preco_compra, preco_venda, desconto } = req.body;

  if (!nome || !preco_compra || !preco_venda) {
    return res.status(400).json({ erro: 'Nome, preço de compra e preço de venda são obrigatórios' });
  }

  const novoProduto = {
    id: proximoId++,
    nome,
    preco_compra: parseFloat(preco_compra),
    preco_venda: parseFloat(preco_venda),
    desconto: desconto || 0
  };

  produtos.push(novoProduto);
  res.status(201).json(novoProduto);
});

// PUT - Atualizar produto
app.put('/api/produtos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, preco_compra, preco_venda, desconto } = req.body;

  if (!nome || !preco_compra || !preco_venda) {
    return res.status(400).json({ erro: 'Nome, preço de compra e preço de venda são obrigatórios' });
  }

  const produto = produtos.find(p => p.id == id);

  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  produto.nome = nome;
  produto.preco_compra = parseFloat(preco_compra);
  produto.preco_venda = parseFloat(preco_venda);
  produto.desconto = desconto || 0;

  res.json(produto);
});

// DELETE - Excluir produto
app.delete('/api/produtos/:id', (req, res) => {
  const { id } = req.params;
  const index = produtos.findIndex(p => p.id == id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  produtos.splice(index, 1);
  res.json({ mensagem: 'Produto excluído com sucesso' });
});

module.exports = app;
